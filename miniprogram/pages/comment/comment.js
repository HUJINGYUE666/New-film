// pages/comment/comment.js
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    content:'',
    score: 5,
    images:[],
    fileIds: [],
    movieid: -1,
  },
  submit:function(){
    wx.showLoading({
      title: 'loading',
    })
    console.log(this.data.content);
    console.log(this.data.score);
    let promiseArr = [];
    for(let i = 0; i < this.data.images.lengh; i++){
      promiseArr.push(new Promise((reslove,reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0];
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: item, // 文件路径
          success: res => {
            // get resource ID
            console.log(res.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            });
            reslove();
          },
          fail: err => {
            // handle error
          }
        })
      }))
    }
    Promise.all(promiseArr).then(res => {
      db.collection('comment').add({
        data:{
          content: this.data.content,
          score:this.data.score,
          movieid: this.data.movieid,
          fileIds: this.data.fileIds
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err => {
        wx.hideLoading();
        wx.showLoading({
          title: '评价失败',
        })
      })
    })
  },

  onContentChange:function(event){
    this.setData({
      content: event.detail
    })
  },

  onScoreChange:function(event){
    this.setData({
      score: event.detail
    })
  },

  uploadImg:function(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid: options.movieid
    })
    console.log(options);
    wx.cloud.callFunction({
      name:'getDetail',
      data:{
        movieid: options.movieid
      }
    }).then(res => {
      console.log(res);
      this.setData({
        detail: JSON.parse(res.result)
      });
    }).catch(err => {
      // console.error(err);
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})