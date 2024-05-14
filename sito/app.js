const canvasContainer = document.getElementById("canvas-container")
const canvas = document.getElementsByTagName("canvas")[0]
const ctx = canvas.getContext('2d')
const penSize = 30

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

    ctx.lineWidth = penSize
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

// recognizer.addEventListener("click", () => {
//     const pixelList = exportCanvasAsList(canvas)

//     const check = allBlackOrWhite(pixelList)

//     if (check == false)
//         return
//     // else if (check == true)
//     //     window.location.href = "https://www.youtube.com/watch?v=xvFZjo5PgG0"

//     for (let i = 0; i < 28*28; i++)
//         if (pixelList[i] == 1)
//             document.getElementById("canvas-low-density-cell-" + i).style.backgroundColor = "white"

//     startDissolvingAnimation()
    
// })

const speed = 13
function topLeftToBottomRightCell(cssPropriety) {
    for (let i = 0; i < 28; i++) {
        setTimeout(() => {
            for (let j = 0; j <= i; j++) {
                document.getElementById(`canvas-low-density-cell-${i+(28*j-j)}`).classList.add(cssPropriety)
            }
        }, i * speed)
    }

    for (let i = 2; i <= 28; i++) {
        setTimeout(() => {
            k = (28 * i) - 1
            for (let j = 0; j < k; j++) {
                if (k+(28*j-j) > 783) continue
                document.getElementById(`canvas-low-density-cell-${k+(28*j-j)}`).classList.add(cssPropriety)
            }
        }, i * speed + 26*speed)
    }
}

function pulse() {
    document.getElementById("canvas-low-density").classList.add("pulse")
    setTimeout(() => {
        document.getElementById("canvas-low-density").classList.remove("pulse")
    }, 702)
}

function startDissolvingAnimation() {
    document.getElementById("canvas-low-density").classList.add("show")
    document.getElementById("bg-filler").classList.add("fill")
    setTimeout(() => {
        document.body.style.backgroundColor = "black"
        document.getElementById("canvas-buttons").style.opacity = "0"
        canvas.style.display = "none"
    }, 1100)

    topLeftToBottomRightCell("round")
    
    setTimeout(() => {
        pulse()

        topLeftToBottomRightCell("border")

        const firstLayerSpeed = 100
        const numberOfBoxes = 6
        setTimeout(() => {

            for (let i = 0; i < 28/numberOfBoxes; i++) {
                for (let j = 0; j < 28/numberOfBoxes; j++) {                    
                    for (let k = 0; k < numberOfBoxes; k++) {
                        for (let z = 0; z < numberOfBoxes; z++) {
                            if (i * numberOfBoxes + k > 27) continue
                            if (j * numberOfBoxes + z > 27) continue

                            // console.log(i * numberOfBoxes + k)

                            setTimeout(() => {
                                const pixel = (j*numberOfBoxes) + z + ((i*28*numberOfBoxes) + (k*28))

                                const x = (- (100+(numberOfBoxes*(400/28)*j)) - (400 / 28) * z)
                                const y = (- (-15*i-20*j)  - (400 / 28) * k)

                                document.getElementById(`canvas-low-density-cell-${pixel}`).style.translate = `0 ${y}px`
                                document.getElementById(`canvas-low-density-cell-${pixel}`).style.transform = `translateX(${x}px)`
                            }, (i+j)*firstLayerSpeed)
                        }
                    }
                }
            }

            document.getElementById("title").classList.add("hide")
        }, 702*2)

        // setTimeout(delatePoints, 702*2 + (((Math.trunc(28/numberOfBoxes)*2)*firstLayerSpeed)) + 3350);

        setTimeout(() => {
            delatePoints()
            
            const nuberOfCellInMiddleLayer = 20
            const middleLayer = document.getElementById("middle-layers")

            for (let i = 0; i < nuberOfCellInMiddleLayer; i++) {
                const newCell = document.createElement("div")
                newCell.id = "middle-layer-cell-" + i
                newCell.classList.add("hidden-layer-cell")

                // if (i != nuberOfCellInMiddleLayer-1)
                //     newCell.style.marginBottom = "5px"

                middleLayer.appendChild(newCell)
            }


            document.getElementsByClassName("hidden-layers")[0].classList.add("show")
            document.getElementById("middle-layers").classList.add("show")

        }, 702*2 + (((Math.trunc(28/numberOfBoxes)*2)*firstLayerSpeed)) + 1900)

        setTimeout(() => {
            
            document.getElementById("hidden-lines-sx").classList.add("show")

        }, 702*2 + (((Math.trunc(28/numberOfBoxes)*2)*firstLayerSpeed)) + 1900 + 1000)

        setTimeout(() => {
            
            const nuberOfCellInOutputLayer = 10
            const outputLayer = document.getElementById("output-layers")

            for (let i = 0; i < nuberOfCellInOutputLayer; i++) {
                const newCell = document.createElement("div")
                newCell.id = "output-layer-cell-" + i
                newCell.classList.add("hidden-layer-cell")

                if (i != nuberOfCellInOutputLayer-1)
                    newCell.style.marginBottom = "5px"

                outputLayer.appendChild(newCell)
            }

            document.getElementsByClassName("hidden-layers")[1].classList.add("show")
            document.getElementById("output-layers").classList.add("show")

        }, 702*2 + (((Math.trunc(28/numberOfBoxes)*2)*firstLayerSpeed)) + 2000 + 1100)

        setTimeout(() => {
            
            document.getElementById("hidden-lines-dx").classList.add("show")


        }, 702*2 + (((Math.trunc(28/numberOfBoxes)*2)*firstLayerSpeed)) + 2000 + 1100 + 1000)
        


    }, 1000)
}


function delatePoints() {
    const cellList = document.getElementsByClassName("canvas-low-density-cell")

    for (let item of cellList)
        item.classList.add("no-transition")

    const numberOfBoxes = 6

    for (let i = 0; i < 28/numberOfBoxes; i++) {
        for (let j = 0; j < 28/numberOfBoxes; j++) {                    
            for (let k = 0; k < numberOfBoxes; k++) {
                for (let z = 0; z < numberOfBoxes; z++) {
                    if (i * numberOfBoxes + k > 27) continue
                    if (j * numberOfBoxes + z > 27) continue

                    const mother_pixel = (j*numberOfBoxes) + ((i*28*numberOfBoxes))
                    const pixel = (j*numberOfBoxes) + z + ((i*28*numberOfBoxes) + (k*28))

                    const color = document.getElementById(`canvas-low-density-cell-${pixel}`).style.backgroundColor

                    if (color == "white")
                        document.getElementById(`canvas-low-density-cell-${mother_pixel}`).style.backgroundColor = "white"

                
                    if (k != 0 || z != 0) {
                        document.getElementById(`canvas-low-density-cell-${pixel}`).remove()
                        if (mother_pixel == 24 ||
                            mother_pixel == 192 ||
                            mother_pixel == 360 ||
                            mother_pixel == 528 ||
                            mother_pixel == 696)
                            document.getElementById(`canvas-low-density-cell-${mother_pixel}`).style.marginRight = `calc(${400/28}px * 3)`
                        else
                            document.getElementById(`canvas-low-density-cell-${mother_pixel}`).style.marginRight = `calc(${400/28}px * 5)`
                    } else {
                        document.getElementById(`canvas-low-density-cell-${pixel}`).style.borderWidth = "1.4px"
                    }
                }
            }
        }
    }
}

// document.getElementById(`canvas-low-density-cell-${0}`)
// function getPx(element) {
//     const margin_txt = element.style.marginRight

//     if (!margin_txt)
//         return 0

//     margin_txt.splice("p")[0]

// }




const insertNewLineHereSx = document.getElementById("hidden-lines-insert-sx")
const insertNewLineHereDx = document.getElementById("hidden-lines-insert-dx")

function newLine(inputCell = 0, middleCell = 0, sx = true, id = undefined) {
    inputCell += 1
    middleCell += 1

    const halfNumOfInputNeurons = sx ? 13 : 10
    const halfNumOfOutputNeurons = sx ? 10 : 5

    const inputY = (400/28) * (inputCell-halfNumOfInputNeurons) + (sx ? 5.9 : 5.0) * (inputCell-halfNumOfInputNeurons) - (sx ? 0 : (2.5 + (400/(28*2))))
    const outputY = (400/28) * (middleCell-halfNumOfOutputNeurons) + (5.0) * (middleCell-halfNumOfOutputNeurons) - (2.5 + (400/(28*2)))

    const x = 292.85

    const pitagora = Math.sqrt(Math.pow(Math.abs(inputY - outputY), 2) + Math.pow(x, 2))

    const scale = ((pitagora - (400/28))/x) * 100

    const angolo = Math.acos(x/pitagora)

    const newLine = document.createElement("div")
    newLine.classList.add("line")
    if (id)
        newLine.id = id

    newLine.style.scale = `${scale}% 100%`
    newLine.style.translate = `0 ${(inputY + outputY)/2}px`
    newLine.style.rotate = `${(inputY > outputY) ? -angolo : angolo}rad`

    sx ? insertNewLineHereSx.appendChild(newLine) : insertNewLineHereDx.appendChild(newLine)

}

for (let i = 0; i < 180; i++) {
    const a = Math.floor(Math.random()*25)
    const b = Math.floor(Math.random()*20)
    
    newLine(a, b, true)
}

for (let i = 0; i < 90; i++) {
    const a = Math.floor(Math.random()*20)
    const b = Math.floor(Math.random()*10)
     
    newLine(a, b, false, i)
}



  

class Network {
    constructor(sizes, biases, weights) {
        this.sizes = sizes
        this.numLayers = sizes.length
        this.biases = biases
        this.weights = weights
    }

    dotProduct(matrix, array) {
        let product = []

        for (let i = 0; i < matrix.length; i++) {
            let sum = 0

            for (let j = 0; j < matrix[i].length; j++)
                sum += matrix[i][j] * array[j]
            
            product.push(sum)
        }

        return product
    }


    feedforward(a) {
        let activation = a

        for (let i = 0; i < this.numLayers - 1; i++) {
            const b = this.biases[i]
            const w = this.weights[i]

            console.log(i)
            console.log(activation, w, b)

            let product = this.dotProduct(w, activation)
            for (let j = 0; j < product.length; j++)
                product[j] += b[j][0]

            console.log(product)

            activation = product
        }

        return activation
    }

    sigmoid(z) {
        return 1.0/(1.0+Math.exp(-z))
    }
}


fetch("./data-for-website.txt")
    .then(response => response.text())
    .then(model => {

        let sizes = ((model.split("<sizes>")[1]).split("<biases>")[0]).split(";")
        sizes = sizes.splice(0, sizes.length - 1)
        for (let i = 0; i < sizes.length; i++)
            sizes[i] = parseFloat(sizes[i])



        let stringBiases = (((model.split("<sizes>")[1]).split("<biases>")[1]).split("<weights>")[0]).split(";")
        stringBiases = stringBiases.splice(0, stringBiases.length - 1)

        let biases = []
        for (let i = 0; i < stringBiases.length; i++) {
            const splittedBiases = stringBiases[i].split("{")
            if (splittedBiases.length == 2)
                biases.push([[parseFloat(splittedBiases[1])]])
            else
                biases[biases.length - 1].push([parseFloat(splittedBiases[0])])
        }



        let stringWeights = ((model.split("<sizes>")[1]).split("<biases>")[1]).split("<weights>")[1]
        const layerWeights = stringWeights.split("{").splice(1)

        let weights = []
        for (let i = 0; i < layerWeights.length; i++) {
            weights.push([])

            const layerWeight = layerWeights[i]
            const neuronWeights = layerWeight.split("[").splice(1)
            
            for (let j = 0; j < neuronWeights.length; j++) {
                const neuronWeight = neuronWeights[j].split(";").splice(0, neuronWeights[j].length - 1)
                const neuronWeightt = neuronWeight.splice(0, neuronWeight.length - 1)
    
                weights[i].push(neuronWeightt)

                for (let w = 0; w < neuronWeightt.length; w++)
                    weights[i][j][w] = parseFloat(weights[i][j][w])
            }
        }


        const net = new Network(sizes, biases, weights)

        recognizer.addEventListener("click", () => {
            const pixelList = exportCanvasAsList(canvas)

            console.log(JSON.stringify(pixelList))
        
            net.feedforward(pixelList)
        })

    })
    .catch(error => {
        console.error(error)
    })