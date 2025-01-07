import React from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-yellow-50 p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-yellow-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-yellow-100 transition-colors"
          >
            <X className="h-5 w-5 text-yellow-700" />
          </button>
        </div>

        {/* Content */}
        <div className="text-yellow-900">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
