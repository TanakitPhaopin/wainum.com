import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useSearchParams } from 'react-router';
import { signUp } from '../lib/auth';
import { toast } from 'react-toastify';
import MySelect from '../components/Select.jsx';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: 1, // mobile
        sm: 'auto', // tablet
        md: 'auto', // laptop
        lg: 'auto', // big desktop
        xl: 'auto', // extra big desktop
    },
    height: {
      xs: 1, // mobile
      sm: 1, // tablet
      md: 'auto', // laptop
      lg: 'auto', // big desktop
      xl: 'auto', // extra big desktop
   },
    bgcolor: 'white',
    boxShadow: 24,
    p: {
      xs: 2, // mobile
      sm: 4, // tablet
   },
    maxHeight: 6/6,
    overflowY: "auto",
    borderRadius: 2,
  };

  export default function SignupModal({open, handleClose, openLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState(null);  
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (open) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        const r = searchParams.get('r');
          if (r=== 'teacher') {
              setRole('ครูสอนว่ายน้ำ');
          } else {
            setRole('');
          }
        }
    }, [open, searchParams]);
  
    async function handleSignup(e) {
      if ( role === '' || username === '' || email === '' || password === '' || confirmPassword === '' || dob === null) {
        toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('รหัสผ่านไม่ตรงกัน');
        return;
      }
      if (role === '') {
        toast.error('กรุณาเลือกบทบาท');
        return;
      }
      const { data, error } = await signUp(email, password, role, username, dob);
    
      if (error) {
        toast.error('เกิดข้อผิดพลาด: กรุณาตรวจสอบข้อมูลของคุณ');
        console.error('Error signing up:', error);
      } else {
        toast.success('ส่งอีเมลยืนยันแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ');
        handleClose();
        setSearchParams({});
      }
    }
    
  return (
    <div>
      <Modal
        open={open}
        onClose={() => {handleClose(); setSearchParams({});}}
      >
        <Box sx={style}>
          <div className='flex flex-col items-center justify-center p-4 gap-4 relative'>
            <CloseIcon fontSize='large' className='absolute top-2 right-2 cursor-pointer' onClick={() => {handleClose(); setSearchParams({});}}/>
            <h1 className='font-semibold text-3xl'>สร้างบัญชี</h1>
            <div className='flex flex-col items-center justify-center gap-4 mb-4 w-full'>
              <MySelect
                id="role"
                menuItems={[
                  { value: 'นักเรียน', label: 'นักเรียน' },
                  { value: 'ครูสอนว่ายน้ำ', label: 'ครูสอนว่ายน้ำ' }
                ]}
                value={role}
                label="บทบาท"
                onChange={(e) => setRole(e.target.value)}
              />
              <TextField
                label="ชื่อผู้ใช้"
                placeholder="กรอกชื่อจริง-นามสกุล"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <DatePicker
                label="วันเดือนปีเกิด"
                value={dob}
                onChange={(newValue) => setDob(newValue)}
                format="DD/MMM/YYYY"
                maxDate={moment()}
                disableFuture
                className='w-full'
              />
            </div>
            <Divider className='w-full'/>
            <div className='flex flex-col items-center justify-center gap-4 my-4 w-full'>
              <TextField 
                id="email" 
                label="อีเมล" 
                variant="outlined" 
                className='w-full'
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
              <TextField 
                id="password"
                label="รหัสผ่าน" 
                type="password" 
                variant="outlined" 
                className='w-full'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <TextField 
                id="confirm_password"
                label="ยืนยันรหัสผ่าน" 
                type="password" 
                variant="outlined" 
                className='w-full'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button variant="contained" color="primary" onClick={handleSignup} className='w-full'>
              ดำเนินการต่อ
            </Button>
            <div className='mt-8 flex flex-col items-center gap-4'>
              <p className='text-sm text-gray-500 font-sans'>มีบัญชี? <span className='text-blue-500 hover:underline cursor-pointer' onClick={openLogin}>เข้าสู่ระบบ</span></p>          
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
