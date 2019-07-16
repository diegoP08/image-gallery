//Error para la funcion "Promise" 
function onError(e){
  console.error(e);
}

// Opcion del menu contextual
browser.contextMenus.create({
    id: "guardar-elemento",
    title: browser.i18n.getMessage("menuDeContexto"),
    contexts: ["image"]
});

//Guarda el link del elemento en la base de datos
function guardarLinkElemento(link){
  browser.storage.local.get("imagenes").then((imagenes) => {
    imagenes = imagenes.imagenes ? imagenes.imagenes : [];

    //Compruebo unicidad
    if (imagenes.find(imagen => imagen.link === link)) {
      return;
    }

    var imagen = new Object();
    imagen.link = link;
    imagen.descripcion = browser.i18n.getMessage("descripcionPorDefecto");

    imagenes.push(imagen);

    browser.storage.local.set({ ["imagenes"] : imagenes })

  })
};

//Muestra que se guardo el link en la biblioteca correctamente
function mostrarMensaje(link){
  var title = browser.i18n.getMessage("guardadoCorrectoTitulo");
  var content = browser.i18n.getMessage("guardadoCorrectoContenido");
  browser.notifications.create(link,{
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/add.png"),
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

//Escucha los click del menu contextual
browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "guardar-elemento":
      guardarLinkElemento(info.srcUrl)
      mostrarMensaje(info.srcUrl)
      break;
  }
})

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

comprobarEstructuraDatos()
