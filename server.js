<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Agente de Reportes</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg:#0a0a0f; --surface:#13131a; --surface2:#1c1c28;
  --border:#2a2a3d; --accent:#6ee7b7; --accent2:#818cf8;
  --text:#e8e8f0; --muted:#6b6b8a;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:'DM Mono',monospace;height:100vh;display:flex;flex-direction:column;overflow:hidden;}

/* ── LOGIN ── */
#loginScreen{position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:100;flex-direction:column;gap:32px;}
.login-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px;width:340px;display:flex;flex-direction:column;gap:20px;}
.login-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;text-align:center;display:flex;align-items:center;justify-content:center;gap:10px;}
.logo-dot{width:10px;height:10px;background:var(--accent);border-radius:50%;box-shadow:0 0 12px var(--accent);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.8);}}
.login-sub{font-size:12px;color:var(--muted);text-align:center;}
.field-label{font-size:10px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:6px;}
.inp{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:'DM Mono',monospace;font-size:13px;padding:11px 14px;border-radius:8px;outline:none;transition:border-color .2s;}
.inp:focus{border-color:var(--accent2);}
.inp::placeholder{color:var(--muted);}
.btn-primary{width:100%;background:var(--accent);color:#0a0a0f;border:none;border-radius:8px;padding:12px;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s;}
.btn-primary:hover{background:#a7f3d0;}
.login-error{font-size:12px;color:#f87171;text-align:center;display:none;}

/* ── APP ── */
#app{display:none;flex-direction:column;height:100vh;}
header{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0;}
.logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;display:flex;align-items:center;gap:10px;}
.header-right{display:flex;align-items:center;gap:12px;}
.role-badge{font-size:11px;padding:4px 12px;border-radius:20px;border:1px solid var(--border);color:var(--muted);}
.role-badge.admin{color:var(--accent2);border-color:var(--accent2);}
.role-badge.gerente{color:var(--accent);border-color:var(--accent);}
.status-pill{font-size:11px;padding:4px 12px;border-radius:20px;border:1px solid var(--border);color:var(--muted);}
.status-pill.active{color:var(--accent);border-color:var(--accent);}
.btn-logout{background:none;border:1px solid var(--border);color:var(--muted);font-family:'DM Mono',monospace;font-size:11px;padding:4px 12px;border-radius:20px;cursor:pointer;transition:all .2s;}
.btn-logout:hover{border-color:var(--danger,#f87171);color:#f87171;}

.main{display:flex;flex:1;overflow:hidden;}

/* ── SIDEBAR ── */
.sidebar{width:290px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;}
.sidebar::-webkit-scrollbar{width:4px;}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}
.sb-section{padding:18px;border-bottom:1px solid var(--border);}
.sec-label{font-size:10px;font-weight:500;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:12px;}

.upload-zone{border:2px dashed var(--border);border-radius:10px;padding:22px 14px;text-align:center;cursor:pointer;transition:all .2s;}
.upload-zone:hover,.upload-zone.drag-over{border-color:var(--accent);background:rgba(110,231,183,.04);}
.upload-zone input{display:none;}
.upload-icon{font-size:26px;margin-bottom:6px;}
.upload-text{font-size:11px;color:var(--muted);line-height:1.6;}
.upload-text strong{color:var(--text);}

.file-card{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;display:none;gap:10px;align-items:center;}
.file-card.visible{display:flex;}
.file-details{flex:1;overflow:hidden;}
.file-name{font-size:12px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.file-meta{font-size:10px;color:var(--muted);margin-top:2px;}

.btn-analyze{width:100%;background:var(--accent);color:#0a0a0f;border:none;border-radius:8px;padding:11px;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:all .2s;margin-top:10px;}
.btn-analyze:hover{background:#a7f3d0;}
.btn-analyze:disabled{background:var(--border);color:var(--muted);cursor:not-allowed;}

.data-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}
.stat-box{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;}
.stat-num{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--accent);}
.stat-lbl{font-size:10px;color:var(--muted);}
.cols-wrap{display:flex;flex-wrap:wrap;gap:5px;}
.col-tag{background:var(--bg);border:1px solid var(--border);border-radius:4px;font-size:10px;padding:3px 8px;color:var(--muted);}

.progress-bar{height:2px;background:var(--border);border-radius:2px;overflow:hidden;margin-top:8px;display:none;}
.progress-bar.visible{display:block;}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));animation:prog 1.5s ease infinite;}
@keyframes prog{0%{width:0%;margin-left:0;}50%{width:70%;margin-left:15%;}100%{width:0%;margin-left:100%;}}

/* gerente waiting */
.waiting-card{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:20px;text-align:center;display:flex;flex-direction:column;gap:10px;}
.waiting-icon{font-size:32px;}
.waiting-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;}
.waiting-sub{font-size:11px;color:var(--muted);line-height:1.6;}
.btn-refresh{background:none;border:1px solid var(--border);color:var(--muted);font-family:'DM Mono',monospace;font-size:11px;padding:7px 14px;border-radius:8px;cursor:pointer;transition:all .2s;width:100%;}
.btn-refresh:hover{border-color:var(--accent);color:var(--accent);}

/* ── CHAT ── */
.chat-area{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.chat-messages{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:18px;scroll-behavior:smooth;}
.chat-messages::-webkit-scrollbar{width:4px;}
.chat-messages::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}

.empty-state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;opacity:.5;padding:40px;}
.empty-icon{font-size:44px;}
.empty-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;}
.empty-sub{font-size:11px;color:var(--muted);line-height:1.7;}

.msg{display:flex;gap:12px;max-width:820px;animation:fadeUp .3s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.msg.user{flex-direction:row-reverse;align-self:flex-end;}
.msg-avatar{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
.msg.bot .msg-avatar{background:rgba(110,231,183,.1);border:1px solid rgba(110,231,183,.2);}
.msg.user .msg-avatar{background:rgba(129,140,248,.1);border:1px solid rgba(129,140,248,.2);}
.msg-content{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:14px 18px;font-size:13px;line-height:1.75;max-width:calc(100% - 42px);}
.msg.user .msg-content{background:#1e1e35;border-color:rgba(129,140,248,.2);}
.msg.bot .msg-content{border-color:rgba(110,231,183,.1);}
.msg-content h3{font-family:'Syne',sans-serif;font-size:13px;color:var(--accent);margin:12px 0 6px;}
.msg-content h3:first-child{margin-top:0;}
.msg-content strong{color:var(--accent2);font-weight:500;}
.msg-content ul{padding-left:16px;margin-bottom:6px;}
.msg-content li{margin-bottom:3px;}
.msg-content code{background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:1px 5px;font-size:11px;color:var(--accent);}

.typing-indicator{display:flex;gap:5px;align-items:center;padding:12px 16px;}
.typing-dot{width:6px;height:6px;background:var(--accent);border-radius:50%;animation:typing 1.2s infinite;}
.typing-dot:nth-child(2){animation-delay:.2s;}
.typing-dot:nth-child(3){animation-delay:.4s;}
@keyframes typing{0%,60%,100%{transform:translateY(0);opacity:.4;}30%{transform:translateY(-6px);opacity:1;}}

.chat-input-area{padding:14px 20px;background:var(--surface);border-top:1px solid var(--border);flex-shrink:0;}
.quick-questions{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;}
.quick-btn{background:var(--bg);border:1px solid var(--border);color:var(--muted);font-family:'DM Mono',monospace;font-size:10px;padding:5px 10px;border-radius:20px;cursor:pointer;transition:all .2s;white-space:nowrap;}
.quick-btn:hover{border-color:var(--accent);color:var(--accent);}
.input-row{display:flex;gap:8px;align-items:flex-end;}
.chat-input{flex:1;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:'DM Mono',monospace;font-size:13px;padding:11px 14px;border-radius:10px;outline:none;resize:none;min-height:44px;max-height:120px;transition:border-color .2s;line-height:1.5;}
.chat-input:focus{border-color:var(--accent2);}
.chat-input::placeholder{color:var(--muted);}
.chat-input:disabled{opacity:.4;}
.btn-send{background:var(--accent);border:none;width:44px;height:44px;border-radius:10px;cursor:pointer;font-size:16px;transition:all .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.btn-send:hover{background:#a7f3d0;transform:scale(1.05);}
.btn-send:disabled{background:var(--border);cursor:not-allowed;transform:none;}
</style>
</head>
<body>

<!-- LOGIN -->
<div id="loginScreen">
  <div class="login-box">
    <div class="login-logo"><div class="logo-dot"></div>Agente de Reportes</div>
    <div class="login-sub">Ingresa tu contraseña para acceder</div>
    <div>
      <div class="field-label">Contraseña</div>
      <input type="password" class="inp" id="loginPass" placeholder="Ingresa tu contraseña..." onkeydown="if(event.key==='Enter')doLogin()"/>
    </div>
    <button class="btn-primary" onclick="doLogin()">Entrar →</button>
    <div class="login-error" id="loginError">Contraseña incorrecta</div>
  </div>
</div>

<!-- APP -->
<div id="app">
  <header>
    <div class="logo"><div class="logo-dot"></div>Agente de Reportes</div>
    <div class="header-right">
      <div class="role-badge" id="roleBadge">—</div>
      <div class="status-pill" id="statusPill">Sin archivo</div>
      <button class="btn-logout" onclick="logout()">Salir</button>
    </div>
  </header>

  <div class="main">
    <!-- SIDEBAR -->
    <div class="sidebar">

      <!-- ADMIN: upload -->
      <!-- API KEY SECTION -->
      <div class="sb-section" id="apiKeySection" style="display:none">
        <div class="sec-label">API Key de Anthropic</div>
        <div id="apiKeyOk" style="display:none;background:#0d1f14;border:1px solid var(--accent);border-radius:8px;padding:10px;font-size:11px;color:var(--accent);text-align:center;">✅ API Key configurada</div>
        <div id="apiKeyForm">
          <input type="password" class="inp" id="apiKeyInput" placeholder="sk-ant-api03-..." style="margin-bottom:8px;font-size:11px;"/>
          <button class="btn-analyze" style="margin-top:0" onclick="saveApiKey()">Guardar API Key</button>
        </div>
      </div>

      <div class="sb-section" id="adminUpload" style="display:none">
        <div class="sec-label">Subir Archivo</div>
        <div class="upload-zone" id="uploadZone">
          <input type="file" id="fileInput" accept=".csv,.xlsx,.xls"/>
          <div class="upload-icon">📂</div>
          <div class="upload-text"><strong>Arrastra aquí</strong><br>o haz clic<br><span style="font-size:10px">CSV · XLSX · XLS</span></div>
        </div>
        <div class="file-card" id="fileCard">
          <div style="font-size:22px">📊</div>
          <div class="file-details">
            <div class="file-name" id="fileName">—</div>
            <div class="file-meta" id="fileMeta">—</div>
          </div>
        </div>
        <button class="btn-analyze" id="btnAnalyze" disabled onclick="analyzeFile()">✦ Analizar con Claude</button>
        <div class="progress-bar" id="progressBar"><div class="progress-fill"></div></div>
      </div>

      <!-- GERENTE: waiting / file info -->
      <div class="sb-section" id="gerentePanel" style="display:none">
        <div class="sec-label">Estado</div>
        <div class="waiting-card" id="waitingCard">
          <div class="waiting-icon">⏳</div>
          <div class="waiting-title">Esperando archivo</div>
          <div class="waiting-sub">El administrador aún no ha subido ningún archivo. Actualiza para verificar.</div>
          <button class="btn-refresh" onclick="checkStatus()">↻ Actualizar</button>
        </div>
        <div class="file-card" id="gerenteFile" style="display:none;margin-top:10px;">
          <div style="font-size:22px">📊</div>
          <div class="file-details">
            <div class="file-name" id="gerenteFileName">—</div>
            <div class="file-meta" id="gerenteFileMeta">—</div>
          </div>
        </div>
      </div>

      <!-- DATA PREVIEW (ambos) -->
      <div class="sb-section" id="dataPreview" style="display:none">
        <div class="sec-label">Resumen del Archivo</div>
        <div class="data-grid">
          <div class="stat-box"><div class="stat-num" id="statRows">—</div><div class="stat-lbl">Filas</div></div>
          <div class="stat-box"><div class="stat-num" id="statCols">—</div><div class="stat-lbl">Columnas</div></div>
        </div>
        <div class="cols-wrap" id="colsList"></div>
      </div>

    </div>

    <!-- CHAT -->
    <div class="chat-area">
      <div class="chat-messages" id="chatMessages">
        <div class="empty-state" id="emptyState">
          <div class="empty-icon">🤖</div>
          <div class="empty-title">Agente listo</div>
          <div class="empty-sub" id="emptySubText">Sube un archivo para comenzar el análisis.</div>
        </div>
      </div>
      <div class="chat-input-area">
        <div class="quick-questions" id="quickQ" style="display:none">
          <button class="quick-btn" onclick="quickAsk('¿Cuáles son los principales hallazgos?')">📌 Hallazgos</button>
          <button class="quick-btn" onclick="quickAsk('¿Hay alertas o anomalías importantes?')">⚠️ Alertas</button>
          <button class="quick-btn" onclick="quickAsk('¿Qué tendencias observas en los datos?')">📈 Tendencias</button>
          <button class="quick-btn" onclick="quickAsk('Dame recomendaciones concretas de acción')">💡 Recomendaciones</button>
        </div>
        <div class="input-row">
          <textarea class="chat-input" id="chatInput" placeholder="Pregunta algo sobre el archivo..." rows="1" onkeydown="handleKey(event)" oninput="autoResize(this)" disabled></textarea>
          <button class="btn-send" id="btnSend" onclick="sendMessage()" disabled>➤</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// ── STATE ──
let token = null;
let role  = null;
let conversationHistory = [];
let isLoading = false;
let hasFile = false;

// ── LOGIN ──
async function doLogin() {
  const pass = document.getElementById('loginPass').value.trim();
  if (!pass) return;
  try {
    const r = await api('/api/login', 'POST', { password: pass });
    token = r.token;
    role  = r.role;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    initRole();
  } catch(e) {
    document.getElementById('loginError').style.display = 'block';
  }
}

function logout() {
  token = null; role = null;
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  conversationHistory = [];
  document.getElementById('chatMessages').innerHTML = '<div class="empty-state" id="emptyState"><div class="empty-icon">🤖</div><div class="empty-title">Agente listo</div><div class="empty-sub" id="emptySubText">Sube un archivo para comenzar el análisis.</div></div>';
}

async function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key) return alert('Pega tu API key');
  try {
    await api('/api/set-apikey','POST',{apiKey: key});
    document.getElementById('apiKeyOk').style.display = 'block';
    document.getElementById('apiKeyForm').style.display = 'none';
  } catch(e) { alert('Error: ' + e.message); }
}

function initRole() {
  const badge = document.getElementById('roleBadge');
  if (role === 'admin') {
    badge.textContent = '⬡ Administrador';
    badge.className = 'role-badge admin';
    document.getElementById('apiKeySection').style.display = 'block';
    document.getElementById('adminUpload').style.display = 'block';
    document.getElementById('emptySubText').textContent = 'Sube un archivo CSV o Excel para comenzar.';
    setupUpload();
  } else {
    badge.textContent = '◈ Gerente';
    badge.className = 'role-badge gerente';
    document.getElementById('gerentePanel').style.display = 'block';
    document.getElementById('emptySubText').textContent = 'Cuando el administrador suba un archivo, aparecerá el análisis aquí.';
    checkStatus();
    // Poll every 15s
    setInterval(checkStatus, 15000);
  }
}

// ── CHECK STATUS (gerente) ──
async function checkStatus() {
  try {
    const s = await api('/api/status', 'GET');
    if (s.hasFile) {
      showFileInfo(s.fileName, s.rows, s.cols, s.columns);
      document.getElementById('waitingCard').style.display = 'none';
      document.getElementById('gerenteFile').style.display = 'flex';
      document.getElementById('gerenteFileName').textContent = s.fileName;
      document.getElementById('gerenteFileMeta').textContent = `${s.rows} filas · ${s.cols} columnas`;

      if (!hasFile) {
        hasFile = true;
        enableChat();
        if (s.hasAnalysis) {
          // already analyzed — do first analysis
          triggerFirstAnalysis();
        } else {
          triggerFirstAnalysis();
        }
      }
    }
  } catch(e) {}
}

// ── UPLOAD (admin) ──
function setupUpload() {
  const zone = document.getElementById('uploadZone');
  const inp  = document.getElementById('fileInput');
  zone.addEventListener('click', () => inp.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
  inp.addEventListener('change', e => { if(e.target.files[0]) handleFile(e.target.files[0]); });
}

let pendingFile = null;

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const wb   = XLSX.read(e.target.result, { type: 'binary' });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const cols = Object.keys(json[0] || {});

      const numCols = cols.filter(c => json.slice(0,5).some(r => !isNaN(parseFloat(r[c]))));
      let stats = "";
      numCols.forEach(c => {
        const vals = json.map(r => parseFloat(r[c])).filter(v => !isNaN(v));
        if (vals.length) {
          const sum = vals.reduce((a,b)=>a+b,0);
          stats += `${c}: min=${Math.min(...vals).toFixed(2)}, max=${Math.max(...vals).toFixed(2)}, promedio=${(sum/vals.length).toFixed(2)}\n`;
        }
      });

      const dataText = `ARCHIVO: ${file.name}\nFILAS: ${json.length}\nCOLUMNAS (${cols.length}): ${cols.join(', ')}\n\nESTADÍSTICAS:\n${stats||'N/A'}\n\nMUESTRA (primeras 20 filas):\n${JSON.stringify(json.slice(0,20), null, 2)}`;

      // Send to server
      const fd = new FormData();
      fd.append('file', file);
      await fetch('/api/upload', { method:'POST', headers:{'x-token':token}, body: fd });
      await api('/api/set-data','POST',{ dataText, rows: json.length, cols: cols.length, columns: cols });

      // UI
      showFileInfo(file.name, json.length, cols.length, cols);
      document.getElementById('fileCard').classList.add('visible');
      document.getElementById('fileName').textContent = file.name;
      document.getElementById('fileMeta').textContent = `${json.length} filas · ${cols.length} columnas`;
      document.getElementById('btnAnalyze').disabled = false;
      hasFile = true;
    } catch(err) { alert('Error al leer el archivo: ' + err.message); }
  };
  reader.readAsBinaryString(file);
}

function showFileInfo(name, rows, cols, columns) {
  document.getElementById('dataPreview').style.display = 'block';
  document.getElementById('statRows').textContent = rows;
  document.getElementById('statCols').textContent = cols;
  const cl = document.getElementById('colsList');
  cl.innerHTML = (columns||[]).map(c=>`<span class="col-tag">${c}</span>`).join('');
}

// ── ANALYZE ──
async function analyzeFile() {
  if (isLoading) return;
  document.getElementById('btnAnalyze').disabled = true;
  document.getElementById('progressBar').classList.add('visible');
  enableChat();
  await triggerFirstAnalysis();
  document.getElementById('progressBar').classList.remove('visible');
}

async function triggerFirstAnalysis() {
  conversationHistory = [];
  document.getElementById('emptyState')?.remove();
  document.getElementById('statusPill').textContent = 'Analizando...';

  const firstMsg = `Analiza este archivo y genera un reporte ejecutivo completo con:\n## 1. Resumen General\n## 2. Métricas Clave\n## 3. Hallazgos Importantes\n## 4. Alertas o Puntos de Atención\n## 5. Recomendaciones`;
  conversationHistory.push({ role:'user', content: firstMsg });

  const reply = await callClaude(conversationHistory, true);
  if (reply) {
    conversationHistory.push({ role:'assistant', content: reply });
    addMessage('bot', reply);
    document.getElementById('statusPill').textContent = '⬤  Archivo analizado';
    document.getElementById('statusPill').classList.add('active');
    document.getElementById('quickQ').style.display = 'flex';
  }
}

function enableChat() {
  document.getElementById('chatInput').disabled = false;
  document.getElementById('btnSend').disabled = false;
  document.getElementById('chatInput').placeholder = 'Haz una pregunta sobre los datos...';
}

// ── CHAT ──
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text || isLoading) return;
  input.value = ''; autoResize(input);
  addMessage('user', text);
  conversationHistory.push({ role:'user', content: text });
  setLoading(true);
  const reply = await callClaude(conversationHistory, false);
  if (reply) {
    conversationHistory.push({ role:'assistant', content: reply });
    addMessage('bot', reply);
  }
  setLoading(false);
}

function quickAsk(q) { document.getElementById('chatInput').value = q; sendMessage(); }
function handleKey(e) { if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); } }

// ── CLAUDE via BACKEND ──
async function callClaude(messages, isFirst) {
  try {
    const r = await api('/api/chat','POST',{ messages, isFirstAnalysis: isFirst });
    return r.text;
  } catch(e) {
    addMessage('bot', `⚠️ Error: ${e.message}`);
    return null;
  }
}

// ── API HELPER ──
async function api(url, method='GET', body=null) {
  const opts = { method, headers:{'Content-Type':'application/json','x-token': token||''} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Error');
  return d;
}

// ── UI ──
let typingEl = null;
function setLoading(v) {
  isLoading = v;
  document.getElementById('btnSend').disabled = v;
  if (v) {
    typingEl = document.createElement('div');
    typingEl.className = 'msg bot';
    typingEl.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-content"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    document.getElementById('chatMessages').appendChild(typingEl);
    scrollBottom();
  } else if (typingEl) { typingEl.remove(); typingEl = null; }
}

function addMessage(role, text) {
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.innerHTML = `<div class="msg-avatar">${role==='bot'?'🤖':'👤'}</div><div class="msg-content">${fmt(text)}</div>`;
  document.getElementById('chatMessages').appendChild(el);
  scrollBottom();
}

function fmt(t) {
  return t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/^## (.+)$/gm,'<h3>$1</h3>')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^[-•] (.+)$/gm,'<li>$1</li>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/\n/g,'<br>');
}

function scrollBottom() { setTimeout(()=>{ const c=document.getElementById('chatMessages'); c.scrollTop=c.scrollHeight; },50); }
function autoResize(el) { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,120)+'px'; }
</script>
</body>
</html>
