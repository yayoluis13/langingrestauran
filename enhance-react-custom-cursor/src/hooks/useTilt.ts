import { useRef } from "react";

/**
 * Adds a subtle 3D tilt-on-hover interaction to any element.
 * Returns a ref and mouse event handlers to spread onto the target node.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(intensity = 10) {
  const ref = useRef<T | null>(null);

  const onMouseMove = (e: React.MouseEvent<T>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const onMouseLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
  };

  return { ref, onMouseMove, onMouseLeave };
}
