// define canvas size
const width = 1024
const height = 600

// Color Pallette
let darkGreen, lightGreen, lightBlue, lightGray, white

// x coordinate of each equaliser bar
const xPositions = [0, 0, 0, 0, 0,]
// measure peak values
let maxs = initEmptyWsData()
// lerp values, interessting for animations
const lerps = initEmptyWsData()

function setup () {
    const canvas = createCanvas(width, height)
    canvas.id("vj-canvas")
    canvas.parent("#vj-canvas-target")

    // Init Color Pallete
    darkGreen = color(2, 43, 58)
    lightGreen = color(31, 122, 140)
    lightBlue = color(191, 219, 247)
    lightGray = color(225, 229, 242)
    white = color(255, 255, 255)

    for (let i = 0; i < xPositions.length; i++) {
        xPositions[i] = (width / 6) * (i + 1)
    }

    textAlign(CENTER, CENTER)
}

function draw () {
    const freqs = getTransformedFreqencies(30, 4)
    calcMaxValues(freqs)
    calcLerpValues(freqs)

    background(darkGreen)

    for (const [key, value,] of Object.entries(freqs)) {
        const pos = xPositions[freqToIndex(key)]
        drawLabel(key, pos)
        drawLerpBar(int(lerps[key]), pos)
        drawBar(value, pos)
        drawMaxValue(maxs[key], pos)
        drawDbValue(value, pos)
    }
}

function drawBar (freq, xPositions) {
    fill(lightGray)
    noStroke()
    const fattness = 170
    rect(xPositions - (fattness / 2), height - 70, fattness, -freq)
}

function drawLerpBar (size, xPositions) {
    fill(lightBlue)
    noStroke()
    const fattness = 170
    rect(xPositions - (fattness / 2), height - 70, fattness, -size)
}

function drawLabel (name, xPositions) {
    fill(lightGray)
    text(name, xPositions, height - 60)
}

function drawMaxValue (value, xPositions) {
    fill(lightGreen)
    text(String(value), xPositions, height - 45)
}

function drawDbValue (value, xPositions) {
    fill(lightGray)
    text(String(value), xPositions, height - 30)
}

function calcMaxValues (freqs) {
    for (const [key, value,] of Object.entries(freqs)) {
        if (value > maxs[key]) {
            maxs[key] = value
        }
    }
}

function calcLerpValues (freqs) {
    for (const [key, value,] of Object.entries(freqs)) {
        lerps[key] = lerp(0, lerps[key], 0.995)
        if (value > lerps[key]) lerps[key] = value
    }
}

function initEmptyWsData () {
    return { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, }
}

/**
 * reset max values on mouse click
 */
function mouseClicked () {
    maxs = initEmptyWsData()
}
