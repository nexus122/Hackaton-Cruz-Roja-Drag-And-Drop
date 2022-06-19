// Cliente ID y el API Key
let CLIENT_ID = '302566275221-ios2j41f43i8ht25nhp3f83pg682o6ml.apps.googleusercontent.com';
let API_KEY = 'AIzaSyA9mRG50bWF9F0u-ebzkDxadinh3c9jMYQ';

// Cargamos el servicio Rest API de Google 
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// El servicio de Autenticación con una cuenta de Google 
let SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

// Seleccionamos los botones de Iniciar Sesión y Cerrar Sesión 
let authorizeButton = document.getElementById('autorizar_btn');
let signoutButton = document.getElementById('desconectar_btn');

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
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}


function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
}

function handleSignoutClick(event) {    
    gapi.auth2.getAuthInstance().signOut();    
}

function appendPre(message) {
    let pre = document.getElementById('root');
    let textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}