import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTeacherRequests } from '../../services/teacher_requests';
import { Avatar, Button, Divider } from '@mui/material';
import MyAccordion from '../../components/Accordion';
import { toast } from 'react-toastify';
import CallIcon from '@mui/icons-material/Call';
import ResponseModal from './ResponseModal';

export default function TeacherRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [loading, setLoading] = useState(true);
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
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teacher requests:', error);
            setRequests([]);
            setLoading(false);
        }
    }
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

    if (loading) {
        return <div></div>;
    }

    return (
       <div className="flex flex-col items-center justify-start min-h-screen">
            <ResponseModal open={openResponseModal} handleClose={handleCloseResponseModal} requestData={requestData} refresh={fetchRequests}/>
            <h1 className="flex text-2xl font-semibold self-start mb-4">รายการคำขอจากนักเรียน</h1>
            <Divider className="w-full" />
            <div className="w-full max-w-2xl my-4">
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
                    <p className="text-gray-500">คุณยังไม่มีคำขอใด ๆ</p>
                )}
            </div>
        </div>
    );
}