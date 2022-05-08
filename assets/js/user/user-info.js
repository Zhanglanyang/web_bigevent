$(function(){
    var form = layui.form
    var layer = layui.layer

    // 自定义昵称的校验规则
    form.verify({
        nickname: function(value){
            if(value.length > 6){
                return '昵称长度应在1~6个字符之间!'
            }
        }
    })

    // 调用获取数据函数
    initUserInfo()

    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'my/userinfo',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取数据失败!')
                }
                //获取表单数据成功之后,快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 设置表单的重置效果
    $('#btnReset').on('click', function(e){
        // 阻止默认重置行为
        e.preventDefault()
        // 直接调用上面获取数据函数,重新给表单赋值
        initUserInfo()
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e){
        // 阻止默认提交行为
        e.preventDefault()

        // 发起ajax请求,把用户修改的表单数据,提交给服务器
        $.ajax({
            method:'POST',
            url:'my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新数据失败!')
                }
                layer.msg('更新数据成功!')

                // 调用父页面中的方法
                // 重新获取新数据,并渲染
                window.parent.getUserinfo()
            }
        })
    })

})