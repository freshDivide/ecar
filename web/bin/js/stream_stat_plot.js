function formatDate(now)   {
          var   year=now.getFullYear();     
          var   month=now.getMonth()+1;     
          var   date=now.getDate();     
          var   hour=now.getHours();     
          var   minute=now.getMinutes();     
          var   second=now.getSeconds();     
          return year+"年"+month+"月"+date+"日";
}
function getLocalTime(nS) {     
    return formatDate(new Date(nS-3600*8*1000));
}
function jump_to_day(day_cnt)
{
    var str=location.href.replace(/&day=[0-9]*/,""); 
    var str=str.replace(/\?day=[0-9]*/,"");
    location.href = str + "&day=" + day_cnt;
}
function next_page()
{
    var url='/stat/stream_update_time_stat?stream_name='+data_name+'&cur_page='+cur_page+'&direction=next&time_condition='+encodeURI(time_condition);
    go_page(url);
}
function last_page()
{
    var url='/stat/stream_update_time_stat?stream_name='+data_name+'&cur_page='+cur_page+'&direction=last&time_condition='+encodeURI(time_condition);
    go_page(url);
}
function go_page(url)
{
    $.get(
            url,
            function (data)
            {       
                eval("var ret="+data);
                if(!ret)
                {
                    alert("fatal error");
                    return;
                }
                cur_page = ret['cur_page'];

                eval("time_uesed_label = "+ret['time_list']);
                eval("dist_time = "+ret['dist_time']);
                eval("process_time = "+ret['process_time']);
                eval("monitor_time = "+ret['monitor_time']);
                eval("total_time = "+ret['total_time']);

                if(ret['have_next_page'])
                {
                    $("#anchor_next_page").show();
                }
                else
                {
                    $("#anchor_next_page").hide();
                }

                if(ret['have_last_page'])
                {
                    $("#anchor_last_page").show();
                }
                else
                {
                    $("#anchor_last_page").hide();
                }

                highchart_plot_data_time_used();
            //    alert(url+"\n"+data);
            }
         ); 
}

//var data_name='123';
//var time_uesed_label=['aa','bb','cc'];
//var dist_time=[1,2,43];
//var process_time=[2,4,5];
//var monitor_time=[11,22,34];
function highchart_plot_data_time_used()
{
        var column_options ={};
        if( time_uesed_label.length <= 10 )
        {
            column_options = { stacking: 'normal' , pointWidth: 30 };
        }
        else
        {
            column_options = { stacking: 'normal' };
        }
                $('#container_time_used').highcharts({
            chart: {
            },
    
            title: {
                text: '用时统计'
            },
    
            xAxis: {
                categories: time_uesed_label
            },
    
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: '单位（秒）'
                }
            },
    
            tooltip: {
                formatter: function() {
                    return this.x+"<br>"+this.series.name +': '+ this.y +' 秒<br/>';
                }
            },
    
            credits: { enabled: false },
            plotOptions: {
                column: column_options,
                line: {
                     animation: false 
            },
            spline: {
                color: 'green',
                    marker: {
                        radius: 4 ,
                        lineColor: 'orange',
                        lineWidth: 1
                    }
                }
            },

            series: [
            {
                type: 'column',
                name: '推送时间',
                data: dist_time
            },
            {
                type: 'column',
                name: 'Monitor 时间',
                data: monitor_time
            },
            {
                type: 'column',
                name: '数据生成时间',
                data: process_time
            }, 
            {
                type: 'spline',
                name: '总时间',
                data: total_time
            }]
        });
}
    
//var time_interval_data=[10,66,69,103,70,26,0,0];
//var time_interval_label=[1,2,3,43,4,5,5,5,6,6,6,6];
// 按时间区间统计更新个数
function plot_time_interval_cnt()
{

    var spline_options = {
        dataLabels: {
            enabled: true
        },
        enableMouseTracking: true
    };
    if( time_interval_data.length > 10 )
    {
        spline_options = {};
    }
    $('#container_time_interval').show();
    $('#container_time_interval').highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: '频率统计'
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
            yAxis: {
                min: 0,
                title: {
                    text: '更新次数'
                }
            },
            tooltip: {
        xDateFormat: '%Y年%m月%d日',
                headerFormat: '<table>{point.key}:',
                pointFormat: '<tr><td style="padding:0">更新 </td>' + '<td style="padding:0"><font color=red> {point.y} </font>次</td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                spline: spline_options
            },
            credits: { enabled: false },
            series: [{
                name: '更新次数',
                pointInterval: pic_time_interval * 1000,
                pointStart: (pic_time_start + 8*3600)*1000,
                data: time_interval_data
            }]
        });
}
function highchart_plot_update_result() 
{
        $('#container_update_result').highcharts({
        chart: {
                type: 'spline',
            }, 
            title: {
                text: '报警统计',
                x: -20 //center
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
            yAxis: {
                title: {
                    text: '次数'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                xDateFormat: '%Y年%m月%d日',
                headerFormat: '<table>{point.key}:',
                pointFormat: '<tr><td style="padding:0">{series.name} </td>' + '<td style="padding:0"><font color=red> {point.y} </font>次</td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            //tooltip: {
            //    formatter: function () {
            //            return getLocalTime(this.points[0].x)+"<br>"+this.points[0].series.name+"："+this.points[0].y+"<br>"+this.points[1].series.name+"："+this.points[1].y;
            //    },
            //    shared: true
            //},
            credits: { enabled: false },
            plotOptions: {
                series: {
                    pointInterval: pic_time_interval * 1000,
                    pointStart: (pic_time_start + 8*3600)*1000
                  }
            },
            series: [{
                name: '数据生成报警',
                data: update_result_opened
            }, {
                name: '监控报警',
                data: update_result_closed
            }
            //, {
            //    name: '成功发布',
            //    data: update_result_published
            //} 
            ]
        });
    };

$(document).ready(function(){
    if(time_uesed_label.length==0)
    {
        $("#li_update_result").hide();
        $("#li_time_interval").hide();
        $("#li_time_used").hide();
        $("#li_no_data").show();
    }
    else
    {
        highchart_plot_data_time_used();
        plot_time_interval_cnt();
        highchart_plot_update_result();
    }
});
