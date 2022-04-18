// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import App from './App'
import router from './router'
import store from './story/'
import components from './components/'
import vueQr from 'vue-qr'

import './config/rem'
import * as mobile from './config/mUtils'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import AMap from 'vue-amap'
import {Popup} from 'vue-ydui/dist/lib.rem/popup'
import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio'
import {ProgressBar} from 'vue-ydui/dist/lib.rem/progressbar'
import {Confirm, Alert, Toast, Notify, Loading} from 'vue-ydui/dist/lib.rem/dialog'
import {Slider, SliderItem} from 'vue-ydui/dist/lib.rem/slider'
import {Switch} from 'vue-ydui/dist/lib.rem/switch'
import { CitySelect } from 'vue-ydui/dist/lib.rem/cityselect'
import { CheckBox,CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
import 'vue-ydui/dist/ydui.base.css'
import 'vue-ydui/dist/ydui.rem.css'
import {DateTime} from 'vue-ydui/dist/lib.rem/datetime'
import { Step, StepItem } from 'vue-ydui/dist/lib.rem/step';
import {ActionSheet} from 'vue-ydui/dist/lib.rem/actionsheet'
import './config/options'
import leftslidedel from './plugins/leftslidedel'
import { ossUrl } from './config/env'

Vue.component(Step.name, Step);
Vue.component(StepItem.name, StepItem);
Vue.component(ActionSheet.name, ActionSheet)
Vue.component(CitySelect.name, CitySelect);
Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);


import 'vue-ydui/dist/ydui.base.css'

import * as getData from './service/getData'
// 图片懒加载
import VueLazyload from 'vue-lazyload'
import clickoutside from './plugins/clickoutside'

Object.keys(components).forEach((key) => {
  // 首字母大写
  var name = key.replace(/(\w)/, (v) => v.toUpperCase())
  Vue.component(`v${name}`, components[key])
})

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'http://park.hzqisheng.cn/404.png',
  loading: 'http://park.hzqisheng.cn/loading-spin.svg',
  attempt: 1
})
Vue.use(Vant)
Vue.component('vueQr', vueQr)
Vue.component(Popup.name, Popup)
Vue.use(VueAwesomeSwiper)
Vue.use(AMap)
Vue.component(Popup.name, Popup)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(ProgressBar.name, ProgressBar)
Vue.component(Slider.name, Slider)
Vue.component(SliderItem.name, SliderItem)
Vue.component(Switch.name, Switch)
Vue.component(DateTime.name, DateTime)
Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
}
Vue.prototype.previewImage = (e) => {
  if (e.target.nodeName == 'IMG') {
    let url = e.target.currentSrc;
    store.state.previewImages = []
    store.state.previewImages.push(url)
  } else {
    return;
  }
}

let domainUrl = ossUrl
let url = domainUrl + '/'
let cookieDomain = domainUrl.slice(domainUrl.indexOf('.'))
mobile.setSession('domain', cookieDomain)

let isFirst = sessionStorage.getItem('first')
if (!isFirst) {
  sessionStorage.setItem('first', 0)
}

// 判断是否是微信浏览器
let wapInfo = navigator.userAgent.toLowerCase()
let isWeixin = wapInfo.indexOf('micromessenger') != -1
mobile.setSession('isWx', isWeixin)
localStorage.setItem('isWx', isWeixin)

router.beforeEach((to, from, next) => {
  let channelId=to.query.channelId || 1;
  let parkToken='';
  if(channelId==undefined){
    channelId=mobile.getSession('channelId')
  }
  if(to.query.parkToken==undefined){
    parkToken=mobile.getSession('parkToken');
    store.state.parkToken = parkToken
  }else{
    parkToken=to.query.parkToken
    mobile.setSession('parkToken', parkToken, '', cookieDomain)
    store.state.parkToken = parkToken
  }
  let userPhone = to.query.userPhone
  if (userPhone==undefined){
    userPhone = mobile.getSession('userPhone')
    store.state.userPhone = userPhone;
  } else {
    userPhone = to.query.userPhone
    mobile.setSession('userPhone', userPhone, '', cookieDomain)
    store.state.userPhone = userPhone
  }
  const reg = /\?[\s\S]*#/
  let nowUrl = window.location.href
  if (reg.test(nowUrl)) {
    let arr = nowUrl.split('?')
    let arr2 = arr[1].split('#')
    const domain = arr[0]
    const myArg = arr[2]
    const ortherArg = arr2[0]
    const page = arr2[1]
    if (myArg) {
      nowUrl = domain + '#' + page + '?' + myArg + '&' + ortherArg
    } else {
      nowUrl = domain + '#' + page + '?' + ortherArg
    }
    window.location.replace(nowUrl)
    return
  }
  let urlArr = ['channelAppLogoUrl', 'companyApiUrl', 'channelApiUrl', 'channelMortarApiUrl','channelIncubationUrl', 'channelChannelApiUrl','channelChannelApiUrl']
  urlArr.forEach((item) => {
    let url = localStorage.getItem(item)
    url && (store.state[item] = url)
  })
  next()
  // getData.getChannelByUrl(url).then(res => {
  //   let channelInfo = res.data.data.channel
  //   store.state.webTitle = channelInfo.channelName
  //   store.state.channelId = channelInfo.channelId
  //   store.state.channelName = channelInfo.channelName
  //   store.state.channelAppLogoUrl = channelInfo.channelAppLogoUrl
  //   store.state.companyApiUrl = channelInfo.channelCompanyApiUrl
  //   store.state.channelApiUrl = channelInfo.channelApiUrl
  //   store.state.channelMortarApiUrl = channelInfo.channelMortarApiUrl
  //   store.state.channelIncubationUrl = channelInfo.channelIncubationUrl
  //   store.state.channelArchivesApiUrl = channelInfo.channelArchivesApiUrl
  //   store.state.channelChannelApiUrl = channelInfo.channelChannelApiUrl
  //   store.state.channelMediaFrontUrl = channelInfo.channelMediaFrontUrl.substring(0,channelInfo.channelMediaFrontUrl.length-1)
  //   store.state.userPhone = userPhone

  //   // cookie存储
  //   mobile.setCookie('channelId', channelId, '', cookieDomain)
  //   // mobile.setCookie('parkToken', parkToken, '', cookieDomain)
  //   // mobile.setCookie('userPhone', userPhone, '', cookieDomain)
  //   //session存储
  //   mobile.setSession('channelId', channelId, '', cookieDomain)
  //   // mobile.setSession('parkToken', parkToken, '', cookieDomain)
  //   mobile.setSession('userPhone', userPhone, '', cookieDomain)
  //   mobile.setSession('channelMediaFrontUrl', channelInfo.channelMediaFrontUrl.substring(0,channelInfo.channelMediaFrontUrl.length-1), '', cookieDomain)
  //   mobile.setSession('channelMortarApiUrl', channelInfo.channelMortarApiUrl, '', cookieDomain)
  //   mobile.setSession('channelCompanyApiUrl', channelInfo.channelCompanyApiUrl, '', cookieDomain)
  //   mobile.setSession('channelIncubationUrl', channelInfo.channelIncubationUrl, '', cookieDomain)

  //   document.querySelector('title').innerHTML = store.state.webTitle
  //   if (mobile.getStore('parkToken')) {
  //     mobile.setCookie('userToken', mobile.getStore('parkToken'), '', cookieDomain)
  //     mobile.setCookie('userMobile', mobile.getStore('userPhone'), '', cookieDomain)
  //   } else if (mobile.getCookie('parkToken')) {
  //     mobile.setStore('parkToken', mobile.getCookie('parkToken'))
  //     mobile.setStore('userPhone', mobile.getCookie('userPhone'))
  //     mobile.setCookie('userToken', mobile.getCookie('parkToken'), '', cookieDomain)
  //     mobile.setCookie('userMobile', mobile.getCookie('userPhone'), '', cookieDomain)
  //   }

  //   let parkToken = store.state.parkToken || mobile.getStore('parkToken')

  //   if (to.name !== 'login' && parkToken) {
  //     /* getData.getUserDetail().then(res => {
  //      let user = res.data.data.user;
  //      mobile.setStore('userConfirmState', user.userConfirmState)
  //      }) */
  //   }

  //   if (window.screen.height === 812 && window.screen.width === 375) {
  //     store.state.h5phoneType = 1
  //   }
  //   if (to.query.platform) {
  //     store.state.platform = to.query.platform
  //     store.state.phoneType = to.query.phoneType
  //     store.state.userPhone = to.query.userPhone
  //     store.state.parkToken = to.query.parkToken
  //     store.state.channelId = to.query.channelId
  //     document.title = to.name
  //   } else if (to.query.parkToken) {
  //     store.state.parkToken = to.query.parkToken
  //   } else if (mobile.getStore('parkToken')) {
  //     store.state.parkToken = mobile.getStore('parkToken')
  //   }
  //   // if (to.matched.some(record => record.meta.keepLogin)) {
  //   //   if (!store.state.parkToken && !mobile.getStore('parkToken')) {
  //   //     if (Number(to.query.shareNum) === 1) {
  //   //       mobile.setSession('paths', to.path)
  //   //       mobile.setSession('tempQuery', to.query)
  //   //     }
  //   //     router.replace('/login')
  //   //     mobile.removeStore('parkToken')
  //   //     store.state.parkToken = ''
  //   //     return false
  //   //   }
  //   // }
  //   if (store.state.platform) {
  //     document.title = to.name
  //     if (to.path === '/additionalServices') {
  //       document.title = '新增' + to.query.orderTypeName
  //     }
  //   }
  //   next()
  // }).catch(error => {
  //   next()
  // })
})
router.afterEach((to, from, next) => {
  let getfirst = sessionStorage.getItem('first')
  if (!(to.name == '首页' && from.name == null && getfirst <= 3)) {
    getfirst++
    sessionStorage.setItem('first', getfirst)
    store.state.first = getfirst
  }
})


Vue.prototype.bridges = {
  // 焦点消失
  allBlur () {
    document.activeElement.blur()
  },
  /**
   * 使window滑到顶部
   */
  scrollToTop () {
    window.scrollTo(0, 0)
  },
  GoBack () {
    if (store.state.platform === 'iOS') {
      window.webkit.messageHandlers.GoBack.postMessage({})
      return
    }
    if (store.state.platform === 'Android') {
      window.test.GoBack()
      return
    }
  },
  intentToScanCode () {
    if (store.state.platform === 'iOS') {
      window.webkit.messageHandlers.intentToScanCode.postMessage({})
      return
    }
    if (store.state.platform === 'Android') {
      window.test.intentToScanCode()
      return
    }
  },
  LinkInteraction (url) {
    if (store.state.platform === 'iOS') {
      window.webkit.messageHandlers.LinkInteraction.postMessage({url: url})
      return
    }
    if (store.state.platform === 'Android') {
      window.test.LinkInteraction(url)
      return
    }
  },
  Call (tel) {
    if (store.state.platform === 'Android') {
      window.test.Call(tel)
      return
    }
  },
  SendMsg (tel) {
    if (store.state.platform === 'Android') {
      window.test.sendMsg(tel)
      return
    }
  }
}

AMap.initAMapApiLoader({
  key: 'f08316066bbed1f168a371a9368ca524',
  plugin: [],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.9'
})

Vue.directive('leftslidedel', leftslidedel)// 自定义左滑删除操作指令
Vue.directive('clickoutside',//自定义点击元素范围外触发的指令
  clickoutside
)
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

