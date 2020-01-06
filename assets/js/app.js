let { ipcRenderer } = require("electron");
var path = process.cwd();
const fs = require('fs');
let OSname = require("os").userInfo().username;

//HtmlToJs Definition
let body = document.getElementById('modLayout');
let title = document.getElementById('modHeader');
let btn_launch = document.getElementById('launch');
let btn_key = document.getElementById('key');
let modbody = document.getElementById('modLayout');

let selected;
let pack_list = JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.FallenKingdom/display.json', "utf8"));

console.log(pack_list);

//Button Controller
selected = (0);
for(let i = 0; i < pack_list.length; i++){
    let modItem = document.createElement("li");
    let modIcon = document.createElement("img");
    let modTitleTag = document.createElement("h2");
    let modTitle = document.createTextNode(pack_list[i].name);
    let ul_modslist = document.getElementById('modList');

    modItem.addEventListener('click', () => {
        selected = modItem.dataset.mp_id;
        modbody.innerHTML = "<h2>"+pack_list[selected].name+"</h2>"+"<small style=\"color: white;\">Pack Version: v"+pack_list[selected].packVersion+"</small><br><small style=\"color: white;\">Recommended Ram: "+pack_list[selected].recommended+" MB</small><br><hr><br>"+pack_list[selected].launcherBody;
        console.log(selected);
    });

    modTitleTag.style.color = 'white';
    modIcon.src = pack_list[i].imageLink;
    modIcon.width = 50;
    modIcon.height = 50;

    modTitleTag.appendChild(modTitle);
    modItem.appendChild(modIcon);
    modItem.appendChild(modTitleTag);
    ul_modslist.appendChild(modItem);
    modItem.classList.add('modItem');
    modItem.setAttribute("id","mp");
    modItem.dataset.mp_id = i;

    modbody.innerHTML = "<h2>"+pack_list[selected].name+"</h2>"+"<small style=\"color: white;\">Pack Version: v"+pack_list[selected].packVersion+"</small><br><small style=\"color: white;\">Recommended Ram: "+pack_list[selected].recommended+" MB</small><br><hr><br>"+pack_list[selected].launcherBody;  
}
  
//Launches the Instance
btn_launch.addEventListener('click', (e) => { ipcRenderer.send('launch',[pack_list[selected].name, pack_list[selected].gameVersion, pack_list[selected].packLink, pack_list[selected].packVersion]);});
btn_key.addEventListener('click', (e) => { ipcRenderer.send('inputCode',"true"); });  
