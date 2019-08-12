<template>
  <div class="medio-show">
    <div class="images-list" v-if="medioData.length">
      <img v-for="(item,index) in medioData" :key="index" :src="'http://images.ehaofang.com/' + item.imageUrl" alt="img" @click="showSlideShow(index)">
    </div>
    <MiniSlideShow
      v-model="slideshowVisible"
      :medioData="slideMedioData"
      :initialSlide="initialSlide"
      v-if="slideshowVisible"></MiniSlideShow>
  </div>
</template>

<script>
export default {
  name: 'mini-slideshow',
  components: {
    MiniSlideShow: () => import('@/components/MiniSlideShow.vue')
  },
  created () {
    this.getImages()
  },
  data () {
    return {
      medioData: [],
      slideMedioData: [],
      slideshowVisible: false,
      initialSlide: 0
    }
  },
  methods: {
    async getImages () {
      let res = await this.$axios.get('http://qudaoapi.ehaofang.net/api/v1/check/203')
      if (res.data.code === 200) {
        this.medioData = res.data.data.fenXiaoImage
        let slideMedioData = []
        res.data.data.fenXiaoImage.forEach((element, index) => {
          slideMedioData.push('http://images.ehaofang.com/' + element.imageUrl)
        })
        this.slideMedioData = slideMedioData
      }
    },
    showSlideShow (index) {
      this.initialSlide = index
      this.slideshowVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.medio-show {
  height: calc(100vh - 45px);
  padding: 16px;
  box-sizing: border-box;
  background-color: #f3f3f3;
  .images-list {
    img {
      width: 30%;
      height: 70px;
      border-radius: 2%;
      &:not(:nth-child(3n)) {
        margin-right: 5%;
      }
    }
  }
}
</style>
