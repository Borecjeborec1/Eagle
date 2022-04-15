import { minutes } from "./helpers.js"
import { Tauri } from "./Tauri.js"

const tauri = new Tauri()
tauri.spawnWindow({ fullScreen: false })

const declineBtn = <HTMLButtonElement>document.querySelector('.decline');
const acceptBtn = <HTMLButtonElement>document.querySelector('.accept');
const bg = <HTMLDivElement>document.querySelector('.bg');
const timerHeading = <HTMLHeadingElement>document.querySelector('#timer');

declineBtn?.addEventListener("mouseover", () => {
  bg.style.backgroundImage = "url(../assets/eagle-red-both.png)";
})
declineBtn?.addEventListener("mouseout", () => {
  bg.style.backgroundImage = "url(../assets/eagle.png)";
})


timerHeading.style.opacity = "0";
setTimeout(() => {
  let timeToAccept: number = 30
  timerHeading.style.opacity = "1";
  let timerInt: number = setInterval(() => {
    timerHeading.innerText = `Accept in ${timeToAccept}s`
    timeToAccept--
    if (timeToAccept < 0) clearInterval(timerInt)
  }, 1000)
  console.log(timerInt)
}, 30000)