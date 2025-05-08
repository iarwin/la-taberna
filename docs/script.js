// Cargar los checkboxes desde localStorage al cargar la página
document.querySelectorAll('.checkbox').forEach(el => {
  const key = el.getAttribute('onclick').match(/'(.+?)'/)[1];
  if (localStorage.getItem('checkbox-' + key) === 'checked') {
    el.classList.add('checked');
  }
});

// Cambia estado y guarda
function toggleCheckbox(el, id) {
  el.classList.toggle('checked');
  const isChecked = el.classList.contains('checked');
  localStorage.setItem('checkbox-' + id, isChecked ? 'checked' : 'unchecked');
}

function searchBoxes() {
  var input = document.getElementById("searchInput");
  var filter = input.value.toLowerCase();
  var boxes = document.getElementsByClassName("box");

  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    var boxText = box.innerText.toLowerCase();
    if (boxText.indexOf(filter) > -1) {
      box.style.display = "";
    } else {
      box.style.display = "none";
    }
  }
}
