#[macro_use]
extern crate lazy_static;
use chrono;
use hotkey;
use std::fs;
use std::process::Command;

const CONFIG_PATH: &str = "../config/config.json";
const UI_PATH: &str = "../Eagle/src-tauri/target/debug/app.exe";
lazy_static! {
  static ref CONFIG: serde_json::Value = fs::read_to_string(CONFIG_PATH)
    .expect("Failed to open config file before ui")
    .parse::<serde_json::Value>()
    .unwrap();
}

fn main() {
  std::thread::sleep(minutes(CONFIG["appStartTime"].as_u64().unwrap()));
  spawn_ui();
  let mut hk = hotkey::Listener::new();
  hk.register_hotkey(
    hotkey::modifiers::CONTROL | hotkey::modifiers::SHIFT,
    'E' as u32,
    || spawn_ui_with_key(),
  )
  .unwrap();
  hk.listen();
}

fn spawn_ui_with_key() {
  println!("clicked");
  let now = chrono::Utc::now().timestamp();
  let time_between = now - CONFIG["lastOpen"].as_i64().unwrap();
  if time_between < 60 * CONFIG["appStartTime"].as_i64().unwrap() / 2 {
    Command::new(UI_PATH)
      .arg("cantStartOften")
      .spawn()
      .expect("Failed to spawn ui");
    return;
  }
  Command::new(UI_PATH)
    .arg("canStart")
    .spawn()
    .expect("Failed to spawn ui");
}

fn spawn_ui() {
  Command::new(UI_PATH).spawn().expect("Failed to spawn ui");

  std::thread::sleep(minutes(
    CONFIG["waitTillAcceptTime"]
      .to_string()
      .parse::<u64>()
      .unwrap(),
  ));

  let config_after_action = fs::read_to_string(CONFIG_PATH)
    .expect("Failed to open config file after ui")
    .parse::<serde_json::Value>()
    .unwrap();

  if CONFIG["postponed"] != config_after_action["postponed"]
    && config_after_action["postponed"] != "0"
  {
    std::thread::sleep(minutes(
      CONFIG["waitWhenPostponedTime"]
        .to_string()
        .parse::<u64>()
        .unwrap(),
    ));
    spawn_ui()
  } else {
    std::thread::sleep(minutes(
      CONFIG["restTime"].to_string().parse::<u64>().unwrap(),
    ));
    std::thread::sleep(minutes(
      CONFIG["appStartTime"].to_string().parse::<u64>().unwrap(),
    ));

    spawn_ui()
  }
}
fn minutes(minutes: u64) -> std::time::Duration {
  std::time::Duration::from_secs(minutes * 60)
}
