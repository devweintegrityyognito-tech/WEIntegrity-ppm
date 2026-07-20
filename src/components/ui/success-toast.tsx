import { X } from "lucide-react";

interface SuccessToastProps {
  message: string;
  onClose: () => void;
}

export default function SuccessToast({ message, onClose }: SuccessToastProps) {
  return (
    <div className="flex items-center justify-between min-w-[320px] rounded-lg bg-green-500 px-5 py-4 text-white shadow-xl">
      <span className="font-medium">{message}</span>

      <button onClick={onClose} className="ml-6 rounded p-1 transition hover:bg-white/20">
        <X size={18} />
      </button>
    </div>
  );
}
