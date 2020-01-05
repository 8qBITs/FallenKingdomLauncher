let { remote,ipcRenderer } = require("electron");

let btn_close = document.getElementById('btn_close');
let btn_mini = document.getElementById('btn_mini');
let ul_modslist = document.getElementById('modList');

btn_close.addEventListener('click', () => { window.close(); app.quit(); });
btn_mini.addEventListener('click', () => { remote.getCurrentWindow().minimize(); });