import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MyChip from './Chip';
import CheckIcon from '@mui/icons-material/Check';
import province_th from '../assets/geography_th/provinces.json';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarRateIcon from '@mui/icons-material/StarRate';
import RecommendIcon from '@mui/icons-material/Recommend';

export default function MyCard({ display_name, bio, image, can_travel, can_online, hourly_rate, province_code, handleClick, levels, handleStarClick }) {
  const provinceLabels = province_code
  .map(loc => province_th.find(p => String(p.provinceCode) === String(loc.province_code)))
  .filter(Boolean)
  .map(p => p.provinceNameTh);

  return (
    <div className='w-full' onClick={handleClick}>
      <Card sx={{ width: 1 , ':hover': { boxShadow: 20, cursor: 'pointer' }, borderRadius: 2, }}>
          <div className='relative'>
            <Box
              sx={{
                overflow: 'hidden',
                height: {
                  xs: 220,
                  sm: 250,
                },
                width: 1,
              }}
            >
              <img
                src={image}
                alt="profile"
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
                className="hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </Box>
            <div className='absolute bottom-2 left-2 flex flex-row gap-2'>
                {can_travel && (
                    <MyChip 
                        label="สามารถเดินทางได้" 
                        icon={<CheckIcon/>} 
                        variant='filed' 
                        size="small"
                        color="success"
                    />
                )}
                {can_online && (
                    <MyChip 
                        label="สอนออนไลน์" 
                        icon={<CheckIcon/>} 
                        variant='filled' 
                        size="small"
                        color="secondary"
                    />
                )}
            </div>
            <div className='absolute top-2 right-2 z-10'>
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
                  e.stopPropagation();  // <-- Prevents the click from bubbling up
                  handleStarClick();
                }}
              >
                <StarOutlineIcon sx={{ color: 'white'}} fontSize='large'/>
              </IconButton>
            </div>
            <div className='absolute top-2 left-2 z-10'>
              <MyChip
                label="แนะนำ"
                icon={<RecommendIcon sx={{color: '#0070ff'}}/>}
                variant='filled'
                size="medium"
                color="primary"
                sx={{
                  backgroundColor: '#FF6600',
                }}
              />
            </div>
          </div>  
        <CardContent className='w-full flex flex-col justify-between h-50'>
          {provinceLabels.length > 0 && (
            <p className="text-sm text-gray-600">
              📍 {provinceLabels.slice(0, 2).join(', ')}
              {provinceLabels.length > 2 && ` +${provinceLabels.length - 2} อื่นๆ`}
            </p>
          )}
          <h5 className='text-2xl font-semibold break-words line-clamp-1'>{<VerifiedIcon sx={{color: '#0070ff'}}/>} {display_name}</h5>
          <div className='block'>
            <div className="break-words line-clamp-2">{bio}</div>
          </div>
          {levels.length > 0 && (
            <div className="flex flex-row gap-1 mt-2 overflow-x-scroll">
              {levels.map((level, index) => (
                <MyChip 
                  label={level} 
                  key={index} 
                  variant='outlined' 
                  size="small"
                />
              ))}
            </div>
          )}
          <div className='mt-auto flex flex-row justify-between items-center'>
            <p className="font-semibold">{hourly_rate} บาท / ชั่วโมง</p>
            <p className='flex flex-row'>{<StarRateIcon color='warning'/>}4.6 (123)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
