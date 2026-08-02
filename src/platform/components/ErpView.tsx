import React, { useState } from 'react';
import {
  Boxes,
  FileText,
  CreditCard,
  Plus,
  Search,
  RefreshCw,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  PackageCheck,
  Building,
  DollarSign,
  ShoppingCart,
  Receipt,
  X
} from 'lucide-react';
import { ErpItem, ErpSalesOrder, ErpInvoice, Lead } from '../types';

interface ErpViewProps {
  items: ErpItem[];
  salesOrders: ErpSalesOrder[];
  invoices: ErpInvoice[];
  leads: Lead[];
  onCreateSalesOrder: (newOrder: ErpSalesOrder) => void;
  onCreateItem: (newItem: ErpItem) => void;
}

export const ErpView: React.FC<ErpViewProps> = ({
  items,
  salesOrders,
  invoices,
  leads,
  onCreateSalesOrder,
  onCreateItem
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'items' | 'invoices' | 'config'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  // New Order Form state
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [orderItems, setOrderItems] = useState<{ itemCode: string; itemName: string; qty: number; rate: number }[]>([]);
  const [deliveryDate, setDeliveryDate] = useState('');

  // New Item Form state
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Software SaaS');
  const [newItemPrice, setNewItemPrice] = useState(100);
  const [newItemStock, setNewItemStock] = useState(50);

  // Frappe sync toast
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncFrappe = () => {
    setSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1200);
  };

  const handleAddItemToOrder = (item: ErpItem) => {
    const existingIndex = orderItems.findIndex(i => i.itemCode === item.itemCode);
    if (existingIndex > -1) {
      const updated = [...orderItems];
      updated[existingIndex].qty += 1;
      setOrderItems(updated);
    } else {
      setOrderItems([
        ...orderItems,
        { itemCode: item.itemCode, itemName: item.itemName, qty: 1, rate: item.unitPrice }
      ]);
    }
  };

  const handleRemoveItemFromOrder = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const orderGrandTotal = orderItems.reduce((sum, item) => sum + item.qty * item.rate, 0);

  const handleSaveSalesOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || orderItems.length === 0) {
      alert('Por favor selecciona un cliente/lead y agrega al menos un ítem.');
      return;
    }

    const lead = leads.find(l => l.id === selectedLeadId);
    const newSO: ErpSalesOrder = {
      id: `SAL-ORD-2026-00${Math.floor(Math.random() * 90 + 10)}`,
      customerName: lead ? `${lead.name} (${lead.company})` : 'Cliente Clientum CRM',
      customerPhone: lead ? lead.phone : '',
      postingDate: new Date().toISOString().split('T')[0],
      deliveryDate: deliveryDate || '2026-08-15',
      grandTotal: orderGrandTotal,
      status: 'Submitted',
      currency: 'USD',
      items: orderItems.map(i => ({ ...i, amount: i.qty * i.rate })),
      paymentUrl: `https://pay.clientum.com.ar/pay_so_2026_${Math.floor(Math.random() * 8000 + 1000)}`
    };

    onCreateSalesOrder(newSO);
    setShowNewOrderModal(false);
    setOrderItems([]);
    setSelectedLeadId('');
    alert('¡Pedido de Venta generado con éxito en Clientum Sales Hub!');
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemCode || !newItemName) return;

    const newItem: ErpItem = {
      id: `item_${Date.now()}`,
      itemCode: newItemCode,
      itemName: newItemName,
      category: newItemCategory,
      stockQty: Number(newItemStock),
      unitPrice: Number(newItemPrice),
      uom: 'Unidad',
      currency: 'USD'
    };

    onCreateItem(newItem);
    setShowNewItemModal(false);
    setNewItemCode('');
    setNewItemName('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">Pagado</span>;
      case 'Submitted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Enviado a ERP</span>;
      case 'Invoiced':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Facturado</span>;
      case 'Unpaid':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Pendiente</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-green-600" />
            <h1 className="text-xl font-bold text-slate-900">Clientum Sales Hub</h1>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
              DocTypes Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión centralizada de Cotizaciones, Pedidos de Venta, Catálogo de Productos y Facturación integrada con WhatsApp.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSyncFrappe}
            disabled={syncing}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Sincronizando...' : 'Sincronizar Clientum Cloud'}</span>
          </button>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Pedido de Venta</span>
          </button>
        </div>
      </div>

      {syncSuccess && (
        <div className="bg-green-600 text-white text-xs px-4 py-2 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>¡Sincronización exitosa con tu instancia Clientum Cloud! Se actualizaron Doctypes `Sales Order` e `Item`.</span>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'orders' ? 'border-green-600 text-green-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Pedidos de Venta ({salesOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('items')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'items' ? 'border-green-600 text-green-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Inventario y Productos ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'invoices' ? 'border-green-600 text-green-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Facturas y Cobros ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('config')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'config' ? 'border-green-600 text-green-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Conexión REST API Clientum</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* SUBTAB 1: SALES ORDERS */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar pedido, cliente o número SO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-[10px] text-slate-500 tracking-wider">
                  <tr>
                    <th className="p-3">ID Pedido (Clientum)</th>
                    <th className="p-3">Cliente / Empresa</th>
                    <th className="p-3">Fecha Emisión</th>
                    <th className="p-3">Total ($)</th>
                    <th className="p-3">Estado ERP</th>
                    <th className="p-3 text-right">Acciones WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesOrders
                    .filter(so =>
                      so.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      so.customerName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-slate-900">{order.id}</td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-800">{order.customerName}</p>
                          <p className="text-[10px] text-slate-400">{order.customerPhone}</p>
                        </td>
                        <td className="p-3 text-slate-500">{order.postingDate}</td>
                        <td className="p-3 font-bold text-slate-900">${order.grandTotal.toLocaleString()} {order.currency}</td>
                        <td className="p-3">{getStatusBadge(order.status)}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {order.paymentUrl && (
                              <a
                                href={order.paymentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded text-[11px] font-semibold flex items-center space-x-1"
                              >
                                <Send className="w-3 h-3" />
                                <span>Enviar Link</span>
                              </a>
                            )}
                            <button className="p-1 hover:bg-slate-200 rounded text-slate-500">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ITEMS & CATALOG */}
        {activeSubTab === 'items' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800">Catálogo de Productos e Inventario Sync</h3>
              <button
                onClick={() => setShowNewItemModal(true)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Producto a Clientum</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-green-300 transition">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-bold">
                        {item.itemCode}
                      </span>
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        ${item.unitPrice} {item.currency}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{item.itemName}</h4>
                    <p className="text-xs text-slate-500">Categoría: {item.category}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-slate-600 font-medium">
                      <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Stock: <b>{item.stockQty}</b> {item.uom}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowNewOrderModal(true);
                        handleAddItemToOrder(item);
                      }}
                      className="text-[11px] font-bold text-green-600 hover:text-green-800"
                    >
                      + Cotizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: INVOICES */}
        {activeSubTab === 'invoices' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-[10px] text-slate-500 tracking-wider">
                <tr>
                  <th className="p-3">N° Factura (Sales Invoice)</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Emisión</th>
                  <th className="p-3">Vencimiento</th>
                  <th className="p-3">Monto Total</th>
                  <th className="p-3">Estado Pago</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{inv.id}</td>
                    <td className="p-3 font-semibold text-slate-800">{inv.customerName}</td>
                    <td className="p-3 text-slate-500">{inv.postingDate}</td>
                    <td className="p-3 text-slate-500">{inv.dueDate}</td>
                    <td className="p-3 font-bold text-slate-900">${inv.amount.toLocaleString()} USD</td>
                    <td className="p-3">{getStatusBadge(inv.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 4: CONFIG */}
        {activeSubTab === 'config' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Building className="w-4 h-4 text-green-600" />
              <span>Ajustes de Conexión Clientum Cloud Framework</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">URL de la Instancia Clientum Sales Hub</label>
                <input
                  type="text"
                  readOnly
                  value="https://acme.clientum.com.ar"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Clientum API Key</label>
                <input
                  type="password"
                  readOnly
                  value="usr_key_849382019348123049"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Doctypes Sincronizados</label>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>Lead / CRM Customer</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>Sales Order</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>Item & Stock Entry</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>Sales Invoice & Payment Entry</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW SALES ORDER MODAL */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2 text-green-600" />
                Nuevo Pedido de Venta (Clientum DocType: Sales Order)
              </h3>
              <button onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSalesOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Seleccionar Cliente / Lead de Clientum CRM</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                >
                  <option value="">-- Seleccionar Lead --</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company} ({lead.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Agregar Productos del Catálogo ERP</label>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddItemToOrder(item)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-green-50 hover:text-green-700 border border-slate-200 rounded text-slate-700 font-medium"
                    >
                      + {item.itemName} (${item.unitPrice})
                    </button>
                  ))}
                </div>
              </div>

              {orderItems.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                  <p className="font-bold text-slate-800">Ítems Seleccionados:</p>
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <span>{item.itemName} x{item.qty}</span>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-800">${item.qty * item.rate} USD</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItemFromOrder(idx)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                    Total Pedido: ${orderGrandTotal} USD
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-xs"
                >
                  Generar Pedido en Clientum Sales Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW ITEM MODAL */}
      {showNewItemModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <Boxes className="w-4 h-4 mr-2 text-blue-600" />
                Nuevo Producto (Clientum DocType: Item)
              </h3>
              <button onClick={() => setShowNewItemModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Código / SKU del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. ERP-SERV-01"
                  value={newItemCode}
                  onChange={(e) => setNewItemCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre del Producto / Servicio</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Licencia Clientum Anual"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Precio Unitario ($)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    required
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewItemModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded shadow-xs"
                >
                  Guardar en Clientum Sales Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
