$(function(){

    var layer = layui.layer
    //调用initArtCateList 获取表单数据
    initArtCateList()

    // 获取表单数据
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'my/article/cates',
            success:function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('获取表单数据失败！')
                }
                // 获取表单数据成功之后，通过模板引擎把生成的模板添加到页面上
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

            }
        })
    }


    var indexAdd = null
    // 给添加类别按钮，绑定点击事件
    $('#btnAddCate').on('click', function(){
        // console.log('ok');
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
          }); 
    })


    // 实现提交分类操作
    $('body').on('submit','#form-add', function(e){
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'my/article/addcates',
            data:$(this).serialize(),
            success: function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('提交分类失败！')
                }
                layer.msg('提交分类成功！')
                // 提交成功之后，关闭弹出层，并重新获取所有数据，并渲染
                layer.close(indexAdd)
                initArtCateList()
            }
        })
    })


    var indexEdit = null
    var form = layui.form
    // 点击编辑按钮，弹出层
    // 由于是动态添加的，需要事件委托进行绑定
    $('tbody').on('click', '.btn-edit', function(){
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
          }); 

          // 获取到按钮对应自定义属性id值
        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            method: 'GET',
            url: 'my/article/cates/'+ id,
            success: function(res){
                // 快速为表单赋值
                // 使用layui中的form.val('对应form表单的id'，对应数据)
                form.val('form-edit', res.data)
                // console.log(res.data);
            }
        })
    })


    // 更新表单提交数据
    $('body').on('submit', '#form-edit', function(e){
        // 阻止默认提交行为
        e.preventDefault()

        $.ajax({
            method:'POST',
            url:'my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 数据更新成功之后自动关闭弹出层
                layer.close(indexEdit)
                // 并重新调用获取所有数据，并渲染
                initArtCateList()
            }
            
        })
    })


    // 删除表单提交按钮
    $('tbody').on('click', '.btn-delete', function(){

        // 获取到该按钮对应的id值
        var id = $(this).attr('data-id')
        // 询问框
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            
        // console.log('ok');
        
        console.log(id);
        $.ajax({
            method:'GET',
            url:'my/article/deletecate/' + id,
            success: function(res){
                // console.log(res);
                if(res.status !== 0){
                    return layer.msg('删除分类失败！')
                }
                layer.msg('删除分类成功！')

                // 成功之后自动关闭询问框
                layer.close(index);
                // 并重新获取所有数据，渲染
                initArtCateList()
            }
        })

            
          });
    })
})