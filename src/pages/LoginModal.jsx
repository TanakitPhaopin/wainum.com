import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { signIn } from '../lib/auth';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';


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

export default function LoginModal({open, handleClose, openSignup}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setEmail('');
      setPassword('');
    }
  }, [open]);
  
  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      console.error('Error login', error.message);
    } else {
      handleClose();
      navigate('/redirect', { replace: true });
      toast.success('เข้าสู่ระบบสำเร็จ');
    }
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <div className='flex flex-col items-center justify-center p-4 gap-4 relative'>
            <CloseIcon fontSize='large' className='absolute top-2 right-2 cursor-pointer' onClick={handleClose}/>
            <h1 className='font-semibold text-3xl'>เข้าสู่ระบบ</h1>
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
            <Button variant="contained" color="primary" onClick={handleSubmit} className='w-full'>
              ดำเนินการต่อ
            </Button>
            <div className='mt-8 flex flex-col items-center gap-4'>
              <p className='text-sm text-gray-500 font-sans'><a href="/reset-password" className='hover:underline'>ลืมรหัสผ่าน?</a></p>
              <p className='text-sm text-gray-500 font-sans'>ยังไม่มีบัญชี? <span className='text-blue-500 hover:underline cursor-pointer' onClick={openSignup}>สร้างบัญชี</span></p>          
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
