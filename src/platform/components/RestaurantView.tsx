import React, { useState } from 'react';
import {
  UtensilsCrossed,
  ChefHat,
  QrCode,
  LayoutGrid,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Users,
  Sparkles,
  Send,
  MessageSquare,
  Search,
  Check,
  X,
  Flame,
  Coffee,
  Wine,
  Phone
} from 'lucide-react';
import { RestaurantTable, MenuItem, RestaurantOrder, RestaurantOrderStatus } from '../types';

interface RestaurantViewProps {
  tables: RestaurantTable[];
  menuItems: MenuItem[];
  orders: RestaurantOrder[];
  onUpdateTableStatus: (tableId: string, newStatus: RestaurantTable['status']) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: RestaurantOrderStatus) => void;
  onCreateOrder: (newOrder: RestaurantOrder) => void;
  onToggleMenuItemAvailability: (itemId: string) => void;
}

export const RestaurantView: React.FC<RestaurantViewProps> = ({
  tables,
  menuItems,
  orders,
  onUpdateTableStatus,
  onUpdateOrderStatus,
  onCreateOrder,
  onToggleMenuItemAvailability
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'kds' | 'menu' | 'qr'>('tables');
  const [selectedZone, setSelectedZone] = useState<string>('Todos');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // New Dine-in or QR Order Form
  const [orderTable, setOrderTable] = useState('Mesa 02');
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderCustomerPhone, setOrderCustomerPhone] = useState('');
  const [selectedMenuItems, setSelectedMenuItems] = useState<{ menuItemName: string; qty: number; price: number }[]>([]);

  const handleAddItemToNewOrder = (item: MenuItem) => {
    const existing = selectedMenuItems.findIndex(i => i.menuItemName === item.name);
    if (existing > -1) {
      const copy = [...selectedMenuItems];
      copy[existing].qty += 1;
      setSelectedMenuItems(copy);
    } else {
      setSelectedMenuItems([...selectedMenuItems, { menuItemName: item.name, qty: 1, price: item.price }]);
    }
  };

  const handleRemoveItemFromNewOrder = (index: number) => {
    setSelectedMenuItems(selectedMenuItems.filter((_, i) => i !== index));
  };

  const newOrderTotal = selectedMenuItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0);

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMenuItems.length === 0) {
      alert('Agregá al menos un plato o bebida al pedido.');
      return;
    }

    const newOrd: RestaurantOrder = {
      id: `RST-ORD-${Math.floor(Math.random() * 900 + 100)}`,
      orderType: 'Dine-in',
      tableNumber: orderTable,
      customerName: orderCustomerName || 'Cliente Salon',
      customerPhone: orderCustomerPhone || '+54 11 0000-0000',
      items: selectedMenuItems,
      status: 'Kitchen Preparing',
      totalAmount: newOrderTotal,
      timestamp: 'Ahora'
    };

    onCreateOrder(newOrd);

    // Update table status to occupied if matching
    const matchingTable = tables.find(t => t.tableNumber === orderTable);
    if (matchingTable) {
      onUpdateTableStatus(matchingTable.id, 'Occupied');
    }

    setShowNewOrderModal(false);
    setSelectedMenuItems([]);
    setOrderCustomerName('');
    setOrderCustomerPhone('');
  };

  const getTableStatusStyle = (status: RestaurantTable['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:border-emerald-500';
      case 'Occupied':
        return 'bg-amber-50 border-amber-300 text-amber-800 hover:border-amber-500';
      case 'Reserved':
        return 'bg-blue-50 border-blue-300 text-blue-800 hover:border-blue-500';
      case 'Bill Requested':
        return 'bg-purple-50 border-purple-300 text-purple-800 hover:border-purple-500 animate-pulse';
    }
  };

  const getOrderStatusBadge = (status: RestaurantOrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Pendiente</span>;
      case 'Kitchen Preparing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1"><Flame className="w-3 h-3 text-amber-500" /> En Cocina</span>;
      case 'Ready to Serve':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Listo para Servir</span>;
      case 'Completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Completado</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">{status}</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-600" />
            <h1 className="text-xl font-bold text-slate-900">Restaurante & Gastronomía SaaS</h1>
            <span className="text-xs bg-amber-100 text-amber-800 font-mono font-bold px-2 py-0.5 rounded border border-amber-200">
              POS & KDS Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de Comensales, Control de Mesas, Comandero de Cocina en Tiempo Real y Carta Digital QR con WhatsApp.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Comanda / Pedido</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('tables')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'tables' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Plano de Mesas ({tables.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kds')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'kds' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Comandera Cocina KDS ({orders.filter(o => o.status !== 'Completed').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('menu')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'menu' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Menú & Carta Digital ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('qr')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeSubTab === 'qr' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Pedidos QR WhatsApp</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* SUBTAB 1: TABLES FLOOR PLAN */}
        {activeSubTab === 'tables' && (
          <div className="space-y-6">
            {/* Zone Filter */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold text-slate-500">Filtrar Zona:</span>
              {['Todos', 'Comedor Principal', 'Terraza', 'Bar & VIP'].map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1 rounded-full border transition ${
                    selectedZone === zone
                      ? 'bg-slate-900 text-white font-bold border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>

            {/* Table Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables
                .filter(t => selectedZone === 'Todos' || t.zone === selectedZone)
                .map((table) => (
                  <div
                    key={table.id}
                    className={`border-2 rounded-2xl p-5 flex flex-col justify-between transition shadow-xs ${getTableStatusStyle(
                      table.status
                    )}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg text-slate-900">{table.tableNumber}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/80 border border-slate-200">
                          {table.zone}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-slate-600 mb-3">
                        <Users className="w-3.5 h-3.5" />
                        <span>Capacidad: {table.capacity} personas</span>
                      </div>

                      {table.assignedWaiter && (
                        <p className="text-xs font-medium text-slate-700">Mozo: {table.assignedWaiter}</p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 mt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>Estado:</span>
                        <span>
                          {table.status === 'Available' && 'Libre'}
                          {table.status === 'Occupied' && 'Ocupada'}
                          {table.status === 'Reserved' && 'Reservada'}
                          {table.status === 'Bill Requested' && 'Pidió Cuenta'}
                        </span>
                      </div>

                      {/* Action buttons to quickly switch status */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                        {table.status !== 'Available' && (
                          <button
                            onClick={() => onUpdateTableStatus(table.id, 'Available')}
                            className="p-1 bg-emerald-600 text-white rounded text-center hover:bg-emerald-700"
                          >
                            Liberar
                          </button>
                        )}
                        {table.status !== 'Occupied' && (
                          <button
                            onClick={() => onUpdateTableStatus(table.id, 'Occupied')}
                            className="p-1 bg-amber-600 text-white rounded text-center hover:bg-amber-700"
                          >
                            Ocupar
                          </button>
                        )}
                        {table.status !== 'Bill Requested' && (
                          <button
                            onClick={() => onUpdateTableStatus(table.id, 'Bill Requested')}
                            className="p-1 bg-purple-600 text-white rounded text-center hover:bg-purple-700"
                          >
                            Solicitar Cuenta
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SUBTAB 2: KITCHEN DISPLAY SYSTEM (KDS) */}
        {activeSubTab === 'kds' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <ChefHat className="w-4 h-4 text-amber-600" />
                <span>Comandero Digital de Cocina (KDS)</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Actualización automática con pedidos WhatsApp & Salón</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-amber-400 transition"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">{ord.id}</span>
                          {ord.tableNumber && (
                            <span className="bg-amber-100 text-amber-800 font-bold text-xs px-2 py-0.5 rounded border border-amber-200">
                              {ord.tableNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{ord.customerName} ({ord.customerPhone})</p>
                      </div>
                      <div>{getOrderStatusBadge(ord.status)}</div>
                    </div>

                    {/* Item list */}
                    <div className="space-y-1.5 text-xs text-slate-800">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-50">
                          <span className="font-semibold text-slate-900">
                            {it.qty}x {it.menuItemName}
                          </span>
                          <span className="text-slate-500">${it.price * it.qty}</span>
                        </div>
                      ))}
                    </div>

                    {ord.notes && (
                      <div className="bg-amber-50 p-2 rounded text-[11px] text-amber-900 border border-amber-200 font-medium">
                        Nota: {ord.notes}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ord.timestamp}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {ord.status === 'Pending' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Kitchen Preparing')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px]"
                        >
                          A Cocinar
                        </button>
                      )}
                      {ord.status === 'Kitchen Preparing' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Ready to Serve')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                        >
                          Listo!
                        </button>
                      )}
                      {ord.status === 'Ready to Serve' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'Completed')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-[11px]"
                        >
                          Entregado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: DIGITAL MENU MANAGER */}
        {activeSubTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800">Menú Gastronómico y Precios</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((dish) => (
                <div key={dish.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                  {dish.imageUrl && (
                    <img src={dish.imageUrl} alt={dish.name} className="h-36 w-full object-cover" />
                  )}
                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        {dish.category}
                      </span>
                      <span className="font-bold text-sm text-slate-900">${dish.price.toFixed(2)} USD</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{dish.name}</h4>
                    <p className="text-xs text-slate-500">{dish.description}</p>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className={`font-bold ${dish.isAvailable ? 'text-emerald-600' : 'text-red-600'}`}>
                      {dish.isAvailable ? 'Disponible' : 'Agotado'}
                    </span>
                    <button
                      onClick={() => onToggleMenuItemAvailability(dish.id)}
                      className="px-3 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {dish.isAvailable ? 'Marcar Agotado' : 'Marcar Disponible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 4: QR & WHATSAPP SETTINGS */}
        {activeSubTab === 'qr' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 max-w-3xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Carta Digital QR & Auto-Atención por WhatsApp</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Los comensales escanean el código QR pegado en su mesa. Se abre la carta digital interactiva en su teléfono y la orden se confirma automáticamente por WhatsApp.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-800">Generador de QR por Mesa</h4>
                <p className="text-slate-500">Imprimí tus códigos QR para cada sector de tu local:</p>
                <div className="pt-2 flex justify-center">
                  <div className="bg-white p-4 border border-slate-200 rounded-xl text-center space-y-2 shadow-xs">
                    <QrCode className="w-24 h-24 mx-auto text-slate-800" />
                    <p className="font-bold text-slate-900 font-mono text-xs">Mesa 04 - Terraza</p>
                    <p className="text-[10px] text-slate-400">https://menu.acme.clientum.com.ar/table/m04</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <h4 className="font-bold text-slate-800">Plantilla Automática de Confirmación WhatsApp</h4>
                <div className="bg-emerald-950 text-emerald-100 p-3 rounded-lg border border-emerald-800 font-mono text-[11px] space-y-1">
                  <p className="font-bold text-emerald-400">🤖 Clientum Bot Gastronómico:</p>
                  <p>¡Hola! Confirmamos tu pedido para la <b>Mesa 04</b>.</p>
                  <p>• 2x Hamburguesa Smash Trufada</p>
                  <p>• 1x Volcán de Chocolate</p>
                  <p>Total: <b>$31.00 USD</b></p>
                  <p className="text-emerald-400 text-[10px] pt-1">Tu comandero ya recibió la orden en cocina. 🍔🔥</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW ORDER MODAL */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <UtensilsCrossed className="w-4 h-4 mr-2 text-amber-600" />
                Nueva Comanda / Pedido de Mesa
              </h3>
              <button onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mesa</label>
                  <select
                    value={orderTable}
                    onChange={(e) => setOrderTable(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.tableNumber}>
                        {t.tableNumber} ({t.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre del Comensal</label>
                  <input
                    type="text"
                    placeholder="ej. Juan Pérez"
                    value={orderCustomerName}
                    onChange={(e) => setOrderCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Seleccionar Platos del Menú</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto border border-slate-200 p-2 rounded bg-slate-50">
                  {menuItems.map(dish => (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => handleAddItemToNewOrder(dish)}
                      className="px-2 py-1 bg-white hover:bg-amber-50 border border-slate-200 rounded text-slate-800 font-medium"
                    >
                      + {dish.name} (${dish.price})
                    </button>
                  ))}
                </div>
              </div>

              {selectedMenuItems.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1.5">
                  <p className="font-bold text-slate-800">Resumen de la Comanda:</p>
                  {selectedMenuItems.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-700 bg-white p-1.5 rounded border border-slate-100">
                      <span>{it.qty}x {it.menuItemName}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">${it.qty * it.price}</span>
                        <button type="button" onClick={() => handleRemoveItemFromNewOrder(idx)} className="text-red-500 font-bold">✕</button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-bold text-slate-900 pt-2 border-t border-slate-200">
                    Total Comanda: ${newOrderTotal.toFixed(2)} USD
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-xs"
                >
                  Enviar a Cocina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
