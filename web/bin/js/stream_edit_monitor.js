$(function(){
    /* 
    初始化 */
    $('#DataProcessForm').tabs({
        create:function(e, ui){
            if(typeof stream_id == 'undefined'){
                $(this).tabs('select', '#BasicInfo');
            }
        },
        select:function(e, ui){
            if(typeof stream_id == 'undefined'){
                e.preventDefault();
                return;
            }
            if(ui.panel.id == 'BasicInfo') {
                window.location = '/draft/stream_edit?stream_id='+stream_id+'#BasicInfo';
            } else if(ui.panel.id == 'InputStream') {
                window.location = '/draft/stream_edit_inputs?stream_id='+stream_id+'#InputStream';
            } else if(ui.panel.id == 'MonitorInfo') {
                // window.location = '/draft/stream_edit_monitor?stream_id='+stream_id+'#MonitorInfo';
            }
            e.preventDefault();
        }
    });


    /* 载入数据监控选项 */
    var monitors_cache = {};
    $.get('/rest/get_monitors', function(ret){
        if(ret.status == 0) {
            var html = '<select id="MonitorList" name="monitor_id">';
            html+='<option value="NULL">==选择监控类型==</option>';
            $.each(ret.data, function(i,v){
                monitors_cache[v.id] = v;
                html+='<option value="'+v.id+'">'+htmlEncode(v.process_type)+'</option>';
            });
            html+='</select>';
            $('#MonitorOption').html(html);
        }
    }, 'json');


    /* 构造监控添加表单HTML */
    function buildMonitorForm(monitor, prefix){
        var str = '<form action="/draft/stream_monitor_add" method="post">';
        str +='<input type="hidden" name="stream_id" value="'+stream_id+'" />';
        str +='<input type="hidden" name="monitor_id" value="'+monitor.id+'" />';
        str +='<table class="form-table">';
        str+='<tr><th width="100">监控介绍</th><td>'+htmlEncode(monitor.description)+'</td></tr>';
        str+='<tr><th>监控参数</th><td id="ProcessParam">'+buildParamAddForm(monitor.param_schema, prefix)+'</td></tr>';
        str+='<tr><td colspan="3"><input type="submit" value="添加" /></td></tr>';
        str += '</table>';
        str+='</form>';
        return str;
    }


    /* 定义监控列表选项动作 */
    $('#MonitorList').live($.browser.msie ? 'click' : 'change', function(){
        var id=$(this).val();
        if(id=='NULL'){
            $('#Monitor').html('');
            return;
        }
        var monitor = monitors_cache[id];
        $('#Monitor').html(buildMonitorForm(monitor, '_monitor'));
    });


});

