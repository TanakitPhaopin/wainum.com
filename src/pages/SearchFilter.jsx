import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import { Switch, FormControlLabel, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 1, // mobile
      sm: 1/2, // tablet
      md: 1/3, // laptop
      lg: 1/4, // big desktop
      xl: 1/5, // extra big desktop
    },
    height: {
      xs: 'auto', // mobile
      sm: 'auto', // tablet
      md: 'auto', // laptop
      lg: 'auto', // big desktop
      xl: 'auto', // extra big desktop
   },
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
    maxHeight: 6/6,
    overflowY: "auto",
    borderRadius: 2,
  };

export default function SearchFilter({open, handleClose}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [apply_price, setApply_price] = useState(false);
  const [can_travel, setCan_travel] = useState(false);
  const [can_online, setCan_online] = useState(false);
  useEffect(() => {
    setPriceRange([
      parseInt(searchParams.get('minPrice')) || 0,
      parseInt(searchParams.get('maxPrice')) || 1000,
    ]);
    setApply_price(searchParams.get('minPrice') !== null && searchParams.get('maxPrice') !== null);
    setCan_travel(searchParams.get('travel') === 'true');
    setCan_online(searchParams.get('online') === 'true');
  }, [searchParams]);

  const handleChange = (field) => (e) => {
    const value = 
      field === 'can_travel' || field === 'can_online' || field === 'apply_price'
        ? e.target.checked // For switches
        : e.target.value;  // For text fields and other inputs
    
    switch (field) {
      case 'can_travel':
        setCan_travel(value);
        break;
      case 'can_online':
        setCan_online(value);
        break;
      case 'apply_price':
        setApply_price(value);
        break;
      default:
        break;
    }
  }
  const handleApply = () => {
    const filterData = {
      priceRange: apply_price ? priceRange : null,
      can_travel,
      can_online
    };
    console.log(filterData);
    // Update query parameters
    const newParams = new URLSearchParams(searchParams);

    if (apply_price) {
      newParams.set('minPrice', priceRange[0]);
      newParams.set('maxPrice', priceRange[1]);
    } else {
      newParams.delete('minPrice');
      newParams.delete('maxPrice');
    }
    if (can_travel) {
      newParams.set('travel', can_travel);
    } else {
      newParams.delete('travel');
    }
    if (can_online) {
      newParams.set('online', can_online);
    } else {
      newParams.delete('online');
    }

    setSearchParams(newParams); // Update the URL with new query parameters
    handleClose();
  }
  const handleReset = () => {
    setPriceRange([0, 1000]);
    setApply_price(false);
    setCan_travel(false);
    setCan_online(false);

    // Clear query parameters
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('minPrice');
    newParams.delete('maxPrice');
    newParams.delete('travel');
    newParams.delete('online');

    setSearchParams(newParams); // Update the URL
    handleClose();
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <div>
            <Typography variant="h6" component="h2" className='text-center font-bold text-2xl'>
              ตัวกรอง
            </Typography>
            <div className='flex flex-col gap-4 mt-4'>
              <div className='flex flex-col gap-2'>
        
                <FormControlLabel control={<Switch checked={apply_price} onChange={handleChange('apply_price')} />} label="ราคาเรียน/ชั่วโมง" />
                {apply_price && (
                  <Slider
                    id="price-range"
                    defaultValue={[0, 1000]}
                    valueLabelDisplay="auto"
                    step={10}
                    min={0}
                    max={1500}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    value={priceRange}
                  />
                )}
              </div>
              <FormControlLabel control={<Switch checked={can_travel} onChange={handleChange('can_travel')} />} label="สามารถเดินทางได้" />
              <FormControlLabel control={<Switch checked={can_online} onChange={handleChange('can_online')} />} label="สอนออนไลน์" />
            </div>
            <div className='flex justify-center mt-4'>
              <Button variant="contained" onClick={handleApply} sx={{width: 1, bgcolor: '#023047', '&:hover': {bgcolor: '#046291'}}}>ตกลง</Button>
              <Button variant="text" onClick={handleReset} sx={{width: 1, color: '#023047', '&:hover': {bgcolor: '#A4D8E1'}}}>ยกเลิกทั้งหมด</Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
