<template>
  <div class="animation-demo" ref="animationDemo" @touchmove.prevent>
    <div class="show-main">
      <!-- 测试margin -->
      <div class="box one"></div><div class="box two"></div>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'animation',
  data () {
    return {
      querydata: this.$route.query.name
    }
  }
}
</script>

<style>
    @keyframes slideAnimation {
      from {left: 0;}
      to {left: 66.6%;}
    }
    .animation-demo {
      width: 100%;
      height: 100vh;
    }
    .show-main {
      width: 80%;
      height: 300px;
      border: 1px dashed #fa4639;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      box-sizing: border-box;
      background-size: 50px 50px;
      background-repeat: space;
      outline: 10px dashed green;
      outline-offset: 10px;
    }
    .show-main .box {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      position: absolute;
      margin-top: 25px;
    }
    .one {
      background-color: #317EF3;
      animation: slideAnimation 2s linear infinite alternate
    }
    .two {
      opacity: .5;
      top: 50%;
      background-color: aqua;
      animation: slideAnimation 2s linear -2s infinite alternate;
    }
</style>
