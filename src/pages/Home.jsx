import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import provinces_th from '../assets/geography_th/provinces.json';
import { useNavigate } from 'react-router';
import getCurrentAddress from '../services/location.js';
import { toast } from 'react-toastify';


export default function Home() {
    const navigate = useNavigate();
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


    return (
        <div className="h-full w-full">
            <div className="flex flex-col items-center justify-center py-0 lg:py-8">
                <h1 className="text-4xl lg:text-5xl 2xl:text-6xl text-black">ค้นหา<span className="font-semibold">ครูสอนว่ายน้ำ</span>ที่ดีที่สุดใกล้บ้านคุณ</h1>
                {/* Search Box */}
                <div className="w-full items-center flex flex-col mt-4">
                    <div className="relative w-full">
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
                            onClick={() => navigate(`/search?code=${provinceCode}?sort=popularity`)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2
                                    bg-[#023047] text-white px-3 py-1 rounded-lg
                                    hover:bg-[#046291] transition-colors duration-150"
                        >
                            ค้นหา
                        </button>
                    </div>
                    <div className='w-full flex gap-x-2 mt-2'>
                        <Button variant="text" onClick={getLocation} sx={{color: '#023047', width: 1, bgcolor: 'white', '&:hover': {bgcolor: '#A4D8E1'}}}>ครูว่ายน้ำใกล้ฉัน</Button>
                        <Button variant="text" onClick={() => navigate('/search?online=true&sort=popularity')} sx={{color: '#023047', width: 1, bgcolor: 'white', '&:hover': {bgcolor: '#A4D8E1'}}}>ออนไลน์</Button>
                    </div>
                </div>
            </div>
            <div className=''>
            </div>
        </div>
    );
}