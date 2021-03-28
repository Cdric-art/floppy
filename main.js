import './style.css'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const img = new Image()
img.src = './images/flappy-bird-set.png'

let gamePlaying = false
const gravity = .5
const speed = 6.2
const size = [51, 36]
const jump = -11.5
const cTenth = (canvas.width / 10)

let index = 0
let bestScore = 0
let currentScore = 0
let fligth
let flyHeight

let pipes = []
const pipeWidth = 78
const pipeGap = 270

function pipeLocation() {
	return (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;
}

function setup() {
	currentScore = 0
	fligth = jump
	flyHeight = (canvas.height / 2) - (size[1] / 2)

	pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLocation()])
}

function render() {
	index++

	/**
	 * Background
	 */
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height)
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height)

	if (gamePlaying) {
		/**
		 * Bird
		 */
		ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size)
		flyHeight = Math.min(flyHeight + fligth, canvas.height - size[1])
		fligth += gravity
	} else {
		/**
		 * Bird
		 */
		ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size)
		flyHeight = (canvas.height / 2) - (size[1] / 2)

		/**
		 * Text
		 */
		ctx.fillText(`Best Score : ${bestScore}`, 80, 245)
		ctx.fillText("Click for start", 70, 480)
		ctx.font = "bold 30px courier"
	}

	/**
	 * Pipes
	 */
	if (gamePlaying) {
		pipes.map(pipe => {
			pipe[0] -= speed

			// Top pipe
			ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1])

			// Bottom pipe
			ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap)

			if (pipe[0] <= -pipeWidth) {
				currentScore++
				bestScore = Math.max(bestScore, currentScore)

				// Remove pipe + create new one
				pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLocation()]]
			}

			if ([
				pipe[0] <= cTenth + size[0],
				pipe[0] + pipeWidth >= cTenth,
				pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
			].every(elem => elem)) {
				gamePlaying = false
				setup()
			}
		})
	}

	document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`
	document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`

	window.requestAnimationFrame(render)
}

setup()

img.onload = render;

document.addEventListener('click', () => gamePlaying = true)
window.addEventListener('click', () => fligth = jump)
