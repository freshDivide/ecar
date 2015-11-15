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
                "url" : "/misweb_stat/get_uacs_tree",
                // the `data` function is executed in the instance's scope
                // the parameter is the node being loaded 
                // (may be -1, 0, or undefined when loading the root nodes)
                "data" : function (n) { 
                    // the result is fed to the AJAX request `data` option
                                        if(n.data) {
                                            var id = n.data('id');
                                        }
                    return { 
                        // "id" 是默认打开的节点
                        "id" : id ? id : -1
                    }; 
                }
            }
        },
        // UI & core - the nodes to initially select and open will be overwritten by the cookie plugin

        // the UI plugin - it handles selecting/deselecting/hovering nodes
        "ui" : {
            // this makes the node with ID node_4 selected onload
            "initially_select" : [ "misweb_tree_node_0" ],
             "select_limit" : 1
        },
        // the core plugin - not many options here
        "core" : { 
            // just open those two nodes up
            // as this is an AJAX enabled tree, both will be downloaded from the server
            "initially_open" : [ "misweb_tree_node_0" ] 
        },
        "cookies" : {
            save_selected : "misweb_jstree_select",
            save_loaded   : "misweb_jstree_load",
            save_opened   : "misweb_jstree_open"
        }
    })

    // ========================================
    .bind('select_node.jstree', function(e, data){
        node_id = data.rslt.obj.data('id');

        if(stat_type == 'misweb_stream_stat')
        {
                if( tree_node_loaded == true )
                {
                        window.location.href='/stat/misweb_stat';
                }
                else
                {
                        tree_node_loaded = true;
                }
        return;
        }
        if($('#stream_list').length > 0) {
            var search = document.location.search;
            var page = getParameter(search,'page');
            var query_param = { 'node_id':node_id, 'page':page };

            //加载数据流列表界面
            $('#stream_list').html('<li class="empty"><img src="/image/ajax-bar.gif" /></li>');
            $.get('/misweb_stat/get_by_node', query_param, function(ret){
                if(ret.status == 0) {
                    $('#stream_list').html(ret.data.streams);
                    $('.page').html(ret.data.page);
                }
            }, 'json');
        }
        else {
            if(first_select === false) {
                window.location.href = '/stat/misweb_stat';
            }
        }
        first_select = false;
    }).bind("loaded.jstree", function (event, data) {
        first_select = true;
    });

    // ========================================

});


$(document).ready(function(){
    $("#new_root").hide();
                });

function trim(str)
{
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
// 搜索misweb uacs节点
function misweb_node_search()
{
    var word = $("#search").val();
    var search_by = $("#search_by").val();
    word = trim(word);
    if( word == '' )
    {
        alert("请输入节点名");
        return;
    }
    if( search_by != "node" && word.length< 5)  
    {
        alert("数据流名称至少需要5个字符");
        return;
    }
    var query_param = { 'word': word, 'search_by': search_by };
        $.get('/misweb_stat/search_node', query_param, function(ret){
            if(ret.status == 0) {
                //$('#stream_list').html(ret.data.streams);
                //$('.page').html(ret.data.page);
        var s = '';
        var i = 0;
        for( i=0; i<ret.data.length; i++)
        {
            s+= '<option value='+ret.data[i][1]+'>'+ret.data[i][0]+'</option>';
        }
        $("#search_result_list").html(s);
        if( stat_type == 'misweb_stream_stat' )
        {
            $("#search_result_list").css("height","100px");
        }
        else
        {
            $("#search_result_list").css("height","200px");
        }
        $("#search_result_list").show();
        $("#search_result_list").focus();

            }
        else
        {
        alert(ret.msg);
        }
        }, 'json');
}


// 搜索数据流的处理
function search_data_stream(data_name)
{
        $.get('/misweb_stat/getstreamdistinfo', { 'data_name': data_name }, function(ret){
            if(ret.status == 0) {
                var dist_info = ret.data[0];
                var page_name = ret.data[1];
                $.get( '/misweb_stat/get_node_path', { 'page_name': page_name }, function(ret){
                    if(ret.status == 0) {
                        // 靠修改记录 jstree 的相关 cookie 来实现打开指定节点
                        var i = 0;
                        var jstree_open="";
                        var jstree_select="";
                        //alert(ret.data);
                        for( i=ret.data.length-1; i>=0; i-- )
                        {
                            var n = ret.data[i];
                            if( i == 0 )
                            {
                                jstree_select="#misweb_tree_node_"+n;
                            }
                            else
                            {
                                jstree_open=jstree_open+",#misweb_tree_node_"+n;
                            }
                        }
                        jstree_open = jstree_open.substring(1);
                        $.cookie("misweb_jstree_open", jstree_open);
                        $.cookie("misweb_jstree_select", jstree_select);
                        //$.cookie("misweb_select_node", jstree_select);

                        window.location.href="/stat/misweb_stream_stat?data_name="+data_name+"&dist_info="+dist_info;
                    }
                    else {
                        alert(ret.msg);
                    }
                }, 'json' );
            }
            else
            {
                 alert(ret.msg);
            }
        }, 'json');
}

// 把搜索到的节点,按节点路径依次打开
function open_node_path(node_id)
{
    var search_by = $("#search_by").val();
    if(search_by != 'node')
    {
        search_data_stream(node_id);
        return;
    }
    if(node_id == null)
    {
        return;
    }
    $("#search_result_list").hide();
        $.get('/misweb_stat/get_node_path', { 'node_id': node_id }, function(ret){
            if(ret.status == 0) {
        // 靠修改记录 jstree 的相关 cookie 来实现打开指定节点
        var i = 0;
        var jstree_open="";
        var jstree_select="";
        //alert(ret.data);
        for( i=ret.data.length-1; i>=0; i-- )
        {
            var n = ret.data[i];
            if( i == 0 )
            {
                jstree_select="#misweb_tree_node_"+n;
            }
            else
            {
                jstree_open=jstree_open+",#misweb_tree_node_"+n;
            }
        }
        jstree_open = jstree_open.substring(1);
        $.cookie("misweb_jstree_open", jstree_open);
        $.cookie("misweb_jstree_select", jstree_select);
        //$.cookie("misweb_select_node", jstree_select);
        window.location.href="/stat/misweb_stat";
            }
        }, 'json');
}
