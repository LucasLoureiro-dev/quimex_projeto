import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const companyName = formData.get("companyName");
    const cnpj = formData.get("cnpj");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const segment = formData.get("segment");
    const logo = formData.get("logoFile");

    // Diretório onde as imagens vão ficar
    const uploadDir = path.join(process.cwd(), "public", "parcerias");

    await mkdir(uploadDir, { recursive: true });

    let savedFileName = "";

    if (logo && logo.name) {
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      savedFileName = `${Date.now()}-${logo.name}`;
      const filePath = path.join(uploadDir, savedFileName);

      // salva a imagem
      await writeFile(filePath, buffer);
    }

    // Salvar dados no JSON
    const dbPath = path.join(process.cwd(), "public", "parcerias.json");

    let existing = [];
    try {
      const data = await readFile(dbPath, "utf8");
      existing = JSON.parse(data);
    } catch {}

    existing.push({
      id: Date.now(),
      companyName,
      cnpj,
      email,
      phone,
      segment,
      logo: `/parcerias/${savedFileName}`
    });

    await writeFile(dbPath, JSON.stringify(existing, null, 2));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erro ao salvar parceria:", error);
    return new Response(JSON.stringify({ error: true }), { status: 500 });
  }
}
