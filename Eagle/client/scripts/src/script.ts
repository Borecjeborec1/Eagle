import { minutes, seconds, hexToRgb } from "./helpers.js"
import { Tauri } from "./Tauri.js"

const tauri = new Tauri()

const smallContent = <HTMLDivElement>document.querySelector("#small")
const bigContent = <HTMLDivElement>document.querySelector("#big")
const declineBtn = <HTMLButtonElement>document.querySelector('.decline');
const acceptBtn = <HTMLButtonElement>document.querySelector('.accept');
const bg = <HTMLDivElement>document.querySelector('.bg');
const timerHeading = <HTMLHeadingElement>document.querySelector('#timer');

const MAX_POSTPONED: number = 3

let timeRemaining: number = 5
let timeToAccept: number = 60
let currentExcercise: number = 0;
const excercises = [
  [
    { duration: "10-15 reps", asset: "over-and-back" },
    { duration: "5-10 reps", asset: "cobra-pose" },
    { duration: "5-10 reps", asset: "stand-and-reach" },
    { duration: "10-15 reps", asset: "wall-slides" }
  ],
  [
    { duration: "10 reps", asset: "quadruplet-thoracic-rotation" },
    { duration: "30-40 sec", asset: "kneeling-hip-stretch" },
    { duration: "30-45 sec", asset: "pigeon-stretch" },
    { duration: "10-15 reps", asset: "glute-bridge" }
  ],
]

declineBtn?.addEventListener("mouseover", (): void => {
  if (declineBtn.innerText.includes("postpone"))
    bg.style.backgroundImage = "url(../assets/eagle-red-both.png)";
})
declineBtn?.addEventListener("mouseout", (): void => {
  bg.style.backgroundImage = "url(../assets/eagle.png)";
})

acceptBtn?.addEventListener("click", (): void => {
  startRest()
})



declineBtn?.addEventListener("click", async (): Promise<void> => {
  const config = JSON.parse(await tauri.readConfig())
  config.postponed++
  tauri.writeConfig(config)
  setTimeout(() => {
    tauri.exit()
  }, 50)
})

window.onload = async (): Promise<void> => {
  let args = await tauri.getArgs()
  const config = JSON.parse(await tauri.readConfig())

  timerHeading.style.opacity = "0";
  bigContent.style.display = "none";
  declineBtn.innerText = `Postpone ${config.postponeTime}min (${MAX_POSTPONED - config.postponed})`
  acceptBtn.innerText = `Take ${config.restTime}min rest`
  timeRemaining = config.restTime
  if (args.includes("canStart"))
    declineBtn.style.display = "none"
  else if (args.includes("cantStartOften")) {
    acceptBtn.style.display = "none"
    declineBtn.innerText = `You have to wait...`
  }
  if (config.postponed == MAX_POSTPONED) {
    startRest()
  } else {
    tauri.setSize({ width: 400, height: 200 })
  }

  timerHeading.style.opacity = "1";
  let timerInt: number = setInterval((): void => {
    timerHeading.innerText = `Accept in ${timeToAccept}s`
    timeToAccept--
    if (timeToAccept === -1) {
      clearInterval(timerInt)
      startRest()
    }
  }, 1000)
}



function handleCanvas(): void {
  const blurDiv = <HTMLDivElement>document.querySelector('.blur');
  const canvas = <HTMLCanvasElement>document.querySelector('#canvas');
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

  canvas.style.opacity = "1";
  blurDiv.style.opacity = "1";

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


  let data: ImageData
  function getData(min: number): void {
    ctx.fillStyle = "white"
    ctx.font = "30px 'My soul'";
    ctx.fillText("Take your time", 0, 30);
    ctx.font = "20px 'My soul'";
    ctx.fillText(`${min} min`, 100, 40);
    data = ctx.getImageData(0, 0, 200, 100);
  }
  getData(timeRemaining)
  setInterval((): void => {
    particles.length = 0
    timeRemaining--;
    getData(timeRemaining)
    initParticles();
  }, minutes(1))

  let rgbColorsOptions: string[] = ["#38B5FF", "#F71518", "#FDDF5A", "#F9914D", "#228037", "#8C52FF"];
  let randColor = rgbColorsOptions[Math.floor(Math.random() * rgbColorsOptions.length)];
  let rgbColor = {
    red: hexToRgb(randColor)?.red || 0,
    green: hexToRgb(randColor)?.green || 0,
    blue: hexToRgb(randColor)?.blue || 0,
    incr: { red: true, green: true, blue: true }
  }

  const mouse = {
    x: 0,
    y: 0,
    radius: 50
  }
  const autoMove: { [key: string]: any } = {
    x: 300,
    y: 300,
    speed: 3,
    radius: 20,
    lastMove: { dir: "x", isPlus: true }
  }
  function moveAuto() {
    handleColors()
    if (autoMove.x < 300) {
      autoMove.lastMove = { dir: "x", isPlus: true }
    } else if (canvas.width - autoMove.x < 300) {
      autoMove.lastMove = { dir: "x", isPlus: false }
    } else if (autoMove.y < 300) {
      autoMove.lastMove = { dir: "y", isPlus: true }
    } else if (canvas.height / 2 - autoMove.y < 100) {
      autoMove.lastMove = { dir: "y", isPlus: false }
    }

    if (Math.random() > .02) {
      if (autoMove.lastMove.isPlus)
        return autoMove[autoMove.lastMove.dir] += autoMove.speed
      return autoMove[autoMove.lastMove.dir] -= autoMove.speed
    }
    if (Math.random() > 0.5)
      if (Math.random() > 0.5) {
        autoMove.lastMove = { dir: "x", isPlus: true }
        autoMove.x += autoMove.speed;
      }
      else {
        autoMove.lastMove = { dir: "x", isPlus: false }
        autoMove.x -= autoMove.speed;
      }
    else
      if (Math.random() > 0.5) {
        autoMove.lastMove = { dir: "y", isPlus: true }
        autoMove.y += autoMove.speed;
      }
      else {
        autoMove.lastMove = { dir: "y", isPlus: false }
        autoMove.y -= autoMove.speed;
      }
  }
  function handleColors() {
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
  }
  window.addEventListener("mousemove", (e): void => {
    mouse.x = e.x
    mouse.y = e.y
    handleColors()
  })

  const particles: Particle[] = [];
  class Particle {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
    radius: number;
    color: string;
    oldColor: string;
    speed: number;
    coloredByMouse: boolean;
    constructor(x: number, y: number) {
      this.radius = 3;
      this.x = x;
      this.y = y
      this.oldX = x;
      this.oldY = y;
      this.color = `#38B5FF`;
      this.oldColor = `#38B5FF`;
      this.speed = Math.random() * 20 + 5;
      this.coloredByMouse = false;
    }
    draw(): void {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update(move: any): void {
      let dx = move.x - this.x;
      let dy = (move.y - this.y) // * 1.5 For ellipse shape
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (move.radius + 10)) {
        let alpha = .5 - (distance / (move.radius + 10))
        if (alpha < 0) {
          this.color = `rgba(${rgbColor.red},${rgbColor.green}, ${rgbColor.blue},${alpha + .7})`;
          this.coloredByMouse = !move.lastMove
        }
      } else {
        if ((this.coloredByMouse && !move.lastMove) || (move.lastMove && !this.coloredByMouse))
          this.color = this.oldColor;
      }

      if (distance < move.radius) {
        let forceX = dx / distance;
        let forceY = dy / distance;
        let force = (move.radius - distance) / move.radius;
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
    x: 100,
    y: 50
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
      particle.update(autoMove);
      particle.update(mouse);
    });
    moveAuto()
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


async function startRest(): Promise<void> {
  const config = JSON.parse(await tauri.readConfig())
  config.postponed = 0
  config.lastOpen = Date.now()
  currentExcercise = config.excercise
  if (config.excercise < excercises.length)
    config.excercise++
  else
    config.excercise = 0
  tauri.writeConfig(config)
  smallContent.style.display = "none";
  bigContent.style.display = "";
  tauri.setSize({ width: 0, height: 0 })
  setTimeout(() => {
    handleCanvas()
    spawnExcercises()
  }, 500)
  setTimeout(() => {
    tauri.exit()
  }, minutes(config.restTime))
}

function spawnExcercises(): void {
  let excercisesDiv = <HTMLDivElement>document.querySelector("#excercises")
  excercisesDiv.style.opacity = "1";
  let excTexts = <NodeListOf<HTMLParagraphElement>>document.querySelectorAll(".excText")
  let excImages = <NodeListOf<HTMLDivElement>>document.querySelectorAll(".excImage")
  if (excTexts.length != excImages.length)
    return

  for (let i = 0; i < excTexts.length; i++) {
    excTexts[i].innerText = `${excercises[currentExcercise][i].duration}`
    excImages[i].style.backgroundImage = `url(./assets/excercises/${excercises[currentExcercise][i].asset}.svg)`
  }
}

