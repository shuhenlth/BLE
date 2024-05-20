function ab2str(buf) { return String.fromCharCode.apply(null, new Uint8Array(buf)); }

//ArrayBuffer转16进制字符串示例
function ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
Page({
  data: {
    deviceId: '',//当前设备id
    serviceId: '',//选择的当前设备的所有服务中的某个服务id(uuid)
    characteristicId: '',//当前特征值的Id
    service1_command1: '',//按钮“指令1”中的存储用户设置的字符
    service1_command2: '',//按钮“指令2”中的存储用户设置的字符
    connected: false,//是否已连接设备
    dataReceived: [],//存储当前显示的数据
    data_hex_received: [],
    data_str_received: [],
    inputContent: '',//发送框里面的内容
    isHex1: false,//接受的数据是否转成16进制
    cycle: '1000',//循环发送的周期
    isCycleSend: false,//使用循环发送数据
    name: '设备1',//当前选择的设备的名称
    isRoll: true,//数据列表是否滚动
    isInputDisabled: false,//输入框是否能编辑的标志
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    //获取本机蓝牙打开状态
    wx.getBluetoothAdapterState({
      success(res) {
        if (res.available) {
          that.setData({
            available: true
          })
        } else {
          that.setData({
            available: false
          })
          wx.showToast({
            title: '请打开蓝牙',
          })
        }
      }
    })

    var value = wx.getStorageSync('device1')//从本地缓存中同步获取指定 key 的内容
    if (value) {
      const { deviceId, serviceId, characteristicId, name } = value
      this.setData({
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicId,
        name: name
      })
      wx.setNavigationBarTitle({//设置顶部title
        title: name,
      })
    }

    var command = wx.getStorageSync('service1_command1')//从本地缓存中同步获取指定 key 的内容
    if (command) {
      this.setData({
        service1_command1: command,
      })
    }

    var command = wx.getStorageSync('service1_command2')//从本地缓存中同步获取指定 key 的内容
    if (command) {
      this.setData({
        service1_command2: command,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    //获取本机蓝牙打开状态
    wx.getBluetoothAdapterState({
      success(res) {
        if (res.available) {
          that.setData({
            available: true
          })
        } else {
          that.setData({
            available: false
          })
          wx.showToast({
            title: '请打开蓝牙',
          })
        }
      }
    })

    // 根据主服务 UUID 获取已连接的蓝牙设备
    wx.getConnectedBluetoothDevices({
      services: [this.data.serviceId],
      success(res) {
        if (res.devices.length <= 0) {//如果连接的设备数<=0，则连接状态为：未连接
          that.setData({
            connected: false
          })
        }
        for (let i = 0; i < res.devices.length; i++) {
          if (res.devices[i].deviceId == that.data.deviceId) {
            that.setData({
              connected: true
            })
            break;
          } else {
            that.setData({
              connected: false
            })
          }
        }
      }
    })
    // 监听蓝牙低功耗连接状态改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
    wx.onBLEConnectionStateChange(function (res) {
      if (res.connected) {
        that.setData({
          connected: true
        })
      } else {
        that.setData({
          connected: false
        })
      }
    })
  },

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
  onPullDownRefresh() {
    let that = this
    wx.createBLEConnection({
      deviceId: this.data.deviceId,
      success(res) {
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要已经通过 wx.createBLEConnection 与对应设备建立连接
          deviceId: that.data.deviceId,
          success(res) {
            wx.getBLEDeviceCharacteristics({
              deviceId: that.data.deviceId,
              serviceId: that.data.serviceId,
              success(res) {
                that.setData({
                  connected: true
                })
                wx.showToast({
                  title: '已连接',
                })
                wx.notifyBLECharacteristicValueChange({
                  state: true, // 启用 notify 功能
                  deviceId: that.data.deviceId,
                  serviceId: that.data.serviceId,
                  characteristicId: that.data.characteristicId,
                  success(res) {
                    //监听蓝牙低功耗设备的特征值变化事件。
                    //1.必须先调用 wx.notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
                    wx.onBLECharacteristicValueChange(function (res) {
                      let myDate = new Date()
                      let hex_data = ab2hex(res.value)//接收到的数据转成16进制
                      let str_data = ab2str(res.value)//默认情况下：接收到的数据转成字符串
                      if (hex_data || str_data) {//当接收新的数据
                        let mytime = myDate.toLocaleTimeString(); //获取当前时间
                        let time_hex_data = '[' + mytime + ']' + '：' + hex_data//将时间和数据用字符串拼接起来
                        let time_str_data = '[' + mytime + ']' + '：' + str_data//将时间和数据用字符串拼接起来
                        let data_hex_received = that.data.data_hex_received
                        let data_str_received = that.data.data_str_received
                        data_hex_received.push(time_hex_data)
                        data_str_received.push(time_str_data)
                        if (that.data.isHex1) {
                          that.setData({ // 将新数组整个重新赋值给源数据
                            dataReceived: data_hex_received,
                          })
                        } else {
                          that.setData({ // 将新数组整个重新赋值给源数据
                            dataReceived: data_str_received,
                          })
                        }
                        if (that.data.isRoll) {
                          that.setData({
                            toView: `data${that.data.dataReceived.length - 1}`,
                          })
                        }
                      }
                    })
                    wx.readBLECharacteristicValue({
                      deviceId: that.data.deviceId,
                      serviceId: that.data.serviceId,
                      characteristicId: that.data.characteristicId,
                    })
                  }
                })
              }
            })
          }
        })
      }
    }),
      wx.stopPullDownRefresh()//停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },

  //长按“开”，设置新的内容，覆盖原来设置的内容
  setCommand1(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '点击确定将覆盖原有设置!',
      success(res) {
        if (res.confirm) {//用户点击确定
          wx.showModal({
            title: '请输入要设置的字符',
            content: '',
            editable: true,//显示输入框
            success(res) {
              if (res.confirm) {//用户点击确定
                if (res.content.length > 0) {//用户有输入内容
                  wx.setStorageSync('service1_command1', res.content)
                  that.setData({
                    service1_command1: res.content
                  })
                  wx.showToast({
                    title: '设置成功',
                  })
                } else {
                  wx.showToast({
                    title: '设置失败',
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  setCommand2(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '点击确定将覆盖原有设置!',
      success(res) {
        if (res.confirm) {//用户点击确定
          wx.showModal({
            title: '请输入要设置的字符',
            content: '',
            editable: true,//显示输入框
            success(res) {
              if (res.confirm) {//用户点击确定
                if (res.content.length > 0) {//用户有输入内容
                  wx.setStorageSync('service1_command2', res.content)
                  that.setData({
                    service1_command2: res.content
                  })
                  wx.showToast({
                    title: '设置成功',
                  })
                } else {
                  wx.showToast({
                    title: '设置失败',
                  })
                }
              }
            }
          })
        }
      }
    })
  },

  //点击,发送之前设置的内容
  goCommand1() {
    let value = this.data.service1_command1
    if (value === '') {//指令为空
      wx.showToast({
        icon: 'none',
        title: '未设置内容，发送失败！'
      })
    } else {
      // 向蓝牙设备发送一个0x00的16进制数据
      let buffer = new ArrayBuffer(value.length)
      let dataView = new DataView(buffer)
      for (let i = 0; i < value.length; i++) {
        dataView.setUint8(i, value[i].charCodeAt())
      }
      wx.writeBLECharacteristicValue({
        deviceId: this.data.deviceId,
        serviceId: this.data.serviceId,
        characteristicId: this.data.characteristicId,
        value: buffer,
        success(res) {
          wx.showToast({
            title: '发送成功',
          })
        },
        fail(res) {
          wx.showToast({
            icon: 'error',
            title: '发送失败,请检查是否已经连接'
          })
        }
      })
    }
  },
  goCommand2() {
    let value = this.data.service1_command2
    if (value === '') {//指令为空
      wx.showToast({
        icon: 'none',
        title: '未设置内容，发送失败！'
      })
    } else {
      // 向蓝牙设备发送一个0x00的16进制数据
      let buffer = new ArrayBuffer(value.length)
      let dataView = new DataView(buffer)
      for (let i = 0; i < value.length; i++) {
        dataView.setUint8(i, value[i].charCodeAt())
      }
      wx.writeBLECharacteristicValue({
        deviceId: this.data.deviceId,
        serviceId: this.data.serviceId,
        characteristicId: this.data.characteristicId,
        value: buffer,
        success(res) {
          wx.showToast({
            title: '发送成功',
          })
        },
        fail(res) {
          wx.showToast({
            icon: 'error',
            title: '发送失败,请检查是否已经连接'
          })
        }
      })
    }
  },
  input(e) {
    this.setData({
      inputContent: e.detail.value
    })
  },
  clickTextArea() {
    if (this.data.isInputDisabled) {
      wx.showToast({
        icon: 'none',
        title: '请先结束循环发送'
      })
    }
  },
  send(e) {
    let value = this.data.inputContent
    // 向蓝牙设备发送一个0x00的16进制数据
    let buffer = new ArrayBuffer(value.length)
    let dataView = new DataView(buffer)
    for (let i = 0; i < value.length; i++) {
      dataView.setUint8(i, value[i].charCodeAt())
    }
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: this.data.characteristicId,
      value: buffer,
    })
  },
  clearReceive() {
    this.setData({
      dataReceived: [],
      data_hex_received: [],
      data_str_received: [],
    })
  },
  clearSend() {
    this.setData({
      inputContent: ''
    })
  },
  HexChange1() {
    this.setData({
      isHex1: !this.data.isHex1
    })
  },
  getCycle(e) {
    this.setData({
      cycle: e.detail.value
    })
  },
  cycleSend() {
    let that = this
    var app = getApp()
    this.setData({
      isCycleSend: !this.data.isCycleSend
    })
    if (this.data.isCycleSend) {//开启了循环发送
      this.setData({//input框禁止编辑
        isInputDisabled: true
      })
      app.globalData.device1Timer = setInterval(function () {//开启定时器
        that.send()
      }, parseInt(this.data.cycle))//字符串转数字
    } else {
      clearInterval(app.globalData.device1Timer)//关闭定时器
      this.setData({//input框可以编辑
        isInputDisabled: false
      })
    }
  },
  disconnect() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
    })
  },
  rollChange() {
    this.setData({
      isRoll: !this.data.isRoll
    })
  }
})