let touchMovePath = {
  start: [],
  end: []
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
    // 判断方向
    let slipeDirection = {
      // 上划
      up: touchMovePath.start[1] > touchMovePath.end[1],
      // 下滑
      down: touchMovePath.start[1] < touchMovePath.end[1],
      // 左滑
      left: touchMovePath.start[0] < touchMovePath.end[0],
      // 右划
      right: touchMovePath.start[0] > touchMovePath.end[0]
    }
    callback(slipeDirection)
    // console.log(path)
  })
}
export function getElementTouchMovelength (el, callback) {
  // 注入事件
  getElementTouchStartPosition(el, callback)
  getElementTouchEndPosition(el, callback)
}
const Tools = { getElementTouchMovelength }

export default Tools
