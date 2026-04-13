import { AlertTriangle, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'info' | 'success';
}

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  variant = 'info' 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const themes = {
    danger: { bg: 'bg-red-50', icon: 'text-[#FF5252]', btn: 'bg-[#FF5252] hover:bg-[#ff3a3a] shadow-red-200' },
    info: { bg: 'bg-blue-50', icon: 'text-[#007BFF]', btn: 'bg-[#007BFF] hover:bg-[#0069d9] shadow-blue-200' },
    success: { bg: 'bg-emerald-50', icon: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' }
  };

  const theme = themes[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      
      <div className="relative bg-white rounded-[2rem] p-8 shadow-2xl max-w-sm w-full border border-white animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-5 ${theme.bg}`}>
            {variant === 'danger' ? <AlertTriangle className={`size-10 ${theme.icon}`} /> : <Info className={`size-10 ${theme.icon}`} />}
          </div>
          <h3 className="text-2xl font-black text-[#1A237E]">{title}</h3>
          <div className="text-slate-500 mt-3 leading-relaxed">{message}</div>
        </div>
        
        <div className="flex gap-3 mt-8">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-3.5 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 px-4 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${theme.btn}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}