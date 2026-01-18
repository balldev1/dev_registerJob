"use client";

import { AuthOverlay } from "./AuthOverlay";
import { LinkRegisterJob } from "./LinkRegisterJob";
import { NavbarAdmin } from "./NavbarAdmin";
import { TableAdmin } from "./TableAdmin";
import { useAuthMe } from "@/hooks/useAuthMe";

export function AdminComp() {
  const { loading, unauthorized } = useAuthMe();

  if (loading) {
    return <div className="p-6">กำลังตรวจสอบสิทธิ์...</div>;
  }

  return (
    <div className="h-screen overflow-hidden relative bg-gray-200">
      {/* navbar */}
      <nav className="fixed  top-0 left-0 w-full h-24 pt-8 bg-white text-black px-10 z-50  shadow-lg shadow-gray-200 ">
        <NavbarAdmin />
      </nav>

      {/* aside */}
      <div
        className={`transition ${
          unauthorized ? "opacity-50 pointer-events-none select-none" : ""
        }`}>
        <aside className="fixed top-24 left-0 w-160 h-[calc(100vh-6rem)]  ">
          <LinkRegisterJob />
        </aside>

        {/* main content */}
        <main className="pt-24  pl-160 h-screen bg-white text-black   ">
          {/* h-[calc(100vh-6rem)] */}
          <div className="flex  h-[calc(100vh-6rem)] ">
            {/* body1 */}
            <div className="w-full   overflow-y-auto">
              <div className="overflow-y-auto pb-20">
                <TableAdmin />
              </div>
            </div>
          </div>
        </main>
      </div>

      {unauthorized && <AuthOverlay />}

      <footer className="fixed bottom-5 bg-white shadow-lg shadow-gray-400  py-1 px-2 right-5 text-sm font-bold flex items-center gap-2 text-sky-700">
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
