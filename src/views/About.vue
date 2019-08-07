<template>
  <div class="about-demo" ref="abuoutDemo">
    <div class="show-main">
    <!-- 测试margin -->
    <div class="progress-bar"></div>
    <div class="box one"></div><div class="box two"></div>

    <!-- 测试角向渐变 -->
    <!-- <div class="pie-chart"></div> -->

  </div>
  </div>
</template>

<script>
export default {
  name: 'about',
  data () {
    return {
      querydata: this.$route.query.name,
      timer: null
    }
  },
  mounted () {
    let percentage = 0
    this.timer = setInterval(() => {
      if (percentage > 99) {
        percentage = 0
      }
      percentage += 5
      document.querySelector('.progress-bar').setAttribute('style', `--progress:${percentage}%`)
    }, 100)
    this.$Tools.getElementTouchMovelength(this.$refs.abuoutDemo, (slipeDirection) => {
      if (slipeDirection.left) {
        this.$router.back()
      }
    })
  },
  created () {
    console.log(this.querydata)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style>
    @keyframes slideAnimation {
      from {left: 0;}
      to {left: 66.6%;}
    }
    .about-demo {
      width: 100%;
      height: 100vh;
    }
    /* <!-- 测试margin --> */
    .show-main {
      width: 80%;
      height: 300px;
      border: 1px dashed #fa4639;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      box-sizing: border-box;
      /* background-image: url('./bgc.jpg'); */
      background-size: 50px 50px;
      background-repeat: space;
      outline: 10px dashed green;
      outline-offset: 10px;
    }
    .show-main .box {
      width: 100px;
      height: 100px;
      /* display: inline-block; */
      border-radius: 50%;
      position: absolute;
      animation: slideAnimation 2s linear infinite alternate;
    }
    .one {
      /* margin-left: -50px;  */
      /* margin-right: -50px; */
      /* margin-top: 50px; */
      /* margin-bottom: -50px; */
      background-color: #317EF3;
    }
    .two {
      opacity: .5;
      top: 50%;
      background-color: aqua;
      animation-delay: 2s !important;
    }
    .show-main:hover .box {
      animation-play-state: paused;
    }
    /* <!-- 测试角向渐变 --> */
    .pie-chart {
      margin: auto;
      width: 200px;
      height: 200px;
      border-radius: 100px;
      background: conic-gradient(aqua 0 30%,green 30% 60%,blue 60% 100%);
    }

    .progress-bar {
      --c: #0067ff;
      --progress: 0%;
      height: 15px;
      background-color: silver;
      border-radius: 30px;
      background-image: -webkit-radial-gradient(closest-side circle at var(--progress),var(--c),var(--c) 100%, transparent),linear-gradient(var(--c), var(--c)); /* Safari 5.1 - 6.0 */
      background-image: -o-radial-gradient(closest-side circle at var(--progress),var(--c),var(--c) 100%, transparent),linear-gradient(var(--c), var(--c)); /* Opera 11.6 - 12.0 */
      background-image: -moz-radial-gradient(closest-side circle at var(--progress),var(--c),var(--c) 100%, transparent),linear-gradient(var(--c), var(--c)); /* Firefox 3.6 - 15 */
      background-image: radial-gradient(closest-side circle at var(--progress),var(--c),var(--c) 100%, transparent),linear-gradient(var(--c), var(--c)); /* 标准的语法（必须放在最后） */
      background-size: 100%,var(--progress);
      background-repeat: no-repeat;
    }
</style>
