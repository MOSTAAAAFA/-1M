import { useEffect, useRef } from 'react';

/**
 * Traps Tab focus inside `ref` while `active`, and restores it on exit.
 *
 * Without this, an open overlay leaves focus on the trigger behind it: a
 * keyboard user tabs into the page they cannot see, which is worse than not
 * opening the menu at all. Also locks background scroll, because a fixed
 * overlay over a scrollable page still lets the page scroll underneath on
 * touch devices.
 *
 * Escape always closes. Nothing else does: the caller decides what "close"
 * means, so the hook just reports it.
 *
 * @param {React.RefObject<HTMLElement>} ref - container to trap within
 * @param {boolean} active
 * @param {() => void} onClose - invoked on Escape
 * @param {{lockScroll?: boolean}} [options]
 */
export default function useFocusTrap(ref, active, onClose, { lockScroll = true } = {}) {
  // Kept in a ref so adding onClose must not tear the trap down and rebuild it.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!active) return undefined;
    const container = ref.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement;

    const focusables = () => {
      // Matches the a11y definition: anything focusable and not hidden. A
      // disabled or aria-hidden node must not be a tab stop.
      return [...container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].filter((el) => {
        if (el.getAttribute('aria-hidden') === 'true') return false;
        if (el.tabIndex < 0) return false;
        // offsetParent is null for display:none; the rect check catches
        // elements hidden by a 0x0 ancestor.
        const r = el.getBoundingClientRect();
        return r.width > 0 || r.height > 0;
      });
    };

    // Move focus into the overlay so the next Tab lands inside it.
    const first = focusables()[0];
    if (first) first.focus();
    else container.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement;

      // Wrap at both ends. Without this, Tab from the last control jumps back
      // out into the page behind the overlay.
      if (e.shiftKey && (active === firstEl || !container.contains(active))) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && (active === lastEl || !container.contains(active))) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    let restoreOverflow = '';
    if (lockScroll) {
      restoreOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      if (lockScroll) document.body.style.overflow = restoreOverflow;
      // Return focus to whatever opened the overlay, so keyboard and mouse
      // users resume from the same place.
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [ref, active, lockScroll]);
}
