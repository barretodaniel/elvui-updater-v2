const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const scraper = require('scrape-it');

/**
 * @type {Electron.BrowserWindow}
 */
let win;

process.on('uncaughtException', function (error) {
  // Handle the error
  app.exit();
});

function createWindow() {
  // Create the browser window
  win = new BrowserWindow({
    width: 800,
    height: 200,
    useContentSize: true,
    minHeight: 164,
    show: false,
    backgroundColor: '#dddddd'
  });

  // and load the index.html of the app
  win.loadURL(url.format({
    pathname: 'localhost:4200',
    protocol: 'http:',
    slashes: true
  }));

  win.setMenu(null);

  // Open the DevTools
  win.webContents.openDevTools();

  win.once('ready-to-show', () => {
    win.show();
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    /*
      Dereference the window object, usually you would store windows
      in an array if your app supports multi windows, this is the time
      when you should delete the corresponding element.
    */

    win = null;
  });


  win.on('unresponsive', function (error) {
    // Handle the error
    console.log(error);
    app.exit();
  });

  win.webContents.on('crashed', function (error) {
    // Handle the error
    console.log(error);
    app.exit();
  });
}

/*
This method will be called when Electron has finished
initialization and is ready to create browser windows.
Some APIs can only be used after this event occurs
*/
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  /*
  On macOS it is common for applications and their menu bar
  to stat active until the user quits explicitly with Cmd + Q
  */
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  /* On macOS it is common to re-create a window in the app when the
  dock icon is clicked and there are no other windows open */
  if (win === null) {
    createWindow();
  }
});

// Put the rest of application code here, in the file or imported and used with requires
ipcMain.on('exit', () => {
  app.quit();
});

ipcMain.on('latestVersion', (event) => {
  console.log('get latest version')
  scraper("https://www.tukui.org/countdown", {
    downloads: { selector: "span.col-xs-12.lj-header-button2.lj-block-center > a:nth-child(2)", attr: 'href' }
  }).then(page => {
    event.sender.send('lastestVersion-reply', 0);
  }).catch(err => {
    console.log(err);
  });
})
