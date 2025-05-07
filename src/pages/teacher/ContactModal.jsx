import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

export default function ContactModal({open, handleClose, contacts}) {
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
            <Box display="flex" flexDirection="column" gap={2}>
            {contacts.map((contact, index) => {
              let href = '';
              let displayValue = '';

              switch (contact.type) {
                case 'phone':
                    displayValue = contact.value;
                    href = `tel:${contact.value}`;
                    break;
                case 'email':
                    displayValue = 'Email';
                    href = `mailto:${contact.value}`;
                    break;
                case 'facebook link':
                    displayValue = 'Facebook';
                    href = contact.value;
                    break;
                case 'instagram link':
                    displayValue = 'Instagram';
                    href = contact.value;
                    break;
                case 'line id':
                    displayValue = 'Line';
                    href = `https://line.me/ti/p/${contact.value}`;
                    break;
                default:
                    href = '#';
              }

              return (
                <Button
                  key={index}
                  variant="contained"
                  onClick={() => {
                    if (href !== '#') window.open(href, '_blank', 'noopener,noreferrer');
                  }}
                  sx={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#0056b3',
                    },
                  }}
                >
                  {contact.type === 'phone' ? `โทร: ${displayValue}` : displayValue}
                </Button>
              );
            })}
          </Box>
          </div>
        </Box>
      </Modal>
    </div>
  );
}