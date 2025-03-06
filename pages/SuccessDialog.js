import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useEffect } from 'react';

const SuccessDialog = ({ open, handleClose, message }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        handleClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [open, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
          padding: '16px',
          maxWidth: '400px'
        },
      }}
    >
      <DialogTitle 
        id="alert-dialog-title" 
        style={{ 
          color: '#32699B',
          fontWeight: 600,
          padding: '8px 16px'
        }}
      >
        {"Success"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText 
          id="alert-dialog-description" 
          style={{ 
            color: '#333333',
            padding: '8px 16px'
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          style={{ 
            backgroundColor: '#3F8271',
            color: '#ffffff',
            textTransform: 'none',
            padding: '6px 16px',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#367363'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;