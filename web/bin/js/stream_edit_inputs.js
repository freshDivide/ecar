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
                window.location = '/draft/stream_edit_monitor?stream_id='+stream_id+'#MonitorInfo';
            }
            e.preventDefault();
        }
    });


    /* 输入搜索 */
    $('#InputSearcher').autocomplete({
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
                    '<div>'+item.stream.name+'</div>'
                    +'<div>'+htmlEncode(item.stream.description)+'</div>'
                )
            ).appendTo(ul);
    };
    $('#InputAddForm').submit(function(e){
        if($('#InputId').val()==''){
            alert('请选择输入数据.');
            e.preventDefault();
        }
    });


});

