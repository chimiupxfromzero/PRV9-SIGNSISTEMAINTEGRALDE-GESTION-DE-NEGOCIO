import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      const { message, contextData, systemInstruction } = req.body;
      const ai = getGeminiAI();

      const defaultSystem = `Eres el Asistente Inteligente de PV9 ERP+POS, un sistema integral de punto de venta e inventario para negocios en México.
Conoces perfectamente el estado actual del negocio recibido en el contexto (ventas del día, inventarios, alertas de stock bajo, gastos, nómina, facturas CFDI 4.0 pendientes).
Tus respuestas deben ser claras, amables, profesionales y ejecutivas.
Cuando el usuario te pida reportes, análisis o acciones, usa los datos proporcionados para ofrecer resúmenes numéricos precisos, tablas breves o recomendaciones estratégicas para mejorar las ventas y reducir pérdidas.
Respuestas en formato Markdown limpio.`;

      const prompt = `[CONTEXTO ACTUAL DEL SISTEMA]:
${JSON.stringify(contextData || {}, null, 2)}

[MENSAJE DEL USUARIO]:
${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || defaultSystem,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || "No se obtuvo respuesta del modelo de IA." });
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
