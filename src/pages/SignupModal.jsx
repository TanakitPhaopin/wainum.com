import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import { signUp } from '../lib/auth';
import MySelect from '../components/Select.jsx';

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
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
    maxHeight: 5/6,
    overflowY: "auto",
    borderRadius: 2,
    };

    export default function SignupModal({open, handleClose, openLogin, dafaultRole}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/dashboard', { replace: true });
    }, [user]);

    useEffect(() => {
        if (open) {
        setEmail('');
        setPassword('');
        setError(null);
        }
    }, [open]);
  
    async function handleSubmit(e) {
        e.preventDefault();
        const { error } = await signUp(email, password);
        if (error) {
        alert(error.message);
        } else {
        alert('Check your email for the confirmation link!');
        }
    }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <div className='flex flex-col items-center justify-center p-4 gap-4'>
            <h1 className='font-semibold text-3xl'>สร้างบัญชี</h1>
            <MySelect 
                menuItems={[
                    { value: 'นักเรียน', label: 'นักเรียน' },
                    { value: 'ครูสอนว่ายน้ำ', label: 'ครูสอนว่ายน้ำ' },
                ]}
                label={'ประเภทผู้ใช้'}
                value={dafaultRole}
                onChange={e => setRole(e.target.value)}
            />
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
            {error && <p className='self-start w-full text-left text-red-500 text-sm font-sans'>ไม่สามารถสร้างบัญชีได้</p>} 
            <Button variant="contained" color="primary" onClick={handleSubmit} className='w-full'>
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
