$(function(){
    /* 初始化 */
    $('#DataProcessForm').tabs({
        create:function(e, ui){
            if(typeof stream_id == 'undefined'){
                $(this).tabs('select', '#BasicInfo');
            }
        },
        select:function(e, ui){
            if(typeof stream_id == 'undefined'){
                alert('请先保存草稿.');
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
    $('.btn').button();

});

