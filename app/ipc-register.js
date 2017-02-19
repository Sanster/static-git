const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const BrowserWindow = require('electron').BrowserWindow

ipc.on('open-file-dialog', function (event) {
  const window = BrowserWindow.fromWebContents(event.sender)
  dialog.showOpenDialog(window, {
    properties: ['openDirectory']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
})

ipc.on('open-info-dialog', function (event, msg) {
  const options = {
    type: 'info',
    title: 'Information',
    message: msg,
    buttons: ['Ok']
  }
  dialog.showMessageBox(options)
})
