$(function(){
    $('#ProcessListPage').tabs({
        select:function(e, ui){
            if(ui.panel.id == 'ProcessCreate'){
                window.location = '/process/edit';
                e.preventDefault();
            }
        },
        show:function(e, ui){
            if(ui.panel.id == 'ProcessCreate'){
                window.location = '/process/edit';
                e.preventDefault();
            }
        }
    });

    $('.process-info').click(function(){
        var id = $(this).attr('iid');
        $('#Icon_' + id).toggleClass('node-icon-expand');
        $('#P_' + id).slideToggle();
    });

    $(".delete-process").click(function(e) {
        var process_id = $(this).attr("iid");
        if(confirm('确定要删除此处理&监控？')){
            $.createActionForm('/process/delete', {
                'id':process_id
            }).submit();
        }
        e.preventDefault();
    });

});

