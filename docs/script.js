// script.js
const machineList = ['cap', 'popcorn', 'knife', 'twomillion', 'nibbles', 'chemistry', 'mirai', 'shoppy'];
const isMenuPage = !!document.querySelector('.menu-boxes-container');

// SVG icons como strings
const linuxSvgString = `
<svg class="os-icon" fill="#000000" width="20" height="20" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.581 19.049c-.55-.446-.336-1.431-.907-1.917.553-3.365-.997-6.331-2.845-8.232-1.551-1.595-1.051-3.147-1.051-4.49 0-2.146-.881-4.41-3.55-4.41-2.853 0-3.635 2.38-3.663 3.738-.068 3.262.659 4.11-1.25 6.484-2.246 2.793-2.577 5.579-2.07 7.057-.237.276-.557.582-1.155.835-1.652.72-.441 1.925-.898 2.78-.13.243-.192.497-.192.74 0 .75.596 1.399 1.679 1.302 1.461-.13 2.809.905 3.681.905.77 0 1.402-.438 1.696-1.041 1.377-.339 3.077-.296 4.453.059.247.691.917 1.141 1.662 1.141 1.631 0 1.945-1.849 3.816-2.475.674-.225 1.013-.879 1.013-1.488 0-.39-.139-.761-.419-.988zm-9.147-10.465c-.319 0-.583-.258-1-.568-.528-.392-1.065-.618-1.059-1.03 0-.283.379-.37.869-.681.526-.333.731-.671 1.249-.671.53 0 .69.268 1.41.579.708.307 1.201.427 1.201.773 0 .355-.741.609-1.158.868-.613.378-.928.73-1.512.73zm1.665-5.215c.882.141.981 1.691.559 2.454l-.355-.145c.184-.543.181-1.437-.435-1.494-.391-.036-.643.48-.697.922-.153-.064-.32-.11-.523-.127.062-.923.658-1.737 1.451-1.61zm-3.403.331c.676-.168 1.075.618 1.078 1.435l-.31.19c-.042-.343-.195-.897-.579-.779-.411.128-.344 1.083-.115 1.279l-.306.17c-.42-.707-.419-2.133.232-2.295zm-2.115 19.243c-1.963-.893-2.63-.69-3.005-.69-.777 0-1.031-.579-.739-1.127.248-.465.171-.952.11-1.343-.094-.599-.111-.794.478-1.052.815-.346 1.177-.791 1.447-1.124.758-.937 1.523.537 2.15 1.85.407.851 1.208 1.282 1.455 2.225.227.871-.71 1.801-1.896 1.261zm6.987-1.874c-1.384.673-3.147.982-4.466.299-.195-.563-.507-.927-.843-1.293.539-.142.939-.814.46-1.489-.511-.721-1.555-1.224-2.61-2.04-.987-.763-1.299-2.644.045-4.746-.655 1.862-.272 3.578.057 4.069.068-.988.146-2.638 1.496-4.615.681-.998.691-2.316.706-3.14l.62.424c.456.337.838.708 1.386.708.81 0 1.258-.466 1.882-.853.244-.15.613-.302.923-.513.52 2.476 2.674 5.454 2.795 7.15.501-1.032-.142-3.514-.142-3.514.842 1.285.909 2.356.946 3.67.589.241 1.221.869 1.279 1.696l-.245-.028c-.126-.919-2.607-2.269-2.83-.539-1.19.181-.757 2.066-.997 3.288-.11.559-.314 1.001-.462 1.466zm4.846-.041c-.985.38-1.65 1.187-2.107 1.688-.88.966-2.044.503-2.168-.401-.131-.966.36-1.493.572-2.574.193-.987-.023-2.506.431-2.668.295 1.753 2.066 1.016 2.47.538.657 0 .712.222.859.837.092.385.219.709.578 1.09.418.447.29 1.133-.635 1.49zm-8-13.006c-.651 0-1.138-.433-1.534-.769-.203-.171.05-.487.253-.315.387.328.777.675 1.281.675.607 0 1.142-.519 1.867-.805.247-.097.388.285.143.382-.704.277-1.269.832-2.01.832z"/>
</svg>
`;

const windowsSvgString = `
<svg class="os-icon" viewBox="0 0 64 64" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-label="Windows">
  <path fill="#00ADEF" d="M2 10l28-4v24H2V10zm30-4l30-4v28H32V6zM32 34h30v28l-30-4V34zM2 34h28v24L2 54V34z"/>
</svg>
`;

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

  // Filtrar las que NO estén completas (o sea, no tengan clase 'checked' en la checkbox)
  const pendientes = boxes.filter(box => {
    const checkbox = box.querySelector('.checkbox');
    return !checkbox.classList.contains('checked');
  });

  // Ordenar por rating de mayor a menor
  pendientes.sort((a, b) => {
    const ratingA = parseFloat(a.dataset.rating || 0);
    const ratingB = parseFloat(b.dataset.rating || 0);
    return ratingB - ratingA;
  });

  // Ocultar todas
  boxes.forEach(box => {
    box.style.display = 'none';
  });

  // Mostrar solo las top 3
  const top3 = pendientes.slice(0, 3);
  top3.forEach(box => {
    box.style.display = '';
  });

  // Reordenar visualmente las 3 mejores al principio
  const container = document.querySelector('.boxes-container');
  top3.forEach(box => container.appendChild(box));
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
function createFloatingMenu(box) {
  const menu = document.createElement('div');
  menu.id = 'floatingMenu';
  menu.style.position = 'fixed';
  menu.style.background = 'white';
  menu.style.border = '1px solid #ccc';
  menu.style.padding = '10px';
  menu.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  menu.style.zIndex = 1000;
  menu.style.left = '50%';
  menu.style.top = '50%';
  menu.style.transform = 'translate(-50%, -50%)';

  const closeButton = document.createElement('span');
  closeButton.innerHTML = '&times;'; // ✖
  closeButton.classList.add('floating-menu-close');
  closeButton.onclick = () => {
    menu.remove(); // elimina el menú de la página
  };

  menu.appendChild(closeButton);

  const name = box.dataset.name;
  const title = document.createElement('h2');
  title.textContent = `${name}`;
  title.classList.add('floating-menu-title'); // usamos la clase CSS
  menu.appendChild(title);

  const ip = box.dataset.ip;
  const ipText = document.createElement('p');
  ipText.textContent = `${ip}`;
  ipText.classList.add('floating-menu-ip');
  menu.appendChild(ipText);

  const recipeButton = document.createElement('button');
  recipeButton.classList.add('floating-menu-recipe-button');
  recipeButton.textContent = 'ver receta';

  recipeButton.addEventListener('click', () => {
    const safeName = name.trim().replace(/\s+/g, '-');
    window.location.href = `./writeups/${safeName}.txt`;
  });

  menu.appendChild(recipeButton);

  const videoId = box.dataset.video;
  if (videoId) {
    const videoFrame = document.createElement('iframe');
    videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
    videoFrame.classList.add('floating-menu-video');
    videoFrame.frameBorder = '0';
    videoFrame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    videoFrame.allowFullscreen = true;
    videoFrame.classList.add('floating-menu-video');
    menu.appendChild(videoFrame);
  }


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

      const menu = createFloatingMenu(box);
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

// Función que maneja el toggle de las checkboxes
function toggleCheckbox(el) {
  el.classList.toggle('checked');
  // Actualizar cookie con estado actual
  let binary = '';
  machineList.forEach(id => {
    const cb = document.querySelector(`.checkbox[data-id="${id}"]`);
    binary += cb && cb.classList.contains('checked') ? '1' : '0';
  });
  setCookie('checkboxState', binaryToBase64(binary), 42 * 365);
  showTop3ByRating();
}

// Al cargar el DOM, asignar evento a cada checkbox
document.querySelectorAll('.checkbox').forEach(cb => {
  cb.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault(); // Añadido para prevenir comportamientos por defecto
    toggleCheckbox(cb);
  });
});

// Mapeo de dificultad en español a un orden lógico
const dificultadOrden = {
  facil: 1,
  media: 2,
  dificil: 3,
  insana: 4
};

// Función para ordenar alfabéticamente
function ordenarAlfabeticamente() {
  const container = document.querySelector('.boxes-container');
  const boxes = Array.from(container.querySelectorAll('.box'));

  boxes.sort((a, b) => {
    const nameA = a.dataset.name?.toLowerCase() || '';
    const nameB = b.dataset.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  boxes.forEach(box => container.appendChild(box));
}

// Función para ordenar por dificultad
function ordenarPorDificultad() {
  const container = document.querySelector('.boxes-container');
  const boxes = Array.from(container.querySelectorAll('.box'));

  boxes.sort((a, b) => {
    const difA = dificultadOrden[a.dataset.difficulty?.toLowerCase()] || 0;
    const difB = dificultadOrden[b.dataset.difficulty?.toLowerCase()] || 0;
    return difA - difB;
  });

  boxes.forEach(box => container.appendChild(box));
}

// Escuchar cambios en los radios de orden
document.querySelectorAll('.sort-radio').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'alphabetical') {
      ordenarAlfabeticamente();
    } else if (e.target.value === 'difficulty') {
      ordenarPorDificultad();
    } else if (e.target.value === 'rating') {
      ordenarPorValoracion();
    }
  });
});

