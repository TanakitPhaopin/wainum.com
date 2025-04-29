import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { getCurrentLocation } from '../services/location';

export default function Home() {
    const [province, setProvince] = useState(null);

    const getLocation = async () => {
        try {
            const location = await getCurrentLocation();
            setProvince(location);
        } catch (error) {
            console.error('Error getting location:', error);
        }
    }

    useEffect(() => {
        if (province) {
            console.log('Current location:', province);
        }
    }
    , [province]);

    

    return (
        <div className="h-full w-full">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl text-black">ค้นหา<span className="font-semibold">ครูสอนว่ายน้ำ</span>ที่ดีที่สุดใกล้บ้านคุณ</h1>
                {/* Search Box */}
                <div className="w-full items-center flex flex-col mt-4 md:w-3/4 lg:w-1/2">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="w-full p-4 pr-16 rounded-lg shadow-xl"
                            placeholder="ตำแหน่งที่ตั้ง"
                        />
                        <button
                            onClick={() => console.log('search')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2
                                    bg-[#023047] text-white px-3 py-1 rounded-lg
                                    hover:bg-[#046291] transition-colors duration-150"
                        >
                            ค้นหา
                        </button>
                    </div>
                    <div className='w-full flex gap-x-2 mt-2'>
                        <Button variant="text" onClick={getLocation} sx={{color: '#023047', width: 1, bgcolor: 'white', '&:hover': {bgcolor: '#A4D8E1'}}}>ครูว่ายน้ำใกล้ฉัน</Button>
                        <Button variant="text" onClick={() => console.log('click')} sx={{color: '#023047', width: 1, bgcolor: 'white', '&:hover': {bgcolor: '#A4D8E1'}}}>ออนไลน์</Button>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    );
}