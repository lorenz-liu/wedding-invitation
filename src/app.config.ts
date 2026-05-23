export default defineAppConfig({
  pages: [
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '刘兆薰 & 高文珩',
    navigationBarTextStyle: 'black'
  },
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于在地图上显示您与婚礼场地的相对位置'
    }
  },
  requiredPrivateInfos: ['getLocation']
})
