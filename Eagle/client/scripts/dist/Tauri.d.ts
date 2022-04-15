export declare class Tauri {
    small: {
        width: number;
        height: number;
    };
    constructor();
    spawnWindow({ fullScreen }: {
        fullScreen?: boolean | undefined;
    }): Promise<void>;
    spawnSmall(): Promise<void>;
    spawnFullScreen(): Promise<void>;
}
