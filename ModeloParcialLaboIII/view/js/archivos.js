
const api_url_info = "http://localhost:3000/personas";
const api_url_edit = "http://localhost:3000/editar";
const form = $("form");
let div = $("edit");
const formModificar = $("menu");
div.hidden = true;
div.style.display = "none";


window.addEventListener("load", (event) => {
  event.preventDefault();
  const tabla = $("tabla");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    CargarContactos(api_url_info, tabla);
  });

  formModificar.addEventListener("submit", (event) => {
    event.preventDefault();

    let id = $("id");
    let n = $("nombre");
    let a = $("apellido");
    let f = $("fecha");
    let s = $("sexo");

    let persona = {
      id: id.placeholder,
      nombre: n.value,
      apellido: a.value,
      fecha: f.value,
      sexo: s.value,
    };
    console.log(persona);
    fetch(api_url_edit, {
      method: "POST",
      body:JSON.stringify(persona),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(p => {
        btn.disabled = false
        console.log(p);
      })
      .catch((err) => console.log(err));
  });
});


tabla.addEventListener("dblclick", (event) => {
  div.style.display = "flex";

  let p = event.target.parentNode;
  let childs = p.children;

  let id = $("id");
  let n = $("nombre");
  let a = $("apellido");
  let f = $("fecha");
  let s = $("sexo");
  id.placeholder = childs[0].innerText;
  n.placeholder = childs[1].innerText;
  a.placeholder = childs[2].innerText;
  f.placeholder = childs[3].innerText;
  s.placeholder = childs[4].innerText;
});

function CargarContactos(api, tabla) {
  fetch(api, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((p) => {
      btn.disabled = true;
      return Tabla(tabla, p);
    })
    .catch((err) => console.log(err));
}
function validarDatos() {
  let n = $("nombre");
  let a = $("apellido");
  let f = $("fecha");
  let s = $("sexo");
}
function Tabla(obj, arr) {
  let headTable = Object.keys(arr[0]);
  console.log(headTable);
  // headTable.shift();
  tabla = Create("table");

  tabla.appendChild(THeaders(headTable));
  tabla.appendChild(TBody(arr));

  obj.appendChild(tabla);
}

function THeaders(heads) {
  let thead = Create("thead");
  for (let j = 0; j < heads.length; j++) {
    let th = Create("th");
    th.className = "col";
    th.id = heads[j];
    console.log(heads[j]);
    th.appendChild(TxtNode(heads[j]));
    thead.appendChild(th);
  }
  return thead;
}

function TBody(arr) {
  let tbody = Create("tbody");
  tbody.id = "tbody";
  for (let i = 0; i < arr.length; i++) {
    let trow = Create("tr");
    trow.className = "row";
    let data = Object.keys(arr[i]);
    data.forEach((el) => {
      trow.appendChild(Td(arr[i][el], data));
    });
    tbody.appendChild(trow);
  }
  return tbody;
}

function Td(el, data) {
  let td = Create("td");
  td.appendChild(TxtNode(el));
  return td;
}

function TxtNode(el) {
  return document.createTextNode(el);
}
function Create(el) {
  return document.createElement(el);
}
function $(id) {
  return document.getElementById(id);
}

function borrar(event) {
  let el = event.target;
  console.log(el.parentNode);
  $("tbody").removeChild(el.parentNode);
}

traerPersonas = (p) => {
  console.log(p);
};
