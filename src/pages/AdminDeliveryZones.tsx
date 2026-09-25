import { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { supabase } from '../lib/supabase';

export default function AdminDeliveryZones() {
  const { zones, refreshZones } = useDelivery();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Estado para nueva zona
  const [showAddForm, setShowAddForm] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZonePrice, setNewZonePrice] = useState('');
  const [adding, setAdding] = useState(false);

  const handleEdit = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditPrice(currentPrice.toString());
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    const newPrice = parseInt(editPrice);
    
    if (isNaN(newPrice) || newPrice < 0) {
      alert('Precio inválido');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('delivery_zones')
      .update({ price: newPrice })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar: ' + error.message);
    } else {
      await refreshZones();
      setEditingId(null);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const handleAddZone = async () => {
    if (!newZoneName.trim()) {
      alert('El nombre de la zona es obligatorio');
      return;
    }

    const price = parseInt(newZonePrice);
    if (isNaN(price) || price < 0) {
      alert('El precio debe ser un número válido');
      return;
    }

    setAdding(true);

    const { error } = await supabase
      .from('delivery_zones')
      .insert([{ name: newZoneName.trim(), price }]);

    if (error) {
      alert('Error al crear zona: ' + error.message);
    } else {
      await refreshZones();
      setNewZoneName('');
      setNewZonePrice('');
      setShowAddForm(false);
    }
    
    setAdding(false);
  };

  const handleDeleteZone = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la zona "${name}"?`)) return;

    const { error } = await supabase
      .from('delivery_zones')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      await refreshZones();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Zonas de Entrega</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Editá los precios de envío para cada zona. Los cambios se reflejan inmediatamente.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
        >
          {showAddForm ? '✕ Cancelar' : '+ Nueva Zona'}
        </button>
      </div>

      {/* Formulario para agregar nueva zona */}
      {showAddForm && (
        <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-4">Agregar Nueva Zona</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-zinc-400 text-xs font-medium mb-1 block">
                Nombre de la zona <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newZoneName}
                onChange={e => setNewZoneName(e.target.value)}
                placeholder="Ej: Playa"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium mb-1 block">
                Precio de envío ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={newZonePrice}
                onChange={e => setNewZonePrice(e.target.value)}
                placeholder="1500"
                min="0"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddZone}
              disabled={adding || !newZoneName.trim() || !newZonePrice}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? 'Agregando...' : 'Agregar Zona'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewZoneName('');
                setNewZonePrice('');
              }}
              className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">Zona</th>
                <th className="text-right text-zinc-400 text-xs font-medium px-4 py-3">Precio</th>
                <th className="text-right text-zinc-400 text-xs font-medium px-4 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {zones.map(zone => (
                <tr key={zone.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <span className="text-white text-sm font-medium">{zone.name}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === zone.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-zinc-400 text-sm">$</span>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-sm focus:border-emerald-500 focus:outline-none"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSave(zone.id);
                            if (e.key === 'Escape') handleCancel();
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-emerald-400 font-semibold">${zone.price.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === zone.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSave(zone.id)}
                          disabled={saving}
                          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {saving ? '...' : 'Guardar'}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(zone.id, zone.price)}
                          className="text-zinc-400 hover:text-emerald-400 text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteZone(zone.id, zone.name)}
                          className="text-zinc-400 hover:text-red-400 text-sm transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          💡 <strong>Tip:</strong> Los clientes que seleccionen "Otra dirección" podrán escribir su dirección manualmente y el costo de envío se coordinará por WhatsApp.
        </p>
      </div>
    </div>
  );
}
