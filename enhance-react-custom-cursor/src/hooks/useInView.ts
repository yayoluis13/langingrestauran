import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  /** If true, once visible it stays visible forever (never re-triggers). Default: false */
  once?: boolean;
}

/**
 * Tracks whether an element is currently inside the viewport.
 * By default it keeps toggling true/false as the element enters and leaves
 * the viewport, so entrance animations can replay both when scrolling down
 * AND when scrolling back up.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.2, rootMargin = "0px", once = false } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);
  const hasBeenVisible = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenVisible.current = true;
          setIsInView(true);
        } else if (!once || !hasBeenVisible.current) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isInView };
}
