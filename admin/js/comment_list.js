$(function () {
    // 入口函数
    // 发送ajax请求获取评论数据封装成一个函数



    //需求1：一进到页面就获取评论数据
    // $.ajax({
    //     type: 'get',
    //     url: BigNew.comment_list,
    //     data: {
    //         page: 1,
    //         perpage: 6
    //     },
    //     success: function (backData) {
    //         // console.log(backData);
    //         if (backData.code == 200) {
    //             // 模板引擎渲染
    //             var resHtml = $('commentList_temp', backData);
    //             $('tbody').html(resHtml);
    //             //分页插件使用
    //             $("#pagination").twbsPagination({
    //                 totalPages: backData.data.totalPage, //总页数
    //                 visiblePages: 5, //最大可见页数
    //                 first: "首页",
    //                 prev: "上一页",
    //                 next: "下一页",
    //                 last: "尾页",
    //                 onPageClick: function (event, page) {
    //                     // 发送ajax请求
    //                     $.ajax({
    //                         type: 'get',
    //                         url: BigNew.comment_list,
    //                         data: {
    //                             page: page,
    //                             perpage: 6
    //                         },
    //                         success: function (backData) {
    //                             console.log(backData);
    //                             if (backData.code == 200) {
    //                                 // 模板引擎渲染
    //                                 var resHtml = $('commentList_temp', backData);
    //                                 $('tbody').html(resHtml);
    //                             }
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     }
    // });




    var myPage = 1;
    //一:获取所有的评论数据
    getComData(myPage);

    //封装的函数
    function getComData(page, callback) {
        $.ajax({
            url: BigNew.comment_list,
            data: {
                page: page,
                perpage: 3
            },
            success: function (backData) {
                console.log(backData);
                if (backData.code == 200) {
                    var resHtml = template('commentList_temp', backData);
                    $('tbody').html(resHtml);

                    //如果回调函数不是null
                    if (backData.data.data.length != 0 && callback != null) {
                        callback(backData);
                    } else if (backData.data.totalPage == myPage - 1 && backData.data.data.length == 0) {
                        myPage -= 1;
                        //重新生成页码条
                        $('#pagination').twbsPagination('changeTotalPages',
                            backData.data.totalPage, myPage);
                    }


                    //分页插件
                    $('#pagination').twbsPagination({
                        totalPages: backData.data.totalPage, //总页数
                        visiblePages: 7,
                        first: '首页',
                        prev: '上一页',
                        next: '下一页',
                        last: '尾页',
                        onPageClick: function (event, page) {
                            //给myPage赋值,值就是当前点击的这个页码
                            myPage = page;
                            //把当前点击的页码传进去. 调用方法.
                            getComData(page, null);
                        }
                    });

                }
            }
        });
    }


    // 需求2：批准
    $('tbody').on('click', '.btn-approve', function () {
        var commentId = $(this).attr('data-id');
        $.ajax({
            type: 'post',
            url: BigNew.comment_pass,
            data: {
                id: commentId
            },
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    alert('审核通过');
                    // 重新加载数据
                    getComData(myPage, null);
                }
            }
        });
    });
    // 需求3：拒绝
    $('tbody').on('click', '.btn-refuse', function () {
        var commentId = $(this).attr('data-id');
        $.ajax({
            type: 'post',
            url: BigNew.comment_reject,
            data: {
                id: commentId
            },
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    alert('已拒绝');
                    // 重新加载数据
                    getComData(myPage, null);
                }
            }
        });
    });
    // 需求4：删除
    $('tbody').on('click', '.btn-delete', function () {
        var commentId = $(this).attr('data-id');
        if (confirm('你确定要删除吗？')) {
            $.ajax({
                type: 'post',
                url: BigNew.comment_delete,
                data: {
                    id: commentId
                },
                success: function (backData) {
                    // console.log(backData);
                    if (backData.code == 200) {

                        // 重新加载数据
                        getComData(myPage, function (sbData) {
                            //重新渲染页面条
                            //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                            $('#pagination').twbsPagination('changeTotalPages',
                                sbData.data.totalPage, myPage);
                        });
                    }
                }
            });
        }
    });
});