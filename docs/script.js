// script.js
const machineList = ['ariekei', 'cap', 'popcorn', 'tentacle'];
const isMenuPage = !!document.querySelector('.menu-boxes-container');

// SVG icons como strings
const linuxSvgString = `<svg class="os-icon" fill="#000000" width="20" height="20" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">...</svg>`;
const windowsSvgString = `<svg class="os-icon" viewBox="0 0 64 64" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-label="Windows">...</svg>`;

// Cookie helpers
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
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

// Cargar estado de checkboxes desde cookie
function loadCheckboxesFromCookie() {
  const cookie = getCookie('checkboxState');
  if (!cookie) return;
  const binaryState = base64ToBinary(cookie).padEnd(machineList.length, '0');
  machineList.forEach((id, idx) => {
    const cb = document.querySelector(`.checkbox[data-id="${id}"]`);
    if (!cb) return;
    cb.classList.toggle('checked', binaryState[idx] === '1');
  });
}

// Mostrar solo top 3 por rating (index.html)
function showTop3ByRating() {
  if (isMenuPage) return;
  const boxes = Array.from(document.querySelectorAll('.boxes-container .box'));
  const pendientes = boxes.filter(box => {
    const id = box.dataset.name;
    return !box.querySelector(`.checkbox[data-id="${id}"]`).classList.contains('checked');
  });
  pendientes.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
  boxes.forEach(box => (box.style.display = 'none'));
  pendientes.slice(0, 3).forEach(box => (box.style.display = ''));
}

// Alternar checkbox y guardar en cookie
function toggleCheckbox(el, id) {
  el.classList.toggle('checked');
  let binary = '';
  machineList.forEach(mid => {
    const cb = document.querySelector(`.checkbox[data-id="${mid}"]`);
    binary += cb.classList.contains('checked') ? '1' : '0';
  });
  setCookie('checkboxState', binaryToBase64(binary), 42 * 365);
  showTop3ByRating();
}

// Búsqueda y filtros
function searchBoxes() {
  const txt = document.getElementById('searchInput').value.toLowerCase();
  const active = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);
  const boxes = Array.from(document.querySelectorAll('.box'));
  if (!isMenuPage) {
    const chef = document.getElementById('chefRecommendations');
    if (txt) {
      chef.style.display = 'none';
      document.body.classList.add('search-active');
    } else {
      chef.style.display = '';
      document.body.classList.remove('search-active');
      showTop3ByRating();
      return;
    }
  }
  boxes.forEach(box => {
    const matchesText = box.innerText.toLowerCase().includes(txt);
    const matchesDiff = !active.length || active.includes(box.dataset.difficulty);
    box.style.display = matchesText && matchesDiff ? '' : 'none';
  });
}

// Mostrar IP y OS icon
function displayIPs() {
  document.querySelectorAll('.box').forEach(box => {
    const ip = box.dataset.ip;
    const os = box.dataset.os;
    if (!ip || !os) return;
    const ipDiv = document.createElement('div');
    ipDiv.className = 'ip';
    ipDiv.textContent = ip;
    box.appendChild(ipDiv);
    const svgString = os === 'linux' ? linuxSvgString : windowsSvgString;
    ipDiv.insertAdjacentHTML('afterend', svgString);
  });
}

// Menú flotante vacío para cajas
function createFloatingMenu() {
  const menu = document.createElement('div');
  menu.id = 'floatingMenu';
  menu.style.position = 'fixed'; // cambiado a fixed para centrar
  menu.style.background = 'white';
  menu.style.border = '1px solid #ccc';
  menu.style.padding = '10px';
  menu.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  menu.style.zIndex = 1000;
  // Centramos con transform:
  menu.style.left = '50%';
  menu.style.top = '50%';
  menu.style.transform = 'translate(-50%, -50%)';
  return menu;
}

window.onload = () => {
  loadCheckboxesFromCookie();
  showTop3ByRating();
  displayIPs();

  const ft = document.getElementById('filterToggle');
  if (ft) ft.addEventListener('click', () => document.getElementById('filterPanel').classList.toggle('hidden'));

  document.addEventListener('click', e => {
    const panel = document.getElementById('filterPanel');
    if (panel && ft && !panel.contains(e.target) && !ft.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });

  document.querySelectorAll('.filter-checkbox').forEach(cb => cb.addEventListener('change', searchBoxes));
  const clear = document.getElementById('clearFilters');
  if (clear) clear.addEventListener('click', () => {
    document.querySelectorAll('.filter-checkbox').forEach(cb => (cb.checked = false));
    searchBoxes();
  });

  if (isMenuPage) {
    const sortToggle = document.getElementById('sortToggle');
    const sortPanel = document.getElementById('sortPanel');
    const alpha = document.querySelector('input[value="alphabetical"]');
    if (alpha) {
      alpha.checked = true;
      alpha.dispatchEvent(new Event('change'));
    }
    if (sortToggle && sortPanel) {
      sortToggle.addEventListener('click', e => {
        e.stopPropagation();
        sortPanel.style.display = sortPanel.style.display === 'block' ? 'none' : 'block';
      });
      document.addEventListener('click', e => {
        if (!sortToggle.contains(e.target) && !sortPanel.contains(e.target)) {
          sortPanel.style.display = 'none';
        }
      });
      document.querySelectorAll('.sort-radio').forEach(rb => {
        rb.addEventListener('change', () => {
          const boxes = Array.from(document.querySelectorAll('.boxes-container .box'));
          if (rb.value === 'alphabetical') {
            boxes.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
          } else if (rb.value === 'rating') {
            boxes.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
          }
          const container = document.querySelector('.boxes-container');
          boxes.forEach(b => container.appendChild(b));
          sortPanel.style.display = 'none';
        });
      });
    }
  }

  document.querySelectorAll('.checkbox').forEach(cb => {
    cb.addEventListener('click', e => {
      e.stopPropagation();
      toggleCheckbox(cb, cb.dataset.id);
    });
  });

  document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', e => {
      e.stopPropagation();
      const prevMenu = document.getElementById('floatingMenu');
      if (prevMenu) prevMenu.remove();

      const menu = createFloatingMenu();
      document.body.appendChild(menu);

      // Ya no calculamos posición según la caja porque está centrado fijo

      const closeMenu = ev => {
        if (!menu.contains(ev.target) && !box.contains(ev.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      };
      setTimeout(() => document.addEventListener('click', closeMenu), 0);
    });
  });
};

