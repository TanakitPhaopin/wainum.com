import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import MyTextField from '../../components/TextField';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";
import StarRateIcon from '@mui/icons-material/StarRate';

export default function Review({teacher_id}) {
    const { user } = useAuth();
    const [openReview, setOpenReview] = useState(false);
    const [reviewComment, setReviewComment] = useState('');
    const [teachingSkillRating, setTeachingSkillRating] = useState(0);
    const [onTimeRating, setOnTimeRating] = useState(0);
    const [communicationRating, setCommunicationRating] = useState(0);

    const handleReview = () => {
        if (!user) {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการรีวิว');
            return;
        }
        if (openReview) {
            if (reviewComment.length > 0 && teachingSkillRating > 0 && onTimeRating > 0 && communicationRating > 0) {
                const overRallRating = ((teachingSkillRating + onTimeRating + communicationRating) / 3).toFixed(1);
                const data = {
                    reviewComment: reviewComment,
                    teachingSkillRating: teachingSkillRating,
                    onTimeRating: onTimeRating,
                    communicationRating: communicationRating,
                    overRallRating: overRallRating,
                    student_id: user.id,
                    teacher_id: teacher_id,
                }
                // Submit review to server
                handleSubmitReview(data);
            } else {
                toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }
            setOpenReview(false);
        }
        else {
            setOpenReview(true);
        }
        setReviewComment('');
        setTeachingSkillRating(0);
        setOnTimeRating(0);
        setCommunicationRating(0);
    }

    const handleChangeReviewComment = (event) => {
        setReviewComment(event.target.value);
    }

    const handleSubmitReview = (data) => {
        if (!user) {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการรีวิว');
            return;
        }
        const submitReview = window.confirm('คุณต้องการโพสต์รีวิวหรือไม่? (ไม่สามารถแก้ไขได้)');
        if (!submitReview) {
            toast.error('ยกเลิกการโพสต์รีวิว');
            return;
        }
        console.log('Submit review:', data);
        
    }
    return (
        <div className="flex flex-col p-2 items-center justify-center h-auto bg-white rounded-xl shadow-[0_0_20px] shadow-black/30">
            <h1 className="text-xl font-semibolds">รีวิว</h1>
            <p className="text-3xl font-semibold">4.4</p>
            <Rating name="rating-read" value={2.5} precision={0.5} readOnly />
            <div className={`my-4 w-full ${ openReview && 'p-4 shadow-[0_0_10px] shadow-black/20 rounded-xl'}`}>
                { openReview && (
                <div className='flex flex-col gap-2'>
                    <div className='flex row-2 items-center gap-2 justify-between max-w-80'>
                        <span>ทักษะการสอน</span>
                        <Rating name="rating-read" value={teachingSkillRating} precision={1} onChange={(event, newValue) => {
                            setTeachingSkillRating(newValue);
                        }}/>
                    </div>
                    <div className='flex flex-row items-center gap-2 justify-between max-w-80'>
                        <span>ตรงต่อเวลา</span>
                        <Rating name="rating-read" value={onTimeRating} precision={1} onChange={(event, newValue) => {
                            setOnTimeRating(newValue);
                        }}/>
                    </div>
                    <div className='flex flex-row items-center gap-2 justify-between max-w-80'>
                        <span>การสื่อสาร</span>
                        <Rating name="rating-read" value={communicationRating} precision={1} onChange={(event, newValue) => {
                            setCommunicationRating(newValue);
                        }}/>
                    </div>
                    <MyTextField
                        label="เขียนรีวิว"
                        value={reviewComment}
                        onChange={handleChangeReviewComment}
                        multiline={true}
                        rows={4}
                        maxLength={1500}
                        id="review"
                        required={false}
                        disabled={!openReview}
                        showCounter={true}
                    />
                </div>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    className="w-full"
                    onClick={() => handleReview()}
                >
                    {openReview ? "โพสต์รีวิว" : "เขียนรีวิว"}
                </Button>
            </div>
            {/* Review comments */}
            <div className='w-full my-2 max-h-150 overflow-auto'>
                <Stack
                    direction={"column"}
                    spacing={2}>
                    {/* Review items */}
                    <div className="flex flex-col gap-1 p-2">
                        <div className='flex flex-row items-center gap-2'>
                            <Avatar sx={{ bgcolor: 'purple' }}>ก</Avatar>
                            <div className='flex flex-col gap-0.5'>
                                <p className="text-sm font-semibold">ชื่อผู้รีวิว</p>
                                <Rating name="student-rating" value={3.74} precision={0.5} readOnly size='small' />
                                <p className="text-xs">12/02/2025 2:34 pm</p>   
                            </div>
                        </div>
                        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.</p>
                    </div>
                    <div className="flex flex-col gap-1 p-2">
                        <div className='flex flex-row items-center gap-2'>
                            <Avatar sx={{ bgcolor: 'purple' }}>ก</Avatar>
                            <div className='flex flex-col gap-0.5'>
                                <p className="text-sm font-semibold">ชื่อผู้รีวิว</p>
                                <Rating name="student-rating" value={3.74} precision={0.5} readOnly size='small' />
                                <p className="text-xs">12/02/2025 2:34 pm</p>   
                            </div>
                        </div>
                        <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.</p>
                    </div>
                </Stack>
            </div>
        </div>
    )
}