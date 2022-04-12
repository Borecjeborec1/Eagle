async function main() {
  let monitor = await window.__TAURI__.window.primaryMonitor()
  window.__TAURI__.window.appWindow.setPosition(new window.__TAURI__.window.LogicalPosition((monitor.size.width - 400) / 2, (monitor.size.height - 200) / 2))
}

main()