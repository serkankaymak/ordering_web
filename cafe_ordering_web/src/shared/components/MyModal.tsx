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
    <Box component="div" className={`${className ?? ''}  overflow-hidden `}>
      <Dialog
        className=''
        key={"dialog"}
        open={isOpen}
        onClose={onCloseClicked}
        fullScreen={isfullScreen}
        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        PaperProps={{
          sx: {
            margin: 0,
            padding: 0,
            width: '100%',
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
          className="bg-red-600 p-14 "
        >
          <DialogContent className=' '>
            {children}</DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MyModal;
