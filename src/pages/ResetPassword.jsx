import { useState } from "react";
import { Button } from "@mui/material";
import MyTextField from "../components/TextField";
import { toast } from "react-toastify";
import { updatePassword } from "../services/settings";
import { signOut } from "../lib/auth";
import { motion } from "motion/react"

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน");
            return;
        }

        try {
            const result = await updatePassword(newPassword);
            if (result) {
                toast.success("รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว");
                toast.info("กรุณาเข้าสู่ระบบอีกครั้ง");
                setNewPassword("");
                setConfirmPassword("");
                // Sign out the user after password reset
                await signOut();
            } else {
                toast.error("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
        }
    }

    return (
        <div className="flex items-center justify-center h-full">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                delay={0.2}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-6 text-center">รีเซ็ตรหัสผ่าน</h2>
                <MyTextField
                    id="new-password"
                    label="รหัสผ่านใหม่"
                    variant="outlined"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <MyTextField
                    id="confirm-password"
                    label="ยืนยันรหัสผ่านใหม่"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    className="w-full py-2 text-white font-semibold hover:bg-blue-700 transition duration-200"
                    onClick={() => handleSubmit()}
                >
                    รีเซ็ตรหัสผ่าน
                </Button>
            </motion.div>
        </div>
    );
}