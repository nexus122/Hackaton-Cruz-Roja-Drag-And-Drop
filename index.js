/* Login con Google */
console.log("Se carga el documento");

// Acá Pega el Cliente ID y el API Key que creaste 
var CLIENT_ID = '302566275221-ios2j41f43i8ht25nhp3f83pg682o6ml.apps.googleusercontent.com';
var API_KEY = 'AIzaSyA9mRG50bWF9F0u-ebzkDxadinh3c9jMYQ';

// Cargamos el servicio Rest API de Google 
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// El servicio de Autenticación con una cuenta de Google 
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

// Seleccionamos los botones de Iniciar Sesión y Cerrar Sesión 
var authorizeButton = document.getElementById('autorizar_btn');
var signoutButton = document.getElementById('desconectar_btn');


function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}


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

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        //listFiles(); // Aqui si tienes sesion iniciada o entras pasa algo
        uploadImage();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}


function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
    var pre = document.getElementById('root');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/* Subir imagenes a Google Drive */
function uploadImage(){    
    var fileContent = 'sample text'; // As a sample, upload a text file.

    var file = new Blob([fileContent], { type: 'text/plain' });

    var metadata = {
        'name': 'sampleName', // Filename at Google Drive
        'mimeType': 'text/plain', // mimeType at Google Drive
        'parents': ['### folder ID ###'], // Folder ID at Google Drive
    };

    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = () => {
        console.log(xhr.response.id); // Retrieve uploaded file ID.
    };
    xhr.send(form);
}