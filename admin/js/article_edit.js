$(function () {
    // 需求一：图片预览,给input注册值改变事件
    $('#inputCover').on('change', function () {
        // 1-获取这个文件
        var file1 = this.files[0];
        // 2-给这个文件创建一个url
        var url = URL.createObjectURL(file1);
        // 3-把url赋值给img的src
        $('.article_cover').attr('src', url);

    });

    // 需求二：一进到发表页，就显示文章类别
    $.ajax({
        type: "get",
        url: BigNew.category_list,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                var resHtml = template("article_category_temp", backData);
                $("select.category").html(resHtml);
            }
        },
    });

    // 需求三：日期插件
    jeDate("#testico", {
        isinitVal: true,
        zIndex: 9999,
        format: "YYYY-MM-DD",
        isTime: false,
        minDate: "2014-09-19 00:00:00"
    })
    // 需求四：富文本编辑
    var E = window.wangEditor;
    var editor = new E('#editor');
    editor.create();

    // 需求五：编辑第一步：
    // 1-获取一下传递过来的id
    var articleId = window.location.search.split('=')[1];
    // 2-根据id发送ajax请求，获取该id的所有信息
    setTimeout(function () {
        $.ajax({
            type: 'get',
            url: BigNew.article_search,
            data: {
                id: articleId
            },
            success: function (backData) {
                if (backData.code == 200) {
                    // 3-把文章的数据显示在对应的标签里
                    $('#inputTitle').val(backData.data.title);
                    $('.article_cover').attr('src', backData.data.cover);
                    $('select.category').val(backData.data.categoryId);
                    $('#testico').val(backData.data.date);
                    editor.txt.html(backData.data.content);
                }
            }
        });
    }, 20);
    // 设置定时器，解决延迟bug，等所有数据都显示出来，再进行编辑

    // 需求五：编辑第二步： 
    $('.btn-edit').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData($('form')[0]);
        // 检查name属性值和接口参数是否一致
        fd.append('id', articleId);
        fd.append('content', editor.txt.html());
        fd.append('state', '已发布');
        $.ajax({
            type: 'post',
            url: BigNew.article_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                if (backData.code == 200) {
                    alert('修改成功');
                    window.history.back();
                }
            }
        });
    });


});