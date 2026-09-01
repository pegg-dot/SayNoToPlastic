import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const directory = path.join(process.cwd(), "public", "podcast");
const source = path.join(directory, "beyond-plastic-artwork.base64.txt");
const destination = path.join(directory, "beyond-plastic-artwork.webp");

await mkdir(directory, { recursive: true });
const encoded = (await readFile(source, "utf8")).trim();
if (!encoded) throw new Error("podcast_artwork_payload_empty");
const bytes = Buffer.from(encoded, "base64");
if (bytes.length < 1000) throw new Error("podcast_artwork_payload_invalid");
await writeFile(destination, bytes);
console.log(`Prepared Beyond Plastic artwork (${bytes.length} bytes).`);
