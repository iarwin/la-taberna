const machineList = ['cap', 'popcorn', 'knife', 'twomillion', 'nibbles', 'chemistry', 'mirai', 'shoppy', 'wifinetic', 'wifinetictwo', 'calamity', 'ransom'];

const maquinas = [
  { difficulty: "facil", name: "cap", os: "linux", vulns: "idor,credential-dump,password-reuse,capabilities" },
  { difficulty: "media", name: "popcorn", os: "linux", vulns: "ssti,rce,file-upload,weak-password,sudo-misconfig,cronjobs,file-permissions" },
  { difficulty: "facil", name: "knife", os: "linux", vulns: "rce,webshell,hardcoded-creds,password-reuse,sudo-misconfig,path-hijack,cve" },
  { difficulty: "facil", name: "twomillion", os: "linux", vulns: "hardcoded-creds,weak-password,sudo-misconfig,file-permissions,cronjobs,env-leak" },
  { difficulty: "facil", name: "nibbles", os: "linux", vulns: "lfi,rce,file-upload,default-creds,hardcoded-creds,credential-dump,sudo-misconfig,cronjobs,path-hijack,file-permissions,backup-leak" },
  { difficulty: "facil", name: "chemistry", os: "linux", vulns: "file-upload,rce,credential-dump,weak-password,password-reuse,lfi" },
  { difficulty: "facil", name: "mirai", os: "linux", vulns: "rce,default-creds,password-reuse,suid,exposed-panel,cve" },
  { difficulty: "facil", name: "shoppy", os: "linux", vulns: "rce,file-upload,sqli,weak-password,credential-dump,sudo-misconfig,cronjobs,file-permissions" },
  { difficulty: "facil", name: "wifinetic", os: "linux", vulns: "default-creds,hardcoded-creds,sqli,rce,file-permissions,backup-leak,sudo-misconfig" },
  { difficulty: "media", name: "wifinetictwo", os: "linux", vulns: "default-creds,weak-password,credential-dump,sudo-misconfig,cronjobs,file-permissions" },
  { difficulty: "dificil", name: "calamity", os: "linux", vulns: "file-upload,rce,xss,hardcoded-creds,suid,kernel-exploit,cve" },
  { difficulty: "media", name: "ransom", os: "linux", vulns: "default-creds,bruteforce,credential-dump,suid,sudo-misconfig,cronjobs,file-permissions,backup-leak" }
];

const categorias = {
  "vulnerabilidades web": [
    "xss", "sqli", "lfi", "rfi", "idor", "csrf", "ssrf", "rce",
    "file-upload", "ssti", "open-redirect"
  ],
  "autenticacion / credenciales": [
    "default-creds", "weak-password", "password-reuse",
    "credential-dump", "hardcoded-creds"
  ],
  "escalada de privilegios": [
    "suid", "sudo-misconfig", "capabilities", "cronjobs",
    "path-hijack", "kernel-exploit", "unquoted-service-path",
    "seimpersonate", "token-manipulation", "alwaysinstallelevated"
  ],
  "active directory": [
    "as-rep-roasting", "kerberoasting", "llmnr-poisoning",
    "unconstrained-delegation", "rBCD", "gpp-password",
    "dcsync", "golden-ticket", "bloodhound-needed"
  ],
  "misconfiguraciones generales": [
    "file-permissions", "docker-misconfig", "git-leak",
    "env-leak", "insecure-api", "exposed-panel"
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
  const porResolver = machineList.length - total;
  const dificultades = { facil: 0, media: 0, dificil: 0, insana: 0 };
  const sistemas = { linux: 0, windows: 0 };

  const categoriaContadores = {};
  const subcategoriaContadores = {};

  for (const cat in categorias) {
    categoriaContadores[cat] = 0;
    subcategoriaContadores[cat] = {};
    categorias[cat].forEach(v => subcategoriaContadores[cat][v] = 0);
  }

  let totalCVEs = 0;

  completadas.forEach(m => {
    dificultades[m.difficulty]++;
    sistemas[m.os]++;
    const vulns = m.vulns.split(',');

    if (vulns.includes("cve")) totalCVEs++;

    for (const [categoria, listaVulns] of Object.entries(categorias)) {
      const intersect = vulns.filter(v => listaVulns.includes(v));
      if (intersect.length > 0) {
        categoriaContadores[categoria]++;
        intersect.forEach(v => subcategoriaContadores[categoria][v]++);
      }
    }
  });

  const cont = document.getElementById("estadisticas");
  let html = `
    <div class="titulo-taberna">LA TABERNA</div>
    <div class="subtitulo-taberna">by iarwin</div>
    <div class="linea-asteriscos">************************************************</div>
    <div class="titulo-cuenta">CUENTA</div>
    <div class="linea-asteriscos">************************************************</div>
    <div class="linea-ticket"><span class="info-title bold">dificultad</span><span></span></div>
    <div class="linea-ticket"><span class="texto-ticket">facil</span><span class="numero-ticket">${dificultades.facil}</span></div>
    <div class="linea-ticket"><span class="texto-ticket">media</span><span class="numero-ticket">${dificultades.media}</span></div>
    <div class="linea-ticket"><span class="texto-ticket">dificil</span><span class="numero-ticket">${dificultades.dificil}</span></div>
    <div class="linea-ticket"><span class="texto-ticket">insana</span><span class="numero-ticket">${dificultades.insana}</span></div>
    <div class="linea-asteriscos-medio">************************************************</div>
    <div class="linea-ticket"><span class="so-title bold">sistema operativo</span><span></span></div>
    <div class="linea-ticket"><span class="texto-ticket">linux</span><span class="numero-ticket">${sistemas.linux}</span></div>
    <div class="linea-ticket"><span class="texto-ticket">windows</span><span class="numero-ticket">${sistemas.windows}</span></div>
    <div class="linea-asteriscos-final">************************************************</div>
  `;

  for (const [categoria, count] of Object.entries(categoriaContadores)) {
    const catId = categoria.replace(/\W+/g, "_");

    html += `
      <div class="linea-ticket categoria-header" onclick="toggleDetalles('${catId}', this)">
        <span class="texto-ticket bold">${categoria}<span class="flecha">▾</span></span>
        <span class="numero-ticket">${count}</span>
      </div>
      <div class="categoria-detalles" id="${catId}">
        ${Object.entries(subcategoriaContadores[categoria])
          .map(([vuln, c]) => `
            <div class="linea-ticket">
              <span class="texto-ticket">${vuln}</span>
              <span class="numero-ticket">${c}</span>
            </div>
          `).join('')}
      </div>
    `;
  }

  html += `
    <div class="linea-ticket">
      <span class="texto-ticket bold">CVEs</span>
      <span class="numero-ticket">${totalCVEs}</span>
    </div>
  `;

  html += `
    <div class="linea-asteriscos-medio">************************************************</div>
    <div class="linea-ticket"><span class="texto-total bold">TOTAL</span><span class="numero-total bold">${total}</span></div>
    <div class="resolver-texto"><span class="texto-ticket">por resolver</span><span class="resolver-numero">${porResolver}</span></div>
    <div class="linea-asteriscos-medio">************************************************</div>
    <div class="linea-ticket qr-linea"><img src="qr.png" alt="QR Code" class="qr-img" /></div>
    <div class="titulo-thx">THANK YOU!</div>
  `;


  cont.innerHTML = html;
}

function toggleDetalles(id, headerEl) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.toggle("visible");
    const flecha = headerEl.querySelector(".texto-ticket .flecha");
    if (flecha) {
      flecha.textContent = el.classList.contains("visible") ? "▴" : "▾";
    }
  }
}

document.addEventListener("DOMContentLoaded", mostrarEstadisticas);

