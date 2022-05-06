// 在发起ajax() 或get()或post()请求的时候，系统会先运行ajaxPrefilter(function(option){})
// 这个函数，参数options为我们给ajax配置的内容，options.url为我们给ajax配置的不完整的根路径
$.ajaxPrefilter(function(options){
    // 拼接完整的根路径
    options.url = 'http://api-breakingnews-web.itheima.net/' + options.url

    // 统一为有权限的接口设置headers，当根路径中包含了/my/字符时，就需要设置headers才能访问
    if(options.url.indexOf('/my/') !== -1){
        options.headers={
            Authorization:localStorage.getItem('token') || ''
        }
    }


    // 代码优化，当身份认证失败时，强制清空本地token，且强制跳转到登录页面
    options.complete = function(res){
        // console.log('执行了 complete 回调：')
 // console.log(res)
 // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
 if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
   //   当身份认证失败的时候，强制清空本地的token，且强制跳转到登录页面
   localStorage.removeItem('token')
   location.href = '/login.html'
 }
   }
})