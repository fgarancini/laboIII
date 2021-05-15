const api_url_info = "http://localhost:3000/materias";
const api_url_edit = "http://localhost:3000/editar";
const api_url_delete = "http://localhost:3000/eliminar";
const form = $("menu");
const div = $("form-edit");

const btnModificar = $("modificar");
const btnEliminar = $("eliminar");
const btnCargar = $("materias");

window.addEventListener("load", (event) => {
  const tabla = $('tabla');


  btnCargar.addEventListener('click', (event) => 
  {
    event.preventDefault();
    CargarMaterias(api_url_info);
    btnCargar.disabled = true;
  });


  btnModificar.addEventListener("click", (event) => {
    event.preventDefault();
    let materia = crearMateria();
    if(materia.nombre.length > 6 && validarFecha(materia.fechaFinal))
    {
      ModificarMateria(api_url_edit, crearMateria());
      refresh(tabla);
    }else
    {
      alert('Nombre erroneo');
    }
  });

  btnEliminar.addEventListener("click", (event) => {
    event.preventDefault();
    EliminarMateria(api_url_delete,crearMateria());
    refresh(tabla);
  });
});

function crearMateria() {
  let formData = new FormData(form);
  let materia = {
    id: parseInt(formData.get("id")),
    nombre: formData.get("nombre"),
    cuatrimestre: $("cuatrimestre").value,
    fechaFinal: formData.get("fechaFinal"),
    turno: 'Noche',
  };
  return materia;
}

function validarFecha(fecha) {
  let f = fecha.split('/');
  let dia = f[0];
  let mes = f[1];
  let anio = f[2];
  let date = new Date();
  date.setFullYear(anio,mes,dia);
  let hoy = new Date();

  if (date >= hoy) {
    return false;
  }
  else
  {
    return true;
  }

}

tabla.addEventListener("dblclick", (event) => {
  event.preventDefault();
  let p = event.target.parentNode;
  let childs = p.children;
  div.hidden = false;
  loadForm(childs);
});

function refresh(tabla) {
  tabla.innerHTML = "";
  CargarMaterias(api_url_info);
}

async function EliminarMateria(api,materia) {
  Spinner();
  const send = await fetch(api, {
    method: "POST",
    body: JSON.stringify(materia),
    headers: {
      "content-type": "application/json",
    },
  }).catch((err) => console.log(err));

  const f = await send.json();

  console.log(f);

  load();
}
async function ModificarMateria(api, materia) {
  Spinner();
  const res = await fetch(api, {
    method: "POST",
    body: JSON.stringify(materia),
    headers: {
      "content-type": "application/json",
    },
  }).catch((err) => console.log(err));
  const json = await res.json();
  console.log(json);
  load();
}
async function CargarMaterias(api) {
  const tabla = $("tabla");

  const materias = await fetch(api, {
    method: "GET",
  }).catch((err) => console.log(err));;
  const res = await materias.json();
  Tabla(tabla, res);
}

function loadForm(childs) {
  let id = $("id");
  let nombre = $("nombre");
  let cuatrimestre = $("cuatrimestre");
  let fecha = $("fechaFinal");

  id.value = childs[0].innerText;
  nombre.value = childs[1].innerText;
  cuatrimestre.value = childs[2].innerText;
  fecha.value = childs[3].innerText;
}

function Spinner() {
  let spinner = $("loader");
  let menu = $("form-edit");
  let tabla = $("tabla");
  spinner.style.display = "block";
  tabla.style.display = "none";
  menu.style.display = "none";
}

function load() {
  let spinner = $("loader");
  let menu = $("form-edit");
  let tabla = $("tabla");
  spinner.style.display = "none";
  tabla.style.display = "flex";
  menu.style.display = "flex";
}

/**
 *
 * @param {HTMLElement} obj Tabla que va a contener los apendices
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
 * Cabezales de las tablas
 * @param {Array} heads
 * @returns Cabecera de tablas
 */
function THeaders(heads) {
  let thead = Create("thead");
  for (let j = 0; j < heads.length; j++) {
    let th = Create("th");
    th.className = "col";
    th.id = heads[j];
    // console.log(heads[j]);
    th.appendChild(TxtNode(heads[j].toUpperCase()));
    thead.appendChild(th);
  }
  return thead;
}

/**
 * Crea un cuerpo de una tabla con todas las lineas
 * @param {Array} arr
 * @returns
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
 * texto en la linea
 * @param {String} el
 * @returns
 */
function Td(el) {
  let td = Create("td");
  td.appendChild(TxtNode(el));
  return td;
}
/**
 * Crea el texto del nodo a ser apendizado
 * @param {String} el
 * @returns
 */
function TxtNode(el) {
  return document.createTextNode(el);
}

/**
 * Crear etiqueta html
 * @param {HTMLElement} el
 * @returns etiqueta html
 */
function Create(el) {
  return document.createElement(el);
}

/**
 * get element by id
 * @param {HTMLElement} id
 * @returns element
 */
function $(id) {
  return document.getElementById(id);
}
