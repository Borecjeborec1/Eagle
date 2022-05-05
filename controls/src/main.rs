use chrono;
use hotkey;
use std::fs;
use std::process::Command;

fn main() {
  const CONFIG_PATH: &str = "../config/config.json";
  const UI_PATH: &str = "../Eagle/src-tauri/target/debug/app.exe";
  const REST_TIME: u64 = 30;
  let mut hk = hotkey::Listener::new();
  hk.register_hotkey(
    hotkey::modifiers::CONTROL | hotkey::modifiers::SHIFT,
    'E' as u32,
    || spawn_ui(UI_PATH, CONFIG_PATH, false),
  )
  .unwrap();
  hk.listen();
  loop {
    std::thread::sleep(minutes(REST_TIME));
    spawn_ui(UI_PATH, CONFIG_PATH, true);
  }
}

fn spawn_ui(ui_path: &str, config_path: &str, spawned_by_timer: bool) {
  // read config file
  let config = fs::read_to_string(config_path)
    .expect("Failed to open config file before ui")
    .parse::<serde_json::Value>()
    .unwrap();

  if !spawned_by_timer {
    let now = chrono::Utc::now().timestamp();
    let time_between = now - config["last_spawn"].as_i64().unwrap();
    if time_between < 60 * config["restTime"].as_i64().unwrap() / 2 {
      // cant open ui too often
      return;
    }
  }

  // spawn ui
  Command::new(ui_path).spawn().expect("Failed to spawn ui");

  // sleep till user choose if he wants to postpone
  std::thread::sleep(minutes(
    config["waitTime"].to_string().parse::<u64>().unwrap(),
  ));

  // read config file again, and check if user changed it
  let config_after_action = fs::read_to_string(config_path)
    .expect("Failed to open config file after ui")
    .parse::<serde_json::Value>()
    .unwrap();

  // if postpone is higher than postpone before, then postpone (if not, then don't)
  if config["postponed"] != config_after_action["postponed"]
    && config_after_action["postponed"] != "0"
  {
    std::thread::sleep(minutes(
      config["postponeTime"].to_string().parse::<u64>().unwrap(),
    ));
    spawn_ui(ui_path, config_path, true)
  } else {
    std::thread::sleep(minutes(
      config["restTime"].to_string().parse::<u64>().unwrap(),
    ));
    spawn_ui(ui_path, config_path, true)
  }
}
fn minutes(minutes: u64) -> std::time::Duration {
  std::time::Duration::from_secs(minutes * 60)
}
