//Menu Principal (calificar, contacto, etc...)
function cargarMenuPrincipal() {
  $("#linkCalificarExtension").attr("title", browser.i18n.getMessage("linkCalificarExtension"));
  $("#linkContacto").attr("title", browser.i18n.getMessage("linkContactoTexto"));
  $("#linkContacto").parent().attr("href", browser.i18n.getMessage("linkContactoUrl"));
}

//Levanto la aplicacion
function initialize() {
  cargarMenuPrincipal();
}

var Menu = { initialize: initialize }

//Cargo el html y inicializo
$("#app").load("listadoImagenes.html",function(responseTxt, statusTxt, xhr){ Listado.initialize() });
Menu.initialize();


// ------------------------------------ JavaScript para formulario de edicion ------------------------------------
