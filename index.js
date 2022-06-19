/* Selectores */
const input = document.querySelector('input[type="file"]');
const dragAndDrop = document.querySelector('.drag-and-drop');
const dragTitle = document.querySelector('.drag-and-drop-title');
const files = document.querySelector('.files');

/* Variables globales */
let file = [];

/* Envio de Formulario */
document.querySelector("form").addEventListener("submit", function (e) {  
  e.preventDefault();
  e.stopPropagation();

  if (file.length == 0){
    createToast(`<i class="fa-solid fa-exclamation-triangle"></i>`, "No has seleccionado ningun archivo", "Por favor, selecciona un archivo para subir");
    return;
  }

  // Recorremos los archivos y los volvemos a subir
  file.forEach(element => {
    insertFile(element);
  });
  insertFile(file);
});

/* EVENTOS */
// Dragover: Cuando el elemento que arrastras esta encima del elemento que recibe el evento
dragAndDrop.addEventListener("dragover", function (e) {
  e.preventDefault();
  e.stopPropagation();

  dragTitle.innerHTML = "Suelta el Archivo";
});

// Drop: Cuando sueltas el elemento dentro del div.
dragAndDrop.addEventListener("drop", function (e) {
  e.preventDefault();
  e.stopPropagation();

  // Hacemos un bucle para guardar en un array todos los archivos
  let largo = e.dataTransfer.files.length;
  for (let i = 0; i < largo; i++) {
    if (file.some((f) => f.name.includes(e.dataTransfer.files[i].name))) continue;
    file.push(e.dataTransfer.files[i]);
  }

  console.log("Arr File = ", file);
  draw();

  if(file.length > 0) createToast(`<i class="fa-solid fa-file"></i>`, "Se han cargado tus archivos", "Los archivos se han cargado correctamente");

  dragTitle.innerHTML = "Arrastra Tus Archivos AQUI";
});

// Cuando haces click en el area de arrastrar archivos
dragAndDrop.addEventListener("click", function (e) {
  e.stopPropagation();
  e.preventDefault();
  // Fingimos un click en el input para que se abra
  if (file.length != 0) return;
  input.click();
})

// Cuando nos cambia el contenido del input
input.addEventListener("change", function (e) {
  e.preventDefault();
  e.stopPropagation();
  let tempFiles = input.files;
  console.log("Temp Files => ", tempFiles);


  let largo = tempFiles.length;
  for (let i = 0; i < largo; i++) {
    file.push(tempFiles[i]);
  }
  draw();

  if(file.length > 0) createToast(`<i class="fa-solid fa-file"></i>`, "Se han cargado tus archivos", "Los archivos se han cargado correctamente");

})

/* Funciónes Generales */

// Dibujar nombre de archivos
function draw() {
  dragTitle.style.display = "none";

  // Limpiamos el area de archivos
  files.innerHTML = "";

  // Recorremos el array de archivos
  file.forEach((element, index) => {    
    // Escribimos el nombre junto a un icono de borrar el archivo
    files.innerHTML += `<p onclick="deleteFile(${index})" id="file_${index}" class="file_line">${element.name} - <span class="icon_delete"><i class="fa-solid fa-trash-can"></i></span></p>`;
  })

  // Si no quedan archivos volvemos a mostrar el titulo
  if(file.length == 0) dragTitle.style.display = "block";    
}

// Podemos borrar un fila del array
function deleteFile(fileId) {
  console.log("Entramos en borrar");
  file = file.filter((element, index) => {
    if (index != fileId) return element;
  })
  console.log(file);
  draw();
  createToast(`<i class="fa-solid fa-trash"></i>`, "Has eliminado el archivo", "El archivo ha sido eliminado correctamente");
}

/* Subir imagenes a Google Drive */
function insertFile(fileData, callback) {
  // Configuración 
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  let reader = new FileReader();
  
  try {
    reader.readAsBinaryString(fileData);
  } catch (e) { }

  reader.onload = function (e) {
    let contentType = fileData.type || 'application/octet-stream';
    let metadata = {
      'title': fileData.fileName || fileData.name,
      'mimeType': contentType
    };

    let base64Data = btoa(reader.result);
    let multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + contentType + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n' +
      '\r\n' +
      base64Data +
      close_delim;

    let request = gapi.client.request({
      'path': '/upload/drive/v2/files',
      'method': 'POST',
      'params': { 'uploadType': 'multipart' },
      'headers': {
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
    });
    if (!callback) {
      callback = function (file) {
        createToast(`<i class="fa-solid fa-arrow-up-from-line"></i>`, `Se ha subido tu archivo`, `El archivo ${fileData.fileName || fileData.name} se ha subido correctamente a tu cuenta de google drive` );
      };
    }
    request.execute(callback);
  }
}
