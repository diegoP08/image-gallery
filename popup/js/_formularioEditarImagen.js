function cancelarCambios() {
  $("#app").load("listadoImagenes.html",function(responseTxt, statusTxt, xhr){ Listado.initialize() });
}

function guardarCambios() {
  var link = this.link;
  var descripcion = $("#descripcion").val();
  browser.storage.local.get("imagenes").then((imagenes) => {
    imagenes = imagenes.imagenes ? imagenes.imagenes : [];

    var indice = imagenes.findIndex(img => img.link == link);

    if (indice != -1) {
      imagenes[indice].descripcion = descripcion;
      browser.storage.local.set({ ["imagenes"] : imagenes }).then((result) =>{
        $("#botonCancelarEdicion").click();
      });
    }else{
      $("#botonCancelarEdicion").click();
    }
  })
}

function initialize(){
  $("#labelDescripcion").html(browser.i18n.getMessage("labelDescripcion"));
  $("#botonGuardarEdicion").html(browser.i18n.getMessage("botonGuardarEdicion"));
  $("#botonCancelarEdicion").html(browser.i18n.getMessage("botonCancelarEdicion"));

  $("#botonGuardarEdicion").bind("click", guardarCambios);
  $("#botonCancelarEdicion").bind("click", cancelarCambios);

  var link = $("#botonGuardarEdicion")[0].link;
  
  browser.storage.local.get("imagenes").then((imagenes) => {
    imagenes = imagenes.imagenes ? imagenes.imagenes : [];
    
    var imagen = imagenes.find(img => img.link == link);
    if (imagen) {
      $("#descripcion").val(imagen.descripcion);
    }else{
      $("#botonCancelarEdicion").click();
    }
  })
}

var FormularioEditarImagen = { initialize: initialize }