$(function(){

    var layer = layui.layer
     // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


//   当我点击上传按钮，默认点击的是文件框，只不过隐藏的文件框
$('#btnCloseImage').on('click', function(){
    $('#file').click()
})


// 实现图片的切换，监听文件框的change事件
$('#file').on('change', function(e){
    // 1.先拿到上传的文件
    // console.log(e);
    var file = e.target.files[0]
    // console.log(file);
    // 2.根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file)
    // console.log(newImgURL);

    // 3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：

    $image.cropper('destroy')   // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域
    

    // 将裁剪的图片，上传到服务器
    $('#btnUpload').on('click', function(){
         // 1. 要拿到用户裁剪之后的头像
         var dataURL = $image
         .cropper('getCroppedCanvas', {
           // 创建一个 Canvas 画布
           width: 100,
           height: 100
         })
         .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //  console.log(dataURL);
        // 2.把数据发送到服务器
        $.ajax({
            method:'POST',
            url:'my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新头像失败！')
                }
                layer.msg('更新头像成功！')

                // 调用父页面的方法，重新获取数据，并渲染
                window.parent.getUserinfo()
            }

        })
    })
})

})