var xxx = {};
var plot_instance_id_list = [];
var plot_time_list = [];
var plot_time_used_list = [];
var plot_time_expect_list = [];
var plot_time_process_list = [];
var plot_time_deploy_list = [];
var map_time_list_to_instance_id = {};
var plot_deploy_msg_list = {};

// 用来异常数据
var plot_process_invalid_list = {};
var plot_deploy_invalid_list = {};

var has_deploy_msg_list = 0;
// 画图
function plot_misweb_stream_effect_time( from_misweb)
{
        var column_options ={};
        var tooltip_shared = true;
        var process_type = ['mis处理时间','分发时间','总时间'];
        if( plot_time_list.length <= 8 ) 
        {       
                column_options = { stacking: 'normal' , pointWidth: 40 };
        }       
        else    
        {       
                column_options = { stacking: 'normal' };
        } 
        var plot_data = [];
        var sub_title = '';
        if(from_misweb)
        {
            plot_data=[{
                 color: '#2f7ed8',
                 //color: 'green',
                 type: 'spline',
                 name: 'PM期望时间',
                 data: plot_time_expect_list
               },
               {
                 type: 'spline',
                 name: '实际用时',
                 data: plot_time_used_list
               }];
               sub_title = '数据来自生效监控';
               tooltip_shared = false;
        }
        else
        {
            plot_data=[
               {
                 type: 'column',
                 name: '分发时间',
                 data: plot_time_deploy_list
               },
               {
                 type: 'column',
                 name: 'mis处理时间',
                 data: plot_time_process_list
               },
               {
                 type: 'spline',
                 name: '总时间',
                 data: plot_time_used_list
               }
               ];
               tooltip_shared = true;
        }
        $('#container_time_used').highcharts({
            chart: {
            },
    
            title: {
                text: 'Misweb数据流生效时间趋势图'
            },
            subtitle: 
            {
                text: sub_title
            },
            xAxis: {
                categories: plot_time_list
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
                    if( has_deploy_msg_list )
                    {
                        var x = this.points[0].x;
                        var s = "<table><tr><td>实例ID<td>：<td>"+map_time_list_to_instance_id[x] +"<tr><td>时间<td>：<td>"+ this.points[0].x+"<tr><td>状态<td>：<td>"+plot_deploy_msg_list[x]+"</table><hr><table>";
                        var i = 0;
                        var m1={};
                        for(i = 0; i< this.points.length; i++)
                        {
                                var n = this.points[i].series.name;
                                var d = this.points[i].y + '秒';
                                if( n == 'mis处理时间')
                                {
                                        if( typeof( plot_process_invalid_list[x]) != 'undefined' )
                                        {
                                                d = '时间过久无法推断';
                                        }
                                }
                                else if( n == '分发时间' )
                                {
                                        if( typeof( plot_deploy_invalid_list[x]) != 'undefined' )
                                        {
                                                d = '时间过久无法推断';
                                        }
                                }
                                else if( n == '总时间' )
                                {
                                        if( typeof( plot_process_invalid_list[x]) != 'undefined' 
                                                || typeof( plot_deploy_invalid_list[x]) != 'undefined' )
                                        {
                                                d = '时间过久无法推断';
                                        }
                                }
                                m1[n] = "<tr><td>"+ n +'<td>：<td>'+ d;
                        }
                        for(i =0; i<process_type.length; i++)
                        {
                                if(typeof(m1[process_type[i]]) !='undefined')
                                {
                                        s+=m1[process_type[i]];
                                }
                        }
                        s+="</table>";
                        return s;
                    }
                    else
                    {
                        return "实例ID："+map_time_list_to_instance_id[this.x] +"<br>时间："+ this.x+"<br>"+this.series.name +': '+ this.y +' 秒<br/>';
                    }
                },
                shared: tooltip_shared,
                useHTML: true
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
            series: plot_data
        });
}

// 加载生效时间数据
var g_cur_page = 0;
function load_misweb_stream_stat_data( direction)
{
        $("#li_loading").show();
        $("#li_time_used").hide();
        $("#li_no_data").hide();

        var query_param = {
                'data_name': g_data_name,
                'tm_start' : start_time_stamp,
                'tm_end' : end_time_stamp,
                'page' : g_cur_page,
                'dist_info' : dist_info,
                'direction': direction
                };

        $.get('/misweb_stat/get_stream_effect_data', query_param, function(ret){
            if(ret.status == 0) 
            {
                if( ret.data.has_data )
                {
                        eval("plot_time_list="+ret.data.time_list);
                        eval("plot_time_used_list="+ret.data.time_used_list);
                        eval("plot_time_expect_list="+ret.data.time_expect_list);
                        eval("plot_instance_id_list="+ret.data.instance_id_list);
                        var i=0;
                        if( typeof(ret.data.time_process_list) !='undefined' )
                        {
                                eval("plot_time_process_list="+ret.data.time_process_list);
                        }
                        if( typeof(ret.data.time_deploy_list) !='undefined' )
                        {
                                eval("plot_time_deploy_list="+ret.data.time_deploy_list);
                        }
                        map_time_list_to_instance_id = {};
                        for(i = 0; i< plot_time_list.length; i++)
                        {
                                map_time_list_to_instance_id [ plot_time_list[i] ] = plot_instance_id_list[i];

                                // 如果数据抄书范围，那么置为0，同时标注
                                if( plot_time_process_list[i] > 3600*24 ) //处理时间超过24小时则为无效
                                {
                                        plot_time_process_list[i] = 0;
                                        plot_process_invalid_list[ plot_time_list[i] ] = 1;
                                }
                                if( plot_time_deploy_list[i] > 3600*24*5 )//配送时间超过5天则为无效
                                {
                                        plot_time_deploy_list[i] = 0;
                                        plot_deploy_invalid_list[ plot_time_list[i] ] = 1;
                                }
                        }
                        if( typeof(ret.data.deploy_msg_list) !='undefined' )
                        {
                                eval("var t="+ret.data.deploy_msg_list);
                                for(i = 0; i< plot_time_list.length; i++)
                                {
                                        plot_deploy_msg_list[ plot_time_list[i] ] = t[i];
                                }
                                has_deploy_msg_list = 1;
                        }
                        else
                        {
                                plot_deploy_msg_list = {};
                                has_deploy_msg_list = 0;
                        }
                        if( ret.data.from_misweb )
                        {
                                plot_misweb_stream_effect_time(true);
                        }
                        else
                        {
                                plot_misweb_stream_effect_time(false);
                        }

                        if( ret.data.have_next_page)
                        {
                                $("#anchor_next_page").show();
                        }
                        else
                        {
                                $("#anchor_next_page").hide();
                        }
                        if( ret.data.have_last_page)
                        {
                                $("#anchor_last_page").show();
                        }
                        else
                        {
                                $("#anchor_last_page").hide();
                        }

                        g_cur_page = ret.data.cur_page;
                        $("#li_loading").hide();
                        $("#li_time_used").show();
                        $("#li_no_data").hide();
                }
                else
                {
                        $("#li_loading").hide();
                        $("#li_time_used").hide();

                        $("#span_no_data").html("对不起，该时间段内没有更新操作!");
                        $("#li_no_data").show();
                }
            }
            else
            {
                    //alert(ret.msg);

                    $("#li_loading").hide();
                    $("#li_time_used").hide();
                    $("#span_no_data").html(ret.msg);
                    $("#li_no_data").show();
            }
        }, 'json');
}
// 所画的生效图的翻页
function next_page()
{
        load_misweb_stream_stat_data("next");
}
function last_page()
{
        load_misweb_stream_stat_data("last");
}

// 点开节点后的加载
$(document).ready(function(){
        if(stat_type == 'misweb_stream_stat')
        {
                load_misweb_stream_stat_data();
        }

});
