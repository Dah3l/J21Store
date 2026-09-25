import { useEffect } from 'react';

/**
 * Hook para bloquear el scroll del body cuando un modal está abierto
 * Previene que la página detrás del modal se pueda scrollear
 */
export function useModalScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      // Guardar el overflow original del body
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Calcular el ancho del scrollbar
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Bloquear el scroll y compensar el ancho del scrollbar
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      // Restaurar al desmontar o cuando isOpen cambie a false
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);
}
