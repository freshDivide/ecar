$(function () {
 $('#PrivApplyPage').tabs({
	select:function(e, ui){
		if(ui.panel.id == 'StreamPrivApply'){
			window.location = '/privilage/privapply';
			e.preventDefault();
		}
	}
});
	
$("#tree")
	.jstree({ 
		// List of active plugins
		"plugins" : [ 
			"themes","json_data","ui","sort","checkbox","ui" ,"search"
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
			"initially_select" : [ "tree_node_1" ]
		},
		// the core plugin - not many options here
		"core" : { 
			// just open those two nodes up
			// as this is an AJAX enabled tree, both will be downloaded from the server
			"initially_open" : [ "tree_node_1" ] 
		},
		"checkbox": {
			"two_state" : true
		}
	}).bind("loaded.jstree", function (e, data) {
		data.inst.open_all(-1); // -1 opens all nodes in the container
	});

	
	$('#save').click(function(e) {
		var selected_ids = get_selected_nodes();
		$('#selected_nodes').val(selected_ids);
		$('#priv_apply_form').submit();
	});
	
	$.get('/privilage/getUserPriv', function(res){
        if(res.status == 0){
			var str = '<table class="item-table" width="98%">' + 
					  '<th>节点</th><th>操作类型</th>';
			$.each(res.data, function(i,v){
				var ns_name = v.ns_name.split(',').join('/');
				str += '<tr><td>' + ns_name + '</td><td>' +v.op_name  + '</td></tr>';
			});
			str += '</table>';
			$('#owned_priv').html(str);
		}
		else {
			alert('获取用户权限失败');
		}
	}, 'json');
	
});

function get_selected_nodes() {
	var ids = [];
	$("#tree").jstree("get_checked",null,true).each(function(i,n){
		 ids.push(n.id.replace('tree_node_','')); 
	});
	return ids.join(',');
}





