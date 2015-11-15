$(function () {
    var first_select = true;
$("#tree")
	.jstree({ 
		// List of active plugins
		"plugins" : [ 
			"themes","json_data","ui","crrm","cookies","dnd","contextmenu" ,"search"
		],

		// I usually configure the plugin that handles the data first
		// This example uses JSON as it is most common
		"json_data" : { 
			// This tree is ajax enabled - as this is most common, and maybe a bit more complex
			// All the options are almost the same as jQuery's AJAX (read the docs)
			"ajax" : {
				// the URL to fetch the data
				"url" : "/tree/children",
				// the `data` function is executed in the instance's scope
				// the parameter is the node being loaded 
				// (may be -1, 0, or undefined when loading the root nodes)
				"data" : function (n) { 
					// the result is fed to the AJAX request `data` option
                    if(n.data) {
                        var id = n.data('id');
                    }
					return { 
						"id" : id ? id : 0
					}; 
				}
			}
		},
		// UI & core - the nodes to initially select and open will be overwritten by the cookie plugin

		// the UI plugin - it handles selecting/deselecting/hovering nodes
		"ui" : {
			// this makes the node with ID node_4 selected onload
			"initially_select" : [ "tree_node_1" ],
             "select_limit" : 1
		},
		// the core plugin - not many options here
		"core" : { 
			// just open those two nodes up
			// as this is an AJAX enabled tree, both will be downloaded from the server
			"initially_open" : [ "tree_node_1" ] 
		},
        "cookies" : {
            save_selected: "select_node"
        }
	})
    .bind("create.jstree", function (e, data) {
		$.post(
			"/tree/create", 
			{ 
				"parent_id" : data.rslt.parent.data ? data.rslt.parent.data("id"):0,
				"name" : data.rslt.name
			}, 
			function (ret) {
				if(ret.status != 0) {
                    alert(ret.msg);
					$.jstree.rollback(data.rlbk);
				}
                else {
                    data.inst.refresh();
                }
			},
            'json'
		);
	})
	.bind("remove.jstree", function (e, data) {
        var id = data.rslt.obj.data('id');
        $.post('/tree/remove', { id:id }, function(ret){
            if(ret.status == 0) {
			    data.inst.refresh();
            } else {
                alert(ret.msg);
				$.jstree.rollback(data.rlbk);
            }
        }, 'json');
	})
	.bind("rename.jstree", function (e, data) {
		$.post(
			"/tree/rename", 
			{ 
				"id" : data.rslt.obj.data('id'),
				"name" : data.rslt.new_name
			}, 
			function (ret) {
				if(ret.status!=0) {
                    alert(ret.msg);
					$.jstree.rollback(data.rlbk);
				}
			},
            'json'
		);
	})
	.bind("move_node.jstree", function (e, data) {
        var to = data.rslt.np.data('id');
        data.rslt.o.each(function(i){
            var $t = $(this);
            var from = $t.data('id');
            $.post('/tree/move', { from:from, to:to }, function(ret){
                if(ret.status != 0) {
                    alert(ret.msg);
		            $.jstree.rollback(data.rlbk);
                }
            }, 'json');
        });
	})

    // ========================================
    .bind('select_node.jstree', function(e, data){
        node_id = data.rslt.obj.data('id');
        var query_param = { 'node_id':node_id };

        //加载数据流列表界面
	g_cur_node_id = node_id;
	if(stat_type == 'node_update_stat')
	{
		load_node_update_stat(query_param);
	}
	else if(stat_type == 'node_stream_stat')
	{
		load_node_stream_stat(query_param);
	}
	else if(stat_type == 'stream_stat')
	{
		if( tree_node_loaded == true )
		{
			window.location.href='/stat/node_stream_stat';
		}
		else
		{
			tree_node_loaded = true;
		}
	}
        first_select = false;
    }).bind("loaded.jstree", function (event, data) { 
        first_select = true;
    });

    // ========================================

    
    //新建根节点
    $("#new_root").click(function () {
	    $("#tree").jstree("create", null, "last", { state:'opened' });
	});

});


var g_days_cnt = 7;
var g_cur_node_id = 1;
var g_node_stream_list_str="";
var g_time_condition="";
function load_node_update_stat( query_param )
{
	if( g_days_cnt > 0 )
	{
		query_param['day']= g_days_cnt;
	}
	else
	{
		query_param['start_date'] = $("#start_date").val();
		query_param['end_date']   = $("#end_date").val();
	}

	// 显示加载图
	$("#li_loading").show();
	$("#li_no_data").hide();
	$("#li_update_frequency").hide();
	$("#li_most_frequent").hide();
	$("#li_update_cnt_dist").hide();

        $.get('/stat/get_node_update_stat_info', query_param, function(ret)
	{
            if(ret.status == 0) 
	    {

                $('#node_fullname').html(ret.data.node_fullname);
                $('#start_date').val(ret.data.start_date);
                $('#end_date').val(ret.data.end_date);

		g_node_stream_list_str = ret.data.node_stream_list;
		g_time_condition = ret.data.time_condition;
		
		// 加载图隐藏
		$("#li_loading").hide();
		
		// 更新频率统计
		var has_data_for_update = ret.data.update_frequency.has_data;
		if( has_data_for_update )
		{
			pic_time_interval = ret.data.update_frequency.time_interval;
			pic_time_start = ret.data.update_frequency.time_start;
			update_frequency_data = ret.data.update_frequency.update_data;

			$("#li_update_frequency").show();
			$("#li_most_frequent").show();
			$("#li_update_cnt_dist").show();

			plot_update_frequency();

			// 更新最多数据流
			plot_most_freq_datastream(ret.data.most_freq_datastream);

			update_cnt_dist_xaxis = ret.data.most_freq_datastream.update_cnt_dist.dist_range;
			update_cnt_dist_data  = ret.data.most_freq_datastream.update_cnt_dist.dist_val;
			plot_update_cnt_distribute();
		}
		else
		{
			$("#li_update_frequency").hide();
			$("#li_most_frequent").hide();
			$("#li_update_cnt_dist").hide();
		}
		if( ! has_data_for_update)
		{
			$("#li_no_data").show();
			$("#span_no_data").html("该时间段内没有更新操作。");
		}
		else
		{
			$("#li_no_data").hide();
		}
            }
        }, 'json');
}
function load_node_stream_stat( query_param )
{
	if( g_days_cnt > 0 )
	{
		query_param['day']= g_days_cnt;
	}
	else
	{
		query_param['start_date'] = $("#start_date").val();
		query_param['end_date']   = $("#end_date").val();
	}

	// 显示加载图
	$("#li_loading").show();
	$("#li_no_data").hide();
	$("#li_datastream_cnt").hide();
	$("#li_new_added_datastream").hide();

        $.get('/stat/get_node_stream_stat_info', query_param, function(ret)
	{
            if(ret.status == 0) 
	    {

                $('#node_fullname').html(ret.data.node_fullname);
                $('#start_date').val(ret.data.start_date);
                $('#end_date').val(ret.data.end_date);

		g_node_stream_list_str = ret.data.node_stream_list;
		g_time_condition = ret.data.time_condition;
		
		// 加载图隐藏
		$("#li_loading").hide();
		
		// 数据流个数统计
		var has_data_for_stream_cnt = ret.data.node_datastream_cnt.has_data;
		if( has_data_for_stream_cnt )
		{
			datastream_name_list = ret.data.node_datastream_cnt.name_list;
			datastream_import_cnt_data = ret.data.node_datastream_cnt.import_cnt_list;
			datastream_all_cnt_data = ret.data.node_datastream_cnt.all_cnt_list;
			var cnt=ret.data.node_datastream_cnt.datastream_cnt;
			var ht = 250;
			if(cnt >= 20 )
			{
				ht = 30 * cnt;
			}
			else if(cnt >= 10)
			{
				ht = 40 * cnt;
			}
			else if( cnt > 5 )
			{
				ht = 50 * cnt;
			}
			$("#li_datastream_cnt").show();
			$("#container_datastream_cnt").css("height",""+ht+"px");
			plot_datastream_cnt();
		}
		else
		{
			$("#li_datastream_cnt").hide();
		}
	
		// 新增数据流个数统计
		var has_data_for_new_added = ret.data.node_datastream_new_cnt.has_data;
		if( has_data_for_new_added )
		{
			new_datastream_name_list        = ret.data.node_datastream_new_cnt.name_list;
			new_datastream_static_cnt_data  = ret.data.node_datastream_new_cnt.static_cnt_list;
			new_datastream_dynamic_cnt_data = ret.data.node_datastream_new_cnt.dynamic_cnt_list;
			var cnt=ret.data.node_datastream_new_cnt.datastream_cnt;
			var ht = 250;
			if(cnt >= 20 )
			{
				ht = 30 * cnt;
			}
			else if(cnt >= 10)
			{
				ht = 40 * cnt;
			}
			else if( cnt > 5 )
			{
				ht = 50 * cnt;
			}
			$("#li_new_added_datastream").show();
			$("#container_datastream_new_cnt").css("height",""+ht+"px");
			plot_datastream_new_cnt();
		}
		else
		{
			$("#li_new_added_datastream").hide();
		}

		// 更新频率统计
		if( ! has_data_for_stream_cnt )
		{
			$("#li_no_data").show();
			$("#span_no_data").html("该节点下还没有添加数据流。");
		}
		else if( ! has_data_for_new_added )
		{
			$("#li_no_data").show();
			$("#span_no_data").html("该时间段内没有增加新的数据流。");
		}
		else
		{
			$("#li_no_data").hide();
		}
            }
        }, 'json');
}
function jump_to_day(day_cnt)
{
	g_days_cnt = day_cnt;
	if(stat_type == 'node_update_stat')
	{
		load_node_update_stat( {node_id: g_cur_node_id} );
	}
	else
	{
		load_node_stream_stat( {node_id: g_cur_node_id} );
	}
}
function jump_to_day_range()
{
	g_days_cnt = 0;
	if(stat_type == 'node_update_stat')
	{
		load_node_update_stat( {start_date : $("#start_date").val(), end_date : $("#end_date").val(), node_id:g_cur_node_id} );
	}
	else
	{
		load_node_stream_stat( {start_date : $("#start_date").val(), end_date : $("#end_date").val(), node_id:g_cur_node_id} );
	}
}

var g_cur_page_no = 0;
function plot_most_freq_datastream( data)
{
    	most_freq_datastream_name_list = data.datastream_name;
    	most_freq_datastream_cnt       = data.datastream_cnt;

	var has_data = parseInt(data.has_data);
	var has_more_page = parseInt(data.has_more_page);
	var page_no = parseInt(data.page_no);
	if( has_data == 0 && page_no != 0 )
	{
		alert("该页没有数据，重新输入!!");
		return;
	}
	g_cur_page_no = page_no;
	var cnt=most_freq_datastream_cnt.length;
	var ht = 150;
	if(cnt > 7  )
	{
		ht = cnt * 30;
	}
	else if(cnt  >= 5 )
	{
		ht = 50 * cnt;
	}
	else if(cnt  >= 3 )
	{
		ht = 70 * cnt;
	}
	else
	{
		ht = 150;
	}
	$("#container_most_frequent").css("height",""+ht+"px");
	if( page_no == 0 )
	{
		if( has_more_page == 0 )
		{
			$("#go_left").hide();
			$("#cur_page_no").hide();
			$("#go_right").hide();
		}
		else
		{
			$("#go_left").hide();
			$("#cur_page_no").show();
			$("#go_right").show();
		}
	}
	else if( has_more_page == 0 )
	{
		$("#go_left").show();
		$("#cur_page_no").show();
		$("#go_right").hide();
	}
	else
	{
		$("#go_left").show();
		$("#cur_page_no").show();
		$("#go_right").show();

	}
	$("#cur_page_no").val(page_no+1);
	plot_container_most_frequent();
}

function freq_stream_go_page(go)
{
	go = parseInt(go);
	if(go <=0 )
	{
		go = 0;
	}
	else
	{
		go --;
	}
	freq_stream_go(go);
}
function freq_stream_go(go)
{
	switch(go)
	{
	case -2:
	       go_page_no = 0;
	       break;
	case -1:
	       go_page_no = g_cur_page_no - 1;
	       break;
	case -3:
	       go_page_no = g_cur_page_no + 1;
	       break;
	case -4:
	       go_page_no = -1;
	       break;
	default:
	       go_page_no = go;
	}
	var query_param = {id_list: g_node_stream_list_str, 'time_condition': g_time_condition, p: go_page_no };
        $.get('/stat/most_freq_stream', query_param, function(ret)
	{
            if(ret.status == 0) 
	    {
		plot_most_freq_datastream( ret.data);
	    }
        }, 'json');
}
