import Vue from 'vue'
import Router from 'vue-router'

const login = r => require.ensure([], () => r(require('../page/login')), 'login')/* 登录 */
// 首页
const index = r => require.ensure([], () => r(require('../page/index')), 'index')
const mine = r => require.ensure([], () => r(require('../page/mine')), 'mine') //我的
const setUp = r => require.ensure([], () => r(require('../page/设置')), 'setUp')/* 设置 */
const myEnroll = r => require.ensure([], () => r(require('../page/我的推荐')), 'myEnroll')/* 设置 */
const postionDetail = r => require.ensure([], () => r(require('../page/职位详情')), 'postionDetail')/* 职位详情*/
const inputInfo = r => require.ensure([], () => r(require('../page/简历填写')), 'inputInfo')/* 简历填写*/
const myNews = r => require.ensure([], () => r(require('../page/我的信息')), 'inputInfo')/* 我的信息*/



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/index',
      name: '求职中心',
      meta: {nokeepAlive: true, keepLogin: false},
      component: index
    },
    {
      path: '/mine',
      name: '我的',
      meta: {nokeepAlive: true, keepLogin: false},
      component: mine
    },
    {
      path: '/login',
      name: '登录',
      meta: {nokeepAlive: true, keepLogin: false},
      component: login
    },
    {
      path: '/setUp',
      name: '设置',
      meta: {nokeepAlive: true, keepLogin: true},
      component: setUp
    },
    {
      path: '/myEnroll',
      name: '我的推荐',
      meta: {nokeepAlive: true, keepLogin: true},
      component: myEnroll
    },
    {
      path: '/postionDetail',
      name: '职位详情',
      meta: {nokeepAlive: true, keepLogin: true},
      component: postionDetail
    },
    {
      path: '/inputInfo',
      name: '投递简历',
      meta: {nokeepAlive: true, keepLogin: true},
      component: inputInfo
    },
    {
      path: '/myNews',
      name: '我的信息',
      meta: {nokeepAlive: true, keepLogin: true},
      component: myNews
    },
  ]
})

