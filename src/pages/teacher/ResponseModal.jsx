import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import MyTextField from '../../components/TextField';
import MyCheckBox from '../../components/Checkbox';
import { toast } from 'react-toastify';
import { updateRequest } from '../../services/request';

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

export default function ResponseModal({open, handleClose, requestData, refresh}) {
    const [responseMessage, setResponseMessage] = useState('');
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (open) {
            setResponseMessage('');
            setCheck(false);
        }
    }, [open, requestData]);

    const handleResponse = async () => {
        if (!responseMessage.trim()) {
            toast.error('กรุณากรอกข้อความตอบกลับ');
            return;
        }
        const confirmation = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการตอบกลับคำขอนี้? (ไม่สามารถแก้ไขได้หลังจากตอบกลับ)');
        if (!confirmation) {
            return;
        }
        try {
            const response = await updateRequest(requestData?.request_id, {
                teacher_response_comment: responseMessage,
                show_teacher_contacts: check,
                request_status: 'accepted',
                teacher_response_time: new Date().toISOString(),
            });
            if (response) {
                toast.success('ตอบกลับคำขอเรียบร้อยแล้ว');
                setResponseMessage('');
                setCheck(false);
                handleClose();
                refresh(); // Refresh the requests list after response
            } else {
                toast.error('ไม่สามารถตอบกลับคำขอได้');
            }
        } catch (error) {
            console.error('Error updating request:', error);
            toast.error('เกิดข้อผิดพลาดในการตอบกลับคำขอ');
        }
    }

    const handleReject = async () => {
        if (!responseMessage.trim()) {
            toast.error('กรุณากรอกข้อความตอบกลับ');
            return;
        }
        const confirmation = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธคำขอนี้? (ไม่สามารถแก้ไขได้หลังจากตอบกลับ)');
        if (!confirmation) {
            return;
        }
        try {
            const response = await updateRequest(requestData?.request_id, {
                teacher_response_comment: responseMessage,
                show_teacher_contacts: false,
                request_status: 'rejected',
                teacher_response_time: new Date().toISOString(),
            });
            if (response) {
                toast.success('ปฏิเสธคำขอเรียบร้อยแล้ว');
                setResponseMessage('');
                setCheck(false);
                handleClose();
                refresh(); // Refresh the requests list after response
            } else {
                toast.error('ไม่สามารถปฏิเสธคำขอได้');
            }
        } catch (error) {
            console.error('Error updating request:', error);
            toast.error('เกิดข้อผิดพลาดในการปฏิเสธคำขอ');
        }
    }

   
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
                <div className='flex flex-col mb-4'>
                    <h1 className='text-2xl'>ตอบกลับคำขอ</h1>
                    <p className='text-sm text-gray-600'>นักเรียน: {requestData?.student_profiles?.full_name}</p>
                </div>
                <div className='flex flex-col gap-0'>
                    <MyTextField
                        label="ข้อความตอบกลับ"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        required
                        showCounter={true}
                        maxLength={500}
                    />
                    <MyCheckBox
                        label="แสดงข้อมูลการติดต่อกับนักเรียน"
                        check={check}
                        onChange={(e) => setCheck(e.target.checked)}
                    />
                    { check && (
                    <p className='text-red-500 text-xs'>คำเตือน: นักเรียนคนนี้สามารถติดต่อกลับหาคุณได้</p>   
                    )}
                </div>
                <div className='flex justify-between gap-2 mt-4'>
                    <Button 
                        variant="contained" 
                        color="error" 
                        className='w-full md:w-[150px]'
                        onClick={() => handleReject()}
                    >
                        ปฏิเสธคำขอ
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className='w-full md:w-[150px]'
                        onClick={() => handleResponse()}
                    >
                        ตอบกลับ
                    </Button>
                </div>
            </Box>
        </Modal>
        </div>
    );
}