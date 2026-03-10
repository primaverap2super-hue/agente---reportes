# 🤖 Agente de Reportes

App web para subir archivos CSV/Excel, analizarlos con Claude AI y permitir que el gerente haga preguntas sobre los datos.

---

## 🚀 Subir a Railway (gratis, 5 minutos)

### Paso 1 — Sube el código a GitHub
1. Ve a [github.com](https://github.com) → **New repository**
2. Nombre: `agente-reportes` → **Create repository**
3. Sube los archivos arrastrándolos o usando git:
```bash
git init
git add .
git commit -m "primer commit"
git remote add origin https://github.com/TU_USUARIO/agente-reportes.git
git push -u origin main
```

### Paso 2 — Despliega en Railway
1. Ve a [railway.app](https://railway.app) → **Login con GitHub**
2. Clic en **New Project** → **Deploy from GitHub repo**
3. Selecciona `agente-reportes`
4. Railway detecta Node.js automáticamente ✅

### Paso 3 — Configura las variables de entorno
En Railway, ve a tu proyecto → **Variables** → agrega estas 3:

| Variable | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-tu-clave-aqui` |
| `PASSWORD_ADMIN` | la contraseña que quieras para quien sube archivos |
| `PASSWORD_GERENTE` | la contraseña que quieras para el gerente |

### Paso 4 — Obtén el link
Railway te da un link tipo:
```
https://agente-reportes-production.up.railway.app
```

¡Comparte ese link con el gerente!

---

## 👤 Cómo usarlo

### Tú (Admin)
1. Entra al link con tu contraseña de admin
2. Sube el CSV o Excel
3. Presiona **"Analizar con Claude"**

### Gerente
1. Entra al mismo link con su contraseña
2. Ve el análisis automático
3. Hace preguntas en el chat

---

## 📁 Estructura
```
agente-reportes/
├── server.js        ← servidor Node.js
├── package.json     ← dependencias
└── public/
    └── index.html   ← app web completa
