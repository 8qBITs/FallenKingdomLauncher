const fs = require('fs');

let { ipcRenderer } = require("electron");
let OSname = require("os").userInfo().username;

let settings;

if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom`)){
    if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`)){   
        settings = JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.FallenKingdom/settings.json', "utf8"));
    }else{
        fs.writeFileSync(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`,JSON.stringify({email:'undefined', password:'undefined', min:512, max:4096, enableUpdate:'true', console:'false'}));
    }
}else{
    fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom`);
}

function testIfSettingsValid(s){ return typeof(s); }

ipcRenderer.on('Update-Found', () => {
    let button = document.createElement('button'); 
    button.innerHTML = "Update Verfügbar"; 
    button.classList.add('modItem');
    button.setAttribute("id","update");

    button = document.getElementById('update');
    button.addEventListener('click', () => {
        
    })
});

let s_status = testIfSettingsValid(settings);
if(s_status === undefined){
    console.log('not defined');
    location.reload();
}else{
    settings = JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.FallenKingdom/settings.json', "utf8"));

    let store_btn = document.getElementById('submit');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let s_ram = document.getElementById('min-ram');
    let x_ram = document.getElementById('max-ram');
    let s_patcher = "true";
    let s_console = "true";
    
    email.value = settings.email;
    password.value = settings.password;
    s_ram.value = settings.min;
    x_ram.value = settings.max;
    s_patcher.value = settings.enableUpdate;
    s_console.value = settings.console;

    store_btn.addEventListener('click', () => {
        settings.email = email.value;
        settings.password = password.value;
        settings.min = s_ram.value;
        settings.max = x_ram.value;
        settings.enableUpdate = "true";
        settings.console = s_console.value;

        fs.writeFile(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`, JSON.stringify(settings), (err) => {
            if (err) console.log(err)
        });
    })
}
