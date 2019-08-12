<template>
  <div class="taiji">
    <!-- 测试角向渐变 -->
    <!-- <div class="pie-chart"></div> -->
    <!-- 太极图 -->
    <div class="taiji-container">
      <div class="taiji">
        <div class="circle-01"></div>
        <div class="circle-02"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tiaji'
}
</script>

<style lang="less" scoped>
  /* <!-- 测试角向渐变 --> */
  .pie-chart {
    margin: auto;
    width: 200px;
    height: 200px;
    border-radius: 100px;
    background: conic-gradient(aqua 0 30%,green 30% 60%,blue 60% 100%);
  }
  /* 太极图 */
  .taiji-container {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
  .taiji-container .taiji {
    width: 100%;
    height: 100%;
    position: relative;
    margin: 50px auto;
    border-radius: 100%;
    background-color: #000;
    overflow: hidden;
    box-shadow: 0 0 50px rgba(0, 0, 0, .8);
    -webkit-animation:rotation 2.5s linear infinite;
    -o-animation:rotation 2.5s linear infinite;
    -moz-animation:rotation 2.5s linear infinite;
    animation:rotation 2.5s linear infinite;
  }
  .taiji-container .taiji:before,
  .taiji-container .taiji:after {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    display: block;
    content: "";
  }
  .taiji-container .taiji:before {
    left: 0;
    border-radius: 100% 0 0 100%/50% 50%;
    background-color: #000;
  }
  .taiji-container .taiji:after {
    right: 0;
    border-radius: 0 100% 100% 0/50% 50%;
    background-color: #fff;
  }
  .circle-01,
  .circle-02 {
    width: 50%;
    height: 50%;
    position:absolute;
    z-index:2;
    border-radius: 75%;
  }
  .circle-01 {
    top: 0;
    left: 25%;
    background-color:#000;
  }
  .circle-02 {
    bottom: 0;
    right: 25%;
    background-color:#fff;
  }
  .circle-01:after,
  .circle-02:after {
    width: 37.5%;
    height: 37.5%;
    position: absolute;
    z-index: 3;
    display: block;
    content: "";
    border-radius: 50%;
  }
  .circle-01:after {
    top: 30%;
    left: 31.5%;
    background-color:#fff;
  }
  .circle-02:after {
    bottom: 30%;
    right: 31.5%;
    background-color:#000;
  }
  @keyframes rotation {
    0% {transform:rotate(0deg);}
    100% {transform:rotate(360deg);}
  }
  @-webkit-keyframes rotation {
    0% {-webkit-transform:rotate(0deg);}
    100% {-webkit-transform:rotate(360deg);}
  }
  @-moz-keyframes rotation {
    0% {-moz-transform:rotate(0deg);}
    100% {-moz-transform:rotate(360deg);}
  }
</style>
