import { UI } from "./ui.js";

window.addEventListener('load', () => {
    // Adds Service Worker.
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }
    // Creates the User Interface.
    new UI();
});
