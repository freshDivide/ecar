var g_process_type = null;


$(function(){	
    $('.type-advanced-attr').hide();
    $('.type-dy-attr').hide();
    $('.type-dy-dict').hide();
    $('#File').hide();

    $('#DataTypeAddr').click(function(e){
        data_type='url';
        $('#FDataURL').show();
        $('#File').hide();
         $('#updated_control_td').parent('tr').show();
    });  
    $('#DataTypeFile').click(function(e){
        data_type='file';
        
        $('#updated_control_select').val(3);
        $('#FDataURL').hide();
        $('#File').show();
        $('#updated_control_td').parent('tr').hide();
    });  
    
    /* 
    初始化 */
    $('#DataProcessForm').tabs({
        create:function(e, ui){
            if(typeof stream == 'undefined'){
                $(this).tabs('select', '#BasicInfo');
            }
        },
        select:function(e, ui){
            if(typeof stream =='undefined' && ui.panel.id != 'BasicInfo'){
                alert('请先输入数据流基本信息.');
                e.preventDefault();
            }
        }
    });

    /**
      获取dispatch_center信息
     */ 
    $.get('/rest/get_dispatch_centers?type=' + env, function(res){
        if(res.status == 0){
            var id = $('#Data_dispatch_center').attr('value');
    
            var str = '<select name="data_dispatch_center_id">'; 
            $.each(res.data, function(i,v){
                if(v.id == id){
                    if(v.base_id == 0) {
                        str += '<option value="'+v.id+'" selected="selected">' +v.name+ '</option>';
                    }
                    else {
                        str += '<option value="'+v.base_id+'" selected="selected">' +v.name+ '</option>';
                    }
                }else{
                    if(v.base_id == 0) {
                        str += '<option value="'+v.id+'">' +v.name+ '</option>';
                    }
                    else {
                        str += '<option value="'+v.base_id+'">' +v.name+ '</option>';
                    }
                }
            });
            str+='</select>';
            str += '<span class="form-tips">没有特殊要求，请使用默认选项</span>';
            $('#Data_dispatch_center').html(str);
        }
    }, 'json');

    /**
      获取hadoop信息
     */ 
    $.get('/rest/get_hadoops?type=' + env, function(res){
        var id = $('#Data_hadoop').attr('value');
        var str = '<select name="data_hadoop_id">'; 
        $.each(res, function(i,v){
            if(v.id == id){
                if(v.base_id == 0) {
                    str += '<option value="'+v.id+'" selected="selected">' +v.name+ '</option>';
                }
                else {
                    str += '<option value="'+v.base_id+'" selected="selected">' +v.name+ '</option>';
                }
            }else{
                if(v.base_id == 0) {
                    str += '<option value="'+v.id+'">' +v.name+ '</option>';
                }
                else {
                    str += '<option value="'+v.base_id+'">' +v.name+ '</option>';
                }
            }
        });
        str+='</select>';
        str += '<span class="form-tips">没有特殊要求，请使用默认选项</span>';
        $('#Data_hadoop').html(str);
    }, 'json');

    /**
      获取强制Process地域信息
     */
    $.get('/rest/get_process_location?type=' + env, function(res){
        var location = $('#Data_process_location').attr('value');
        var str = '<select name="data_process_location">'; 
        str += '<option value="" >无要求</option>'
        $.each(res, function(i,v){
            if(v.location == location){
                str += '<option value="'+v.location+'" selected="selected">' +v.location+ '</option>';
            }else{
                str += '<option value="'+v.location+'">' +v.location+ '</option>';
            }
        });
        str+='</select>';
        str += '<span class="form-tips">没有特殊要求，请使用默认选项</span>';
        $('#Data_process_location').html(str);
    }, 'json');
    
    /**
      获取tag信息
     */ 
    var selected_tags = {}; //id->obj
    var tags_cache = {};//id->obj
    var tags_cache_2 = {};  //fullname->id
    if(typeof stream!= 'undefined'){
        $.each(stream.nodes, function(i,v){
            selected_tags[v.id]=v;
            $('#FTagList').append('<span iid="'+v.id+'" class="stream-tag">'+htmlEncode(v.fullname)+'</span>');
        });
    }
    
    $.get('/rest/get_tags', function(res){
        if(res.status ==0) {
            $.each(res.data, function(i, v){
                tags_cache[v.id] = v;
                tags_cache_2[v.fullname] = v;
            });
   
            if(typeof stream == 'undefined'){
                selected_tags[node_id] = tags_cache[node_id];
                $('#FTagList').append('<span iid="'+node_id+'" class="stream-tag">'+htmlEncode(tags_cache[node_id].fullname)+'</span>');
            }
        }
    }, 'json');
    

   
    $('#BasicForm').submit(function(){
        var val = '';
        $.each(selected_tags, function(i, v){
            val += v.id+',';
        })
        $('#TagInput').val(val);
    });
    
    
    

    /**
      获取并缓存process
      */
    var processes_cache = {};
    function load_process() {
        $.get('/rest/get_processes',{'tool_type':$('#tool_type').attr('type')}, function(ret){
            if(ret.status == 0) {
                var html = '<select id="ProcessList" name="process_id">';
                html+='<option value="NULL">==选择处理工具==</option>';
                $.each(ret.data, function(i,v){
                    processes_cache[v.id] = v;
                    html+='<option value="'+v.id+'">'+htmlEncode(v.process_type)+'</option>';
                });
                html+='</select>';
                $('#ProcessOption').html(html);
            }
        }, 'json');
    }
    
    /**
     * 高级属性
     */
    $('#open_advanced_attr').click(function(e){
        if($(this).attr('state') === 'closed') {
            $(".type-advanced-attr").show();
            $(this).attr('state','opened');
            $(this).html('折叠');
        }
        else {
            $(".type-advanced-attr").hide();
            $(this).attr('state','closed');
            $(this).html('展开');
        }
        e.preventDefault();
    });
    
    /**
     * Dict属性
     */
    $('#open_dy_dict').click(function(e){
        if($(this).attr('state') === 'closed') {
            $(".type-dy-dict").show();
            $(this).attr('state','opened');
            $(this).html('折叠');
        }
        else {
            $(".type-dy-dict").hide();
            $(this).attr('state','closed');
            $(this).html('展开');
        }
        e.preventDefault();
    });
    
    /**
     * 调研属性
     */
    $('#open_dy_attr').click(function(e){
        if($(this).attr('state') === 'closed') {
            $(".type-dy-attr").show();
            $(this).attr('state','opened');
            $(this).html('折叠');
        }
        else {
            $(".type-dy-attr").hide();
            $(this).attr('state','closed');
            $(this).html('展开');
        }
        e.preventDefault();
    });
    
    /**
     * 选择处理类型
     */
    $('#tool_type').live('click',function(e){
        var tool_type = $('#tool_type').attr('type');
        if(tool_type == 'public') {
            $('#tool_type').attr('type','private');
            $('#tool_type').text('非通用处理');
            load_process();
            $('#Process').html('');
        }
        else {
            $('#tool_type').attr('type','public');
            $('#tool_type').text('通用处理');
            load_process();
            $('#Process').html('');
        }
        e.preventDefault();
    });
    
    $('#cancel_process_change').live('click', function(e){
        $('#CurrentProcess').html(buildProcessByStream(stream));
    });
    

    $('#change_process').live('click', function(e){
        var str = '<h5>选择<a href="#" id="tool_type" type="public">通用处理</a>工具  <span style="padding-left:100px;"><a href="#" id="cancel_process_change">撤销改动</a></span></h5> ' + 
              '<div id="ProcessOption"> </div>' + 
              '<div id="Process"></div>';
        $('#CurrentProcess').html(str);
        load_process();
        
        e.preventDefault();
    });
    /**
     * 创建处理表单 
     */
    function buildProcessBySchema(process){
        var str='<table class="form-table">';
        
        str+='<tr><th>处理类型</th><td>'+htmlEncode(process.process_type)+'</td></tr>';
        str+='<tr><th>处理描述</th><td>'+htmlEncode(process.description)+'</td></tr>';
        str+='<tr><th>处理参数</th><td>'+buildParamAddForm(process.param_schema, '_process_param')+'</td></tr>';
        str+='<tr><th>数据属性</th><td>'+buildDataAttributeForm(null, '_data_attr')+'</td></tr>';
        str+='</table>';
        return str;
    }

    /**
      创建处理表单
    */
    function buildProcessByStream(stream){
        var str ="";
        str += "<table class='form-table'>";
        str += "<tr><th width='90'>处理类型</th><td>" + 
               htmlEncode(stream.process.process_type) + 
               "<span style='padding-left:10px;'><a href='#' id='change_process'>更换处理</a></span></td></tr>";
        str += "<tr><th>处理描述</th><td>"+htmlEncode(stream.process.description)+"</td></tr>";
        str += "<tr><th valign='top'>处理参数</th><td>"+buildParamEditForm(stream.process_param, stream.process.param_schema, '_process_param')+"</td></tr>";
        str += "<tr><th valign='top'>数据属性</th><td>"+buildDataAttributeForm(stream.process_param.data_attr, '_data_attr')+"</td></tr>";
        str += "</table>";
        return str;
    }

    /*
    根据类型设置表单项
    TODO 今后要改成schema形式.
     */
    function initFormElements(type){
        g_process_type = type;
        $('.type-import, .type-process').hide();
        if(type == 'import'){
            $('.type-import').show();
        }else if(type == 'process'){
            $('.type-process').show();
        }

        initElemEvents(type);
    }
    
    /**
     * 初始化数据更新控制
     * @param string import or process
     */
    function initUpdateControl(type) {
        var str = '';
        if(type === 'import') {
            str += '<select name="updated_control" id="updated_control_select">'
                + '<option value="0">=请选择更新控制策略=</option>'
                + '<option value="1">自动检测更新</option>'
                + '<option value="2">crontab</option>'
                + '<option value="3">主动触发</option>'
                + '</select>';
        }
        else {
            str += '<select name="updated_control"  id="updated_control_select">'
                + '<option value="0">=请选择更新控制策略=</option>'
                + '<option value="4">上游更新触发</option>'
                + '<option value="2">crontab</option>'
                + '</select>';
        }
        str += '<table id="tbl_update_control"></table>';
        $('#updated_control_td').html(str);
        
        if(typeof stream !== 'undefined') {
            $('#updated_control_select').val(stream.updated_control);
            
            $('#updated_control_select').trigger($.browser.msie ? 'click' : 'change');

        }
    }
    
    /**
     * 更新数据展示
     */
    function initDataProvideType() {
        if(typeof stream !== 'undefined') {
            var data_provide_type = stream.data_provide_type;
    
            if(data_provide_type == 'upload') {
                $('#DataTypeFile').trigger('click');
            }
        }
    }
    
    /* 数据控制选择 */
    $('#updated_control_select').live($.browser.msie ? 'click' : 'change', function(){
        var id=$(this).val();
        if(id=='NULL'){
            return;
        }
        var str = "";
        if(id == 1) {
            str += '<tr><th>检测频率</th><td><input type="text" name="check_frequency" id="check_frequency" class="form-lt" value="10" /><span class="form-tips">单位分钟, 检测源数据更新的频率</span><span id="frequency_valid" class="hide" style="color:#f00;">频率需要配置为整数</span></td></tr>'
                +  '<tr><th>有效时间段</th><td><input type="text" name="effective_period" id="effective_period" class="form-lt" /><span class="form-tips">输入有效时间段 如03:00-14:00,默认是所有的时间均可执行</span><span id="effective_period_valid" class="hide" style="color:#f00;">有效时间段配置不正确</span></td></tr>';
        }
        else if(id == 2) {
            str += '<tr><th>crontab</th><td><input type="text" name="crontab" id="crontab" class="form-lt" /><span class="form-tips">输入crontab</span><span id="crontab_valid" class="hide" style="color:#f00;">crontab配置不正确</span><td></tr>';
        }
        
        $('#tbl_update_control').html(str);
        
        if(typeof stream !== 'undefined') {
            if(id == 1) {
                if(stream.data_autocheck != 0) {
                    $('#check_frequency').val(stream.data_autocheck);
                }
                else {
                    $('#check_frequency').val(10);
                }
                $('#effective_period').val(stream.effective_period);
            }
            else if(id == 2) {
                $('#crontab').val(stream.crontab);
            }
            
        }
        
    });
    
    function getStreamsNode() {
        var str = '<select id="sel_node_id">';
        
        $.each(selected_tags ,function(k,v){
            str += '<option value="' + v.id + '">' + v.fullname + '</option>';
        });
        str += '</select>';
        return str;
    }
    
    //删除数据备份
    $('.rm_data_deploy').live('click', function(e) {
        $(this).closest('tr').remove();
    });
    
    $('#add_data_deploy_config').live('click', function(e) {
        var exists = false;
        $('input[name="node_id[]"]').each(function(){
            if($(this).val() === $('#sel_node_id').val()) {
                alert($('#sel_node_id').find('option:selected').text() + "配置已经添加过了，不能重复添加");
                exists = true;
                return;
            }
        });
        if(exists) {
            return;
        }           
                
        var str = '<tr><td width="150"><strong>' + $('#sel_node_id').find("option:selected").text() + '</strong></td>' +
               '<td><input name="node_id[]" type="hidden" value="' +  $('#sel_node_id').val() + '" />' +
               '<input name="deploy_path[]" style="width:550px;margin-right:20px;" type="text" value="' + $('#deploy_path_add').val() + '" /></td>' +
               '<td><input type="button" class="rm_data_deploy" value="删除" /></td>' +
               '</tr>';

        $(str).insertBefore($(this).closest('tr'));
         $('#deploy_path_add').val('');

    });
    
    /**
     * 展现数据部署
     */
    function initDataDeploy() {
        var str = '';
        if(typeof stream !== 'undefined' && stream.data_deploys) {
            $.each(stream.data_deploys, function(k,v) {
                str += '<tr><td width="150px"><strong>' + v.node_name + '</strong></td>' +
                       '<td><input name="node_id[]" type="hidden" value="' + v.node_id + '" />' +
                       '<input name="deploy_path[]" style="width:550px;margin-right:20px;" type="text" value="' + v.deploy_path +  '" /></td>' +
                       '<td><input type="button" class="rm_data_deploy" value="删除" /></td>' + 
                       '</tr>';
                    
            });
        }
        str += '<tr><td colspan=3>' +
               getStreamsNode() + 
               '<input type="text" style="width:550px;margin-right:20px;" id="deploy_path_add" />' +
               '<input type="button" id="add_data_deploy_config" value="增加" /></td>' + 
               '</tr>';
        $('#data_deploy_config').html(str);
    }
    


    

    /**
      表单动作
      */
    $('#ProcessList').live($.browser.msie ? 'click' : 'change', function(){
        var id=$(this).val();
        if(id=='NULL'){
            $('#Process').html('');
            $('.type-import, .type-process').hide();
            return;
        }
        var process = processes_cache[id];
        $('#Process').html(buildProcessBySchema(process));
        initFormElements(process.type);
    });

    load_process();
    $('.type-import, .type-process').hide();


/* 
   数据流保存后才载入下边的内容
*/
if(typeof stream != 'undefined'){

    initFormElements(stream.process.type);

    /* 载入数据监控选项 */
    var monitors_cache = {};

    /**
     * 加载监控
     */
    function load_monitor() {
        $.get('/rest/get_monitors',{'tool_type':$('#tool_type_m').attr('type')}, function(ret){
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
    }
    load_monitor();
    
    /**
     * 选择处理类型
     */
    $('#tool_type_m').click(function(e){
        var tool_type = $('#tool_type_m').attr('type');
        if(tool_type == 'public') {
            $('#tool_type_m').attr('type','private');
            $('#tool_type_m').text('非通用监控');
            load_monitor();
            $('#Monitor').html('');
        }
        else {
            $('#tool_type_m').attr('type','public');
            $('#tool_type_m').text('通用监控');
            load_monitor();
            $('#Monitor').html('');
        }
        e.preventDefault();
    });

    /* 载入集群 */
    var hadoop_cache = {};
    $.get('/rest/get_hadoops', {'type':env}, function(ret) {
        $.each(ret, function(i,v){
            hadoop_cache[v.id] = v;
        });
    }, 'json');

    
    /* 载入已有的数据监控 */
    var monitor_instances_cache = {};
    $.get('/rest/get_monitor_instances', {'stream_id':stream.id}, function(ret){
        if(ret.status == 0) {
            var html = '';
            if(ret.data.length>0){
                $.each(ret.data, function(i,v){
                    monitor_instances_cache[v.id] = v;
                    html += '<div id="Monitor_'+v.id+'">'+ buildMonitorInstance(v)+ '</div>';
                });
            }else{
                html = '<div class="empty">(无)</div>';
            }
            $('#MonitorInstances').html(html);
        }
    }, 'json');

    
    /* 构造数据监控的HTML */
    function buildMonitorInstance(inst){ 
        var str = '';
        str = '<table class="form-table">';
        str +='<tr><td><b>'+htmlEncode(inst.monitor.process_type)+'</b> - '+htmlEncode(inst.monitor.description)+'</td></tr>';
        str +='<tr><td>'+buildParamShow(inst.param)+'</td></tr>';
        
        if(stream.type == 'import' && typeof stream.process_param.is_resource != 'undefined' && stream.process_param.is_resource != 0) {
            str +='<tr><td><table>'
                + '<tr><td>Hadoop计算集群</td><td>' + inst.hadoop.name  + '</td></tr></table>'
                +'</td></tr>';
        }
        else {
            str +='<tr style="display:none;"><td><table>'
                + '<tr><td>Hadoop计算集群</td><td>' + inst.hadoop.name  + '</td></tr></table>'
                +'</td></tr>';
        }
        
        str +='<tr><td><input class="monitor-edit" iid="'+inst.id+'" type="button" value="修改" /><input type="button" class="monitor-del" iid="'+inst.id+'" value="删除" /></td></tr>';
        str +='</table>';
        return str;
    }

    /* 构造数据监控修改表单 */
    function buildMonitorInstanceForm(inst, prefix){ 
        var str = '<form action="/stream/data_monitor_update" method="post">';
        str +='<input type="hidden" name="stream_id" value="'+stream.id+'" />';
        str += '<input type="hidden" name="id" value="'+inst.id+'" />';
        str += '<table class="form-table">';
        str +='<tr><td><b>'+htmlEncode(inst.monitor.process_type)+'</b> - '+htmlEncode(inst.monitor.description)+'</td></tr>';
        str +='<tr><td>'+buildParamEditForm(inst.param, inst.monitor.param_schema, '_monitor')+'</td></tr>';
        if(stream.type == 'import' && typeof stream.process_param.is_resource != 'undefined' && stream.process_param.is_resource != 0) {
            str +='<tr><td>'  
                + '<table class="param-list"><tr>' 
                + '<td width="100">Hadoop计算集群</td>'
                + '<td width="100"><select name="monitor_hadoop_id" id="' + inst.id + '_update_monitor_hadoop_list"></select></td>'
                + '</tr></table>'
                + '</td></tr>';
        }
        else {
            str +='<tr style="display:none;"><td>'  
                + '<table class="param-list"><tr>' 
                + '<td width="100">Hadoop计算集群</td>'
                + '<td width="100"><input name="monitor_hadoop_id" value="' + stream.data_hadoop_id+ '"/></td>'
                + '</tr></table>'
                + '</td></tr>';
        }
        
        str +='<tr><td><input class="monitor-cancel" iid="'+inst.id+'" type="button" value="取消" /> <input class="monitor-ok" type="submit" value="确认" /></td></tr>';
        str +='</table></form>';
        
        return str;
    }

     /* 载入已有的数据配送状态 */
    var data_distribute_cache = {};
    $.get('/rest/get_data_distributes', {'stream_id':stream.id}, function(ret){
        if(ret.status == 0) {
            var html = '';
            if(ret.data.length>0){
                $.each(ret.data, function(i,v){
                    data_distribute_cache[v.id] = v;
                    html += '<div id="DataDistribute_'+v.id+'">'+ buildDataDistribute(v)+ '</div>';
                });
            }else{
                html = '<div class="empty">(无)</div>';
            }
            $('#DistributeInstances').html(html);
        }
    }, 'json');
    
    /* 构造数据配送HTML */
    function buildDataDistribute(data_distribute){ 
        var str = '';
        str = '<table class="form-table">';
        //noah配送
        if(data_distribute.type == 1) {
            str +='<tr><td><b>NOAH配送</b> - 通过NOAH配送系统配送数据</td></tr>';
        }
        //接口配送
        else if(data_distribute.type == 2) {
            str +='<tr><td><b>接口获取</b> - 通过MIS接口获取数据的位置，下游主动拉数据</td></tr>';
        }
        
        //zookeeper配送
        else if(data_distribute.type == 3) {
            str +='<tr><td><b>自动化运维配送</b> - 通过自动化运维系统配送数据</td></tr>';
        }
        
        //http回调
        else if(data_distribute.type == 4) {
            str +='<tr><td><b>http回调</b> - 数据执行完毕后，调用http回调接口</td></tr>';
        }
        
        //soap回调
        else if(data_distribute.type == 5) {
            str +='<tr><td><b>soap回调</b> - 数据执行完毕后，调用soap回调接口</td></tr>';
        }
        
        //hpc词典加载
        else if(data_distribute.type == 6) {
            str +='<tr><td><b>HPC词典加载</b> - 执行dsub将词典推送给HPC加载</td></tr>';
        }

        //自动化运维三期配送
        else if(data_distribute.type == 7) {
            str +='<tr><td><b>自动化运维三期</b> - 自动化运维三期配送</td></tr>';
        }

        //noah配送池配送
        else if(data_distribute.type == 8) {
            str +='<tr><td><b>配送池配送</b> - 通过noah配送池配送任务</td></tr>';
        }

        str +='<tr><td>'+buildParamShow(data_distribute.options)+'</td></tr>';
        str +='<tr><td><input class="data-distribute-edit" iid="'+data_distribute.id+'" type="button" value="修改" /><input type="button" class="data-distribute-del" iid="'+data_distribute.id+'" value="删除" />';
        if(data_distribute.type == 1) {
            str += '<input type="button" class="data-distribute-task-add" iid="'+data_distribute.id+'" noah_key="'+data_distribute.options.key+'" noah_node_name="' + data_distribute.options.noah_node_name + '" value="新增任务" />';
            str += '<input type="button" class="data-distribute-task-view" noah_key="'+data_distribute.options.key+'" value="查看任务" />';
        }
        str += '</td></tr>';
        if(data_distribute.type == 1) {
            str += '<tr id="noah_task_line_' + data_distribute.id + '" class="hide"><td></td></tr>';
        }
        str +='</table>';
        return str;
    }
    
    function buildDistributeDesc(type) {
        var str = '<table class="form-table">';
        if(type == 1) {
            str +='<tr><th colspan=2>NOAH配送 - 配置参数说明</th></tr>'  
                + '<tr><th>type</th><td>只能填写online或offline, online表示线上配送，offline表示线下PS配送</td></tr>'
                + '<tr><th>noah key</th><td>和NOAH关联的Key,可通过MIS自动注册</td></tr>'
                + '<tr><th>chosen_folder</th><td>一般无需填写，少量分环词典配送需要配置</td></tr>'
                + '<tr><th>描述</th><td>数据生效策略说明</td></tr>'
                + '</td></tr>';
        }
        else if(type == 2) {
            str +='<tr><td><b>接口配送</b> - 配置参数说明' 
                + '<table><tr><th>描述</th><td>数据生效策略说明</td></tr></table>'
                + '</td></tr>';
        }
        else if(type == 3) {
            str +='<tr><td><b>自动化运维配送</b> - 配置参数说明' 
                + '<table><tr><th>type</th><td>只能填写online或offline, online表示线上配送，offline表示线下PS配送</td></tr>'
                + '<table><tr><th>描述</th><td>数据生效策略说明</td></tr></table>'
                + '</td></tr>';
        }
        else if(type == 4) {
            str +='<tr><td><b>http接口回调</b> - 配置参数说明' 
                + '<table><tr><th>method</th><td>接口方法</td></tr><tr><th>url</th><td>url，设置为空的时候为后台自动传入</td></tr><tr><th>options</th><td>回调的时候需要传入的参数,如果没有，请置空</td></tr><tr><th>描述</th><td>数据生效策略说明</td></tr></table>'
                + '</td></tr>';
        }
        else if(type == 5) {
            str +='<tr><td><b>soap接口回调</b> - 配置参数说明' 
                + '<table><tr><th>soap</th><td>soap地址，设置为空的时候为后台自动传入</td></tr><tr><tr><th>method</th><td>方法名，如果为后台自动传入，请置空</td></tr><tr><th>options</th><td>回调的时候需要传入的参数,如果没有，请置空</td></tr><tr><th>描述</th><td>数据生效策略说明</td></tr></table>'
                + '</td></tr>';
        }
        else if(type == 6) {
            str +='<tr><td><b>HPC词典加载</b> - 配置参数说明' 
                + '<table><tr><th>type</th><td>online标识线上使用的词典加载配置， offline标识预生效环境词典加载的配置</td></tr><tr><th>shiftmain</th><td>是否自动切换到主版本,0表示不切换，1表示自动切换,默认会自动切换</td></tr><tr><tr><tr><th>-n</th><td>字典名称</td></tr><tr><tr><th>-a</th><td>字典分环的环数</td></tr><tr><th>-u</th><td>字典加载用户名（必选，添加白名单指定的用户名）</td></tr><tr><th>-p</th><td>字典加载密码</td></tr><tr><tr><th>-a</th><td>字典分环的环数</td></tr><tr><th>-s</th><td>s：字典的safemode，如用户的字典副本数设置为3，safemode设置为2，则字典成功加载了两个副本后字典调度平台认为字典可用</td></tr><tr><th>-c</th><td>字典每个环需要加载多少个副本</td></tr><tr><th>-m</th><td>字典加载后需要的内存，单位是MB</td></tr><tr><th>-o</th><td>单位s，字典加载所需要的时间，如果在该时间段内字典还没有加载成功，则字典并不被卸载，发邮件和短信报警提示字典加载timeout</td></tr><tr><th>-i</th><td>字典可以加载多少个版本，超过此版本数则自动卸载旧的且不是main_version的字典版本，必选参数</td></tr><tr><th>-d</th><td>需要暂用的磁盘空间大小(单位M)</td></tr><tr><th>--parrule</th><td>字典分环策略，比如MOD代表取模（可选，默认是MOD）</td></tr><tr><th>--dicttype</th><td>字典类型（可选，默认是DROVL）</td></tr><tr><th>--confpath</th><td>配置文件目录（可选，默认是当前工作目录）</td></tr><tr><th>--confname</th><td>配置文件名称（可选，默认是client_configure）</td></tr><tr><th>--ruleparam</th><td>字典分环策略对应的分环参数（可选，默认为1）</td></tr><tr><th>--prefer</th><td>当使用多个集群的机器搭建字典平台的时候，用来指定字典加载可选集群，指定后优先加载到指定集群（可选，默认default）</td></tr><tr><th>--queue</th><td>提交到的队列(集群 机器类型)</td></tr><tr><th>--extra</th><td>当有额外参数提供时填写</td></tr></table>'
                + '</td></tr>';
        }
        else if(type == 7) {
            str +='<tr><td><b>自动化运维三期</b> - 配置参数说明' 
                + '<table><tr><th>type</th><td>只能填写online或offline, online表示线上配送，offline表示线下PS配送</td></tr>'
                + '<tr><th>mode</th><td>配送模式，normal表示直接配送， distributed_dict表示分环词典配送</td></tr>'
                + '<tr><th>priority</th><td>配送优先级，默认normal， 只有特殊时效性需求时选择high，编辑时请输入60或者65这两个数字。</td></tr>'
                + '<tr><th>描述</th><td>数据生效策略说明</td></tr>'
                + '</td></tr>';
        }
        else if(type == 8) {
            str +='<tr><td><b>配送池配送</b> - 配置参数说明'
                + '<table><tr><th>pool</th><td>选择常用配送池,表示正常普通配送池</td></tr>'
                + '<tr><th>描述</th><td>配送池选用说明</td></tr>'
                + '</td></tr>';
        }
        str += '</table>';
        return str;
    }
    
    /* 构造数据监控修改表单 */
    function buildDataDistributeForm(data_distribute, prefix){ 
        var str = '<form action="/stream/data_distribute_update" method="post">';
        str +='<input type="hidden" name="stream_id" value="'+stream.id+'" />';
        str += '<input type="hidden" name="id" value="'+data_distribute.id+'" />';
        str += buildDistributeDesc(data_distribute.type);
        
        str += '<table class="form-table">';
        
        
        str +='<tr><td>'+buildParamEditForm(data_distribute.options, data_distribute.options, '_data_distribute')+'</td></tr>';
        
        str +='<tr><td><input class="data-distribute-cancel" iid="'+data_distribute.id+'" type="button" value="取消" /> <input class="data-distribute-ok" type="submit" value="确认" /></td></tr>';
        str +='</table></form>';
        
        return str;
    }
    
    /* 监控修改表单动作 */
    $('.data-distribute-edit').live('click', function(){
        var id = $(this).attr('iid');
        
        $('#DataDistribute_'+id).html(buildDataDistributeForm(data_distribute_cache[id], '_data_distribute'));
    });
    $('.data-distribute-del').live('click', function(){
        var id = $(this).attr('iid');
        if(!confirm('请确认确定要删除这条配送?')){
            return;
        }
        $('<form action="/stream/data_distribute_delete" method="post"><input type="hidden" name="stream_id" value="'+stream.id+'" /><input type="hidden" name="id" value="'+id+'" /></form>').appendTo('body').submit();
    });
    $('.data-distribute-cancel').live('click', function(){
        var id = $(this).attr('iid');
        $('#DataDistribute_'+id).html(buildDataDistribute(data_distribute_cache[id]));
    });
    
    $('.data-distribute-task-add').live('click', function(e) {
        var dist_id = $(this).attr('iid');
        if($(this).val() == '新增任务') {
            $(this).val('取消新增');
        }
        else {
            $(this).val('新增任务');
            $('#noah_task_line_' + dist_id).hide();
            return;
        }
        var noah_key = $(this).attr('noah_key');
        var noah_node_name = $(this).attr('noah_node_name');
        var str = '';
        str += '<div>从现有任务复制 <select id="use_exist_task_' + dist_id + '" name="use_exist_task">';
        str += '<option value="-1">======请选择======</option>';
        str += '<option value="4873">disp_c命令号_disp配送模板</option>';
        str += '<option value="4883">basa_ac_c命令号_ac配送模板</option>';
        str += '<option value="4889">ui_c命令号_ui配送模板</option>';
        str += '<option value="5402">view-ui_c命令号_view-ui配送模板</option>';
        str += '<option value="5397">us_c命令号_us配送模板</option>';
        str += '<option value="5164">www-da_l命令号_wwwda配送模板</option>';
        str += '<option value="5163">www-qt_l命令号_qt配送模板</option>';
        str += '<option value="5162">da-ec_l命令号_ec配送模板</option>';
        str += '<option value="5403">ers-da_l命令号_ersda配送模板</option>';
        str += '<option value="4980">gss2_data_资源id_gss2资源配送模板</option>';
        str += '<option value="4983">gss3_data_资源id_gss3资源配送模板</option>';
        str += '<option value="5262">gss3_da_l命令号_配送模板</option>';
        str += '</select>非www产品线请直接输入待复制的Task ID<input type="text" id="use_exist_task_id_' + dist_id + '"  name="use_exist_task_id" style="width:50px;" />&nbsp;&nbsp;';
        str += '<input type="button" class="copy_task" name="copy_task" iid="' + dist_id + '" node_path="' + noah_node_name + '" noah_key="' + noah_key + '" value="复制" /></div>';
        str += '<div id="noah_task_table_add_' + dist_id + '"></div>';

        $('#noah_task_line_' + dist_id).html(str);
        $('#noah_task_line_' + dist_id).show();
    });
    
    $('.data-distribute-task-view').live('click', function(e) {
        var noah_key = $(this).attr('noah_key');
        var noah_task_url = "http://noah.baidu.com/datadist/dist/list?";
        $.get('/rest/getnoahtaskurl', function(ret){
            noah_task_url = ret;
            window.open (noah_task_url + 'nodeId=0&keyword=' + noah_key) ;
        });
        
    });
    
    var noah_task_kv = [
        {desc: '配送任务名', key: 'name', required: true},
        {desc: '单机超时', key: 'machine_timeout', required: true},
        {desc: '总体超时', key: 'check_timeout', required: true},
        {desc: '启动方式', key: 'trigger_type', required: true},
        {desc: 'Crontab', key: 'crontab', required: true},
        {desc: '目标目录', key: 'dest_path', required: true},
        {desc: '小流量检验命令', key: 'dist_check', required: true},
        {desc: '后置命令', key: 'dist_hook', required: true},
        {desc: '前置命令', key: 'dist_pre_cmd', required: true},
        {desc: '备注', key: 'notes', required: true},
    ];
    function buildNoahTaskForm(task_data, other_data) {
        var str = '<form action="/stream/data_distribute_task_add" method="post">';
        var prefix = '';
        delete task_data.id;
        str +='<input type="hidden" name="id" value="'+other_data.id+'" />';
        str +='<input type="hidden" name="node_path" value="'+other_data.node_path+'" />';
        str += '<input type="hidden" name="noah_key" value="'+other_data.noah_key+'" />';
        str += '<table class="param-list">';
        str += "<tr><td>配送任务名</td><td><input class='param-value' name='"+htmlEncode(prefix+'name')+"' value='" + task_data.name + "' type='text' /></td></tr>";
        str += "<tr><td>单机超时</td><td><input class='param-value' name='"+htmlEncode(prefix+'machine_timeout')+"' value='" + task_data.machine_timeout + "' type='text' /></td></tr>";
        str += "<tr><td>总体超时</td><td><input class='param-value' name='"+htmlEncode(prefix+'check_timeout')+"' value='" + task_data.check_timeout + "' type='text' /></td></tr>";
        str += "<tr><td>启动方式</td><td><input class='param-value' name='"+htmlEncode(prefix+'trigger_type')+"' value='" + task_data.trigger_type + "' type='text' style='width:100px' /><span class='form-tips'>可选值为data_trig, schedule, 当填写schedule时, 请设置下面的crontab</span></td></tr>";
        str += "<tr><td>Crontab</td><td><input class='param-value' name='"+htmlEncode(prefix+'crontab')+"' value='" + task_data.crontab + "' type='text' style='width:100px'/><span class='form-tips'>格式为* * * * *</span></td></tr>";
        str += "<tr><td>目标目录</td><td><input class='param-value' name='"+htmlEncode(prefix+'dest_path')+"' value='" + task_data.dest_path + "' type='text' /></td></tr>";
        if(typeof(task_data.dist_check) !== 'undefined') {
            str += "<tr><td>小流量检验命令</td><td><input class='param-value' name='"+htmlEncode(prefix+'dist_check')+"' value='" + task_data.dist_check.check_cmd + "' type='text' /></td></tr>";
        }
        if(typeof(task_data.dist_hook) !== 'undefined') {
            str += "<tr><td>后置命令</td><td><input class='param-value' name='"+htmlEncode(prefix+'dist_hook')+"' value='" + task_data.dist_hook.cmd + "' type='text' /></td></tr>";
        }
        if(typeof(task_data.dist_pre_cmd) !== 'undefined') {
            str += "<tr><td>前置命令</td><td><input class='param-value' name='"+htmlEncode(prefix+'dist_pre_cmd')+"' value='" + task_data.dist_pre_cmd.precmd + "' type='text' /></td></tr>";
        }
        str += "<tr><td>备注</td><td><textarea class='param-value' name='"+htmlEncode(prefix+'notes')+"'>" +  htmlEncode(task_data.notes) + "</textarea><input type='hidden' name='" + htmlEncode(prefix+'detail') + "' value='"+JSON.stringify(task_data)+"' /></td></tr>";
        str +='<tr><td><input class="data-distribute-ok" type="submit" value="确认" /></td></tr>';
        str +='</table></form>';
        return str;
    }
    
    $('.copy_task').live('click', function(){
        var dist_id = $(this).attr('iid');
        var node_path = $(this).attr('node_path');
        var noah_key = $(this).attr('noah_key');
        var str = "";
        var base_task_id = $('#use_exist_task_' + dist_id).val();
        
        if (base_task_id < 1) {
            base_task_id = $('#use_exist_task_id_' + dist_id).val();
        }
        if(base_task_id < 1) {
            alert('没有选择或者填写noah任务ID');
            return;
        }
        $.getJSON('/rest/getnoahtaskdetail', {
            nodeId: node_id,
            keyword: base_task_id,
            }, function(ret){
                if (ret.success != true) {
                    alert('未找到对应的配送任务, error is:' + ret.message);
                    return;
                }
                if (ret.data.count != 1) {
                    alert('对应的配送任务不止一个，请确认');
                    return;
                }
                $('#noah_task_table_add_' + dist_id).html(buildNoahTaskForm(ret.data.list[0], {id:dist_id, node_path: node_path, noah_key:noah_key}));
            }
        );
    });

    
    /**
     * 构造mapred list
     */
    function buildMonitorHadoopList(env,select_id, selected_id) {
        var str = "";
        $.each(hadoop_cache, function(i,v){
            if(v.base_id == 0) {
                if(selected_id !== null && selected_id == v.id) {
                    str += '<option value="'+v.id+'" selected="selected">'+ v.name + '</option>';
                }
                else {
                    str += '<option value="'+v.id+'">'+ v.name + '</option>';
                }
            }
            else {
                if(selected_id !== null && selected_id == v.base_id) {
                    str += '<option value="'+v.base_id+'" selected="selected">'+ v.name + '</option>';
                }
                else {
                    str += '<option value="'+v.base_id+'">'+ v.name + '</option>';
                }
            }
        });
        $('#' + select_id).html(str);
    }

    /* 构造监控添加表单HTML */
    function buildMonitorForm(monitor, prefix){
        var str = '<form action="/stream/data_monitor_add" method="post">';
        str +='<input type="hidden" name="stream_id" value="'+stream.id+'" />';
        str +='<input type="hidden" name="monitor_id" value="'+monitor.id+'" />';
        str +='<table class="form-table">';
        str+='<tr><th width="100">监控介绍</th><td>'+htmlEncode(monitor.description)+'</td></tr>';
        str+='<tr><th>监控参数</th><td id="ProcessParam">'+buildParamAddForm(monitor.param_schema, prefix)+'</td></tr>';
        if(stream.type == 'import' && typeof stream.process_param.is_resource != 'undefined' && stream.process_param.is_resource != 0) {
            str+='<tr><th width="100">MapRed计算集群</th><td><select name="monitor_hadoop_id" id="mapred_unit_list"></select></td></tr>';
        }
        else {
            str+='<tr style="display:none;"><th width="100">MapRed计算集群</th><td><input name="monitor_hadoop_id" value="' + stream.data_hadoop_id + '"/></td></tr>';
        }
       
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
        
        var selected_id = null;
        if(typeof stream != 'undefined') {
            selected_id = stream.data_hadoop_id;
        }
        buildMonitorHadoopList(env,'mapred_unit_list', selected_id);
    });

    /* 监控修改表单动作 */
    $('.monitor-edit').live('click', function(){
        var id = $(this).attr('iid');
        $('#Monitor_'+id).html(buildMonitorInstanceForm(monitor_instances_cache[id]));
        buildMonitorHadoopList(env,monitor_instances_cache[id].id + '_update_monitor_hadoop_list', monitor_instances_cache[id].hadoop_id);
    });
    

    $('.monitor-del').live('click', function(){
        var id = $(this).attr('iid');
        if(!confirm('确定要删除这条监控?')){
            return;
        }
        $('<form action="/stream/data_monitor_delete" method="post"><input type="hidden" name="stream_id" value="'+stream.id+'" /><input type="hidden" name="id" value="'+id+'" /></form>').appendTo('body').submit();
    });
    $('.monitor-cancel').live('click', function(){
        var id = $(this).attr('iid');
        $('#Monitor_'+id).html(buildMonitorInstance(monitor_instances_cache[id]));
    });


    /* 构造输入数据HTML */
    function buildInputList(stream){
        var str ='<ul class="stream-list">';
        if(stream.upstreams.length>0){
            $.each(stream.upstreams, function(i,v){
                str += '<li class="stream-item">';
                str += '<div class="stream-head">'+(i+1)+'.<a href="/stream/view?data_name=' + v.data_name + '">'+v.name+'</a> - <a class="input-del" href="#" iid="'+v.id+'">删除</a></div>';
                str += '<div class="stream-desc">负责人: ' + v.owner + '</div>';
                str += '</li>';
            });
        }else{
            str+='<li class="empty">无输入. 可以用上边的搜索框搜索并添加.</li>';
        }
        str += '</ul>';
        return str;
    }

    /* 输入数据动作 */
    $('.input-del').live('click', function(e){
        e.preventDefault();
        var id = $(this).attr('iid');
        if(!confirm('确定要删除这条数据?')){
            return;
        }
        $('<form action="/stream/delete_input" method="post"><input type="hidden" name="input_id" value="'+id+'" /><input type="hidden" name="stream_id" value="'+stream.id+'" /></form>').appendTo('body').submit();
    });

    /* 显示当前处理和输入列表 */
    $('#CurrentProcess').html(buildProcessByStream(stream));
    $('#InputList').html(buildInputList(stream));

    if($('.InputSearcher').length > 0) {
        /* 输入搜索 */
        $('.InputSearcher').autocomplete({
            autoFocus:true,
            source:function(request, response){
                $.getJSON('/rest/suggest_data_stream', {
                    q: request.term
                }, function(ret){
                    response($.map(ret.data, function(item){
                        return {
                            label:item.name,
                            value:item.id,
                            stream:item
                        }
                    }));
                });
            },
            select:function(e,ui){
                $(this).val(ui.item.stream.name);
                $('#InputId').val(ui.item.value);
                return false;
            }
        }).data('autocomplete')._renderItem = function(ul, item){
            return $('<li></li>')
                .data("item.autocomplete", item)
                .append($('<a></a>')
                    .html(
                        '<div>'+item.stream.data_name+'</div>'
                    )
                ).appendTo(ul);
        };
    }
    $('#InputAddForm').submit(function(e){
        if($('#InputId').val()==''){
            alert('请选择输入数据.');
            e.preventDefault();
        }
    });
    
    $('#I18nRelationAddForm').submit(function(e){
        if($('#join_id').val()==''){
            alert('请选择关联数据流.');
            e.preventDefault();
        }
    });

}/* if(typeof stream != 'undefined'){ */
else {
    $('.type-import, .type-process').hide();
}




    // 重名标!志
    // var is_duplicate_data_name = true;
    var is_duplicate_data_name = (typeof stream == 'undefined');
    $('#FDataName').blur(function(){
        var id = $('#ProcessList').val();
        var stream_id = -1;
        if(typeof stream != 'undefined') {
            if(stream.data_name == $(this).val().replace(/(^\s*)|(\s*$)/g, "")) {
                is_duplicate_data_name = false;
                $('#DataNameLoader').hide();
                return;
            }
            stream_id = stream.id;
        }


        $('#DataNameLoader').show();
        $.get('/rest/duplicate_data_name', {name:$(this).val(), 'stream_id':stream_id}, function(ret){
            if(ret.status == 0){
                $('#Duplicate_tip').show();
                $(this).focus();
            }else{
                $('#Duplicate_tip').hide();
                is_duplicate_data_name = false;
            }
            $('#DataNameLoader').hide();
        }, 'json');
    });

    var is_duplicate_name = false;
    $('#FName').blur(function(){
        $('#Duplicate_name_tip').hide();
        $('#NameLoader').show();
        var stream_id = -1;
        if(typeof stream != 'undefined') {
            if(stream.name == $(this).val().replace(/(^\s*)|(\s*$)/g, "")) {
                is_duplicate_name = false;
                $('#NameLoader').hide();
                return;
            }
            stream_id = stream.id;
        }
        $.get('/rest/duplicate_stream_name', {name:$(this).val(), 'stream_id':stream_id}, function(ret){
            if(ret.status == 0){
                is_duplicate_name = true;
                $('#Duplicate_name_tip').show();
                $(this).focus();
            }else{
                $('#Duplicate_name_tip').hide();
                is_duplicate_name = false;
            }
            $('#NameLoader').hide();
        }, 'json');
    });


    var is_stream_control_valid= true;
    var is_owner_valid = true;
   
    var is_alarm_valid = true;
    var is_msg_alarm_valid = true;
    var tag_has_priv = true;
    
    var reg = {
        name:/^[\d\w\.\-\_]+$/i, 
        data_name:/^[\d\w\.\-\_]+$/i,
        data_url:/^((^\s*$)|\s*(hdfs|ftp|http|noahdt):\/\/[^\s]+\s*$)/i,
        data_key:/^\/data\/[\d\w]+$/i,
        expectation:/^\d+$/i,
        data_replica_count:/^\d+$/i,
        instance_keeping_limit:/^\d+$/i,
        instance_keeping_time:/^\d+$/i,
        data_format_desc: /[^\s]/i,
        src_data_gen_strategy: /[^\s]/i,
        budget: /^\d+$/i,
        compute_budget: /^\d+$/i,
        priority:/^[0-8]$/
    };
    var msg = {global:'',field:{}};
    
    function validate_base(form) {
        var valid = true;
        if(!reg.name.test(form.name)){
            msg.field.name = '数据流名称不合法.';
            valid =  false;
        }
        if(!reg.data_name.test(form.data_name)){
            msg.field.data_name = '数据实例名不合法.';
            valid =  false;
        }
        
        if(!reg.expectation.test(form.expectation)){
            msg.field.expectation= '请输入数字.';
            valid =  false;
        }
        if(!reg.data_replica_count.test(form.data_replica_count)){
            msg.field.data_replica_count = '请输入数字.';
            valid =  false;
        }
        if(!reg.instance_keeping_limit.test(form.instance_keeping_limit)){
            msg.field.instance_keeping_limit = '请输入数字.';
            valid =  false;
        }
        if(!reg.instance_keeping_time.test(form.instance_keeping_time)){
            msg.field.instance_keeping_time= '请输入数字.';
            valid =  false;
        }
        if(!reg.data_format_desc.test(form.data_format_desc)){
            msg.field.data_format_desc= '数据格式描述不能为空';
            valid =  false;
        }
        if(!reg.priority.test(form.priority)){
            msg.field.priority= '请输入0~8之间的数字.';
            valid =  false;
        }
        
        if(!reg.budget.test(form.budget)){
            msg.field.budget= '存储预算必须为数字.';
            valid =  false;
        }
        if(!reg.compute_budget.test(form.compute_budget)){
            msg.field.compute_budget= '分布式计算预算必须为整数.';
            valid =  false;
        }
        
        if(form.owner.split(',').length <2) {
            msg.field.owner = '请至少输入两个负责人';
            valid = false;
        }
        
         if(form.selected_tag == 0) {
            msg.field.selected_tag = '必须为数据流归类';
            valid = false;
        }
    
        
        if(form.updated_control == 0) {
             msg.field.updated_control = '要选择数据的更新控制策略';
             valid = false;
        }
        
        return valid && !is_duplicate_data_name&& !is_duplicate_name  && is_stream_control_valid &&
            is_owner_valid  && is_alarm_valid && is_msg_alarm_valid && tag_has_priv;
        
    }
    
    
    
    function validate_import(form){
        var valid = true;
        if(!reg.data_url.test(form.data_url)){
            msg.field.data_url = '数据源不合法.';
            valid =  false;
        }
     
    
        if(form.updated_rule == 0){
            msg.field.updated_rule= '请设置数据更新周期';
            valid =  false;
        }
        if(!reg.src_data_gen_strategy.test(form.src_data_gen_strategy)){
            msg.field.src_data_gen_strategy= '来源数据生成策略不能为空';
            valid =  false;
        }
        return valid && validate_base(form);
    }

    function validate_process(form){
        return validate_base(form);
    }

    
    function validate(){
        var form = {
            name:$('#FName').val(),
            data_name:$('#FDataName').val(),
            data_url:$('#FDataURL').val(),
            data_key:$('#FDataKey').val(),
            updated_control:$('#updated_control_select').val(),
            expectation:$('#FExpectation').val(),
            data_replica_count:$('#FDataReplicaCount').val(),
            instance_keeping_time:$('#FInstanceKeepingTime').val(),
            instance_keeping_limit:$('#FInstanceKeepingLimit').val(),
            owner:$('#FOwner').val(),
            alarm:$('#FAlarm').val(),
            msg_alarm:$('#FMsgAlarm').val(),
            data_format_desc:$('#FData_format_desc').val(),
            budget:$('#FBudget').val(),
            compute_budget:$('#FComputeBudget').val(),
            updated_rule:$('#FUpdated_rule').val(),
            src_data_gen_strategy:$('#FSrc_data_gen_strategy').val(),
            selected_tag: $('#FTagList span').length,
            priority:$('#FPriority').val()
        };
        msg = {global:'',field:{}};

        var process_id = $('#ProcessList').val();
        if(process_id == 'NULL'){
            msg.field.process_id = '请选择处理类型';
            return false;
        }

        if(g_process_type == 'import') {
            return validate_import(form);
        }else if(g_process_type == 'process') {
            return validate_process(form);
        }
        
        return true;

    }

    $('#save').mouseover(function() {
        validateOwner();
        validateAlarm();
        validateMessageAlarm();
        validateTagsPriv();
        validateStreamControl();
    });
    
    $('#BasicForm').submit(function(e){
        if(!validate()){
            e.preventDefault();
            var str = '';
            if(is_duplicate_data_name){
                str += '数据实例名重复了, 换个名字吧.\n';
            }

            if(is_duplicate_name){
                str += '数据流名子重复了, 换个名字吧.\n';
            }

            if(is_stream_control_valid === false){
                str += "数据更新控制配置不正确，请重新配置\n";
            }
            if(is_owner_valid === false) {
                str += "数据负责人不合法\n";
            }
            
            if(is_alarm_valid === false) {
                str += "邮件报警配置不合法\n";
            }
            if(is_msg_alarm_valid === false) {
                str += "短信报警配置不合法\n";
            }
            if(tag_has_priv === false) {
                str += "你没有权限将数据归给某个类别\n";
            }
            
            $.each(msg.field, function(i, v){
                str += v+'\n' ;
            });
            alert(str);
        }
    });
    
    
    
    $('#FOwner').autocomplete({
        source:function(request, response){
            $.getJSON('/rest/getUsersByBlurName', {
                username: $('#FOwner').val().split(",").pop()
            }, function(ret){
                response(ret);
            })
        },
        select: function (event, ui) {
            return false;
        }
    });

    $('#FMsgAlarm').autocomplete({
        source:function(request, response){
            $.getJSON('/rest/getUsersByBlurName', {
                username: $('#FMsgAlarm').val().split(",").pop()
            }, function(ret){
                response(ret);
            })
        },
        select: function (event, ui) {
            return false;
        }
    });
    
    
    

    $('#FAlarm').autocomplete({
        source:function(request, response){
            $.getJSON('/rest/getEmailTip', {
                email: $('#FAlarm').val().split(",").pop()
            }, function(ret){
                response(ret);
            })
        },
        select: function (event, ui) {
            return false;
        }
    });
    
    $('#stream_class').autocomplete({
        source:function(request, response){
            $.getJSON('/rest/getTreeNodeTip', {
                keyword: $('#stream_class').val()
            }, function(ret){
                response(ret);
            })
        },
        close: function(event, ui) {
            var node = tags_cache_2[$('#stream_class').val()];
            var id = node.id;
            if($(".stream-tag[iid=" + id + "]").length > 0) {
                alert('节点已经选择过了');
                $('#stream_class').val('');
                return;
            }
            
            $('#FTagList').append('<span iid="'+id+'" class="stream-tag">'+htmlEncode($('#stream_class').val())+'</span>');
            selected_tags[id] = node;
            
            $('#stream_class').val('');
            if(typeof stream == 'undefined') {
                $.get('/rest/createHasTagsPriv', {tags: id}, function(ret){
                    if(ret.status == 0){
                        $('#Tag_priv_tip').hide();
                        tag_has_priv = true;
                    }else{
                        $('#Tag_priv_tip').show();
                        $('#Tag_priv_tip').text(ret.msg);
                        tag_has_priv = false;
                    }
                }, 'json');
            }
        
        }
    });

    function validateMessageAlarm() {
        if($('#FMsgAlarm').val().search(/^\s*$/) !== -1) {
            is_msg_alarm_valid = true;
            $('#MsgAlarmValid_tip').hide();
            return;
        }
        $.get('/rest/validateMsgAlarms', {msg_alarms:$('#FMsgAlarm').val()}, function(ret){
            if(ret.status == 0){
                is_msg_alarm_valid = true;
                $('#MsgAlarmValid_tip').hide();
            }else{
                $('#MsgAlarmValid_tip').text(ret.msg);
                $('#MsgAlarmValid_tip').show();
                is_msg_alarm_valid = false;
            }
        }, 'json');
    }
    
    function validateTagsPriv() {
        var val = '';
        $.each(selected_tags, function(i, v){
            val += v.id+',';
        })
        
        if(typeof stream == 'undefined') {
            $.get('/rest/createHasTagsPriv', {tags: val}, function(ret){
                if(ret.status == 0){
                    $('#Tag_priv_tip').hide();
                    tag_has_priv = true;
                }else{
                    $('#Tag_priv_tip').show();
                    $('#Tag_priv_tip').text(ret.msg);
                    tag_has_priv = false;
                }
            }, 'json');
        }
        else {
            $.get('/rest/editHasTagsPriv', {tags: val}, function(ret){
                if(ret.status == 0){
                    $('#Tag_priv_tip').hide();
                    tag_has_priv = true;
                }else{
                    $('#Tag_priv_tip').show();
                    $('#Tag_priv_tip').text(ret.msg);
                    tag_has_priv = false;
                }
            }, 'json');
        }
    }
    
    function validateAlarm() {
        $.get('/rest/validateEmails', {emal_list:$('#FAlarm').val()}, function(ret){
            if(ret.status == 0){
                $('#AlarmValid_tip').hide();
                is_alarm_valid = true;
            }else{
                $('#AlarmValid_tip').show();
                $('#AlarmValid_tip').text(ret.msg);
                is_alarm_valid = false;
            }
        }, 'json');
    }
    
    //更新频率
    $('#check_frequency').live('blur',function(e){
        checkFrequency();
    });
    
    //有效时间段
    $('#effective_period').live('blur',function(e){
        checkEffectivePeriod();
    });
    
    //crontab
    $('#crontab').live('blur',function(e){
        checkCrontab();
    });
    
    /**
     * 检测更新频率
     */
    function checkFrequency() {
        var frequency = $('#check_frequency').val();
        var int_reg = /^\d+$/i;
        if(!int_reg.test(frequency)) {
            $('#frequency_valid').show();
            is_stream_control_valid = false;
        }
        else {
            is_stream_control_valid = true;
            $('#frequency_valid').hide();
        }
        
        return is_stream_control_valid;
    }
    
    /**
     * 检测有效时间段
     */
    function checkEffectivePeriod() {
        var effective_period = $('#effective_period').val();
        if(effective_period != "" && effective_period.search(/^\s*\d{2}:\d{2}-\d{2}:\d{2}\s*$/) == -1) {
            $('#effective_period_valid').show();
            is_stream_control_valid = false;
        }
        else {
            is_stream_control_valid = true;
            $('#effective_period_valid').hide();
        }
        
        return is_stream_control_valid;
    }
    
    /**
     * 检测crontab
     */
    function checkCrontab() {
        var crontab = $('#crontab').val();
        
        $.get('/rest/Crontab_valid', {crontab:crontab}, function(ret){
            if(ret.status != 0){
                is_stream_control_valid = false;
                $('#crontab_valid').show();
            }else{
                $('#crontab_valid').hide();
                is_stream_control_valid= true;
            }
        }, 'json');
        return is_stream_control_valid;
    }
    
    function validateStreamControl() {
        var update_control = $('#updated_control_select').val();
        //需要验证频率和有效时间段
        if(update_control == 1) {
            if(!checkFrequency()) {
                return;
            }
            if(!checkEffectivePeriod()) {
                return;
            }
    
        }
        //crontab
        else if(update_control == 2) {
            if(!checkCrontab()) {
                return;
            }
        }
    }
    
    function validateOwner() {
        $.get('/rest/validateUsers', {name_list:$('#FOwner').val()}, function(ret){
            if(ret.status == 0){
                is_owner_valid = true;
                $('#OwnerValid_tip').hide();
            }else{
                $('#OwnerValid_tip').show();
                $('#OwnerValid_tip').text(ret.msg);
                is_owner_valid = false;
            }
        }, 'json');
    }
    
    
    
    function initElemEvents(type) {
        $('#FOwner').blur(validateOwner);
        $('#FAlarm').blur(validateAlarm);
        $('#FMsgAlarm').blur(validateMessageAlarm);
        initUpdateControl(type);
        initDataDeploy();
        initDataProvideType();
    }
    
    $('#input_next').click(function(e){
         $('#DataProcessForm').tabs('select', '#MonitorInfo');
    });
    
    $('#monitor_next').click(function(e){
         $('#DataProcessForm').tabs('select', '#PostBehavior');
    });

    
    $('#use_exist_key').live($.browser.msie ? 'click' : 'change', function(){
        var str = "";
        
        if($(this).val() == 0) {
            str += '<tr><td width="110px">区域</td><td width="550px"><select name="region">';
            str += '<option value="beijing">beijing</option>';
            str += '</select></td></tr>';
            
            str += '<tr><td>noah数据名</td><td><input type="text" value="' + stream.data_name + '" id ="noah_data_name" name="noah_data_name" style="width:300px;" /><span class="form-tips">建议和mis数据名一致，如果被占用，请换名字</span></td></tr>';
            
            str += '<tr><td>产品线</td><td><input type="text" id ="noah_product_line" name="productLine" style="width:300px;" /><span class="form-tips">noah产品线</span></td></tr>';
            str += '<tr><td>注册noah节点</td><td><input type="text" id ="noah_node_name" name="noah_node_name" style="width:300px;" /><span class="form-tips">noah数据注册key挂载的节点</span></td></tr>';
        }
        else {
            str += '<tr><td width="110px">noah key</td><td><input type="text" name="noah_key" style="width:300px;" /></td></tr>';
        }
        
        str += '<tr><td>chosen_folder</td><td><input type="text" name="selected_folder" style="width:300px;" /><span class="form-tips">一般无需填写，少量分环词典配送需要配置,直接配置目录名</span></td></tr>';
        str += '<tr><td>描述</td><td><textarea name="description" style="width:300px;height:50px;"></textarea><span class="form-tips">数据生效策略说明</span></td></tr>';
        
        $('#distribute_table').html(str);
        
        if($(this).val() == 0) {
            $('#noah_product_line').autocomplete({
                source:function(request, response){
                    $.get('/rest/getNoahProductLine', {
                            keyword: $('#noah_product_line').val()
                        }, function(ret){
                            response($.parseJSON(ret));
                            
                        }
                    )
            
                },
                select: function (event, ui) {
                    return true;
                }
            });
            
            $('#noah_node_name').autocomplete({
                source:function(request, response){
                    $.getJSON('/rest/getNoahNodeName', {
                            keyword: $('#noah_node_name').val()
                        }, function(ret){
                            response(ret);
                            
                        }
                    )
            
                },
                select: function (event, ui) {
                    return true;
                }
            });
        }
    });
    
    
    /* 定义监控列表选项动作 */
    $('#distribute_type').live($.browser.msie ? 'click' : 'change', function(){
        var distribute_type = $(this).val();
        
        var str = '<form action="/stream/data_distribute_add" method="post">';
        str += '<input type="hidden" name="distribute_type" value="' + distribute_type + '" />';
        str += '<input type="hidden" name="stream_id" value="' + stream.id + '" />';
        str += '<input type="hidden" name="data_name" value="' + stream.data_name + '" />';
        str += buildDistributeDesc(distribute_type);
        
        str += '<table class="param-list">';
        
        
        //noah 配送
        if(distribute_type == 1) {
            str += '<tr><td width="110px">类型</td><td width="550px"><select name="type">';
            str += '<option value="online">线上配送</option>';
            str += '<option value="offline">线下PS配送</option>';
            str += '</select></td></tr>';
            
            str += '<tr><td width="110px">是否使用已有的noah key</td><td width="550px"><select id="use_exist_key" name="use_exist_key">';
            str += '<option value="-1">=请选择=</option>';
            str += '<option value="0">否</option>';
            str += '<option value="1">是</option>';
            str += '</select></td></tr>';
            
            str += '<table id="distribute_table" class="param-list"></table>';
            
            
            str += '<tr><td colspan="2"><input type="submit" value="添加" /></td></tr>';
            str += '</table>';
            str += '</form>';
            
            $('#Distribute').html(str);
            
            
    
        }
        else if(distribute_type == 3) {
            str += '<tr><td width="100px">类型</td><td width="550px"><select name="type">';
            str += '<option value="online">线上配送</option>';
            str += '<option value="offline">线下PS配送</option>';
            str += '</select></td></tr>';
            str += '<tr><td width="100px">描述</td><td width="500px"><textarea name="description" style="width:400px;height:200px;"></textarea></td></tr>';
            str += '<tr><td colspan="2"><input type="submit" value="添加" /></td></tr>';
            str += '</table>';
            str += '</form>';
            $('#Distribute').html(str);
        }
        else if(distribute_type == 4) {
            str += '<tr><td width="100px">type</td><td width="550px"><select name="method">';
            str += '<option value="get">get</option>';
            str += '<option value="post">post</option>';
            str += '</select></td></tr>';
            str += '<tr><td width="100px">url</td><td><input style="width:400px;" type="text" name="url" /></td></tr>';
            str += '<tr><td width="100px">options</td><td><input style="width:400px;" type="text" name="options" /></td></tr>';
            str += '<tr><td width="100px">描述</td><td width="500px"><textarea name="description" style="width:400px;height:200px;"></textarea></td></tr>';
            str += '<tr><td colspan="2"><input type="submit" value="添加" /></td></tr>';
            str += '</table>';
            str += '</form>';
            $('#Distribute').html(str);
        }
        else if(distribute_type == 5) {
            str += '<tr><td width="100px">soap</td><td><input style="width:400px;" type="text" name="soap" /></td></tr>';
            str += '<tr><td width="100px">method</td><td><input style="width:400px;" type="text" name="method" /></td></tr>';
            str += '<tr><td width="100px">options</td><td><input style="width:400px;" type="text" name="options" /></td></tr>';
            str += '<tr><td width="100px">描述</td><td width="500px"><textarea name="description" style="width:400px;height:200px;"></textarea></td></tr>';
            str += '<tr><td colspan="2"><input type="submit" value="添加" /></td></tr>';
            str += '</table>';
            str += '</form>';
            $('#Distribute').html(str);
        }
        else if(distribute_type == 6) {
            str += '<tr><td width="100px">type</td><td><input style="width:400px;" type="text" name="type" /></td></tr>';
            str += '<tr><td width="100px">shiftmain</td><td><input style="width:400px;" type="text" name="shiftmain" /></td></tr>';
            str += '<tr><td width="100px">-n</td><td><input style="width:400px;" type="text" name="-n" /></td></tr>';
            str += '<tr><td width="100px">-u</td><td><input style="width:400px;" type="text" name="-u" /></td></tr>';
            str += '<tr><td width="100px">-p</td><td><input style="width:400px;" type="text" name="-p" /></td></tr>';
            str += '<tr><td width="100px">-a</td><td><input style="width:400px;" type="text" name="-a" /></td></tr>';
            str += '<tr><td width="100px">-s</td><td><input style="width:400px;" type="text" name="-s" /></td></tr>';
            str += '<tr><td width="100px">-c</td><td><input style="width:400px;" type="text" name="-c" /></td></tr>';
            str += '<tr><td width="100px">-m</td><td><input style="width:400px;" type="text" name="-m" /></td></tr>';
            str += '<tr><td width="100px">-o</td><td><input style="width:400px;" type="text" name="-o" /></td></tr>';
            str += '<tr><td width="100px">-i</td><td><input style="width:400px;" type="text" name="-i" /></td></tr>';
            str += '<tr><td width="100px">-d</td><td><input style="width:400px;" type="text" name="-d" /></td></tr>';
            str += '<tr><td width="100px">--parrule</td><td><input style="width:400px;" type="text" name="--parrule" /></td></tr>';
            str += '<tr><td width="100px">--dicttype</td><td><input style="width:400px;" type="text" name="--dicttype" /></td></tr>';
            str += '<tr><td width="100px">--confpath</td><td><input style="width:400px;" type="text" name="--confpath" /></td></tr>';
            str += '<tr><td width="100px">--confname</td><td><input style="width:400px;" type="text" name="--confname" /></td></tr>';
            str += '<tr><td width="100px">--ruleparam</td><td><input style="width:400px;" type="text" name="--ruleparam" /></td></tr>';
            str += '<tr><td width="100px">--prefer</td><td><input style="width:400px;" type="text" name="--prefer" /></td></tr>';
            str += '<tr><td width="100px">--queue</td><td><input style="width:400px;" type="text" name="--queue" /></td></tr>';
            str += '<tr><td width="100px">--extra</td><td><input style="width:400px;" type="text" name="--extra" /></td></tr>';
            
            
            str += '<tr><td width="100px">描述</td><td width="500px"><textarea name="description" style="width:400px;height:200px;"></textarea></td></tr>';
            str += '<tr><td colspan="2"><input type="submit" value="添加" /></td></tr>';
            str += '</table>';
            str += '</form>';
            $('#Distribute').html(str);
        }
        else if(distribute_type == 7) {
            str += '<tr><td width="100px">type</td><td><select name="type"><option value="online">online</option><option value="offline">offline</option></select></td></tr>';
            str += '<tr><td width="100px">mode</td><td><select name="mode"><option value="normal">normal</option><option value="distributed_dict">distributed_dict</option></select></td></tr>';
            str += '<tr><td width="100px">priority</td><td><select name="priority"><option value="60">normal</option><option value="65">high</option></select></td></tr>';

            str += '<tr><td width="100px">描述</td><td width="500px"><textarea name="description" style="width:400px;height:200px;"></textarea></td></tr>';
            str += '<tr><td colspan="2"><input type="submit" value="添加" /></td></tr>';
            str += '</table>';
            str += '</form>';
            $('#Distribute').html(str);
        }
        else if(distribute_type == 8) {
            str += '<tr><td width="100px">pool</td><td width="550px"><select name="pool">';
            if(typeof dist_pool!= 'undefined'){
                $.each(dist_pool, function(i,v){
                    str += '<option value="'+ v.pool+'">'+v.pool+'</option>';
                });
            }
            str += '</select></td></tr>';
            str += '<tr><td width="100px">描述</td><td width="500px"><textarea name="description" style="width:400px;height:200px;"></textarea></td></tr>';
            str += '<tr><td colspan="2"><input type="submit" value="添加" /></td></tr>';
            str += '</table>';
            str += '</form>';
            $('#Distribute').html(str);
        }
        //其他
        else {
            str += '<tr><td width="100px">描述</td><td width="500px"><textarea name="description" style="width:400px;height:200px;"></textarea></td></tr>';
            str += '<tr><td colspan="2"><input type="submit" value="添加" /></td></tr>';
            str += '</table>';
            str += '</form>';
            $('#Distribute').html(str);
        }
        
    });
    
    $('.stream-tag').live('click', function(){
        var id=$(this).attr('iid');
        $(this).remove();
        delete selected_tags[id];
    });
    
});

