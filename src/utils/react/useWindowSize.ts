import { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Custom hook para detectar y rastrear el tamaño de la ventana
 * Retorna el ancho y alto actual de la ventana y se actualiza automáticamente
 * cuando el usuario redimensiona la ventana
 */
export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Handler para actualizar el estado cuando cambie el tamaño
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Agregar event listener para resize
    window.addEventListener("resize", handleResize);

    // Cleanup: remover event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

/**
 * Hook para detectar si estamos en dispositivo móvil
 * @param breakpoint - Punto de quiebre en píxeles (default: 768)
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const { width } = useWindowSize();
  return width < breakpoint;
};
