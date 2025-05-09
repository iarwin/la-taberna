// Lista ordenada alfabéticamente de todas las máquinas (debe coincidir con los IDs en HTML)
const machineList = [
  'cap',
  'popcorn',
  'tentacle'
  // Añade aquí más máquinas manteniendo orden alfabético
];

// Obtener el valor de una cookie por su nombre
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Establecer una cookie con una duración específica en días
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Codificar una cadena binaria a base64
function binaryToBase64(binaryStr) {
  const byteArray = new Uint8Array(Math.ceil(binaryStr.length / 8));
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(binaryStr.substr(i * 8, 8).padEnd(8, '0'), 2);
  }
  return btoa(String.fromCharCode(...byteArray));
}

// Decodificar una base64 a cadena binaria
function base64ToBinary(base64Str) {
  const binary = atob(base64Str)
    .split('')
    .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
  return binary;
}

// Cargar los estados de las checkboxes desde la cookie
function loadCheckboxesFromCookie() {
  const cookie = getCookie('checkboxState');
  if (!cookie) return;

  const binaryState = base64ToBinary(cookie).padEnd(machineList.length, '0');

  machineList.forEach((id, index) => {
    const el = document.querySelector(`.checkbox[onclick*="'${id}'"]`);
    if (el) {
      if (binaryState[index] === '1') {
        el.classList.add('checked');
      } else {
        el.classList.remove('checked');
      }
    }
  });
}

// Cambiar el estado de una checkbox y actualizar la cookie
function toggleCheckbox(el, id) {
  el.classList.toggle('checked');

  // Crear una cadena binaria con los estados en orden según machineList
  let binaryState = '';
  machineList.forEach(machineId => {
    const checkbox = document.querySelector(`.checkbox[onclick*="'${machineId}'"]`);
    binaryState += checkbox && checkbox.classList.contains('checked') ? '1' : '0';
  });

  // Codificar en base64 y guardar (cookie válida 42 años)
  const encoded = binaryToBase64(binaryState);
  setCookie('checkboxState', encoded, 42 * 365);
}

// Función para búsqueda por texto
function searchBoxes() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  const boxes = document.getElementsByClassName("box");

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const boxText = box.innerText.toLowerCase();
    box.style.display = boxText.includes(filter) ? "" : "none";
  }
}

// Ejecutar al cargar la página
window.onload = function () {
  loadCheckboxesFromCookie();
};

