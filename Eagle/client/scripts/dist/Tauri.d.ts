export declare class Tauri {
    isDev: boolean;
    constructor();
    setSize({ width, height }: {
        width: number;
        height: number;
    }): Promise<void>;
    readConfig(): Promise<string>;
    writeConfig(config: string): Promise<void>;
    exit(): Promise<void>;
}
