//Copia link al portapapeles
function copiarAlPortapapeles(){
  var link = this.parentElement.parentElement.style.backgroundImage;
  link = link.slice(4, -1).replace(/"/g, "");
  // Crea un campo de texto "oculto"
  var aux = document.createElement("input");
  // Asigna el contenido del elemento especificado al valor del campo
  aux.setAttribute("value", link);
  //aux.style.display = "none";
  // Añade el campo a la página
  document.body.appendChild(aux);
  // Selecciona el contenido del campo
  aux.select();
  // Copia el texto seleccionado
  document.execCommand("copy");
  // Elimina el campo de la página
  document.body.removeChild(aux);
  mostrarMensajeGuardado(link);
}

function verImagen(){
  var link = this.parentElement.parentElement.style.backgroundImage;
  link = link.slice(4, -1).replace(/"/g, "");
  browser.tabs.create({ url: link });
}

function eliminarImagen(){
  var cuadro = this.parentElement.parentElement;
  var link = cuadro.style.backgroundImage;
  link = link.slice(4, -1).replace(/"/g, "");
  browser.storage.local.remove(link);
  document.getElementsByClassName("page-item active")[0].firstChild.onclick();
  mostrarMensajeEliminacion();
}

//Muestra que se guardo el link en el portapapeles correctamente
function mostrarMensajeGuardado(link){
  var title = browser.i18n.getMessage("copiadoCorrectoTitulo");
  var content = browser.i18n.getMessage("copiadoCorrectoContenido");
  browser.notifications.create(link,{
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/copy.png"),
    "title": title,
    "message": content,
    "eventTime": 3000
  });
  //browser.notifications.update(link, {"eventTime": 3000});
}

//Muestra que se elimino la imagen de la biblioteca correctamente
function mostrarMensajeEliminacion(link){
  var title = browser.i18n.getMessage("eliminacionCorrectaTitulo");
  var content = browser.i18n.getMessage("eliminacionCorrectaContenido");
  browser.notifications.create(link,{
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/delete.png"),
    "title": title,
    "message": content,
    "eventTime": 3000
  });
  //browser.notifications.update(link, {"eventTime": 3000});
}

//Error para la funcion "Promise"
function onError(e){
  console.error(e);
}

function anadirBotones(cuadro){
  var div = document.createElement("div");
  div.align = "center";
  div.style.display = "none";
  div.id = "botones";
  var botonCopiar = document.createElement("button");
  botonCopiar.innerHTML = browser.i18n.getMessage("botonCopiar");
  botonCopiar.onclick = copiarAlPortapapeles;
  botonCopiar.className = "btn btn-success btn-sm";
  var botonVer = document.createElement("button");
  botonVer.innerHTML = browser.i18n.getMessage("botonVer");
  botonVer.style.marginTop = "2px";
  botonVer.style.marginBottom = "2px";
  botonVer.onclick = verImagen;
  botonVer.className = "btn btn-primary btn-sm";
  var botonEliminar = document.createElement("button");
  botonEliminar.innerHTML = browser.i18n.getMessage("botonEliminar");
  botonEliminar.onclick = eliminarImagen;
  botonEliminar.className = "btn btn-danger btn-sm";
  div.appendChild(botonCopiar);
  div.appendChild(botonVer);
  div.appendChild(botonEliminar);
  cuadro.appendChild(div);
}

function mostrarBotones(){
  this.querySelector("#botones").style.display = "block";
}

function ocultarBotones(){
  this.querySelector("#botones").style.display = "none";
}

function initialize() {
  document.getElementById("anterior1").onclick = cambiarPagina;
  document.getElementById("anterior2").onclick = cambiarPagina;
  document.getElementById("medio").onclick = cambiarPagina;
  document.getElementById("siguiente1").onclick = cambiarPagina;
  document.getElementById("siguiente2").onclick = cambiarPagina;
  document.getElementById("anterior").onclick = paginaAnterior;
  document.getElementById("siguiente").onclick = paginaSiguiente;

  document.getElementById("anterior2").onclick();
}

initialize();

function actualizarIndice(pag){
  var paginas = document.getElementsByClassName("page-link");
  var medio = parseInt(document.getElementById("medio").innerHTML);
  var actPag = parseInt(pag.innerHTML);
  if (actPag > medio) {
    var dif = actPag - medio;
    for (var i = 1; i < paginas.length - 1; i++) {
      paginas[i].innerHTML = parseInt(paginas[i].innerHTML) + dif;
    }
  }else if(actPag < medio && actPag >= 3){
    var dif = medio - actPag;
    for (var i = 1; i < paginas.length - 1; i++) {
      paginas[i].innerHTML = parseInt(paginas[i].innerHTML) - dif;
    }
  }else if (actPag == 2 && medio != 3) {
    for (var i = 1; i < paginas.length - 1; i++) {
      paginas[i].innerHTML = parseInt(paginas[i].innerHTML) - 1;
    }
  }
  for (var i = 1; i < paginas.length - 1; i++) {
    if (paginas[i].parentElement.className == "page-item active") {
      paginas[i].parentElement.className = "page-item";
    }
    if (parseInt(paginas[i].innerHTML) == actPag) {
      paginas[i].parentElement.className = "page-item active";
    }
  }
}

function cambiarPagina(){
  var pag = this.innerHTML;
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var links = Object.keys(results);
    if(links.length == 0 || links.length <= ((pag - 1) * 25)){
      document.getElementById("galeria").innerHTML = '<div align="center" style="margin: 20px">' + browser.i18n.getMessage("sinElementos"); + '</div>';
    }else{
      if (links.length >= (pag * 25)){
        var max = pag * 25;
      }else {
        var max = links.length;
      }
      var nuevaPagina = document.createElement("div");
      nuevaPagina.className = "cuerpo";
      nuevaPagina.id = "galeria";
      for (var i = ((pag - 1) * 25); i < max ; i++) {
        var link = links[i];
        var cuadro = document.createElement("cuadro");
        cuadro.style.backgroundImage = "url('" + link + "')";
        cuadro.align = "center";
        anadirBotones(cuadro);
        cuadro.onmouseenter = mostrarBotones;
        cuadro.onmouseleave = ocultarBotones;
        nuevaPagina.appendChild(cuadro);
      }
      document.body.replaceChild(nuevaPagina, document.getElementById("galeria"));
    }
  }, onError);
  actualizarIndice(this);
}

function paginaAnterior(){
  var pagina = document.getElementsByClassName("page-item active")[0].firstChild;
  if (pagina.innerHTML != "1") {
    var paginas = document.getElementsByClassName("page-link");
    var num = parseInt(pagina.innerHTML) - 1;
    for (var i = 1; i < paginas.length - 1; i++) {
      if (parseInt(paginas[i].innerHTML) == num) {
        paginas[i].onclick();
        break;
      }
    }
  }
}

function paginaSiguiente(){
  var pagina = document.getElementsByClassName("page-item active")[0].firstChild;
  var paginas = document.getElementsByClassName("page-link");
  var num = parseInt(pagina.innerHTML) + 1;
  for (var i = 1; i < paginas.length - 1; i++) {
    if (parseInt(paginas[i].innerHTML) == num) {
      paginas[i].onclick();
      break;
    }
  }
}
