import { motion } from "motion/react"
import Seo from "../components/Seo";

export default function Contact() {

    return (
        <>
        <Seo
            title="ติดต่อ ว่ายน้ำ.com"
            description="หากคุณมีคำถามหรือข้อสงสัยใด ๆ หรือต้องการรายงานสแปมหรือร้องเรียน สามารถติดต่อเราผ่านช่องทางด้านล่างนี้ได้เลย (จ.-ศ. 9:00–17:00 น.)"
            canonical="https://xn--q3cro8bc2kk6a.com/contact"
        />
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            delay={0.1}
            className="flex flex-col items-start justify-center h-auto bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">ติดต่อ ว่ายน้ำ.com</h1>

            <p className="text-lg text-gray-600 mb-6">
            หากคุณมีคำถามหรือข้อสงสัยใด ๆ หรือต้องการรายงานสแปมหรือร้องเรียน
            สามารถติดต่อเราผ่านช่องทางด้านล่างนี้ได้เลย (จ.-ศ. 9:00–17:00 น.)
            </p>
            <div className="flex flex-col items-start space-y-4">
                <p className="text-md">อีเมล: <a href="mailto:tphaopin@gmail.com"
                 className="text-blue-500 hover:underline"
                 target="_blank" rel="noopener noreferrer"
                 >Email Us</a></p>
                <p className="text-md">เวลาทำการ:<span className="font-semibold"> จันทร์ - ศุกร์ 9:00 - 17:00 น.</span></p>
                <p className="text-md">เรายินดีให้บริการและตอบคำถามของคุณเสมอ</p>
            </div>
            <div className="mt-8 text-center w-full">
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} ว่ายน้ำ.com สงวนลิขสิทธิ์</p>
            </div>
        </motion.div>
        </>
    );
}

