var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const TAURI_WINDOW = window.__TAURI__.window;
export class Tauri {
    constructor() {
        this.small = {
            width: 400,
            height: 200
        };
    }
    spawnWindow({ fullScreen = false }) {
        if (fullScreen)
            return this.spawnFullScreen();
        return this.spawnSmall();
    }
    spawnSmall() {
        return __awaiter(this, void 0, void 0, function* () {
            let { size } = yield TAURI_WINDOW.primaryMonitor();
            TAURI_WINDOW.appWindow.setSize(new TAURI_WINDOW.LogicalSize(this.small.width, this.small.height));
            TAURI_WINDOW.appWindow.setPosition(new TAURI_WINDOW.LogicalPosition((size.width - this.small.width) / 2, (size.height - this.small.height) / 2));
        });
    }
    spawnFullScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            let { size } = yield TAURI_WINDOW.primaryMonitor();
            TAURI_WINDOW.appWindow.setSize(new TAURI_WINDOW.LogicalSize(size.width, size.height));
            TAURI_WINDOW.appWindow.setPosition(new TAURI_WINDOW.LogicalPosition(0, 0));
        });
    }
}
