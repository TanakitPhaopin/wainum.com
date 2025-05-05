import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MyChip from './Chip';
import CheckIcon from '@mui/icons-material/Check';
import province_th from '../assets/geography_th/provinces.json';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export default function MyCard({ display_name, bio, image, can_travel, can_online, hourly_rate, province_code, handleClick }) {
  const provinceLabels = province_code
  .map(loc => province_th.find(p => String(p.provinceCode) === String(loc.province_code)))
  .filter(Boolean)
  .map(p => p.provinceNameTh);

  return (
    <div className='w-full' onClick={handleClick}>
      <Card sx={{ width: 1 , ':hover': { boxShadow: 20, cursor: 'pointer' }, borderRadius: 2 }}>
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
                          variant='filled' 
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
              <div className='absolute top-2 right-2'>
                <IconButton size='large'>
                  <StarOutlineIcon sx={{ color: 'white'}} fontSize='large'/>
                </IconButton>
              </div>
          </div>  
        <CardContent className='w-full flex flex-col justify-between h-44'>
          {provinceLabels.length > 0 && (
            <p className="text-sm text-gray-600">
              📍 {provinceLabels.slice(0, 2).join(', ')}
              {provinceLabels.length > 2 && ` +${provinceLabels.length - 2} อื่นๆ`}
            </p>
          )}
          <h5 className='text-2xl font-semibold break-words line-clamp-1'>{display_name}</h5>
          <div className="break-words line-clamp-2">{bio}</div>
          <p className="mt-auto font-semibold">{hourly_rate} บาท / ชั่วโมง</p>
        </CardContent>
      </Card>
    </div>
  );
}
