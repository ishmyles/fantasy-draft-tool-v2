import React from "react";
import { ConfirmationModal } from "./ConfirmationModal";

interface ResetDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetDraftModal: React.FC<ResetDraftModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Reset Draft"
      message="Are you sure you want to reset?"
      confirmText="Confirm"
      cancelText="Cancel"
    />
  );
};
