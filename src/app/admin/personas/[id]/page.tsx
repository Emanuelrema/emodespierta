import { AdminShell } from "@/components/admin/layout/AdminShell";
import { PersonaEditor } from "@/components/admin/personas/PersonaEditor";
import { getPersonaWithContent } from "@/lib/admin/content-manager";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PersonaEditorPage({ params }: Props) {
  const { id } = await params;
  const persona = await getPersonaWithContent(id);

  if (!persona) {
    notFound();
  }

  return (
    <AdminShell>
      <PersonaEditor persona={persona} />
    </AdminShell>
  );
}
