import MyAccordion from "../components/Accordion";
import { Divider } from "@mui/material";
export default function FAQ() {
    // Student FAQs
    const faqStudent_SearchAndBooking = [
        {
            title: "ฉันจะหาครูสอนว่ายน้ำได้อย่างไร?",
            content: "คุณสามารถใช้ระบบค้นหาของเราเพื่อเลือกครูตามจังหวัด ระดับทักษะ และอื่นๆ",
            defaultExpanded: false
        },
        {
            title: "สามารถเรียนได้ที่ไหนบ้าง?",
            content: "คุณสามารถดูสถานที่ที่ครูให้บริการได้ในโปรไฟล์ โดยครูอาจมีหลายสถานที่ให้เลือกตามความสะดวกของคุณ",
            defaultExpanded: false
        },
        {
            title: "ฉันสามารถเรียนกับครูหลายคนได้หรือไม่?",
            content: "ได้ คุณสามารถลองเรียนกับครูหลายคนเพื่อเปรียบเทียบสไตล์การสอน หรือเรียนหลายคอร์สตามความต้องการของคุณ",
            defaultExpanded: false
        }
    ];
    const faqStudent_ContactAndTrust = [
        {
            title: "ฉันจะติดต่อครูได้อย่างไร?",
            content: "เมื่อคุณเลือกครูที่สนใจแล้ว คุณสามารถส่งคำขอหรือติดต่อผ่านช่องทางที่ครูเปิดเผยไว้ในโปรไฟล์ เช่น เบอร์โทรหรือไลน์",
            defaultExpanded: false
        },
        {
            title: "ฉันจะรู้ได้อย่างไรว่าครูมีคุณภาพ?",
            content: "คุณสามารถดูรีวิวจากนักเรียนคนอื่น ๆ และตรวจสอบว่าโปรไฟล์ครูมีตรายืนยันหรือไม่ ซึ่งแสดงว่าผ่านการตรวจสอบจากทีมงานของเรา",
            defaultExpanded: false
        }
    ];
    const faqStudent_Payment = [
        {
            title: "มีค่าใช้จ่ายในการใช้งานแพลตฟอร์มหรือไม่?",
            content: "การใช้งานแพลตฟอร์มสำหรับนักเรียนไม่มีค่าใช้จ่าย คุณชำระเฉพาะค่าบริการกับครูโดยตรงตามที่ตกลงกัน",
            defaultExpanded: false
        },
        {
            title: "สามารถขอคืนเงินหรือยกเลิกการเรียนได้หรือไม่?",
            content: "การคืนเงินหรือยกเลิกต้องขึ้นอยู่กับข้อตกลงระหว่างคุณกับครูโดยตรง ทางแพลตฟอร์มไม่มีส่วนเกี่ยวข้องในด้านการชำระเงิน",
            defaultExpanded: false
        }
    ];

    // Teacher FAQs
    const faqRegisterProfile = [
        {
            title: "ฉันจะลงทะเบียนเป็นครูสอนได้อย่างไร?",
            content: "คุณสามารถลงทะเบียนเป็นครูสอนได้โดยคลิกที่ปุ่ม 'สมัครเป็นครู' และกรอกข้อมูลโปรไฟล์ของคุณ เช่น ประสบการณ์ สถานที่ที่สอน และเรทราคา",
            defaultExpanded: false
        },
        {
            title: "สามารถแก้ไขโปรไฟล์หรือข้อมูลส่วนตัวได้อย่างไร?",
            content: "คุณสามารถแก้ไขโปรไฟล์ของคุณได้ตลอดเวลา โดยเข้าสู่ระบบและไปที่หน้าการตั้งค่าโปรไฟล์",
            defaultExpanded: false
        },
        {
            title: "มีการตรวจสอบหรือยืนยันครูสอนว่ายน้ำอย่างไร?",
            content: "เรามีกระบวนการตรวจสอบโปรไฟล์ครูสอนว่ายน้ำ เพื่อให้แน่ใจว่าข้อมูลที่ให้มาถูกต้องและเชื่อถือได้",
            defaultExpanded: false
        }
    ];
    const faqFeesPayment = [
        {
            title: "มีค่าธรรมเนียมหรือค่าใช้จ่ายในการสมัครหรือไม่?",
            content: "การสมัครเป็นครูพื้นฐานไม่มีค่าใช้จ่าย แต่หากต้องการแสดงผลในหน้าค้นหาและรับตรายืนยัน คุณสามารถสมัครแพ็กเกจสมาชิกแบบเสียเงินได้",
            defaultExpanded: false
        },
        {
            title: "จะได้รับเงินค่าบริการอย่างไร?",
            content: "คุณและนักเรียนจะจัดการชำระเงิน โดยไม่มีการชำระเงินผ่านแพลตฟอร์มโดยตรง แต่คุณสามารถตกลงกับนักเรียนเกี่ยวกับวิธีการชำระเงินที่สะดวก เช่น เงินสดหรือโอนผ่านธนาคาร",
            defaultExpanded: false
        }
    ];
    const faqTeaching = [
        {
            title: "จะได้รับนักเรียนจากแพลตฟอร์มได้อย่างไร?",
            content: "นักเรียนสามารถค้นหาครูผ่านระบบค้นหาของเรา และจะเห็นโปรไฟล์ของคุณหากคุณมีข้อมูลครบถ้วนและเปิดใช้งานอยู่",
            defaultExpanded: false
        },
        {
            title: "สามารถสอนหลายสถานที่ได้หรือไม่?",
            content: "ได้ คุณสามารถเพิ่มหลายสถานที่ในโปรไฟล์ของคุณ เพื่อให้นักเรียนเลือกตามสถานที่ที่สะดวก",
            defaultExpanded: false
        },
        {
            title: "จะติดต่อกับนักเรียนได้อย่างไร?",
            content: "หลังจากนักเรียนส่งคำขอแล้ว คุณสามารถใช้ข้อมูลการติดต่อของนักเรียนเพื่อติดต่อสื่อสารได้",
            defaultExpanded: false
        },
        {
            title: "หากต้องการยกเลิกหรือเปลี่ยนเวลาสอนต้องทำอย่างไร?",
            content: "คุณสามารถแจ้งนักเรียนล่วงหน้า โดยใช้ช่องทางการติดต่อที่ได้ตกลงกันไว้ ทางเราไม่รับผิดชอบต่อการเปลี่ยนแปลงที่เกิดขึ้นระหว่างคุณกับนักเรียน",
            defaultExpanded: false
        }
    ];
    const faqPremium = [
        {
            title: "ครูพรีเมียมคืออะไร?",
            content: "ครูพรีเมียมคือครูที่สมัครแพ็กเกจสมาชิกแบบพรีเมียม ซึ่งจะได้รับสิทธิพิเศษมากมาย เช่น การแสดงผลในตำแหน่งแนะนำและโปรไฟล์ที่โดดเด่น",
            defaultExpanded: false
        },
        {
            title: "สิทธิประโยชน์ของการเป็นครูพรีเมียมมีอะไรบ้าง?",
            content: "ครูพรีเมียมจะได้รับตรายืนยัน, แสดงในหมวดแนะนำ, โอกาสได้รับนักเรียนมากขึ้น, เข้าถึงฟีเจอร์เพิ่มเติม และการสนับสนุนระดับพรีเมียม",
            defaultExpanded: false
        },
        {
            title: "จะสมัครเป็นครูพรีเมียมได้อย่างไร?",
            content: "คุณสามารถสมัครเป็นครูพรีเมียมได้จากหน้าโปรไฟล์ของคุณ โดยเลือกแพ็กเกจและดำเนินการชำระเงินผ่านระบบ",
            defaultExpanded: false
        }
    ];
    const faqSupport = [
        {
            title: "มีการสนับสนุนหรือช่วยเหลือสำหรับครูสอนว่ายน้ำหรือไม่?",
            content: "ใช่ หากคุณมีคำถามหรือปัญหาใด ๆ คุณสามารถติดต่อทีมสนับสนุนของเราได้ที่อีเมล",
            defaultExpanded: false
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">คำถามที่พบบ่อย (FAQ)</h1>
            <div className="flex flex-col gap-8">
                <h2 className="text-2xl font-semibold text-center">สำหรับนักเรียน</h2>
                <div className="flex flex-col gap-4">
                    <div className="text-xl font-semibold flex flex-col gap-2">
                        <h3>การค้นหาและจองครู</h3>
                        <MyAccordion data={faqStudent_SearchAndBooking} />
                    </div>  
                    <div className="text-xl font-semibold flex flex-col gap-2">
                        <h3>การติดต่อและความน่าเชื่อถือ</h3>
                        <MyAccordion data={faqStudent_ContactAndTrust} />
                    </div> 
                    <div className="text-xl font-semibold flex flex-col gap-2">
                        <h3>การชำระเงิน</h3>
                        <MyAccordion data={faqStudent_Payment} />
                    </div> 
                </div>
            </div>
            <Divider sx={{marginY: 4}} />
            <div className="flex flex-col gap-8">
                <h2 className="text-2xl font-semibold text-center">สำหรับครูสอนว่ายน้ำ</h2>
                <div className="flex flex-col gap-4">
                    <div className="text-xl font-semibold flex flex-col gap-2">
                        <h3>การสมัครและโปรไฟล์</h3>
                        <MyAccordion data={faqRegisterProfile} />
                    </div>  
                    <div className="text-xl font-semibold flex flex-col gap-2">
                        <h3>ค่าบริการและการชำระเงิน</h3>
                        <MyAccordion data={faqFeesPayment} />
                    </div> 
                    <div className="text-xl font-semibold flex flex-col gap-2">
                        <h3>การเรียนการสอน</h3>
                        <MyAccordion data={faqTeaching} />
                    </div> 
                    <div className="text-xl font-semibold flex flex-col gap-2">
                        <h3>โปรไฟล์ครูพรีเมียม</h3>
                        <MyAccordion data={faqPremium} />
                    </div> 
                    <div className="text-xl font-semibold flex flex-col gap-2">
                        <h3>การสนับสนุนและช่วยเหลือ</h3>
                        <MyAccordion data={faqSupport} />
                    </div> 
                </div>
            </div>
        </div>
    );
}