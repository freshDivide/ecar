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
    .bind('select_node.jstree', function(e, data){
        node_id = data.rslt.obj.data('id');
        if($('#stream_list').length > 0) {
            var search = document.location.search;
            var q = getParameter(search,'q');
            var by = getParameter(search,'by');
            var page = getParameter(search,'page');
            var query_param = { 'node_id':node_id,'q': q, 'by':by, 'page':page };

            //加载数据流列表界面
            $('#stream_list').html('<li class="empty"><img src="/image/ajax-bar.gif" /></li>');
            $.get('/stream/get_by_node', query_param, function(ret){
                if(ret.status == 0) {
                    $('#stream_list').html(ret.data.streams);
                    $('.page').html(ret.data.page);

                }
            }, 'json');
        }
        else {
            if(first_select === false) {
                window.location.href = '/stream/list';
            }
        }
        first_select = false;
    }).bind("loaded.jstree", function (event, data) { 
        first_select = true;
    });


    
    //新建根节点
    $("#new_root").click(function () {
	    $("#tree").jstree("create", null, "last", { state:'opened' });
	});

});


