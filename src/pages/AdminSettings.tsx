import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BusinessSettings, DEFAULT_SETTINGS } from '../types';
import { useBusiness } from '../context/BusinessContext';

export default function AdminSettings() {
  const { settings, refreshSettings } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    business_name: '',
    whatsapp_number: '',
    email: '',
    address: '',
    instagram: '',
    facebook: '',
    description: '',
  });

  useEffect(() => {
    setFormData({
      business_name: settings.business_name || DEFAULT_SETTINGS.business_name,
      whatsapp_number: settings.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number,
      email: settings.email || '',
      address: settings.address || '',
      instagram: settings.instagram || '',
      facebook: settings.facebook || '',
      description: settings.description || '',
    });
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Verificar si ya existe una fila
    const { data: existing } = await supabase
      .from('business_settings')
      .select('id')
      .single();

    let error;
    if (existing) {
      // Actualizar
      const result = await supabase
        .from('business_settings')
        .update(formData)
        .eq('id', existing.id);
      error = result.error;
    } else {
      // Insertar
      const result = await supabase
        .from('business_settings')
        .insert([formData]);
      error = result.error;
    }

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      setSuccess(true);
      await refreshSettings();
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Configuración del Negocio</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Estos datos se muestran en la sección de contacto de tu tienda.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3 mb-4">
          ✓ Configuración guardada correctamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="text-emerald-400">🏪</span> Información General
          </h3>
          <div>
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Nombre del negocio</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="J21 Store"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none resize-none"
              placeholder="Tu tienda de camisetas de fútbol..."
            />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="text-emerald-400">📱</span> Contacto
          </h3>
          <div>
            <label className="text-zinc-400 text-xs font-medium mb-1 block">
              WhatsApp <span className="text-zinc-600">(con código de país, sin + ni espacios)</span>
            </label>
            <input
              type="text"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="5491112345678"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="contacto@j21store.com"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="Av. Siempre Viva 1234, Buenos Aires"
            />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="text-emerald-400">🌐</span> Redes Sociales
          </h3>
          <div>
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Instagram</label>
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden focus-within:border-emerald-500">
              <span className="text-zinc-500 text-sm pl-3">@</span>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="flex-1 bg-transparent px-2 py-2.5 text-white text-sm focus:outline-none"
                placeholder="j21store"
              />
            </div>
          </div>
          <div>
            <label className="text-zinc-400 text-xs font-medium mb-1 block">Facebook</label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="https://facebook.com/j21store"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </form>
    </div>
  );
}
