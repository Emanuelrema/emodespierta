import { login } from "@/lib/admin/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body as { password: string };

    if (!password) {
      return Response.json({ error: "Password required" }, { status: 400 });
    }

    const success = await login(password);
    if (!success) {
      return Response.json({ error: "Incorrect password" }, { status: 401 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
