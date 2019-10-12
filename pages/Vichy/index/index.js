// pages/Vichy/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    index_banner:[
      'https://img.cdn.powerpower.net/5da13fcae4b0697c15ae69ab.jpg',
      'https://img.cdn.powerpower.net/5da13fc5e4b0697c15ae69aa.jpg',
      'https://img.cdn.powerpower.net/5da13fb5e4b0697c15ae69a9.jpg'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  nextBanner(e){
    this.setData({
      currentIndex: e.currentTarget.dataset.index+1
    })
    // console.log(e.currentTarget.dataset.index, this.data.currentIndex)
  },
})