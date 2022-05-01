// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const remote = require('@electron/remote')
const {ipcRenderer} = require('electron')

currWindow = remote.getCurrentWindow();
function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
function submitButtonHit() {
  if (isValidHttpUrl(document.getElementById('url').value)) {
      ipcRenderer.send('openWindow', document.getElementById('url').value)
      currWindow.close()
	  
    

  } else {
    document.getElementById('message').innerHTML = "Invaild URL, try it again!"	  
  }
}


