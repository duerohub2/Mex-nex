import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), process.env.MEX_NEX_DATA_DIR || ".data", "workspace");
const auditFile = path.resolve(process.cwd(), process.env.MEX_NEX_DATA_DIR || ".data", "execution-audit.json");

export const TOOL_DEFINITIONS = [
  { name: "workspace.list", description: "Daftar file dan folder di workspace.", arguments: { path: "path relatif, opsional" } },
  { name: "workspace.read", description: "Baca file teks di workspace.", arguments: { path: "path relatif" } },
  { name: "workspace.write", description: "Buat atau perbarui file teks di workspace.", arguments: { path: "path relatif", content: "isi teks" } },
  { name: "system.time", description: "Dapatkan waktu server lokal.", arguments: {} },
  { name: "system.status", description: "Lihat versi Node.js dan lokasi workspace.", arguments: {} },
  { name: "math.calculate", description: "Hitung ekspresi aritmetika dasar.", arguments: { expression: "ekspresi matematika" } }
];

function safePath(input = ".") {
  const value = String(input || ".").replace(/\\/g, "/");
  if (value.includes("\0") || value.split("/").some(part => part === "..")) throw new Error("Path traversal ditolak.");
  const target = path.resolve(root, value);
  if (target !== root && !target.startsWith(root + path.sep)) throw new Error("Akses di luar workspace ditolak.");
  return target;
}
async function audit(entry) {
  await mkdir(path.dirname(auditFile), { recursive: true });
  let rows = [];
  try { rows = JSON.parse(await readFile(auditFile, "utf8")); } catch {}
  rows.unshift({ id: randomUUID(), at: new Date().toISOString(), ...entry });
  await writeFile(auditFile, JSON.stringify(rows.slice(0, 500), null, 2) + "\n", "utf8");
}
function calculate(expression) {
  const input = String(expression || "").trim();
  if (!input || input.length > 120 || !/^[0-9+*/().%\s-]+$/.test(input)) throw new Error("Ekspresi matematika tidak valid.");
  const tokens = input.match(/\d+(?:\.\d+)?|[()+*/% -]/g);
  if (!tokens || tokens.join("").replace(/\s/g, "") !== input.replace(/\s/g, "")) throw new Error("Ekspresi tidak dapat diproses.");
  const values = [];
  const ops = [];
  const precedence = op => op === "+" || op === "-" ? 1 : op === "*" || op === "/" || op === "%" ? 2 : 0;
  const apply = () => {
    const op = ops.pop(), b = values.pop(), a = values.pop();
    if (a === undefined || b === undefined) throw new Error("Format ekspresi tidak valid.");
    if ((op === "/" || op === "%") && b === 0) throw new Error("Pembagian dengan nol tidak diizinkan.");
    values.push(op === "+" ? a+b : op === "-" ? a-b : op === "*" ? a*b : op === "/" ? a/b : a%b);
  };
  let expectValue = true;
  for (let i=0;i<tokens.length;i++) {
    const token=tokens[i].trim(); if (!token) continue;
    if (/^\d/.test(token)) { if (!expectValue) throw new Error("Format ekspresi tidak valid."); values.push(Number(token)); expectValue=false; }
    else if (token==="(") { if (!expectValue) throw new Error("Format ekspresi tidak valid."); ops.push(token); }
    else if (token===")") { while(ops.length && ops.at(-1)!=="(") apply(); if(ops.pop()!=="(") throw new Error("Kurung tidak seimbang."); expectValue=false; }
    else if (["+", "-", "*", "/", "%"].includes(token)) {
      if (expectValue && (token==="-" || token==="+")) { if(token==="-") values.push(0); else continue; }
      else if (expectValue) throw new Error("Operator tidak pada tempatnya.");
      while(ops.length && ops.at(-1)!=="(" && precedence(ops.at(-1))>=precedence(token)) apply();
      ops.push(token); expectValue=true;
    }
  }
  if(expectValue) throw new Error("Ekspresi belum lengkap.");
  while(ops.length){if(ops.at(-1)==="(") throw new Error("Kurung tidak seimbang.");apply();}
  const result=values[0]; if(!Number.isFinite(result)) throw new Error("Hasil hitung tidak valid.");
  return result;
}

export async function executeTool(name, args = {}) {
  await mkdir(root, { recursive: true });
  let result;
  if (name === "workspace.list") {
    const dir=safePath(args.path || ".");
    const entries=await readdir(dir,{withFileTypes:true});
    result=await Promise.all(entries.slice(0,200).map(async entry=>({name:entry.name,type:entry.isDirectory()?"directory":"file",size:entry.isFile()?(await stat(path.join(dir,entry.name))).size:undefined})));
  } else if (name === "workspace.read") {
    const file=safePath(args.path);
    const info=await stat(file);
    if(!info.isFile() || info.size>200000) throw new Error("Hanya file teks maksimal 200 KB yang dapat dibaca.");
    result=await readFile(file,"utf8");
  } else if (name === "workspace.write") {
    const file=safePath(args.path);
    const content=String(args.content ?? "");
    if(!args.path || content.length>100000) throw new Error("Path wajib dan ukuran isi maksimal 100 KB.");
    await mkdir(path.dirname(file),{recursive:true});
    await writeFile(file,content,"utf8");
    result={written:true,path:String(args.path),bytes:Buffer.byteLength(content)};
  } else if (name === "system.time") {
    result={iso:new Date().toISOString(),local:new Date().toString()};
  } else if (name === "system.status") {
    result={node:process.version,platform:process.platform,workspace:root};
  } else if (name === "math.calculate") {
    result={expression:String(args.expression),result:calculate(args.expression)};
  } else {
    throw new Error("Tool tidak tersedia atau tidak diizinkan.");
  }
  await audit({tool:name,args,result:typeof result==="string"?result.slice(0,1000):result,status:"success"});
  return result;
}

export async function getAudit() {
  try { return JSON.parse(await readFile(auditFile,"utf8")); } catch { return []; }
}
