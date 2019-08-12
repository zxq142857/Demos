<template>
  <div ref="index" id="index">
    <header ref="header" class="page-header">
      <div class="header-title"></div>
      <img src="./../assets/images/treehouse-logo.png" alt="logo">
    </header>
    <section class="content-section">
      <!-- 首屏页面 -->
      <div ref="firstPage" class="first-page">
        <div class="tree-img"></div>
      </div>
      <!-- 详细内容 -->
      <div ref="nextPage" class="content-page">
        <div v-for = "(item, index) in allDemos" :key="index" class="item border" @click="showDemo(item.path)">
          <div class="item-content">
            <div class="item-title elliptical">{{ item.name }}</div>
            <div class="item-time">{{ item.createTime }}</div>
          </div>
          <div class="item-tmg">
            <img src="./../assets/images/listener.jpg" alt="">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      devicePixelRatio: 0,
      slipeDirection: null,
      currentPage: 'firstPage',
      allDemos: [
        {
          name: 'outline-offset属性和Animation动画',
          createTime: '2019-08-08',
          path: 'cssmodel/animation'
        },
        {
          name: 'Animation动画--太极图',
          createTime: '2019-08-09',
          path: 'cssmodel/taiji'
        },
        {
          name: 'Animation动画--进度条',
          createTime: '2019-08-09',
          path: 'cssmodel/progressbar'
        },
        {
          name: 'Bootstrap--地址选择器',
          createTime: '2019-08-09',
          path: 'jsmodel/addresspicker'
        },
        {
          name: 'MINISLIDESHOW',
          createTime: '2019-08-12',
          path: 'jsmodel/minislideshow'
        }
      ]
    }
  },
  mounted () {
    this.devicePixelRatio = window.devicePixelRatio
    this.$nextTick(() => {
      this.$refs.firstPage.addEventListener('touchmove', (e) => {
        e.preventDefault()
      }, false)
      this.$Tools.getElementTouchMovelength(this.$refs.firstPage, (slipeDirection) => {
        if (slipeDirection.up && this.currentPage === 'firstPage') {
          this.showNextPage()
          this.currentPage = 'nextPage'
        }
      })
      this.$Tools.getElementTouchMovelength(this.$refs.nextPage, (slipeDirection) => {
        if (slipeDirection.down && this.currentPage === 'nextPage' && this.$refs.nextPage.scrollTop === 0) {
          this.hideNextPage()
          this.currentPage = 'firstPage'
        }
      })
    })
  },
  methods: {
    showNextPage () {
      this.$refs.firstPage.style.animationName = 'hidefirstpage'
      this.$refs.header.style.animationName = 'showHeader'
    },
    hideNextPage () {
      this.$refs.firstPage.style.animationName = 'showfirstpage'
      this.$refs.header.style.animationName = 'hideHeader'
    },
    showDemo (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang='less' scoped>
#index {
  overflow: hidden;
  height: 100vh;
  -webkit-overflow-scrolling: touch;
  position: relative;
}
// 头部
.page-header {
  height: 45px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
  opacity: 0;
  animation-name: none;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  div{
    width: 60vw;
    height: 45px;
    background: url('./../assets/images/title-logo.png') no-repeat;
    background-size: 100% 45px;
  }
  >img {
    width: 45px;
    height: 45px;
  }
}
// 内容展示板块
.content-section {
  height: calc(100vh - 45px);
  // 首屏页面
  .first-page {
    height: 100%;
    background: url('./../assets/images/title-logo.jpg') no-repeat;
    background-size: 80%;
    overflow: hidden;
    background-position-x: center;
    background-position-y: -webkit-calc(70vh - 45px);
    background-position-y: calc(75vh - 45px);
    animation-name: none;
    animation-duration: 1.5s;
    animation-fill-mode: forwards;
    .tree-img {
      background: url('./../assets/images/logo.png') no-repeat;
      background-size: 100% 80%;
      height: 85vh;
    }
  }
  // 主体内容区
  .content-page {
    height: 100%;
    background-color: #f3f3f3;
    padding: 10px 0 10px;
    box-sizing: border-box;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .item {
      border-radius: 5px;
      height: 110px;
      margin: 0 16px 10px;
      padding: 0 10px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-content {
        width: calc(100vw - 52px - 60px);
        .item-title {
          font-size: 20px;
          font-weight: 700;
          line-height: 22px;
        }
        .item-time {
          font-size: 14px;
          height: 60px;
          line-height: 60px;
        }
      }
      .item-tmg img{
        width: 60px;
        height: 60px;
      }
    }
  }
  .border { border: 1px solid #999 }
  @media screen and (-webkit-min-device-pixel-ratio: 2) {
      .border { border: 0.5px solid #999 }
  }
  @media screen and (-webkit-min-device-pixel-ratio: 3) {
      .border { border: 0.333333px solid #999 }
  }
}
</style>
