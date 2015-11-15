$(function(){
/* 
   数据流保存后才载入下边的内容
*/
if(typeof stream != 'undefined'){

    /*
    标签页
    */ 
    $('#View').tabs();

    /*
    各种操作
    */
    $('#Actions a').button();

    // 克隆数据流
    $('#Clone').click(function(e){
        var data_name = $(this).attr('data_name');
        var new_data_name = window.prompt("请输入新数据流名称(请使用英文、数字和下划线作为名称)", data_name + "_new");

        if(new_data_name !== null) {
            var reg = /^\w+$/;
            if(!reg.exec(new_data_name)){
                alert("请按规则命名，使用英文、数字和下划线");
                return false;
            }
            $.createActionForm('/stream/clone', {'data_name':data_name,'new_data_name':new_data_name}).submit();
        }
        e.preventDefault();
    });

    // 启用数据流
    $('#Activate').click(function(e){
        var id = $(this).attr('iid');
        if(confirm('确定要启用该数据流吗？')){
            $.createActionForm('/stream/activate', {stream_id:id}).submit();
        }
        e.preventDefault();
    });

    // 停用数据流
    $('#Deactivate').click(function(e){
        var id = $(this).attr('iid');
        if(confirm('确定要停用该数据流吗？')){
            $.createActionForm('/stream/deactivate', {stream_id:id}).submit();
        }
        e.preventDefault();
    });

    // 触发数据流
    $('#Trigger').click(function(e){
        var data_name = $(this).attr('data_name');
        if(confirm('确定要触发该数据流吗？')){
            $.createActionForm('/stream/trigger', {'data_name':data_name}).submit();
        }
        e.preventDefault();
    });

    // 触发数据流
    $('#TriggerDistribute').click(function(e){
        var data_name = $(this).attr('data_name');
        if(confirm('确定要配送该数据吗？')){
            $.createActionForm('/stream/distribute', {'data_name':data_name}).submit();
        }
        e.preventDefault();
    });


    // 删除数据流
    $('#Delete').click(function(e){
        var id = $(this).attr('iid');
        if(confirm('确定要删除该数据流吗？')){
            $.createActionForm('/stream/delete', {stream_id:id}).submit();
        }
        e.preventDefault();
    });
    
    // 启用配送
    $('#DistributeActivate').click(function(e){
        var id = $(this).attr('iid');
        if(confirm('确定要启用该数据配送吗？')){
            $.createActionForm('/stream/distributeActivate', {stream_id:id}).submit();
        }
        e.preventDefault();
    });

    // 停用配送
    $('#DistributeDeactivate').click(function(e){
        var id = $(this).attr('iid');
        if(confirm('确定要停用该数据配送吗？')){
            $.createActionForm('/stream/distributeDeactivate', {stream_id:id}).submit();
        }
        e.preventDefault();
    });


    // 提交更改
    $('#Commit').click(function(e){
        var id = $(this).attr('iid');
        if(confirm('确定要提交更改吗？')){
            $.createActionForm('/stream/commit', {stream_id:id}).submit();
        }
        e.preventDefault();
    });
    /*
    *载入数据监控 
     */
    var monitor_instances_cache = {};
    $.get('/rest/get_monitor_instances', {'stream_id':stream.id}, function(ret){
        if(ret.status == 0) {
            var html = '';
            if(ret.data.length > 0) {
                $.each(ret.data, function(i,v){
                    monitor_instances_cache[v.id] = v;
                    html += '<div id="Monitor_'+v.id+'">'+ buildMonitorInstance(v)+ '</div>';
                });
            } else {
                html += '<div class="empty">(无)</div>';
            }
            $('#MonitorInstances').html(html);
        }
    }, 'json');

    function buildMonitorInstance(inst){ 
        var str = '';
        str = '<table class="form-table">';
        str +='<tr><td><b>'+inst.monitor.process_type+'</b> - '+inst.monitor.description+'</td></tr>';
        str +='<tr><td>'+buildParamShow(inst.param)+'</td></tr>';
        if(stream.type == 'import' && typeof stream.process_param.is_resource != 'undefined' && stream.process_param.is_resource != 0) {
            str +='<tr><td><table>'
                + '<tr><td>Hadoop计算集群</td><td>' + inst.hadoop.name  + '</td></tr></table>'
                +'</td></tr>';
        }
        
        str +='</table>';
        return str;
    }

    function buildHistoryItem(inst,bNew){
        var str = '';
        var seperate_pos =  inst.data_path.indexOf('/', "hdfs://".length);
        var node =  inst.data_path.substr(0, seperate_pos);
        
        if(instance_id == inst.id) {
            str += '<li class="history-item history-item-focus">';
        }
        else {
            str += '<li class="history-item">';
        }

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
        str += '<div class="cell"><a href="#" class="LogDetailView" iid="'+inst.id+'" sid="'+inst.sid+'" data_name="'+inst.name + '">执行日志</a></div>';
        if(inst.data_deleted == 0){
            str += '<div class="cell"><a class="track-hadoop-fs-ls" state="wrapped" iid="ls_' + inst.id + '" name_node="' + node + '" href="' + inst.data_path + '">查看数据</a></div>';
            str += '<div class="cell"><a class="track-hadoop-cat-grep-instance" iid="' + inst.id + '" href="#">Grep</a></div>';
            str += '<div class="cell"><a class="get-hadoop-data" path="' + inst.data_path + '" href="#">下载</a></div>';
        }
        else{
            str += '<div class="cell">数据已删除</div>';
        }
    
        
        str += '</div>';//main

        str += '<div class="history-action">';
        str += '<div class="cell"><a href="#" class="up-finger-print" iid="'+inst.id+'">上游实例</a></div>';
        if(bNew == true && inst.state == 'closed' && inst.mis_end != "0000-00-00 00:00:00"){
            str += '<div class="cell"><a href="/stream/confirmPublish/id/' + inst.id + '/sid/' + inst.sid + '/stream_id/' + stream.id + '" class="confirm-publish" sid="' + inst.sid + '" iid="'+inst.id+'">确认发布？</a></div>';
        }

        if(inst.state == 'published' && inst.data_deleted == 0){
            str += '<div class="cell"><a href="#" class="rollback" iid="'+inst.id+'">回滚到此版本</a></div>';
        }
        str += '</div>';
        if(inst.base_id != 0){
            str += '<div class="rollback-cell">'+inst.base_id +'</div>';
        }
        if(stream.data_distributes && inst.state == 'published'){
            var distribute_status =  -1;
            
            $.each(inst.distributelogs, function(i,v){
                if(distribute_status !=  -1 && v.status != distribute_status) {
                    distribute_status = -1;
                    return false;
                }
                distribute_status = v.status;
            });
            
            str += '<div class="cell"><a href="#" class="distribute" iid="'+inst.id+'">';
            if(distribute_status == 0) {
                str += '成功配送';
            }
            else if(distribute_status == 1) {
                str += '配送失败';
            }
            else if(distribute_status == 2) {
                str += '配送进行中';
            }
            else if(distribute_status == 3) {
                str += '未配送';
            }
            else if(distribute_status == 4) {
                str += '版本错过';
            }
            else {
                str += '配送明细';
            }
            
            str += '</a></div>';
        }
        
        
        
        str += '</div>';

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

    /* 
     历史记录
     */
    var latest_id=null, next_id=null;
    var latest_instance = null;
    var history_cache = {};
    $.get('/stream/history', {data_name:stream.data_name}, function(ret){
        if(ret.status == 0 && ret.data.instances.length>0) {
            $('#HistoryList').html(buildHistory(ret.data.instances));
            var list = ret.data.instances;
            latest_id = list[0].id;
            next_id = parseInt(list[list.length-1].id)-1;
            latest_instance = list[0];
        }
    }, 'json');


    /*
     * 历史实例操作
     * */
    $('#up_finger_print_dialog').dialog({
        autoOpen:false,
        width:'auto',
        height:'auto'
    });
    $('.up-finger-print').live('click', function(e){
        var id = $(this).attr('iid');
        var item = history_cache[id];
        $('#up_finger_print_dialog').dialog({'title':'实例<b>' + item.id + '</b>的上游实例'});
        var str = '<table width="450px" class="item-table">' + 
                  '<tr>' + 
                  '<th width="60%">实例名</th>' + 
                  '<th width="25%">实例号</th>' + 
                  '<th width="15%">更新因子</th>' + 
                  '</tr>';
        if(item.fromInstances.length > 0 ) {
            $.each(item.fromInstances, function(i,v){
                if(v.updated_factor == 1) {
                    str += '<tr bgcolor="#CCFF99">';
                }
                else {
                    str += '<tr>';
                }
                str += '<td><a target="blank" href="/stream/view?data_name=' + v.name + '&instance_id=' + v.id + '#DataHistory">' + v.name + '</a></td>';
                str += '<td>' + v.id + '</td>';
                if(v.updated_factor == 1) {
                    str += '<td>是</td>';
                }
                else if(v.updated_factor == 0){
                    str += '<td>否</td>';
                }
                else {
                    str += '<td>未知</td>';
                }
                str += '</tr>';
            });
        }else{
            str += '<tr><td colspan="3">(无)</td></tr>';
        }
        str += '</table>';
    
        $('#up_finger_print').html(str);
        $('#up_finger_print_dialog').dialog('open');
        e.preventDefault();
    });
    $('.rollback').live('click', function(e){
        var id = $(this).attr('iid');
        if(!confirm('真的要回滚到' + id + '吗？'))return;
        $.post('/stream/rollback', {'id':id, 'stream_id':stream.id}, function(ret){
            if(ret){
                alert(ret.msg);
            }else{
                alert('未知错误.');
            }
        },'json');
        e.preventDefault();
    });


    $('#distribute_dialog').dialog({
        autoOpen:false,
        width:'auto',
        height:'auto'
    });
    $('.distribute').live('click', function(e){
        var id = $(this).attr('iid');
        var item = history_cache[id];
        var str = '<table class="item-table">';
        str += '<tr>' + 
        '<th>名字</th>' + 
        '<th>类型</th>' + 
        '<th>状态</th>' + 
        '<th>开始时间</th>' + 
        '<th>结束时间</th>' + 
        '<th>详细</th>' + 
        '</tr>';

        status_arr = new Array("配送成功","配送失败","配送任务进行中","配送任务未开始","版本错过");
        if(item.distributelogs.length > 0 ) {
            $.each(item.distributelogs, function(i,v){
                str += '<tr>' + 
                '<td>' + v.name  + '</td>' + 
                '<td>' + v.type  + '</td>' + 
                '<td>' + (status_arr[v.status]? status_arr[v.status] : "异常状态") + '</td>' + 
                '<td>' + v.start+ '</td>' + 
                '<td>' + v.end+ '</td>' + 
                '<td><a href="http://noah.baidu.com/datadist/dist/instancelist?nodeId=1&keyword=' + v.name + '">详细</a></td>' + 
                '</tr>'; 
            });
        }else{
            str += '<tr><td colspan="5">(无)</td></tr>';
        }
        str += '</table>';
        $('#distribute').html(str);
        $('#distribute_dialog').dialog('open');
        e.preventDefault();
    });


    /* 
    查看更多按钮 */
    $('#More').button().click(function(e){
        var that = this;
        $(that).button('disable').button('option', {label:'载入中...'});
        $.get('/stream/history',{data_name:stream.data_name, 'max_id':next_id}, function(ret){
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

    /*
    新实例更新 */
    var instances_buffer = [];
    var check_interval = 5000;
    var need_check_state = true;
    function check_new(){
        $.get('/stream/history', {data_name:stream.data_name, since_id:latest_id}, function(ret){
            if(ret.status == 0 && ret.data.instances.length>0){
                var list = ret.data.instances;
                latest_instance = list[0];
                latest_id = list[0].id;
                instances_buffer = Array.prototype.concat.apply(ret.data.instances, instances_buffer);
            }
            if(instances_buffer.length>0){
                $('#Notifier').show().text('有 '+instances_buffer.length+' 个新实例产生.');
            }
            timer = setTimeout(function(){
                check_new();
                checkInstStatus();
            }, check_interval);
        }, 'json');
    }
    var timer = setTimeout(function(){
        check_new();
        checkInstStatus();
    }, check_interval);
    

    /**
     * 检测实例上线
     */
    function checkInstStatus() {
        if($('#NeedCheckState').attr('state') === 'false') {
            return;
        }
        
        var new_item = $('.history-main:first');
        
        var id = new_item.attr('iid');
        var state = new_item.children('.history-state').text();
        var view_data = new_item.find('.track-hadoop-fs-ls');
        
        $.get('/stream/historyInstance', {'id':id}, function(ret){
            if(ret.status == 0) {
                var actual_state = ret.data.state;
                if(view_data.attr('href') == '') {	
                    view_data.attr('href', ret.data.data_path);
                    var seperate_pos =  ret.data.data_path.indexOf('/', "hdfs://".length);
                    var node = ret.data.data_path.substr(0, seperate_pos);
                    view_data.attr('name_node', node);
                }
                
                if(actual_state != state) {
                    var history_state = new_item.children('.history-state');
                    history_state.text(actual_state);
                    history_state.next('.cell').text(ret.data.mis_start + '~' + ret.data.mis_end);
                }
                
                if(ret.data.mis_end != '0000-00-00 00:00:00') {
                    $('#NeedCheckState').attr('state' , 'false');
                }
                else {
                    $('#NeedCheckState').attr('state' , 'true');
                }
            }
        }, 'json');
    }
    
    $('#Notifier').click(function(){
        $(this).hide();
        $('.separator').removeClass('separator');
        var insts = $(buildHistory(instances_buffer));
        insts.last().addClass('separator');
        $('#HistoryList').prepend(insts);
        instances_buffer = [];
        $('#NeedCheckState').attr('state' , 'true');
    });

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

    var log_timer_arr = new Array();
    
    $('.LogDetailView').live('click', function(e){
        var id = $(this).attr('iid');
        var sid = $(this).attr('sid');
        var data_name = $(this).attr('data_name');
        
        if( $('#LogDetail_'+id).attr('visible_status') === 'true') {
            $('#LogDetail_'+id).attr('visible_status', 'false');
            $('#LogDetail_'+id).hide();
            if(typeof log_timer_arr[id] !== 'undefined') {
                clearInterval(log_timer_arr[id]);
            }
            
        }
        else {
            updateHistoryLoggingDetail(id, sid, data_name);
            $('#LogDetail_'+id).attr('visible_status', 'true');
            $('#LogDetail_'+id).show();
            
            
        }
        
        
        
        e.preventDefault();
    });
    
    /**
     * 更新mis-logging sid详细情况
     */
    function updateHistoryLoggingDetail(id, sid, data_name) {
        $.get('/stream/history_detail', {'sid':sid, 'data_name':data_name}, function(ret){
            if(ret.status == 0){
                $('#LogDetail_'+id).html(buildLogList(ret.data));
            }
        },'json');
        
        var log_view_cell = $('[sid=' + sid + ']').parent();
        var t = log_view_cell.prev('div');
        var state = t.prev('div');
        if(state.text() !== 'published' && t.text().indexOf('0000-00-00') !== -1) {
            if(typeof log_timer_arr[id] == 'undefined') {
                log_timer_arr[id] = setInterval(function(){
                    updateHistoryLoggingDetail(id, sid, data_name);
                }, 5000);
            }
        }
        else {
            if(typeof log_timer_arr[id] !== 'undefined') {
                clearInterval(log_timer_arr[id]);
            }
        }		 
    }
    

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
                           "<td><a href='/stream/view?data_name=" + v.name + "&instance_id=" + v.id + "#DataHistory'>" + v.name + "</a></td>" + 
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
    
    /**
     * 载入数据配送信息
     */
    var data_distributes_cache = {};
    $.get('/rest/get_data_distributes', {'stream_id':stream.id}, function(ret){
        if(ret.status == 0) {
            var html = '';
            if(ret.data.length > 0) {
                $.each(ret.data, function(i,v){
                    data_distributes_cache[v.id] = v;
                    html += '<div id="Monitor_'+v.id+'">'+ buildDataDistribute(v)+ '</div>';
                });
            } else {
                html += '<div class="empty">(无)</div>';
            }
            $('#DataDistributes').html(html);
        }
    }, 'json');

    function buildDataDistribute(data_distribute){ 
        var str = '';
        str = '<table class="form-table">';
        if(data_distribute.type == 1) {
            str +='<tr><td><b>NOAH配送</b> - 通过NOAH配送系统配送数据&nbsp;&nbsp;<input type="button" class="data-distribute-task-view"  noah_key="'+data_distribute.options.key+'" value="查看配送任务" /></td></tr>';
        }
        else if(data_distribute.type == 2) {
            str +='<tr><td><b>接口获取</b> - 通过MIS接口获取数据的位置，下游主动拉数据</td></tr>';
        }
        else if(data_distribute.type == 3) {
            str +='<tr><td><b>自动化运维配送</b> - 通过自动化运维系统配送数据</td></tr>';
        }
        else if(data_distribute.type == 4) {
            str +='<tr><td><b>http接口回调</b> - 数据流程平台产出数据后，回调http接口</td></tr>';
        }
        else if(data_distribute.type == 5) {
            str +='<tr><td><b>soap接口回调</b> - 数据流程平台产出数据后，回调soap接口</td></tr>';
        }
        else if(data_distribute.type == 6) {
            str +='<tr><td><b>HPC词典加载</b> - 平台将词典推送给HPC加载</td></tr>';
        }
        else if(data_distribute.type == 7) {
            str +='<tr><td><b>自动化运维配送三期配送</b> - 自动化运维配送三期配送</td></tr>';
        }
        else if(data_distribute.type == 8) {
            str +='<tr><td><b>配送池配送</b> - Noah配送池配送</td></tr>';
        }
        
        str +='<tr><td>'+buildParamShow(data_distribute.options)+'</td></tr>';
        
        str +='</table>';
        return str;
    }
    
    // 启用发布功能
    $('#PublishableActivate').click(function(e){
        var id = $(this).attr('iid');
        if(confirm('确定要启用该数据发布功能吗？')){
            $.createActionForm('/stream/publishableActivate', {stream_id:id}).submit();
        }
        e.preventDefault();
    });

    // 停用发布功能
    $('#PublishableDeactive').click(function(e){
        var id = $(this).attr('iid');
        if(confirm('确定要停用该数据发布功能吗？')){
            $.createActionForm('/stream/publishableDeactivate', {stream_id:id}).submit();
        }
        e.preventDefault();
    });
    
    $('.data-distribute-task-view').live('click', function(e) {
        var noah_key = $(this).attr('noah_key');
        var noah_task_url = "http://noah.baidu.com/datadist/dist/list?";
        $.get('/rest/getnoahtaskurl', function(ret){
            noah_task_url = ret;
        });
        window.open (noah_task_url + 'nodeId=0&keyword=' + noah_key) ;
    });
    

}/* if(typeof stream != 'undefined'){ */

});

