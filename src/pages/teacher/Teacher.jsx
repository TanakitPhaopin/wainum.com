import { getTeacherById, toggleFavorite } from "../../services/search"
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Box, Button, Divider } from "@mui/material";
import StarRateIcon from '@mui/icons-material/StarRate';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import IconButton from '@mui/material/IconButton';
import province_th from "../../assets/geography_th/provinces.json";
import PlaceIcon from '@mui/icons-material/Place';
import SellIcon from '@mui/icons-material/Sell';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import MyChip from "../../components/Chip";
import { IsMyFavorite } from "../../services/student";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import Review from "./Review";
import SendRequestModal from "../student/SendRequestModal";
import { checkExistingRequest } from "../../services/request";
import ReactPlayer from "react-player";
import MyGallery from "../../components/Gallery";
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from "motion/react"

export default function Teacher() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = async () => {
        if (!user) {
            toast.error("กรุณาเข้าสู่ระบบก่อน");
            return;
        }
        if (user.user_metadata.role !== "นักเรียน") {
            toast.error("คุณไม่มีสิทธิ์ในการติดต่อผู้สอน");
            return;
        }

        const isRequestExists = await existingRequest();
        if (isRequestExists) {
            toast.error("คุณได้ส่งคำขอไปยังผู้สอนนี้แล้ว");
            return;
        }
        setOpenModal(true);
    }

    const existingRequest = async () => {
        const requestExists = await checkExistingRequest(user.id,teacher.id);
        if (requestExists) {
            return true;
        }
        return false;
    }

    const handleCloseModal = () => setOpenModal(false);
    const { id } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const section4Ref = useRef(null);
    const section5Ref = useRef(null);
    const section6Ref = useRef(null);
    const [myFavorite, setMyFavorite] = useState(false);
    const [ratingInTeacherPage, setRatingInTeacherPage] = useState(0);
    const [reviewCountInTeacherPage, setReviewCountInTeacherPage] = useState(0);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [location.pathname]);

    // Adjust this value based on your navbar height
    const NAVBAR_HEIGHT = 80;

    const scrollToSection = (ref) => {
        const offsetTop = ref.current.offsetTop - NAVBAR_HEIGHT;
        
        window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
        });
    };

    const fetchTeacher = async () => {
            const teacherId = id; // Replace with actual teacher ID
            const data = await getTeacherById(teacherId);       
            if (data) {
                setTeacher(data);
            } else {
                console.error("Error fetching teacher data");
            }
            setLoading(false);
        }
    const checkFavorite = async () => {
        if (user) {
            const isFavorite = await IsMyFavorite(teacher.id, user.id);
            setMyFavorite(isFavorite);
        }
        setLoading(false);
    }

    useEffect(() => {
    fetchTeacher();
    }, []); // just fetch once initially

    useEffect(() => {
    if (user && teacher) {
        checkFavorite();
    }
    }, [user, teacher]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col gap-2">
                <CircularProgress size={60} />
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }
    
    const handleStarClick = async (teacher_id, student_id) => {
        try {
            if (!user) {
            toast.error("กรุณาเข้าสู่ระบบก่อน");
            return;
            }
            if (user.user_metadata.role !== "นักเรียน") {
            toast.error("คุณไม่มีสิทธิ์ในการบันทึกผู้สอน");
            return;
        }
            const result = await toggleFavorite(teacher_id, student_id);
            if (result) {
                if (result.status === 'added') {
                    toast.success("บันทึกผู้สอนเรียบร้อย");
                    setMyFavorite(true);
                } else if (result.status === 'removed') {
                    toast.success("ลบผู้สอนออกจากรายการโปรดเรียบร้อย");
                    setMyFavorite(false);
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    }

    return (
        <div className='min-h-screen w-full'>
            <SendRequestModal open={openModal} handleClose={handleCloseModal} teacherId={teacher.id}/>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4 flex justify-between items-center"
            >
                <Button onClick={() => navigate(-1)} variant="contained" color="inherit">กลับ</Button>
                <div>
                    <Button
                        id="section-button"
                        aria-controls={open ? 'section-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="outlined"
                        color="inherit"
                    >
                        <ArrowDownwardIcon />
                    </Button>
                    <Menu
                        id="section-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {scrollToSection(section1Ref); handleClose();}}>ทั่วไป</MenuItem>
                        <MenuItem onClick={() => {scrollToSection(section2Ref); handleClose();}}>เกี่ยวกับคุณครู</MenuItem>
                        <MenuItem onClick={() => {scrollToSection(section3Ref); handleClose();}}>เกี่ยวกับการสอน</MenuItem>
                        <MenuItem onClick={() => {scrollToSection(section4Ref); handleClose();}}>เกี่ยวกับสถานที่สอน</MenuItem>
                        <MenuItem onClick={() => {scrollToSection(section5Ref); handleClose();}}>ความเชี่ยวชาญ</MenuItem>
                        <MenuItem onClick={() => {scrollToSection(section6Ref); handleClose();}}>รีวิว</MenuItem>
                    </Menu>
                </div>
            </motion.div>
            {/* Head */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div ref={section1Ref} className="relative container mx-auto p-4 rounded-xl shadow-xl bg-[#ffffff]">
                    {/* ⭐ Favorite Star - Top Right */}
                    <div className="absolute top-2 right-2 z-10">
                        <IconButton
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            transition: 'background-color 0.3s ease-in-out',
                            '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            },
                        }}
                        onClick={(e) => {
                            e.stopPropagation(); // prevent click interference
                            handleStarClick(teacher.id, user?.id); // pass id and user
                        }}
                        >
                        {myFavorite ? (
                            <StarRateIcon sx={{ color: 'gold' }} fontSize="large" />
                        ) : (
                            <StarOutlineIcon sx={{ color: 'white' }} fontSize="large" />
                        )}
                        </IconButton>
                    </div>
                    {/* General Info */}
                    <div className="md:flex md:grid-cols-2 md:gap-2 md:justify-evenly md:items-center">
                        <Box className="flex justify-center items-center mb-4 lg:w-1/3">
                            <img
                                src={teacher.profile_picture}
                                alt="Teacher"
                                className="rounded-full w-60 h-60 object-cover shadow-lg"
                            />
                        </Box>
                        <div className="mt-4 mb-4 flex flex-col gap-1 md:flex-1 lg:w-1/3">
                        <div className="flex items-center justify-center sm:justify-start">
                                {teacher.is_subscribed && (
                                    <MyChip
                                        label="แนะนำ"
                                        icon={<VerifiedIcon color='primary'/>}
                                        variant='filled'
                                        size="small"
                                        color="primary"
                                        sx={{
                                            backgroundColor: '#FF6600',
                                        }}
                                        className={'w-max animate-pulse'}
                                    />
                                )}
                        </div>
                        <div className="flex flex-col md:flex-row items-center md:justify-start md:gap-2">
                            <h1 className='text-center text-2xl font-bold text-wrap'><span>{teacher.is_subscribed && (<VerifiedIcon color='primary'/>)}</span> {teacher.display_name}</h1>
                            <div className='flex flex-row items-center gap-0.5'>
                                <StarRateIcon color='warning'/>
                                <span className="text-md">{isNaN(ratingInTeacherPage) ? 'ไม่มีรีวิว' : ratingInTeacherPage} ({reviewCountInTeacherPage})</span> 
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row justify-start items-center gap-2">
                                <PlaceIcon/>
                                <p className="text-wrap font-semibold">{teacher.swim_teacher_locations
                                .map(code => {
                                const match = province_th.find(location => String(code.province_code) === String(location.provinceCode));
                                return match?.provinceNameTh;
                                })
                                .filter(Boolean)
                                .join(', ')
                                }
                                </p>
                            </div>
                            <div className="flex flex-row justify-start items-center gap-2">
                                <SellIcon/>
                                <p className="text-center font-semibold text-wrap">{teacher.hourly_rate} บาท / ชั่วโมง</p>
                            </div>
                            {teacher.can_travel && (
                                <div className="flex flex-row justify-start items-center gap-2">
                                    <DirectionsCarIcon/>
                                    <p className="text-center text-wrap">สามารถเดินทางได้</p>
                                </div>
                            )}
                            {teacher.can_online && (
                                <div className="flex flex-row justify-start items-center gap-2">
                                    <ComputerIcon/>
                                    <p className="text-center text-wrap">สอนออนไลน์ได้</p>
                                </div>
                            )}
                            <div className="flex flex-row justify-start items-center gap-2">
                                <AccessTimeIcon/>
                                <p className="text-center font-normal text-wrap">ตอบกลับภายใน ~ {teacher.average_response_time} นาที</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button
                                variant="contained"
                                color="primary"
                                className="w-full"
                                onClick={() => handleOpenModal()}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                }}
                            >
                                ติดต่อ {teacher.display_name}
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Gallery */}
                {teacher.is_subscribed && teacher.swim_teacher_gallery && teacher.swim_teacher_gallery.length > 0 && (
                    <div className="container mx-auto">
                        <div className="w-full mx-auto">
                            <MyGallery 
                                images={teacher.swim_teacher_gallery.map(
                                    (image) => ({
                                        original: image.image_url,
                                        thumbnail: image.image_url,
                                    })
                                )} 
                            />
                        </div>
                    </div>
                    )}
                </div>

                {/* Bio + Who I teacher */}
                <div ref={section2Ref} className="container mx-auto p-4 mt-4 rounded-xl shadow-lg bg-[#ffffff]">
                    <h2 className='text-xl font-bold'>📘 เกี่ยวกับ {teacher.display_name}</h2>
                    <p className="text-start text-wrap">{teacher.bio}</p>
                </div>
                {/* Introduction video */}
                {teacher.is_subscribed && teacher.video_link && (
                    <div className='flex items-center justify-center w-full aspect-video mt-4'>
                        <ReactPlayer 
                        url={teacher.video_link}
                        controls={true}
                        width="100%"
                        height="100%"
                        style={{ maxHeight: '100%' }}
                        config={
                            {
                            youtube: {
                                playerVars: {
                                rel: 0, // Disable related videos at the end
                                modestbranding: 1,
                                showinfo: 0, // Hide video title and uploader
                                },
                            },
                            }
                        }
                        />
                    </div>
                )}
            </motion.div>
             {/* About lesson */}
             <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                ref={section3Ref} className="container mx-auto p-4 mt-4 rounded-xl shadow-lg bg-[#ffffff]">
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>สอนใครบ้าง</h2>
                    <p className="text-start text-wrap">
                        {teacher.levels.map((level, index) => (
                            <span key={index}>
                            {level}{index < teacher.levels.length - 1 && ', '}
                            </span>
                        ))}
                    </p>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'> 🧑‍🏫 เกี่ยวกับการสอน</h2>
                    <p className="text-start text-wrap h-auto max-h-[300px] overflow-y-scroll whitespace-pre-line">{teacher.about_lesson}</p>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>💰 ค่าเรียน</h2>
                    <p className="text-start text-wrap">{teacher.hourly_rate} บาท / ชั่วโมง</p>
                     <div className="text-start">
                        {teacher.is_freeTrial ? (
                            <div className="flex items-center">
                            <CheckIcon className="mr-1" sx={{ color: 'green' }} />
                            <span>ทดลองเรียนฟรี</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                            <CloseIcon className="mr-1" sx={{ color: 'red' }} />
                            <span>ไม่สามารถทดลองเรียนได้</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>แพ็คเกจการเรียน</h2>
                    {teacher.lesson_package && JSON.parse(teacher.lesson_package).length > 0 ? (
                        <div className="text-start">
                            {JSON.parse(teacher.lesson_package).map((packageItem, index) => (
                                <div key={index} className="flex flex-col items-start gap-2 mb-2">
                                    <div className="flex flex-col gap-1 border-2 border-gray-300 p-2 rounded-lg w-full">
                                        <span className="whitespace-pre-line break-words"><SellIcon fontSize="small" className="mr-1" sx={{ color: '#023047' }} />{packageItem.name} - {packageItem.price} บาท</span>
                                        <span className="text-sm text-gray-500 whitespace-pre-line break-words">{packageItem.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <CloseIcon className="mr-1" sx={{ color: 'red' }} />
                            <span>ไม่มีแพ็คเกจการเรียน</span>
                        </div>
                    )}
                </div>
            </motion.div>
            {/* Location */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                ref={section4Ref} className="container mx-auto p-4 mt-4 rounded-xl shadow-lg bg-[#ffffff]">
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>📍 สถานที่สอน</h2>
                    <p className="text-start line-clamp-4 break-words">{teacher.swim_teacher_locations
                        .map(code => {
                        const match = province_th.find(location => String(code.province_code) === String(location.provinceCode));
                        return match?.provinceNameTh;
                        })
                        .filter(Boolean)
                        .join(', ')
                        }
                    </p>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>เกี่ยวกับสถานที่สอน</h2>
                    <p className="text-start text-wrap h-auto max-h-[300px] overflow-y-scroll whitespace-pre-line">{teacher.about_location}</p>
                </div>
                <Divider sx={{marginBottom: 2}}/>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>เดินทางไปสอน</h2>
                    <div className="text-start">
                        {teacher.can_travel ? (
                            <div className="flex items-center">
                            <CheckIcon className="mr-1" sx={{ color: 'green' }} />
                            <span>สามารถเดินทางได้</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                            <CloseIcon className="mr-1" sx={{ color: 'red' }} />
                            <span>ไม่สามารถเดินทางได้</span>
                            </div>
                        )}
                    </div>
                    {teacher.can_travel && teacher.travel_note && (
                        <p className="text-start text-wrap h-auto max-h-[200px] overflow-y-scroll"><span className="font-semibold">Note: </span>{teacher.travel_note}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>สอนออนไลน์</h2>
                    <div className="text-start">
                        {teacher.can_online ? (
                            <div className="flex items-center">
                            <CheckIcon className="mr-1" sx={{ color: 'green' }} />
                            <span>รับสอนออนไลน์</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                            <CloseIcon className="mr-1" sx={{ color: 'red' }} />
                            <span>ไม่รับสอนออนไลน์</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
            {/* Experience and Qualifications */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                ref={section5Ref} className="container mx-auto p-4 mt-4 rounded-xl shadow-lg bg-[#ffffff]">
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>💼 ประสบการณ์</h2>
                    <p className="text-start text-wrap h-auto max-h-[300px] overflow-y-scroll whitespace-pre-line">{teacher.experience}</p>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>🎓 ใบรับรองคุณวุฒิ</h2>
                    <p className="text-start text-wrap h-auto max-h-[300px] overflow-y-scroll whitespace-pre-line">{teacher.qualification}</p>
                </div>
            </motion.div>

            {/* Reviews */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                ref={section6Ref}
                className="container mt-4 mx-auto">
                <Review teacher_id={teacher?.id} teacher_picture={teacher?.profile_picture} setRatingInTeacherPage={setRatingInTeacherPage} setReviewCountInTeacherPage={setReviewCountInTeacherPage}/>
            </motion.div>
        </div>
    )
}