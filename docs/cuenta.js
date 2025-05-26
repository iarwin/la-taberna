const machineList = [ 'cap', 'popcorn', 'knife', 'twomillion', 'nibbles', 'chemistry', 'mirai', 'shoppy', 'wifinetic' ];

const maquinas = [
  { difficulty: "facil", name: "cap", os: "linux", vulns: "idor,password-reuse,capabilities" },
  { difficulty: "media", name: "popcorn", os: "linux", vulns: "file-upload,rce,kernel-exploit,cve" },
  { difficulty: "facil", name: "knife", os: "linux", vulns: "rce,sudo-misconfig,cve" },
  { difficulty: "facil", name: "twomillion", os: "linux", vulns: "sqli,credential-dump,cronjobs" },
  { difficulty: "facil", name: "nibbles", os: "linux", vulns: "file-upload,rce,default-creds,sudo-misconfig" },
  { difficulty: "facil", name: "chemistry", os: "linux", vulns: "ssti,rce,capabilities" },
  { difficulty: "facil", name: "mirai", os: "linux", vulns: "rce,default-creds,suid,kernel-exploit,cve" },
  { difficulty: "facil", name: "shoppy", os: "linux", vulns: "sqli,password-reuse,sudo-misconfig" },
  { difficulty: "facil", name: "wifinetic", os: "linux", vulns: "default-creds,password-reuse,capabilities,file-permissions" }
];

const categorias = {
  "🕸️ Vulnerabilidades Web": [
    "xss", "sqli", "lfi", "rfi", "idor", "csrf", "ssrf", "rce",
    "file-upload", "ssti", "open-redirect"
  ],
  "🔐 Autenticación / Credenciales": [
    "default-creds", "weak-password", "password-reuse",
    "credential-dump", "hardcoded-creds"
  ],
  "📈 Escalada de Privilegios": [
    "suid", "sudo-misconfig", "capabilities", "cronjobs",
    "path-hijack", "kernel-exploit", "unquoted-service-path",
    "seimpersonate", "token-manipulation", "alwaysinstallelevated"
  ],
  "🧱 Active Directory": [
    "as-rep-roasting", "kerberoasting", "llmnr-poisoning",
    "unconstrained-delegation", "rBCD", "gpp-password",
    "dcsync", "golden-ticket", "bloodhound-needed"
  ],
  "⚙️ Misconfiguraciones generales": [
    "file-permissions", "docker-misconfig", "git-leak",
    "env-leak", "insecure-api", "exposed-panel"
  ],
  "💣 Exploits conocidos": [
    "cve"
  ]
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

function base64ToBinary(base64Str) {
  return atob(base64Str)
    .split('')
    .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

function decodeCheckboxState(cookieValue) {
  const binStr = base64ToBinary(cookieValue);
  return binStr
    .split('')
    .map(bit => bit === '1')
    .slice(0, machineList.length);
}

function mostrarEstadisticas() {
  const encoded = getCookie("checkboxState");
  if (!encoded) return;

  const estados = decodeCheckboxState(encoded);

  const completadas = machineList
    .map((name, i) => estados[i] ? maquinas.find(m => m.name === name) : null)
    .filter(Boolean);

  const total = completadas.length;
  const dificultades = { facil: 0, media: 0, dificil: 0, insana: 0 };
  const sistemas = { linux: 0, windows: 0 };

  // Inicializar contadores por categoría
  const categoriaContadores = {};
  for (const cat in categorias) {
    categoriaContadores[cat] = 0;
  }

  completadas.forEach(m => {
    dificultades[m.difficulty]++;
    sistemas[m.os]++;
    const vulns = m.vulns.split(',');

    for (const [categoria, listaVulns] of Object.entries(categorias)) {
      if (vulns.some(v => listaVulns.includes(v))) {
        categoriaContadores[categoria]++;
      }
    }
  });

  // Construir HTML de categorías
  let htmlCategorias = "";
  for (const [categoria, count] of Object.entries(categoriaContadores)) {
    htmlCategorias += `<p><strong>${categoria}:</strong> ${count}</p>`;
  }

  const cont = document.getElementById("estadisticas");
  cont.innerHTML = `
    <p><strong>Máquinas resueltas:</strong> ${total}</p>
    <p><strong>Fáciles:</strong> ${dificultades.facil}</p>
    <p><strong>Medias:</strong> ${dificultades.media}</p>
    <p><strong>Difíciles:</strong> ${dificultades.dificil}</p>
    <p><strong>Insanas:</strong> ${dificultades.insana}</p>
    <p><strong>Linux:</strong> ${sistemas.linux}</p>
    <p><strong>Windows:</strong> ${sistemas.windows}</p>
    ${htmlCategorias}
  `;
}

document.addEventListener("DOMContentLoaded", mostrarEstadisticas);

