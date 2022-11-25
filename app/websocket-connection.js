let websocket

/**
 * @typedef {Object} Frequencies
 * @property {number} bass
 * @property {number} lowMid
 * @property {number} mid
 * @property {number} highMid
 * @property {number} treble
 */
let wsData = {
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    treble: 0,
}

/**
 * Usually each value in range between 0 to 150
 * @returns {Frequencies}
 */
function getFreqencies () {
    return wsData
}

/**
 * Calculation:
 * value\*scale - threshold\*scale
 * @param {number} threshold e.g.: 30, will be cutoff from number
 * @param {number} scale e.g.: 4, scale by factor
 * @returns {Frequencies}
 */
function getTransformedFreqencies (threshold, scale) {
    const transformedData = Object.assign({}, wsData)
    for (const [key, value,] of Object.entries(transformedData)) {
        transformedData[key] = (value * scale) - (threshold * scale)
        if (transformedData[key] < 0) transformedData[key] = 0
    }
    return transformedData
}

const freqencyOrder = ["bass", "lowMid", "mid", "highMid", "treble",]
/**
 * @param {"bass" | "lowMid" | "mid" | "highMid" | "treble"} freq
 * @returns {number}
 */
function freqToIndex (freq) {
    return freqencyOrder.indexOf(freq)
}
/**
 * @param {number} index
 * @returns {"bass", "lowMid", "mid", "highMid", "treble"}
 */
function indexToFreq (index) {
    return freqencyOrder[index]
}

/**
 * @param {string} url e.g.: "ws://localhost:8666"
 */
function connectWebsocket (url) {
    websocket = new WebSocket(url)
    websocket.onopen = function (e) {
        console.log("websocket connection established")
    }

    websocket.onmessage = (event) => {
        wsData = JSON.parse(event.data)
    }

    websocket.onclose = (event) => {
        if (event.wasClean) {
            console.log(`websocket connection closed cleanly, code=${event.code} reason=${event.reason}`)
        } else {
            console.log("websocket closed unexpected, reconnect in 8sec")
            setTimeout(() => {
                connectWebsocket(url)
            }, 8000)
        }
        // reset wsData
        wsData = { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, }
    }

    websocket.onerror = (error) => {
        console.error("websocket error")
        console.error(error)
    }
}

window.addEventListener("load", () => {
    connectWebsocket("ws://localhost:8666")
})
