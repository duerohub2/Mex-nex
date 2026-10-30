import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { executeTool, getAudit, TOOL_DEFINITIONS } from "../../../lib/agent-tools.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const dataDir=path.resolve(process.cwd(),process.env.MEX_NEX_DATA_DIR||".data");
const jobsFile=path.join(dataDir,"execution-jobs.json");
async function readJobs(){try{return JSON.parse(await readFile(jobsFile,"utf8"));}catch{return [];}}
async function saveJobs(jobs){await mkdir(dataDir,{recursive:true});await writeFile(jobsFile,JSON.stringify(jobs.slice(0,100),null,2)+"\n","utf8");}
export async function GET(){return Response.json({tools:TOOL_DEFINITIONS,jobs:await readJobs(),audit:(await getAudit()).slice(0,50)},{headers:{"Cache-Control":"no-store"}});}
export async function POST(request){
 let body;try{body=await request.json();}catch{return Response.json({error:"JSON tidak valid."},{status:400});}
 const jobs=await readJobs();
 if(body.action==="cancel"){
  const job=jobs.find(item=>item.id===body.jobId);
  if(!job || job.status!=="queued") return Response.json({error:"Hanya pekerjaan yang masih antre yang bisa dibatalkan."},{status:409});
  job.status="cancelled";job.updatedAt=new Date().toISOString();await saveJobs(jobs);return Response.json({job});
 }
 if(body.action!=="run" || !TOOL_DEFINITIONS.some(tool=>tool.name===body.tool)) return Response.json({error:"Aksi atau tool tidak diizinkan."},{status:400});
 const job={id:randomUUID(),tool:body.tool,args:body.args||{},status:"running",createdAt:new Date().toISOString()};
 jobs.unshift(job);await saveJobs(jobs);
 try{job.result=await executeTool(job.tool,job.args);job.status="completed";}
 catch(error){job.error=error.message||"Eksekusi gagal.";job.status="failed";}
 job.updatedAt=new Date().toISOString();await saveJobs(jobs);
 return Response.json({job},{status:job.status==="failed"?400:200});
}
