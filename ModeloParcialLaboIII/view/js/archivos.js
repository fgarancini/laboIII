const api_url_info = "http://localhost:3000/personas";
const api_url_edit = "http://localhost:3000/editar";
const api_url_delete = "http://localhost:3000/eliminar";

const eliminarBtn = $("eliminar");
const modificarBtn = $("modificar");
const cargarBtn = $("cargar");

const formModificar = $("menu");
const div = $("edit-menu");

div.style.display = "none";

window.addEventListener("load", (event) => {
  event.preventDefault();
  const tabla = $("tabla");

  cargarBtn.addEventListener("click", (event) => {
    event.preventDefault();
    refresh(tabla);
  });

  modificarBtn.addEventListener("click", (event) => {
    event.preventDefault();
    let persona = crearUser();
    if (validarDatos(persona)) {
      let inputs = document.getElementsByTagName('input');
      for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];
        if (element.value == "") {
          element.className = 'conError';
        }
      }
    }
    else{
      ModificarContacto(api_url_edit,persona,tabla);
    }
  });

  eliminarBtn.addEventListener("click", (event) => {
    event.preventDefault();
    let persona = crearUser();    
    EliminarPersona(api_url_delete, persona, tabla);
  });
});

tabla.addEventListener("dblclick", (event) => {
  let p = event.target.parentNode;
  let childs = p.children;
  loadForm(childs);
});

function refresh(tabla) {
  tabla.innerHTML = "";
  CargarContactos(api_url_info, tabla);
}

async function EliminarPersona(api, persona, tabla) {

  Spinner();
  const res = await fetch(api,{
    method: "POST",
    body: JSON.stringify(persona),
    headers: {
      "content-type": "application/json",
    },
  });
  refresh(tabla);
  load();
  const json = await res.json();

  console.log(json);
  // fetch(api, {
  //   method: "POST",
  //   body: JSON.stringify(persona),
  //   headers: {
  //     "content-type": "application/json",
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((p) => {
  //     refresh(tabla);
  // load();
  //     return;
  //   })
  //   .catch((err) => console.log(err));
  cleanInput();
}

async function ModificarContacto(api, persona, tabla) {
  Spinner();
  const res = await fetch(api, {
    method: "POST",
    body: JSON.stringify(persona),
    headers: {
      "content-type": "application/json",
    }
  })
  .catch(err => console.log(err));

  cargarBtn.disabled = false;
  refresh(tabla);
  load();
  const json = await res.json();
  console.log(json);
  // fetch(api, {
  //   method: "POST",
  //   body: JSON.stringify(persona),
  //   headers: {
  //     "content-type": "application/json",
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((p) => {
  //     refresh(tabla);
  //     load();
  //     cargarBtn.disabled = false;
  //     return;
  //   })
  //   .catch((err) => console.log(err));
  cleanInput();

}

function CargarContactos(api, tabla) {
  fetch(api, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((p) => {
      cargarBtn.disabled = true;
      return Tabla(tabla, p);
    })
    .catch((err) => console.log(err));
}
function crearUser() {
  let formData = new FormData(formModificar);

  let persona = {
    id: formData.get("id").toString(),
    nombre: formData.get("nombre").toString(),
    apellido: formData.get("apellido").toString(),
    fecha: formData.get("fecha").toString(),
    sexo: formData.get("sexo").toString(),
  };

  return persona;

}
function cleanInput() {
  let inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    element.value = "";
  }
}
function Spinner() {
  let spinner = $("loader");
  let menu = $("edit-menu");
  let tabla = $("tabla");
  spinner.style.display = "block";
  tabla.style.display = "none";
  menu.style.display = "none";
}
function load() {
  let spinner = $("loader");
  let menu = $("edit-menu");
  let tabla = $("tabla");
  spinner.style.display = "none";
  tabla.style.display = "flex";
  menu.style.display = "flex";
}

function validarDatos(user) {
    return user.id.trim() == "" ||
    user.nombre.trim() == "" ||
    user.apellido.trim() == "" ||
    user.fecha.trim() == "" ||
    user.sexo.trim() == "";
}
function loadForm(childs) {
  div.style.display = "flex";
  div.style.flexDirection = "column";

  let id = $("id");
  let n = $("nombre");
  let a = $("apellido");
  let f = $("fecha");
  let s = $("sexo");

  id.value = childs[0].innerText;
  n.value = childs[1].innerText;
  a.value = childs[2].innerText;
  f.value = childs[3].innerText;
  s.value = childs[4].innerText;
}
/**
 *
 * @param {Object} obj Tabla que va a contener los apendices
 * @param {Array} arr Todos los datos
 */
function Tabla(obj, arr) {
  let headTable = Object.keys(arr[0]);
  // console.log(headTable);
  // headTable.shift();
  tabla = Create("table");

  tabla.appendChild(THeaders(headTable));
  tabla.appendChild(TBody(arr));

  obj.appendChild(tabla);
}
/**
 *
 * @param {Array} heads cabezales de las tablas
 * @returns Cabecera de tablas
 */
function THeaders(heads) {
  let thead = Create("thead");
  for (let j = 0; j < heads.length; j++) {
    let th = Create("th");
    th.className = "col";
    th.id = heads[j];
    // console.log(heads[j]);
    th.appendChild(TxtNode(heads[j]));
    thead.appendChild(th);
  }
  return thead;
}

/**
 *
 * @param {Array} arr contiene todos los elementos a ser agregados al body
 * @returns un cuerpo de una tabla con todas las lineas
 */

function TBody(arr) {
  let tbody = Create("tbody");
  tbody.id = "tbody";
  for (let i = 0; i < arr.length; i++) {
    let trow = Create("tr");
    trow.className = "row";
    let data = Object.keys(arr[i]);
    data.forEach((el) => {
      trow.appendChild(Td(arr[i][el]));
    });
    tbody.appendChild(trow);
  }
  return tbody;
}
/**
 *
 * @param {*} el texto en la linea
 * @returns
 */
function Td(el) {
  let td = Create("td");
  td.appendChild(TxtNode(el));
  return td;
}
/**
 *
 * @param {*} el Crea el texto del nodo a ser apendizado
 * @returns
 */
function TxtNode(el) {
  return document.createTextNode(el);
}

/**
 *
 * @param {*} el Crear etiqueta html
 * @returns etiqueta html
 */
function Create(el) {
  return document.createElement(el);
}

/**
 *
 * @param {} id get element by id
 * @returns element
 */
function $(id) {
  return document.getElementById(id);
}

function borrar(event) {
  let el = event;
  console.log(el);
  $("tbody").removeChild(el);
}

traerPersonas = (p) => {
  console.log(p);
};
