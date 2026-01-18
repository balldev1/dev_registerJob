"use client";

import Image from "next/image";
import Link from "next/link";

export function NavbarAdmin() {
  return (
    <div className="  flex items-center justify-between ">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.webp" width={120} height={120} alt="hexyong logo" />
      </Link>
      <div>
        {/* <button className="bg-blue-600 text-white p-2 px-6 rounded shadow font-semibold  cursor-pointer hover:opacity-90">
          สมัครเข้าใช้งาน
        </button> */}
      </div>
    </div>
  );
}
