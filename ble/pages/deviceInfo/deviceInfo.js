// import { transToQuery } from '@utils/index'

// //生成arrayBuffer
// function generateBuffer(request) {
//   let buffer_request = []
//   for (let i = 0; i < request.length; i++) {
//     let buffer_item = new ArrayBuffer(request[i].length)
//     let dataView_item = new DataView(buffer_item)
//     for (let j = 0; j < request[i].length; j++) {
//       dataView_item.setUint8(j, request[i][j].charCodeAt())
//     }
//     buffer_request.push(buffer_item)
//   }
//   return buffer_request
// }

Page({
  // data: {
    // selected: 1,
    // color: "#7A7E83",
    // selectedColor: "#3cc51f",
    // //保存'数据收发'页面和'设备信息'页面跳转的路径信息
    // list: [
    //   {
    //     pagePath: "pages/comm/index",
      //   iconPath: "/img/data_receive_send.png",
      //   selectedIconPath: "/img/selected_data_receive_send.png",
      //   text: "收发数据"
      // },
      // {
      //   pagePath: "pages/deviceInfo/deviceInfo",
      //   iconPath: "/img/deviceInfo.png",
    //     selectedIconPath: "/img/selectedDeviceInfo.png",
    //     text: "设备信息"
    //   }
    // ],

    // SSID: '',
    // PASSWORD: '',
    // MAC: '',//MAC地址
    // curId_SCAN: 0,//当前SCAN的ID
    // SCANs: [],//SCAN列表
    // curSCAN: "",//当前SCAN
    // curId_DHCP: 0,//当前DHCP的ID
    // DHCPs: [{ name: 'Enable', id: '1' }, { name: 'Disable', id: '2' }],//DHCP列表
    // curDHCP: "",//当前DHCP
    // IP: '',//IP地址
    // SUBNET: '',//子网掩码
    // GATEWAY: '',//网关
    // RSSI: '',//信号强度
    // BAUD: '',//串口波特率
    // tcpMode: "",//当前TCP的模式
    // isTcpClient: false,
    // isTcpServer: false,
    // HOST: '',//Client模式待连接的服务端IP地址
    // EPORT: '',//Client模式待连接的服务端端口
    // SPORT: '',//Server模式开放的端口

    // deviceName: '设备名称',
    // sendBtnText: '开始发送',
    // condition: 'START',
    // bgColor: 'green',
    // defaultType: true,//眼睛状态   
    // passwordType: true,//密码可见与否状态
  // },
  // _device: null,
  // _origin: null,
  // _recedBuffer: null,

  // onLoad(options) {
  //   const { deviceId, deviceName, serviceId, characteristicId, write, read, notify, indicate, origin } = options
  //   this.setData({ deviceName })
  //   this._device = {
  //     deviceId,
  //     deviceName,
  //     serviceId,
  //     characteristicId,
  //     write: write === 'true' ? true : false,
  //     read: read === 'true' ? true : false,
  //     notify: notify === 'true' ? true : false,
  //     indicate: indicate === 'true' ? true : false
  //   }
  //   this._origin = origin
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow() {
    // var app = getApp()
    // const { SSID, PASSWORD, MAC, SCANs, curId_DHCP, curDHCP, IP, SUBNET, GATEWAY, RSSI, BAUD,
    //   curTCP, HOST, PORT, EPORT, SPORT } = app.globalData
    // this.setData({
    //   SSID, PASSWORD, MAC, SCANs, curId_DHCP, curDHCP, IP, SUBNET, GATEWAY, RSSI, BAUD,
    //   curTCP, HOST, PORT, EPORT, SPORT
    // })
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },

  // switchTab(e) {
  //   const { deviceId, deviceName, serviceId, characteristicId, write, read, notify, indicate } = this._device
  //   const data = e.currentTarget.dataset
  //   const url = '/' + data.path
  //   const query = transToQuery({
  //     deviceId,
  //     deviceName,
  //     serviceId,
  //     characteristicId,
  //     write,
  //     read,
  //     notify,
  //     indicate,
  //     origin: this._origin,
  //   })
  //   wx.reLaunch({ url: `${url}?${query}` })
  //   this.setData({ selected: data.index })
  // },
  // handleSsidChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.SSID) return
  //   app.globalData.changedItems.push("SSID " + e.detail.value + "\r\n")
  //   app.globalData.SSID = e.detail.value
  // },
  // handlePasswordChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.PASSWORD) return
  //   app.globalData.changedItems.push("PASSWORD " + e.detail.value + "\r\n")
  //   app.globalData.PASSWORD = e.detail.value
  // },
  // changeDHCP(e) {
  //   var app = getApp()
  //   if (e.detail.selectId === app.globalData.curId_DHCP) return
  //   app.globalData.changedItems.push("DHCP " + e.detail.select + "\r\n")
  //   app.globalData.curId_DHCP = e.detail.selectId
  //   app.globalData.curDHCP = e.detail.select
  // },
  // handleIpChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.IP) return
  //   app.globalData.changedItems.push("IP " + e.detail.value + "\r\n")
  //   app.globalData.IP = e.detail.value
  // },
  // handleSubnetChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.SUBNET) return
  //   app.globalData.changedItems.push("SUBNET " + e.detail.value + "\r\n")
  //   app.globalData.SUBNET = e.detail.value
  // },
  // handleGatewayChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.GATEWAY) return
  //   app.globalData.changedItems.push("GATEWAY " + e.detail.value + "\r\n")
  //   app.globalData.GATEWAY = e.detail.value
  // },
  // handleBaudChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.BAUD) return
  //   app.globalData.changedItems.push("BAUD " + e.detail.value + "\r\n")
  //   app.globalData.BAUD = e.detail.value
  // },
  // changeTCP(e) {
  //   let tcpMode = e.detail.value;
  //   var app = getApp()
  //   if (tcpMode === app.globalData.tcpMode) return
  //   if (tcpMode === 'Client') { this.setData({ isTcpClient: true, isTcpServer: false }) }
  //   else { this.setData({ isTcpClient: false, isTcpServer: true }) }
  //   this.setData({ tcpMode })
  //   app.globalData.changedItems.push("TCP " + tcpMode + "\r\n")
  //   app.globalData.tcpMode = tcpMode
  // },
  // handleHostChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.HOST) return
  //   app.globalData.changedItems.push("HOST " + e.detail.value + "\r\n")
  //   app.globalData.HOST = e.detail.value
  // },
  // handlePortChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.PORT) return
  //   app.globalData.changedItems.push("PORT " + e.detail.value + "\r\n")
  //   app.globalData.PORT = e.detail.value
  // },
  // handleEportChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.EPORT) return
  //   app.globalData.changedItems.push("EPORT " + e.detail.value + "\r\n")
  //   app.globalData.EPORT = e.detail.value
  // },
  // handleSportChange(e) {
  //   var app = getApp()
  //   if (e.detail.value === app.globalData.SPORT) return
  //   app.globalData.changedItems.push("SPORT " + e.detail.value + "\r\n")
  //   app.globalData.SPORT = e.detail.value
  // },
  // saveChanges() {
  //   var app = getApp()
  //   clearInterval(app.globalData.getFeedbackTimer)
  //   app.globalData.hasSetTimerFlag = 0
  //   var index = 0//决定发送哪个信息
  //   var len = app.globalData.changedItems.length
  //   var count = 0//某个信息发送的次数

  //   var responses = []//'... OK\r\n'的数组
  //   for (let i = 0; i < len; i++) {
  //     let j = app.globalData.changedItems[i].indexOf(' ')
  //     responses.push(app.globalData.changedItems[i].substring(0, j + 1) + 'OK\r\n')
  //   }

  //   var buffer_request = generateBuffer(app.globalData.changedItems)//发送的arrayBuffer
  //   const { deviceId, serviceId, characteristicId } = this._device
  //   if (app.globalData.hasSetTimerFlag === 0) {
  //     app.globalData.hasSetTimerFlag = 1
  //     app.globalData.getFeedbackTimer = setInterval(() => {
  //       if (app.globalData.OkResponse === responses[index]) {
  //         ++index
  //         count = 0
  //         app.globalData.OkResponse = ''
  //         app.globalData.hasSetTimerFlag = 0
  //       }
  //       if (count === 10) {
  //         wx.showToast({ icon: 'error', title: 'ERR' })
  //         clearInterval(app.globalData.getFeedbackTimer)
  //         app.globalData.OkResponse = ''
  //         app.globalData.changedItems = []
  //         app.globalData.hasSetTimerFlag = 0
  //         index = 0
  //         count = 0
  //         return
  //       }
  //       if (index === len) {
  //         wx.showToast({ title: 'OK' })
  //         clearInterval(app.globalData.getFeedbackTimer)
  //         app.globalData.OkResponse = ''
  //         app.globalData.changedItems = []
  //         app.globalData.hasSetTimerFlag = 0
  //         index = 0
  //         count = 0
  //         return
  //       }
  //       wx.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value: buffer_request[index] })
  //       ++count
  //     }, 1000)
  //   }
  // },
  // clicked() {
  //   switch (this.data.condition) {
  //     case 'START':
  //       this.setData({ sendBtnText: '停止发送', condition: 'STOP', bgColor: 'red' })
  //       this.startSend();
  //       break;
  //     case 'STOP':
  //       this.setData({ sendBtnText: '开始发送', condition: 'START', bgColor: 'green' })
  //       this.stopSend();
  //       break;
  //   }
  // },
  // startSend() {
  //   const { deviceId, serviceId, characteristicId } = this._device
  //   var app = getApp()
  //   const requests = []
  //   const { SSID, PASSWORD, MAC, SCANs, curId_DHCP, IP, SUBNET, GATEWAY, RSSI, BAUD, curTCP, HOST, EPORT, SPORT } = app.globalData
  //   if (SSID == '') requests.push('SSID\r\n')
  //   if (PASSWORD == '') requests.push('PASSWORD\r\n')
  //   if (MAC == '') requests.push('MAC\r\n')
  //   if (SCANs.length === 0) requests.push('SCAN\r\n')
  //   if (curId_DHCP == '') requests.push('DHCP\r\n')
  //   if (IP == '') requests.push('IP\r\n')
  //   if (SUBNET == '') requests.push('SUBNET\r\n')
  //   if (GATEWAY == '') requests.push('GATEWAY\r\n')
  //   if (RSSI == '') requests.push('RSSI\r\n')
  //   if (BAUD == '') requests.push('BAUD\r\n')
  //   if (curTCP == '') requests.push('TCP\r\n')
  //   if (HOST == '') requests.push('HOST\r\n')
  //   if (EPORT == '') requests.push('EPORT\r\n')
  //   if (SPORT == '') requests.push('SPORT\r\n')

  //   var buffer_requests = generateBuffer(requests)//发送的arrayBuffer

  //   var index = 0
  //   var len = buffer_requests.length
  //   var count = 0//某个信息发送的次数
  //   if (app.globalData.hasSetTimerFlag === 0) {
  //     app.globalData.hasSetTimerFlag = 1
  //     app.globalData.getFeedbackTimer = setInterval(() => {
  //       if (app.globalData.gotFlag) {
  //         ++index
  //         count = 0
  //         app.globalData.hasSetTimerFlag = 0
  //         app.globalData.gotFlag = false
  //       }
  //       if (count === 10) {
  //         wx.showToast({ icon: 'error', title: 'ERR' })
  //         clearInterval(app.globalData.getFeedbackTimer)
  //         app.globalData.hasSetTimerFlag = 0
  //         this.setData({ sendBtnText: '开始发送', condition: 'START', bgColor: 'green' })
  //         index = 0
  //         count = 0
  //         return
  //       }
  //       if (index === len) {
  //         wx.showToast({ title: 'OK' })
  //         clearInterval(app.globalData.getFeedbackTimer)
  //         app.globalData.hasSetTimerFlag = 0
  //         this.setData({ sendBtnText: '开始发送', condition: 'START', bgColor: 'green' })
  //         index = 0
  //         count = 0
  //         return
  //       }
  //       wx.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value: buffer_requests[index] })
  //       ++count
  //     }, 1000)
  //   }
  // },
  // stopSend() {
  //   var app = getApp()
  //   if (app.globalData.hasSetTimerFlag === 1) {
  //     clearInterval(app.globalData.getFeedbackTimer)
  //     app.globalData.hasSetTimerFlag = 0
  //     wx.showToast({ icon: 'success', title: '已停止发送!' })
  //   }
  // },
  // refreshInfo() {
  //   this.onShow();
  //   wx.showToast({ icon: 'success', title: '刷新成功!' })
  // },
  // eyeStatus: function () {
  //   this.data.defaultType = !this.data.defaultType
  //   this.data.passwordType = !this.data.passwordType
  //   this.setData({
  //     defaultType: this.data.defaultType,
  //     passwordType: this.data.passwordType
  //   })
  // }
})