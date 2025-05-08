import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import SvgIcon from "@mui/material/SvgIcon";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 1, // mobile
      sm: 'auto', // tablet
      md: 'auto', // laptop
      lg: 'auto', // big desktop
      xl: 'auto', // extra big desktop
    },
    height: {
      xs: 1, // mobile
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
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [line, setLine] = useState('');
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const LineIcon = (props) => (
        <SvgIcon {...props}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><title/>
                <g data-name="line chat chatting message" id="line_chat_chatting_message">
                    <path d="M30,13.14a1,1,0,0,0-1,1,8.66,8.66,0,0,1-.18,1.67,1.36,1.36,0,0,0,0,.2A7.1,7.1,0,0,1,28,18.26a10.77,10.77,0,0,1-2.79,3.33,43.64,43.64,0,0,1-8.76,5.85l.17-.85A1.76,1.76,0,0,0,15,24.48c-6.44-.57-11.29-5-11.29-10.34C3.69,8.4,9.37,3.72,16.34,3.72A13.3,13.3,0,0,1,27.19,8.78,1,1,0,0,0,28.81,7.6,15.32,15.32,0,0,0,16.34,1.72C8.26,1.72,1.69,7.29,1.69,14.14c0,6.3,5.52,11.56,12.88,12.31L14,29.08a1,1,0,0,0,.37,1,1,1,0,0,0,.61.21,1,1,0,0,0,.45-.11,49.34,49.34,0,0,0,11-7.06,12.55,12.55,0,0,0,3.24-3.89,8.75,8.75,0,0,0,1.1-3.08s0-.08,0-.12A10.64,10.64,0,0,0,31,14.14,1,1,0,0,0,30,13.14Z"/>
                    <path d="M7,11a1,1,0,0,0-1,1v5a1,1,0,0,0,1,1h3a1,1,0,0,0,0-2H8V12A1,1,0,0,0,7,11Z"/>
                    <path d="M12,12v5a1,1,0,0,0,2,0V12a1,1,0,0,0-2,0Z"/>
                    <path d="M19,12v2.15l-2.22-2.77a1,1,0,0,0-1.11-.32A1,1,0,0,0,15,12v5a1,1,0,0,0,2,0V14.85l2.22,2.78A1,1,0,0,0,20,18a1,1,0,0,0,.33-.06A1,1,0,0,0,21,17V12a1,1,0,0,0-2,0Z"/>
                    <path d="M26,13a1,1,0,0,0,0-2H23a1,1,0,0,0-1,1v5a1,1,0,0,0,1,1h3a1,1,0,0,0,0-2H24v-.5h2a1,1,0,0,0,0-2H24V13Z"/>
                </g>
            </svg>        
        </SvgIcon>
      );

    // Check if the link is valid
    const isValidLink = (link) => {
        const regex = /^(https?:\/\/)?(www\.)?(line\.me\/ti\/p\/|facebook\.com\/|instagram\.com\/).+/;
        return regex.test(link);
    };
      

    useEffect(() => {
        if (contacts) {
            contacts.forEach((contact) => {
                switch (contact.type) {
                    case 'phone':
                        setPhone(contact.value);
                        break;
                    case 'email':
                        setEmail(contact.value);
                        break;
                    case 'line link':
                        setLine(isValidLink(contact.value) ? contact.value : '');
                        break;
                    case 'facebook link':
                        setFacebook(isValidLink(contact.value) ? contact.value : '');
                        break;
                    case 'instagram link':
                        setInstagram(isValidLink(contact.value) ? contact.value : '');
                        break;
                    default:
                        break;
                }
            });
        }
    }, [contacts]);

    
    return (
        <div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <CloseIcon fontSize='large' className='absolute top-3 right-3 cursor-pointer' onClick={handleClose}/>
                <h1 className='mb-4 text-2xl'>ข้อมูลการติดต่อ</h1>
                <div className='flex flex-col gap-4'>
                    <Button variant="outlined" color="primary" className="w-full mt-2 mb-2" disabled={!phone} onClick={() => {
                                if (phone) {
                                    window.location.href = `tel:${phone}`;
                                }
                            }
                        }
                        sx={{
                            borderColor: '#007bff',
                            color: '#007bff',
                            '&:hover': {
                              borderColor: '#0056b3',
                              backgroundColor: '#e7f3ff',
                            }
                        }}
                    >
                        <div className='w-full grid grid-cols-2'>
                            <LocalPhoneIcon />
                            <span className="text-lg">{phone}</span>
                        </div>
                    </Button>
                    <Button variant="outlined" color="primary" className="w-full mt-2 mb-2" disabled={!email} onClick={() => {
                                if (email) {
                                    window.open(`mailto:${email}`, '_blank', 'noopener,noreferrer');
                                }
                            }
                        }
                        sx={{
                            borderColor: '#d32f2f',
                            color: '#d32f2f',
                            '&:hover': {
                              borderColor: '#9a0007',
                              backgroundColor: '#ffebee',
                            }
                          }}
                    >
                        <div className='w-full grid grid-cols-2'>
                            <EmailIcon/>
                            <span className="text-lg">Email</span>
                        </div>
                    </Button>
                    <Button variant="outlined" color="primary" className="w-full mt-2 mb-2" disabled={!line} onClick={() => {
                                if (line) {
                                    window.open(line, '_blank', 'noopener,noreferrer');
                                }
                            }
                        }
                        sx={{
                            borderColor: '#00c300',
                            color: '#00c300',
                            '&:hover': {
                              borderColor: '#009f00',
                              backgroundColor: '#e6ffe6',
                            }
                          }}
                    >
                        <div className='w-full grid grid-cols-2'>
                            <LineIcon/>
                            <span className="text-lg">Line</span>
                        </div>
                    </Button>
                    <Button variant="outlined" color="primary" className="w-full mt-2 mb-2" disabled={!facebook} onClick={() => {
                                if (facebook) {
                                    window.open(facebook, '_blank', 'noopener,noreferrer');
                                }
                            }
                        }
                        sx={{
                            borderColor: '#1877f2',
                            color: '#1877f2',
                            '&:hover': {
                              borderColor: '#0d47a1',
                              backgroundColor: '#e3f2fd',
                            }
                          }}
                    >
                        <div className='w-full grid grid-cols-2'>
                            <FacebookIcon/>
                            <span className="text-lg">Facebook</span>
                        </div>
                    </Button>
                    <Button variant="outlined" color="primary" className="w-full mt-2 mb-2" disabled={!instagram} onClick={() => {
                                if (instagram) {
                                    window.open(instagram, '_blank', 'noopener,noreferrer');
                                }
                            }
                        }
                        sx={{
                            borderColor: '#e4405f',
                            color: '#e4405f',
                            '&:hover': {
                              borderColor: '#d81b60',
                              backgroundColor: '#fce4ec',
                            }
                          }}
                    >
                        <div className='w-full grid grid-cols-2'>
                            <InstagramIcon/>
                            <span className="text-lg">Instagram</span>
                        </div>
                    </Button>
                </div>
            </Box>
        </Modal>
        </div>
    );
}