import { motion } from "motion/react"
import { Helmet } from "react-helmet";

export default function Contact() {
    const title = "ติดต่อ ว่ายน้ำ.com | ค้นหาครูสอนว่ายน้ำ";
    const desc  = "ติดต่อทีมงาน ว่ายน้ำ.com สำหรับคำถาม ข้อเสนอแนะ รายงานสแปมหรือปัญหาการใช้งาน เราพร้อมช่วยเหลือ จ.-ศ. 9:00–17:00 น.";
    const url   = "https://xn--q3cro8bc2kk6a.com/contact";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "หน้าหลัก", "item": "https://xn--q3cro8bc2kk6a.com/" },
        { "@type": "ListItem", "position": 2, "name": "ติดต่อเรา", "item": url }
        ]
    };

    const orgLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ว่ายน้ำ.com",
        "url": "https://xn--q3cro8bc2kk6a.com/",
        "contactPoint": [{
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "tphaopin@gmail.com",
        "availableLanguage": ["th", "en"],
        "hoursAvailable": "Mo-Fr 09:00-17:00"
        }]
    };

    return (
        <>
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={url} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content="https://jxamlumehxyjlqcekmgl.supabase.co/storage/v1/object/public/wainum-logo//wainum_logo.png" />
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
        </Helmet>
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

