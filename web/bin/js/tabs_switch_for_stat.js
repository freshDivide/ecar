$(function(){
    $('#StatShowPage').tabs({
        select:function(e, ui){
            if(ui.panel.id == 'NodeUpdateStat'){
                window.location = '/stat/node_update_stat';
                e.preventDefault();
            }
            else if(ui.panel.id == 'NodeStreamStat'){
                window.location = '/stat/node_stream_stat';
                e.preventDefault();
            }
            else if(ui.panel.id == 'MisWebStat'){
                window.location = '/stat/misweb_stat';
                e.preventDefault();
            }
        },
        show:function(e, ui){
		//$('#StatShowPage').tabs({active: 1});
		// 上面的不生效，所以只好用下法
		var o1=$(".node_stat_first");
		var o2=$("."+stat_type);
		if(o1.get(0) != o2.get(0))
		{
			$(".node_stat_first").removeClass("ui-state-active");
			$(".node_stat_first").removeClass("ui-tabs-selected");
			$("."+stat_type).addClass("ui-state-active");
			$("."+stat_type).addClass("ui-tabs-selected");
		}
        }
    });

});

$(document).ready(function(){
                });     
