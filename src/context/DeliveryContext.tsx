import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { DeliveryZone, DEFAULT_DELIVERY_ZONES } from '../types';

interface DeliveryContextType {
  zones: DeliveryZone[];
  loading: boolean;
  refreshZones: () => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [zones, setZones] = useState<DeliveryZone[]>(DEFAULT_DELIVERY_ZONES);
  const [loading, setLoading] = useState(true);

  const fetchZones = async () => {
    const { data, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .order('name');

    if (!error && data && data.length > 0) {
      setZones(data as DeliveryZone[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchZones();
  }, []);

  return (
    <DeliveryContext.Provider value={{ zones, loading, refreshZones: fetchZones }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) throw new Error('useDelivery must be used within DeliveryProvider');
  return context;
}
