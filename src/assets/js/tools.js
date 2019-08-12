let touchMovePath = {
  start: [],
  end: [],
  angle: function () {
    let x = Math.abs(this.start[0] - this.end[0])
    let y = Math.abs(this.start[1] - this.end[1])
    let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    let cos = x / z
    let radina = Math.acos(cos) // 用反三角函数求弧度
    let slideAngle = Math.floor(180 / (Math.PI / radina))
    return slideAngle
  }
}

export function getElementTouchStartPosition (el, callback) {
  el.addEventListener('touchstart', (e) => {
    let X = e.touches[0].pageX
    let Y = e.touches[0].pageY
    touchMovePath.start = [X, Y]
  })
}
export function getElementTouchEndPosition (el, callback) {
  el.addEventListener('touchend', (e) => {
    let X = e.changedTouches[0].pageX
    let Y = e.changedTouches[0].pageY
    touchMovePath.end = [X, Y]
    if (touchMovePath.start[0] === touchMovePath.end[0] && touchMovePath.start[1] === touchMovePath.end[1]) {
      return true
    }
    let slideAngle = touchMovePath.angle()
    // 判断方向
    let slipeDirection = {
      // 上划
      up: touchMovePath.start[1] > touchMovePath.end[1] && slideAngle > 45,
      // 下滑
      down: touchMovePath.start[1] < touchMovePath.end[1] && slideAngle > 45,
      // 左滑
      left: touchMovePath.start[0] < touchMovePath.end[0] && slideAngle < 45,
      // 右划
      right: touchMovePath.start[0] > touchMovePath.end[0] && slideAngle < 45
    }
    callback(slipeDirection)
  })
}
export function getElementTouchMovelength (el, callback) {
  // 注入事件
  getElementTouchStartPosition(el, callback)
  getElementTouchEndPosition(el, callback)
}
const Tools = { getElementTouchMovelength }

export default Tools
