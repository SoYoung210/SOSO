import React, { useRef, useEffect } from 'react'

export const SnowFlake = ({ children }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    let snowflakes = []
    let snowflake
    const COUNT = 700
    const canvasNode = canvasRef.current
    const ctx = canvasNode.getContext('2d')
    let i = 0
    const width = document.documentElement.offsetWidth
    const height = document.documentElement.offsetHeight
    canvasNode.width = width
    canvasNode.height = height

    const reset = () => {
      return {
        x: Math.random() * width,
        y: Math.random() * -height,
        vy: 1 + Math.random() * 3,
        vx: 0.5 - Math.random(),
        r: 1 + Math.random() * 2,
        opacity: 0.5 + Math.random() * 0.5,
      }
    }

    const init = () => {
      ctx.fillStyle = '#FFF'

      for (i = 0; i < COUNT; i++) {
        snowflake = reset()
        snowflakes.push(snowflake)
      }
      requestAnimationFrame(update)
    }

    for (i = 0; i < COUNT; i++) {
      snowflake = reset()
      snowflakes.push(snowflake)
    }

    const update = () => {
      ctx.clearRect(0, 0, width, height)

      for (i = 0; i < COUNT; i++) {
        snowflake = snowflakes[i]
        snowflake.y += snowflake.vy
        snowflake.x += snowflake.vx

        ctx.globalAlpha = snowflake.opacity
        ctx.beginPath()
        ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fill()

        if (snowflake.y > height) {
          snowflake = reset()
        }
      }

      requestAnimationFrame(update)
    }

    init()
  }, [canvasRef])

  return (
    <>
      <canvas className="snowflakes" ref={canvasRef} />
      {children}
    </>
  )
}
