import { useState } from "react";
import { Button } from "@mui/material";
import MyTextField from "../components/TextField";
import { resetPassword } from "../services/password";
import { toast } from "react-toastify";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        if (!email) {
            toast.error("กรุณากรอกอีเมลของคุณ");
            return;
        }
        try {
            const message = await resetPassword(email);
            setEmail("");
            toast.success(message);
        } catch (error) {
            toast.error(error.message || "เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน");
            setEmail("");
        }

        
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">ลืมรหัสผ่าน</h2>

                <div className="mb-4">
                    <MyTextField
                        id="email"
                        label="อีเมล"
                        variant="outlined"
                        fullWidth
                        type="email"
                        className="w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className="w-full py-2 text-white font-semibold hover:bg-blue-700 transition duration-200"
                    onClick={handleSubmit}
                >
                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                </Button>
            </div>
        </div>
    );
}
