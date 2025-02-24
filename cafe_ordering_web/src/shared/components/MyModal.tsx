import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface MyModalProps {
  isOpen: boolean;
  title?: string;
  onCloseClicked: () => void;
  children: React.ReactNode;
  isfullScreen?: boolean;
  className?: string;
}

const MyModal: React.FC<MyModalProps> = ({
  isfullScreen = true,
  isOpen,
  children,
  onCloseClicked,
  className,
}) => {
  return (
    <Box component="div" className={`${className ?? ''}`}>
      <Dialog
        open={isOpen}
        onClose={onCloseClicked}
        fullScreen={isfullScreen}
        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        PaperProps={{
          sx: {
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
          },
        }}
      >
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

        <Box
          className="scrollbar-none scrollbar-track-gray-200 scrollbar-thumb-gray-500"
          style={{ overflowY: 'scroll' }}
          sx={{ minWidth: '120px', padding: 0, margin: 0 }}
        >
          <DialogContent sx={{ marginTop: 0 }}>{children}</DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MyModal;
