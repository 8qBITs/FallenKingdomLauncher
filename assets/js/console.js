let { ipcRenderer } = require("electron");
let list = document.getElementById('consoleOutput');

function scrollToBottom(id){
        var div = document.getElementById(id);
        div.scrollTop = div.scrollHeight - div.clientHeight;
}
ipcRenderer.on('console-output', (event, args) => {
        let modItem = document.createElement("li");
        let modTitle = document.createTextNode(args);

        modItem.appendChild(modTitle);
        list.appendChild(modItem);
        scrollToBottom('ul-div');
});
