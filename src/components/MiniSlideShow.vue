<template>
  <div class="slideshow__model" v-if="value" @click="setVisible" @touchmove.prevent>
    <!-- <span style=" position: fixed; z-index: 9999; color: #fff;">双指缩放开启：{{isDoubleTouch}}，单指滑动开启：{{isSingleTouch}},{{debugInfo}}</span> -->
    <div class="slideshow-wrapper">
      <div class="medio-list" ref="medioList">
        <div class="medio-list-slide" v-for="(item,index) in medioData" :key="index">
          <img :src="item" alt="slide-img">
        </div>
      </div>
    </div>
    <div class="slide-pagination">
      <span class="swiper-pagination-bullets" v-for="(item,index) in medioData" :key="index" :class="{'list-slide-active': indexes === index}"></span>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    zoom: {
      type: Boolean,
      default: false
    },
    initialSlide: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 300
    },
    medioData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 当前图片是否被放大，如果没有被放大，则下拉关闭slideshow
      isEnlarged: false,
      // 根节点 用于控制背景颜色
      rootNode: null,
      // 当前幻灯片组件的DOM
      swiper: null,
      // 当前设备的可视宽高
      clientWidth: 0,
      clientHeight: 0,
      // 位移
      displacement: 0,
      temporaryDisplacement: 0,
      // 主要的控制条件
      pageTurning: false, // 是否正在切换页面
      isNormalSized: true, // 图片是否被放大  如果被放大了，单指滑动则不能直接切换页面，反之可以
      isOver: { // 当图片被放大时，其是否超出了屏幕的上下或左右边框，超出了才可以上下或左右移动
        vertical: false,
        level: false
      },
      // 下滑关闭操作的时间，当下滑操作的时间在1000ms内完成，则关闭组件，如果超过1000ms，则回弹至初始位置
      moveTime: 0,

      startCoordinates: {
        clientX: 0,
        clientY: 0
      },
      currentCoordinates: {
        clientX: 0,
        clientY: 0
      },
      singleFingerPosition: {
        start: {},
        end: {},
        moveing: {},
        displacement: {
          x: 0,
          y: 0
        }
      },
      doubleFingerPosition: {
        one: [],
        two: []
      },
      isSingleTouch: true,
      isDoubleTouch: false,
      debugInfo: '',
      currentScale: 0,
      endScale: 0,
      lastTouchScale: 0,
      temporaryMoveData: {
        lastScale: 0
      },
      iscloseingDown: false,
      closeingDownTimer: null // 计时器，用于记录在实现下滑关闭功能时，下滑的事件
    }
  },
  computed: {
    // 索引
    indexes () {
      return this.displacement / this.clientWidth
    },
    // 滑动距离
    slidingLength () {
      if (this.isSingleTouch) {
        return this.startCoordinates.clientX - this.currentCoordinates.clientX
      } else {
        return 0
      }
    }
  },
  watch: {
    // 初始化操作
    value (newValue, oldValue) {
      if (!newValue) return
      this.$nextTick(() => {
        // 初始化轮播图
        this.setInitialSlide()
        this.rootNode = document.querySelector('.slideshow__model')
        // 监听单指左右滑动，切换幻灯片 只有一张图片不能切换
        this.addLitenerForSlideshow()
      })
    },
    slidingLength (newValue, oldValue) {
      if (this.isSingleTouch && !this.iscloseingDown) { // 左右滑动的条件： 单指 且 不是在下滑关闭的过程中
        console.log('触发了左右滑动')
        let temporaryDisplacement = this.computeLength(this.displacement + newValue)
        this.temporaryDisplacement = temporaryDisplacement
        this.$refs.medioList.style.transform = `translate3d(-${temporaryDisplacement}px, 0px, 0px)`
      }
    }
  },
  mounted () {
    // 获取当前设备屏幕宽度
    this.clientWidth = document.documentElement.clientWidth
    this.clientHeight = document.documentElement.clientHeight
  },
  methods: {
    // 关闭模态框
    setVisible () {
      this.$emit('input', false)
    },
    // 初始化轮播图
    setInitialSlide () {
      let initialDisplacement = this.clientWidth * this.initialSlide // 设置初始的偏移量
      this.displacement = initialDisplacement
      this.$refs.medioList.style.transform = `translate3d(-${initialDisplacement}px, 0px, 0px)`
      this.addLIstenerForImg()
    },
    // 切换轮播图
    addLitenerForSlideshow () {
      this.swiper = document.querySelector('.slideshow-wrapper')
      this.swiper.addEventListener('touchstart', (e) => {
        if (this.isSingleTouch && this.isNormalSized) {
          this.pageTurning = false // 正在切换页面
          this.$set(this.startCoordinates, 'clientX', e.touches[0].clientX)
          this.$set(this.startCoordinates, 'clientY', e.touches[0].clientY)
        }
      }, true)
      this.swiper.addEventListener('touchmove', (e) => {
        if (this.isSingleTouch && this.isNormalSized) {
          this.pageTurning = true
          this.$set(this.currentCoordinates, 'clientX', e.touches[0].clientX)
          this.$set(this.currentCoordinates, 'clientY', e.touches[0].clientY)
        }
      }, true)
      this.swiper.addEventListener('touchend', this.setSlideHandle, true)
    },
    // 切换Node时需要清除的一些参数
    setNodeInfo () {
      // 是否被放大置为false
      this.isEnlarged = false
    },
    // 计算滑动的距离
    computeLength (length) {
      let maxLength = this.clientWidth * (this.medioData.length - 1)
      if (length > 0 && length < maxLength) {
        return length
      } else if (length > 0 && length > maxLength) {
        return maxLength
      } else if (length < 0) {
        return 0
      }
    },
    // 添加双指缩放事件
    addLIstenerForImg () {
      let imgNodeList = document.querySelectorAll('.medio-list-slide img')
      Array.prototype.forEach.call(imgNodeList, (element) => {
        this.setGesture(element)
      })
    },
    // 设置单指滑动切换页面
    setSlideHandle () {
      // 如果
      if (this.isNormalSized && this.temporaryDisplacement !== 0 && this.isSingleTouch) {
        console.log('触发了单指滑动事件')
        let slideLength = this.displacement - this.temporaryDisplacement
        this.$refs.medioList.style.transitionDuration = '300ms'
        if (Math.abs(slideLength) > 50) {
          // 图片还原到原始大小
          let currentNode = this.$refs.medioList.children[this.indexes]
          if (currentNode.firstElementChild.tagName === 'IMG') {
            currentNode.firstElementChild.style.transitionDuration = `100ms`
            currentNode.firstElementChild.style.transform = `scale(1)`
            this.currentScale = 1
          }
          // 切换到下一节点
          let direction = slideLength > 0 ? 1 : -1 // 滑动方向
          let endLength = this.displacement - (this.clientWidth * direction) // 下一节点停留的位置
          this.displacement = endLength // 记录下一节点的位置
          this.$refs.medioList.style.transform = `translate3d(-${endLength}px, 0px, 0px)` // 切换到下一节点
        } else {
          this.$refs.medioList.style.transform = `translate3d(-${this.displacement}px, 0px, 0px)`
        }
      }
    },
    // 设置双指图片的缩放功能，以及放大后的单指滑动查看功能
    setGesture (dom) {
      dom.addEventListener('touchstart', (e) => {
        // 获取到当前操作的DOM
        let node = e.srcElement ? e.srcElement : e.target
        if (e.touches.length >= 2) { //
          this.isNormalSized = false
          this.isDoubleTouch = true // 开启双指缩放功能
          this.isSingleTouch = false // 关闭轮播功能
          this.doubleFingerPosition.one = e.touches[0] // 得到第一个手指坐标
          this.doubleFingerPosition.two = e.touches[1] // 得到第二个手指坐标
        } else {
          this.singleFingerPosition.start = e.touches[0]
          this.moveDownToclose(node)
          node.parentNode.style.transitionDuration = '0ms'
          this.rootNode.style.transitionDuration = `0ms`
        };
      }, false)
      dom.addEventListener('touchmove', (e) => {
        // 获取到当前操作的DOM
        let node = e.srcElement ? e.srcElement : e.target
        if (e.touches.length >= 2) {
          // 得到第二组两个点
          let now = e.touches
          // 得到缩放比例，getDistance是勾股定理的一个方法
          let scale = this.getDistance(now[0], now[1]) / this.getDistance(this.doubleFingerPosition.one, this.doubleFingerPosition.two)
          // 缩放比小数处理
          scale = parseFloat(scale.toFixed(2))
          // 滑动的过程中缩小
          if (this.temporaryMoveData.lastScale > scale) {
            // 滑动 缩小
            let shrunkenScale = this.temporaryMoveData.lastScale - scale
            shrunkenScale = Math.round(shrunkenScale * 100) / 100 // 控制别让他缩放的太快了
            this.endScale = this.endScale - shrunkenScale
            node.style.cssText = node.style.cssText.concat(`-webkit-transform:scale(${this.endScale})`)
          } else {
          // 滑动的过程中放大
            if (this.currentScale !== 0) {
              this.endScale = Math.round((this.currentScale + (scale - 1)) * 100) / 100
              node.style.cssText = node.style.cssText.concat(`-webkit-transform:scale(${this.endScale})`)
            } else {
              this.endScale = scale
              node.style.cssText = node.style.cssText.concat(`-webkit-transform:scale(${this.endScale})`)
            }
          }
          this.temporaryMoveData.lastScale = scale
          node.style.zIndex = '999'
        } else {
          // 记录本次滑动的位置
          this.singleFingerPosition.end = e.touches[0]
          // 获取滑动方向
          let direction = this.getDirection(this.singleFingerPosition.start, this.singleFingerPosition.end)
          if (this.isTranslateScale(node) && !this.iscloseingDown) { // 当图片放大时提供滑动功能
            this.zoomInSlide(node)
          } else { // 当图片未放大时提供下滑动关闭
            if (direction === 'down' || this.iscloseingDown) {
              this.downSlideToClose(node)
              this.iscloseingDown = true
            }
          }
        }
      }, false)
      dom.addEventListener('touchend', (e) => {
        // 获取到当前操作的DOM
        let node = e.srcElement ? e.srcElement : e.target
        if (this.isDoubleTouch) { // 双指操作时
          this.isNormalSized = false
          // 开启轮播功能
          this.isSingleTouch = true
          // 关闭双指缩放功能
          this.isDoubleTouch = false
          if (this.endScale > 3) {
            // 当缩放比大于3时，设置回弹效果，回弹为scale为3
            this.endScale = 3
            node.style.cssText = node.style.cssText.concat(`z-index:9;-webkit-transition-duration:300ms;transition-duration:300ms;-webkit-transform:scale(3);transform:scale(3)`)
          } else if (this.endScale < 1) {
            // 当缩放比小于1时，设置回弹效果，回弹为scale为1
            this.endScale = 1
            node.style.cssText = node.style.cssText.concat(`z-index:9;-webkit-transition-duration:300ms;transition-duration:300ms;-webkit-transform:scale(1);transform:scale(1)`)
          }
          // 记录双指缩放操作结束时的scale
          this.currentScale = this.endScale
          // 清除滑动参数的临时数据
          this.temporaryMoveData.lastScale = 0
          node.style.transitionDuration = `0ms`
          setTimeout(() => {
            this.swiper.addEventListener('touchend', this.setSlideHandle, true)
          }, 300)
        } else { // 单指操作时
          if (!this.iscloseingDown) { // 如果图片不是在下滑时关闭的过程中时
            this.springbackToBorder(node)
            let lastX = node.parentNode.style.transform.match(/\(([^)]*)\)/)[1].match(/[^,*px]+/g)[0]
            let lastY = node.parentNode.style.transform.match(/\(([^)]*)\)/)[1].match(/[^,*px]+/g)[1]
            this.singleFingerPosition.displacement.x = +lastX
            this.singleFingerPosition.displacement.y = +lastY
          } else if (this.iscloseingDown) { // 如果图片是在下滑时关闭的过程中时
            // 如果下滑的时间超过1000ms,则会弹至初始位置，反之则关闭组件
            if (this.moveTime > 1000) {
              node.parentNode.style.transitionDuration = '300ms'
              node.parentNode.style.transform = 'translate3d(0px,0px,0px)'
              this.rootNode.style.backgroundColor = `rgba(0, 0, 0, 1)`
              node.style.cssText = node.style.cssText.concat(`-webkit-transform: scale(1);`)
            } else {
              let moving = this.getInitialPosition(node) // 获取返回位置的偏移量
              this.rootNode.style.transitionDuration = '500ms'
              node.style.transitionProperty = 'all'
              node.style.transitionDuration = '500ms'
              node.style.width = 'calc((100vw - 32px) * 0.3)'
              node.style.height = '70px'
              node.style.transform = moving
              this.rootNode.style.background = `rgba(0, 0, 0, 0`
              setTimeout(() => {
                this.setVisible()
              }, 500)
            }
            this.iscloseingDown = false
            this.moveTime = 0
          }
        };
      }, false)
    },
    // 不放大状态下，开启下滑缩放记时
    moveDownToclose (node) {
      this.moveTime = 0
      let timer = setInterval(() => {
        if (this.moveTime > 1024) {
          clearInterval(timer)
        }
        this.moveTime += 10
      }, 10)
    },
    // 当图片放大时提供滑动功能
    zoomInSlide (node) {
      let boundingClientRect = node.getBoundingClientRect()
      let bottom = this.clientHeight - boundingClientRect.bottom
      let top = boundingClientRect.top
      let left = boundingClientRect.left
      let right = this.clientWidth - boundingClientRect.right
      let { x, y } = { ...this.singleFingerPosition.displacement }
      let Xmoving = x + this.singleFingerPosition.end.pageX - this.singleFingerPosition.start.pageX
      let Ymoving = y + this.singleFingerPosition.end.pageY - this.singleFingerPosition.start.pageY
      if (bottom > 0 && top > 0) { // 当放大后，图片上下部分未被遮挡时，不产生上下滑动
        this.isOver.vertical = false
        Ymoving = y
      } else {
        this.isOver.vertical = true
      }
      if (left > 0 && right > 0) { // 当放大后，图片上下部分未被遮挡时，不产生上下滑动
        this.isOver.level = false
        Xmoving = x
      } else {
        this.isOver.level = true
      }
      node.parentNode.style.cssText = node.parentNode.style.cssText.concat(`-webkit-transform: translate3d(${Xmoving}px, ${Ymoving}px, 0px);`)
    },
    // 回弹至边界的功能
    springbackToBorder (node) {
      let boundingClientRect = node.getBoundingClientRect()
      let bottom = this.clientHeight - boundingClientRect.bottom
      let top = boundingClientRect.top
      let left = boundingClientRect.left
      let right = this.clientWidth - boundingClientRect.right
      let lastX = 0
      let lastY = 0
      // 获取回弹前坐标
      if (node.parentNode.style.transform !== '') {
        lastX = node.parentNode.style.transform.match(/\(([^)]*)\)/)[1].match(/[^,*px]+/g)[0]
        lastY = node.parentNode.style.transform.match(/\(([^)]*)\)/)[1].match(/[^,*px]+/g)[1]
      }
      let leftDistance = left < 0 ? 0 : left
      let rightDistance = right < 0 ? 0 : right
      let topDistance = top < 0 ? 0 : top
      let bottomDistance = bottom < 0 ? 0 : bottom
      if (!this.isOver.vertical) { // 当图片被放大时，其是否超出了屏幕的上下边框，超出了才可以上下移动,此处是为了清除其细微的偏移量
        bottomDistance = 0
        topDistance = 0
      } else if (!this.isOver.vertical) {
        leftDistance = 0
        rightDistance = 0
      }
      node.parentNode.style.transitionDuration = '300ms'
      node.parentNode.style.cssText = node.parentNode.style.cssText.concat(`-webkit-transform: translate3d(${+lastX + rightDistance - leftDistance}px,${+lastY + bottomDistance - topDistance}px,0px);`)
    },
    // 当图片未放大时提供下滑动关闭功能
    downSlideToClose (node) {
      let Xmoving = this.singleFingerPosition.end.pageX - this.singleFingerPosition.start.pageX
      let Ymoving = this.singleFingerPosition.end.pageY - this.singleFingerPosition.start.pageY
      let zoomOutRatio = 1 - (Ymoving / node.height)
      if (zoomOutRatio > 0.3) { // 最大缩小到0.3
        if (zoomOutRatio > 0.97) { // 去误差
          zoomOutRatio = 1
          node.parentNode.style.cssText = node.parentNode.style.cssText.concat(`-webkit-transform: translate3d(${Xmoving}px,${Ymoving}px,0px);`)
        } else {
          node.parentNode.style.cssText = node.parentNode.style.cssText.concat(`-webkit-transform: translate3d(${Xmoving}px,${Ymoving / 2}px,0px);`)
        }
        this.rootNode.style.backgroundColor = `rgba(0, 0, 0, ${this.getPercentile(zoomOutRatio)})`
        node.style.cssText = node.style.cssText.concat(`-webkit-transform: scale(${this.getPercentile(zoomOutRatio)});`)
      } else {
        node.parentNode.style.cssText = node.parentNode.style.cssText.concat(`-webkit-transform: translate3d(${Xmoving}px,${Ymoving - node.height * 0.3}px,0px);`)
      }
    },
    // 辅助方法
    getDirection (start, end) { // 判断滑动方向
      let x = start.pageX - end.pageX
      let y = start.pageY - end.pageY
      let z = Math.sqrt(x * x + y * y)
      let angle = 0 // 与x轴正方向的夹角
      if (x < 0 && y > 0) {
        angle = Math.asin(y / z) * 180 / Math.PI
      } else if (x > 0 && y > 0) {
        angle = 180 - (Math.asin(y / z) * 180 / Math.PI)
      } else if (x > 0 && y < 0) {
        angle = 180 + Math.abs((Math.asin(y / z) * 180 / Math.PI))
      } else { // x < 0 && y < 0
        angle = 360 + (Math.asin(y / z) * 180 / Math.PI)
      }
      if (angle < 45 || angle === 45 || angle > 315) return 'right'
      if ((angle > 45 && angle < 135) || angle === 135) return 'up'
      if ((angle > 135 && angle < 225) || angle === 225) return 'left'
      if ((angle > 225 && angle < 315) || angle === 315) return 'down'
    },
    getDistance (one, two) { // 获取移动的距离
      let x = one.pageX - two.pageX
      let y = one.pageY - two.pageY
      return Math.sqrt((x * x) + (y * y))
    },
    getCenter (one, two) { // 获取移动的中心
      let x = (one.pageX + two.pageX) / 2
      let y = (one.pageY - two.pageY) / 2
      let center = x + 'px ' + y + 'px'
      return center
    },
    getPercentile (value) { // 截取两位小数
      return Math.round(value * 100) / 100
    },
    isTranslateScale (node) { // 图片是否被放大
      if (node.style.transform === '' || node.style.transform === 'scale(1)') {
        return false
      } else {
        return true
      }
    },
    getInitialPosition (node) {
      let endNode = document.querySelector('.images-list').children[this.indexes]
      let endBoundingClientRect = endNode.getBoundingClientRect()
      let boundingClientRect = node.getBoundingClientRect()
      let scale = node.style.transform.match(/\(([^)]*)\)/)[1].match(/[^,*px]+/g)[0]

      let fixedDisplacementY = (node.height * (1 - scale) - (node.height - endNode.height)) / 2
      let fixedDisplacementX = (node.width * (1 - scale) - (node.width - endNode.width)) / 2
      let toTop = Math.ceil(endBoundingClientRect.top - boundingClientRect.top)
      let toLeft = Math.ceil(endBoundingClientRect.left - boundingClientRect.left)

      return `translate3d(${toLeft - 1 + fixedDisplacementX}px,${toTop + fixedDisplacementY}px,0px) scale(${1})`
    }
  }
}
</script>

<style scoped>
.slideshow__model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 1);
}
.slideshow-wrapper {
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
}
.medio-list {
  position: relative;
  width: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  transition-property: -webkit-transform;
  transition-property: transform;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}
.medio-list .medio-list-slide {
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 100%;
  position: relative;
  padding: 0 10px;
  text-align: center;
  box-sizing: border-box;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform;
  transition-property: transform,-webkit-transform;
  transform: translate3d(0px,0px,0px)
}
.medio-list .medio-list-slide img{
  max-width: 100%;
  max-height: 85vh;
  border-radius: 5px;
  position: relative;
}
.slide-pagination {
  position: absolute;
  text-align: center;
  -webkit-transition: .3s opacity;
  -o-transition: .3s opacity;
  transition: .3s opacity;
  -webkit-transform: translate3d(0,0,0);
  -o-transform: translate3d(0,0,0);
  transform: translate3d(0,0,0);
  z-index: 10;
  bottom: 4vh;
  left: 0;
  width: 100%;
}
.slide-pagination .swiper-pagination-bullets {
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 100%;
  background: #ddd;
  margin: 0 2px;
}
.slide-pagination .swiper-pagination-bullets.list-slide-active {
  background-color: #000;
}
</style>
