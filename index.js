/* Login con Google */
console.log("Se carga el documento");

// Acá Pega el Cliente ID y el API Key que creaste 
let CLIENT_ID = '302566275221-ios2j41f43i8ht25nhp3f83pg682o6ml.apps.googleusercontent.com';
let API_KEY = 'AIzaSyA9mRG50bWF9F0u-ebzkDxadinh3c9jMYQ';

// Cargamos el servicio Rest API de Google 
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Da permisos al usuario para hacer una serie de cosas, por ejemplo subir archivos.
const SCOPES = "https://www.googleapis.com/auth/drive";

// Seleccionamos los botones de Iniciar Sesión y Cerrar Sesión 
let authorizeButton = document.getElementById('autorizar_btn');
let signoutButton = document.getElementById('desconectar_btn');

/* Conexion con cuenta de google ! */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/* Definimos los parametros de la petición */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {

        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/* Actualizamos la interfaz de iniciar sesion */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';        
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/* Capturar el evento click de entrar */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/* Capturar el evento click de salir */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/*
    function appendPre(message) {
        let pre = document.getElementById('root');
        let textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
    }
*/

/* Subir imagenes a Google Drive */
function insertFile(fileData, callback) {
    /* Cosas de Google Drive */
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    /* Creamos un objeto y le pasamos la info de nuestro archivo subido */
    let reader = new FileReader();
    reader.readAsBinaryString(fileData);    

    /* Obtenemos información del archivo */
    reader.onload = function (e) {
        let contentType = fileData.type || 'application/octet-stream';        
        
        let metadata = {
            'title': fileData.name,
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

        /* En caso de no definir un callback se utiliza el por defecto */
        if (!callback) {
            callback = function (file) {
                console.log(file);
            };
        }
        request.execute(callback);
    }
}

/* Capturamos el evento submit y llamamos a la función de subir archivos.*/
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    let num_files = document.querySelector("input[type=file]").files.length;
    for (let i = 0; i < num_files; i++) {
        let file = document.querySelector("input[type=file]").files[i];
        insertFile(file, callbackToast("Archivos subidos correctamente"));
    }
});

/* Callback Toast */
function callbackToast(message) {
    let toast = document.getElementById("toast");
    toast.innerHTML = message;
    toast.className += " show";

    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);

};