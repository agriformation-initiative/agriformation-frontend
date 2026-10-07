'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'lg';
}

/** Accessible dialog: focus moves in, Tab stays inside, Escape closes, focus returns on close. */
export default function Modal({ title, onClose, children, footer, size = 'lg' }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  // Latest onClose without re-running the focus setup on every parent render
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      panel.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? [];
    focusables()[0]?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key !== 'Tab') return;
      const items = Array.from(focusables()).filter((el) => !el.hasAttribute('disabled'));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center bg-stone-900/50 p-0 sm:items-center sm:p-5" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`flex max-h-dvh w-full flex-col rounded-t-xl bg-white shadow-overlay sm:rounded-xl ${size === 'sm' ? 'sm:max-w-md' : 'sm:max-w-2xl'}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-6 py-4">
          <h2 id="modal-title" className="font-sans text-xl font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 flex h-11 w-11 items-center justify-center rounded-md text-stone-600 hover:bg-stone-100">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-stone-200 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Destructive actions name the thing being removed and use a specific button label. */
export function ConfirmDialog({ title, message, confirmLabel, loading, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal
      size="sm"
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-stone-700">{message}</p>
    </Modal>
  );
}
