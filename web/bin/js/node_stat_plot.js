var datastream_name_list=[];
var datastream_import_cnt_data=[];
var datastream_all_cnt_data=[];
function plot_datastream_cnt()
{
    $('#container_datastream_cnt').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: '节点数据流数量统计'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: datastream_name_list,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' 个'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        //legend: {
        //    layout: 'vertical',
        //    align: 'right',
        //    verticalAlign: 'middle',
        //    floating: true,
        //    borderWidth: 1,
        //    backgroundColor: '#FFFFFF',
        //    shadow: true
        //},
        credits: {
            enabled: false
        },
        series: [{
            name: 'import 类型',
            data: datastream_import_cnt_data
        }, {
            name: '所有类型',
            data: datastream_all_cnt_data
        }]
    });
}

var new_datastream_name_list=[];
var new_datastream_static_cnt_data=[];
var new_datastream_dynamic_cnt_data=[];
function plot_datastream_new_cnt()
{
    $('#container_datastream_new_cnt').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: '节点新增数据流统计'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: new_datastream_name_list,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' 个'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        //legend: {
        //    layout: 'vertical',
        //    align: 'right',
        //    verticalAlign: 'middle',
        //    floating: true,
        //    borderWidth: 1,
        //    backgroundColor: '#FFFFFF',
        //    shadow: true
        //},
        credits: {
            enabled: false
        },
        series: [{
            name: '静态词典',
            data: new_datastream_static_cnt_data
        }, {
            name: '动态词典',
            data: new_datastream_dynamic_cnt_data
        }]
    });
}
var pic_time_interval = 86400;
var pic_time_start = 0;
var update_frequency_data = [];
function plot_update_frequency()
{
        var column_options = {
                    dataLabels: {
                        rotation: -90,
                        color: '#CCCCCC',
                        align: 'right',
                        x: 4,
                        y: 10,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif',
                            textShadow: '0 0 3px black'
                        },
                        enabled: true
                    },
                    enableMouseTracking: true
                };
        if ( update_frequency_data.length > 30 )
        {
                column_options = {};
        }
        if( update_frequency_data.length <= 10 )
        {
                column_options['pointWidth']=30;
        }

        $('#container_update_frequency').show();
        $('#container_update_frequency').highcharts({
            chart: {
                type: 'column'
            },      
            title: {
                text: '更新频率统计' 
            },      
            subtitle: {
                text: ''
            },      
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: 
                {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m/%e',
                        week: '%y/%m/%e',
                        month: '%b \'%y',
                        year: '%Y'
                },
                title: {
                    text: ''
                }
            },
            credits: {
                enabled: false
            },
            yAxis: {
                min: 0,
                title: {
                    text: '更新次数'
                }
            },
            tooltip: {
                xDateFormat: '%Y年%m月%d日',
                headerFormat: '<table>{point.key}:',
                pointFormat: '<tr><td style="padding:0"><font color=red> {point.y} </font>次</td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: column_options,
            },
            series: [{
                name: '更新次数',
                pointInterval: pic_time_interval * 1000,
                pointStart: (pic_time_start )*1000,
                data: update_frequency_data
            }]
        });
}

var most_freq_datastream_name_list=[];
var most_freq_datastream_cnt=[];
function plot_container_most_frequent()
{
    $('#container_most_frequent').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: '数据流更新次数统计'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: most_freq_datastream_name_list,
            title: {
                text: null
            },
        labels: { 
            formatter: function(){return "<a href='/stream/view?data_name="+this.value+"' target='_blank' style='color:black'>"+this.value+"</a>";} ,
            useHTML: true
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' 次'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '更新次数',
            data: most_freq_datastream_cnt
        }]
    });
}

var update_cnt_dist_xaxis = [];
var update_cnt_dist_data  = [];
function plot_update_cnt_distribute() {
    var column_options = {
                dataLabels: {
                    rotation: -90,
                    color: '#CCCCCC',
                    align: 'right',
                    x: 4,
                    y: 10,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif',
                        textShadow: '0 0 3px black'
                    },
                    enabled: true
                },
                enableMouseTracking: true
            };
    if ( update_cnt_dist_xaxis.length > 30 )
    {
            column_options = {};
    }
    if( update_cnt_dist_xaxis.length <= 10 )
    {
            column_options['pointWidth']=30;
    }

    $('#container_update_cnt_dist').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '数据流更新次数分布'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: update_cnt_dist_xaxis
        },
        yAxis: {
            min: 0,
            title: {
                text: '出现次数'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">更新{point.key}次的数据流</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} 个</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: column_options
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '出现个数',
            data: update_cnt_dist_data
        } ]
    });
}
