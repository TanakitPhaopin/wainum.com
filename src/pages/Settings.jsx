import { useAuth } from "../contexts/AuthContext";
import MyTextField from "../components/TextField";
import { Divider, Button } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { updatePassword, updateUserName } from "../services/settings";

export default function Settings() {
    const { user } = useAuth();
    // Password change state
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // name change state
    const [openChangeName, setOpenChangeName] = useState(false);
    const [newName, setNewName] = useState('');


    const handleChange_NewPassword = (e) => {
        setNewPassword(e.target.value);
    }
    const handleChange_ConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleChangePassword = () => {
        setOpenChangePassword(true);
        setNewPassword('');
        setConfirmPassword('');
    }
    const handleCloseChangePassword = () => {
        setOpenChangePassword(false);
        setNewPassword('');
        setConfirmPassword('');
        toast.info("การเปลี่ยนรหัสผ่านถูกยกเลิก");
    }

    const handleSubmitChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }
        try {
            // Here you would typically call your API to change the password
            const result = await updatePassword(newPassword);
            if (!result) {
                toast.error("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
                return;
            }
            // Reset fields after submission
            setNewPassword('');
            setConfirmPassword('');
            setOpenChangePassword(false);
            toast.success("รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว");
        } catch (error) {
            console.error("Error submitting new password:", error);
            toast.error("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
        }
    }

    const handleChangeName = () => {
        setOpenChangeName(true);
        setNewName(user?.user_metadata?.full_name || '');
    }
    const handleSubmitChangeName = async () => {
        if (!newName.trim()) {
            toast.error("กรุณากรอกชื่อ-นามสกุลใหม่");
            return;
        }
        try {
            // Here you would typically call your API to change the name
            const result = await updateUserName(newName);
            if (!result) {
                toast.error("เกิดข้อผิดพลาดในการเปลี่ยนชื่อ-นามสกุล");
                return;
            }
            setOpenChangeName(false);
            setNewName('');
            toast.success("ชื่อ-นามสกุลถูกเปลี่ยนเรียบร้อยแล้ว");
        } catch (error) {
            console.error("Error submitting new name:", error);
            toast.error("เกิดข้อผิดพลาดในการเปลี่ยนชื่อ-นามสกุล");
        }
    }


    return (
        <div className="flex flex-col items-center justify-center h-auto">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">ตั้งค่าบัญชี</h1>
                {/* Email */}
                <div className="flex flex-col gap-1 mb-2">
                    <p className="font-semibold text-lg">อีเมล</p>
                    <MyTextField
                        value={user?.email || ''}
                        disabled
                        className="mb-4 w-full max-w-md"
                    />
                    <p className="font-normal text-gray-500 text-sm text-end">ไม่สามารถเปลี่ยนได้</p>
                </div>
                {/* Password */}
                <div className="flex flex-col gap-1 mb-2">
                    <p className="font-semibold text-lg">รหัสผ่าน</p>
                    { !openChangePassword ? (
                        <>
                        <MyTextField
                            value={'*********'}
                            disabled
                            className="w-full max-w-md"
                            onChange={() => {}}
                            type="password"
                        />
                        <p 
                            className="font-normal text-blue-500 text-sm text-end cursor-pointer" 
                            onClick={() => handleChangePassword()}
                        >
                            เปลี่ยนรหัสผ่าน</p>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <MyTextField
                                label={'รหัสผ่านใหม่'}
                                value={newPassword}
                                className="w-full max-w-md"
                                type="password"
                                onChange={handleChange_NewPassword}
                            />
                            <MyTextField
                                label={'ยืนยันรหัสผ่านใหม่'}
                                value={confirmPassword}
                                className="w-full max-w-md"
                                type="password"
                                onChange={handleChange_ConfirmPassword}
                            />
                            <div className="flex flex-row justify-between items-center">
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    onClick={() => handleCloseChangePassword()}
                                >
                                    ยกเลิก
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    onClick={() => handleSubmitChangePassword()}
                                >
                                    ยืนยัน
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <Divider sx={{marginY: 4}} />
                {/* Name */}
                <div className="flex flex-col gap-1 mb-2">
                    <p className="font-semibold text-lg">ชื่อ-นามสกุล</p>
                    { !openChangeName ? (
                        <>
                        <MyTextField
                            value={user?.user_metadata?.full_name || ''}
                            disabled
                            className="mb-4 w-full max-w-md"
                        />
                        <p 
                            className="font-normal text-blue-500 text-sm text-end cursor-pointer" 
                            onClick={() => handleChangeName()}
                        >เปลี่ยนชื่อ-นามสกุล</p>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <MyTextField
                                label={'ชื่อ-นามสกุลใหม่'}
                                value={newName}
                                className="w-full max-w-md"
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <div className="flex flex-row justify-between items-center">
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    onClick={() => {setOpenChangeName(false); setNewName(''); toast.info("การเปลี่ยนชื่อ-นามสกุลถูกยกเลิก")}}
                                    className="ml-2"
                                >
                                    ยกเลิก
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    onClick={() => handleSubmitChangeName()}
                                >
                                    ยืนยัน
                                </Button>
                            </div>
                        </div>
                    )}   
                </div>
                {/* Date of birth */}
                <div className="flex flex-col gap-1 mb-2">
                    <p className="font-semibold text-lg">วันเกิด</p>
                    <MyTextField
                        value={
                        user?.user_metadata?.date_of_birth
                            ? new Date(user.user_metadata.date_of_birth).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })
                            : ''
                        }
                        disabled
                        className="mb-4 w-full max-w-md"
                    />
                    <p className="font-normal text-gray-500 text-sm text-end">ไม่สามารถเปลี่ยนได้</p>
                </div>
                {/* Role */}
                <div className="flex flex-col gap-1 mb-2">
                    <p className="font-semibold text-lg">บทบาท</p>
                    <MyTextField
                        value={user?.user_metadata?.role || ''}
                        disabled
                        className="mb-4 w-full max-w-md"
                    />
                    <p className="font-normal text-gray-500 text-sm text-end">ไม่สามารถเปลี่ยนได้</p>
                </div>
            </div>
            {/* Add more settings options here */}
        </div>
    );
}