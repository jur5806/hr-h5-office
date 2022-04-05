/**
 * 配置编译环境和线上环境之间的切换
 *
 */
let ossUrl;
let channelId;
let phone;
let parkToken;
if (process.env.NODE_ENV == 'development') {
  ossUrl = 'http://test-media-api.test176.cn'//测式网
  // 本地调试时配置的信息
  localStorage.setItem('channelAppLogoUrl', 'http://test-main.test176.cn/upload/logo/api1536550090002.jpg')
  localStorage.setItem('companyApiUrl', 'https://test-mh-api.test176.cn/')
  localStorage.setItem('channelApiUrl', 'http://test-pk-m.test176.cn/')
  localStorage.setItem('channelChannelApiUrl', 'http://test-trgj.test176.cn/')
} else {
  ossUrl = window.location.origin;
  // serverUrl = 'http://test-main.zhihuipk.com/'
}
export {
  ossUrl
}
