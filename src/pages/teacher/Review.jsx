import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import MyTextField from '../../components/TextField';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-toastify";
import { insertReview, getTeacherReviews, deleteMyReview, updateReply } from '../../services/review';
import MyTooltip from '../../components/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';
import ReplyIcon from '@mui/icons-material/Reply';

export default function Review({teacher_id, teacher_picture, setRatingInTeacherPage, setReviewCountInTeacherPage}) {
    const { user } = useAuth();
    const [openReview, setOpenReview] = useState(false);
    const [reviewComment, setReviewComment] = useState('');
    const [teachingSkillRating, setTeachingSkillRating] = useState(0);
    const [onTimeRating, setOnTimeRating] = useState(0);
    const [communicationRating, setCommunicationRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    // Teacher ratings
    const [overall_teaching_skill_rating, setOverallTeachingSkillRating] = useState(0);
    const [overall_on_time_rating, setOverallOnTimeRating] = useState(0);
    const [overall_communication_rating, setOverallCommunicationRating] = useState(0);
    const [overall_rating, setOverallRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [openReplyId, setOpenReplyId] = useState(null);

    // Reply
    const [replyComment, setReplyComment] = useState('');


    const fetchReviews = async () => {
        try {
            const reviews = await getTeacherReviews(teacher_id);
            if (reviews) {
                setReviews(reviews);
                // Calculate ratings
                getRatings(reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const getRatings = (reviews) => {
        // Extract ratings from reviews
        const teachingSkillRatings = reviews.map(review => Number(review.teaching_skill_rating));
        const onTimeRatings = reviews.map(review => Number(review.on_time_rating));
        const communicationRatings = reviews.map(review => Number(review.communication_rating));
        const overallRatings = reviews.map(review => Number(review.overall_rating));
        // Calculate average ratings
        const teachingSkillRating = teachingSkillRatings.reduce((a, b) => a + b, 0) / teachingSkillRatings.length;
        const onTimeRating = onTimeRatings.reduce((a, b) => a + b, 0) / onTimeRatings.length;
        const communicationRating = communicationRatings.reduce((a, b) => a + b, 0) / communicationRatings.length;
        const overallRating = (overallRatings.reduce((a, b) => a + b, 0) / overallRatings.length).toFixed(1);
        // Set ratings to state
        setOverallTeachingSkillRating(teachingSkillRating);
        setOverallOnTimeRating(onTimeRating);
        setOverallCommunicationRating(communicationRating);
        setOverallRating(overallRating);
        setRatingInTeacherPage(overallRating);
        setReviewCount(reviews.length);
        setReviewCountInTeacherPage(reviews.length);
    }


    useEffect(() => {
        fetchReviews();
    }, [teacher_id]);

    const handleReview = () => {
        if (!user) {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการรีวิว');
            return;
        }
        if (user && user.user_metadata.role !== 'นักเรียน') {
            toast.error('คุณไม่สามารถรีวิวได้');
            return;
        }
        const hasReviewed = reviews.some(review => review.student_id === user.id);
        if (hasReviewed) {
            toast.error('คุณได้รีวิวแล้ว');
            return;
        }
        if (openReview) {
            if (reviewComment.length > 0 && teachingSkillRating > 0 && onTimeRating > 0 && communicationRating > 0) {
                const overRallRating = ((teachingSkillRating + onTimeRating + communicationRating) / 3).toFixed(1);
                const data = {
                    reviewComment: reviewComment,
                    teachingSkillRating: String(teachingSkillRating),
                    onTimeRating: String(onTimeRating),
                    communicationRating: String(communicationRating),
                    overRallRating: String(overRallRating),
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

    const handleSubmitReview = async (data) => {
        if (!user) {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการรีวิว');
            return;
        }
        const submitReview = window.confirm('คุณต้องการโพสต์รีวิวหรือไม่? (ไม่สามารถแก้ไขได้)');
        if (!submitReview) {
            toast.error('ยกเลิกการโพสต์รีวิว');
            return;
        }
        try {
            const result = await insertReview(data);
            if (result) {
                toast.success('โพสต์รีวิวเรียบร้อยแล้ว');
                fetchReviews();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('เกิดข้อผิดพลาดในการโพสต์รีวิว');
        }
    }

    // Delete review function
    const handleDeleteReview = async (review_id) => {
        if (!user) {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการรีวิว');
            return;
        }
        const confirmDelete = window.confirm('คุณต้องการลบรีวิวนี้หรือไม่?');
        if (confirmDelete) {
            try {
                const result = await deleteMyReview(review_id);
                if (result) {
                    toast.success('ลบรีวิวเรียบร้อยแล้ว');
                    fetchReviews();
                }
            } catch (error) {
                console.error('Error deleting review:', error);
                toast.error('เกิดข้อผิดพลาดในการลบรีวิว');
            }
        }
    }

    const handleReplyReview = (review_id) => {
        if (!user || user.user_metadata.role !== 'ครูสอนว่ายน้ำ') {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการรีวิว');
            return;
        }

        // Toggle open/close per review
        setOpenReplyId(prevId => (prevId === review_id ? null : review_id));
    };

    const handleReplyCommentChange = (event) => {
        setReplyComment(event.target.value);
    }

    const handleSubmitReply = async (review_id) => {
        if (!user) {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการรีวิว');
            return;
        }
        const data = {
            review_id: review_id,
            reply_comment: replyComment,
        }
        try {
            const result = await updateReply(data);
            if (result) {
                toast.success('ตอบกลับรีวิวเรียบร้อยแล้ว');
                setOpenReplyId(null);
                setReplyComment('');
                fetchReviews();
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
            toast.error('เกิดข้อผิดพลาดในการตอบกลับรีวิว');
        }
    }



    return (
        <div className="flex flex-col p-2 items-center justify-center h-auto bg-white rounded-xl shadow-[0_0_20px] shadow-black/30">
            <h1 className="text-xl font-semibolds">รีวิว</h1>
            <p className="text-3xl font-semibold">{isNaN(overall_rating) ? 'ไม่มีรีวิว' : overall_rating}</p>
            <Rating name="rating-read" value={overall_rating} precision={0.5} readOnly />
            <p className="text-sm font-normal">{reviewCount} รีวิว</p>
            <div className='w-full px-2'>
                <div className='flex flex-row items-center gap-2 justify-between'>
                    <p className="text-sm font-semibold whitespace-nowrap w-[150px]">ทักษะการสอน</p>
                    <div className='flex flex-row items-center gap-2 w-full'>
                        <LinearProgress variant="determinate" value={overall_teaching_skill_rating * 20} className="w-full" />
                        <span>{isNaN(overall_teaching_skill_rating) ? '0' : (overall_teaching_skill_rating).toFixed(1)}</span>
                    </div>                
                </div>
                <div className='flex flex-row items-center gap-2 justify-between'>
                    <p className="text-sm font-semibold whitespace-nowrap w-[150px]">ตรงต่อเวลา</p>
                    <div className='flex flex-row items-center gap-2 w-full'>
                        <LinearProgress variant="determinate" value={overall_on_time_rating * 20} className="w-full" />
                        <span>{isNaN(overall_on_time_rating) ? '0' : (overall_on_time_rating).toFixed(1)}</span>
                    </div>                    
                </div>
                <div className='flex flex-row items-center gap-2 justify-between'>
                    <p className="text-sm font-semibold whitespace-nowrap w-[150px]">การสื่อสาร</p>
                    <div className='flex flex-row items-center gap-2 w-full'>
                        <LinearProgress variant="determinate" value={overall_communication_rating * 20} className="w-full" />
                        <span>{isNaN(overall_communication_rating) ? '0' : (overall_communication_rating).toFixed(1)}</span>
                    </div>                    
                    </div>
            </div>
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
            <div className='w-full my-2 max-h-150 overflow-scroll'>
                <Stack
                    direction={"column"}
                    spacing={2}>
                    {/* Review items */}
                    {reviews.map((review, index) => (
                        <div key={index} className="relative flex flex-col gap-1 p-2">
                            <div className='flex flex-row items-center gap-2'>
                                <Avatar sx={{ bgcolor: review?.student_profiles?.profile_color}}>{review?.student_profiles?.initial}</Avatar>
                                <div className='flex flex-col gap-0.5'>
                                    <p className="text-sm font-semibold">{review?.student_profiles?.full_name}</p>
                                    <Rating name="student-rating" value={Number(review?.overall_rating)} precision={0.5} readOnly size='small' />
                                    <p className="text-xs">{new Date(review.created_at).toLocaleString()}</p>   
                                </div>
                            </div>
                            <p className="text-sm break-words whitespace-pre-line">{review.review_comment}</p>
                            {user && review.student_id === user.id && (
                                <div className='absolute top-2 right-2 z-30'>
                                    <MyTooltip
                                        icon={<DeleteIcon />}
                                        handleClick={() => handleDeleteReview(review.id)}
                                        size="small"
                                        title="ลบรีวิว"
                                    />
                                </div>
                            )}
                            {/* Add Reply section here */}
                            {user && user.id === review.teacher_id && (
                                <div className='absolute top-2 right-2 z-30'>
                                    <MyTooltip
                                        icon={<ReplyIcon />}
                                        handleClick={() => handleReplyReview(review.id)}
                                        size="small"
                                        title="ตอบกลับรีวิว"
                                    />
                                </div>
                            )}
                            {openReplyId === review.id && (
                                <div className='flex flex-col gap-0'>
                                    <MyTextField
                                        label="ตอบกลับรีวิว"
                                        value={replyComment}
                                        onChange={handleReplyCommentChange}
                                        multiline={true}
                                        rows={2}
                                        maxLength={1000}
                                        id={review.id}
                                        required={false}
                                        disabled={false}
                                        showCounter={true}
                                    />
                                    <div className='w-full flex justify-end'>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="w-[60px]"
                                            onClick={() => handleSubmitReply(review.id)}
                                            size='small'
                                            sx={{ fontSize: '0.7rem' }}
                                        >
                                            ตอบกลับ
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {review?.reply_comment && openReplyId !== review.id && (
                                <div className='ml-12 mt-1'>
                                    <div className='flex flex-row gap-2 items-center mb-1'>
                                        <Avatar 
                                            alt='teacher profile picture' 
                                            src={teacher_picture}
                                            sx={{ width: 24, height: 24 }}
                                        />
                                        <p className='text-gray-700 text-xs font-semibold'>คุณครู</p>
                                    </div>
                                    <p className='text-gray-500 text-xs break-words line-clamp-6'>{review?.reply_comment}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </Stack>
            </div>
        </div>
    )
}