import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMyRequests, deleteRequest } from '../../services/request';
import { Avatar, Button, Divider } from '@mui/material';
import MyAccordion  from '../../components/Accordion';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import ContactModal from '../teacher/ContactModal';
import VerifiedIcon from '@mui/icons-material/Verified';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from "motion/react"

export default function StudentRequests() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openContactModal, setOpenContactModal] = useState(false);
    const [teacherContacts, setTeacherContacts] = useState(null);
    const handleCloseContactModal = () => {
        setOpenContactModal(false);
    }

    const handleOpenContactModal = (contacts) => {
        setTeacherContacts(contacts);
        setOpenContactModal(true);
    }

    const fetchRequests = async () => {
            if (user) {
                setLoading(true);
                const myRequests = await getMyRequests(user.id);
                setRequests(myRequests);
                setLoading(false);
            }

        };
    useEffect(() => {
        fetchRequests();
    }, [user]);

    const statusStyle = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-500 border-1 border-yellow-500 rounded-full px-1 py-0.5';
            case 'accepted':
                return 'text-green-500 border-1 border-green-500 rounded-full px-1 py-0.5';
            case 'rejected':
                return 'text-red-500 border-1 border-red-500 rounded-full px-1 py-0.5';
            default:
                return 'text-gray-500  border-1 border-gray-500 rounded-full px-1 py-0.5';
        }
    }

    const handleDeleteRequest = async (requestId) => {
        const confirmation = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำขอนี้?');
        if (!confirmation) {
            return;
        }
        try {
            const success = await deleteRequest(requestId);
            if (success) {
                setRequests(requests.filter(request => request.request_id !== requestId));
                toast.success('คำขอถูกยกเลิกเรียบร้อยแล้ว');
            } else {
                toast.error('ไม่สามารถยกเลิกคำขอได้');
            }
        } catch (error) {
            console.error('Error deleting request:', error);
            toast.error('เกิดข้อผิดพลาดในการยกเลิกคำขอ');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col gap-2">
                <CircularProgress size={60} />
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen">
            <ContactModal open={openContactModal} handleClose={handleCloseContactModal} contacts={teacherContacts} />
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                delay={0.2}
                className="flex text-2xl font-semibold self-start mb-4">รายการคำขอของคุณ</motion.h1>
            <Divider className="w-full" />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                delay={0.3}
                className="w-full max-w-2xl my-4">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        // Display each request
                        <div 
                            key={request.request_id} 
                            className="bg-gray-100 mb-4 p-4 rounded-lg shadow-lg flex flex-col gap-2"
                        >
                            {/* First Section */}
                            <div className='flex flex-row items-center gap-4 py-2'>
                                <Avatar 
                                    src={request.swim_teacher_profiles.profile_picture}
                                    alt={request.swim_teacher_profiles.display_name}
                                    style={{ width: 60, height: 60 }}
                                    onClick={() => navigate(`/teacher/${request.teacher_id}`)}
                                />
                                <div className='w-full'>
                                    <h2 className="text-lg font-semibold break-words line-clamp-1">{request.swim_teacher_profiles.display_name} {request.swim_teacher_profiles.is_subscribed && (<VerifiedIcon fontSize='small' sx={{color: '#0070ff'}} className='animate-pulse'/>)}</h2>
                                    <span className={`${statusStyle(request.request_status)} text-sm`}>{request.request_status}</span>
                                </div>
                            </div>
                            {/* Second Section */}
                            <div className='w-full'>
                                <p className='text-md text-black break-words whitespace-normal'>{!request.teacher_response_comment ? "ยังไม่มีการตอบกลับ" : request.teacher_response_comment}</p>
                                { request.teacher_response_comment && (
                                    <p className='text-xs text-gray-500'>ตอบกลับเมื่อ: {new Date(request.teacher_response_time).toLocaleString()}</p>
                                )}
                            </div>
                            {/* Third Section */}
                            <div className='w-full'>
                                <MyAccordion
                                    data={[
                                        {
                                            title: 'รายละเอียดคำขอ',
                                            content: (
                                                <div className='flex flex-col gap-0.5'>
                                                    <p className="text-base break-words whitespace-normal">{request.request_message}</p>
                                                    <p className="text-sm text-gray-600">เบอร์โทรศัพท์: {request.phone_number}</p>
                                                    <p className='text-xs text-gray-500'>วันที่ส่งคำขอ: {new Date(request.created_at).toLocaleString()}</p>
                                                </div>
                                            ),
                                            titleStyle: 'text-gray-500 text-sm',
                                            sx: { backgroundColor: '#f0f0f0',},
                                        },
                                    ]}
                                />
                            </div>
                            {/* Fourth Section */}
                            <div className='w-full flex justify-between mt-2'>
                                {request.request_status === 'pending' ? (
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        className="mr-2"
                                        onClick={() => handleDeleteRequest(request.request_id)}
                                    >
                                        ยกเลิกคำขอ
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="outlined" 
                                        color="inherit" 
                                        onClick={() => navigate(`/teacher/${request.teacher_id}`)}
                                    >
                                        โปรไฟล์ครู
                                    </Button>
                                )}
                                { request.show_teacher_contacts && (
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        className="ml-2"
                                        onClick={() => handleOpenContactModal(request.swim_teacher_profiles.contacts)}
                                    >
                                        ข้อมูลการติดต่อ
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">คุณยังไม่มีคำขอใด ๆ</p>
                )}
            </motion.div>
        </div>
    );
}