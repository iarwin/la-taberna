const machineList = ['ariekei', 'cap', 'popcorn', 'tentacle'];

// Cookie helpers
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
    if (el) {
      if (binaryState[index] === '1') {
        el.classList.add('checked');
      } else {
        el.classList.remove('checked');
      }
    }
  });
}

// Toggle estado checkbox y guardar
function toggleCheckbox(el, id) {
  el.classList.toggle('checked');

  let binaryState = '';
  machineList.forEach(machineId => {
    const checkbox = document.querySelector(`.checkbox[data-id="${machineId}"]`);
    binaryState += checkbox && checkbox.classList.contains('checked') ? '1' : '0';
  });

  const encoded = binaryToBase64(binaryState);
  setCookie('checkboxState', encoded, 42 * 365);
}

// Búsqueda y filtro combinados
function searchBoxes() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const boxes = Array.from(document.getElementsByClassName("box"));

  const activeDifficulties = Array.from(
    document.querySelectorAll(".filter-checkbox:checked")
  ).map(cb => cb.value);

  boxes.forEach(box => {
    const text = box.innerText.toLowerCase();
    const difficulty = box.getAttribute("data-difficulty");

    const matchesText = input === "" || text.includes(input);
    const matchesDifficulty =
      activeDifficulties.length === 0 || activeDifficulties.includes(difficulty);

    box.style.display = (matchesText && matchesDifficulty) ? "" : "none";
  });
}

// Eventos
window.onload = function () {
  loadCheckboxesFromCookie();

  // Ordenar alfabéticamente por defecto
  const container = document.querySelector(".boxes-container");
  if (container) {
    const boxes = Array.from(container.getElementsByClassName("box"));
    boxes.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    boxes.forEach(box => container.appendChild(box));
  }

  // Marcar opción de orden alfabético por defecto
  const alphabeticalRadio = document.querySelector('input[name="sort"][value="alphabetical"]');
  if (alphabeticalRadio) alphabeticalRadio.checked = true;
};

// Mostrar/ocultar panel de filtros
const filterToggle = document.getElementById("filterToggle");
if (filterToggle) {
  filterToggle.addEventListener("click", function () {
    const panel = document.getElementById("filterPanel");
    if (panel) panel.classList.toggle("hidden");
  });
}

// Cerrar el menú de filtros si se hace clic fuera
document.addEventListener("click", function(event) {
  const filterPanel = document.getElementById("filterPanel");
  const filterButton = document.getElementById("filterToggle");

  if (filterPanel && filterButton && !filterPanel.contains(event.target) && !filterButton.contains(event.target)) {
    filterPanel.classList.add("hidden");
  }
});

// Escucha cambios en filtros
document.querySelectorAll(".filter-checkbox").forEach(cb => {
  cb.addEventListener("change", searchBoxes);
});

// Limpiar filtros
const clearFilters = document.getElementById("clearFilters");
if (clearFilters) {
  clearFilters.addEventListener("click", () => {
    document.querySelectorAll(".filter-checkbox").forEach(cb => cb.checked = false);
    searchBoxes();
  });
}

// Mostrar/ocultar panel de ordenar y ordenar
const sortButton = document.querySelector('.sort-button');
const sortPanel  = document.querySelector('.sort-panel');

if (sortButton && sortPanel) {
  sortButton.addEventListener('click', () => {
    sortPanel.style.display =
      (sortPanel.style.display === 'block') ? 'none' : 'block';
  });

  window.addEventListener('click', (e) => {
    if (!sortButton.contains(e.target) && !sortPanel.contains(e.target)) {
      sortPanel.style.display = 'none';
    }
  });

  document.querySelectorAll(".sort-radio").forEach(radio => {
    radio.addEventListener("change", () => {
      const option    = document.querySelector('input[name="sort"]:checked').value;
      const container = document.querySelector(".boxes-container");
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

