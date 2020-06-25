// 入口函数
$(function () {
    // 需求1：头像预览
    $('#inputCover').on('change', function () {
        var file1 = this.files[0];
        var url = URL.createObjectURL(file1);
        $('.article_cover').attr('src', url);
    });


    // 需求2：一进到页面就显示文章类别
    // 发送ajax请求，利用模板引擎渲染在下拉菜单里
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                // 2-成功后通过模板引擎渲染
                var resHtml = template('category_temp', backData);
                $('.category').html(resHtml);
            }
        }
    });

    // 需求3：插入日期插件
    jeDate("#testico", {
        isinitVal: true,
        zIndex: 99999,
        format: "YYYY-MM-DD",
        isTime: false,
        minDate: "2014-09-19 00:00:00"
    })

    // 需求4：插入富文本插件
    var E = window.wangEditor;
    var editor = new E('#divEditor');
    editor.create();


    // 需求5:点击发布按钮，发送ajax请求，完成发布
    $('.btn-release').on('click', function (e) {
        e.preventDefault();
        // alert('11');
        // 获取用户输入的内容
        var fd = new FormData($('#form')[0]);
        // 注意：一定要检查标签里有没有name属性，并且和接口的参数名保持一致，否则就容易出bug
        fd.append('content', editor.txt.html());
        fd.append('state', '已发布');
        $.ajax({
            type: 'post',
            url: BigNew.article_publish,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    alert('发布成功');
                    window.location.href = './article_list.html';
                    parent.$('.level02>li:eq(0)').click();
                }
            }
        });
    });

    // 需求六：发布文章为草稿
    $('.btn-draft').on('click', function (e) {
        e.preventDefault();
        // 创建formdata对象
        var fd = new FormData($('form')[0]);
        fd.append('content', editor.txt.html());
        $.ajax({
            type: 'post',
            url: BigNew.article_publish,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                if (backData.code == 200) {
                    alert('保存草稿成功');
                    window.location.href = './article_list.html';
                    parent.$('.level02>li:eq(0)').click();
                }
            }
        });
    });

});