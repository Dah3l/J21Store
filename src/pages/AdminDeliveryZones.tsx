import { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { supabase } from '../lib/supabase';

export default function AdminDeliveryZones() {
  const { zones, refreshZones } = useDelivery();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Zonas de Entrega</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Editá los precios de envío para cada zona. Los cambios se reflejan inmediatamente.
        </p>
      </div>

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
                      <button
                        onClick={() => handleEdit(zone.id, zone.price)}
                        className="text-zinc-400 hover:text-emerald-400 text-sm transition-colors"
                      >
                        Editar
                      </button>
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
