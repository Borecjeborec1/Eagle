use std::process::Command;

fn main() {
    const INTERVAL_MS: u64 = 10000;
    const UI_PATH: &str = "../Eagle/src-tauri/target/debug/app.exe";
    loop {
        Command::new(UI_PATH)
            .arg(INTERVAL_MS.to_string())
            .spawn()
            .expect("Failed to spawn ui");
        std::thread::sleep(std::time::Duration::from_millis(INTERVAL_MS));
    }
}
