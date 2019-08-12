<template>
  <div class="progress">
    <div class="progress-bar"></div>
  </div>
</template>

<script>
export default {
  name: 'progress-bar',
  data () {
    return {
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
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
  /* 进度条 */
  .progress-bar {
    --c: #0067ff;
    --progress: 10%;
    height: 15px;
    background-color: silver;
    border-radius: 30px;
    background-image: radial-gradient(closest-side circle at var(--progress),var(--c),var(--c) 90%, transparent);
    background-repeat: no-repeat;
    -webkit-background-size: 100%,var(--progress);
    overflow: hidden;
  }
  .progress-bar::after {
    content: '';
    display: block;
    width: var(--progress);
    height: 100%;
    background-image: linear-gradient(var(--c),var(--c));
  }
</style>
