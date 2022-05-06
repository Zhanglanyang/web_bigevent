$(function(){
    //调用  getUserinfo获取数据
    getUserinfo()


    // 实现退出功能
    // 给退出按钮设置点击事件
    $('#btnLogout').on('click', function(){
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //do something
            // 当用户点击确定退出登录，清空本地token，跳转到登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'

            layer.close(index);
          });
    })
})

function getUserinfo(){
    var layer = layui.layer
    $.ajax({
        method:'GET',
        url:'my/userinfo',
        // 获取权限的数据，需要传递headers请求头
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res){
            console.log(res);
            if(res.status !== 0){
                return layer.msg('获取数据失败！')
            }
              // 调用 renderAvatar 渲染用户的头像
             renderAvatar(res.data)
        },
        //complete回调函数，不管执行成功还是失败，都会执行
    //     complete: function(res){
    //          // console.log('执行了 complete 回调：')
    //   // console.log(res)
    //   // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    //   if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
    //     //   当身份认证失败的时候，强制清空本地的token，且强制跳转到登录页面
    //     localStorage.removeItem('token')
    //     location.href = '/login.html'
    //   }
    //     }
        
    })
}

function renderAvatar(user){
    // 1.先获取用户名称
    var name = user.nickname || user.username
    // 2.把获取到的名字，修改到指定位置
    $('#welcome').html('欢迎&nbsp;&nbsp'+ name)
    // 3.判断获取的数据中是否有图片数据
    if(user.user_pic === null){
        // 若值为null，则表示没有头像数据，显示文字图片，隐藏头像图片
        // 截取名字的首字母，并转换成大写
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
       
    }else{
        // 若只不为null，则表示有图片数据，修改头像图片的src属性，并显示，隐藏文字头像
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
        
    }
}