"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    element.classList.add("page-enter");
    const timer = setTimeout(() => {
      element.classList.remove("page-enter");
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}