
// @ts-expect-error
const TAURI = window.__TAURI__
const TAURI_WINDOW = TAURI.window

export class Tauri {
  isDev: boolean = false
  constructor() {
    this.isDev = true
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
  public async readConfig(): Promise<string> {
    let config = await TAURI.fs.readTextFile("C:/Users/ZISU00/Desktop/Projects/Projects/JavaScript/Backend/desktop/Eagle_PC_Resting/config/config.json")
    return config
  }
  public async writeConfig(config: string): Promise<void> {
    await TAURI.fs.writeFile({ path: "C:/Users/ZISU00/Desktop/Projects/Projects/JavaScript/Backend/desktop/Eagle_PC_Resting/config/config.json", contents: JSON.stringify(config) })
  }
  public async exit() {
    TAURI_WINDOW.appWindow.close()
  }
}