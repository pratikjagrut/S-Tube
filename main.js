const electron = require('electron')
const url = require('url')
const path = require('path')

const{app, BrowserWindow, Menu} = electron;

//set env
process.env.NODE_ENV = 'production';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let aboutwindow
function createWindow () {
  // Create the browser window.
  if(process.env.NODE_ENV !== 'production')
  {
    win = new BrowserWindow({
    width: 1000, 
    height: 600, 
    })
  }
  else
  {
    win = new BrowserWindow({
    width: 1000, 
    height: 600,
    webPreferences: {
    devTools: false
    } 
    }) 
  }

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  //Build menu from template 
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert menu
  Menu.setApplicationMenu(mainMenu);

  win.on('closed', function(){
    app.quit()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
//handles add window or createaddwindow
function createAboutWindow(){
  //create new window
  aboutWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    title: 'About Application',
  });
  //Load html into window
  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'about.html'),
    protocol: 'file:',
    slashes: true
  }));
  //Garbage collection
  aboutWindow.on('close', function(){
    aboutwindow = null; 
  });
}

//Menu Template
const mainMenuTemplate = [
{
  label: 'Menu',
  submenu:[
  {
    label: 'Home',
    click(){
      if(aboutwindow != null){
        aboutwindow.close()
      }
      createWindow()
    }
  },
  {  
    label: 'About App',
    click(){
      createAboutWindow()
    }
  },
  {  
    type: 'separator'
  },
  {
    label: 'Exit',
    click(){
      app.quit()
    }
  }
  ]
}
]
//If mac, add empty objects to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

//Add developer tools if not in production
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developers Tools',
    submenu:[
    {
      label: 'Toggle DevTools',
      accelerator: process.platform == 'darwin' ? 'Command+I' :
      'Ctrl+I',
      click(item, focusedWindow){
        focusedWindow.toggleDevTools();
      }
    },
    {
      role: 'reload'
    }
    ]
  });
}