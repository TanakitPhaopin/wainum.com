import {useEffect} from 'react';
import { useLocation } from 'react-router';

export default function TermsOfService() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="p-8 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-4">ข้อตกลงและเงื่อนไขการใช้งาน</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. การยอมรับข้อตกลง</h2>
        <p>
          การเข้าใช้งานเว็บไซต์และบริการของ ว่ายน้ำ.com ถือว่าผู้ใช้ได้ยอมรับข้อตกลงและเงื่อนไขการใช้งานฉบับนี้ หากท่านไม่เห็นด้วยกับข้อตกลง กรุณาหยุดการใช้งานทันที
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. คำนิยาม</h2>
        <p><strong>“ผู้เรียน”</strong> หมายถึง บุคคลที่ต้องการค้นหาครูผู้สอน</p>
        <p><strong>“ครูผู้สอน”</strong> หมายถึง บุคคลที่ลงทะเบียนเป็นครูผู้สอนว่ายน้ำผ่านแพลตฟอร์ม</p>
        <p><strong>“บริการ”</strong> หมายถึง เว็บไซต์ แอปพลิเคชัน และระบบอื่น ๆ ที่ ว่ายน้ำ.com จัดให้</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. การลงทะเบียนและการใช้บัญชี</h2>
        <h3 className="text-lg font-semibold">สำหรับผู้เรียน:</h3>
        <p>ผู้เรียนสามารถลงทะเบียนได้เมื่อมีความประสงค์จะค้นหาครูผู้สอน ดูข้อมูลติดต่อ หรือบันทึกครูผู้สอนที่ชื่นชอบ</p>
        <h3 className="text-lg font-semibold">สำหรับครูผู้สอน:</h3>
        <p>ครูผู้สอนต้องยืนยันตัวตนและให้ข้อมูลที่เป็นความจริง หากพบว่าข้อมูลเป็นเท็จ ทางเราขอสงวนสิทธิ์ในการระงับบัญชี</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. สิทธิ์ในทรัพย์สินทางปัญญา</h2>
        <p>
          เนื้อหาทั้งหมดในแพลตฟอร์มเป็นทรัพย์สินของ ว่ายน้ำ.com ห้ามทำการคัดลอก ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาต
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. ข้อห้ามในการใช้งาน</h2>
        <p>ห้ามใช้แพลตฟอร์มในการกระทำดังต่อไปนี้:</p>
        <ul className="list-disc ml-6">
          <li>เผยแพร่ข้อมูลเท็จหรือหลอกลวง</li>
          <li>ละเมิดสิทธิ์ในทรัพย์สินทางปัญญาของผู้อื่น</li>
          <li>เผยแพร่เนื้อหาที่ไม่เหมาะสมหรือผิดกฎหมาย</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. การชำระเงินและการคืนเงิน</h2>
        <p>การชำระเงินผ่านแพลตฟอร์มนี้ถือเป็นการยอมรับข้อตกลงในการใช้บริการและไม่สามารถขอคืนเงินได้</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. ข้อจำกัดความรับผิดชอบ</h2>
        <p>ว่ายน้ำ.com จะไม่รับผิดชอบต่อความเสียหายที่เกิดขึ้นจากการใช้บริการ ไม่ว่าทางตรงหรือทางอ้อม ผู้ใช้ต้องรับผิดชอบต่อการตัดสินใจในการใช้บริการเอง</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. การแก้ไขและการปรับปรุงข้อตกลง</h2>
        <p>ทางเรามีสิทธิ์ในการปรับปรุงข้อตกลงและเงื่อนไขนี้ได้ตลอดเวลา โดยจะแจ้งให้ผู้ใช้ทราบล่วงหน้า</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. ติดต่อเรา</h2>
        <p>หากมีข้อสงสัยเกี่ยวกับข้อตกลงและเงื่อนไขการใช้งาน กรุณาติดต่อเราที่ tphaopin@gmail.com</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. นโยบายการเก็บรักษาข้อมูล</h2>
        <p>ว่ายน้ำ.com จะไม่ขายหรือเผยแพร่ข้อมูลของผู้ใช้ให้กับบุคคลภายนอกหรือบุคคลที่สามโดยไม่ได้รับอนุญาตจากผู้ใช้</p>
      </section>

      <div className="text-center text-sm text-gray-400 mt-8">
        © {new Date().getFullYear()} ว่ายน้ำ.com สงวนลิขสิทธิ์
      </div>
    </div>
  );
}
