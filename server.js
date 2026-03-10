const express = require('express');
const multer  = require('multer');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

const CONFIG = {
  ANTHROPIC_API_KEY : process.env.ANTHROPIC_API_KEY || "",
  PASSWORD_ADMIN    : process.env.PASSWORD_ADMIN    || "admin123",
  PASSWORD_GERENTE  : process.env.PASSWORD_GERENTE  || "gerente123",
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let state = { fileData:null, fileName:null, fileRows:0, fileCols:0, fileColumns:[], analysis:null, uploadedAt:null };
const sessions = {};
function makeToken(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }

// AUTH
app.post('/api/login',(req,res)=>{
  const {password}=req.body; let role=null;
  if(password===CONFIG.PASSWORD_ADMIN) role='admin';
  if(password===CONFIG.PASSWORD_GERENTE) role='gerente';
  if(!role) return res.status(401).json({error:'Contraseña incorrecta'});
  const token=makeToken(); sessions[token]=role;
  res.json({token,role});
});

function auth(req,res,next){
  const token=req.headers['x-token'];
  if(!token||!sessions[token]) return res.status(401).json({error:'No autorizado'});
  req.role=sessions[token]; next();
}

// SET API KEY desde la app (admin)
app.post('/api/set-apikey', auth, (req,res)=>{
  if(req.role!=='admin') return res.status(403).json({error:'Solo el admin'});
  const {apiKey}=req.body;
  if(!apiKey||!apiKey.trim().startsWith('sk-')) return res.status(400).json({error:'API key inválida'});
  CONFIG.ANTHROPIC_API_KEY=apiKey.trim();
  res.json({ok:true});
});

app.get('/api/has-apikey', auth, (req,res)=>{
  res.json({ok: !!CONFIG.ANTHROPIC_API_KEY && CONFIG.ANTHROPIC_API_KEY.length > 20});
});

// UPLOAD
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:10*1024*1024}});
app.post('/api/upload',auth,upload.single('file'),async(req,res)=>{
  if(req.role!=='admin') return res.status(403).json({error:'Solo el admin puede subir archivos'});
  if(!req.file) return res.status(400).json({error:'No se recibió archivo'});
  state.fileName=req.file.originalname;
  state.fileBuffer=req.file.buffer.toString('base64');
  state.analysis=null;
  state.uploadedAt=new Date().toISOString();
  res.json({ok:true,fileName:state.fileName});
});

app.post('/api/set-data',auth,(req,res)=>{
  if(req.role!=='admin') return res.status(403).json({error:'Solo el admin'});
  const{dataText,rows,cols,columns}=req.body;
  state.fileData=dataText; state.fileRows=rows; state.fileCols=cols; state.fileColumns=columns;
  res.json({ok:true});
});

app.get('/api/status',auth,(req,res)=>{
  res.json({
    hasFile:!!state.fileData, fileName:state.fileName, rows:state.fileRows,
    cols:state.fileCols, columns:state.fileColumns, hasAnalysis:!!state.analysis,
    uploadedAt:state.uploadedAt, hasApiKey: !!CONFIG.ANTHROPIC_API_KEY && CONFIG.ANTHROPIC_API_KEY.length>20,
  });
});

// CHAT
app.post('/api/chat',auth,async(req,res)=>{
  if(!state.fileData) return res.status(400).json({error:'No hay archivo cargado aún'});
  if(!CONFIG.ANTHROPIC_API_KEY||CONFIG.ANTHROPIC_API_KEY.length<20)
    return res.status(400).json({error:'API key no configurada'});

  const{messages,isFirstAnalysis}=req.body;
  const systemPrompt=`Eres un analista de datos y negocios experto. Tienes acceso a los siguientes datos:\n\n${state.fileData}\n\nResponde de forma clara, precisa y ejecutiva. Usa secciones con ## para organizar. Destaca números importantes con **negritas**. Sé directo y orientado a la acción.`;

  try{
    const response=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':CONFIG.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:2000,system:systemPrompt,messages}),
    });
    if(!response.ok){const err=await response.json();return res.status(500).json({error:err.error?.message||'Error de Claude'});}
    const data=await response.json();
    const text=data.content[0].text;
    if(isFirstAnalysis) state.analysis=text;
    res.json({text});
  }catch(e){res.status(500).json({error:e.message});}
});

app.listen(PORT,()=>console.log(`✅ Servidor corriendo en puerto ${PORT}`));
