
// @ts-expect-error
const TAURI_WINDOW = window.__TAURI__.window

export class Tauri {
  small: {
    width: number
    height: number
  }
  constructor() {
    this.small = {
      width: 400,
      height: 200
    }

  }
  spawnWindow({ fullScreen = false }) {
    if (fullScreen)
      return this.spawnFullScreen()
    return this.spawnSmall()
  }

  async spawnSmall() {
    let { size } = await TAURI_WINDOW.primaryMonitor()
    TAURI_WINDOW.appWindow.setSize(new TAURI_WINDOW.LogicalSize(this.small.width, this.small.height))
    TAURI_WINDOW.appWindow.setPosition(new TAURI_WINDOW.LogicalPosition((size.width - this.small.width) / 2, (size.height - this.small.height) / 2))
  }
  async spawnFullScreen() {
    let { size } = await TAURI_WINDOW.primaryMonitor()
    TAURI_WINDOW.appWindow.setSize(new TAURI_WINDOW.LogicalSize(size.width, size.height))
    TAURI_WINDOW.appWindow.setPosition(new TAURI_WINDOW.LogicalPosition(0, 0))
  }
}