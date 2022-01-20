var app = getApp()
Page({
  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    people: [],
    id: ''
  },
  _getman() {
    let that = this
    wx.request({
      url: 'http://api.flagship575.top/api/v1/userinfo',
      method: 'get',
      // data: {
      //   name: '张三',
      //   phone: '17817136798',
      //   idcard: '441581200012030034',
      //   sex: '男',

      // },
      header: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        that.setData({
          people: res.data,
          len: res.data.length,
        })
      }
    })
  },

  add() {
    if (this.data.len < 2) {
      wx.navigateTo({
        url: '../add/add',
      })
    } else {
      wx.showToast({
        title: '最多添加两位入住人',
        icon: 'none'
      })
    }

    // wx.request({
    //   url: 'http://api.flagship575.top/api/v1/userinfo',
    //   method: 'post',
    //   data: {
    //     name: '张三',
    //     phone: '17817136792',
    //     idcard: '441581200012030033',
    //     sex: '男',

    //   },
    //   header: {
    //     token: wx.getStorageSync('token')
    //   },
    //   success(res) {
    //     console.log(res)
    //   }
    // })
  },
  protect() {
    wx.navigateBack({
      delta: 1,
    })
  },
  onShow(){
    this._getman()
    let that = this
    this.setData({
      items: []
    })
    wx.showLoading({
      title: '正在加载',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    setTimeout(function () {
      let thats = that
      for (var i = 0; i < that.data.people.length; i++) {
        that.data.items.push({
          content: thats.data.people[i],
          isTouchMove: false //默认全隐藏删除
        })
      }
      that.setData({
        items: that.data.items
      })
      wx.hideLoading()
    }, 1000);
    
  },
  onLoad: function () {


  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    console.log(e)
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    let that = this
    this.setData({
      id: e.currentTarget.dataset.id
    })
    wx.request({
      url: `http://api.flagship575.top/api/v1/userinfo/${e.currentTarget.dataset.id}`,
      method: 'delete',
      header: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        console.log(res)
        that._getman()
      }
    })
    this.setData({
      items: this.data.items

    })
    console.log('1')
  }
})