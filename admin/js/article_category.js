$(function () {
    // 入口函数
    // 需求1：一进到页面就显示所有的文章分类
    // 1-发送ajax请求
    function getData() {
        $.ajax({
            type: 'get',
            url: BigNew.category_list,
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    // 2-成功后通过模板引擎渲染
                    var resHtml = template('category_temp', backData);
                    $('tbody').html(resHtml);
                }
            }
        });
    }
    getData();


    // 需求2：新增分类/编辑分类，使用同一个模态框
    // 1-模态框弹出触发的事件
    // 通过点击某个作为触发器的元素，则此元素可以通过事件的 relatedTarget 属性进行访问
    $('#myModal').on('show.bs.modal', function (e) {
        if (e.relatedTarget === $("#xinzengfenlei")[0]) { //判断这个触发器是不是新增分类这个按钮   
            // alert('新增');
            $('#myModalLabel').text('新增分类');
            $('#addOrEdit').text("新增").addClass("btn-primary").removeClass("btn-success");
        } else {
            // alert('编辑');
            $('#myModalLabel').text('编辑分类');
            $('#addOrEdit').text("编辑").addClass("btn-success").removeClass("btn-primary");
            //获取当前编辑按钮对应的分类名字和分类别名
            var categoryName = $(e.relatedTarget).parent().prev().prev().text().trim();
            var categorySlug = $(e.relatedTarget).parent().prev().text().trim();
            var categoryId = $(e.relatedTarget).attr('data-id'); //id是模板引擎那里自定义设置的

            // 拿到后赋值给input
            $('#categoryId').val(categoryId); //在模态框里设置了一个input标签隐藏域，来保存这个id，为了编辑需要id参数
            $('#recipient-name').val(categoryName);
            $('#message-text').val(categorySlug);
        }
    });


    // 需求3：点击新增/编辑按钮，发送ajax请求
    $('#addOrEdit').on('click', function () {
        // 判断这个按钮是新增还是编辑
        if ($(this).hasClass('btn-primary')) {
            // 新增功能
            // alert('1');
            // 1-获取文本框内容
            var categoryName = $('#recipient-name').val().trim();
            var categorySlug = $('#message-text').val().trim();
            // 2-发送ajax请求，完成新增
            $.ajax({
                type: 'post',
                url: BigNew.category_add,
                data: {
                    name: categoryName,
                    slug: categorySlug
                },
                success: function (backData) {
                    // console.log(backData);
                    // 3-重新加载数据、模态框隐藏、清除文本框
                    if (backData.code == 201) {
                        getData();
                        $('#myModal').modal('hide');
                        $('#recipient-name').val('');
                        $('#message-text').val('');
                    }

                }
            });
        } else {
            // 编辑功能
            // 1-获取文本框内容
            // 如果form表单中有很多条数据，这样获取就太繁琐了，用formdata获取，但接口需要后端支持
            // 可以用jquery的serialize()方法,一次获取
            var data = $('#myModal form').serialize();
            // 2-发送ajax请求，完成编辑
            $.ajax({
                type: 'post',
                url: BigNew.category_edit,
                data: data,
                success: function (backData) {
                    // console.log(backData);
                    // 3-成功后重新加载数据、模态框隐藏
                    if (backData.code == 200) {
                        $('#myModal').modal('hide');
                        getData();
                    }
                }
            });


        }
    });

    // 需求4：点击取消按钮，清空文本框
    $('.btn-cancel').on('click', function () {
        //   方式1：
        $('#recipient-name').val('');
        $('#message-text').val('');
        //   方式2：运用form表单的reset()重置方法
        $('#myModal form')[0].reset();

    });


    // 需求5：点击删除按钮，发送ajax请求，完成删除
    // 注意：因为删除是动态生成的，所以要委托注册
    $('tbody').on('click', '.btn-delete', function () {
        // 1-获取当前删除行的类别id
        var id = $(this).attr('data-id');
        if (confirm('确定要删除吗？')) {
            // 2-发送ajax请求
            $.ajax({
                type: "post",
                url: BigNew.category_delete,
                data: {
                    id: id
                },
                success: function (backData) {
                    // console.log(backData);
                    // 3-新增成功，重新加载数据
                    getData();
                }
            });
        }
    });

});