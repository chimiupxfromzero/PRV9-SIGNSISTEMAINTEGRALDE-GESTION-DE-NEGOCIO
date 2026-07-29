export type ModuleId =
  | "dashboard"
  | "pos"
  | "inventory"
  | "inventario"
  | "customers"
  | "clientes"
  | "payroll"
  | "nomina"
  | "expenses"
  | "gastos"
  | "suppliers"
  | "proveedores"
  | "cfdi"
  | "reimbursements"
  | "reimpresion"
  | "users"
  | "usuarios"
  | "ai_assistant"
  | "asistente_ia"
  | "config"
  | "configuracion"
  | "themes"
  | "temas"
  | "respaldos"
  | "lotes_caducidad"
  | "pedidos_proveedores"
  | "companion_movil";

export type UserRole = "ADMINISTRADOR" | "GERENTE" | "CAJERO" | "INVENTARISTA" | "ADMIN";

export interface UserPermission {
  role: UserRole;
  roleName?: string;
  allowedModules: ModuleId[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  active: boolean;
  pin?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  unit: string;
  satClaveProdServ?: string;
  satClaveUnidad?: string;
  active: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "ENTRADA" | "SALIDA" | "VENTA" | "DEVOLUCION" | "AJUSTE_INVENTARIO";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
  userId: string;
  userName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  total: number;
}

export type PaymentMethod = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "MIXTO";

export interface PaymentBreakdown {
  method: PaymentMethod;
  amount: number;
}

export interface Sale {
  id: string;
  folio: string;
  timestamp: string;
  items: CartItem[];
  subtotal: number;
  taxIVA: number;
  discountTotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  payments?: PaymentBreakdown[];
  amountReceived?: number;
  changeGiven?: number;
  customerId?: string;
  customerName?: string;
  cashierId: string;
  cashierName: string;
  status: "COMPLETADA" | "CANCELADA" | "FACTURADA";
  cfdiUuid?: string;
  corteCajaId?: string;
}

export interface Refund {
  id: string;
  folio: string;
  saleId: string;
  saleFolio: string;
  timestamp: string;
  amount: number;
  reason: string;
  returnedToStock: boolean;
  processedBy: string;
}

export interface CorteCaja {
  id: string;
  cashierId: string;
  cashierName: string;
  openTimestamp: string;
  closeTimestamp?: string;
  initialCash: number;
  salesCash: number;
  salesCard: number;
  salesTransfer: number;
  expectedTotal: number;
  actualCashInRegister?: number;
  difference?: number;
  status: "ABIERTA" | "CERRADA";
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  postalCode: string;
  email: string;
  phone: string;
  address?: string;
  usoCFDI?: string;
  creditLimit: number;
  currentCreditDebt: number;
  salesCount: number;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  curp: string;
  rfc: string;
  nss?: string;
  position: string;
  department: string;
  baseSalary: number;
  salaryFrequency: "SEMANAL" | "QUINCENAL" | "MENSUAL";
  hireDate: string;
  active: boolean;
}

export interface PayStub {
  id: string;
  employeeId: string;
  employeeName: string;
  periodStart: string;
  periodEnd: string;
  baseSalary: number;
  overtimeHours: number;
  overtimePay: number;
  bonuses: number;
  deductionsIMSS: number;
  deductionsISR: number;
  otherDeductions: number;
  netPay: number;
  paidDate: string;
  status: "PAGADO" | "PENDIENTE";
}

export interface Expense {
  id: string;
  folio: string;
  date: string;
  description: string;
  category: "RENTA" | "SERVICIOS" | "INSUMOS" | "MANTENIMIENTO" | "NOMINA" | "PROVEEDORES" | "OTRO";
  amount: number;
  paymentMethod: PaymentMethod;
  supplierId?: string;
  supplierName?: string;
  receiptAttachment?: string;
  notes?: string;
  createdBy: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  rfc: string;
  address?: string;
  balanceDue: number;
  suppliedCategories?: string[];
  active: boolean;
}

export interface CFDIInvoice {
  id: string;
  folio: string;
  saleId: string;
  uuid: string;
  fechaEmision: string;
  emisorRFC: string;
  emisorNombre: string;
  emisorRegimen: string;
  emisorCP: string;
  receptorRFC: string;
  receptorNombre: string;
  receptorRegimen: string;
  receptorCP: string;
  usoCFDI: string;
  subtotal: number;
  taxIVA: number;
  total: number;
  status: "TIMBRADO" | "PENDIENTE" | "CANCELADO";
  xmlContent?: string;
  pdfGenerated?: boolean;
}

export interface CFDISettings {
  csdCertificateLoaded: boolean;
  csdCertificateNumber: string;
  pacProviderName: string;
  pacEnvironment: "PRUEBAS" | "PRODUCCION";
  defaultEmisorRFC: string;
  defaultEmisorNombre: string;
  defaultEmisorRegimen: string;
  defaultEmisorCP: string;
  isolatedConnectionMode: boolean;
  isOnlineForStamping: boolean;
}

export interface CloudBackupConfig {
  enabled: boolean;
  provider: "Dropbox" | "Google Drive" | "OneDrive";
  accountConnected: boolean;
  accountEmail?: string;
  autoBackupIntervalMinutes: number;
  lastBackupDate?: string;
  lastBackupStatus?: "EXITO" | "ERROR" | "PENDIENTE";
}

export interface CloudBackupLog {
  id: string;
  provider: string;
  timestamp: string;
  sizeKb: number;
  status: "EXITO" | "ERROR";
  fileName: string;
}

export interface ProductBatch {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  expirationDate: string;
  quantity: number;
  initialQuantity: number;
  cost: number;
  supplierName?: string;
  status: "ACTIVO" | "POR_CADUCAR" | "CADUCADO" | "AGOTADO";
  receivedDate: string;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  folio: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: "BORRADOR" | "SOLICITADO" | "PARCIAL" | "RECIBIDO" | "CANCELADO";
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  receivedDate?: string;
}

export interface AIAssistantSettings {
  modelType: "starter_local_gguf" | "gemini_flash_cloud";
  localModelName: "Llama-3.2-3B-Instruct-GGUF" | "Mistral-7B-PV9-Local" | "Phi-3-Mini-GGUF";
  voiceOutputEnabled: boolean;
  autoReadVoice: boolean;
  voiceName: "Kore" | "Puck" | "Zephyr" | "Fenrir" | "Charon";
  systemBehaviorPrompt: string;
  temperature: number;
  embeddedPermissions: {
    canQuerySales: boolean;
    canQueryInventory: boolean;
    canLogExpenses: boolean;
    canCreateReports: boolean;
  };
}

export interface AIMessage {
  id: string;
  sender: "USER" | "AI" | "SYSTEM";
  text: string;
  timestamp: string;
  actionTaken?: string;
  audioUrl?: string;
}

export interface SystemNotification {
  id: string;
  type: "STOCK_BAJO" | "CREDITO_PENDIENTE" | "CFDI_PENDIENTE" | "BACKUP_ALERTA" | "CADUCIDAD_LOTE" | "SISTEMA";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLink?: ModuleId;
}

export interface BusinessConfig {
  businessName: string;
  rfc: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  logoUrl?: string;
  currencySymbol: string;
  defaultTaxIVA: number;
  ticketFooterMessage: string;
  printerName: string;
  autoPrintReceipt: boolean;
  cloudBackupProvider: "GOOGLE_DRIVE" | "DROPBOX" | "ONEDRIVE";
  backupIntervalHours: number;
}

export type ThemeName = "claro_elegante" | "oscuro_ejecutivo" | "esmeralda_comercial" | "azul_corporativo" | "pizarra";

export interface ThemeConfig {
  theme: ThemeName;
  fontSize: "normal" | "large";
  compactMode: boolean;
}

export interface AISettings {
  mode: "CLOUD_GEMINI" | "LOCAL_GGUF";
  ggufEndpoint: string;
  ggufModelName: string;
  temperature: number;
  contextWindow: number;
}
