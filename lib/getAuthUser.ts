// lib/getAuthUser.ts
import { cookies } from "next/headers";
import { verifyToken } from "./decoded";

export async function getAuthPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pos1")?.value;
  return verifyToken(token);
}
