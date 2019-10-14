// pages/Vichy/exchange/exchange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitationFriendEnter:false,
    invitationPost: false,
    canvasObj:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAvaterInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 邀请入口
  invitationFriend(){
    if (this.data.canvasObj){
      this.setData({ invitationFriendEnter: true, invitationPost: true});
      this.sharePosteCanvas(this.data.canvasObj)
    }
  },
  // 关闭底部弹窗
  onClose() {
    this.setData({ invitationFriendEnter: false, invitationPost: false});
  },

  //下载背景图片
  getAvaterInfo: function () {
    // wx.showLoading({ title: '生成中...', mask: true, });
    var that = this;
    wx.downloadFile({
      url: 'https://img.cdn.powerpower.net/5da3f0ffe4b0697c15ae69fb.jpg', //图片路径
      success: function (res) {
        // wx.hideLoading();
        if (res.statusCode === 200) {
          var avaterSrc = res.tempFilePath; //下载成功返回结果
          that.getQrCode(avaterSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '下载错误！',
            icon: 'none',
            success: function () {
              var avaterSrc = "";
              that.getQrCode(avaterSrc);
            }
          })
        }
      }
    })
  },
  // 下载二维码图片
  getQrCode: function (avaterSrc) {
    // wx.showLoading({ title: '生成中...', mask: true, });
    var that = this;
    wx.downloadFile({
      url: 'https://img.cdn.powerpower.net/5da3f1a4e4b0697c15ae69fd.png', //二维码路径
      success: function (res) {
        // wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.getHeadeImg(avaterSrc, codeSrc)
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function () {
              var codeSrc = "";
              that.getHeadeImg(avaterSrc, codeSrc)
            }
          })
        }
      }
    })
  },
  //下载头像
  getHeadeImg(avaterSrc, codeSrc){
    var that = this;
    wx.downloadFile({
url:"https://wx.qlogo.cn/mmopen/vi_32/RC66AgmvL5B7onSJJskOcg2hYHr8dd3fI2kPXg7r6EP5CcgOgqvvcd5XmK8u3nJxRNib9LK8vEt4GvMhiaojvtAA/132", //头像路径
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var headImg = res.tempFilePath;
          let obj = {
            avaterSrc: avaterSrc,
            codeSrc: codeSrc,
            headImg: headImg
          }
          that.setData({ canvasObj: obj })
          // that.sharePosteCanvas(avaterSrc, codeSrc, headImg);
        } else {
          var headImg = "";
          that.setData({ canvasObj: obj })
          // that.sharePosteCanvas(avaterSrc, codeSrc, headImg);
        }
      }
    })
  },
  /**
   * 开始用canvas绘制分享海报
   * @param avaterSrc 下载的背景图片路径
   * @param codeSrc   下载的二维码图片路径
   * @以width： 550rpx height： 789rpx   比例计算
   */
  sharePosteCanvas: function (canvasObj) {
      var that = this;
      wx.showLoading({ title: '生成中...', mask: true, })
      var cardInfo = that.data.cardInfo; //需要绘制的数据集合
      const ctx = wx.createCanvasContext('myCanvas'); //创建画布
      var width = "";
      wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
        console.log(rect, canvasObj)
        var height = rect.height;
        var width = rect.width;
        var right = rect.right;
        // width = rect.width * 0.8;
        // var left = rect.left + 5;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);

        if (canvasObj.avaterSrc) {
          ctx.drawImage(canvasObj.avaterSrc, 0, 0, rect.width, rect.height);
        }

        //  绘制二维码
        if (canvasObj.codeSrc) {
          // 系数width = 550/264 = 2.08
          // y轴系数 = 789/457 = 1.72
          ctx.drawImage(canvasObj.codeSrc, width / 2 - width / 2.08 / 2, height / 1.72, width / 2.08, width / 2.08)
        }
        //绘制头像
        if (canvasObj.headImg){
          // 系数width = 550/128 = 4.3
          // y轴系数 = 789/108 = 7.3
          ctx.beginPath(); //开始绘制
          ctx.arc(width / 4.3 / 2 + width / 2 - (width / 4.3 / 2), width / 4.3 / 2 + height / 7.3, width / 4.3 / 2, 0, Math.PI * 2, false);
          ctx.clip();
          ctx.drawImage(canvasObj.headImg, width / 2 - (width / 4.3 / 2), height / 7.3, width / 4.3, width / 4.3)
          ctx.restore();
        }
        setTimeout(function () {
          ctx.draw();
          wx.hideLoading();
        }, 100)
      }).exec()
  },
  // 3.保存本地
  savePostLocation() {
    var that = this;
    if (that.data.canvasObj){
      wx.showLoading({ title: '正在保存', mask: true, })
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          fileType: 'jpg',
          success: function (res) {
            wx.hideLoading();
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success: function (res) {
                console.log(res)
                wx.showModal({
                  title: '提示',
                  content: '您的推广海报已存入手机相册，赶快分享给好友吧',
                  showCancel: false,
                })
              },
              fail: function (err) {
                console.log(err)
                // 防止用户禁止了授权,这须手动调起权限了
                if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                  // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                  wx.showModal({
                    title: '提示',
                    content: '需要您授权保存相册',
                    showCancel: false,
                    success: modalSuccess => {
                      wx.openSetting({
                        success(settingdata) {
                          console.log("settingdata", settingdata)
                          if (settingdata.authSetting['scope.writePhotosAlbum']) {
                            wx.showModal({
                              title: '提示',
                              content: '获取权限成功,再次确认即可保存',
                              showCancel: false,
                            })
                          } else {
                            wx.showModal({
                              title: '提示',
                              content: '获取权限失败，将无法保存到相册哦~',
                              showCancel: false,
                            })
                          }
                        },
                        fail(failData) {
                          console.log("failData", failData)
                        },
                        complete(finishData) {
                          console.log("finishData", finishData)
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      })
    }
  },
})