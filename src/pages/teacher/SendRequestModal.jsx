import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import MyTextField from '../../components/TextField';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { sendRequestToTeacher, checkExistingRequest } from '../../services/request';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 1, // mobile
      sm: 5/6, // tablet
      md: 2/3, // laptop
      lg: 1/2, // big desktop
      xl: 1/3, // extra big desktop
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
    p: {
        xs: 2, // mobile
        sm: 3, // tablet
        md: 4, // laptop
        lg: 5, // big desktop
        xl: 6, // extra big desktop
    },
    maxHeight: 6/6,
    overflowY: "auto",
    borderRadius: 2,
  };

export default function SendRequestModal({open, handleClose, teacherId}) {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');

    const handleSendRequest = async () => {
        if (!message || !phone) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^0[689]\d{8}$/;
        if (!phoneRegex.test(phone)) {
            toast.error('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)');
            return;
        }

        const data = {
            student_id: user?.id,
            teacher_id: teacherId,
            message,
            phone,
        };

        try {
            const existingRequest = await checkExistingRequest(user?.id, teacherId);
            if (existingRequest) {
                toast.error('คุณได้ส่งคำขอไปยังครูท่านนี้แล้ว');
                return;
            }
            const success = await sendRequestToTeacher(data);
            if (success) {
                toast.success('ส่งคำขอเรียบร้อยแล้ว');
                setMessage('');
                setPhone('');
                handleClose();
            } else {
                toast.error('เกิดข้อผิดพลาดในการส่งคำขอ');
            }
        }
        catch (error) {
            console.error('Error sending request:', error);
            toast.error('เกิดข้อผิดพลาดในการส่งคำขอ');
        }
    }
  
    return (
        <div>
            <Modal
                open={open}
                onClose={() => {handleClose(); setMessage(''); setPhone('');}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CloseIcon fontSize='large' className='absolute top-3 right-3 cursor-pointer' onClick={handleClose}/>
                    <h1 className='mb-4 text-xl'>ข้อมูลการติดต่อ</h1>
                    <div className='flex flex-col gap-4'>
                        <MyTextField
                        label={"ข้อความ"}
                        multiline
                        rows={6}
                        fullWidth
                        required
                        className='mb-4'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        showCounter={true}
                        maxLength={500}
                        />
                        <MyTextField
                            label={"เบอร์โทรศัพท์"}
                            fullWidth
                            required
                            className='mb-4'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <div className="w-full flex justify-end">
                            <div className="w-full md:w-[150px]">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleSendRequest()}
                                    className="w-full"
                                >
                                    ดำเนินการต่อ
                                </Button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}