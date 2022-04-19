use std::fs;
use std::process::Command;

fn main() {
    const MINUTES_INTERVAL: u64 = 30;
    const POSTPONE_TIME: u64 = 2;
    const UI_PATH: &str = "../Eagle/src-tauri/target/debug/app.exe";
    const CONFIG_PATH: &str = "../config/config.json";
    loop {
        let file_before =
            fs::read_to_string(CONFIG_PATH).expect("Failed to open config file before ui");
        Command::new(UI_PATH).spawn().expect("Failed to spawn ui");
        std::thread::sleep(minutes(POSTPONE_TIME));
        let file_after =
            fs::read_to_string(CONFIG_PATH).expect("Failed to open config file after ui");
        println!("{}", file_before);
        println!("{}", file_after);
        std::thread::sleep(minutes(MINUTES_INTERVAL));
    }
}

fn minutes(minutes: u64) -> std::time::Duration {
    std::time::Duration::from_secs(minutes * 60)
}
