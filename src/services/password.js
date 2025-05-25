import { supabase } from "../lib/supabase";

// Reset password function
export async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${import.meta.env.VITE_DOMAIN_NAME}/reset-password`,
        });

        if (error) {
            console.error("Password reset error:", error.message);
            throw new Error("เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน");
        } else {
            return "ลิงก์รีเซ็ตรหัสผ่านจะถูกส่งไปยังอีเมลของคุณ";
        }
    } catch (error) {
        throw new Error(error.message);
    }
}