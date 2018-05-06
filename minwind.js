
const {app, Menu, Tray, globalShortcut, BrowserWindow} = electron = require('electron')
const Config = require('electron-config');
const config = new Config();

let wnd = null;

app.on('ready', () => {
  // Create window.
  wnd = new BrowserWindow({
    width: 585, 
    height: 43,
    show: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true
  });

  // Load html.
  wnd.loadURL('file://' + __dirname + '/index.html');

  wnd.setMenu(null);

  // DEBUG:
  // wnd.webContents.openDevTools();

  // Load and apply config.
  loadConfig();

  var tray = new Tray("./icon.png");
  tray.setContextMenu(
    Menu.buildFromTemplate([
        { label: "Exit", click: function () { exitApp(); } }
    ])
  );
  tray.on("click", function () {
    showWindow();
  });
});

app.on('will-quit', function () {
  unregisterShortcut();
  wnd = null;
})

function toggleVisibility() {
  if(wnd.isVisible()) {
    hideWindow();
  } else {
    showWindow();
  }
}

function setConfigDefault() {
  if(getSystemConfig("shortcut") === undefined) {
    setSystemConfig("shortcut", 'ctrl+up');
  }
  if(getSystemConfig("opacity") === undefined) {
    setSystemConfig("opacity", "1.0");
  }
}

function unregisterShortcut() {
  globalShortcut.unregisterAll()
}

function registerShortcut() {
  globalShortcut.register(getSystemConfig("shortcut"), function () {
    toggleVisibility();
  })
}

function applyConfig() {
  wnd.setOpacity(parseFloat(getSystemConfig("opacity")));
  unregisterShortcut();
  registerShortcut();
}

function loadConfig() {
  setConfigDefault();
  applyConfig();
}

function getConfig(key) {
  return config.get(key);
}

function setConfig(key, val) {
  console.log("set config key=" + key + " , val=" + val);
  config.set(key, val);
  applyConfig();
}

function setSystemConfig(key,val) {
  setConfig("system." + key, val);
}

function getSystemConfig(key) {
  return getConfig("system." + key);
}

function setUserConfig(key,val) {
  setConfig("user." + key, val);
}

function getUserConfig(key) {
  return getConfig("user." + key);
}

function hideWindow() {
  wnd.hide();
}

function showWindow() {
  wnd.show();
}

function isCmd(str) {
  var splitted = str.split(" ");
  return (splitted.length > 0) && (splitted[0].slice(0,1) === "@");
}

function parseCmd(str) {
  var splitted = str.split(" ");
  var cmd = splitted[0].trim().substr(1);
  var param = (splitted.slice(1).join(" ")).split("=").map(function(e) { return e.trim();});

  return {cmd : cmd, param : param};
}

function execCmd(compiled) {
  var cmd = compiled.cmd;
  var param = compiled.param;

  console.log(cmd, param);

  switch (cmd){
    case "set":
      setUserConfig(param[0], param[1]);
      break;
    case "config":
      setSystemConfig(param[0], param[1]);
      break;
    case "clear":
      clearConfig();
      break;
    case "exit":
      exitApp();
      break;
  }
}

function procInput(str) {
  if(isCmd(str)) {
    execCmd(parseCmd(str));
  } else {
    startProc(str);
  }
}

function startProc(cmdStr) {
  console.log("command [" + cmdStr + "]");
  const exec = require('child_process').exec;

  var cmd = cmdStr;
  var cnf = config.get("user." + cmdStr);
  if(cnf !== undefined) {
    cmd = cnf;
  }

  exec("start " + cmd, (err, stdout, stderr) => {
    if (err) { 
      console.log(err); 
    }
    console.log(stdout);
  });
}

function clearConfig() {
  config.delete('user');
}

function exitApp() {
  app.quit();
}

exports.procInput = procInput;

exports.setSystemConfig = setSystemConfig;

exports.getSystemConfig = getSystemConfig;

exports.setUserConfig = setUserConfig;

exports.getUserConfig = getUserConfig;

exports.hideWindow = hideWindow;

exports.startProc = startProc;

exports.clearConfig = clearConfig;

exports.exitApp = exitApp;

