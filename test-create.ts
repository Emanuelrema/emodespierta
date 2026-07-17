import { createPersona } from "./src/lib/admin/content-manager";

async function test() {
  try {
    const p = await createPersona("Walter");
    console.log("Success:", p);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
