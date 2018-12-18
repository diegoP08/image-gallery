//Variables globales y constantes
const elementosPorPagina = 20;


//Copia link al portapapeles
function copiarAlPortapapeles(){
  var link = this.link;
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

//Abre la imagen en nueva pestaña
function verImagen(){
  browser.tabs.create({ url: this.link });
}

//Elimina la imagen de la coleccion
function eliminarImagen(){
  var link = this.link;

  browser.storage.local.get("imagenes").then((imagenes) => {
    imagenes = imagenes.imagenes ? imagenes.imagenes : [];

    var imagenes = $.grep(imagenes, function(imagen){ 
      return imagen.link != link; 
    });

    browser.storage.local.set({ ["imagenes"] : imagenes }).then((result) =>{
      $(".page-item.active")[0].firstChild.onclick();
      mostrarMensajeEliminacion();
    });

  })

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

//Añade botones a la imagen
function anadirBotones(cuadro){
  var link = cuadro.css("backgroundImage").slice(4, -1).replace(/"/g, "");
  
  var div = $(document.createElement('div'));
  div.addClass("text-center d-none");
  div.attr("id","botones");

  var botonCopiar = $(document.createElement("button"));
  botonCopiar.html(browser.i18n.getMessage("botonCopiar"));
  botonCopiar.prop("link", link);
  botonCopiar.bind("click", copiarAlPortapapeles);
  botonCopiar.addClass("btn btn-success btn-sm");

  /*var botonVer = document.createElement("button");
  botonVer.innerHTML = browser.i18n.getMessage("botonVer");
  botonVer.style.marginTop = "2px";
  botonVer.style.marginBottom = "2px";
  botonVer.onclick = verImagen;
  botonVer.className = "btn btn-primary btn-sm";*/

  var botonEliminar = $(document.createElement("button"));
  botonEliminar.html(browser.i18n.getMessage("botonEliminar"));
  botonEliminar.prop("link", link);
  botonEliminar.css({"marginTop": "2px", "marginBottom": "2px"});
  botonEliminar.bind("click", eliminarImagen);
  botonEliminar.addClass("btn btn-danger btn-sm");

  var botonMas = $(document.createElement("button"));
  botonMas.html(browser.i18n.getMessage("botonMas"));
  botonMas.prop("link", link);
  //botonMas.bind("click", copiarAlPortapapeles);
  botonMas.addClass("btn btn-info btn-sm");

  div.append(botonCopiar);
  div.append(botonEliminar);
  div.append(botonMas);
  
  cuadro.append(div);
}

//Muestra acciones sobre la imagen
function mostrarBotones(){
  $(this).find("#botones").removeClass("d-none");
  $(this).find("#botones").addClass("d-block");
}

//Oculta acciones sobre la imagen
function ocultarBotones(){
  $(this).find("#botones").removeClass("d-block");
  $(this).find("#botones").addClass("d-none");
}

//Actualiza el indice de paginas
function actualizarIndice(pag){
  var paginas = $(".page-link");
  
  var medio = parseInt($("#medio").html());
  var actPag = parseInt(pag.html());
  if (actPag > medio) {
    var dif = actPag - medio;
    for (var i = 1; i < paginas.length - 1; i++) {
      const pagActual = $(paginas[i]);
      pagActual.html(parseInt(pagActual.html()) + dif);
    }
  }else if(actPag < medio && actPag >= 3){
    var dif = medio - actPag;
    for (var i = 1; i < paginas.length - 1; i++) {
      const pagActual = $(paginas[i]);
      pagActual.html(parseInt(pagActual.html()) - dif);
    }
  }else if (actPag == 2 && medio != 3) {
    for (var i = 1; i < paginas.length - 1; i++) {
      const pagActual = $(paginas[i]);
      pagActual.html(parseInt(pagActual.html()) - 1);
    }
  }

  browser.storage.local.get("imagenes").then((imagenes) => {
    imagenes = imagenes.imagenes ? imagenes.imagenes : [];
    var cantPags = Math.ceil(imagenes.length / elementosPorPagina);

    for (var i = 1; i < paginas.length - 1; i++) {
      const pagActual = $(paginas[i]);

      if (pagActual.parent().attr("class") == "page-item active") {
        pagActual.parent().attr("class", "page-item");
      }

      if (parseInt(pagActual.html()) == actPag) {
        pagActual.parent().attr("class", "page-item active");
  
        if (actPag == 1) {
          $("#anterior").parent().addClass("disabled");
        }else{
          $("#anterior").parent().removeClass("disabled");
        }
  
        if (!cantPags || actPag == cantPags) {
          $("#siguiente").parent().addClass("disabled");
        }else{
          $("#siguiente").parent().removeClass("disabled");
        }
      }

      if (parseInt(pagActual.html()) <= cantPags) {
        pagActual.parent().removeClass("disabled");
      }else{
        pagActual.parent().addClass("disabled");
      }
    }

  })
  
  
}


//Cambia de pagina
function cambiarPagina(){
  
  var pag = $(this).html();
  var query = browser.storage.local.get("imagenes");
  query.then((imagenes) => {
    imagenes = imagenes.imagenes ? imagenes.imagenes : [];
    
    if(imagenes.length == 0 || imagenes.length <= ((pag - 1) * elementosPorPagina)){
      $("#galeria").html('<div class="col-12 text-center my-4">' + browser.i18n.getMessage("sinElementos") + '</div>');
    }else{
      if (imagenes.length >= (pag * elementosPorPagina)){
        var max = pag * elementosPorPagina;
      }else {
        var max = imagenes.length;
      }
      var nuevaPagina = $(document.createElement("div"));
      nuevaPagina.addClass("row");
      nuevaPagina.attr("id", "galeria");

      for (var i = ((pag - 1) * elementosPorPagina); i < max ; i++) {
        var link = imagenes[i].link;
        var cuadro = $(document.createElement("cuadro"));
        cuadro.css({"backgroundImage": "url('" + link + "')"});
        cuadro.addClass = "text-center";
        anadirBotones(cuadro);
        cuadro.bind("mouseenter", mostrarBotones);
        cuadro.bind("mouseleave", ocultarBotones);
        nuevaPagina.append(cuadro);
      }

      $("#galeria").replaceWith(nuevaPagina);
    }
  }, onError);
  actualizarIndice($(this));
}

//Pagina anterior
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

//Pagina siguiente
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

//Cambio la forma de almacenar los datos, para mayor facilidad
function comprobarEstructuraDatos() {
  browser.storage.local.get("config").then((config) => {    
    config = config.config ? config.config : new Object();

    if (! config.estructuraActualizada) {
      browser.storage.local.get(null).then((imagenes) => {
        var links = Object.keys(imagenes);
        var imagenesNuevas = [];
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          var imagen = new Object;
          imagen.link = link;
          imagen.descripcion = browser.i18n.getMessage("descripcionPorDefecto");
          imagenesNuevas.push(imagen);
          browser.storage.local.remove(link);
        }
        config.estructuraActualizada = true;

        browser.storage.local.set({ ["imagenes"] : imagenesNuevas });
        browser.storage.local.set({ ["config"] : config });
      })
    }
  })
}

//Levanto la aplicacion
function initialize() {
  comprobarEstructuraDatos();
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