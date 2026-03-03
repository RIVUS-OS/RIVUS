// RIVUS v1.2.7 — P19: StandardModal
// Reusable modal komponenta, macOS estetika.
// Frosted glass, SF Pro font, rounded corners, subtle shadows.
// Confirmation modali za destructive akcije.
'use client';

import React, { useEffect, useRef } from 'react';

export type ModalVariant = 'default' | 'danger' | 'warning' | 'info';
export type ModalSize = 'sm' | 'md' | 'lg';

interface StandardModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: ModalVariant;
  size?: ModalSize;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  preventClose?: boolean;
}

const SIZE_MAP: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

const VARIANT_STYLES: Record<ModalVariant, {
  icon: string;
  iconBg: string;
  confirmBtn: string;
}> = {
  default: {
    icon: '',
    iconBg: '',
    confirmBtn: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  danger: {
    icon: '\u26A0\uFE0F',
    iconBg: 'bg-red-50',
    confirmBtn: 'bg-red-500 hover:bg-red-600 text-white',
  },
  warning: {
    icon: '\u26A0\uFE0F',
    iconBg: 'bg-amber-50',
    confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  info: {
    icon: '\u2139\uFE0F',
    iconBg: 'bg-blue-50',
    confirmBtn: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
};

export function StandardModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'default',
  size = 'md',
  confirmLabel = 'Potvrdi',
  cancelLabel = 'Odustani',
  onConfirm,
  confirmLoading = false,
  preventClose = false,
}: StandardModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || preventClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose, preventClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  const styles = VARIANT_STYLES[variant];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && !preventClose) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        className={`${SIZE_MAP[size]} w-full mx-4 overflow-hidden`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '14px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-start gap-3">
            {styles.icon && (
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${styles.iconBg}`}>
                <span className="text-lg">{styles.icon}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 leading-tight">
                {title}
              </h3>
              {description && (
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {!preventClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1l10 10M11 1L1 11" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        {children && (
          <div className="px-6 py-4 text-sm text-gray-600">
            {children}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-2.5"
          style={{ borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}
        >
          {footer ?? (
            <>
              {!preventClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {cancelLabel}
                </button>
              )}
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  disabled={confirmLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmBtn}`}
                >
                  {confirmLoading ? 'Obrada...' : confirmLabel}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// HARD BLOCK modal — ne moze se zatvoriti, prikazuje blocking obligations
export function HardBlockModal({
  open,
  title = 'Akcija blokirana',
  obligations,
}: {
  open: boolean;
  title?: string;
  obligations: Array<{ id: string; title: string; severity: string }>;
}) {
  if (!open || obligations.length === 0) return null;

  return (
    <StandardModal
      open={open}
      onClose={() => {}}
      title={title}
      description="Sljedece obveze moraju biti ispunjene prije nastavka:"
      variant="danger"
      size="md"
      preventClose
      footer={
        <div className="w-full text-center">
          <p className="text-xs text-gray-400">
            Kontaktirajte CORE administratora za pomoc.
          </p>
        </div>
      }
    >
      <div className="space-y-2">
        {obligations.map((ob) => (
          <div
            key={ob.id}
            className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100"
          >
            <span className="text-red-500 mt-0.5 flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM8.75 4.25a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4z" />
              </svg>
            </span>
            <span className="text-sm text-red-800 font-medium">{ob.title}</span>
          </div>
        ))}
      </div>
    </StandardModal>
  );
}
