$(function(){
    $('#DataView').tabs();
	 
	if(instances.length > 0) {
		var history_cache = {};
		var next_id = instances[instances.length -1].id;
		var data_name = instances[instances.length -1].name;
		$('#HistoryList').html(buildHistory(instances));
	}
	
	
    function buildHistoryItem(inst,bNew){
        var str = '';
		var seperate_pos =  inst.data_path.indexOf('/', "hdfs://".length);
		var node =  inst.data_path.substr(0, seperate_pos);
		
        str += '<li class="history-item">';

        str += '<div class="history-summary">';
        str += '<div class="history-main" iid="'+inst.id+'" sid="'+inst.sid+'" data_name="'+inst.name+'">';
		if(inst.cur_status === 'online') {
			str += '<div class="cell"><img src="/image/online.ico" />'+inst.id+'</div>';
		}
		else if(inst.cur_status === 'offline') {
			str += '<div class="cell"><img src="/image/offline.ico" />'+inst.id+'</div>';
		}
		else {
			str += '<div class="cell"><img src="/image/both.ico" />'+inst.id+'</div>';
		}
		
        
        str += '<div class="cell history-state history-state-'+inst.state+'">'+inst.state+'</div>';
        str += '<div class="cell">'+inst.mis_start+'~'+inst.mis_end+'</div>';
		str += '<div class="cell"><a href="#" id="LogDetailView" iid="'+inst.id+'" sid="'+inst.sid+'" data_name="'+inst.name + '">执行日志</a></div>';
		if(inst.data_deleted == 0){
			str += '<div class="cell"><a class="track-hadoop-fs-ls" state="wrapped" iid="ls_' + inst.id + '" name_node="' + node + '" href="' + inst.data_path + '">查看数据</a></div>';
			str += '<div class="cell"><a class="track-hadoop-cat-grep-instance" iid="' + inst.id + '" href="#">Grep</a></div>';
			str += '<div class="cell"><a class="get-hadoop-data" path="' + inst.data_path + '" href="#">下载</a></div>';
        }
        else{
            str += '<div class="cell">数据已删除</div>';
        }
	
        str += '</div>';//main
   
        str += '<div class="history-detail hide" id="LogDetail_'+inst.id+'"><img src="/image/ajax-loader.gif" /></div>';
		str += '<div class="history-detail" id="TrackResult_ls_' + inst.id + '"></div>';
		
        str += '</li>';
        return str;
    }


    function buildHistory(insts){
        var str = '';
        $.each(insts, function(i, v){
            if(i == 0){
                str += buildHistoryItem(v,true);
            }
            else{
                str += buildHistoryItem(v,false);
            }
            history_cache[v.id] = v;
        });
        return str;
    }


	// 将一个javascript对象转换成一棵html树.
    function objectTree(obj){
        var str = '';
        if($.isPlainObject(obj)){
            str += '<ul class="tree-list">';
            $.each(obj, function(key, val){
                str += '<li class="tree-node tree-node-object"><span class="tree-node-key">' + objectTree(key) + '</span>:' + objectTree(val) + '</li>'; 
            });
            str += '</ul>';
        }else if($.isArray(obj)){
            str += '<ul class="tree-list">';
            $.each(obj, function(index, val){
                str += '<li class="tree-node tree-node-array"><span class="tree-node-key">' + objectTree(index) + '</span>:' + objectTree(val) + '</li>'; 
            });
            str += '</ul>';
        }else{
            str = '<span class="tree-node-value">'+obj+'</span>';
        }
        return str;
    }
	
    function buildLogItem(log, index){
        var str = '';
        if(index % 2){
            str  = '<li class="log-item">';
        }else{
            str  = '<li class="log-item log-item-odd">';
        }
        str += '<div class="log-summary">';
        if(log.level == 'DEBUG'){
            str += '<span class="log-level log-level-debug">'+log.level+'</span> -'; 
        }else if(log.level =='INFO'){
            str += '<span class="log-level log-level-info">'+log.level+'</span> -'; 
        }else if(log.level =='WARN'){
            str += '<span class="log-level log-level-warn">'+log.level+'</span> -'; 
        }else if(log.level =='ERROR'){
            str += '<span class="log-level log-level-error">'+log.level+'</span> -'; 
        }else if(log.level =='FATAL'){
            str += '<span class="log-level log-level-fatal">'+log.level+'</span> -'; 
        }
        str += '<span class="log-title">'+log.title+'</span> - <span class="log-time">'+log.created+'</span></div>';
        if(log._content_obj) {
            str += '<div class="log-content hide">'+objectTree(log._content_obj)+'</div>';
        }
        else {
            str += '<div class="log-content hide">'+objectTree(log.content)+'</div>';
        }
        str +='</li>';
        return str;
    }
    
	/* 
    查看更多按钮 */
    $('#More').button().click(function(e){
        var that = this;
        $(that).button('disable').button('option', {label:'载入中...'});
        $.get('/stream/history',{data_name:data_name, 'max_id':next_id}, function(ret){
            if(ret.status == 0 && ret.data.instances.length>0){
                var list = ret.data.instances;
                next_id = parseInt(list[list.length-1].id)-1;
                $('#HistoryList').append(buildHistory(ret.data.instances));
                $(that).button('enable').button('option', {label:'查看更多...'});
            }else if(ret.status ==0){
                $(that).button('option', {label:'没有了.'});
            }else{
                $(that).button('enable');
            }
        },'json');
    });
	
	
    function buildLogList(logs){
        var str = '<ul id="logging">';
        $.each(logs, function(index, log){
            str += buildLogItem(log, index);
        });
        str += '</ul>';
        return str;
    }

    $('.log-summary').live('click', function() {
        $(this).closest('li').find('.log-content').slideToggle();
    });

    $('#LogDetailView').live('click', function(e){
        var id = $(this).attr('iid');
        var sid = $(this).attr('sid');
		
        var data_name = $(this).attr('data_name');
		
        $.get('/stream/history_detail', {'sid':sid, 'data_name':data_name}, function(ret){
            if(ret.status == 0){
                $('#LogDetail_'+id).slideToggle().html(buildLogList(ret.data));
            }
        },'json');
        e.preventDefault();
    });

	$('#ProblemTracker_grep_dialog_instance').dialog({
        title:'输入要查找的内容:',
        autoOpen:false,
        width:800,
        height:600,
        buttons: {
            '查找':function(){
                perform_grep_instance();
            },
            '取消':function(){$(this).dialog('close');}
        }
    });
	
	function perform_grep_instance(){
        var ids = $('.grep_instance_id');
        var query = $('#Grep_query_instance').val();
        var encoding = $('#Grep_encoding_instance').val();
        var limit = $('#query_limit option:selected').text();

        if(query==null)return;
		
        $.each(ids, function(i,v){
			var id = $(v).text();
			$('#instance_grep_result_'+id).html('<img src="/image/ajax-loader.gif" />');
			$(".instance-grep-result-tr-" + id).show();
			$.get('/rest/grepInstance', {'id':id, 'query':query, 'encoding':encoding,'limit':limit}, function(ret){
				if(ret.status==0){
					$('#instance_grep_result_'+id).html(buildTrackInfo(ret.data,'', query));
				}
				else if(ret.status == 1) {
					$('#instance_grep_result_'+id).html('');
					$(".instance-grep-result-tr-" + id).hide();
				}
				else {
					$('#instance_grep_result_'+id).html('Grep出现错误');
				}
			},'json');
		});

       
    }
	
	//从文件中查找
    $(".track-hadoop-cat-grep-instance").live('click', function(e){
        e.preventDefault();
        $('#Grep_id_instance').val($(this).attr('iid'));
        $('#ProblemTracker_grep_dialog_instance').dialog('open');
		var id = $('#Grep_id_instance').val();
		buildGrepInstance();
        $('#Grep_query_instance').focus();
    });
	
	$('#grep_r_instance').click(function(e){
		buildGrepInstance();
	});
	
	function buildGrepInstance() {
		$('#grep_instance_list').html('<img src="/image/ajax-loader.gif" />');
		var chk = $('#grep_r_instance').attr('checked');
		var id = $('#Grep_id_instance').val();
		var r = 0;
		if(chk == 'checked') {
			r = 1;
		}
		$.get('/rest/getInstancesR', {'id':id, 'r':r}, function(ret){
			if(ret.status==0){
				var str = '<table width="95%" class="item-table">' + 
					'<tr>' + 
					'<th width="55%">实例名</th>' + 
					'<th width="35%">实例号</th>' + 
					'<th width="10%">实例层次</th>' + 
					'</tr>';
				$.each(ret.data, function(i,v){
					str += "<tr>" + 
						   "<td>" + v.name + "</td>" + 
						   "<td class='grep_instance_id'>" + v.id + "</td>" + 
						   "<td>" + v.level + "</td>" + 
						   "</tr>" +
						   "<tr class='hide instance-grep-result-tr-" + v.id + "'><td colspan='3'><div id='instance_grep_result_" + v.id + "'></div></td></tr>"
				});
				str += "</table>";
				$('#grep_instance_list').html(str);
			}else{
				$('#grep_instance_list').html('Grep出现错误');
			}
		},'json');
	}

});

