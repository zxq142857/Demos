<template>
  <div ref="cssModel" class="css-model">
    <header>CSSModel</header>
    <!-- 模型展示 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'css-model',
  mounted () {
    this.$Tools.getElementTouchMovelength(this.$refs.cssModel, (slipeDirection) => {
      if (slipeDirection.left) {
        this.$router.back()
      }
    })
  }
}
</script>

<style lang="less" scoped>
.css-model {
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
