Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    animationSetDevice1: {},
    animationSetCommand1: {},
    animationSetDevice2: {},
    animationSetCommand2: {},
    animationModal: {},
    animationContainer: {},
    now_command_1: '',
    now_command_2: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    contorlAnimate() {
      if (this.data.isShow) {
        this.closeAnimate()
      } else {
        this.showAnimate()
      }
    },
    closeAnimate() {
      var animationModal = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-in'
      })
      animationModal.opacity(0).scale(0.0, 0.0).step()

      var animationSetDevice1 = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-in'
      })
      animationSetDevice1.opacity(0).scale(0.0, 0.0).translateX(0).step()

      var animationSetCommand1 = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-in'
      })
      animationSetCommand1.opacity(0).scale(0.0, 0.0).translateX(0).step()

      var animationSetDevice2 = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-in'
      })
      animationSetDevice2.opacity(0).scale(0.0, 0.0).translateX(0).step()

      var animationSetCommand2 = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-in'
      })
      animationSetCommand2.opacity(0).scale(0.0, 0.0).translateX(0).step()
      this.data.isShow = false
      this.setData({
        animationSetDevice1: animationSetDevice1.export(),
        animationSetCommand1: animationSetCommand1.export(),
        animationSetDevice2: animationSetDevice2.export(),
        animationSetCommand2: animationSetCommand2.export(),
        animationModal: animationModal.export()
      })
    },
    showAnimate() {
      var animationModal = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      })
      animationModal.opacity(0.0).scale(300, 300).step()
      var animationSetDevice1 = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      })
      animationSetDevice1.opacity(1).scale(0.8, 0.8).translateX(-120).step()
      var animationSetCommand1 = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      })
      animationSetCommand1.opacity(1).scale(0.8, 0.8).translateX(-60).translateY(-104).step()

      var animationSetDevice2 = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      })
      animationSetDevice2.opacity(1).scale(0.8, 0.8).translateX(-104).translateY(-60).step()

      var animationSetCommand2 = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      })
      animationSetCommand2.opacity(1).scale(0.8, 0.8).translateX(0).translateY(-120).step()
      this.data.isShow = true
      this.setData({
        animationSetDevice1: animationSetDevice1.export(),
        animationSetCommand1: animationSetCommand1.export(),
        animationSetDevice2: animationSetDevice2.export(),
        animationSetCommand2: animationSetCommand2.export(),
        animationModal: animationModal.export()
      })
    },
    setDevice1() {
      var app = getApp()
      const { deviceId, serviceId, characteristicId, deviceName } = app.globalData.connectedDeviceInfo
      wx.showModal({
        title: '提示',
        content: '将当前设备设置为常用设备1',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.setStorageSync('device1',
              {
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: characteristicId,
                name: deviceName
              })
            wx.showToast({
              title: '设置成功',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    setDevice2() {
      var app = getApp()
      const { deviceId, serviceId, characteristicId, deviceName } = app.globalData.connectedDeviceInfo
      wx.showModal({
        title: '提示',
        content: '将当前设备设置为常用设备2',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.setStorageSync('device2',
              {
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: characteristicId,
                name: deviceName
              })
            wx.showToast({
              title: '设置成功',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    setCommand1() {
      let that = this
      wx.showModal({
        title: '提示',
        content: '将设置为常用命令1',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.showModal({
              title: '请输入要设置的内容',
              content: '',
              editable: true,//显示输入框
              success(res) {
                console.log(res.content)
                if (res.confirm) {
                  // console.log('用户点击确定')
                  if (res.content.length > 0) {//用户有输入内容
                    that.setData({
                      now_command_1: res.content
                    })
                    wx.showToast({
                      title: '设置成功',
                    })
                  } else {
                    wx.showToast({
                      title: '设置失败',
                    })
                  }
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    setCommand2() {
      let that = this
      wx.showModal({
        title: '提示',
        content: '将设置为常用命令2',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.showModal({
              title: '请输入要设置的内容',
              content: '',
              editable: true,//显示输入框
              success(res) {
                console.log(res.content)
                if (res.confirm) {
                  console.log('用户点击确定')
                  if (res.content.length > 0) {//用户有输入内容
                    that.setData({
                      now_command_2: res.content
                    })
                    wx.showToast({
                      title: '设置成功',
                    })
                  } else {
                    wx.showToast({
                      title: '设置失败',
                    })
                  }
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },

    goCommand1() {
      var app = getApp()
      let value = this.data.now_command_1
      if (value === '') {//指令为空
        wx.showToast({
          icon: 'none',
          title: '未设置内容，发送失败！'
        })
      } else {
        const { deviceId, serviceId, characteristicId } = app.globalData.connectedDeviceInfo
        // 向蓝牙设备发送一个0x00的16进制数据
        let buffer = new ArrayBuffer(value.length)
        let dataView = new DataView(buffer)
        for (let i = 0; i < value.length; i++) {
          dataView.setUint8(i, value[i].charCodeAt())
        }
        // 向蓝牙低功耗设备特征值中写入二进制数据。注意：必须设备的特征支持 write 才可以成功调用。
        wx.writeBLECharacteristicValue({
          deviceId,
          serviceId,
          characteristicId,
          value: buffer,// 这里的value是ArrayBuffer类型
          success(res) {
            //console.log(buffer)
            console.log('writeBLECharacteristicValue success', res.errMsg)
            wx.showToast({
              title: '发送成功',
            })
          },
          fail(res) {
            wx.showToast({
              title: '发送失败',
            })
          }
        })
      }
    },
    goCommand2() {
      var app = getApp()
      let value = this.data.now_command_2
      if (value === '') {//指令为空
        wx.showToast({
          icon: 'none',
          title: '未设置内容，发送失败'
        })
      } else {
        const { deviceId, serviceId, characteristicId } = app.globalData.connectedDeviceInfo
        // 向蓝牙设备发送一个0x00的16进制数据
        let buffer = new ArrayBuffer(value.length)
        let dataView = new DataView(buffer)
        for (let i = 0; i < value.length; i++) {
          dataView.setUint8(i, value[i].charCodeAt())
        }
        // 向蓝牙低功耗设备特征值中写入二进制数据。注意：必须设备的特征支持 write 才可以成功调用。
        wx.writeBLECharacteristicValue({
          deviceId,
          serviceId,
          characteristicId,
          value: buffer,// 这里的value是ArrayBuffer类型
          success(res) {
            //console.log(buffer)
            console.log('writeBLECharacteristicValue success', res.errMsg)
            wx.showToast({
              title: '发送成功',
            })
          },
          fail(res) {
            wx.showToast({
              title: '发送失败',
            })
          }
        })
      }
    },
  }
})


