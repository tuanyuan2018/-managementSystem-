// 入口函数
$(function () {
    // 需求1：一进到页面就显示所有的文章类别
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                // 2-成功后通过模板引擎渲染
                var resHtml = template('category_temp', backData);
                $('#selCategory').html(resHtml);
            }
        }
    });



    var currentPage = 1; //默认为1，在函数外面声明称全局变量，调用封装时要用
    // 封装：发送ajax请求，根据条件获取所有的文章数据，封装成一个函数
    function getData(currentPage, callBack) {
        $.ajax({
            type: "get",
            url: BigNew.article_query,
            data: {
                type: $("#selCategory").val(), //默认是所有分类
                state: $("#selStatus").val(), //默认是所有状态
                page: currentPage,
                perpage: 3,
            },
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    var resHtml = template("articleList_temp", backData);
                    $("tbody").html(resHtml);

                    // 发送完成后继续执行的回调函数
                    // 判断响应回来是否有数据，没有的话就隐藏分页
                    if (backData.data.data.length != 0 && callBack != null) {
                        $("#pagination").show();
                        $("#pagination").next().hide();
                        callBack(backData); //有数据就执行后面的代码
                    } else if (backData.data.data.length == 0 && currentPage == 1) {
                        // 如果该类别本来就没有数据
                        //分页插件结构给隐藏
                        $('#pagination').hide();
                        $('#pagination').next().show(); //提示没有数据
                    } else if (backData.data.totalPage == currentPage - 1 && backData.data.data.length == 0) {
                        // 如果返回的总页数是当前页数的上一页，并且当前页数据条数为0，说明删除的是最后一页的最后一条数据
                        currentPage -= 1;
                        //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                        $('#pagination').twbsPagination('changeTotalPages',
                            backData.data.totalPage, currentPage);
                    }
                }
            }
        });
    }


    
    // 需求2：一进到页面就获取所有的文章列表
    getData(1, function (backData) {
        $("#pagination").twbsPagination({
            totalPages: backData.data.totalPage, //总页数
            visiblePages: 7, //最大可见页数
            first: "首页",
            prev: "上一页",
            next: "下一页",
            last: "尾页",
            onPageClick: function (event, page) {
                //给当前页码赋值
                currentPage = page;
                // console.log(page);//page是当前点击的页码
                // 点击当前页码，重新发送ajax请求，获取当前页码的数据
                getData(currentPage, null);
            }
        });
    })



    //需求3:点击筛选按钮，获取符合条件的数据
    $("#btnSearch").on('click', function (e) {
        e.preventDefault();
        //  把当前页改成1
        currentPage = 1
        getData(1, function (backData) {
            //  由于改变了总页数，需要重新绘制页码
            $("#pagination").twbsPagination(
                "changeTotalPages",
                backData.data.totalPage,
                currentPage
            );
        });

    });



    //需求4:点击删除按钮，获取符合条件的数据
    $('tbody').on('click', '.delete', function () {
        if (confirm('你确定要删除吗？')) {
            // 获取当前点击按钮的自定义属性值
            var articleId = $(this).attr('data-id');
            // 发送ajax请求，完成删除
            $.ajax({
                type: 'post',
                url: BigNew.article_delete,
                data: {
                    id: articleId
                },
                success: function (backData) {
                    if (backData.code == 204) {
                        //重新发送ajax请求,就获取当前页数据. 
                        getData(currentPage, function (backData) {
                            //删除了部分数据,那总页数就有可能发生了改变
                            //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                            $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, currentPage);
                        });
                    }
                }
            });
        }
    })



  // 需求五：发布文章
  $('#release_btn').on('click', function (e) {
    e.preventDefault();
    parent.$('.level02>li:eq(1)').click();
    window.location.href = './article_release.html';
  });






    // // 需求2：一进到页面就获取所有的文章列表
    // $.ajax({
    //     type: "get",
    //     url: BigNew.article_query,
    //     data: {
    //         type: $("#selCategory").val(), //默认是所有分类
    //         state: $("#selStatus").val(), //默认是所有状态
    //         page: 1,
    //         perpage: 3,
    //     },
    //     success: function (backData) {
    //         // console.log(backData);
    //         if (backData.code == 200) {
    //             var resHtml = template("articleList_temp", backData);
    //             $("tbody").html(resHtml);

    //             // 获取成功后绘制分页结构
    //             $("#pagination").twbsPagination({
    //                 totalPages: backData.data.totalPage, //总页数
    //                 visiblePages: 7, //最大可见页数
    //                 first: "首页",
    //                 prev: "上一页",
    //                 next: "下一页",
    //                 last: "尾页",
    //                 onPageClick: function (event, page) {
    //                     //给当前页码赋值
    //                     // console.log(page);//page是当前点击的页码
    //                     // 点击当前页码，重新发送ajax请求，获取当前页码的数据
    //                     $.ajax({
    //                         type: "get",
    //                         url: BigNew.article_query,
    //                         data: {
    //                             type: $("#selCategory").val(), //默认是所有分类
    //                             state: $("#selStatus").val(), //默认是所有状态
    //                             page: page,
    //                             perpage: 3,
    //                         },
    //                         success: function (backData) {
    //                             // console.log(backData);
    //                             if (backData.code == 200) {
    //                                 var resHtml = template("articleList_temp", backData);
    //                                 $("tbody").html(resHtml);
    //                             }
    //                         }
    //                     });

    //                 }
    //             });
    //         }
    //     }
    // });


});