import { useAuth } from "../contexts/AuthContext";
import { Button } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PushPinIcon from '@mui/icons-material/PushPin';

export function Subscription() {
    const { user, isSubscribed } = useAuth();

    const email = user?.email || '';
    const stripeLoginLink = import.meta.env.VITE_STRIPE_LOGIN_LINK;
    const encodedEmail = encodeURIComponent(email);
    const loginUrl = `${stripeLoginLink}?prefilled_email=${encodedEmail}`;

    return (
        <div className="mt-4 flex flex-col items-center justify-center h-max sm:p-4">
            <div className="flex flex-col items-center justify-center h-max w-auto gap-4 bg-gray-50 rounded-2xl p-4 shadow-md">
                <h1 className="text-4xl">Premium</h1>
                <h2 className="text-xl">99 บาท/เดือน</h2>
                <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <VerifiedIcon />
                        <p>ได้รับเครื่องหมายยืนยันตัวตน (Verified Badge)</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <SearchIcon />
                        <p>โปรไฟล์แนะนำในหน้าค้นหา</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <EmojiEventsIcon />
                        <p>แสดงบนหน้าแรก</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <PushPinIcon />
                        <p>อยู่บนสุดของรายการครูสอนว่ายน้ำ</p>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center p-4">
                    {isSubscribed ? (
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={() => window.location.href = loginUrl}
                            sx={{width: 1, maxWidth: 300}}
                        >
                            จัดการซับสคริปชั่น
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => window.location.href = `https://buy.stripe.com/test_14k5o4dYX1RH5OgeUU?prefilled_email=${encodedEmail}`}
                            sx={{width: 1, maxWidth: 300}}
                            >
                                ซื้อ
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );

}