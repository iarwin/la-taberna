// script.js
const machineList = ['ariekei', 'cap', 'popcorn', 'tentacle'];
const isMenuPage = !!document.querySelector('.menu-boxes-container');

// Cookie helpers (sin cambios)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
}
function binaryToBase64(binaryStr) {
  const byteArray = new Uint8Array(Math.ceil(binaryStr.length / 8));
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(binaryStr.substr(i * 8, 8).padEnd(8, '0'), 2);
  }
  return btoa(String.fromCharCode(...byteArray));
}
function base64ToBinary(base64Str) {
  return atob(base64Str)
    .split('')
    .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

// Cargar estado checkboxes
function loadCheckboxesFromCookie() {
  const cookie = getCookie('checkboxState');
  if (!cookie) return;

  const binaryState = base64ToBinary(cookie).padEnd(machineList.length, '0');
  machineList.forEach((id, index) => {
    const el = document.querySelector(`.checkbox[data-id="${id}"]`);
    if (!el) return;
    if (binaryState[index] === '1') el.classList.add('checked');
    else el.classList.remove('checked');
  });
}

// Mostrar solo top 3 no completadas (solo en index.html)
function showTop3ByRating() {
  if (isMenuPage) return;

  const boxes = Array.from(document.querySelectorAll('.boxes-container .box'));
  const pendientes = boxes.filter(box => {
    const id = box.dataset.name;
    const cb = box.querySelector(`.checkbox[data-id="${id}"]`);
    return !cb.classList.contains('checked');
  });
  pendientes.sort((a, b) =>
    parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating)
  );
  boxes.forEach(box => box.style.display = 'none');
  pendientes.slice(0, 3).forEach(box => box.style.display = '');
}

// Toggle estado checkbox y guardar
function toggleCheckbox(el, id) {
  el.classList.toggle('checked');

  let binaryState = '';
  machineList.forEach(machineId => {
    const cb = document.querySelector(`.checkbox[data-id="${machineId}"]`);
    binaryState += cb.classList.contains('checked') ? '1' : '0';
  });
  const encoded = binaryToBase64(binaryState);
  setCookie('checkboxState', encoded, 42 * 365);

  showTop3ByRating();
}

// Búsqueda y filtro combinados (igual en ambas páginas)
function searchBoxes() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const activeDifficulties = Array.from(
    document.querySelectorAll(".filter-checkbox:checked")
  ).map(cb => cb.value);
  const boxes = Array.from(document.querySelectorAll('.box'));

  // Mostrar/ocultar el título “recomendaciones del chef” (solo si hay texto)
  if (!isMenuPage) {
    const chefEl = document.getElementById("chefRecommendations");
    if (input !== "") {
      chefEl.style.display = "none";
      document.body.classList.add("search-active");
    } else {
      chefEl.style.display = "";
      document.body.classList.remove("search-active");
    }
  }

  // Sin texto en index → modo recomendaciones, ignorar filtros
  if (!isMenuPage && input === "") {
    showTop3ByRating();
    return;
  }

  // Con texto → aplicar búsqueda + filtros
  boxes.forEach(box => {
    const text = box.innerText.toLowerCase();
    const diff = box.dataset.difficulty;
    const matchesText = text.includes(input);
    const matchesDiff = activeDifficulties.length === 0 || activeDifficulties.includes(diff);
    box.style.display = (matchesText && matchesDiff) ? '' : 'none';
  });
}

// Mostrar IPs debajo de las cajas
function displayIPs() {
  const boxes = document.querySelectorAll('.box');
  boxes.forEach(box => {
    const ip = box.dataset.ip; // Obtener la IP desde el data-ip
    if (ip) {
      const ipDiv = document.createElement('div');
      ipDiv.classList.add('ip');
      ipDiv.textContent = ip;
      box.appendChild(ipDiv); // Añadir la IP a la caja
    }
  });
}

// Setup inicial
window.onload = function () {
  loadCheckboxesFromCookie();
  showTop3ByRating();
  displayIPs(); // Mostrar las IPs
};

// Mostrar/ocultar panel de filtros
const filterToggle = document.getElementById("filterToggle");
if (filterToggle) {
  filterToggle.addEventListener("click", () => {
    document.getElementById("filterPanel").classList.toggle("hidden");
  });
}
document.addEventListener("click", function(event) {
  const panel = document.getElementById("filterPanel");
  const btn   = document.getElementById("filterToggle");
  if (panel && btn && !panel.contains(event.target) && !btn.contains(event.target)) {
    panel.classList.add("hidden");
  }
});
document.querySelectorAll(".filter-checkbox").forEach(cb => {
  cb.addEventListener("change", () => {
    searchBoxes();
  });
});
const clearFilters = document.getElementById("clearFilters");
if (clearFilters) {
  clearFilters.addEventListener("click", () => {
    document.querySelectorAll(".filter-checkbox").forEach(cb => cb.checked = false);
    searchBoxes();
  });
}

// --- Ordenar en menu.html ---
if (isMenuPage) {
  const sortToggle = document.getElementById("sortToggle");
  const sortPanel  = document.getElementById("sortPanel");
  const alphaRadio = document.querySelector('input[name="sort"][value="alphabetical"]');

  if (alphaRadio) {
    alphaRadio.checked = true;
    alphaRadio.dispatchEvent(new Event('change'));
  }

  if (sortToggle && sortPanel) {
    sortToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sortPanel.style.display = sortPanel.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!sortToggle.contains(e.target) && !sortPanel.contains(e.target)) {
        sortPanel.style.display = "none";
      }
    });

    document.querySelectorAll(".sort-radio").forEach(radio => {
      radio.addEventListener("change", () => {
        const option    = document.querySelector('input[name="sort"]:checked').value;
        const container = document.querySelector(".menu-boxes-container");
        const boxes     = Array.from(container.getElementsByClassName("box"));
        const orderMap  = { facil:1, media:2, dificil:3, insana:4 };

        boxes.sort((a, b) => {
          if (option === "alphabetical") {
            return a.dataset.name.localeCompare(b.dataset.name);
          }
          return orderMap[a.dataset.difficulty] - orderMap[b.dataset.difficulty];
        });

        boxes.forEach(box => container.appendChild(box));
      });
    });
  }
}

