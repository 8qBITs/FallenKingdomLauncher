const { shell, Client, Authenticator } = require('minecraft-launcher-core');
const {app, BrowserWindow,ipcMain, dialog} = require('electron');
const request = require('request');
const host = require('./assets/config/app.json');

const fs = require('fs');
let launchable = true;

const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
let OSname = require("os").userInfo().username;
var path = process.cwd();

if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom`)){
    if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom/modpacks`)){
    }else{
        fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom/modpacks`);
    }
    if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`)){   
    }else{
        fs.writeFileSync(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`,JSON.stringify({email:'undefined', password:'undefined', min:512, max:4096, enableUpdate:'true', console:'false'}));
    }
}else{
    fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom`);
    returnal = undefined;
}

//Pack Grabber
request({
    method:'GET',
    uri:host.all,
    json:true
}, function load(error, response, body) {
    if(error) throw error;
    console.log(body);
    fs.writeFile(`C:/Users/${OSname}/Documents/.FallenKingdom/display.json`, JSON.stringify(body), (err) => {
        if (err) console.log(err);
        console.log("runs");
    });
});


//let launchable = "true";
let mainWindow, consoleW, webBrowser = null;

function createWindow () {

    // Create the browser windows.
    mainWindow = new BrowserWindow({
        frame:false, 
        show:true, 
        width:1300, 
        height:750, 
        backgroundColor:"#2f3640",
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('assets/views/app.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function importSettings(){

    if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom`)){
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom`)){
        }else{
            fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom/modspacks`);
        }
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`)){   
            return JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.FallenKingdom/settings.json', "utf8"));
        }else{
            fs.writeFileSync(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`,JSON.stringify({email:'undefined', password:'undefined', min:512, max:4096, enableUpdate:'true', console:'false'}));
            return undefined;
        }
    }else{
        fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom`);
        return undefined;
    }
    return undefined;
}

function importPacks(){

    if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom`)){
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom`)){
        }else{
            fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom/modspacks`);
        }
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom/packs.json`)){   
            return JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.FallenKingdom/packs.json', "utf8"));
        }else{
            fs.writeFileSync(`C:/Users/${OSname}/Documents/.FallenKingdom/packs.json`,JSON.stringify({packs:"first_run"}));
            return undefined;
        }
    }else{
        fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom`);
        return undefined;
    }
    return undefined;
}

ipcMain.on('launch', (event, args) => {
    if(launchable === false) return console.error('Already Executed \n Ignore this'); 
    let settings = importSettings();
    let packs = importPacks();

    //Data Validation
    if(settings === undefined) return dialog.showErrorBox('No account information found!', 'Please input email & password in config.');
    if(settings.email === undefined) return dialog.showErrorBox('No email found!', 'Please input a valid email in config!');
    if(settings.password === undefined) return dialog.showErrorBox('No password found!', 'Please input a password in config!');
    
    let packName = args[0];

    //Option definition
    if(!packs[packName]){  packs[packName] = { version:'download' }; }else{ packs[packName].version = args[3];}
    let opts;
    //console.log(args);
    if(packs[packName].version === args[3]){
        opts = {
            authorization: Authenticator.getAuth(settings.email, settings.password),
            clientPackage: null,
            root: "C:/Users/"+OSname+"/Documents/.FallenKingdom/modpacks/"+args[0],
            os: "windows",
            version: {
                number: args[1],
                type: "release"
            },
            forge:"C:/Users/"+OSname+"/Documents/.FallenKingdom/modpacks/"+args[0]+"/bin/forge.jar",
            memory: {
                max: settings.max,
                min: settings.min
            }
}    }else{
        //console.log('installing');
        opts = {
            authorization: Authenticator.getAuth(settings.email, settings.password),
            clientPackage: args[2],
            root: "C:/Users/"+OSname+"/Documents/.FallenKingdom/modpacks/"+args[0],
            os: "windows",
            version: {
                number: args[1],
                type: "release"
            },
            forge:"C:/Users/"+OSname+"/Documents/.FallenKingdom/modpacks/"+args[0]+"/bin/forge.jar",
            memory: {
                max: settings.max,
                min: settings.min
            }
        }
        packs[packName].version = args[3];
        packs[packName].key = "none";
    }

    consoleW = new BrowserWindow({
        frame:false, 
        show:false, 
        width:1300, 
        height:700, 
        backgroundColor:"#2f3640",
        webPreferences: {
            nodeIntegration: true
        }
    });

    consoleW.loadFile('assets/views/console.html');

    const launcher = new Client();
        console.log("Launch")
        //console.log(args);
        //console.log(settings);
        launcher.launch(opts);
        mainWindow.webContents.send('launched','true');
        launchable = "false";

        setTimeout(() => {
            fs.writeFile(`C:/Users/${OSname}/Documents/.FallenKingdom/packs.json`, JSON.stringify(packs), (err) => {
                if (err) console.log(err);
                console.log("Running");
                mainWindow.close();
            });
        },2000);

        if(settings.console == 'true'){
            consoleW.show();
        }

    launcher.on('close',() => {
        consoleW.webContents.send('console-output', 'Minecraft terminated');
        consoleW.close();
    });
    launcher.on('debug', (e) => {
        console.log(e)
        consoleW.webContents.send('console-output', e);    

    });
    launcher.on('data', (e) => {
        console.log(e.toString('utf-8'))
        consoleW.webContents.send('console-output', e.toString('utf-8'));    

    });
    launcher.on('error', (e) => {
        console.log(e.toString('utf-8'))
        consoleW.webContents.send('console-output', e.toString('utf-8'));    

    });
});

/**
 * AUTOUPDATER
 * Uses github to Update The Software
 * Repo gets read from package.json
 */

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function sendStatusToWindow(text) {
    log.info(text);
    ipcMain.on('message', function (event, text) {
        addItem(args); // we don't care process
        event.sender.send("message", text);
    })
}

// Logging to Log file at: C:\Users\<USER>\AppData\Roaming\FallenKingdom\log.log
autoUpdater.on('checking-for-update', () => { sendStatusToWindow('Checking for update...'); });
autoUpdater.on('update-available', () => { sendStatusToWindow('Update available.'); });
autoUpdater.on('update-not-available', () => { sendStatusToWindow('Update not available.'); });
autoUpdater.on('error', (err) => { sendStatusToWindow('Error in auto-updater. ' + err); });
autoUpdater.on('download-progress', (progressObj) => {

    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', () => {
    fs.writeFileSync(`C:/Users/${OSname}/Documents/.FallenKingdom/version.json`,JSON.stringify({read:"true"}));
    mainWindow.webContents.send("Update-Found",'true')
    
    //Looks for the Settings file if none is generated create and read it 
    let settings;

    if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom`)){ // Validate Existencs of Folder
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`)){ // Validate Existencs of settings.json
            settings = JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.FallenKingdom/settings.json', "utf8"));
        }else{
            // Create Default Settings.json if not Existing
            fs.writeFileSync(`C:/Users/${OSname}/Documents/.FallenKingdom/settings.json`,JSON.stringify({email:'undefined', password:'undefined', min:512, max:4096, enableUpdate:'true', console:'false'}));
        }
    }else{
        // Create Folder if Not Existing
        fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom`);
    }

    if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom`)){ // Validate Existencs of Folder
        if(fs.existsSync(`C:/Users/${OSname}/Documents/.FallenKingdom/packs.json`)){ // Validate Existencs of settings.json
            settings = JSON.parse(fs.readFileSync('C:/Users/'+OSname+'/Documents/.FallenKingdom/packs.json', "utf8"));
        }else{
            // Create Default Settings.json if not Existing
            fs.writeFileSync(`C:/Users/${OSname}/Documents/.FallenKingdom/packs.json`,JSON.stringify({packs:"first_run"}));
        }
    }else{
        // Create Folder if Not Existing
        fs.mkdirSync(`C:/Users/${OSname}/Documents/.FallenKingdom`);
    }

    //Validate the settings file
    if(settings != undefined){
        //look if the user enabled auto updating
        if(settings.enableUpdate === "true"){
            dialog.showMessageBox(dialogOpts, (response) => {
                autoUpdater.quitAndInstall();
            });
        }else{
            return;
        }
    }else{
        return;
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () =>{ 
    createWindow(); 
    autoUpdater.checkForUpdates();
});
// Quit when all windows are closed.
app.on('window-all-closed', function () { app.quit(); });
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) { createWindow(); }
});