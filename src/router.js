import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/cssmodel',
      name: 'css-model',
      // route level code-splitting
      // this generates a separate chunk (animation.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "animation" */ './views/CssModel.vue'),
      children: [
        {
          path: '/cssModel/animation',
          name: 'animation',
          component: () => import(/* webpackChunkName: "animation" */ './views/cssModel/Animations.vue')
        },
        {
          path: '/cssModel/taiji',
          name: 'taiji',
          component: () => import('./views/cssModel/Taiji.vue')
        },
        {
          path: '/cssModel/progressbar',
          name: 'progress-bar',
          component: () => import('./views/cssModel/ProgressBar.vue')
        }
      ]
    },
    {
      path: '/jsmodel',
      name: 'js-model',
      component: () => import(/* webpackChunkName: "animation" */ './views/JsModel.vue'),
      children: [
        {
          path: '/jsmodel/addresspicker',
          name: 'address-picker',
          component: () => import('./views/jsModel/AddressPicker.vue')
        },
        {
          path: '/jsmodel/minislideshow',
          name: 'mini-slideshow',
          component: () => import('./views/jsModel/MedioShow.vue')
        }
      ]
    }
  ]
})
