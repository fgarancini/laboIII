
const api_url = "http://localhost:3000/personas";

window.addEventListener("load", (event) => {
    event.preventDefault();
    const form = document.$("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    fetch(api_url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then( p => traerPersonas(p))
      .catch(err => console.log(err));
  });
});

TxtNode = (el) => {
    return document.createTextNode(el);
}
Create = (el) => {
    return document.createElement(el);
}
$ = (id) => {
    return document.getElementById(id);
}

traerPersonas = (p) =>
{
    console.log(p);
}