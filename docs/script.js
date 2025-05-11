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
  const binary = atob(base64Str)
    .split('')
    .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
  return binary;
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
  const boxes = document.getElementsByClassName("box");

  const activeDifficulties = Array.from(document.querySelectorAll(".filter-checkbox:checked"))
    .map(cb => cb.value);

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const text = box.innerText.toLowerCase();
    const difficulty = box.getAttribute("data-difficulty");

    const matchesText = text.includes(input);
    const matchesDifficulty = activeDifficulties.includes(difficulty);

    if (input === "") {
      // Si no hay texto, mostrar todo sin aplicar filtros
      box.style.display = "";
    } else {
      // Si hay texto, aplicar filtros si están activos
      box.style.display = (matchesText && (activeDifficulties.length === 0 || matchesDifficulty)) ? "" : "none";
    }
  }
}

// Eventos
window.onload = function () {
  loadCheckboxesFromCookie();
};

// Mostrar/ocultar panel de filtros
document.getElementById("filterToggle").addEventListener("click", function () {
  document.getElementById("filterPanel").classList.toggle("hidden");
});

// Cerrar el menú de filtros si se hace clic fuera
document.addEventListener("click", function(event) {
  const filterPanel = document.getElementById("filterPanel");
  const filterButton = document.getElementById("filterToggle");

  if (!filterPanel.contains(event.target) && !filterButton.contains(event.target)) {
    filterPanel.classList.add("hidden");
  }
});

// Mostrar/ocultar panel de ordenar
const sortButton = document.querySelector('.sort-button');
const sortPanel = document.querySelector('.sort-panel');

sortButton.addEventListener('click', () => {
  sortPanel.style.display = sortPanel.style.display === 'none' || sortPanel.style.display === '' ? 'block' : 'none';
});

window.addEventListener('click', (event) => {
  if (!sortButton.contains(event.target) && !sortPanel.contains(event.target)) {
    sortPanel.style.display = 'none';
  }
});

// Escucha cambios en filtros
document.querySelectorAll(".filter-checkbox").forEach(cb => {
  cb.addEventListener("change", searchBoxes);
});

// Limpiar filtros
document.getElementById("clearFilters").addEventListener("click", () => {
  document.querySelectorAll(".filter-checkbox").forEach(cb => {
    cb.checked = false;
  });
  searchBoxes();
});

// Ordenar máquinas
document.querySelectorAll(".sort-radio").forEach(radio => {
  radio.addEventListener("change", function () {
    const selectedOption = document.querySelector('input[name="sort"]:checked').value;
    const boxes = Array.from(document.getElementsByClassName("box"));

    const difficultyOrder = {
      facil: 1,
      media: 2,
      dificil: 3,
      insana: 4
    };

    boxes.sort((a, b) => {
      if (selectedOption === "alphabetical") {
        const nameA = a.getAttribute("data-name") || a.innerText.toLowerCase();
        const nameB = b.getAttribute("data-name") || b.innerText.toLowerCase();
        return nameA.localeCompare(nameB);
      } else if (selectedOption === "difficulty") {
        const diffA = a.getAttribute("data-difficulty") || 'media';
        const diffB = b.getAttribute("data-difficulty") || 'media';
        return difficultyOrder[diffA] - difficultyOrder[diffB];
      }
      return 0;
    });

    const container = document.querySelector(".boxes-container");
    boxes.forEach(box => container.appendChild(box));
  });
});

