var file_upload;
var is_duplicate_process_name = false;

$(function(){

    $('#ProcessPage').tabs();
    $("#file_load_img").hide();
    $("#file_add_load_img").hide();
    if($('#code_managed_sel').val() == 0){
        $("tr[name='managed_code_tr']").hide();
    }
    else{
        $("tr[name='managed_code_tr']").show();
    }
   
    $("#process_form").submit(function(e){
        if(false === process_check()){
            e.preventDefault();
        }
    });

    $('#code_managed_sel').live($.browser.msie ? 'click' : 'change', function(){
        if($(this).val() == 0){
            $("tr[name='managed_code_tr']").hide();
        }
        else{
            $("tr[name='managed_code_tr']").show();
        }
    });
	
	
	
    // 重名标志
    $('#process_type').change(function(){
        process_id= (typeof process_id == 'undefined')? -1:process_id;
        $('#ProcessNameLoader').show();
        $.get('/rest/duplicate_process_name', {name:$(this).val(), 'process_id':process_id}, function(ret){
            if(ret.status == 0){
                $('#Duplicate_tip').show();
                $(this).focus();
                is_duplicate_process_name = true;
            }else{
                $('#Duplicate_tip').hide();
                is_duplicate_process_name = false;
            }
            $('#ProcessNameLoader').hide();
        }, 'json');

        
    });
    
    $('#code_view').click(function(e){
    	if(process_id=== -1) {
			alert('编辑基本信息后才能管理代码');
            e.preventDefault();
            return;
		}
	});
    if(process_id !== -1) {
		
        var f1 = $('#elfinder').elfinder({
            lang:'zh_CN',
            url : '/process/elFinder?root_dir=' + show_dir + '&can_write=1'
        }).elfinder('instance');
    }


});



function process_check() {
    if($('#process_type').val()=="") {
        alert('请输入处理类型');
        return false;
    }
    if($('#owner').val()=="") {
        alert("请输入负责人");
        return false;
    }
    if($('#code_managed_sel').val() == 1){
        if($('#entry_code').val()=="") {
            alert("请输入入口代码");
            return false;
        }
    }
    if(is_duplicate_process_name){
        alert("数据处理或者监控同名了");
        return false;
    }

    var nameregex = /^[A-Z0-9\._%+-]+$/i;
    if(!nameregex.test($('#owner').val())) {
        alert('请输入入合法的负责人邮箱前缀');
        return false;
    }
    return true;
}

