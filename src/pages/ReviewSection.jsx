import Rating from '@mui/material/Rating';
import { useState, useEffect } from 'react';
import { ReactTyped } from "react-typed";
import { getFiveStarReviews } from '../services/home';
import { MyCarousel } from '../components/Carousal';
import { useNavigate } from 'react-router';
import { Avatar } from '@mui/material';

export default function ReviewSection() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    // Fetch 5-star reviews when the component mounts
    const fetchReviews = async () => {
        try {
            const reviews = await getFiveStarReviews();
            console.log("Fetched reviews:", reviews);
            setReviews(reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };
    useEffect(() => {
        fetchReviews();
    }, []);

    const Content = () => {
        return reviews.map((review) => (
            <div key={review.id} className="bg-white flex flex-col justify-between p-4 embla__slide border-2 border-gray-500/10 rounded-2xl max-h-[300px] cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out"
                onClick={() => {navigate(`/teacher/${review.teacher_id}`)}}
            >   
                <div>
                    <div className="flex flex-row items-center mb-2">
                        <Avatar
                            src={review.swim_teacher_profiles.profile_picture || '/default-avatar.png'}
                            alt={review.swim_teacher_profiles.display_name}
                            className="mr-3"
                            sx={{ width: 48, height: 48 }}
                        />
                        <div className='flex flex-col justify-center'>
                            <span className="text-xl font-semibold break-words line-clamp-1">{review.swim_teacher_profiles.display_name}</span>
                            <span className='text-xs'>ครูสอนว่ายน้ำ</span>
                        </div>
                    </div>
                    <p className='text-lg text-gray-600 text-wrap break-words line-clamp-4'>"{review.review_comment}"</p>
                    <Rating name="read-only" value={review.overall_rating} precision={0.5} readOnly size='small'/>
                </div>
                <div>
                    <p className='text-sm text-gray-500'>รีวิวจากผู้เรียน: {review.student_profiles.full_name}</p>
                    <span className='text-xs text-gray-400'>เมื่อ {new Date(review.created_at).toLocaleDateString({
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}</span>
                </div>
            </div>
        ));
    }

    return (
        <div 
            className="p-6 w-full flex flex-col items-center
            md:flex-row
            ">
            <div className='flex flex-col items-center justify-center mb-4 
            md:w-1/2
            '>
                <ReactTyped 
                    strings={[
                        "รีวิวจากผู้เรียน",
                        "เรียนกับครูที่ใช่",
                        "แมตช์ที่ลงตัวที่สุด",
                    ]} 
                    typeSpeed={50} 
                    backSpeed={50}
                    startDelay={1000}
                    backDelay={3000}
                    loop
                    className='text-2xl font-semibold md:text-3xl'
                />
                <Rating name="read-only" value={5} precision={0.5} readOnly size='large'/>
                <p className='text-gray-500 text-sm mt-2 md:text-lg'>รีวิวจากผู้เรียนที่พึงพอใจมากที่สุด</p>
            </div>
            <div className='w-full
            md:w-1/2
            '>
                <div className='w-full h-full flex items-center justify-center'>
                    <MyCarousel Content={Content} container_style={'w-full'}/>
                </div>
            </div>
        </div>
    );
}