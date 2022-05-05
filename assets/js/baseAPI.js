// 在发起ajax() 或get()或post()请求的时候，系统会先运行ajaxPrefilter(function(option){})
// 这个函数，参数options为我们给ajax配置的内容，options.url为我们给ajax配置的不完整的根路径
$.ajaxPrefilter(function(options){
    // 拼接完整的根路径
    options.url = 'http://api-breakingnews-web.itheima.net/' + options.url

})