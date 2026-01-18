import Image from "next/image";
import { AdminComp } from "@/components/admin/AdminComp";

export default function Home() {
  return (
    <div className=" bg-stone-950 min-h-screen">
      <AdminComp />
    </div>
  );
}
