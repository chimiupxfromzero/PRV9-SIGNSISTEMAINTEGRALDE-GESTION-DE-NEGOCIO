import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper for Gemini AI instance
  function getGeminiAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY non set in process.env");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "PV9 ERP+POS", timestamp: new Date().toISOString() });
  });

  // AI Assistant Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, prompt, contextData, systemInstruction, aiSettings } = req.body;
      const userPrompt = prompt || message || "";

      const mode = aiSettings?.mode || "CLOUD_GEMINI";
      const selectedModel = aiSettings?.selectedModel || "gemini-3.6-flash";
      const customApiKey = aiSettings?.customApiKey || "";
      const ggufEndpoint = aiSettings?.ggufEndpoint || "http://localhost:11434";
      const ggufModelName = aiSettings?.ggufModelName || "llama3.2:3b";

      const defaultSystem = `Eres el Asistente Inteligente Aarix de PV9 ERP+POS, un sistema integral de punto de venta e inventario para negocios en México.
Conoces perfectamente el estado actual del negocio recibido en el contexto (ventas del día, inventarios, alertas de stock bajo, gastos, nómina, facturas CFDI 4.0 pendientes).
Tus respuestas deben ser claras, amables, profesionales y ejecutivas.
Cuando el usuario te pida reportes, análisis o acciones, usa los datos proporcionados para ofrecer resúmenes numéricos precisos, tablas breves o recomendaciones estratégicas para mejorar las ventas y reducir pérdidas.
Respuestas en formato Markdown limpio.`;

      const fullPrompt = `[CONTEXTO ACTUAL DEL SISTEMA]:
${JSON.stringify(contextData || {}, null, 2)}

[INSTRUCCIÓN / PREGUNTA DEL USUARIO]:
${userPrompt}`;

      // 1. LOCAL OLLAMA / GGUF
      if (mode === "LOCAL_GGUF" || aiSettings?.provider === "ollama") {
        try {
          const endpointUrl = `${ggufEndpoint.replace(/\/$/, "")}/api/generate`;
          const ollamaRes = await fetch(endpointUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: ggufModelName,
              prompt: `${defaultSystem}\n\n${fullPrompt}`,
              stream: false,
            }),
          });

          if (!ollamaRes.ok) {
            throw new Error(`El servidor Ollama/GGUF local respondió con estado HTTP ${ollamaRes.status}`);
          }

          const ollamaData = await ollamaRes.json();
          return res.json({
            reply: ollamaData.response || "Sin respuesta del modelo local GGUF.",
            text: ollamaData.response || "Sin respuesta del modelo local GGUF.",
            source: "LOCAL_OLLAMA",
          });
        } catch (err: any) {
          console.warn("Ollama local error:", err.message);
          return res.status(500).json({
            error: `Error al conectar con servidor local Ollama (${ggufEndpoint}): ${err.message}. Verifique que Ollama esté corriendo localmente.`,
          });
        }
      }

      // 2. OPENROUTER FREE / GROQ
      if (mode === "OPENROUTER_FREE" || mode === "GROQ_FREE") {
        const apiKey = customApiKey || process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY;
        const targetUrl =
          mode === "GROQ_FREE"
            ? "https://api.groq.com/openai/v1/chat/completions"
            : "https://openrouter.ai/api/v1/chat/completions";

        if (!apiKey) {
          return res.status(400).json({
            error: "Se requiere un API Key de OpenRouter o Groq. Ingrese su clave en la pestaña de Configuración de IA.",
          });
        }

        const openRouterRes = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: selectedModel || (mode === "GROQ_FREE" ? "llama-3.2-3b-preview" : "meta-llama/llama-3.2-3b-instruct:free"),
            messages: [
              { role: "system", content: systemInstruction || defaultSystem },
              { role: "user", content: fullPrompt },
            ],
          }),
        });

        const routerData = await openRouterRes.json();
        if (!openRouterRes.ok) {
          throw new Error(routerData.error?.message || "Error al conectar con la API de modelos libres.");
        }

        const reply = routerData.choices?.[0]?.message?.content || "Sin respuesta recibida.";
        return res.json({ reply, text: reply, source: mode });
      }

      // 3. GOOGLE GEMINI (DEFAULT / STUDIO KEY OR CUSTOM KEY)
      const apiKey = customApiKey || process.env.GEMINI_API_KEY || "";
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });

      const response = await ai.models.generateContent({
        model: selectedModel || "gemini-3.6-flash",
        contents: fullPrompt,
        config: {
          systemInstruction: systemInstruction || defaultSystem,
          temperature: aiSettings?.temperature || 0.7,
        },
      });

      const replyText = response.text || "No se obtuvo respuesta del modelo Gemini de IA.";
      res.json({ reply: replyText, text: replyText, source: "CLOUD_GEMINI" });
    } catch (error: any) {
      console.error("Error in /api/ai/chat:", error);
      res.status(500).json({ error: error?.message || "Error al procesar la consulta con IA." });
    }
  });

  // AI Voice Text-To-Speech endpoint
  app.post("/api/ai/tts", async (req, res) => {
    try {
      const { text, voiceName = "Kore" } = req.body;
      if (!text) {
        return res.status(400).json({ error: "El texto es requerido para TTS." });
      }

      const ai = getGeminiAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Lee con voz natural y fluida en español mexicano: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ audioBase64: base64Audio, mimeType: "audio/pcm;rate=24000" });
      } else {
        res.status(500).json({ error: "No se generó el audio de voz." });
      }
    } catch (error: any) {
      console.error("Error in /api/ai/tts:", error);
      res.status(500).json({ error: error?.message || "Error al sintetizar voz." });
    }
  });

  // CFDI 4.0 Timbrado PAC Mock API
  app.post("/api/cfdi/stamp", async (req, res) => {
    try {
      const { invoiceData, isConnected } = req.body;
      if (!isConnected) {
        return res.status(400).json({
          error: "Conexión a internet aislada para CFDI desactivada. Conecte de forma segura para timbrar.",
        });
      }

      // Simulate PAC response with UUID and Timbre Fiscal Digital
      const uuid = "PV9-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "-" + Date.now();
      const folio = invoiceData.folio || "F-" + Math.floor(1000 + Math.random() * 9000);
      const fechaTimbrado = new Date().toISOString();

      const xmlSample = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0" Folio="${folio}" Fecha="${fechaTimbrado}" SubTotal="${invoiceData.subtotal}" Total="${invoiceData.total}" Moneda="MXN" TipoDeComprobante="I" Exportacion="01" LugarExpedicion="${invoiceData.emisorCP || "06000"}">
  <cfdi:Emisor Rfc="${invoiceData.emisorRFC}" Nombre="${invoiceData.emisorNombre}" RegimenFiscal="${invoiceData.emisorRegimen}"/>
  <cfdi:Receptor Rfc="${invoiceData.receptorRFC}" Nombre="${invoiceData.receptorNombre}" DomicilioFiscalReceptor="${invoiceData.receptorCP}" RegimenFiscalReceptor="${invoiceData.receptorRegimen}" UsoCFDI="${invoiceData.usoCFDI}"/>
  <cfdi:Conceptos>
    ${(invoiceData.items || []).map((i: any) => `<cfdi:Concepto ClaveProdServ="${i.claveSAT || "84111506"}" Cantidad="${i.cantidad}" ClaveUnidad="H87" Descripcion="${i.descripcion}" ValorUnitario="${i.precioUnitario}" Importe="${i.importe}"/>`).join("\n    ")}
  </cfdi:Conceptos>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1" UUID="${uuid}" FechaTimbrado="${fechaTimbrado}" SelloSAT="SAT1234567890XYZ==" NoCertificadoSAT="00001000000504465028"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`;

      res.json({
        success: true,
        uuid,
        folio,
        fechaTimbrado,
        status: "TIMBRADO",
        xmlContent: xmlSample,
        message: "Comprobante CFDI 4.0 timbrado exitosamente con PAC autorizados.",
      });
    } catch (err: any) {
      res.status(500).json({ error: "Error al procesar timbrado CFDI." });
    }
  });

  // Cloud Backup Simulation API
  app.post("/api/backup/cloud", async (req, res) => {
    try {
      const { provider, dbSnapshot } = req.body;
      const backupId = `backup_${provider.toLowerCase()}_${Date.now()}`;
      res.json({
        success: true,
        backupId,
        provider,
        timestamp: new Date().toISOString(),
        sizeKb: Math.round(JSON.stringify(dbSnapshot || {}).length / 1024),
        message: `Copia de seguridad guardada exitosamente en ${provider}.`,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Error al sincronizar respaldo en la nube." });
    }
  });

  // Serve Frontend via Vite (Dev) or Static (Prod)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PV9 ERP+POS] Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
