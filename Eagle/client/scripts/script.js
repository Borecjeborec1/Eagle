const declineBtn = document.querySelector('.decline');
const acceptBtn = document.querySelector('.accept');
const bg = document.querySelector('.bg');
declineBtn.addEventListener("mouseover", () => {
  bg.style.backgroundImage = "url(../assets/eagle-red-both.png)";
})
declineBtn.addEventListener("mouseout", () => {
  bg.style.backgroundImage = "url(../assets/eagle.png)";
})
acceptBtn.addEventListener("mouseover", () => {
  bg.style.backgroundImage = "url(../assets/eagle-green-both.png)";
})
acceptBtn.addEventListener("mouseout", () => {
  bg.style.backgroundImage = "url(../assets/eagle.png)";
})