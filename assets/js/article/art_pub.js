$(function(){

    var layer = layui.layer
    var form = layui.form
    // 调用获取文章类别
    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 获取文章类别数据
    function initCate() {
        $.ajax({
            method:'GET',
            url:'my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('初始化文章类别数据失败！')
                }
                // 获取数据成功之后，就把获取的数据得到的模板引擎，追加到页面上
                // 注意：需要使用form.render（）方法，让layui重新渲染页面
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
                
            }
        })
    }
      // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400/280,
    preview: '.img-preview'
  }
  
  
  // 3. 初始化裁剪区域
  $image.cropper(options)

//   给选项封面按钮，添加点击事件
// 点击选择封面按钮，默认点击的是文件选择框
$('#btnChooseImage').on('click', function(){
    $('#coverFile').click()
})

// 监听文件选择框的change事件，来监听用户选择的文件
$('#coverFile').on('change', function(e){
    // 拿到用户提交的文件
    var files = e.target.files
    // console.log(files);
     // 判断用户是否选择了文件
     if(files.length === 0){
         return
     }
    //  否则就是有文件
    // 根据文件创建新的URL地址
    var newImgURL = URL.createObjectURL(files[0])
      // 为裁剪区域重新设置图片
      $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域

})

// 定义文章的发布状态
var art_state = '已发布'
$('#btnSave2').on('click', function(){
    art_state = '草稿'
})
// 当用户点击的是存为草稿，则给文章发布状态赋值为草稿

// 监听form的提交事件
$('#form-pub').on('submit', function(e){
    // 阻止默认提交行为
    e.preventDefault()
    // 基于Form表单，实例一个FormDate()对象
    var fd = new FormData($(this)[0])
    // 3. 将文章的发布状态，存到 fd 中
    fd.append('state', art_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
    .cropper('getCroppedCanvas',{
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob){
            // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img',blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      })
})

// 定义一个发布文章的方法：
function publishArticle(fd) {
    $.ajax({
        method:'POST',
        url:'my/article/add',
        data: fd,
        // 注意当我们向服务器传递数据，数据格式为FormDate时，必须同时传递两个配置，否则传递失败
        contentType:false,
        processData:false,
        success:function(res){
            if(res.status !==0){
                return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功！')
            // 发布文章成功后，跳转到文章列表页面
            location.href = '/article/art_list.html'
        }

    })
}
})