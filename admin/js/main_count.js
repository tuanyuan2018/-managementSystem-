$(function () {
    // 一：一进到页面就获取日新增文章
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/admin/data/info',
        success: function (backData) {
            // console.log(backData);
            $('.spannel_list>div:eq(0)>div>em').text(backData.totalArticle);
            $('.spannel_list>div:eq(1)>div>em').text(backData.dayArticle);
            $('.spannel_list>div:eq(2)>div>em').text(backData.totalComment);
            $('.spannel_list>div:eq(3)>div>em').text(backData.dayComment);

        }
    });

    // 二：折线图
    // 发送ajax请求，返回折线图数据
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/admin/data/article',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (backData) {
            console.log(backData);
            loadEchars(backData);
        }
    });

    function loadEchars(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('curve_show'));

        var data = []; //y轴数据
        var date = []; //x轴日期
        for (var i = 0; i < obj.date.length; i++) {
            data.push(obj.date[i].count);
            date.push(obj.date[i].date);
        }

        option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0] + 10, pt[1] + 10];
                }
            },
            title: {
                left: 'center',
                text: '月新增文章数',
            },

            xAxis: {
                name: '日',
                type: 'category',
                boundaryGap: false,
                data: date
            },
            legend: {
                data: ['新增文章'],
                top: '40'
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {
                        readOnly: false
                    },
                    magicType: {
                        type: ['line', 'bar']
                    },
                    restore: {},
                    saveAsImage: {}
                },
                right: 50
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                max: 40
            },
            series: [{
                name: '新增文章',
                type: 'line',
                smooth: true,
                // symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#f80'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255,136,0,0.39)'
                        }, {
                            offset: .34,
                            color: 'rgba(255,180,0,0.25)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(255,222,0,0.00)'
                        }
                    ])
                },
                data: data
            }],
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }



    // 三：饼图
    // 发送ajax请求，返回饼图数据
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/admin/data/category',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (backData) {
            console.log(backData);
            loadEcharts1(backData);
        }
    });

    function loadEcharts1(obj) {
        // 基于准备好的dom，初始化echarts实例
        var myChart1 = echarts.init(document.getElementById('pie_show'));

        var arr = [];

        for (var i = 0; i < obj.date.length; i++) {
            arr.push({
                name: obj.date[i].name,
                value: obj.date[i].articles
            });
        }

        console.log(arr);



        option1 = {
            title: {
                left: 'center',
                text: '分类文章数量比',
                top: 20,

            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                data: name,
                top: 10
            },
            grid: {
                top: 0,
                left: 50,
                right: 40,
                bottom: 50
            },
            color: ['#5885e8', '#13cfd5', '#00ce68', '#ff9565', '#20ff19'],
            series: [{
                name: '分类名称',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['50%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                data: arr
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);
    }



    // 四：柱状图
    // 发送ajax请求，返回柱状图数据
    // $.ajax({
    //     type: 'get',
    //     url: 'http://localhost:8080/api/admin/data/category',
    //     // headers: {
    //     //     Authorization: localStorage.getItem('token')
    //     // },
    //     success: function (backData) {
    //         console.log(backData);   
    //     }
    // });


});