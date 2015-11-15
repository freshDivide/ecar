$(function () {
    $('#AdminApplyPage').tabs({
		select:function(e, ui){
			if(ui.panel.id == 'AdminPrivApply'){
				window.location = '/privilage/adminprivapply';
				e.preventDefault();
			}
		}
    });
});
	





