import { logout } from "@/lib/admin/auth";

export async function POST() {
  try {
    await logout();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
