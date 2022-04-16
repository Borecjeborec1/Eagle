
// @ts-expect-error
const TAURI_WINDOW = window.__TAURI__.window

export class Tauri {
  constructor() {
  }
  public async setSize({ width, height }: { width: number, height: number }) {
    let monitor = await TAURI_WINDOW.primaryMonitor()
    if (!width && !height) {
      width = monitor.size.width
      height = monitor.size.height
    }
    TAURI_WINDOW.appWindow.setSize(new TAURI_WINDOW.LogicalSize(width, height))
    TAURI_WINDOW.appWindow.setPosition(new TAURI_WINDOW.LogicalPosition((monitor.size.width - width) / 2, (monitor.size.height - height) / 2))
  }

}