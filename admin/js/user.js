// 入口函数
$(function () {
    // 头像预览
    // 1-给input：file标签一个值改变事件
    $('#exampleInputFile').on('change', function () {
        //2-找到这个文件
        var file1 = this.files[0];
        // console.log(this);
        // console.log(this.files);
        //3-给它设置一个url
        var url = URL.createObjectURL(file1);
        //4-把url给预览用的img
        $('.user_pic').attr('src', url);
    });


    // 需求1：一进到页面就获取用户信息
    // 1-发送ajax请求
    $.ajax({
        type: 'get',
        url: BigNew.user_detail,
        success: function (backData) {
            // console.log(backData);
            //2-成功后将数据显示在页面对应的标签里
            for (var key in backData.data) {
                $('.' + key).val(backData.data[key]);
            }
            $('img.user_pic').attr('src', backData.data.userPic);
        }
    });

    // 需求2：点击修改按钮，获取用户输入的信息发送ajax请求完成修改
    $('.btn-edit').on('click', function (e) {
        e.preventDefault();
        // 1-获取form表单里面的内容
        var fd = new FormData($('form')[0]);
        // 2-发送ajax请求
        $.ajax({
            type: 'post',
            url: BigNew.user_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                // 3-如果成功，刷新首页个人信息刷新
                if (backData.code == 200) {
                    alert('修改成功');
                    // 方式1：
                    // parent.window.location.reload();
                    // 方式2：重新发送ajax请求加载数据
                    $.ajax({
                        url: window.BigNew.user_info,
                        success: function (backData) {
                            console.log(backData);
                            if (backData.code == 200) {
                                //给父页面的个人信息标签设置新的值.
                                parent.$(".user_info>span>i").text(backData.data.nickname);
                                parent.$(".user_info>img").attr("src", backData.data.userPic);
                                parent.$(".user_center_link>img").attr("src", backData.data.userPic);
                            }
                        }
                    });

                }
            }
        });
    });
});