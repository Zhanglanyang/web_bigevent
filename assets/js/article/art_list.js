$(function(){

    var layer = layui.layer
    var form = layui.form
    // 设置查询参数q
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义时间美化过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var h = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y+ '-' + m + '-' + d + '  ' + h + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
      }

    // 调用文章列表数据
    initTable()

    // 获取文章列表数据
    function initTable(){
        $.ajax({
            method:'GET',
            url:'my/article/list',
            data:q,
            success: function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('获取文章列表数据失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 在获取到文章列表数据成功渲染之后，调用渲染分页的方法
                // 把总数据条数，传递给分页渲染函数
                renderPage(res.total)
            }
        })
    }

    initCase()
    // 获取所有分类数据
    function initCase(){
        $.ajax({
            method:'GET',
            url:'my/article/cates',
            success: function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败！')
                }
                // 获取数据成功之后使用模板引擎，将生成的页面填充到下拉复选框中
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 因为添加之后，layui没有监测到填充的页面元素，需要调用layui中的form.render（）
                // 进行重新渲染
                form.render()
            }
        })
    }


    // 实现筛选的功能
    // 把用户筛选的内容，通过查询参数q，发送到服务器，后重新获取文章列表、渲染
    $('#form-search').on('submit', function(e){
        // 阻止默认提交行为
        e.preventDefault()
        // 获取到用户参选的下拉复选框的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // console.log(cate_id,cate_id);
        q.cate_id = cate_id
        q.state = state

        // 通过事件参数q，获取到具体的列表信息
         // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    var laypage = layui.laypage;
    // 定义渲染分页的方法
    function renderPage(total){
            
            
            //执行一个laypage实例
            laypage.render({
              elem: 'test1' ,//注意,这里的 test1 是 ID,不用加 # 号
              count: total,//数据总数,从服务端得到
              limit: q.pagesize, //每页显示几条数据
              curr: q.pagenum, //设置默认选中的分页
              layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
              limits: [2, 3, 5, 10],
            //   在jump回调函数中，获取到最新的页面值
            // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first){
                // 把最新的页码值，赋值到查询参数当中
                q.pagenum = obj.curr
                  // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit

                // 解决死循环的问题：导致死循环的原因是，每当调用了laypage.render就会触发jump回调
                // 而我调用initTable获取列表数据，就会调用laypage.render
                // 这里需要判断，只要我知道触发jump回调是通过点击页面，才触发的，我才调用initTable获取数据
            //    first值为true：表示通过调用laypage.render方法触发的jump回调
            // first值为undefined：表示通过点击分页，触发的jump回调
                if(!first){
                    initTable()
                }

            }
            });
    }


    // 实现删除功能，给删除按钮绑定点击事件，由于动态添加的按钮，所以需要事件委托
    $('tbody').on('click', '.btn-delete', function(){
        // 获取到页面中所有的删除按钮个数
        var len = $('.btn-delete').lenth
        // 获取到文章id
        var id = $(this).attr('data-id')

        // 询问框
        //eg1
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
    //do something
       $.ajax({
        method:'GET',
        url:'my/article/delete/' + id,
        success: function(res){
            if(res.status !== 0){
                return layer.msg('删除数据失败!')
            }
             layer.msg('删除数据成功!')

            //  删除操作中存在小bug ,比如:我当前处在第4页,当我把第4页数据删除完之后,分页虽然跳转到了第3页,
            // 但是没有获取第3页的数据,依旧获取的是第4页数据
            // 解决方法:在删除操作之前,获取到当前页面中所有的删除按钮,得知页面中的删除按钮只有一个,则表示,删除完
            // 之后,当前页面中就没有数据,此时获取页码值-1

             // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
            // 如果没有剩余的数据了,则让页码值 -1 之后,
            // 再重新调用 initTable 方法
            if(len === 1){
                // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }

            //  删除成功之后,需要重新获取列表数据
            initTable()
         }
      })
    
         layer.close(index);
     });  
        
    })
})