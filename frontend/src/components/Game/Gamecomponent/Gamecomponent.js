import React from 'react'
import kaplay from "kaplay"

const InitGame = () => {
return kaplay({
width: 1920,
height: 1080,
letterbox: true,
global: false,
letterbox: true,
debug:true,
canvas: document.getElementById("gameCanvas"),
pixelDensity: devicePixelRatio,
})
}

export default InitGame;