import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  ModuleId,
  Product,
  Category,
  StockMovement,
  Sale,
  Refund,
  Customer,
  Employee,
  PayStub,
  Expense,
  Supplier,
  CFDIInvoice,
  CFDISettings,
  CloudBackupConfig,
  CloudBackupLog,
  AIAssistantSettings,
  BusinessConfig,
  ThemeConfig,
  SystemNotification,
  CorteCaja,
  UserPermission,
  CartItem,
  PaymentMethod,
  ProductBatch,
  PurchaseOrder,
} from "../types";

import {
  INITIAL_USERS,
  DEFAULT_PERMISSIONS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_EMPLOYEES,
  INITIAL_PAYSTUBS,
  INITIAL_SUPPLIERS,
  INITIAL_EXPENSES,
  INITIAL_SALES,
  INITIAL_CFDI_INVOICES,
  INITIAL_BUSINESS_CONFIG,
  INITIAL_CFDI_SETTINGS,
  INITIAL_BACKUP_CONFIG,
  INITIAL_AI_SETTINGS,
  INITIAL_THEME_CONFIG,
  INITIAL_BATCHES,
  INITIAL_PURCHASE_ORDERS,
} from "../data/initialData";

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  userPermissions: UserPermission[];
  activeModule: ModuleId;
  setActiveModule: (mod: ModuleId) => void;

  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  enabledModules: ModuleId[];
  toggleModuleEnabled: (mod: ModuleId) => void;

  currentTheme: string;
  setTheme: (theme: string) => void;

  products: Product[];
  categories: Category[];
  stockMovements: StockMovement[];
  sales: Sale[];
  refunds: Refund[];
  customers: Customer[];
  employees: Employee[];
  payStubs: PayStub[];
  expenses: Expense[];
  suppliers: Supplier[];
  cfdiInvoices: CFDIInvoice[];
  batches: ProductBatch[];
  purchaseOrders: PurchaseOrder[];
  cfdiSettings: CFDISettings;
  backupConfig: CloudBackupConfig;
  backupLogs: CloudBackupLog[];
  aiSettings: AIAssistantSettings;
  businessConfig: BusinessConfig;
  themeConfig: ThemeConfig;
  notifications: SystemNotification[];
  currentCorteCaja: CorteCaja | null;

  // Actions
  switchUserByPin: (pin: string) => boolean;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, quantity: number, type: "ENTRADA" | "SALIDA" | "AJUSTE_INVENTARIO", reason: string) => void;

  addCategory: (cat: Omit<Category, "id">) => void;

  addSale: (items: CartItem[], paymentMethod: PaymentMethod, amountReceived: number, customerId?: string) => Sale;
  cancelSale: (saleId: string, reason: string) => void;
  processRefund: (saleId: string, reason: string, returnToStock: boolean) => Refund;

  addCustomer: (cust: Omit<Customer, "id" | "createdAt" | "salesCount" | "currentCreditDebt">) => void;
  updateCustomer: (cust: Customer) => void;

  addEmployee: (emp: Omit<Employee, "id">) => void;
  addPayStub: (stub: Omit<PayStub, "id">) => void;

  addExpense: (exp: Omit<Expense, "id" | "folio">) => void;

  addSupplier: (supp: Omit<Supplier, "id">) => void;
  updateSupplier: (supp: Supplier) => void;

  addBatch: (batch: Omit<ProductBatch, "id">) => void;
  updateBatch: (batch: ProductBatch) => void;
  deleteBatch: (id: string) => void;

  addPurchaseOrder: (po: Omit<PurchaseOrder, "id" | "folio">) => void;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder["status"]) => void;
  receivePurchaseOrder: (id: string) => void;

  stampCFDI: (saleId: string) => Promise<CFDIInvoice | null>;
  updateCFDISettings: (settings: Partial<CFDISettings>) => void;

  addUser: (user: Omit<User, "id">) => void;
  updateUser: (user: User) => void;

  updateBusinessConfig: (cfg: Partial<BusinessConfig>) => void;
  updateBackupConfig: (cfg: Partial<CloudBackupConfig>) => void;
  updateAISettings: (cfg: Partial<AIAssistantSettings>) => void;
  updateThemeConfig: (cfg: Partial<ThemeConfig>) => void;

  openCorteCaja: (initialCash: number) => void;
  closeCorteCaja: (actualCash: number, notes?: string) => void;

  triggerManualBackup: () => Promise<boolean>;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  queryAIAssistant: (userMessage: string) => Promise<{ text: string; audioBase64?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialData
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("pv9_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users[0] || INITIAL_USERS[0];
  });

  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("pv9_categories");
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("pv9_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem("pv9_stockMovements");
    return saved ? JSON.parse(saved) : [];
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem("pv9_sales");
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("pv9_customers");
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("pv9_employees");
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [payStubs, setPayStubs] = useState<PayStub[]>(() => {
    const saved = localStorage.getItem("pv9_payStubs");
    return saved ? JSON.parse(saved) : INITIAL_PAYSTUBS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("pv9_expenses");
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem("pv9_suppliers");
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [cfdiInvoices, setCfdiInvoices] = useState<CFDIInvoice[]>(() => {
    const saved = localStorage.getItem("pv9_cfdiInvoices");
    return saved ? JSON.parse(saved) : INITIAL_CFDI_INVOICES;
  });

  const [cfdiSettings, setCfdiSettings] = useState<CFDISettings>(() => {
    const saved = localStorage.getItem("pv9_cfdiSettings");
    return saved ? JSON.parse(saved) : INITIAL_CFDI_SETTINGS;
  });

  const [backupConfig, setBackupConfig] = useState<CloudBackupConfig>(() => {
    const saved = localStorage.getItem("pv9_backupConfig");
    return saved ? JSON.parse(saved) : INITIAL_BACKUP_CONFIG;
  });

  const [backupLogs, setBackupLogs] = useState<CloudBackupLog[]>(() => {
    const saved = localStorage.getItem("pv9_backupLogs");
    return saved ? JSON.parse(saved) : [
      {
        id: "b1",
        provider: "Dropbox",
        timestamp: new Date().toISOString(),
        sizeKb: 240,
        status: "EXITO",
        fileName: "pv9_backup_auto.json",
      },
    ];
  });

  const [aiSettings, setAiSettings] = useState<AIAssistantSettings>(() => {
    const saved = localStorage.getItem("pv9_aiSettings");
    return saved ? JSON.parse(saved) : INITIAL_AI_SETTINGS;
  });

  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => {
    const saved = localStorage.getItem("pv9_businessConfig");
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_CONFIG;
  });

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem("pv9_themeConfig");
    return saved ? JSON.parse(saved) : INITIAL_THEME_CONFIG;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem("pv9_notifications");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "n-1",
            type: "STOCK_BAJO",
            title: "Alerta de Stock Bajo",
            message: "Leche Lala Entera 1L está por debajo del mínimo (8 de 12 pzas).",
            timestamp: new Date().toISOString(),
            read: false,
            actionLink: "inventario",
          },
          {
            id: "n-2",
            type: "CREDITO_PENDIENTE",
            title: "Saldo de Cliente Pendiente",
            message: "Distribuidora Comercial del Norte tiene $3,200 MXN pendientes de crédito.",
            timestamp: new Date().toISOString(),
            read: false,
            actionLink: "clientes",
          },
        ];
  });

  const [currentCorteCaja, setCurrentCorteCaja] = useState<CorteCaja | null>(() => {
    const saved = localStorage.getItem("pv9_currentCorteCaja");
    return saved ? JSON.parse(saved) : {
      id: "corte-001",
      cashierId: "u-admin",
      cashierName: "Guillermo López",
      openTimestamp: new Date().toISOString(),
      initialCash: 1000.0,
      salesCash: 90.0,
      salesCard: 182.0,
      salesTransfer: 0,
      expectedTotal: 1090.0,
      status: "ABIERTA",
    };
  });

  const [refunds, setRefunds] = useState<Refund[]>(() => {
    const saved = localStorage.getItem("pv9_refunds");
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("pv9_sidebar_collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const [batches, setBatches] = useState<ProductBatch[]>(() => {
    const saved = localStorage.getItem("pv9_batches");
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem("pv9_purchaseOrders");
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [enabledModules, setEnabledModules] = useState<ModuleId[]>(() => {
    const saved = localStorage.getItem("pv9_enabled_modules");
    return saved ? JSON.parse(saved) : [
      "dashboard",
      "pos",
      "inventario",
      "lotes_caducidad",
      "pedidos_proveedores",
      "clientes",
      "nomina",
      "gastos",
      "proveedores",
      "cfdi",
      "reimpresion",
      "usuarios",
      "asistente_ia",
      "companion_movil",
      "configuracion",
      "temas",
      "respaldos",
    ];
  });

  useEffect(() => {
    localStorage.setItem("pv9_refunds", JSON.stringify(refunds));
  }, [refunds]);

  useEffect(() => {
    localStorage.setItem("pv9_sidebar_collapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem("pv9_enabled_modules", JSON.stringify(enabledModules));
  }, [enabledModules]);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const toggleModuleEnabled = (mod: ModuleId) => {
    setEnabledModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const processRefund = (saleId: string, reason: string, returnToStock: boolean): Refund => {
    const targetSale = sales.find((s) => s.id === saleId);
    const refundFolio = `REF-${100 + refunds.length + 1}`;
    const newRefund: Refund = {
      id: `ref-${Date.now()}`,
      folio: refundFolio,
      saleId,
      saleFolio: targetSale ? targetSale.folio : "V-1000",
      timestamp: new Date().toISOString(),
      amount: targetSale ? targetSale.total : 0,
      reason,
      returnedToStock: returnToStock,
      processedBy: currentUser.name,
    };

    if (targetSale) {
      if (returnToStock) {
        setProducts((prev) =>
          prev.map((prod) => {
            const item = targetSale.items.find((i) => i.product.id === prod.id);
            return item ? { ...prod, stock: prod.stock + item.quantity } : prod;
          })
        );
      }
      setSales((prev) =>
        prev.map((s) => (s.id === saleId ? { ...s, status: "CANCELADA" } : s))
      );
    }

    setRefunds((prev) => [newRefund, ...prev]);
    return newRefund;
  };

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem("pv9_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("pv9_categories", JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem("pv9_products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("pv9_stockMovements", JSON.stringify(stockMovements));
  }, [stockMovements]);
  useEffect(() => {
    localStorage.setItem("pv9_sales", JSON.stringify(sales));
  }, [sales]);
  useEffect(() => {
    localStorage.setItem("pv9_customers", JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem("pv9_employees", JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem("pv9_payStubs", JSON.stringify(payStubs));
  }, [payStubs]);
  useEffect(() => {
    localStorage.setItem("pv9_expenses", JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem("pv9_suppliers", JSON.stringify(suppliers));
  }, [suppliers]);
  useEffect(() => {
    localStorage.setItem("pv9_cfdiInvoices", JSON.stringify(cfdiInvoices));
  }, [cfdiInvoices]);
  useEffect(() => {
    localStorage.setItem("pv9_cfdiSettings", JSON.stringify(cfdiSettings));
  }, [cfdiSettings]);
  useEffect(() => {
    localStorage.setItem("pv9_backupConfig", JSON.stringify(backupConfig));
  }, [backupConfig]);
  useEffect(() => {
    localStorage.setItem("pv9_backupLogs", JSON.stringify(backupLogs));
  }, [backupLogs]);
  useEffect(() => {
    localStorage.setItem("pv9_aiSettings", JSON.stringify(aiSettings));
  }, [aiSettings]);
  useEffect(() => {
    localStorage.setItem("pv9_businessConfig", JSON.stringify(businessConfig));
  }, [businessConfig]);
  useEffect(() => {
    localStorage.setItem("pv9_themeConfig", JSON.stringify(themeConfig));
  }, [themeConfig]);
  useEffect(() => {
    localStorage.setItem("pv9_notifications", JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem("pv9_currentCorteCaja", JSON.stringify(currentCorteCaja));
  }, [currentCorteCaja]);

  // Actions
  const switchUserByPin = (pin: string): boolean => {
    const found = users.find((u) => u.pin === pin && u.active);
    if (found) {
      setCurrentUser(found);
      // Auto adjust allowed module if necessary
      const userPerms = DEFAULT_PERMISSIONS.find((p) => p.role === found.role);
      if (userPerms && !userPerms.allowedModules.includes(activeModule)) {
        setActiveModule(userPerms.allowedModules[0] || "pos");
      }
      return true;
    }
    return false;
  };

  const addProduct = (p: Omit<Product, "id">) => {
    const newProd: Product = { ...p, id: `prod-${Date.now()}` };
    setProducts((prev) => [newProd, ...prev]);

    // Check stock warning
    if (newProd.stock <= newProd.minStock) {
      const notif: SystemNotification = {
        id: `notif-${Date.now()}`,
        type: "STOCK_BAJO",
        title: "Nuevo producto con stock bajo",
        message: `${newProd.name} registrado con ${newProd.stock} pzas (mínimo ${newProd.minStock}).`,
        timestamp: new Date().toISOString(),
        read: false,
        actionLink: "inventario",
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const adjustStock = (
    productId: string,
    quantity: number,
    type: "ENTRADA" | "SALIDA" | "AJUSTE_INVENTARIO",
    reason: string
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const prevStock = prod.stock;
          const newStock = type === "ENTRADA" ? prevStock + quantity : Math.max(0, prevStock - quantity);

          // Add movement log
          const movement: StockMovement = {
            id: `mov-${Date.now()}`,
            productId,
            productName: prod.name,
            type,
            quantity,
            previousStock: prevStock,
            newStock,
            reason,
            userId: currentUser.id,
            userName: currentUser.name,
            timestamp: new Date().toISOString(),
          };
          setStockMovements((m) => [movement, ...m]);

          // Check low stock
          if (newStock <= prod.minStock) {
            const notif: SystemNotification = {
              id: `notif-${Date.now()}`,
              type: "STOCK_BAJO",
              title: "Stock por debajo del mínimo",
              message: `${prod.name} tiene ${newStock} pzas de inventario.`,
              timestamp: new Date().toISOString(),
              read: false,
              actionLink: "inventario",
            };
            setNotifications((n) => [notif, ...n]);
          }

          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );
  };

  const addCategory = (cat: Omit<Category, "id">) => {
    const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
    setCategories((prev) => [...prev, newCat]);
  };

  const addSale = (
    items: CartItem[],
    paymentMethod: PaymentMethod,
    amountReceived: number,
    customerId?: string
  ): Sale => {
    const total = items.reduce((acc, item) => acc + item.total, 0);
    const subtotal = total / (1 + businessConfig.defaultTaxIVA / 100);
    const taxIVA = total - subtotal;
    const changeGiven = paymentMethod === "EFECTIVO" ? Math.max(0, amountReceived - total) : 0;

    const folioNumber = 1000 + sales.length + 1;
    const customerObj = customers.find((c) => c.id === customerId);

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      folio: `V-${folioNumber}`,
      timestamp: new Date().toISOString(),
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      taxIVA: Math.round(taxIVA * 100) / 100,
      discountTotal: 0,
      total,
      paymentMethod,
      amountReceived,
      changeGiven,
      customerId: customerObj?.id || "cust-gen",
      customerName: customerObj?.name || "Público en General",
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      status: "COMPLETADA",
      corteCajaId: currentCorteCaja?.id,
    };

    // Deduct stock for sold items
    setProducts((prevProds) =>
      prevProds.map((prod) => {
        const cartMatch = items.find((ci) => ci.product.id === prod.id);
        if (cartMatch) {
          const newStock = Math.max(0, prod.stock - cartMatch.quantity);
          if (newStock <= prod.minStock) {
            const notif: SystemNotification = {
              id: `notif-${Date.now()}`,
              type: "STOCK_BAJO",
              title: "Stock bajo tras venta",
              message: `${prod.name} disminuyó a ${newStock} unidades.`,
              timestamp: new Date().toISOString(),
              read: false,
              actionLink: "inventario",
            };
            setNotifications((n) => [notif, ...n]);
          }
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    // Update customer stats
    if (customerObj && customerObj.id !== "cust-gen") {
      setCustomers((prevCusts) =>
        prevCusts.map((c) => (c.id === customerObj.id ? { ...c, salesCount: c.salesCount + 1 } : c))
      );
    }

    // Update Corte de Caja
    if (currentCorteCaja && currentCorteCaja.status === "ABIERTA") {
      setCurrentCorteCaja((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          salesCash: paymentMethod === "EFECTIVO" ? prev.salesCash + total : prev.salesCash,
          salesCard: paymentMethod === "TARJETA" ? prev.salesCard + total : prev.salesCard,
          salesTransfer: paymentMethod === "TRANSFERENCIA" ? prev.salesTransfer + total : prev.salesTransfer,
          expectedTotal: prev.expectedTotal + total,
        };
      });
    }

    setSales((prev) => [newSale, ...prev]);
    return newSale;
  };

  const cancelSale = (saleId: string, _reason: string) => {
    const saleToCancel = sales.find((s) => s.id === saleId);
    if (!saleToCancel || saleToCancel.status === "CANCELADA") return;

    // Restore stock
    setProducts((prevProds) =>
      prevProds.map((prod) => {
        const itemMatch = saleToCancel.items.find((i) => i.product.id === prod.id);
        if (itemMatch) {
          return { ...prod, stock: prod.stock + itemMatch.quantity };
        }
        return prod;
      })
    );

    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: "CANCELADA" } : s))
    );
  };

  const addCustomer = (c: Omit<Customer, "id" | "createdAt" | "salesCount" | "currentCreditDebt">) => {
    const newCust: Customer = {
      ...c,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      salesCount: 0,
      currentCreditDebt: 0,
    };
    setCustomers((prev) => [...prev, newCust]);
  };

  const updateCustomer = (c: Customer) => {
    setCustomers((prev) => prev.map((item) => (item.id === c.id ? c : item)));
  };

  const addEmployee = (emp: Omit<Employee, "id">) => {
    const newEmp: Employee = { ...emp, id: `emp-${Date.now()}` };
    setEmployees((prev) => [...prev, newEmp]);
  };

  const addPayStub = (stub: Omit<PayStub, "id">) => {
    const newStub: PayStub = { ...stub, id: `stub-${Date.now()}` };
    setPayStubs((prev) => [newStub, ...prev]);
  };

  const addExpense = (exp: Omit<Expense, "id" | "folio">) => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
      folio: `EXP-${100 + expenses.length + 1}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  useEffect(() => {
    localStorage.setItem("pv9_batches", JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem("pv9_purchaseOrders", JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  const addBatch = (b: Omit<ProductBatch, "id">) => {
    const today = new Date().toISOString().split("T")[0];
    const expDate = new Date(b.expirationDate);
    const now = new Date();
    const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    let status: ProductBatch["status"] = "ACTIVO";
    if (diffDays <= 0) status = "CADUCADO";
    else if (diffDays <= 30) status = "POR_CADUCAR";

    const newBatch: ProductBatch = {
      ...b,
      id: `batch-${Date.now()}`,
      status,
      receivedDate: b.receivedDate || today,
    };

    if (status === "POR_CADUCAR" || status === "CADUCADO") {
      const notif: SystemNotification = {
        id: `notif-batch-${Date.now()}`,
        type: "CADUCIDAD_LOTE",
        title: status === "CADUCADO" ? "Lote Caducado" : "Lote Próximo a Caducar",
        message: `El lote ${newBatch.batchNumber} de ${newBatch.productName} ${
          status === "CADUCADO" ? "ya caducó" : `caduca en ${diffDays} días`
        }.`,
        timestamp: new Date().toISOString(),
        read: false,
        actionLink: "lotes_caducidad",
      };
      setNotifications((n) => [notif, ...n]);
    }

    setBatches((prev) => [newBatch, ...prev]);
  };

  const updateBatch = (b: ProductBatch) => {
    setBatches((prev) => prev.map((item) => (item.id === b.id ? b : item)));
  };

  const deleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((item) => item.id !== id));
  };

  const addPurchaseOrder = (po: Omit<PurchaseOrder, "id" | "folio">) => {
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      folio: `OC-${1000 + purchaseOrders.length + 1}`,
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
  };

  const updatePurchaseOrderStatus = (id: string, status: PurchaseOrder["status"]) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status } : po))
    );
  };

  const receivePurchaseOrder = (id: string) => {
    const po = purchaseOrders.find((p) => p.id === id);
    if (!po || po.status === "RECIBIDO") return;

    setProducts((prevProds) =>
      prevProds.map((prod) => {
        const itemMatch = po.items.find((i) => i.productId === prod.id);
        if (itemMatch) {
          return { ...prod, stock: prod.stock + itemMatch.quantityOrdered };
        }
        return prod;
      })
    );

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "RECIBIDO",
              receivedDate: new Date().toISOString().split("T")[0],
              items: p.items.map((item) => ({ ...item, quantityReceived: item.quantityOrdered })),
            }
          : p
      )
    );
  };

  const addSupplier = (supp: Omit<Supplier, "id">) => {
    const newSupp: Supplier = { ...supp, id: `supp-${Date.now()}` };
    setSuppliers((prev) => [...prev, newSupp]);
  };

  const updateSupplier = (supp: Supplier) => {
    setSuppliers((prev) => prev.map((item) => (item.id === supp.id ? supp : item)));
  };

  const stampCFDI = async (saleId: string): Promise<CFDIInvoice | null> => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) return null;

    const customer = customers.find((c) => c.id === sale.customerId) || customers[0];

    try {
      const response = await fetch("/api/cfdi/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceData: {
            folio: sale.folio,
            subtotal: sale.subtotal,
            total: sale.total,
            emisorRFC: cfdiSettings.defaultEmisorRFC,
            emisorNombre: cfdiSettings.defaultEmisorNombre,
            emisorRegimen: cfdiSettings.defaultEmisorRegimen,
            emisorCP: cfdiSettings.defaultEmisorCP,
            receptorRFC: customer.rfc,
            receptorNombre: customer.razonSocial || customer.name,
            receptorRegimen: customer.regimenFiscal || "616",
            receptorCP: customer.postalCode || "06000",
            usoCFDI: customer.usoCFDI || "G03",
            items: sale.items.map((i) => ({
              claveSAT: i.product.satClaveProdServ || "84111506",
              cantidad: i.quantity,
              descripcion: i.product.name,
              precioUnitario: i.unitPrice,
              importe: i.total,
            })),
          },
          isConnected: cfdiSettings.isOnlineForStamping,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al timbrar CFDI");

      const newInvoice: CFDIInvoice = {
        id: `cfdi-${Date.now()}`,
        folio: data.folio,
        saleId: sale.id,
        uuid: data.uuid,
        fechaEmision: data.fechaTimbrado,
        emisorRFC: cfdiSettings.defaultEmisorRFC,
        emisorNombre: cfdiSettings.defaultEmisorNombre,
        emisorRegimen: cfdiSettings.defaultEmisorRegimen,
        emisorCP: cfdiSettings.defaultEmisorCP,
        receptorRFC: customer.rfc,
        receptorNombre: customer.razonSocial || customer.name,
        receptorRegimen: customer.regimenFiscal || "616",
        receptorCP: customer.postalCode || "06000",
        usoCFDI: customer.usoCFDI || "G03",
        subtotal: sale.subtotal,
        taxIVA: sale.taxIVA,
        total: sale.total,
        status: "TIMBRADO",
        xmlContent: data.xmlContent,
        pdfGenerated: true,
      };

      setCfdiInvoices((prev) => [newInvoice, ...prev]);
      setSales((prev) =>
        prev.map((s) => (s.id === sale.id ? { ...s, status: "FACTURADA", cfdiUuid: data.uuid } : s))
      );

      return newInvoice;
    } catch (error: any) {
      alert(error.message || "Error al conectar con PAC para CFDI.");
      return null;
    }
  };

  const updateCFDISettings = (cfg: Partial<CFDISettings>) => {
    setCfdiSettings((prev) => ({ ...prev, ...cfg }));
  };

  const addUser = (u: Omit<User, "id">) => {
    const newUser: User = { ...u, id: `user-${Date.now()}` };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (u: User) => {
    setUsers((prev) => prev.map((item) => (item.id === u.id ? u : item)));
    if (currentUser.id === u.id) setCurrentUser(u);
  };

  const updateBusinessConfig = (cfg: Partial<BusinessConfig>) => {
    setBusinessConfig((prev) => ({ ...prev, ...cfg }));
  };

  const updateBackupConfig = (cfg: Partial<CloudBackupConfig>) => {
    setBackupConfig((prev) => ({ ...prev, ...cfg }));
  };

  const updateAISettings = (cfg: Partial<AIAssistantSettings>) => {
    setAiSettings((prev) => ({ ...prev, ...cfg }));
  };

  const updateThemeConfig = (cfg: Partial<ThemeConfig>) => {
    setThemeConfig((prev) => ({ ...prev, ...cfg }));
  };

  const openCorteCaja = (initialCash: number) => {
    const newCorte: CorteCaja = {
      id: `corte-${Date.now()}`,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      openTimestamp: new Date().toISOString(),
      initialCash,
      salesCash: 0,
      salesCard: 0,
      salesTransfer: 0,
      expectedTotal: initialCash,
      status: "ABIERTA",
    };
    setCurrentCorteCaja(newCorte);
  };

  const closeCorteCaja = (actualCash: number, notes?: string) => {
    if (!currentCorteCaja) return;
    const diff = actualCash - (currentCorteCaja.initialCash + currentCorteCaja.salesCash);
    setCurrentCorteCaja({
      ...currentCorteCaja,
      closeTimestamp: new Date().toISOString(),
      actualCashInRegister: actualCash,
      difference: diff,
      status: "CERRADA",
      notes,
    });
  };

  const triggerManualBackup = async (): Promise<boolean> => {
    try {
      const dbSnapshot = {
        products,
        categories,
        sales,
        customers,
        expenses,
        suppliers,
        businessConfig,
      };

      const res = await fetch("/api/backup/cloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: backupConfig.provider,
          dbSnapshot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const log: CloudBackupLog = {
          id: data.backupId,
          provider: backupConfig.provider,
          timestamp: data.timestamp,
          sizeKb: data.sizeKb,
          status: "EXITO",
          fileName: `pv9_backup_${data.backupId}.json`,
        };
        setBackupLogs((prev) => [log, ...prev]);
        setBackupConfig((prev) => ({
          ...prev,
          lastBackupDate: data.timestamp,
          lastBackupStatus: "EXITO",
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const queryAIAssistant = async (userMessage: string) => {
    const contextData = {
      ventasHoy: sales.filter(
        (s) => new Date(s.timestamp).toDateString() === new Date().toDateString()
      ),
      totalVentasHistoricas: sales.length,
      productosConStockBajo: products.filter((p) => p.stock <= p.minStock),
      gastosTotales: expenses.reduce((acc, e) => acc + e.amount, 0),
      clientesConSaldo: customers.filter((c) => c.currentCreditDebt > 0),
      configuracionNegocio: businessConfig,
      usuarioActivo: currentUser,
      systemBehaviorPrompt: aiSettings.systemBehaviorPrompt,
    };

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        contextData,
      }),
    });

    const data = await res.json();
    let textResult = data.text || "No se obtuvo respuesta.";
    let audioBase64: string | undefined = undefined;

    // If voice output is enabled, synthesize TTS
    if (aiSettings.voiceOutputEnabled) {
      try {
        const ttsRes = await fetch("/api/ai/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: textResult.substring(0, 300), // Limit text length for voice chunk
            voiceName: aiSettings.voiceName,
          }),
        });
        const ttsData = await ttsRes.json();
        if (ttsData.audioBase64) {
          audioBase64 = ttsData.audioBase64;
        }
      } catch (e) {
        console.warn("TTS Error:", e);
      }
    }

    return { text: textResult, audioBase64 };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        userPermissions: DEFAULT_PERMISSIONS,
        activeModule,
        setActiveModule,

        isSidebarCollapsed,
        toggleSidebar,
        enabledModules,
        toggleModuleEnabled,

        currentTheme: themeConfig.theme,
        setTheme: (theme: any) => updateThemeConfig({ theme }),

        products,
        categories,
        stockMovements,
        sales,
        refunds,
        customers,
        employees,
        payStubs,
        expenses,
        suppliers,
        cfdiInvoices,
        batches,
        purchaseOrders,
        cfdiSettings,
        backupConfig,
        backupLogs,
        aiSettings,
        businessConfig,
        themeConfig,
        notifications,
        currentCorteCaja,

        switchUserByPin,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addCategory,
        addSale,
        cancelSale,
        processRefund,
        addCustomer,
        updateCustomer,
        addEmployee,
        addPayStub,
        addExpense,
        addSupplier,
        updateSupplier,
        addBatch,
        updateBatch,
        deleteBatch,
        addPurchaseOrder,
        updatePurchaseOrderStatus,
        receivePurchaseOrder,
        stampCFDI,
        updateCFDISettings,
        addUser,
        updateUser,
        updateBusinessConfig,
        updateBackupConfig,
        updateAISettings,
        updateThemeConfig,
        openCorteCaja,
        closeCorteCaja,
        triggerManualBackup,
        markNotificationRead,
        clearNotifications,
        queryAIAssistant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
