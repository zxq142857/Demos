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
        <div class="item" @click="showDemo('home')">
          <div class="item-content">
            <div class="item-title">合理使用监听事件</div>
            <div class="item-time">2019-08-07</div>
          </div>
          <div class="item-tmg">
            <img src="./../assets/images/listener.jpg" alt="">
          </div>
        </div>
        <div class="item" @click="showDemo('about')">
          <div class="item-content">
            <div class="item-title">合理使用监听事件</div>
            <div class="item-time">2019-08-07</div>
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
import { setInterval } from 'timers'
export default {
  name: 'index',
  data () {
    return {
      devicePixelRatio: 0,
      slipeDirection: null,
      currentPage: 'firstPage'
    }
  },
  mounted () {
    this.devicePixelRatio = window.devicePixelRatio
    this.$nextTick(() => {
      this.$Tools.getElementTouchMovelength(this.$refs.firstPage, (slipeDirection) => {
        if (slipeDirection.up && this.currentPage === 'firstPage') {
          this.showNextPage()
          this.currentPage = 'nextPage'
        }
      })
      this.$Tools.getElementTouchMovelength(this.$refs.nextPage, (slipeDirection) => {
        if (slipeDirection.down && this.currentPage === 'nextPage') {
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
      setTimeout(() => {
        this.$refs.index.style.overflow = 'scroll'
        let scrolllength = document.body.scrollTop
        let timer = setInterval(() => {
          if (document.body.scrollTop !== 0) {
            document.body.scrollTop = document.body.scrollTop - 1
          } else {
            clearInterval(timer)
          }
        }, scrolllength)
      }, 10)
    },
    hideNextPage () {
      this.$refs.firstPage.style.animationName = 'showfirstpage'
      this.$refs.header.style.animationName = 'hideHeader'
      setTimeout(() => {
        this.$refs.index.style.overflow = 'hidden'
      }, 10)
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
  height: -webkit-calc(100vh - 45px);
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
    min-height: -webkit-calc(100vh - 45px);
    min-height: calc(100vh - 45px);
    background-color: #f3f3f3;
    padding: 10px 0 10px;
    box-sizing: border-box;
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
        flex: 1;
        .item-title {
          font-size: 20px;
          font-weight: 700;
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
}
</style>
