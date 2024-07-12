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
      }, 1000); // Close after 2 seconds
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
          backgroundColor: '#f9f9f9',
          boxShadow: 'none',
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" style={{ color: '#4caf50' }}>
        {"Success"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{ color: '#333' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{ color: '#4caf50' }}>
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
