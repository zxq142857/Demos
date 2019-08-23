<template>
  <div class="medio-show">
    <MiniSlideShow
      :medioData="slideMedioData"
      ></MiniSlideShow>
  </div>
</template>

<script>
export default {
  name: 'mini-slideshow',
  components: {
    MiniSlideShow: () => import('@/components/MiniSlideShow.vue')
  },
  created () {
    this.slideMedioData = [
      'http://images.ehaofang.com/1901242009-d526ecf3-5e94-4bc7-99df-33c5d253d7d1.jpg',
      'http://images.ehaofang.com/1901242009-8b07535b-6860-42d8-a660-a5120d97c16a.jpg',
      'http://images.ehaofang.com/1901242009-c3ecddb0-98ef-46cd-9393-c1149019105d.jpg',
      'http://images.ehaofang.com/1901242009-a9e047bb-2980-444b-a4fe-60918efc09a3.jpg',
      'http://images.ehaofang.com/1901242009-54f8fc8d-fe4c-4b42-beb5-472ac6cd9776.jpg',
      'http://images.ehaofang.com/1901242009-8cb37303-4d2e-4aff-9d5d-ae82301bd974.jpg',
      'http://images.ehaofang.com/1901242009-5bf69f83-1ea1-4048-bae7-b4a11b330e34.jpg',
      'http://images.ehaofang.com/1901242009-2e26597a-fd03-4bee-9601-6e914ad26591.jpg',
      'http://images.ehaofang.com/1901242009-f6a2f59f-fe58-423a-be0c-306a4e459d09.jpg',
      'http://images.ehaofang.com/1901242009-56cead4a-3442-4362-b72d-aaaa6a8cea5e.jpg',
      'http://images.ehaofang.com/1901242009-5c55fa1a-e494-4ff2-8a74-01441e796c0a.jpg',
      'http://images.ehaofang.com/1901242009-fe7ebe9d-9277-48c5-9729-b7fb6c217568.jpg',
      'http://images.ehaofang.com/1901242009-d526ecf3-5e94-4bc7-99df-33c5d253d7d1.jpg',
      'http://images.ehaofang.com/1901242009-8b07535b-6860-42d8-a660-a5120d97c16a.jpg']
  },
  data () {
    return {
      slideMedioData: []
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.medio-show {
  height: calc(100vh - 45px);
  padding: 16px;
  box-sizing: border-box;
  background-color: #f3f3f3;
}
</style>
