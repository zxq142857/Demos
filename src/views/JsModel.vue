<template>
  <div class="js-model">
    <header>JsModel</header>
    <!-- 模型展示 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'js-model'
}
</script>

<style lang="less" scoped>
.js-model {
  width: 100%;
  height: 100vh;
}
header {
  height: 45px;
  text-align: center;
  line-height: 45px;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
}
</style>
