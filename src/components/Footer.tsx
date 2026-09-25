import { useBusiness } from '../context/BusinessContext';

export default function Footer() {
  const { settings } = useBusiness();

  const hasContactInfo = settings.whatsapp_number || settings.email || settings.address || settings.instagram || settings.facebook;

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-12">
      {/* Sección de contacto */}
      {hasContactInfo && (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Contacto</h2>
            <p className="text-zinc-400 text-sm">
              ¿Tenés dudas? Escribinos por cualquiera de estos medios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {/* WhatsApp */}
            {settings.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-green-500/50 transition-all group"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.594-.838-6.32-2.234l-.442-.364-3.09 1.036 1.036-3.09-.364-.442A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">WhatsApp</p>
                  <p className="text-zinc-400 text-xs truncate">Escribinos directo</p>
                </div>
              </a>
            )}

            {/* Email */}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">Email</p>
                  <p className="text-zinc-400 text-xs truncate">{settings.email}</p>
                </div>
              </a>
            )}

            {/* Instagram */}
            {settings.instagram && (
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-pink-500/50 transition-all group"
              >
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-pink-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">Instagram</p>
                  <p className="text-zinc-400 text-xs truncate">@{settings.instagram}</p>
                </div>
              </a>
            )}

            {/* Facebook */}
            {settings.facebook && (
              <a
                href={settings.facebook.startsWith('http') ? settings.facebook : `https://facebook.com/${settings.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-blue-500/50 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">Facebook</p>
                  <p className="text-zinc-400 text-xs truncate">Visitanos</p>
                </div>
              </a>
            )}

            {/* Dirección */}
            {settings.address && (
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">Dirección</p>
                  <p className="text-zinc-400 text-xs truncate">{settings.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Copyright */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img 
              src="https://fwempizdkfvorzfzjgtg.supabase.co/storage/v1/object/public/jerseys/products/1790305089491-hn6warfj9cb.jpg"
              alt="Logo"
              className="w-7 h-7 object-contain rounded-md"
            />
            <span className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} {settings.business_name}. Todos los derechos reservados.
            </span>
          </div>
          <a
            href="/admin/login"
            className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
