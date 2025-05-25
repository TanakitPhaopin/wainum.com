import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { ReactTyped } from "react-typed";

export default function BecomeTeacher({openSignupClick}) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const handleClick = () => {
        if (user && user?.metadata?.role === 'ครูสอนว่ายน้ำ') {
            toast.error('คุณได้ลงทะเบียนเป็นครูสอนว่ายน้ำแล้ว');
            return;
        }
        if (user) {
            toast.info('กรุณาออกจากระบบก่อนทำการสมัครใหม่');
            return;
        }

        navigate('?r=teacher');
        openSignupClick();
    }
    return (
        <div className="flex flex-col w-full items-center justify-center h-auto bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold mb-4">เป็นครูสอนว่ายน้ำ</h1>
            <ReactTyped 
                    strings={[
                        "มาเป็นส่วนหนึ่งในการสอนว่ายน้ำ",
                        "สอนว่ายน้ำให้กับผู้เรียนทุกวัย",
                        "สร้างรายได้จากการสอนว่ายน้ำ",
                    ]} 
                    typeSpeed={30} 
                    backSpeed={30}
                    startDelay={1000}
                    backDelay={3000}
                    loop
                    className='text-md md:text-lg mb-6'
            />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleClick} 
                className="w-full max-w-md"
                size="large"
                sx={{
                    backgroundColor: '#023047',
                    '&:hover': {
                        backgroundColor: '#023047',
                    },
                }}
            >
                สมัครเป็นครู
            </Button>
        </div>
    );
}
                
            