import React from "react";
import { AppGate } from "@/components/game/AppGate";
import { getPublicPersonas } from "@/lib/public/content";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const personas = await getPublicPersonas();
  return <AppGate personas={personas} />;
}
