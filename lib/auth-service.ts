import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key-change-this";
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 week") 
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) return null;
  try {
    const payload = await decrypt(session);
    // FIX: Return 'payload.user' instead of just 'payload'
    return payload.user; 
  } catch (error) {
    return null;
  }
}

export async function createSession(user: { id: string; email: string; name: string; username: string; image: string | null }) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
  const session = await encrypt({ user, expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    expires,
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}