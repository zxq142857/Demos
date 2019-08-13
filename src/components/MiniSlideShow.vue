<template>
  <div class="slideshow__model" v-if="value" @click="setVisible" @touchmove.prevent>
    {{ num }}
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
      num: 0,
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
      secondFinger: {
        start: [],
        end: []
      },
      istouch: false
    }
  },
  computed: {
    // 索引
    indexes () {
      return this.displacement / this.clientWidth
    },
    // 滑动距离
    slidingLength () {
      if (this.isMoved) {
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
        this.addLitenerForSlideshow()
      })
    },
    slidingLength (newValue, oldValue) {
      if (this.isMoved && !this.istouch) {
        let temporaryDisplacement = this.computeLength(this.displacement + newValue)
        this.temporaryDisplacement = temporaryDisplacement
        this.$refs.medioList.style.transform = `translate3d(-${temporaryDisplacement}px, 0px, 0px)`
      }
    }
  },
  mounted () {
    // 获取当前设备屏幕宽度
    this.clientWidth = document.documentElement.clientWidth
  },
  methods: {
    // 关闭模态框
    setVisible () {
      this.$emit('input', false)
    },
    // 初始化轮播图
    setInitialSlide () {
      let initialDisplacement = this.clientWidth * this.initialSlide
      this.displacement = initialDisplacement
      this.$refs.medioList.style.transform = `translate3d(-${initialDisplacement}px, 0px, 0px)`
      document.getElementsByClassName('medio-list-slide')[this.indexes].firstChild.classList.add('list-slide-active-img')
      this.addLIstenerForImg()
    },
    // 切换轮播图
    addLitenerForSlideshow () {
      let swiper = document.querySelector('.slideshow-wrapper')
      swiper.addEventListener('touchstart', (e) => {
        // console.log('touchstart')
        this.isMoved = false
        this.$set(this.startCoordinates, 'clientX', e.touches[0].clientX)
        this.$set(this.startCoordinates, 'clientY', e.touches[0].clientY)
      }, true)
      swiper.addEventListener('touchmove', (e) => {
        this.isMoved = true
        this.$set(this.currentCoordinates, 'clientX', e.touches[0].clientX)
        this.$set(this.currentCoordinates, 'clientY', e.touches[0].clientY)
      }, true)
      swiper.addEventListener('touchend', (e) => {
        if (this.isMoved && this.temporaryDisplacement !== 0 && !this.istouch) {
          this.num = this.temporaryDisplacement
          let slideLength = this.displacement - this.temporaryDisplacement
          this.$refs.medioList.style.transitionDuration = '300ms'
          if (Math.abs(slideLength) > 50) {
            let direction = slideLength > 0 ? 1 : -1
            let endLength = this.displacement - (this.clientWidth * direction)
            this.displacement = endLength
            this.$refs.medioList.style.transform = `translate3d(-${endLength}px, 0px, 0px)`
            this.addClassForImg()
          } else {
            this.$refs.medioList.style.transform = `translate3d(-${this.displacement}px, 0px, 0px)`
          }
        }
      }, true)
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
    // img添加active类名
    addClassForImg () {
      this.medioData.forEach((element, index) => {
        let slideNode = document.getElementsByClassName('medio-list-slide')[index].firstChild
        if (slideNode.tagName === 'IMG') {
          slideNode.className = ''
        }
      })
      document.getElementsByClassName('medio-list-slide')[this.indexes].firstChild.classList.add('list-slide-active-img')
    },
    addLIstenerForImg () {
      let dom = document.getElementsByClassName('list-slide-active-img')[0]
      this.setGesture(dom)
    },
    // 手势事件
    setGesture (dom) {
      dom.addEventListener('touchstart', (e) => {
        this.num = e.touches.length
        if (e.touches.length >= 2) { // 判断是否有两个点在屏幕上
          this.istouch = true
          this.secondFinger.start = e.touches // 得到第一组两个点
        };
      }, false)
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length >= 2 && this.istouch) {
          let now = e.touches // 得到第二组两个点
          let scale = this.getDistance(now[0], now[1]) / this.getDistance(this.secondFinger.start[0], this.secondFinger.start[1]) // 得到缩放比例，getDistance是勾股定理的一个方法
          dom.style.transform = `translate3d(0px, 0px, 0px) scale(${scale.toFixed(2)})`
        };
      }, { passive: false })
      document.addEventListener('touchend', (e) => {
        if (this.istouch) {
          this.istouch = false
        };
      }, false)
    },
    // 辅助方法
    getDistance (p1, p2) {
      let x = p2.pageX - p1.pageX
      let y = p2.pageY - p1.pageY
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
  /* transition-duration: 0ms; */
  /* transform: translate3d(-320px, 0px, 0px); */
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
}
.slide-pagination {
  position: absolute;
  text-align: center;
  -webkit-transition: .3s opacity;
  -o-transition: .3s opacity;
  transition: .3s opacity;
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
