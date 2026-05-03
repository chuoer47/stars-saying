"use client";

import { useEffect } from "react";

const horizontalScrollerSelector = ".overflow-x-auto";
const dragThreshold = 4;

function findHorizontalScroller(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const scroller = target.closest<HTMLElement>(horizontalScrollerSelector);

  if (!scroller || scroller.scrollWidth <= scroller.clientWidth) {
    return null;
  }

  return scroller;
}

export function HorizontalDragScroll() {
  useEffect(() => {
    let active:
      | {
          element: HTMLElement;
          moved: boolean;
          pointerId: number;
          scrollLeft: number;
          startX: number;
        }
      | null = null;
    let suppressNextClick = false;

    function stopActiveDrag() {
      if (!active) {
        return;
      }

      active.element.classList.remove("is-dragging-scroll");

      if (active.moved) {
        suppressNextClick = true;
        window.setTimeout(() => {
          suppressNextClick = false;
        }, 90);
      }

      active = null;
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0 || event.pointerType === "touch") {
        return;
      }

      const scroller = findHorizontalScroller(event.target);

      if (!scroller) {
        return;
      }

      active = {
        element: scroller,
        moved: false,
        pointerId: event.pointerId,
        scrollLeft: scroller.scrollLeft,
        startX: event.clientX,
      };
      scroller.classList.add("is-dragging-scroll");
    }

    function handlePointerMove(event: PointerEvent) {
      if (!active || event.pointerId !== active.pointerId) {
        return;
      }

      const deltaX = event.clientX - active.startX;

      if (Math.abs(deltaX) > dragThreshold) {
        active.moved = true;
      }

      if (!active.moved) {
        return;
      }

      active.element.scrollLeft = active.scrollLeft - deltaX;
      event.preventDefault();
    }

    function handleClick(event: MouseEvent) {
      if (!suppressNextClick) {
        return;
      }

      suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", stopActiveDrag, true);
    window.addEventListener("pointercancel", stopActiveDrag, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopActiveDrag, true);
      window.removeEventListener("pointercancel", stopActiveDrag, true);
      document.removeEventListener("click", handleClick, true);
      stopActiveDrag();
    };
  }, []);

  return null;
}
