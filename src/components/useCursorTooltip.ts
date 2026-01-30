import { useCallback, useEffect, useRef, useState } from 'react';

type CursorPosition = { x: number; y: number };

const TOOLTIP_OFFSET_X = 16;
const TOOLTIP_OFFSET_Y = 18;
const VIEWPORT_PADDING = 12;

export function useCursorTooltip(isEnabled: boolean) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<CursorPosition>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    if (!isEnabled || !tooltipRef.current) return;

    const { x, y } = cursorRef.current;
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const maxLeft = window.innerWidth - tooltipRect.width - VIEWPORT_PADDING;
    const maxTop = window.innerHeight - tooltipRect.height - VIEWPORT_PADDING;

    let left = x + TOOLTIP_OFFSET_X;
    let top = y + TOOLTIP_OFFSET_Y;

    if (left > maxLeft) {
      left = x - TOOLTIP_OFFSET_X - tooltipRect.width;
    }
    if (top > maxTop) {
      top = y - TOOLTIP_OFFSET_Y - tooltipRect.height;
    }

    left = Math.max(VIEWPORT_PADDING, Math.min(left, maxLeft));
    top = Math.max(VIEWPORT_PADDING, Math.min(top, maxTop));

    setTooltipStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
    });
  }, [isEnabled]);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updatePosition();
    });
  }, [updatePosition]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      cursorRef.current = { x: event.clientX, y: event.clientY };
      if (isVisible) {
        scheduleUpdate();
      }
    },
    [isVisible, scheduleUpdate]
  );

  const show = useCallback(
    (event?: React.MouseEvent | MouseEvent) => {
      if (!isEnabled) return;
      if (event) {
        cursorRef.current = { x: event.clientX, y: event.clientY };
      }
      setIsVisible(true);
      scheduleUpdate();
    },
    [isEnabled, scheduleUpdate]
  );

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const handleResize = () => scheduleUpdate();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isEnabled, scheduleUpdate]);

  useEffect(() => {
    if (!isEnabled) {
      setIsVisible(false);
    }
  }, [isEnabled]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    isVisible,
    tooltipRef,
    tooltipStyle,
    show,
    hide,
    handleMouseMove,
  };
}
