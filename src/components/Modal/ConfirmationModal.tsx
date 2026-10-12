import React, { useEffect } from "react";
import { Icon } from "../Icon/Icon";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmBtnBg =
    confirmVariant === "danger"
      ? "tw:bg-red-600 tw:hover:bg-red-700 tw:text-white"
      : "tw:bg-blue-600 tw:hover:bg-blue-700 tw:text-white";

  return (
    <div
      className="tw:fixed tw:inset-0 tw:z-50 tw:bg-black/60 tw:backdrop-blur-xs tw:flex tw:items-center tw:justify-center tw:p-4 tw:transition-opacity"
      onClick={onClose}
    >
      <div
        className="tw:bg-white tw:w-full tw:max-w-sm tw:rounded-xl tw:shadow-2xl tw:border tw:border-gray-200 tw:p-6 tw:relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Warning icon, Title, Close X */}
        <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
          <div className="tw:flex tw:items-center tw:gap-3">
            <div className="tw:w-9 tw:h-9 tw:rounded-full tw:bg-red-100 tw:flex tw:items-center tw:justify-center tw:shrink-0 tw:text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="tw:w-5 tw:h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="tw:text-lg tw:font-bold tw:text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="tw:text-slate-400 tw:hover:text-slate-600 tw:p-1 tw:rounded-lg tw:hover:bg-slate-100 tw:transition-colors tw:cursor-pointer"
            title="Close"
          >
            <Icon name="Close" size={18} />
          </button>
        </div>

        {/* Body Message */}
        <div className="tw:text-sm tw:text-slate-600 tw:mt-4">
          {message}
        </div>

        {/* Action Buttons */}
        <div className="tw:mt-6 tw:flex tw:flex-col-reverse tw:sm:flex-row tw:sm:justify-end tw:gap-2 tw:sm:gap-3">
          <button
            onClick={onClose}
            className="tw:w-full tw:sm:w-auto tw:px-4 tw:py-2 tw:rounded-lg tw:border tw:border-slate-300 tw:text-sm tw:font-semibold tw:text-slate-700 tw:hover:bg-slate-50 tw:transition-colors tw:cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`tw:w-full tw:sm:w-auto tw:px-4 tw:py-2 tw:rounded-lg tw:text-sm tw:font-bold tw:shadow-sm tw:transition-colors tw:cursor-pointer ${confirmBtnBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

