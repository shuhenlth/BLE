import { abToHex, hexToAb, splitPackage, check02Model, transToQuery } from '@utils/index'
import { TextDecoder, TextEncoder } from '@libs/encoding'
import { HC02CharacteristicNotifyUUID } from '@configs/index'
const gbkDecoder = new TextDecoder('gbk')
const gbkEncoder = new TextEncoder('gbk', { NONSTANDARD_allowLegacyEncoding: true })

//生成arrayBuffer
function generateBuffer(request) {
  let buffer_request = []
  for (let i = 0; i < request.length; i++) {
    let buffer_item = new ArrayBuffer(request[i].length)
    let dataView_item = new DataView(buffer_item)
    for (let j = 0; j < request[i].length; j++) {
      dataView_item.setUint8(j, request[i][j].charCodeAt())
    }
    buffer_request.push(buffer_item)
  }
  return buffer_request
}

//1.检测SSID
function checkSsid(str) {
  if (str.length < 8) return false
  var head = str.substring(0, 5)
  if (head === 'SSID ' && str.endsWith('\n')) { return true } else { return false }
}

//2.检测PASSWORD
function checkPassword(str) {
  if (str.length < 12) return false
  var head = str.substring(0, 9)
  if (head === 'PASSWORD ' && str.endsWith('\n')) { return true } else { return false }
}

// 3.检测MAC
function checkMac(str) {
  if (str.length != 18) { return false }
  var head = str.substring(0, 3)
  var mac = str.substring(4, 16)
  var reg = /^[A-Fa-f\d]{12}$/;//检测合法mac地址
  if (head === 'MAC' && reg.test(mac) && str.endsWith('\n')) { return true } else { return false }
}

// 4.检测SCAN
function checkScan(str) {
  if (str.length < 8) { return false }
  var head = str.substring(0, 5)
  //判断字符串中是否含有连续两个以上的空格
  var reg = / {2,}/
  if (head === 'SCAN ' && str.endsWith('\r\n') && !reg.test(str)) { return true } else { return false }
}

//6.检测IP
function checkIp(str) {
  var len = str.length
  if (len < 12 || len > 20) { return false }
  var head = str.substring(0, 3)
  var ip = str.substring(3, len - 2)
  var reg = /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;//检测合法ip地址
  if (head === 'IP ' && reg.test(ip) && str.endsWith('\r\n')) { return true } else { return false }
}

//7.检测SUBNET
function checkSubnet(str) {
  var len = str.length
  if (len < 12 || len > 20) { return false }
  var head = str.substring(0, 7)
  var subnet = str.substring(7, len - 2)
  var reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;//检测合法SUBNET地址
  if (head === 'SUBNET ' && reg.test(subnet) && str.endsWith('\r\n')) { return true } else { return false }
}

//8.检测GATEWAY
function checkGateway(str) {
  var len = str.length
  if (len < 17 || len > 25) { return false }
  var head = str.substring(0, 8)
  var gateway = str.substring(8, len - 2)
  var reg = /^(192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2})$/;//检测合法GATEWAY地址
  if (head === 'GATEWAY ' && reg.test(gateway) && str.endsWith('\r\n')) { return true } else { return false }
}

//9.检测RSSI
function checkRssi(str) {
  var head = str.substring(0, 5)
  if (head === 'RSSI ' && str.endsWith('\r\n')) { return true } else { return false }
}

//10.检测BAUD
function checkBaud(str) {
  var head = str.substring(0, 5)
  if (head === 'BAUD ' && str.endsWith('\r\n')) { return true } else { return false }
}

//12.检测HOST
function checkHost(str) {
  var len = str.length
  if (len < 14 || len > 22) { return false }
  var head = str.substring(0, 5)
  var host = str.substring(5, len - 2)
  var reg = /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;//检测合法ip地址
  if (head === 'HOST ' && reg.test(host) && str.endsWith('\r\n')) { return true } else { return false }
}

//13.检测EPORT
function checkEport(str) {
  var head = str.substring(0, 6)
  if (head === 'EPORT ' && str.endsWith('\r\n')) { return true } else { return false }
}

//14.检测SPORT
function checkSport(str) {
  var head = str.substring(0, 6)
  if (head === 'SPORT ' && str.endsWith('\r\n')) { return true } else { return false }
}

Page({
  data: {
    deviceName: '设备名称',
    recData: '',
    recTotal: 0,
    sendData: '',
    sendTotal: 0,
    isCyclicSend: false,
    interval: 1000,
    is02Model: false, // HC-02的写和读特征值是分开的，需要特殊处理
    isHC: false,
    checkboxOptions: [
      { label: '接收Hex', value: false },
      { label: '发送Hex', value: false }
    ],
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    //保存'数据收发'页面和'设备信息'页面跳转的路径信息
    list: [
      {
        iconPath: "/img/data_receive_send.png",
        selectedIconPath: "/img/selected_data_receive_send.png",
        text: "收发数据"
      },
      {
        iconPath: "/img/deviceInfo.png",
        selectedIconPath: "/img/selectedDeviceInfo.png",
        text: "设备信息"
      }
    ],
    ssid: '',
    password: '',
    mac: '',//MAC地址
    curId_SCAN: 0,//当前SCAN的ID
    SCANs: [],//SCAN列表
    curSCAN: "",//当前SCAN
    ip: '',//IP地址
    subnet: '',//子网掩码
    gateway: '',//网关
    rssi: '',//信号强度
    BAUDs: [{ name: '1200', id: '1' }, { name: '2400', id: '2' }, { name: '4800', id: '3' }, { name: '9600', id: '4' }, { name: '14400', id: '5' }, { name: '19200', id: '6' }, { name: '38400', id: '7' }, { name: '43000', id: '8' }, { name: '57600', id: '9' }, { name: '76800', id: '10' }, { name: '115200', id: '11' }, { name: '128000', id: '12' }, { name: '230400', id: '13' }, { name: '256000', id: '14' }, { name: '460800', id: '15' }, { name: '921600', id: '16' }],
    curBAUD: "",
    curId_BAUD: 0,
    tcpMode: "Client",//当前TCP的模式
    isDhcp: false,
    host: '',//Client模式待连接的服务端IP地址
    eport: '',//Client模式待连接的服务端端口
    sport: '',//Server模式开放的端口
    sendBtnText: '开始发送',
    condition: 'START',
    bgColor: 'green',
    defaultType: true,//眼睛状态   
    passwordType: true,//密码可见与否状态
    getFeedbackTimer: null,
    hasSetTimerFlag: 0,//是否设置了定时器的标志
    errFlag: false,//是否发生错误
    changedItems: [],//记录哪些项目更改了
    OkResponse: '',//当前的OK是哪个属性的
    gotFlag: false,
    radioChecked: true,
  },

  _timer: null,
  _device: null,
  _recedBuffer: null,
  _origin: 'deviceList',

  /**
   * 向特征值写数据
   */
  async writeDatas(subPackages, index = 0) {
    if (!subPackages) return
    const { deviceId, serviceId, characteristicId } = this._device
    const count = subPackages.length
    while (index < count) {
      const { errno } = await wx.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value: subPackages[index] })
      if (!errno) {
        this.setData({ sendTotal: this.data.sendTotal + subPackages[index++].byteLength })
      }
    }
  },

  /**
   * 从特征值读取数据
   */
  readDatas(res) {
    const { value } = res
    const isHexMode = this.data.checkboxOptions[0].value
    var temp = new Uint8Array(value)
    const str = gbkDecoder.decode(temp)

    if (str === 'SSID OK\r\n' || str === 'PASSWORD OK\r\n' || str === 'MAC OK\r\n' || str === 'SCAN OK\r\n' || str === 'DHCP OK\r\n' || str === 'IP OK\r\n' || str === 'SUBNET OK\r\n' || str === 'GATEWAY OK\r\n' || str === 'RSSI OK\r\n' || str === 'BAUD OK\r\n' || str === 'TCP OK\r\n' || str === 'HOST OK\r\n' || str === 'PORT OK\r\n' || str === 'EPORT OK\r\n' || str === 'SPORT OK\r\n') {
      this.setData({ OkResponse: str })
    }

    //1.SSID相关操作
    else if (checkSsid(str) && str != 'SSID OK\r\n') {
      var len = str.length
      var ssid = str.substring(5, len - 2)
      this.setData({ ssid, gotFlag: true })
    }

    //2.PASSWORD相关操作
    else if (checkPassword(str) && str != 'PASSWORD OK\r\n') {
      var len = str.length
      var password = str.substring(9, len - 2)
      this.setData({ password, gotFlag: true })
    }

    //3.MAC相关操作
    else if (checkMac(str)) {
      var mac = str.substring(4, 16)
      this.setData({ mac, gotFlag: true })
    }

    //4.SCAN相关操作
    else if (checkScan(str) && str != 'SCAN OK\r\n') {
      const length = str.length
      const scanArr = str.substring(5, length - 2)
      const arr = scanArr.split(' ')
      const arrLen = arr.length
      const newScans = []
      for (let i = 0; i < arrLen; i++) {
        newScans.push({ name: `${arr[i]}`, id: `${i + 1}` })
      }
      this.setData({ SCANs: newScans, gotFlag: true })
    }

    //5.DHCP相关操作
    else if (str === 'DHCP Enable\r\n') {
      this.setData({
        gotFlag: true,
        isDhcp: true
      })
    } else if (str === 'DHCP Disable\r\n') {
      this.setData({
        gotFlag: true,
        isDhcp: false
      })
    }

    //6.IP相关操作
    else if (checkIp(str)) {
      var len = str.length
      var ip = str.substring(3, len - 2)
      this.setData({ ip, gotFlag: true })
    }

    //7.SUBNET相关操作
    else if (checkSubnet(str)) {
      var len = str.length
      var subnet = str.substring(7, len - 2)
      this.setData({ subnet, gotFlag: true })
    }

    //8.GATEWAY相关操作
    else if (checkGateway(str)) {
      var len = str.length
      var gateway = str.substring(8, len - 2)
      this.setData({ gateway, gotFlag: true })
    }

    //9.RSSI相关操作
    else if (checkRssi(str) && str != 'RSSI OK\r\n') {
      var len = str.length
      var rssi = str.substring(5, len - 2)
      this.setData({ rssi, gotFlag: true })
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //10.BAUD相关操作
    else if (checkBaud(str) && str != 'BAUD OK\r\n') {
      const len = str.length
      const baud = str.substring(5, len - 2)
      // const id = 0
      // if (baud === '115200')
      // id = 6 

      // switch (baud) {
      //   case '1200':
      //     id = 1
      //     break;
      //   case '2400':
      //     id = 2
      //     break;
      //   case '4800':
      //     id = 3
      //     break;
      //   case '9600':
      //     id = 4
      //     break;
      //   case '14400':
      //     id = 5
      //     break;
      //   case '19200':
      //     id = 6
      //     break;
      //   case '38400':
      //     id = 7
      //     break;
      //   case '43000':
      //     id = 8
      //     break;
      //   case '57600':
      //     id = 9
      //     break;
      //   case '76800':
      //     id = 10
      //     break;
      //   case '115200':
      //     id = 11
      //     break;
      //   case '128000':
      //     id = 12
      //     break;
      //   case '230400':
      //     id = 13
        //   break;
        // case '256000':
        //   id = 14
        //   break;
        // case '460800':
        //   id = 15
        //   break;
        // case '921600':
        //   id = 16
        //   break;
        // default:
        //   break;
      // }
      this.setData({
        curBAUD: baud,
        // curId_BAUD: id,
        gotFlag: true
      })
    }

    //11.TCP相关操作
    else if (str === 'TCP Client\r\n') {
      this.setData({
        tcpMode: 'Client',
        gotFlag: true,
        radioChecked: true,
      })
      this.data.changedItems.push("TCP Client\r\n")
    } else if (str === 'TCP Server\r\n') {
      this.setData({
        tcpMode: 'Server',
        gotFlag: true,
        radioChecked: false,
      })
      this.data.changedItems.push("TCP Server\r\n")
    }

    //12.HOST相关操作
    else if (checkHost(str)) {
      var len = str.length
      var host = str.substring(5, len - 2)
      this.setData({
        HOST: host,
        gotFlag: true
      })
    }

    //13.EPORT相关操作
    else if (checkEport(str) && str != 'EPORT OK\r\n') {
      var len = str.length
      var eport = str.substring(6, len - 2)
      this.setData({
        EPORT: eport,
        gotFlag: true
      })
    }

    //14.SPORT相关操作
    else if (checkSport(str) && str != 'SPORT OK\r\n') {
      var len = str.length
      var sport = str.substring(6, len - 2)
      this.setData({
        SPORT: sport,
        gotFlag: true
      })
    }

    if (this._recedBuffer) {
      let newArray = new Uint8Array(this._recedBuffer.byteLength + value.byteLength)
      newArray.set(this._recedBuffer)
      newArray.set(new Uint8Array(value), this._recedBuffer.byteLength)
      this._recedBuffer = newArray
      newArray = null
    } else {
      this._recedBuffer = new Uint8Array(value)
    }
    this.setData({ recTotal: this.data.recTotal + value.byteLength })
    setTimeout(() => {
      const recData = isHexMode
        ? abToHex(this._recedBuffer.buffer.slice(this.data.recTotal > 4000 ? -4000 : 0))
        : gbkDecoder.decode(this._recedBuffer).slice(this.data.recTotal > 4000 ? -4000 : 0)
      this.setData({ recData })
    }, 200)
  },

  /**
   * 更改发送框内容
   */
  handleSendDataChange(e) {
    this.setData({ sendData: e.detail.value })
  },

  /**
   * 更改循环发送的时间间隔
   */
  handleDelayChange(e) {
    this.setData({ interval: Number(e.detail.value) })
  },

  /**
   * 切换循环发送
   */
  handleCycleSwitchChange(e) {
    const value = e.detail
    const { sendData, checkboxOptions, interval } = this.data
    this.setData({ isCyclicSend: value })
    if (value && sendData) {
      this._timer = setInterval(() => {
        const dataPackage = checkboxOptions[1].value
          ? hexToAb(sendData)
          : gbkEncoder.encode(sendData).buffer
        const subPackages = splitPackage(dataPackage, 20) // 数据分包，每20个字节一个数据包数组
        if (wx.getStorageSync('connectedDeviceId') && this._device.write) {
          this.writeDatas(subPackages)
        }
      }, interval)
    } else {
      clearInterval(this._timer)
      // this._timer = null
    }
  },

  /**
   * 切换 Hex发送 或 Hex接收
   */
  handleModeChange(e) {
    const { index } = e.currentTarget.dataset
    switch (index) {
      case 0: // Hex接收
        this.setData({ 'checkboxOptions[0].value': e.detail })
        break
      case 1: // Hex发送
        this.setData({ 'checkboxOptions[1].value': e.detail })
        break
    }
  },

  /**
   * 清除接收框内容、收发计数
   */
  cleanReceived() {
    this.setData({
      recData: '',
      recTotal: 0,
      sendTotal: 0
    })
    this._recedBuffer = ''
  },

  /**
   * 清除发送框内容
   */
  cleanSent() {
    this.setData({
      sendData: '',
      sendTotal: 0
    })
  },

  /**
   * 点击发送
   */
  handleSendTap() {
    if (!this._device.write || !wx.getStorageSync('connectedDeviceId')) return
    const { sendData, checkboxOptions } = this.data
    const ab = checkboxOptions[1].value // 判断是否Hex发送
      ? hexToAb(sendData)
      : gbkEncoder.encode(sendData).buffer
    const abs = splitPackage(ab, 20) // 数据分包，每20个字符串一个包
    this.writeDatas(abs)
  },

  async onLoad(options) {
    const { deviceId, deviceName, serviceId, characteristicId, write, read, notify, indicate, origin } = options
    const is02Model = check02Model(serviceId, characteristicId)
    this.setData({ deviceName })
    this._origin = origin
    this._device = {
      deviceId,
      deviceName,
      serviceId,
      characteristicId,
      write: write === 'true' ? true : false,
      read: read === 'true' ? true : false,
      notify: notify === 'true' ? true : false,
      indicate: indicate === 'true' ? true : false
    }
    if (is02Model) {
      await wx.notifyBLECharacteristicValueChange({
        deviceId,
        serviceId,
        characteristicId: HC02CharacteristicNotifyUUID,
        state: true
      })
      /** 监听蓝牙设备的特征值变化 */
      wx.onBLECharacteristicValueChange(this.readDatas)
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    if (notify === 'true' || indicate === 'true') {
      await wx.notifyBLECharacteristicValueChange({
        deviceId,
        serviceId,
        characteristicId,
        state: true,
        fail (res) {
          console.log('notifyBLECharacteristicValueChange fail', res.errMsg)
        }
      })
      /** 监听蓝牙设备的特征值变化 */
      // wx.onBLECharacteristicValueChange(this.readDatas)
      wx.onBLECharacteristicValueChange(function(res) {
        console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
        console.log(ab2hex(res.value))
      })
    }
  },

  onUnload() {
    if (this._origin === 'deviceList' && wx.getStorageSync('bluetoothAdapterState')) {
      wx.closeBLEConnection({ deviceId: this._device.deviceId })
      wx.removeStorageSync('connectedDeviceId')
    }
    wx.offBLECharacteristicValueChange(this.readDatas)
    clearInterval(this._timer)
    this._recedBuffer = null
    this.setData({
      recData: '',
      recTotal: 0,
      sendData: '',
      sendTotal: 0,
      interval: 1000,
    })
  },

  handleSsidChange(e) {
    if (e.detail.value === this.data.SSID) return
    this.data.changedItems.push("SSID " + e.detail.value + "\r\n")
    this.setData({
      SSID: e.detail.value
    })
  },
  handlePasswordChange(e) {
    if (e.detail.value === this.data.PASSWORD) return
    this.data.changedItems.push("PASSWORD " + e.detail.value + "\r\n")
    this.setData({
      PASSWORD: e.detail.value
    })
  },
  /**
   * switch样式点击事件
   */
  changeDHCP(e) {
    // console.log(`Switch样式点击后是否选中：`, e.detail.value)
    const isDhcp = e.detail.value
    if (isDhcp) {
      this.setData({
        isDhcp: true
      })
    } else {
      this.setData({
        isDhcp: false
      })
    }
    this.data.changedItems.push("DHCP " + (isDhcp ? "Enable" : "Disable") + "\r\n")
  },
  changeSCAN(e) {
    this.setData({
      curId_SCAN: e.detail.selectId,
      curSCAN: e.detail.select
    })
  },
  changeBAUD(e) {
    this.setData({
      curId_BAUD: e.detail.selectId,
      curBAUD: e.detail.select
    })
  },
  handleIpChange(e) {
    if (e.detail.value === this.data.IP) return
    this.data.changedItems.push("IP " + e.detail.value + "\r\n")
    this.setData({
      IP: e.detail.value,
    })
  },
  handleSubnetChange(e) {
    const subnet = e.detail.value
    if (subnet === this.data.SUBNET) return
    this.data.changedItems.push("SUBNET " + subnet + "\r\n")
    this.setData({
      SUBNET: subnet,
    })
  },
  handleGatewayChange(e) {
    if (e.detail.value === this.data.GATEWAY) return
    this.data.changedItems.push("GATEWAY " + e.detail.value + "\r\n")
    this.setData({
      GATEWAY: e.detail.value,
    })
  },
  changeTCP(e) {
    let tcpMode = e.detail.value;
    this.setData({ tcpMode, radioChecked: !this.data.radioChecked })
    this.data.changedItems.push("TCP " + tcpMode + "\r\n")
  },
  handleHostChange(e) {
    if (e.detail.value === this.data.HOST) return
    this.data.changedItems.push("HOST " + e.detail.value + "\r\n")
    this.setData({
      HOST: e.detail.value,
    })
  },
  handlePortChange(e) {
    if (e.detail.value === this.data.PORT) return
    this.data.changedItems.push("PORT " + e.detail.value + "\r\n")
    this.setData({
      PORT: e.detail.value,
    })
  },
  handleEportChange(e) {
    if (e.detail.value === this.data.EPORT) return
    this.data.changedItems.push("EPORT " + e.detail.value + "\r\n")
    this.setData({
      EPORT: e.detail.value,
    })
  },
  handleSportChange(e) {
    if (e.detail.value === this.data.SPORT) return
    this.data.changedItems.push("SPORT " + e.detail.value + "\r\n")
    this.setData({
      SPORT: e.detail.value,
    })
  },
  saveChanges() {
    clearInterval(this.data.getFeedbackTimer)
    this.data.hasSetTimerFlag = 0
    var index = 0//决定发送哪个信息
    var len = this.data.changedItems.length
    var count = 0//某个信息发送的次数

    var responses = []//'... OK\r\n'的数组
    for (let i = 0; i < len; i++) {
      let j = this.data.changedItems[i].indexOf(' ')
      responses.push(this.data.changedItems[i].substring(0, j + 1) + 'OK\r\n')
    }

    var buffer_request = generateBuffer(this.data.changedItems)//发送的arrayBuffer
    const { deviceId, serviceId, characteristicId } = this._device
    if (this.data.hasSetTimerFlag === 0) {
      this.data.hasSetTimerFlag = 1
      this.data.getFeedbackTimer = setInterval(() => {
        if (this.data.OkResponse === responses[index]) {
          ++index
          count = 0
          this.setData({
            OkResponse: '',
            hasSetTimerFlag: 0
          })
        }
        if (count === 10) {
          wx.showToast({ icon: 'error', title: 'ERR' })
          clearInterval(this.data.getFeedbackTimer)
          this.setData({
            OkResponse: '',
            changedItems: [],
            hasSetTimerFlag: 0
          })
          index = 0
          count = 0
          return
        }
        if (index === len) {
          wx.showToast({ title: 'OK' })
          clearInterval(this.data.getFeedbackTimer)
          this.setData({
            OkResponse: '',
            changedItems: [],
            hasSetTimerFlag: 0
          })
          index = 0
          count = 0
          return
        }
        wx.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value: buffer_request[index] })
        ++count
      }, 1000)
    }
  },
  clicked() {
    switch (this.data.condition) {
      case 'START':
        this.setData({ sendBtnText: '停止发送', condition: 'STOP', bgColor: 'red' })
        this.startSend();
        break;
      case 'STOP':
        this.setData({ sendBtnText: '开始发送', condition: 'START', bgColor: 'green' })
        this.stopSend();
        break;
    }
  },
  startSend() {
    const { deviceId, serviceId, characteristicId } = this._device
    const requests = []
    const { SSID, PASSWORD, MAC, SCANs, IP, SUBNET, GATEWAY, RSSI, BAUD, curTCP, HOST, EPORT, SPORT } = this.data
    if (SSID == '') requests.push('SSID\r\n')
    if (PASSWORD == '') requests.push('PASSWORD\r\n')
    if (MAC == '') requests.push('MAC\r\n')
    if (SCANs.length === 0) requests.push('SCAN\r\n')
    requests.push('DHCP\r\n')
    if (IP == '') requests.push('IP\r\n')
    if (SUBNET == '') requests.push('SUBNET\r\n')
    if (GATEWAY == '') requests.push('GATEWAY\r\n')
    if (RSSI == '') requests.push('RSSI\r\n')
    if (BAUD == '') requests.push('BAUD\r\n')
    if (curTCP == '') requests.push('TCP\r\n')
    if (HOST == '') requests.push('HOST\r\n')
    if (EPORT == '') requests.push('EPORT\r\n')
    if (SPORT == '') requests.push('SPORT\r\n')

    var buffer_requests = generateBuffer(requests)//发送的arrayBuffer

    var index = 0
    var len = buffer_requests.length
    var count = 0//某个信息发送的次数
    if (this.data.hasSetTimerFlag === 0) {
      this.data.hasSetTimerFlag = 1
      this.data.getFeedbackTimer = setInterval(() => {
        if (this.data.gotFlag) {
          ++index
          count = 0
          this.setData({
            hasSetTimerFlag: 0,
            gotFlag: false
          })
        }
        if (count === 10) {
          wx.showToast({ icon: 'error', title: 'ERR' })
          clearInterval(this.data.getFeedbackTimer)
          this.setData({ sendBtnText: '开始发送', condition: 'START', bgColor: 'green', hasSetTimerFlag: 0 })
          index = 0
          count = 0
          return
        }
        if (index === len) {
          wx.showToast({ title: 'OK' })
          clearInterval(this.data.getFeedbackTimer)
          this.setData({ sendBtnText: '开始发送', condition: 'START', bgColor: 'green', hasSetTimerFlag: 0 })
          index = 0
          count = 0
          return
        }
        wx.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value: buffer_requests[index] })
        ++count
      }, 1000)
    }
  },
  stopSend() {
    if (this.data.hasSetTimerFlag === 1) {
      clearInterval(this.data.getFeedbackTimer)
      this.setData({ hasSetTimerFlag: 0 })
      wx.showToast({ icon: 'success', title: '已停止发送!' })
    }
  },
  eyeStatus: function () {
    this.data.defaultType = !this.data.defaultType
    this.data.passwordType = !this.data.passwordType
    this.setData({
      defaultType: this.data.defaultType,
      passwordType: this.data.passwordType
    })
  },
  switchTab(e) {
    const len = this.data.list.length
    this.setData({ selected: (this.data.selected + 1) % len })
  }
})