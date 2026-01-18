import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="fixed w-full min-h-screen   bg-linear-to-r from-sky-50 via-wihte to-sky-50 text-black">
      <div className="flex flex-col justify-center min-h-screen items-center gap-6 px-4 text-center">
        {/* LOGO */}
        <Image src="/logo2.png" width={260} height={260} alt="hexyong logo" />

        {/* TITLE */}
        <h2 className="font-bold text-4xl text-sky-600">
          ระบบรับสมัครงานสำหรับ HR ที่ใช้ง่าย
        </h2>

        {/* SUB TITLE */}
        <p className="text-gray-600 ">
          จัดการการรับสมัครงานครบจบในที่เดียว ตั้งแต่สร้างลิงก์สมัครงาน
          ไปจนถึงดูข้อมูลผู้สมัครแบบเป็นระบบ
        </p>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mt-6">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-sky-600 mb-2">
              🔗 สร้างลิงก์สมัครงาน
            </h3>
            <p className="text-sm text-gray-600">
              สร้างฟอร์มสมัครงานได้ในไม่กี่คลิก แชร์ลิงก์ให้ผู้สมัครได้ทันที
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-sky-600 mb-2">
              👥 จัดการผู้สมัคร
            </h3>
            <p className="text-sm text-gray-600">
              ดูรายชื่อผู้สมัครทั้งหมด แยกสถานะ ติดต่อแล้ว / ยังไม่ติดต่อ
              ได้ง่าย
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="font-semibold text-sky-600 mb-2">
              📄 ดู Resume & Portfolio
            </h3>
            <p className="text-sm text-gray-600">
              ผู้สมัครอัปโหลด Resume และ Portfolio HR เปิดดูได้ทันทีในระบบ
            </p>
          </div>
        </div>

        <Link
          href="/admin"
          className="mt-6 inline-flex items-center justify-center px-8 py-3 
                     bg-blue-600 text-white font-semibold rounded-lg shadow 
                     hover:bg-blue-700 transition">
          เข้าสู่ระบบสำหรับ HR
        </Link>

        {/* FOOTER TEXT */}
        <p className="text-xs text-gray-400 ">
          ออกแบบมาเพื่อ HR และทีมงาน ที่ต้องการความเร็วและความเป็นระบบ
        </p>
      </div>
      <footer className="fixed bottom-5 py-1 px-2 right-5 text-sm font-bold flex items-center gap-2 text-sky-700">
        nanthawatcola1994@gmail.com
        <p className="font-semibold text-sm bg-sky-600 px-1  text-white rounded">
          developer
        </p>
        <p className="font-semibold text-sm bg-sky-600 px-1  text-white rounded">
          beta 1.0
        </p>
      </footer>
    </div>
  );
}
