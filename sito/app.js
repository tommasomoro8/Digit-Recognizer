const canvasContainer = document.getElementById("canvas-container")
const canvas = document.getElementsByTagName("canvas")[0]
const ctx = canvas.getContext('2d')

for (let i = 0; i < 28; i++) {
    const newRow = document.createElement("div")
    newRow.classList.add("canvas-low-density-row")
    for (let j = 0; j < 28; j++) {
        const newCell = document.createElement("div")
        newCell.id = "canvas-low-density-cell-" + (i * 28 + j)
        newCell.classList.add("canvas-low-density-cell")
        newRow.appendChild(newCell)
    }
    document.getElementById("canvas-low-density").appendChild(newRow)
}

let painting = false

function startDrawing(event) {
    painting = true
    draw(event)
}

function stopDrawing() {
    painting = false
    ctx.beginPath()
}

function draw(event) {
    if (!painting) return

    let x = event.clientX - canvasContainer.offsetLeft 
    let y = event.clientY - canvasContainer.offsetTop 

    ctx.lineWidth = 30
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'white'
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x, y)
}

function clearCanvas() {
    document.getElementById("canvas-low-density").classList.remove("show")

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < 28*28; i++)
        document.getElementById("canvas-low-density-cell-" + i).style.backgroundColor = ""
}
clear.addEventListener('click', clearCanvas)

canvas.addEventListener("mousedown", startDrawing)
canvas.addEventListener("mouseup", stopDrawing)
canvas.addEventListener("mouseleave", stopDrawing)
canvas.addEventListener("mousemove", draw)

function exportCanvasAsList(canvas) {
    const scaledCanvas = document.createElement('canvas')
    
    scaledCanvas.width = 28
    scaledCanvas.height = 28

    const scaledCtx = scaledCanvas.getContext('2d')

    scaledCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 28, 28)

    const imageData = scaledCtx.getImageData(0, 0, 28, 28)

    const pixelList = []
  
    for (let i = 0; i < imageData.data.length; i += 4) {
        const red = imageData.data[i]
        const green = imageData.data[i + 1]
        const blue = imageData.data[i + 2]
    
        const grayscale = (red + green + blue) / (3 * 255)
    
        pixelList.push(grayscale)
    }

    return pixelList
}
  

class Network {
    constructor(model) {
        this.sizes = sizes

        this.numLayers = sizes.length
        
        this.biases = []

        this.weights = []

    }

    feedforward(a) {

    }


}


// const net = new Network(model)

function allBlackOrWhite(pixelList) {
    // true: all white, false: all black, undefined: not all white nor all black
    let foundWhite = false
    let foundBlack = false

    for (let i = 0; i < pixelList.length; i++) {
        if (pixelList[i] == 1) {
            foundWhite = true}
        else {
            foundBlack = true}

        if (foundWhite && foundBlack)
            return undefined
    }

    return foundWhite
}

recognizer.addEventListener("click", () => {
    const pixelList = exportCanvasAsList(canvas)

    const check = allBlackOrWhite(pixelList)

    if (check == false)
        return
    // else if (check == true)
    //     window.location.href = "https://www.youtube.com/watch?v=xvFZjo5PgG0"

    for (let i = 0; i < 28*28; i++)
        if (pixelList[i] == 1)
            document.getElementById("canvas-low-density-cell-" + i).style.backgroundColor = "white"

    startDissolvingAnimation()
    
})

function pulse() {
    document.getElementById("canvas-low-density").classList.add("pulse")
    setTimeout(() => {
        document.getElementById("canvas-low-density").classList.remove("pulse")
    }, 1000)
}

const speed = 13

function startDissolvingAnimation() {
    document.getElementById("canvas-low-density").classList.add("show")
    document.getElementById("bg-filler").classList.add("fill")
    setTimeout(() => {
        document.body.style.backgroundColor = "black"
    }, 700)

    setTimeout(() => {
        pulse()
    }, 1000)

    for (let i = 0; i < 28; i++) {
        setTimeout(() => {
            for (let j = 0; j <= i; j++) {
                document.getElementById(`canvas-low-density-cell-${i+(28*j-j)}`).classList.add("round")
            }
        }, i * speed)
    }

    for (let i = 2; i <= 28; i++) {
        setTimeout(() => {
            k = (28 * i) - 1
            for (let j = 0; j < k; j++) {
                if (k+(28*j-j) > 783) continue
                document.getElementById(`canvas-low-density-cell-${k+(28*j-j)}`).classList.add("round")
            }
        }, i * speed + 26*speed)
    }

    // setTimeout(() => {
    //     console.log("hey")
    // }, 26*speed*10)
}