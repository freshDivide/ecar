$(function(){
    $('#StreamListPage').tabs({
        select:function(e, ui){
            if(ui.panel.id == 'StreamCreate'){
                window.location = '/stream/createpage';
                e.preventDefault();
            }
        },
        show:function(e, ui){
            if(ui.panel.id == 'StreamCreate'){
                window.location = '/stream/createpage';
                e.preventDefault();
            }
        }
    });
    $('.stream-item').mouseenter(function(){
        $(this).addClass('stream-hover');
    }).mouseleave(function(){
        $(this).removeClass('stream-hover');
    });

    $('.forceputback').live('click',function(e) {
        var stream_id = $(this).attr('stream_id');
        if(confirm('确定要撤销线下修改吗?')) {
            $.createActionForm('/stream/streamCancelChange', { 'stream_id':stream_id}).submit();
        }
        e.preventDefault();
    });

    $('.forceterminateprocess').live('click',function(e) {
        var mis_process_id = $(this).attr('mis_process_id');
        if(confirm('确定要终止流程吗?')) {
            $.createActionForm('/change/terminateProcess', { 'commit_id':mis_process_id}).submit();
        }
        e.preventDefault();
    });
	
	$('#SearchButton').click(function(e){
		var q = $('#search').val();
		q = $.trim(q);
		$('#search').val(q);
		$('#searchStreamForm').submit();
	});
	
    $("#pagerun1 a").live('click', function(e){
        var href = $(this).attr('href');
        if($('#stream_list').length > 0) {
            var q = getParameter(href ,'q');
            var by = getParameter(href,'by');
            var page = getParameter(href,'page');
			
            var node_id = getParameter(href,'node_id');
		
            var query_param = { 'node_id':node_id,'q': q, 'by':by, 'page':page};

            //加载数据流列表界面
            $('#stream_list').html('<li class="empty"><img src="/image/ajax-bar.gif" /></li>');
            $.get('/stream/get_by_node', query_param, function(ret){
                if(ret.status == 0) {
                    $('#stream_list').html(ret.data.streams);
                    $('.page').html(ret.data.page);

                }
            }, 'json');
        }

        e.preventDefault();
    });
	

	$('.viewDataGroup').live('click', function(e) {
		var stream_id = $(this).attr('iid');
		$.get('/rest/getGroupsData', {'stream_id':stream_id}, function(res) {
			if(res.status == 0) {
				var html = '<ul class="stream-list">';
				$.each(res.data, function(k, v) {
					html += '<li class="stream-item">' + 
					'<div class="stream-head"><a target="_blank" href="/stream/view?data_name=' + 
					v.data_name  +  '"> ' + v.data_name + '</a></div>'; 
                    html += '<div class="stream-desc">';
                    $.each(v.nodes, function(k1,v1) {
                        html += v1.fullname + '&nbsp;&nbsp;';
                    });
					html += '</div></li>';
				});
				html += '</ul>';
				$('#ViewDataGroupDialog').html(html);
			}
			else {
				$('#ViewDataGroupDialog').html('<h3>数据获取失败</h3>');
			}
		}, 'json');
		
		$('#ViewDataGroupDialog').dialog("open");
		e.preventDefault();
	});
	
    
	$("#ViewDataGroupDialog").dialog({
		autoOpen: false,
		height: 400,
		width: 650,
		modal: true,
		buttons:{
			'确认':function(){
				$('#edit_form').submit();
				$(this).dialog('close');
			}
		}
	});


});

