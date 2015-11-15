
//for debug
//usage:
//   console.log();
//   for chrome/firefox with firebug/IE 8+ 
console = window.console || {log:function(){}};

function htmlDecode(str) {
    str = str || '';
    return $('<div />').html(str).text();
}

function htmlEncode(str) {
    str = str || '';
    var str = $('<div />').text(str).html();
    str = str.replace(/'/g,'&#39;').replace(/"/g, '&#34;');
    return str;
}

function trim(str) 
{ 
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
} 

function newGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid;    
}

function getFileName(filePath){
    var pos = filePath.lastIndexOf("\\")+ 1;
    if(pos == 0){
       pos = filePath.lastIndexOf("/")+ 1;
    }
    var name= filePath.substr(pos);
    return name;
}


function getParameter(search, name){
    var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");
    var matcher = pattern.exec(search);
    var items = '';
    if(null != matcher){
        items = decodeURIComponent(matcher[1]);
    }
    return items;
}
// jquery 
$.extend({

    // 构造一个表单
    createActionForm: function(action, param, method){
        action = action || '';
        param = param || {};
        method = method || 'post';
        var str = '<form action="'+action+'" method="'+method+'">';
        $.each(param, function(i, v){
            str += '<input type="hidden" name="'+i+'" value="'+htmlEncode(v)+'" />';
        });
        str += '</form>';
        return $(str).appendTo('body');
    }
});


//用来显示参数
function buildParamShow(values){
    if(values==null)return '';
    var str = "<table class='param-list'>";
    str += "<tr><th width='100'>名字</th><th width='500'>值</th></tr>";
    $.each(values, function(key, val){
        if(key == 'data_attr')return;
        str += "<tr><td>"+htmlEncode(key)+"</td><td>"+htmlEncode(val)+"</td></tr>";
    });
    str += "</table>";
    return str;
}

//用来输入参数
function buildParamAddForm(schema, prefix){
    if(schema==null)return '';
    if(prefix!=null){
        prefix=prefix+'_';
    }else{
        prefix='';
    }
    schema = schema||[];
    var str = "<table class='param-list'>";
    str += "<tr><th width='100'>名字</th><th width='100'>类型</th><th width='100'>值</th></tr>";
    $.each(schema, function(key, val){
        str += "<tr><td>"+htmlEncode(key)+"</td><td>"+htmlEncode(val)+"</td><td><input class='param-value' name='"+htmlEncode(prefix+key)+"' type='text' /></td></tr>";
    });
    str += "</table>";
    return str;
}


//用来编辑参数
function buildParamEditForm(values, schema, prefix){
    if(values==null)return '';
    if(prefix!=null){
        prefix=prefix+'_';
    }else{
        prefix='';
    }
    schema = schema||[];
    var str = "<table class='param-list'>";
    str += "<tr><th width='100'>名字</th><th width='400'>值</th></tr>";
    $.each(schema, function(key, val){
        if(key == 'data_attr')return;
        str += "<tr><td>"+htmlEncode(key)+"</td><td><input class='param-value' name='"+htmlEncode(prefix+key)+"' type='text' value='"+htmlEncode(values[key])+"' /></td></tr>";
    });
    str += "</table>";
    return str;
}

//用来显示参数格式
function buildParamSchema(schema){
    if(schema==null)return '';
    var str = "<table class='param-list'>";
    str += "<tr><th width='100'>名字</th><th width='100'>类型</th></tr>";
    $.each(schema, function(key,val){
        str += "<tr><td>"+htmlEncode(key)+"</td><td>"+htmlEncode(val)+"</td></tr>";
    });
    str += "</table>";
    return str;
}

//用来编辑参数格式
function buildParamSchemaEditForm(schema, prefix){
    if(schema == null)return '';
    if(prefix!=null){
        prefix=prefix+'_';
    }else{
        prefix='';
    }
    var str = "<table class='param-list'>";
    str += "<tr><th width='100'>名字</th><th width='100'>类型</th><th></th></tr>";
    $.each(schema, function(key, val){
        str += "<tr class='schema-item'><td><input name='name' value='"+htmlEncode(key)+"' /></td><td><input name='type' value='"+htmlEncode(val)+"' /></td><td><a href='#' class='schema-del'>删除</a></td></tr>";
    });
    str += "<tr><td colspan='3'><a href='#' class='schema-add'>添加参数</a></td></tr>";
    str += "</table>";
    return str;
}

//数据属性表单
function buildDataAttributeForm(attrs, prefix){
    attrs = attrs || {};
    if(prefix!=null){
        var _prefix=prefix+'_';
    }else{
        _prefix='';
    }
    var suffix='',i=0,id;
    var str = "<table class='param-list'>";
    str += "<tr><th width='100'>属性名</th><th>属性值</th><th></th></tr>";
    $.each(attrs, function(key, val){
        if(prefix!=null) {
            id='key_'+Number(new Date())+'_'+(i++);
            suffix = '['+id+']';
        }
        str += "<tr class='attr-item'><td><input name='"+htmlEncode(_prefix+"name"+suffix)+"' value='"+htmlEncode(key)+"' /></td><td><input name='"+htmlEncode(_prefix+"value"+suffix)+"' value='"+htmlEncode(val)+"' /></td><td><a href='#' class='attr-del'>删除</a></td></tr>";
    });
    str += "<tr><td colspan='3'><a href='#' _x_prefix='"+htmlEncode(prefix)+"' class='attr-add'>添加属性</a></td></tr>";
    str += "</table>";
    return str;
}

//显示数据属性表单
function buildDataAttributeShow(attrs){
    attrs = attrs || {};
    var str = "<table class='param-list'>";
    str += "<tr><th width='100'>属性名</th><th width='100'>属性值</th></tr>";
    $.each(attrs, function(key, val){
        str += "<tr class='attr-item'><td>"+htmlEncode(key)+"</td><td>"+htmlEncode(val)+"</td></tr>";
    });
    str += "</table>";
    return str;
}


// 扩展js RegExp, 让它可以转义正则元字符.
RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function buildTrackInfo(lines, name_node, high_light){

    // m[1]类型, m[3]大小, m[5]路径
    var lspattern=/([d\-])([\-rxw]{9}\s+\d+\s\w+\s\w+\s+)(\d+)(\s\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}\s+)(.+)/;

    // 用于生成唯一标识
    var time=Number(new Date());

    var m = null;
    var str='<div class="tracker-info">';

    name_node = name_node || '';

    //为兼容 bug, 无奈.
    name_node = name_node.replace(/(\w+:\/\/[^\/]+).*/,'$1');

    $.each(lines, function(i, v){
        v=v+'';
        if((m=lspattern.exec(v))!=null){
            str+='<div class="tracker-info-line">'
            +(m[1]+m[2]+m[3]+m[4]).replace(/ /g, '&nbsp;').replace(/\t/g, '&#09;');

            // 目录类型的执行 ls
            if(m[1]=='d'){
                str+='<a class="track-hadoop-fs-ls" iid="in_'+time+'_'+i+'" name_node="'+name_node+'" href="'+name_node+m[5]+'">'+m[5]+'</a>';
				str+='<a class="get-hadoop-data console-get-data" path="'+name_node+m[5]+'" href="">下载</a>';

            // 普通文件执行 tail
            }else if(m[1]=='-'){
                str+='<a class="track-hadoop-fs-tail" iid="in_'+time+'_'+i+'" name_node="'+name_node+'" href="'+name_node+m[5]+'">'+m[5]+'</a>';
                str+='<a class="track-hadoop-cat-grep" iid="in_'+time+'_'+i+'" name_node="'+name_node+'" href="'+name_node+m[5]+'">grep</a>';
				 str+='<a class="get-hadoop-data console-get-data" path="'+name_node+m[5]+'" href="">下载</a>';
            
            // 其他类型, 暂不支持
            }else{
                str+=m[5];
				str+='<a class="get-hadoop-data console-get-data" path="'+name_node+m[5]+'" href="">下载</a>';
            }
            str+='</div>';
            str+='<div class="TrackResultHere" id="TrackResult_in_'+time+'_'+i+'" path="' + name_node+m[5] + '"></div>';

        // 一般内容
        }else{
            if(high_light==null){
                str+='<div class="tracker-info-line">'+v.replace(/ /g, '&nbsp;').replace(/\t/g, '&#09;')+'</div>';
            }else{
                // 高亮显示关键字
                var hlr = new RegExp(RegExp.escape(high_light), 'g');
                var spl = v.split(hlr);
                var mch = v.match(hlr);
                str+='<div class="tracker-info-line">';
                if(mch==null){
                    str+=v.replace(/ /g, '&nbsp;').replace(/\t/g, '&#09;');
                }else{
                    for(var i=0;i<mch.length;i++){
                        spl[i] = spl[i] || ''; // Prevent errors on IE.
                        mch[i] = mch[i] || ''; 
                        str+=spl[i].replace(/ /g, '&nbsp;').replace(/\t/g, '&#09;');
                        str+='<span class="tracker-high-light">';
                        str+=mch[i].replace(/ /g, '&nbsp;').replace(/\t/g, '&#09;');
                        str+='</span>';
                    }
                    spl[i] = spl[i] || ''; 
                    str+=spl[i].replace(/ /g, '&nbsp;').replace(/\t/g, '&#09;');
                }
                str+='</div>';
            }
        }
    });
    str+='</div>';
    return str;
}

function buildTrackError(lines){
    var str='<div class="tracker-error">';
    $.each(lines, function(i, v){
        str+='<div class="tracker-error-line">'+v.replace(/ /g, '&nbsp;')+'</div>';
    });
    str+='</div>';
    return str;
}

$(function(){
    $.ajaxSetup({cache:false});

    $("#query").val("请输入名字,数据地址,所有者");
    $("#query").focus(function(){
        var email = $(this).val();
        if(email=="请输入名字,数据地址,所有者"){
            $(this).val(""); 
        }
    });
    $("#query").blur(function(){
        var password = $(this).val();
        if(password==""){
            $(this).val("请输入名字,数据地址,所有者"); 
        }else{
            var $sum = $("#submit");
            $sum.disabled = true;
        }
    });


    //查询问题接口
    $(".track-source").click(function(e){
        e.preventDefault();
        var url = $(this).attr('href');
        var id = $(this).attr('iid');
        $('#TrackResult_'+id).html('<img src="/image/ajax-loader.gif" />');
        $.get('/rest/check_source', {'url':url},function(ret){
            if(ret.status==0){
                $('#TrackResult_'+id).html(buildTrackInfo(ret.data));
            }else{
                $('#TrackResult_'+id).html(buildTrackError(ret.data));
            }
        },'json');
    });

    //列出文件
    $(".track-hadoop-fs-ls").live('click', function(e){
        e.preventDefault();
		var state =  $(this).attr('state');
		var id = $(this).attr('iid');
		if(state === 'opened') {
			$('#TrackResult_'+id).html("");
			$(this).attr('state', 'wrapped');
		}
		else {
	
			var url = $(this).attr('href');
			var name_node = $(this).attr('name_node');
			$('#TrackResult_'+id).html('<img src="/image/ajax-loader.gif" />');
			$.get('/rest/hadoop_fs_ls', {'url':url},function(ret){
				if(ret.status==0){
					$('#TrackResult_'+id).html(buildTrackInfo(ret.data, name_node));
				}else{
					$('#TrackResult_'+id).html(buildTrackError(ret.data));
				}
			},'json');

			$(this).attr('state', 'opened');
		}
    });

    //查看文件内容
    $(".track-hadoop-fs-tail").live('click', function(e){
        e.preventDefault();
        var url = $(this).attr('href');
        var id = $(this).attr('iid');
        var name_node = $(this).attr('name_node');
        $('#TrackResult_'+id).html('<img src="/image/ajax-loader.gif" />');
        $.get('/rest/hadoop_fs_tail', {'url':url},function(ret){
            if(ret.status==0){
                $('#TrackResult_'+id).html(buildTrackInfo(ret.data, name_node));
            }else{
                $('#TrackResult_'+id).html(buildTrackError(ret.data));
            }
        },'json');
    });

    //从文件中查找
    $(".track-hadoop-cat-grep").live('click', function(e){
        e.preventDefault();
        $('#Grep_url').val($(this).attr('href'));
        $('#Grep_id').val($(this).attr('iid'));
        $('#Grep_name_node').val($(this).attr('name_node'));
        $('#ProblemTracker_grep_dialog').dialog('open');
        $('#Grep_query').focus();
    });
    

    function perform_grep(){
        var url = $('#Grep_url').val();
        var id = $('#Grep_id').val();
        var name_node = $('#Grep_name_node').val();
        var query = $('#Grep_query').val();
        var encoding = $('#Grep_encoding').val();
        if(query==null)return;
        $('#TrackResult_'+id).html('<img src="/image/ajax-loader.gif" />');
        $.get('/rest/hadoop_fs_cat_grep', {'url':url, 'query':query, 'encoding':encoding}, function(ret){
            if(ret.status==0){
                $('#TrackResult_'+id).html(buildTrackInfo(ret.data, name_node, query));
            }else{
                $('#TrackResult_'+id).html(buildTrackError(ret.data));
            }
        },'json');
    }

    $('#Grep_query').keypress(function(e){
        if(e.keyCode == 13){
            perform_grep();
            $('#ProblemTracker_grep_dialog').dialog('close');
        }
    });
    $('#ProblemTracker_grep_dialog').dialog({
        title:'输入要查找的内容:',
        autoOpen:false,
        width:590,
        height:150,
        buttons: {
            '查找':function(){
                perform_grep();
                $(this).dialog('close');
            },
            '取消':function(){$(this).dialog('close');}
        }
    });
	
	//获取下载数据的信息
    $(".get-hadoop-data").live('click', function(e){
        e.preventDefault();
        var path = $(this).attr('path');
		var seperate_pos =  path.indexOf('/', "hdfs://".length);
		var node = path.substr(0, seperate_pos);
		var short_path = path.substr(seperate_pos);
		var cmd = '<font color="red">%HADOOP_HOME%</font>hadoop/bin/hadoop fs -D hadoop.job.ugi="' + hadoop_ugi + '" -D fs.default.name=' + node + ' -copyToLocal ' + short_path + '   <font color="red">local_dir</font>';
		$('#hadoop_get_data_cmd').html(cmd);
        $('#Get_data_dialog').dialog('open');
    });
	
	$('#Get_data_dialog').dialog({
        autoOpen:false,
        width:800,
        height:160
    });


    // 通用追查工具
    function fire_common_tool(){
        var url = $.trim($('#CommonURL').val());
        var id = 'CommonTracker';
        var m = null, name_node = null, request=null, param=null;
        if(url.match(/^(http|ftp)s?:\/\//i)!=null){
            request = '/rest/check_source';
            param = {'url':url};
        }else if((m=url.match(/^(hdfs:\/\/[^\/]+)/i))!=null){
            name_node = m[1];
            request = '/rest/hadoop_fs_ls';
            param = {'url':url};
        }else if(url.match(/^\/data\//i)!=null){
            alert('暂不支持分发查询.');
            return;
        }else{
            alert('输入格式错误.');
            return;
        }
        $('#TrackResult_'+id).html('<img src="/image/ajax-loader.gif" />');
        $.get(request, param, function(ret){
            if(ret.status==0){
                $('#TrackResult_'+id).html(buildTrackInfo(ret.data, name_node));
            }else{
                $('#TrackResult_'+id).html(buildTrackError(ret.data));
            }
        },'json');
    }

    $('#CommonURL').keypress(function(e){
        if(e.keyCode == 13){
            fire_common_tool();
        }
    }).focus(function(){
        $(this).val('');
    });

    $("#CommonTrackerButton").click(function(e){
        e.preventDefault();
        fire_common_tool();
    });


    //表格美化
    $('table tr').live('mouseover',function(){
        $(this).addClass('over');
    }).live('mouseout',function(){
        $(this).removeClass('over');
    });

    //参数格式表格动作
    $('.schema-del').live('click', function(e){
        $(this).closest('tr').remove();
        e.preventDefault();
    });
    $('.schema-add').live('click', function(e){
        var html = "<tr class='schema-item'><td><input name='param_schema_key[]' /></td><td><input name='param_schema_value[]' /></td><td><a href='#' class='schema-del'>删除</a></td></tr>";
        $(html).insertBefore($(this).closest('tr'));
        e.preventDefault();
    });

    //数据属性表格动作
    $('.attr-del').live('click', function(e){
        $(this).closest('tr').remove();
        e.preventDefault();
    });
    $('.attr-add').live('click', function(e){
        var prefix = $(this).attr('_x_prefix'),suffix='';
        if(prefix != ''){
            prefix = prefix+'_';
            suffix = '[key_'+Number(new Date())+']';
        }
        var html = "<tr class='attr-item'><td><input name='"+prefix+"name"+suffix+"' /></td><td><input name='"+prefix+"value"+suffix+"' /></td><td><a href='#' class='attr-del'>删除</a></td></tr>";
        $(html).insertBefore($(this).closest('tr'));
        e.preventDefault();
    });

    // 提示信息自动消失
    setTimeout(function(){
        $('.message').fadeOut();
    },6000);

});
