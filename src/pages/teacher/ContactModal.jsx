import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 1, // mobile
      sm: 1/2, // tablet
      md: 1/3, // laptop
      lg: 1/4, // big desktop
      xl: 1/5, // extra big desktop
    },
    height: {
      xs: 'auto', // mobile
      sm: 'auto', // tablet
      md: 'auto', // laptop
      lg: 'auto', // big desktop
      xl: 'auto', // extra big desktop
   },
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
    maxHeight: 6/6,
    overflowY: "auto",
    borderRadius: 2,
  };

export default function ContactModal({open, handleClose}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h1>ข้อมูลการติดต่อ</h1>
            <a href='tel:0426940468'> 0426940468</a>
            {/* Call */}
            {/* Email */}
            {/* Line ID */}
            {/* Facebook Link */}
          </div>
        </Box>
      </Modal>
    </div>
  );
}