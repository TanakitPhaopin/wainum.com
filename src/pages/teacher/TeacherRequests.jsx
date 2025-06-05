import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTeacherRequests } from '../../services/teacher_requests';
import { Avatar, Button, Divider } from '@mui/material';
import MyAccordion from '../../components/Accordion';
import { toast } from 'react-toastify';
import CallIcon from '@mui/icons-material/Call';
import ResponseModal from './ResponseModal';
import MyChip from '../../components/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from "motion/react"

export default function TeacherRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        accepted: 0,
        rejected: 0,
    });
    const handleCloseResponseModal = () => {
        setOpenResponseModal(false);
    }
    const handleOpenResponseModal = (requestData) => {
        setRequestData(requestData);
        setOpenResponseModal(true);
    }
    
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await getTeacherRequests(user.id);
            const getStatusCounts = statusCount(data);
            setStatusCounts(getStatusCounts);
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teacher requests:', error);
            setRequests([]);
            setLoading(false);
        }
    }

    // Function to count the number of requests by status
    const statusCount = (data) => data.reduce((acc, req) => {
        acc[req.request_status] = (acc[req.request_status] || 0) + 1;
        return acc;
    }, {});

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

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
    }

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
            <ResponseModal open={openResponseModal} handleClose={handleCloseResponseModal} requestData={requestData} refresh={fetchRequests}/>
            <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}  
                className="flex text-2xl font-semibold self-start mb-4">รายการคำขอจากนักเรียน</motion.h1>
            <Divider className="w-full" />
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='w-full flex flex-row items-center justify-start gap-2 mt-4 overflow-auto'>
                <MyChip 
                    label={`pending (${statusCounts.pending || 0})`}
                    variant="outlined"
                    size="small"
                    sx={{
                        backgroundColor: selectedStatus === 'pending' ? '#ff9800' : '#e5e7eb',
                        color: selectedStatus === 'pending' ? '#ffffff' : '#1f2937',          
                        border: '1px solid',
                        borderColor: selectedStatus === 'pending' ? '#ff9800' : '#d1d5db',
                        borderRadius: '0.5rem',
                        textTransform: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s ease-in-out',
                    }}
                    className={`cursor-pointer`}

                    onClick={() => handleStatusChange('pending')}
                />
                <MyChip 
                    label={`accepted (${statusCounts.accepted || 0})`}
                    variant="outlined"
                    size="small"
                    onClick={() => handleStatusChange('accepted')}
                    sx={{
                        backgroundColor: selectedStatus === 'accepted' ? 'green' : '#e5e7eb',
                        color: selectedStatus === 'accepted' ? '#ffffff' : '#1f2937',          
                        border: '1px solid',
                        borderColor: selectedStatus === 'accepted' ? 'green' : '#d1d5db',
                        borderRadius: '0.5rem', // rounded-md
                        textTransform: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s ease-in-out',
                    }}
                />
                <MyChip 
                    label={`rejected (${statusCounts.rejected || 0})`}
                    variant="outlined"
                    size="small"
                    onClick={() => handleStatusChange('rejected')}
                    sx={{
                        backgroundColor: selectedStatus === 'rejected' ? 'red' : '#e5e7eb',
                        color: selectedStatus === 'rejected' ? '#ffffff' : '#1f2937',          
                        border: '1px solid',
                        borderColor: selectedStatus === 'rejected' ? 'red' : '#d1d5db',
                        borderRadius: '0.5rem', // rounded-md
                        textTransform: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s ease-in-out',
                    }}
                />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                delay={0.3}
                className="w-full max-w-2xl my-4">
                {requests.filter((request) => request.request_status === selectedStatus).length > 0 ? (
                    requests
                        .filter((request) => request.request_status === selectedStatus)
                        .map((request) => (
                        // Display each request
                        <div 
                            key={request.request_id} 
                            className="bg-gray-100 mb-4 p-4 rounded-lg shadow-lg flex flex-col gap-2"
                        >
                            {/* First Section */}
                            <div className='flex flex-row items-center gap-4 py-2'>
                                <Avatar 
                                    alt={request.student_profiles.full_name}
                                    style={{ width: 60, height: 60}}
                                    sx={{bgcolor: request.student_profiles.profile_color || '#023047'}}

                                >{request.student_profiles.initial}</Avatar>
                                <div className='w-full'>
                                    <h2 className="text-lg font-semibold break-words line-clamp-1">{request.student_profiles.full_name}</h2>
                                    <span className={`${statusStyle(request.request_status)} text-sm`}>{request.request_status}</span>
                                </div>
                            </div>
                            {/* Second Section */}
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
                            {/* Third Section */}
                            <div className="w-full flex flex-col gap-2 md:flex-row md:justify-between md:gap-4">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    onClick={() => window.location.href = `tel:${request.phone_number}`}
                                    className="w-full"
                                    startIcon={<CallIcon />}
                                >
                                    โทรหานักเรียน
                                </Button>
                                { request.request_status === 'pending' && (
                                    <Button
                                        variant="contained"
                                        color="inherit"
                                        fullWidth
                                        onClick={() => handleOpenResponseModal(request)}
                                        className="w-full"
                                    >
                                        ตอบกลับคำขอ
                                    </Button>  
                                )}
                                
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">ไม่มีคำขอในสถานะนี้</p>
                )}
            </motion.div>
        </div>
    );
}