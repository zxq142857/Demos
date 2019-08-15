<template>
  <div class="slideshow__model" v-if="value" @click="setVisible" @touchmove.prevent>
    <span style=" position: fixed; z-index: 9999; color: #fff;">双指缩放开启：{{isDoubleTouch}}，单指滑动开启：{{isSingleTouch}},{{debugInfo}}</span>
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
      swiper: null,
      clientWidth: 0,
      displacement: 0,
      temporaryDisplacement: 0,
      isMoved: false,
      startCoordinates: {
        clientX: 0,
        clientY: 0
      },
      currentCoordinates: {
        clientX: 0,
        clientY: 0
      },
      fingerPosition: {
        one: [],
        end: []
      },
      isSingleTouch: true,
      isDoubleTouch: false,
      debugInfo: '',
      currentScale: 0,
      endScale: 0,
      lastTouchScale: 0,
      temporaryMoveData: {
        lastScale: 0
      }
    }
  },
  computed: {
    // 索引
    indexes () {
      return this.displacement / this.clientWidth
    },
    // 滑动距离
    slidingLength () {
      if (this.isMoved && this.isSingleTouch) {
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
        // 监听单指左右滑动，切换幻灯片 只有一张图片不能切换
        // this.addLitenerForSlideshow()
      })
    },
    slidingLength (newValue, oldValue) {
      if (this.isMoved && this.isSingleTouch) {
        let temporaryDisplacement = this.computeLength(this.displacement + newValue)
        this.temporaryDisplacement = temporaryDisplacement
        this.$refs.medioList.style.transform = `translate3d(-${temporaryDisplacement}px, 0px, 0px)`
        this.debugInfo = this.debugInfo.concat(',左右滑动了')
      }
    },
    endScale (newValue, oldValue) {
      // this.debugInfo = this.debugInfo.concat(this.endScale + '☺')
    }
  },
  mounted () {
    // 获取当前设备屏幕宽度
    this.clientWidth = document.documentElement.clientWidth
  },
  methods: {
    // 关闭模态框
    setVisible () {
      this.debugInfo = ''
      this.$emit('input', false)
    },
    // 初始化轮播图
    setInitialSlide () {
      let initialDisplacement = this.clientWidth * this.initialSlide
      this.displacement = initialDisplacement
      this.$refs.medioList.style.transform = `translate3d(-${initialDisplacement}px, 0px, 0px)`
      this.addLIstenerForImg()
    },
    // 切换轮播图
    addLitenerForSlideshow () {
      this.swiper = document.querySelector('.slideshow-wrapper')
      this.swiper.addEventListener('touchstart', (e) => {
        if (this.isSingleTouch) {
          this.isMoved = false
          this.$set(this.startCoordinates, 'clientX', e.touches[0].clientX)
          this.$set(this.startCoordinates, 'clientY', e.touches[0].clientY)
        }
      }, true)
      this.swiper.addEventListener('touchmove', (e) => {
        if (this.isSingleTouch) {
          this.isMoved = true
          this.$set(this.currentCoordinates, 'clientX', e.touches[0].clientX)
          this.$set(this.currentCoordinates, 'clientY', e.touches[0].clientY)
        }
      }, true)
      this.swiper.addEventListener('touchend', this.setSlideHandle, true)
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
      if (this.isMoved && this.temporaryDisplacement !== 0 && this.isSingleTouch) {
        this.debugInfo = '触发了单指滑动事件'
        let slideLength = this.displacement - this.temporaryDisplacement
        this.$refs.medioList.style.transitionDuration = '300ms'
        if (Math.abs(slideLength) > 50) {
          // 图片还原到原始大小
          let currentNode = this.$refs.medioList.children[this.indexes - 1]
          if (currentNode.firstElementChild.tagName === 'IMG') {
            currentNode.firstElementChild.style.transitionDuration = `100ms`
            currentNode.firstElementChild.style.transform = `translate3d(0px, 0px, 0px) scale(1)`
            alert('0')
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
      } else if (this.isMoved && this.temporaryDisplacement !== 0 && !this.isSingleTouch) {

      }
    },
    // 设置双指缩放事件
    setGesture (dom) {
      dom.addEventListener('touchstart', (e) => {
        if (e.touches.length >= 2) { // 判断是否有两个点在屏幕上
          this.isDoubleTouch = true // 开启双指缩放功能
          this.isSingleTouch = false // 关闭轮播功能
          this.fingerPosition.one = e.touches[0] // 得到第一个手指坐标
          this.fingerPosition.two = e.touches[1] // 得到第二个手指坐标
          this.swiper.removeEventListener('touchend', this.setSlideHandle, true)
        };
      }, false)
      dom.addEventListener('touchmove', (e) => {
        // 获取到当前操作的DOM
        let node = e.srcElement ? e.srcElement : e.target
        if (e.touches.length >= 2 && this.isDoubleTouch) {
          // 得到第二组两个点
          let now = e.touches
          // 得到缩放比例，getDistance是勾股定理的一个方法
          let scale = this.getDistance(now[0], now[1]) / this.getDistance(this.fingerPosition.one, this.fingerPosition.two)
          // 缩放比小数处理
          scale = parseFloat(scale.toFixed(2))
          // 滑动的过程中缩小
          if (this.temporaryMoveData.lastScale > scale) {
            // 滑动 缩小
            let shrunkenScale = this.temporaryMoveData.lastScale - scale
            shrunkenScale = parseFloat(shrunkenScale.toFixed(2)) * 0.8 // 控制别让他缩放的太快了

            this.endScale = this.endScale - shrunkenScale
          } else {
          // 滑动的过程中放大
            if (this.currentScale !== 0) {
              this.endScale = Math.round((this.currentScale + (scale - 1)) * 100) / 100
              node.style.cssText = `-webkit-transform:translate3d(0px, 0px, 0px) scale(${this.endScale})`
            } else {
              this.endScale = scale
              node.style.cssText = `-webkit-transform:translate3d(0px, 0px, 0px) scale(${this.endScale})`
            }
          }
          this.temporaryMoveData.lastScale = scale
          node.style.zIndex = '999'
        };
      }, false)
      dom.addEventListener('touchend', (e) => {
        if (this.isDoubleTouch) {
          // 获取到当前操作的DOM
          let node = e.srcElement ? e.srcElement : e.target
          // 开启轮播功能
          this.isSingleTouch = true
          // 关闭双指缩放功能
          this.isDoubleTouch = false
          // this.debugInfo = this.endScale
          if (this.endScale > 3) {
            // 当缩放比大于3时，设置回弹效果，回弹为scale为3
            this.endScale = 3
            node.style.cssText = `z-index:9;-webkit-transition-duration:300ms;transition-duration:300ms;-webkit-transform:translate3d(0px, 0px, 0px) scale(3);transform:translate3d(0px, 0px, 0px) scale(3)`
          } else if (this.endScale < 1) {
            // 当缩放比小于1时，设置回弹效果，回弹为scale为1
            this.endScale = 1
            node.style.cssText = `z-index:9;-webkit-transition-duration:300ms;transition-duration:300ms;-webkit-transform:translate3d(0px, 0px, 0px) scale(3);transform:translate3d(0px, 0px, 0px) scale(1)`
          }
          // 记录双指缩放操作结束时的scale
          this.currentScale = this.endScale
          // 清除滑动参数的临时数据
          this.temporaryMoveData.lastScale = 0
          node.style.transitionDuration = `0ms`
          setTimeout(() => {
            this.swiper.addEventListener('touchend', this.setSlideHandle, true)
          }, 300)
        };
      }, false)
    },
    // 辅助方法
    getDistance (one, two) {
      let x = one.pageX - two.pageX
      let y = one.pageY - two.pageY
      return Math.sqrt((x * x) + (y * y))
    }
  }
}
</script>

<style>
.slideshow__model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, .5);
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
