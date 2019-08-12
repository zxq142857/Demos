<template>
  <div class="slideshow__model" v-show="value" @click.self="setVisible">
    <div class="slideshow-wrapper">
      <div class="medio-list" ref="medioList">
        <div class="medio-list-slide" v-for="(item,index) in medioData" :key="index">
          <img :src="item" alt="slide-img" >
        </div>
      </div>
    </div>
    <div class="slide-pagination">
      <span class="swiper-pagination-bullets" v-for="(item,index) in medioData" :key="index"></span>
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
      clientWidth: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 获取当前设备屏幕宽度
      this.clientWidth = document.documentElement.clientWidth
      // 初始化轮播图
      this.setInitialSlide()
    })
  },
  methods: {
    // 关闭模态框
    setVisible () {
      this.$emit('input', false)
    },
    setInitialSlide () {
      let initialDisplacement = this.clientWidth * this.initialSlide
      this.$refs.medioList.style.transform = `translate3d(-${initialDisplacement}px, 0px, 0px)`
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (!newValue) return
      this.$nextTick(() => {
        let medioListWrapper = document.querySelector('.medio-list')
        let medioList = document.querySelectorAll('.medio-list .medio-list-slide')
        let vw = document.documentElement.clientWidth
        // medioListWrapper.style.width = medioList.length * vw + 'px'
      })
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
  box-sizing: border-box;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform;
  transition-property: transform,-webkit-transform;
}
.medio-list .medio-list-slide img{
  width: 100%;
  height:auto;
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
</style>
