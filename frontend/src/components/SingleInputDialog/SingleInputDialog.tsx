import React, { ReactNode } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useTranslation } from "react-i18next";

interface SingleInputDialogProps {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  showSubmitButton?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const SingleInputDialog: React.FC<SingleInputDialogProps> = ({
  title,
  children,
  open,
  onClose,
  onSubmit,
  onCancel,
  showSubmitButton = true,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{t(title)}</DialogTitle>
      <form name={title} onSubmit={onSubmit} acceptCharset="UTF-8">
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="error" variant="outlined">
            {t(cancelLabel)}
          </Button>
          {showSubmitButton && (
            <Button type="submit" color="secondary" variant="outlined">
              {t(submitLabel)}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SingleInputDialog;
