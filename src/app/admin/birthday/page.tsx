import { AdminShell } from "@/components/admin/layout/AdminShell";
import { BirthdayConfigEditor } from "@/components/admin/birthday/BirthdayConfigEditor";
import { getSiteConfig } from "@/lib/admin/content-manager";

export const dynamic = "force-dynamic";

export default async function BirthdayPage() {
  const config = await getSiteConfig();

  if (!config) {
    return (
      <AdminShell>
        <div className="text-center p-12 text-[#9ca3af] font-mono">
          Error al cargar la configuración.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <BirthdayConfigEditor initialConfig={config} />
    </AdminShell>
  );
}
