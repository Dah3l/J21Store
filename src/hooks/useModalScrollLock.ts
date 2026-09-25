import { useEffect } from 'react';

// Contador global de modales abiertos
let modalCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

/**
 * Hook para bloquear el scroll del body cuando un modal está abierto
 * Previene que la página detrás del modal se pueda scrollear
 * Soporta múltiples modales abiertos simultáneamente
 */
export function useModalScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      // Si es el primer modal, guardar el estado original
      if (modalCount === 0) {
        originalOverflow = document.body.style.overflow;
        originalPaddingRight = document.body.style.paddingRight;
        
        // Calcular el ancho del scrollbar
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        // Bloquear el scroll y compensar el ancho del scrollbar
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      
      modalCount++;
      
      // Restaurar al desmontar o cuando isOpen cambie a false
      return () => {
        modalCount--;
        
        // Si es el último modal en cerrarse, restaurar el estado original
        if (modalCount === 0) {
          document.body.style.overflow = originalOverflow;
          document.body.style.paddingRight = originalPaddingRight;
        }
      };
    }
  }, [isOpen]);
}
