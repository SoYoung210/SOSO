import React, { useRef, useEffect } from 'react'

export const ChristmasTheme = ({ children }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const COUNT = 300
    const canvasNode = canvasRef.current
    const ctx = canvasNode.getContext('2d')
    let i = 0
    const width = document.documentElement.offsetWidth
    const height = document.documentElement.offsetHeight
    canvasNode.width = width;
    canvasNode.height = height;

    function onResize() {
      ctx.fillStyle = '#FFF'

      requestAnimFrame(update)
    }

    let Snowflake = function() {
      this.x = 0
      this.y = 0
      this.vy = 0
      this.vx = 0
      this.r = 0

      this.reset()
    }

    Snowflake.prototype.reset = function() {
      this.x = Math.random() * width
      this.y = Math.random() * -height
      this.vy = 1 + Math.random() * 3
      this.vx = 0.5 - Math.random()
      this.r = 1 + Math.random() * 2
      this.opacity = 0.5 + Math.random() * 0.5
    }

    let snowflakes = []
    let snowflake

    for (i = 0; i < COUNT; i++) {
      snowflake = new Snowflake()
      snowflake.reset()
      snowflakes.push(snowflake)
    }

    function update() {
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
          snowflake.reset()
        }
      }

      requestAnimFrame(update)
    }

    window.requestAnimFrame = (() => {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60)
        }
      )
    })()

    onResize()
    window.addEventListener('resize', onResize, false);

    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [canvasRef])

  return (
    <>
      <canvas
        className="snowflakes"
        ref={canvasRef}
      />
      {children}
    </>
  )
}
