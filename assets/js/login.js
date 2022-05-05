$(function(){

    // 给登录模块和注册模块添加点击事件
    $('#link_reg').on('click', function(){
        // 点击去注册，就隐藏去注册a标签，显示去登录标签
       $('.login-box').hide()
       $('.reg-box').show()
    })

    $('#link_login').on('click', function(){
        // 点击去注册，就隐藏去注册a标签，显示去登录标签
        $('.login-box').show()
        $('.reg-box').hide()
    })


    // 自定义校验规则
    // 通过layui.form得到form对象，再使用form.verify()函数来，自定义校验规则
    var form = layui.form

    // 导入layer 提示用户
    var layer = layui.layer

    form.verify({
        // 自定义一个pwd的校验规则   [\s]表示不能为空
        pwd:[/^[\S]{6,12}$/, '密码必须6-12位，且不能为空格'],


        // 通过形参拿到的是确认密码复选框中的内容（因为repwd校验规则是应用到确认密码框中的）
        // 还需要拿到密码框中的内容
        // 如果两个不相等，则返回一个提示文本

        repwd:function(value){
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e){
       

        // 阻止默认提交行为
        e.preventDefault()

        // 获取用户输入的内容
        var data = {
           username:$('#form_reg [name=username]').val() ,
           password:$('#form_reg [name=password]').val() 
        }
        // 发起ajax请求
        $.post('api/reguser',data ,function(res){
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功')

            // 注册成功之后 跳转到登录表单，默认是点击了登录的a链接
            $('#link_login').click()
        } )
    })


    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        // 阻止默认提交行为
        e.preventDefault()

        // 快速获取到表单的提交数据
        $.ajax({
            method:'post',
            url:'api/login',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                // console.log(res);
                // 把res.token存储到本地
                localStorage.setItem('token', res.token)

                // 登录成功之后，跳转到首页
                location.href = 'index.html'
            }
        })
    })
})