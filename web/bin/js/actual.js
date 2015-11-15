
/********************分页JS 无需关注**************************/ 
function initPageCompHTML(nowPage,endPage,$pageArea){   
	nowPage = Number(nowPage);
	endPage = Number(endPage);

	var numberPageArr = [];      
	if ((2 <= endPage && nowPage < 6) || endPage<=10) {
		for (var i = 1; i <= Math.min(endPage,10); i++) {
			numberPageArr = numberPageArr.concat([i]);
		};
	} else {
		if (nowPage >= endPage-4) {
			var cNmber = 10;
			var cCont = 11;
			if(endPage <10){
			   cNmber = endPage,cCont = endPage+1;
			}

			for (var i = 1; i <cCont; i++) {
				numberPageArr = numberPageArr.concat([endPage-cNmber+i]);
			};
		}else {
			numberPageArr = [nowPage-4,nowPage-3,nowPage-2,nowPage-1,nowPage,nowPage+1,nowPage+2,nowPage+3,nowPage+4,nowPage+5];
		}
	};

	var pageCompHTML = ['<span class="actual_page_number_preStart">&lt;&lt;</span><span class="actual_page_number_pre">&lt;</span>'];
	for (var i = 0; i < numberPageArr.length; i++) {
		if (numberPageArr[i] == nowPage){
			pageCompHTML = pageCompHTML.concat([
				'<span class="actual_page_number_now">',numberPageArr[i],'</span>'
			]);
		} else {
			pageCompHTML = pageCompHTML.concat([
				'<span class="actual_page_number">',numberPageArr[i],'</span>'
			]);
		};
	};
	pageCompHTML = pageCompHTML.concat([
		'<span class="actual_page_number_next">&gt;</span><span class="actual_page_number_nextEnd">&gt;&gt;</span>'
	]);
	//刷新翻页区
	$pageArea.find('p:first').html(pageCompHTML.join(''));
}

function initPageComp($pageArea,fn){   
	if ($pageArea.length>0) {
		if (fn.resultnum > fn.nownum) {      
			$pageArea.css('display','block');   
			var endPage = Math.ceil(fn.resultnum / fn.nownum);
			initPageCompHTML(fn.nowPage,endPage,$pageArea);

			var $pageNumber = $pageArea.find(".actual_page_number");    
			$pageNumber.click(function(ev){
				fn.nowPage = Number($(this).html());
				getData(fn,$pageArea);
				if ( ev && ev.stopPropagation ){ 
					ev.stopPropagation(); 
				}else{
					window.event.cancelBubble = true; 
				}
			});
			var $pagePre = $pageArea.find(".actual_page_number_pre").eq(0);     
			if ($pagePre.length>0) {
				$pagePre.click(function(ev){
					fn.nowPage = fn.nowPage - 1;
					getData(fn,$pageArea);
					if ( ev && ev.stopPropagation ){ 
						ev.stopPropagation(); 
					}else{
						window.event.cancelBubble = true; 
					}
				});
			};
			var $pagePre = $pageArea.find(".actual_page_number_preStart").eq(0);     
			if ($pagePre.length>0) {
				$pagePre.click(function(ev){
					fn.nowPage = 1;
					getData(fn,$pageArea);
					if ( ev && ev.stopPropagation ){ 
						ev.stopPropagation(); 
					}else{
						window.event.cancelBubble = true; 
					}
				});
			};
			var $pageNext = $pageArea.find(".actual_page_number_next").eq(0);   
			if ($pageNext.length>0) {
				$pageNext.click(function(ev){    
					fn.nowPage = fn.nowPage + 1;
					getData(fn,$pageArea);
					if ( ev && ev.stopPropagation ){ 
						ev.stopPropagation(); 
					}else{
						window.event.cancelBubble = true; 
					}
				});                
			};
			var $pageNext = $pageArea.find(".actual_page_number_nextEnd").eq(0);   
			if ($pageNext.length>0) {
				$pageNext.click(function(ev){    
					fn.nowPage = endPage;
					getData(fn,$pageArea);
					if ( ev && ev.stopPropagation ){ 
						ev.stopPropagation(); 
					}else{
						window.event.cancelBubble = true; 
					}
				});                
			};
		} else {                        
			$pageArea.css('display','none');
		};
	};
}//initPageComp函数结束
function getData(fn,dom){
	initPageComp(dom,fn);
	pageClick(fn.nowPage,fn.endPage);
}
/********************分页JS END**************************/
/********************弹出层 无需关注**************************/
Pop = {
	show : function(){
		var _this = this;
		$pop = $('<div class="actual_pop"></div>'),
		_this.first = $('body').children().eq(0);
		_this.first.before($pop); 
	},
	hide : function(){
		$('.actual_PopShow,.actual_pop').fadeOut(function(){
			$(this).remove();
		}); 
	},
	succ : function(isDump,mess){
		var _this = this,
			box =  '<div class="actual_succPop actual_PopShow">'
				  +     '<p class="actual_pop_title">'
				  +          '<a></a>'
				  +     '</p>'
				  +     '<p class="fix actual_pop_mess"><i class="fl">√</i>'+mess+'</p>'
				  +'</div>';       
		_this.show(); 
		_this.first.before($(box)); 
		_this.bindClose(); 
		isDump && ( setTimeout(function(){window.location.href =  isDump},1000));      
	},
	error : function(isDump,mess,mess2){
		var _this = this,
			box =  '<div class="actual_errorPop actual_PopShow">'
				  +     '<p class="actual_pop_title">'
				  +          '<a></a>'
				  +     '</p>'
				  +     '<div class="fix actual_pop_mess"><i class="fl">X</i>'+mess+'</div>'
				  +     '<div class="actual_pop_errorCode">'
				  +			'<div class="actual_pop_error_wrap">'	
				  +              '<p>'+mess2+'</p>'
				  +			'</div>'
				  +     '</div>'
				  +'</div>';
		_this.show(); 
		_this.first.before($(box)); 
		_this.bindClose();
		isDump && ( setTimeout(function(){window.location.href =  isDump},1000));
	},
	bindClose : function(){
		var _this = this;
		$(document).on('click','.actual_pop_title a',function(){
			_this.hide();
		});
	}
}
/********************弹出层END**************************/
//format
String.prototype.format = function(args) { 
	if (arguments.length>0) { 
		var result = this; 
		if (arguments.length == 1 && typeof (args) == "object") { 
			for (var key in args) { 
				var reg=new RegExp ("({"+key+"})","g"); 
				result = result.replace(reg, args[key]); 
			} 
		}else { 
		for (var i = 0; i < arguments.length; i++) { 
			if(arguments[i]==undefined){ 
				return ""; 
			}else{ 
				var reg=new RegExp ("({["+i+"]})","g"); 
				result = result.replace(reg, arguments[i]); 
			} 
		} 
	} 
	return result; 
	}else { 
		return this; 
	} 
} 