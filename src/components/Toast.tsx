import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <div id="toast_wrapper" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none">
          <motion.div
            id="toast_body"
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className={`
              pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5
              rounded-2xl shadow-xl border backdrop-blur-md
              ${
                toast.type === 'success'
                  ? 'bg-emerald-50/95 border-emerald-100 text-emerald-800'
                  : toast.type === 'error'
                  ? 'bg-rose-50/95 border-rose-100 text-rose-800'
                  : 'bg-blue-50/95 border-blue-100 text-blue-800'
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle size={18} className="text-rose-500 shrink-0" />
              )}
              <span className="text-xs font-semibold leading-normal">
                {toast.message}
              </span>
            </div>
            <button
              id="btn_toast_close"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
