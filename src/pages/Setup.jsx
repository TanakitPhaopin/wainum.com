import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import MySelect from '../components/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';

export default function Setup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [dob, setDob] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('กรุณากรอกชื่อผู้ใช้');
      return;
    }

    if (!role) {
      toast.error('กรุณาเลือกบทบาท');
      return;
    }

    const { error } = await supabase.from('user_profiles').insert({
      id: user.id,
      full_name: username,
      role,
      date_of_birth: dob,
    });

    if (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกโปรไฟล์');
      console.error(error);
    } else {
      toast.success('ตั้งค่าโปรไฟล์สำเร็จ');
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center h-screen px-4">
      <h1 className="text-4xl font-bold mb-4">ตั้งค่าโปรไฟล์ของคุณ</h1>
      <p className="text-lg mb-8">กรุณากรอกข้อมูลเพื่อเริ่มต้นใช้งาน</p>
      <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
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
        />
        <DatePicker
          label="วันเดือนปีเกิด"
          value={dob}
          onChange={(newValue) => setDob(newValue)}
          format="DD/MMM/YYYY"
          maxDate={moment()} // prevent future dates
          disableFuture
        />
        <TextField
          label="อีเมล"
          value={email}
          disabled
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: '#2196f3', '&:hover': { backgroundColor: '#1976d2' } }}
        >
          บันทึกโปรไฟล์
        </Button>
      </form>
    </div>
  );
}
