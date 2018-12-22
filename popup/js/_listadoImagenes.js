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
  mostrarMensajeCopiado(link);
}

//Elimina la imagen de la coleccion
function eliminarImagen(){
  var link = this.link;

  browser.storage.local.get("imagenes").then((imagenes) => {
    imagenes = imagenes.imagenes ? imagenes.imagenes : [];

    imagenes = imagenes.filter(imagen => imagen.link != link);

    browser.storage.local.set({ ["imagenes"] : imagenes }).then((result) =>{
      $(".page-item.active")[0].firstChild.onclick();
      mostrarMensajeEliminacion();
    });

  })
}

//Oculta las acciones adicionales (ver, editar, etc)
function ocultarMenuBotones() {
  $("#menuBotones").addClass("d-none");
}

//Abre la imagen en nueva pestaña
function verImagen(){
  browser.tabs.create({ url: this.link }).catch((result) => {
    var title = browser.i18n.getMessage("errorVerImagenTitulo");
    var content = browser.i18n.getMessage("errorVerImagenContenido");
    browser.notifications.create(this.link,{
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/error.png"),
      "title": title,
      "message": content,
      "eventTime": 3000
    })
    .then((id) =>{
      setTimeout(function(){
        browser.notifications.clear(id);
      }, 3000)
    });
  }); 
}

//Descarga imagen
function descargarImagen() {
  try{
    browser.downloads.download({"url": this.link}).catch((result) => {
      if (result.message != "Download canceled by the user") {
        mostrarMensajeErrorDescargarImagen(); 
      }
    }); 
  }catch (error){
    mostrarMensajeErrorDescargarImagen();
  }
}

//Carga el formulario para editar una imagen
function cargarPagEditarImagen() {
  var link = this.link;
  $("#app").load("formularioEditarImagen.html", function(responseTxt, statusTxt, xhr){ 
    $("#botonGuardarEdicion").prop("link", link);
    FormularioEditarImagen.initialize()
  }); 
}

//Muestra las acciones adicionales (ver, editar, etc)
function mostrarMenuBotones() {
  $("#botonVer").prop("link", this.link);
  $("#botonDescargar").prop("link", this.link);
  $("#botonEditar").prop("link", this.link);
  $("#menuBotones").removeClass("d-none");
}

//Muestra un mensaje en caso de que no pueda realizarse la descarga
function mostrarMensajeErrorDescargarImagen(params) {
  var title = browser.i18n.getMessage("errorDescargarImagenTitulo");
  var content = browser.i18n.getMessage("errorDescargarImagenContenido");
  browser.notifications.create(this.link,{
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/error.png"),
    "title": title,
    "message": content,
    "eventTime": 3000
  })
  .then((id) =>{
    setTimeout(function(){
      browser.notifications.clear(id);
    }, 2500)
  });
}

//Muestra que se guardo el link en el portapapeles correctamente
function mostrarMensajeCopiado(link){
  var title = browser.i18n.getMessage("copiadoCorrectoTitulo");
  var content = browser.i18n.getMessage("copiadoCorrectoContenido");
  browser.notifications.create(link,{
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/copy.png"),
    "title": title,
    "message": content,
    "eventTime": 1000
  })
  .then((id) =>{
    setTimeout(function(){
      browser.notifications.clear(id);
    }, 2500)
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
  })
  .then((id) =>{
    setTimeout(function(){
      browser.notifications.clear(id);
    }, 2500)
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

  var botonEliminar = $(document.createElement("button"));
  botonEliminar.html(browser.i18n.getMessage("botonEliminar"));
  botonEliminar.prop("link", link);
  botonEliminar.css({"marginTop": "2px", "marginBottom": "2px"});
  botonEliminar.bind("click", eliminarImagen);
  botonEliminar.addClass("btn btn-danger btn-sm");

  var botonMas = $(document.createElement("button"));
  botonMas.html(browser.i18n.getMessage("botonMas"));
  botonMas.prop("link", link);
  botonMas.bind("click", mostrarMenuBotones);
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
    var textoBuscado = $("#buscador").val();
    
    imagenes = imagenes.imagenes 
      ? imagenes.imagenes.filter(img => img.descripcion.toLowerCase().includes(textoBuscado.toLowerCase()))
      : [];
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
    var textoBuscado = $("#buscador").val();

    imagenes = imagenes.imagenes 
      ? imagenes.imagenes.filter(img => img.descripcion.toLowerCase().includes(textoBuscado.toLowerCase())) 
      : [];
    
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
        var imagen = imagenes[i];
        var cuadro = $(document.createElement("cuadro"));
        cuadro.css({"backgroundImage": "url('" + imagen.link + "')"});
        cuadro.attr("title", imagen.descripcion)
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
  var pagina = $( $(".page-item.active")[0].firstChild );
  if (pagina.html() != "1") {
    var paginas = $(".page-link");
    var num = parseInt(pagina.html()) - 1;
    for (var i = 1; i < paginas.length - 1; i++) {
      if (parseInt(paginas[i].innerHTML) == num) {
        paginas[i].click();
        break;
      }
    }
  }
}

//Pagina siguiente
function paginaSiguiente(){
  var pagina = $( $(".page-item.active")[0].firstChild );
  var paginas = $(".page-link");
  var num = parseInt(pagina.html()) + 1;
  for (var i = 1; i < paginas.length - 1; i++) {
    if (parseInt(paginas[i].innerHTML) == num) {
      paginas[i].click();
      break;
    }
  }
}

//Reinicia los numeros de las paginas y dispara la busqueda por los valores ingresados
function busqueda(){
  $("#anterior2").html("1");
  $("#anterior1").html("2");
  $("#medio").html("3");
  $("#siguiente1").html("4");
  $("#siguiente2").html("5");

  $("#anterior2").click();
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
        browser.storage.local.set({ ["config"] : config }).then((resultado) => { cargarPaginado() });
      })
    }
  })
}

//Menu de botones (accion mas...)
function cargarMenuBotones() {
  $("#botonOcultarMenuBotones").bind("click", ocultarMenuBotones);
  $("#encabezadoMenuBotones").html(browser.i18n.getMessage("encabezadoMenu"));

  $("#botonVer").html(browser.i18n.getMessage("botonVer"));
  $("#botonVer").bind("click", verImagen);

  $("#botonEditar").html(browser.i18n.getMessage("botonEditar"));
  $("#botonEditar").bind("click", cargarPagEditarImagen);

  $("#botonDescargar").html(browser.i18n.getMessage("botonDescargar"));
  $("#botonDescargar").bind("click", descargarImagen);
}

//Asigna funciones al indice y carga la primer pag
function cargarPaginado() {
  $("#buscador").bind("keyup", busqueda)
  $("#buscador").attr("placeholder", browser.i18n.getMessage("placeholderBuscador"))

  $("#anterior2").bind("click", cambiarPagina);
  $("#anterior1").bind("click", cambiarPagina);
  $("#medio").bind("click", cambiarPagina);
  $("#siguiente1").bind("click", cambiarPagina);
  $("#siguiente2").bind("click", cambiarPagina);
  $("#anterior").bind("click", paginaAnterior);
  $("#siguiente").bind("click", paginaSiguiente);

  $("#anterior2").click();
}

//Levanto la aplicacion
function initialize() {
  comprobarEstructuraDatos();
  cargarMenuBotones();
  cargarPaginado();
}

var Listado = { "initialize": initialize }