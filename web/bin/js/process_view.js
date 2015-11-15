$(function(){
    $('#ProcessViewPage').tabs();

    var f1 = $('#elfinder').elfinder({
        lang:'zh_CN',
        url : '/process/elFinder?root_dir=' + show_dir + '&can_write=0'
    }).elfinder('instance');
});
