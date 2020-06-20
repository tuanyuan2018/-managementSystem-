// 入口函数
$(function () {
    // 需求1：发送ajax请求，一进到首页获取个人信息

    // 1-原生js发送ajax请求把token带过去
    // 1.1 创建XMLHttpRequest对象
    // var xhr = new XMLHttpRequest();
    // // console.log(xhr);
    // // 1.2调用open方法，设置请求方式和请求地址
    // xhr.open('get', 'http://localhost:8080/api/v1/admin/user/info');
    // // 1.3设置请求头，把token带过去
    // xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
    // // 1.4请求成功后的回调函数
    // xhr.onload = function () {
    //     var res = JSON.parse(xhr.response);
    //     // 2-请求成功后把信息显示在页面上
    //     $('.user_info>img').attr('src', res.data.userPic);
    //     $('.user_info>span>i').text(res.data.nikename);
    //     $('.user_center_link>img').attr('src', res.data.userPic);
    // }
    // // 1.5发送
    // xhr.send();

    //2-jquery发送ajax请求把token带过去
    $.ajax({
        type: 'get',
        url: BigNew.user_info,
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                $('.user_info>span>i').text(backData.data.nickname);
                $('.user_info>img').attr('src', backData.data.userPic);
                $('.user_center_link>img').attr('src', backData.data.userPic);
            }
        }
    });

    
    // 需求2:退出首页
    $('.logout').on('click', function (e) {
        e.preventDefault();
        if (confirm('你确定要退出吗？')) {
            //移除token
            localStorage.removeItem('token');
            window.location.href = './login.html';
        }
    });


    // 需求3:点击左侧一级菜单,当前菜单添加类兄弟li移除类
    $('div.level01').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        // 如果是第二个菜单文章管理，ul展开，并且小三角旋转
        if ($(this).index() == 1) {
            $('ul.level02').slideToggle();
            $(this).find('b').toggleClass('rotate0');
            // ul展开默认选中第一个li
            // 触发DOM元素a的点击跳转事件，利用事件冒泡原理，也就是触发了父级li的点击事件
            $('ul.level02>li:eq(0)>a')[0].click();
            // $('ul.level02').first().trigger('click');

        }
    });


    // 需求4:左侧导航栏二级菜单ul>li的点击事件
    $('ul.level02>li').on('click', function () {
        // 1-当前点击的菜单添加类，兄弟移除
        $(this).addClass('active').siblings().removeClass('active');
        // 2-点击一级菜单文章管理，二级菜单ul的文章列表li被选中
        // 方式1：文章管理里的a链接默认指向文章列表页面，<a href='list.html'></a>，触发二级菜单的第一个li的点击事件， $('ul.level02').first().trigger('click');
        // 方式2：文章管理里的a链接默认指向文章列表页面，<a href='list.html'></a>,触发DOM元素a的点击事件，利用事件冒泡原理，也就是触发了父级li的点击事件
    });


});