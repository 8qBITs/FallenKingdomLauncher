let { ipcRenderer } = require("electron");

let btn_close = document.getElementById('btn_close');
let ul_modslist = document.getElementById('modList');

btn_close.addEventListener('click', () => { window.close(); app.quit(); });