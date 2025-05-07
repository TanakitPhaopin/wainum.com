import { getTeacherById } from "../../services/search"
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Box, Button, Divider } from "@mui/material";
import StarRateIcon from '@mui/icons-material/StarRate';
import province_th from "../../assets/geography_th/provinces.json";
import PlaceIcon from '@mui/icons-material/Place';
import SellIcon from '@mui/icons-material/Sell';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


export default function Teacher() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/search?sort=popularity';
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const section4Ref = useRef(null);
    const section5Ref = useRef(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Adjust this value based on your navbar height
    const NAVBAR_HEIGHT = 80;

    const scrollToSection = (ref) => {
    const offsetTop = ref.current.offsetTop - NAVBAR_HEIGHT;
    
    window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
    });
    };

    useEffect(() => {
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
        fetchTeacher();
    }
    , []);
    if (loading) {
        return  null;
    }
    if (!teacher) {
        navigate('/search');
    }

    return (
        <div className='w-full min-h-screen'>
            <div className="mb-4 flex justify-between items-center">
                <Button onClick={() => navigate(from)} variant="contained" color="inherit" startIcon={<ArrowBackIcon />}>กลับ</Button>
                <div>
                    <Button
                        id="section-button"
                        aria-controls={open ? 'section-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowDownwardIcon />}
                    >
                        ไปที่
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
                    </Menu>
                </div>
            </div>
            <div ref={section1Ref} className="container mx-auto p-4 border-2 border-black rounded-lg shadow-lg bg-[#F8F8FF]">
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
                        <div className="md:flex md:flex-row md:items-center md:justify-start gap-2">
                            <h1 className='text-center text-2xl font-bold text-wrap'>{teacher.display_name}</h1>
                            <p className="text-center">{<StarRateIcon color='warning'/>}4.6 (123)</p>
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
                        </div>
                        <div className="mt-4">
                            <Button
                                variant="contained"
                                color="primary"
                                className="w-full"
                                onClick={() => console.log("Contacting teacher...")}
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
            </div>
            {/* Bio + Who I teacher */}
            <div ref={section2Ref} className="container mx-auto p-4 mt-4 border-2 border-black rounded-lg shadow-lg bg-[#F8F8FF]">
                <h2 className='text-xl font-bold'>เกี่ยวกับ {teacher.display_name}</h2>
                <p className="text-start text-wrap">{teacher.bio}</p>
            </div>
             {/* About lesson */}
             <div ref={section3Ref} className="container mx-auto p-4 mt-4 border-2 border-black rounded-lg shadow-lg bg-[#F8F8FF]">
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
                    <h2 className='text-xl font-bold'>เกี่ยวกับการสอน</h2>
                    <p className="text-start text-wrap">{teacher.about_lesson}</p>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>ค่าเรียน</h2>
                    <p className="text-start text-wrap">{teacher.hourly_rate} บาท / ชั่วโมง</p>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>แพ็คเกจการเรียน</h2>
                    {teacher.lesson_package ? (
                     <p>{teacher.lesson_package}</p>   
                    ) : (
                        <div className="flex items-center">
                            <CloseIcon className="mr-1" sx={{ color: 'red' }} />
                            <span>ไม่มีแพ็คเกจการเรียน</span>
                        </div>
                    )}
                </div>
            </div>
            {/* Location */}
            <div ref={section4Ref} className="container mx-auto p-4 mt-4 border-2 border-black rounded-lg shadow-lg bg-[#F8F8FF]">
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>สถานที่สอน</h2>
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
                    <p className="text-start text-wrap">{teacher.about_location}</p>
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
                        <p className="text-start text-wrap"><span className="font-semibold">Note: </span>{teacher.travel_note}</p>
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
            </div>
            {/* Experience and Qualifications */}
            <div ref={section5Ref} className="container mx-auto p-4 mt-4 border-2 border-black rounded-lg shadow-lg bg-[#F8F8FF]">
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>ประสบการณ์</h2>
                    <p className="text-start text-wrap">{teacher.experience}</p>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <h2 className='text-xl font-bold'>ใบรับรองคุณวุฒิ</h2>
                    <p className="text-start text-wrap">{teacher.qualification}</p>
                </div>
            </div>
        </div>
    )
}