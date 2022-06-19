function createToast(icon, title, message) {
    console.log("Se entra en el toast");

    let toastID = "toast_" + Math.floor(Math.random() * 1000000);

    let toast =
        `<div class="toast show" id="${toastID}" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
              <span class="rounded mr-2 icon">${icon}</span>
              <strong class="mr-auto">${title}</strong>              
              <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="toast-body">
              ${message}
            </div>
          </div>`;

    document.querySelector(".toast_space").insertAdjacentHTML('beforeend', toast);

    /* Funciones de la toast individual */

    // Borrar el Toast al pasar 3 segundos
    setTimeout(function () {
        document.querySelector('.toast').remove();
    }, 3000);

    // Borrar el toast haciendo click
    document.querySelector(`#${toastID} button`).addEventListener("click", function (e) {      
        console.log("toastID: ", toastID);
        e.stopPropagation();
        e.preventDefault();
        document.querySelector(`#${toastID}`).remove();
    });


};