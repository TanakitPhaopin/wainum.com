import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import { Switch, FormControlLabel, Button, Checkbox, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'relative',
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
      xs: 1, // mobile
      sm: 'auto', // tablet
      md: 'auto', // laptop
      lg: 'auto', // big desktop
      xl: 'auto', // extra big desktop
   },
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
    maxHeight: {
      xs: 1, // mobile
      sm: 1, // tablet
      md: 1, // laptop
      lg: '90vh', // big desktop
      xl: '90vh', // extra big desktop
    },
    overflowY: "auto",
    borderRadius: 2,
  };

export default function SearchFilter({open, handleClose, setFiltered}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [apply_price, setApply_price] = useState(false);
  const [can_travel, setCan_travel] = useState(false);
  const [can_online, setCan_online] = useState(false);
  const [is_freeTrial, setIs_freeTrial] = useState(false);
  const [levels, setLevels] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const allowedKeys = ['code', 'sort', 'minPrice', 'maxPrice', 'travel', 'online', 'levels', 'freeTrial'];
  useEffect(() => {
    const hasValidFilters = [...searchParams].some(
      ([key]) => allowedKeys.includes(key) && key !== 'code' && key !== 'sort'
    );

    
    setFiltered(hasValidFilters);
    
    setPriceRange([
      parseInt(searchParams.get('minPrice')) || 0,
      parseInt(searchParams.get('maxPrice')) || 1000,
    ]);
    setApply_price(searchParams.get('minPrice') !== null && searchParams.get('maxPrice') !== null);
    setCan_travel(searchParams.get('travel') === 'true');
    setCan_online(searchParams.get('online') === 'true');
    setIs_freeTrial(searchParams.get('freeTrial') === 'true');

    const levelParam = searchParams.get('levels');
    if (levelParam) {
      setLevels(true);
      setSelectedLevels(levelParam.split(','));
    } else {
      setLevels(false);
      setSelectedLevels([]);
    }
  }, [searchParams]);

  const handleChange = (field) => (e) => {
    const value = 
      field === 'can_travel' || field === 'can_online' || field === 'apply_price' || field === 'levels' || field === 'is_freeTrial'
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
      case 'levels':
        setLevels(value);
        break;
      case 'is_freeTrial':
        setIs_freeTrial(value);
        break;
      default:
        break;
    }
  }
  const handleCloseModal = () => {
    handleApply();
    handleClose();
  }

  const handleApply = () => {
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
    if (is_freeTrial) {
      newParams.set('freeTrial', is_freeTrial);
    } else {
      newParams.delete('freeTrial');
    }
    if (levels) {
      if (selectedLevels.length > 0) {
        newParams.set('levels', selectedLevels.join(','));
      }
    } else {
      newParams.delete('levels');
      setSelectedLevels([]);
    }
    

    setSearchParams(newParams); // Update the URL with new query parameters
    handleClose();
  }
  const handleReset = () => {
    setPriceRange([0, 1000]);
    setApply_price(false);
    setCan_travel(false);
    setCan_online(false);
    setLevels(false);
    setSelectedLevels([]);

    // Clear query parameters
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('minPrice');
    newParams.delete('maxPrice');
    newParams.delete('travel');
    newParams.delete('online');
    newParams.delete('levels');
    newParams.delete('freeTrial');
    setSearchParams(newParams); // Update the URL
    handleClose();
  }

  const handleLevelChange = (level) => (e) => {
    const isChecked = e.target.checked;
  
    setSelectedLevels((prev) => {
      if (isChecked) {
        // Add the level to the selectedLevels array
        return [...prev, level];
      } else {
        // Remove the level from the selectedLevels array
        return prev.filter((l) => l !== level);
      }
    });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <CloseIcon fontSize='large' className='absolute top-2 right-2 cursor-pointer' onClick={handleCloseModal}/>
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
              <FormControlLabel control={<Switch checked={levels} onChange={handleChange('levels')} />} label="ระดับการสอน" />
              {levels && (
              <div className="flex flex-col gap-2">
                {['ทารก', 'เด็ก', 'ผู้ใหญ่', 'ผู้ที่มีความต้องการพิเศษ', 'ระดับเริ่มต้น', 'ระดับกลาง', 'ระดับสูง', 'ระดับแข่งขัน'].map((level) => (
                  <FormControlLabel
                    key={level}
                    control={
                      <Checkbox
                        checked={selectedLevels.includes(level)}
                        onChange={handleLevelChange(level)}
                      />
                    }
                    label={level.charAt(0).toUpperCase() + level.slice(1)} // Capitalize the label
                  />
                ))}
              </div>
            )}
              <Divider />
              <FormControlLabel control={<Switch checked={is_freeTrial} onChange={handleChange('is_freeTrial')} />} label="ทดลองเรียนฟรี!!" />
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
