use std::fs;
use std::process::Command;

fn main() {
    const MINUTES_INTERVAL: u64 = 30;
    const UI_PATH: &str = "../Eagle/src-tauri/target/debug/app.exe";
    const CONFIG_PATH: &str = "../config/config.json";
    loop {
        std::thread::sleep(minutes(MINUTES_INTERVAL));
        loop {
            let file_before = fs::read_to_string(CONFIG_PATH)
                .expect("Failed to open config file before ui")
                .parse::<serde_json::Value>()
                .unwrap();

            Command::new(UI_PATH).spawn().expect("Failed to spawn ui");
            std::thread::sleep(minutes(
                file_before["waitTime"].to_string().parse::<u64>().unwrap(),
            ));

            let file_after = fs::read_to_string(CONFIG_PATH)
                .expect("Failed to open config file after ui")
                .parse::<serde_json::Value>()
                .unwrap();
            if file_before["postponed"] != file_after["postponed"] && file_after["postponed"] != "0"
            {
                std::thread::sleep(minutes(
                    file_after["postponeTime"]
                        .to_string()
                        .parse::<u64>()
                        .unwrap(),
                ));
            } else {
                break;
            }
        }
    }
}

fn minutes(minutes: u64) -> std::time::Duration {
    std::time::Duration::from_secs(minutes * 60)
}
