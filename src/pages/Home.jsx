import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import provinces_th from '../assets/geography_th/provinces.json';
import { useNavigate, useLocation } from 'react-router';
import getCurrentAddress from '../services/location.js';
import { toast } from 'react-toastify';
import HomeContent from './HomeContent.jsx';
import { ReactTyped } from "react-typed";
import ReviewSection from './ReviewSection.jsx';
import BecomeTeacher from './BecomeTeacher.jsx';
import { motion } from "motion/react"
import { Helmet } from 'react-helmet';

export default function Home({openSignupClick}) {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [location.pathname]);
    const [deviceType, setDeviceType] = useState("desktop");
    const updateDeviceType = () => {
        const width = window.innerWidth;
        if (width < 464) {
          setDeviceType("mobile");
        } else if (width < 1024) {
          setDeviceType("tablet");
        } else {
          setDeviceType("desktop");
        }
      };
    
      useEffect(() => {
        updateDeviceType(); // Set initial device type
        window.addEventListener("resize", updateDeviceType);
    
        return () => {
          window.removeEventListener("resize", updateDeviceType);
        };
      }, []);

    const [province, setProvince] = useState(null);
    const [provinceCode, setProvinceCode] = useState(null);
    

    const getLocation = async () => {
        try {
            const address = await getCurrentAddress();
            const provinceTH = provinces_th.find((province) => address.province?.includes(province.provinceNameTh));
            if (provinceTH) {
                setProvince(provinceTH.provinceNameTh);
                setProvinceCode(provinceTH.provinceCode);
                navigate(`/search?code=${provinceTH.provinceCode}&sort=popularity`);

            } else {
                navigate('/search?sort=popularity');
                notify('ไม่พบจังหวัดจากตำแหน่งของคุณ');
            }
        } catch (error) {
            notify('ไม่สามารถค้นหาตำแหน่งของคุณได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณหรืออนุญาตให้เข้าถึงตำแหน่ง');
            console.error('Error getting location:', error);
        }
    }

    const notify = (message) => {
        toast.error(message);
    }

    const provinces = provinces_th.map((province) => ({
        label: province.provinceNameTh,
        id: province.provinceCode,
    }));

    const pageTitle = 'ว่ายน้ำ.com – ค้นหาครูสอนว่ายน้ำทั่วไทย';
    const pageDesc  = 'ว่ายน้ำ.com แหล่งรวมครูสอนว่ายน้ำทั่วไทย ค้นหา เปรียบเทียบราคา และอ่านรีวิว ครูสอนว่ายน้ำใกล้คุณ';
    const pageUrl   = 'https://xn--q3cro8bc2kk6a.com/';

    return (
        <>
        <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDesc} />
            <link rel="canonical" href={pageUrl} />
            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDesc} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:image" content="https://jxamlumehxyjlqcekmgl.supabase.co/storage/v1/object/public/wainum-logo//wainum_logo.png" />
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDesc} />
            <meta name="twitter:image" content="https://jxamlumehxyjlqcekmgl.supabase.co/storage/v1/object/public/wainum-logo//wainum_logo.png" />
        </Helmet>
        <div className="h-full w-full mb-8">
            <h1 className="sr-only">ว่ายน้ำ.com - ค้นหาครูสอนว่ายน้ำทั่วไทย</h1>
            <div className="flex flex-col items-center justify-center py-0 lg:py-8">
                <motion.h2 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0 }}
                    className="text-4xl lg:text-5xl 2xl:text-6xl text-black">ค้นหา<span className="font-semibold">ครูสอนว่ายน้ำ</span>ที่ดีที่สุดใกล้บ้านคุณ
                </motion.h2>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0 }}
                    className='flex items-center justify-center my-1'
                >
                    <ReactTyped 
                        strings={[
                            "ครูสอนว่ายน้ำทั่วไทย 77 จังหวัด",
                            "สอนว่ายน้ำสำหรับทุกวัย",
                            "สอนออนไลน์หรือสอนที่บ้านก็ได้",
                            "เปรียบเทียบราคาและรีวิวได้",
                        ]} 
                        typeSpeed={40} 
                        backSpeed={30}
                        backDelay={2000}
                        loop
                        className='text-xl lg:text-3xl 2xl:text-4xl text-[#023047] break-words line-clamp-1'
                    /> 
                </motion.div>
               {/* Search Box */}
                <div className="w-full items-center flex flex-col mt-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0 }}
                        className="relative w-full"
                    >
                        <Autocomplete
                            freeSolo
                            options={provinces}
                            className="w-full"
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="จังหวัด"
                                sx={{width: '100%', boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}
                            />
                            )}
                            onChange={(event, newValue) => {
                                setProvince(newValue?.label);
                                setProvinceCode(newValue?.id);
                            }}
                        />

                        <button
                            onClick={() => {
                                if (provinceCode) {
                                navigate(`/search?code=${provinceCode}&sort=popularity`);
                                } else {
                                navigate('/search?sort=popularity');
                                }
                            }}                            
                            className="absolute right-2 top-1/2 transform -translate-y-1/2
                                bg-[#023047] text-white px-3 py-1 rounded-lg
                                hover:bg-[#046291] transition-colors duration-150"
                        >
                            ค้นหา
                        </button>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0 }}
                        className='w-full flex gap-x-2 mt-2'
                    >
                        <Button variant="text" onClick={getLocation} sx={{color: '#023047', width: 1, bgcolor: 'white', '&:hover': {bgcolor: '#A4D8E1'}}}>ครูว่ายน้ำใกล้ฉัน</Button>
                        <Button variant="text" onClick={() => navigate('/search?online=true&sort=popularity')} sx={{color: '#023047', width: 1, bgcolor: 'white', '&:hover': {bgcolor: '#A4D8E1'}}}>ออนไลน์</Button>
                    </motion.div>
                </div>
            </div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className='w-full mt-4'
            >
                <HomeContent deviceType={deviceType}/>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className='w-full mt-4'
            >
                <ReviewSection />
            </motion.div >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className='w-full mt-4'
            >
                <BecomeTeacher openSignupClick={openSignupClick}/>
            </motion.div >
        </div>
        </> 
    );
}
