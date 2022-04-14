const declineBtn = document.querySelector('.decline');
const acceptBtn = document.querySelector('.accept');
const bg = document.querySelector('.bg');
const timerHeading = document.querySelector('#timer');
declineBtn.addEventListener("mouseover", () => {
  bg.style.backgroundImage = "url(../assets/eagle-red-both.png)";
})
declineBtn.addEventListener("mouseout", () => {
  bg.style.backgroundImage = "url(../assets/eagle.png)";
})


timerHeading.style.opacity = 0;
setTimeout(() => {
  let timeToAccept = 30
  timerHeading.style.opacity = 1;
  let timerInt = setInterval(() => {
    timerHeading.innerText = `Accept in ${timeToAccept}s`
    timeToAccept--
    if (timeToAccept < 0) clearInterval(timerInt)
  }, 1000)
}, 30000)
