const SMALL_WIDTH = 400
const SMALL_HEIGHT = 200
const TAURI_WINDOW = window.__TAURI__.window
async function main() {

  let monitor = await TAURI_WINDOW.primaryMonitor()
  TAURI_WINDOW.appWindow.setSize(new TAURI_WINDOW.LogicalSize(SMALL_WIDTH, SMALL_HEIGHT))
  TAURI_WINDOW.appWindow.setPosition(new TAURI_WINDOW.LogicalPosition((monitor.size.width - 400) / 2, (monitor.size.height - 200) / 2))
}

main()