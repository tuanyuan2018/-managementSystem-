// 入口函数
$(function () {
    // 发送ajax请求，登录
    // 给登录按钮注册鼠标点击事件,阻止默认跳转
    $('.input_sub').on('click', function (e) {
        e.preventDefault();
        // 2-获取用户用户名和密码，非空判断
        var username = $('.input_txt').val().trim();
        var password = $('.input_pass').val().trim();
        if (username == '' || password == '') {
            // alert('用户名或密码不能为空');
            $('#myModal').modal();
            $('.modal-body').text('用户名或密码不能为空');
            return;
        }
        // 3-发送ajax请求，验证
        $.ajax({
            type: 'post',
            url: BigNew.user_login,
            data: {
                username: username,
                password: password
            },
            success: function (backData) {
                console.log(backData);
                // alert('登录成功'); // alert太丑了，使用模态框弹框
                $('#myModal').modal();
                $('.modal-body').text(backData.msg);
                // 4-先弹框，如果成功后再跳转
                if (backData.code == 200) {
                    // 把token令牌保存到本地,便于后面发送ajax请求无需重复登录
                    localStorage.setItem('token', backData.token);
                    // 模态框关闭，跳转到后台首页
                    $('#myModal').on('hidden.bs.modal', function (e) {
                        // do something...
                        window.location.href = './index.html';
                    });
                }
            }
        });

    });
});