import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface MyModalProps {
  isOpen: boolean;
  title?: string;
  onCloseClicked: () => void;
  children: React.ReactNode; // ✅ İçeriği props yerine component arasından alır
}

const MyModal: React.FC<MyModalProps> = ({ isOpen, children, onCloseClicked }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCloseClicked}
      style={{ overflow: 'hidden' }}
      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      PaperProps={{
        sx: {
          margin: 0,
          padding: 2,
          width: 'auto',
          minWidth: '60%',
        },
      }}
    >
      {/* Kapatma Butonu */}
      <IconButton
        aria-label="close"
        onClick={onCloseClicked}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>

      {/* Modal İçeriği */}
      <Box
        className="scrollbar-none scrollbar-track-gray-200 scrollbar-thumb-gray-500"
        style={{ overflowY: 'scroll' }}
        sx={{ minWidth: '100px', padding: 0, margin: 0 }}
      >
        <DialogContent sx={{ marginTop: 0 }}>{children}</DialogContent>
      </Box>
    </Dialog>
  );
};

export default MyModal;
