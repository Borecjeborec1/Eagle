import { minutes, seconds, hexToRgb } from "./helpers.js"
import { Tauri } from "./Tauri.js"

const tauri = new Tauri()
tauri.setSize({ width: 400, height: 200 })

const smallContent = <HTMLDivElement>document.querySelector("#small")
const declineBtn = <HTMLButtonElement>document.querySelector('.decline');
const acceptBtn = <HTMLButtonElement>document.querySelector('.accept');
const bg = <HTMLDivElement>document.querySelector('.bg');
const timerHeading = <HTMLHeadingElement>document.querySelector('#timer');
const canvas = <HTMLCanvasElement>document.querySelector('#canvas');

const BONUS_TIME = minutes(1);

declineBtn?.addEventListener("mouseover", (): void => {
  bg.style.backgroundImage = "url(../assets/eagle-red-both.png)";
})
declineBtn?.addEventListener("mouseout", (): void => {
  bg.style.backgroundImage = "url(../assets/eagle.png)";
})

acceptBtn?.addEventListener("click", (): void => {
  smallContent.style.display = "none";
  canvas.style.display = "";
  // tauri.setSize({ width: 400, height: 200 })
  tauri.setSize({ width: 0, height: 0 })
  setTimeout(() => {
    handleCanvas()
  }, 1000)
})

timerHeading.style.opacity = "0";
canvas.style.display = "none";

setTimeout((): void => {
  let timeToAccept: number = 30
  timerHeading.style.opacity = "1";
  let timerInt: number = setInterval((): void => {
    timerHeading.innerText = `Accept in ${timeToAccept}s`
    timeToAccept--
    if (timeToAccept === -1) clearInterval(timerInt)
  }, 1000)
}, BONUS_TIME)


function handleCanvas() {

  let ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Particle[] = [];

  ctx.fillStyle = "white"
  ctx.font = "30px Arial";
  ctx.fillText("Take a rest!", 0, 30);
  const data = ctx.getImageData(0, 0, 200, 100);
  const mouse = {
    x: 0,
    y: 0,
    radius: 50
  }
  let rgbColorsOptions: string[] = ["#38B5FF", "#F71518", "#FDDF5A", "#F9914D", "#228037", "#8C52FF"];
  let rgbColor = {
    red: hexToRgb(rgbColorsOptions[Math.floor(Math.random() * rgbColorsOptions.length)])?.red || 0,
    green: hexToRgb(rgbColorsOptions[Math.floor(Math.random() * rgbColorsOptions.length)])?.green || 0,
    blue: hexToRgb(rgbColorsOptions[Math.floor(Math.random() * rgbColorsOptions.length)])?.blue || 0,
    incr: { red: true, green: true, blue: true }
  }

  window.addEventListener("mousemove", (e): void => {
    mouse.x = e.x
    mouse.y = e.y
    switch (Math.floor((Math.random() * 3))) {
      case 0:
        if (rgbColor.incr.red) rgbColor.red += Math.floor((Math.random() * 2))
        else rgbColor.red -= Math.floor((Math.random() * 2))
        if (rgbColor.red > 250) rgbColor.incr.red = false
        if (rgbColor.red < 5) rgbColor.incr.red = true
        break;
      case 1:
        if (rgbColor.incr.green) rgbColor.green += Math.floor((Math.random() * 2))
        else rgbColor.green -= Math.floor((Math.random() * 2))
        if (rgbColor.green > 250) rgbColor.incr.green = false
        if (rgbColor.green < 5) rgbColor.incr.green = true
        break;
      case 2:
        if (rgbColor.incr.blue) rgbColor.blue += Math.floor((Math.random() * 2))
        else rgbColor.blue -= Math.floor((Math.random() * 2))
        if (rgbColor.blue > 250) rgbColor.incr.blue = false
        if (rgbColor.blue < 5) rgbColor.incr.blue = true
        break;
    }
    console.log(rgbColor)
  })

  class Particle {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
    radius: number;
    color: string;
    oldColor: string;
    speed: number;
    constructor(x: number, y: number) {
      this.radius = 3;
      this.x = x;
      this.y = y
      this.oldX = x;
      this.oldY = y;
      this.color = `white`;
      this.oldColor = `white`;
      this.speed = Math.random() * 30 + 5;
    }
    draw(): void {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update(): void {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (mouse.radius + 10)) {
        let alpha = .5 - (distance / (mouse.radius + 10))
        if (alpha < 0)
          this.color = `rgba(${rgbColor.red},${rgbColor.green}, ${rgbColor.blue},${alpha + .7})`;
      } else {
        this.color = `white`;
      }
      if (distance < mouse.radius) {
        let forceX = dx / distance;
        let forceY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;
        let dirX = forceX * force * this.speed;
        let dirY = forceY * force * this.speed;
        this.x -= dirX
        this.y -= dirY

      } else {
        if (this.x !== this.oldX) {
          this.x -= (this.x - this.oldX) / 10
        }
        if (this.y !== this.oldY) {
          this.y -= (this.y - this.oldY) / 10
        }
      }
    }
  }
  const textOffset = {
    x: 190,
    y: 100
  }
  function initParticles(): void {
    for (let x = 0; x < data.width; ++x) {
      for (let y = 0; y < data.height; ++y) {
        if (data.data[(y * 4 * data.width) + x * 4 + 3] > 128) {
          particles.push(new Particle(x * 10 + textOffset.x, y * 10 + textOffset.y));
        }
      }
    }
  }

  function animate(): void {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.draw();
      particle.update();
    });
    connectParticles();
  }
  initParticles()
  animate();
  function connectParticles(): void {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 15) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = particles[a].color;
          ctx.stroke();
        }
      }
    }
  }
}


