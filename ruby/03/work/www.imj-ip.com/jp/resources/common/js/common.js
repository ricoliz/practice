/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* setting_info
----------------------------------------------------------------------*/

/* setting_info animateSpeed
----------------------------------------------------------------------*/
var spd_gnavi_arrow_in = 200;
var spd_gnavi_arrow_out = 100;
var spd_snavi_in = 350;
var spd_snavi_out = 350;
var spd_snavi_fadein = 750;
var spd_snavi_fadeout = 600;
var spd_snavi_pannel_in = 300;
var spd_snavi_pannel_fadeout = 350;
var spd_snavi_pannel_ttl_fadeout = 200;
var spd_snavi_pannel_ttl_fadein = 600;
var spd_snavi_pannel_txt_in = 120;
var spd_snavi_pointer_in = 580;
var spd_delayview_fadein = 350;
var spd_slidebox_in_val = 550;
var spd_slidebox_out_val = 400;
var spd_accordionbox_in = 600;
var spd_accordionbox_out = 400;
var spd_accordionbox_out_only = 500;
var spd_accordionbox_scroll = 600;
var spd_accordionbox_txt_fadein = 150; 
var spd_anchor_scroll_val = 700;
var spd_visual_slide_fadein = 1500;
var spd_visual_slide_fadein_delay = 300;
var spd_visual_slide_fadeout = 1000;
var spd_visual_slide_interval = 6000;
var spd_carousel = 300;


/* setting_info easing
----------------------------------------------------------------------*/
var esg_gnavi_arrow_in = 'swing';
var esg_gnavi_arrow_out = 'swing';
var esg_snavi_in = 'swing';
var esg_snavi_out = 'swing';
var esg_snavi_pannel_in = 'swing';
var esg_snavi_pointer_in = 'swing';
var esg_slidebox_in = 'easeOutQuart';
var esg_slidebox_out = esg_slidebox_in;
var esg_accordionbox_in = 'easeOutQuart';
var esg_accordionbox_out = esg_accordionbox_in;
var esg_accordionbox_scroll = esg_accordionbox_in;
var esg_anchor_scroll = 'swing';
var esg_carousel = 'swing';


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* global
----------------------------------------------------------------------*/

/* global ウェブフォントロード後に実行するfunctionを格納
----------------------------------------------------------------------*/
var func_after_loaded_webfont;


/* global get user environment
----------------------------------------------------------------------*/
var device_type = (function(){
						if ($(window).width() <= 480) {
							return 'sp';
						} else if ($(window).width() > 481 && ('ontouchstart' in window)){
							document.write('<link rel="stylesheet" type="text/css" href="/en/resources/common/css/import_tbl.css">');
							return 'tb';
						} else {
							return 'pc';
						}
					})();

var browser_type = (function(){
						var userAgent = window.navigator.userAgent.toLowerCase();
						var appVersion = window.navigator.appVersion.toLowerCase();
						if (userAgent.indexOf("msie") != -1) {
							if (appVersion.indexOf("msie 6.") != -1) {
								return 'ie6';
							} else if (appVersion.indexOf("msie 7.") != -1) {
								return 'ie7';
							} else if (appVersion.indexOf("msie 8.") != -1) {
								return 'ie8';
							} else if (appVersion.indexOf("msie 9.") != -1) {
								return 'ie9';
							} else {
								return 'ie';
							}
						} else {
							return 'modern';
						}
					})();


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* setup
----------------------------------------------------------------------*/
$(document).ready(setup);　//document.ready

function setup(){

	setup_href();
	if(device_type == 'pc') set_e_navi_pc(); //'pc'
	if(device_type == 'tb') set_e_navi_tb(); //'tb'
	if(device_type == 'sp') set_e_navi_sp(); //'sp'
	setup_loaded_webfont();
	reset_e_device_change();

	/* setup　webフォント読み込み完了後の処理(重み700)
	----------------------------------------------------------------------*/
	function setup_loaded_webfont(){
		
		var timer = window.setTimeout(function(){
			
			//文字の高さが関わる処理
			set_e_slide_box();
			//set_e_accordion_box();
	
			//各ページのローカルのjsを実行
			if(typeof func_after_loaded_webfont == 'function') func_after_loaded_webfont();
			
			//文字の高さが関わる処理　アコーディオンが閉じた後
			set_e_scroll(); //'pc'
	
		},700); 
	
	}

}
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* modules
----------------------------------------------------------------------*/

/* modules　画面サイズ切り替わり処理
----------------------------------------------------------------------*/
function reset_e_device_change(){
			
	$(window).unbind('resize');

	$(window).resize(function(){		
		
		if(device_type == 'pc' && $(window).width() <= 480) {
			
			device_type = 'sp';
			$('html *').unbind();
			setup();
			
		} else if(device_type == 'sp' && $(window).width() >= 481) {
			
			device_type = 'pc';
			$('html *').unbind();
			setup();
		}
	
	});
}

/* modules aタグのhref設定
----------------------------------------------------------------------*/
function setup_href(){

	$('body').find('a').each(function(){
		
		//httpではじまらないリンク
		if (!$(this).attr('href').match('^http')) {

			//#のみ
			if ($(this).attr('href').match('^#$')) {					
				return;
		　	//#FOOBAR
			} else if ($(this).attr('href').match('^#')) {
				$(this).click(function(e){
					
					e.preventDefault();
					
					var id = $(this).attr('href');
					var scroll_top_val = $(id).offset().top;
					
					if(scroll_top_val > 30) {//toTop以外はヘッダ除去
						
						if(device_type == 'pc') {
							var header_h = 	$('#header').height();
							scroll_top_val = scroll_top_val - header_h - 30;	//'pc'
						} else if (device_type == 'sp' || device_type == 'tb') {
							scroll_top_val = scroll_top_val - 30;
						}//'sp','sp'
						
					}					
					
					$('html,body').stop(true, false).animate({scrollTop: scroll_top_val},spd_anchor_scroll_val, esg_anchor_scroll);
				});
			} else {
				return;
			}
		//httpではじまるリンク
		} else  {
			$(this).attr('target','_blank');
		}
	});

}

/* modules スクロールイベント //'pc'
----------------------------------------------------------------------*/
function set_e_scroll(){
	
	//init
	var scroll_top_val = $(window).scrollTop();
	
	//画面サイズ切り替え用処理
	$('.delayView').css('opacity',1);
	
	if(device_type == 'pc') {
		
		// header デフォルト表示
		if(!(browser_type=='ie6')) {

			if (scroll_top_val >= 100) {
				$('#header').addClass('scroll');
			}
			
		}//not'ie6'
			
		// .delayView デフォルト表示or非表示
		$('.delayView').each(function(){
			if ($(this).offset().top > scroll_top_val+$(window).height()){
				$(this).css('opacity',0);
			}
		});

		$(window).scroll(function(){
	
			 scroll_top_val = $(window).scrollTop();
			
			// header 
			if(!(browser_type=='ie6')) {
					
				if(scroll_top_val < 100){
					$('#header .logo img').css('width', (245-93*scroll_top_val/100));
					$('#header').css('padding-top', 30-20*scroll_top_val/100);
					$('#header p.logo').css('padding-bottom', 30-30*scroll_top_val/100);
					$('#header .contentWidth #globalNavi').css('margin-top', -(10*scroll_top_val/100)).css('margin-bottom', -(10*scroll_top_val/100));
					$('#header').removeClass('scroll');
				} else if (scroll_top_val >= 100) {
					$('#header').addClass('scroll');
				}
				
			}//not'ie6'
				
			// .delayView
			$('.delayView').each(function(){
				if ($(this).offset().top < scroll_top_val + $(window).height()-$(window).height()/5 ){
					$(this).animate({opacity:1});
				}
			});
			
		});
		
	}//'pc'
}

/* modules ナビゲーション //'pc'
----------------------------------------------------------------------*/
function set_e_navi_pc(){

	//jquery object
	var jq_gnavi = $('#globalNavi');
	var jq_gnavi_li = $('#globalNavi li');
	var jq_snavi = $('#subnavi');
	var jq_snavi_inner = $('.subnaviWrap ul');
	var jq_snavi_a = $('.subnaviWrap ul li a, #footerNavi ul li a'); //フッタナビ
	var jq_snavi_pointer = $('#subnavi .pointer');

	var index;
	
	//setTimeout
	var timer_open_subnavi;
	var timer_close_subnavi;


	/* グロナビマウスオーバー処理
	----------------------------------------------------------------------*/
	jq_gnavi_li.hover(function(){//マウスイン

		index = jq_gnavi_li.index(this);
		
		//arrow表示	
		move_arrow('in', index, 1);	
		
		//showSubnaviがある場合
		if(jq_gnavi_li.eq(index).hasClass('showSubnavi')) {			
			
			clearTimeout(timer_close_subnavi);
			timer_open_subnavi = setTimeout(function() {	
				open_subnavi(index, 1);					
			}, 400);		
		
		}

	}, function() {//マウスアウト

		//arrow表示
		move_arrow('out', index, 1);
		
		//グロナビからマウスアウトしてサブナビにマウスイン
		jq_snavi.hover(function(){

			clearTimeout(timer_close_subnavi);
			open_subnavi(index, 0);

			//arrow表示
			if(jq_snavi_inner.eq(index).is(':visible')) {//表示されている場合
				move_arrow('in', index, 1);
			} else {//表示されていない場合
				var index_s;
				jq_snavi_inner.each(function(){//表示されていない場合は表示されている要素のグロナビを表示
					if($(this).is(':visible')) index_s = jq_snavi_inner.index(this);
				});
				move_arrow('in', index_s, 0);
			}
			
		}, function() {
				
			clearTimeout(timer_open_subnavi);
			timer_close_subnavi = setTimeout(function() {				
				close_subnavi();
			}, 400);
			
			//arrow表示
			if(jq_snavi_inner.eq(index).is(':visible')) {	
				move_arrow('out', index, 1);				
			} else {
				var index_s;
				jq_snavi_inner.each(function(){
					if($(this).is(':visible')) index_s = jq_snavi_inner.index(this);
				});
				move_arrow('out', index_s, 1);
			}			
		});

		clearTimeout(timer_open_subnavi);
		timer_close_subnavi = setTimeout(function() {		
			close_subnavi();				
		}, 400);
		
	});
	

		/* function for this modules
		----------------------------------------------------------------------*/
		
		//arrowのアニメーション定義
		function  move_arrow(_inout, _index, _animate_type) {			
			
			var isCur = jq_gnavi_li.eq(_index).hasClass('cur');
			
			if(isCur == false && _inout == 'in') { //curは対象外

				if(_animate_type == 1) {
					$('span',jq_gnavi_li.eq(_index)).stop(true, false).animate({left:'0px'},spd_gnavi_arrow_in,esg_gnavi_arrow_in).css('color','#5a5a5a');
				} else if (_animate_type == 0) {//アニメーションなし、すぐ表示					
					$('span',jq_gnavi_li.eq(_index)).stop(true, false).css('left','0px').css('color','#5a5a5a');
				}
				
			} else if(isCur == false && _inout == 'out') { //curは対象外
				
				if(_animate_type == 1) {
					$('span',jq_gnavi_li.eq(_index)).stop(true, false).animate({left:'-10px'},spd_gnavi_arrow_out,esg_gnavi_arrow_out).css('color','#969696');
				} else if (_animate_type == 0) {//アニメーションなし、すぐ表示
					$('span',jq_gnavi_li.eq(_index)).stop(true, false).css('left','-10px').css('color','#969696');
				}
				
			} else {
				return;
			}
		}
	
		//サブナビ開く
		function  open_subnavi(_index, _show_type) {					
			if(_show_type == 1) {
			
				if(!jq_snavi_inner.eq(_index).is(':visible')) {
					jq_snavi_inner.fadeOut(spd_snavi_fadeout);
				}
				
				//開く
				jq_snavi.stop(true, false).animate({height:'135px'},spd_snavi_in, esg_snavi_in);
				
				//表示するsubnavi_innerを抽出。他は非表示
				for(var i=0; i<= jq_snavi_inner.length; i++){

					if(i == _index){
						//inner表示
						$('.panelBG',jq_snavi_a).stop(true,true).hide();//パネルが残る場合があるので念のため
						jq_snavi_inner.eq(i).stop(true, true).fadeIn(spd_snavi_fadein);	
							
						//pointerの初期位置へ移動
						var pos_x_first = jq_snavi_inner.eq(i).children('li').offset().left + 101;
						jq_snavi_pointer.stop(true,false).animate({left: pos_x_first+'px'},spd_snavi_pointer_in ,esg_snavi_pointer_in);						
						
					} else {							
						//inner非表示
						jq_snavi_inner.eq(i).stop(true, true).fadeOut(spd_snavi_fadeout);
					}					
				}

			} else if (_show_type == 0) {//サブナビの表示要素精査なし、すぐ表示
				//開く
				jq_snavi.stop(true, false).animate({height:'135px'},spd_snavi_in, esg_snavi_in);				
			}
		}

		//サブナビ閉じる
		function close_subnavi() {

			//閉じる
			jq_snavi.stop(true, false).animate({height:'0px'},spd_snavi_out, esg_snavi_out);
		
		}

	
	/* サブナビマウスオーバー処理
	----------------------------------------------------------------------*/
	$('.panelTxt',jq_snavi_a).hide();

	jq_snavi_a.hover(function(){//マウスイン
		
		//パネル要素操作
		$('.panelBG',this).stop(true,true).css('top', '-90px').show().animate({top: '0px'},spd_snavi_pannel_in ,esg_snavi_pannel_in);
		$('.ttl.off',this).stop(true,true).fadeOut(spd_snavi_pannel_ttl_fadeout);			
		$('.panelTxt',this).stop(true,true).delay(200).fadeIn(spd_snavi_pannel_ttl_fadein);
		$('.panelTxt .txt',this).stop(true,true).css('margin-top', '8px').delay(300).animate({marginTop: '0px'},spd_snavi_pannel_txt_in,esg_snavi_pannel_in);
		
		//pointer移動
		var pos_x = $(this).offset().left + 101;
		jq_snavi_pointer.stop(true, false).animate({left: pos_x+'px'},spd_snavi_pointer_in ,esg_snavi_pointer_in);
	
	},function(){//マウスアウト
		
		//パネル要素操作
		$('.panelBG',this).stop(true,true).fadeOut(spd_snavi_pannel_fadeout);
		$('.ttl.off',this).stop(true,true).show();
		$('.panelTxt',this).stop(true,true).fadeOut(spd_snavi_pannel_fadeout);
	
	});
}

/* modules ナビゲーション //'tb'
----------------------------------------------------------------------*/
function set_e_navi_tb(){

	//jquery object
	var jq_gnavi_a = $('#globalNavi li a');
	var jq_snavi = $('#subnavi');
	var jq_snavi_inner = $('.subnaviWrap ul, #footerNavi ul');
	var jq_snavi_a = $('.subnaviWrap ul li a,  #footerNavi ul li a');

	var index;


	/* グロナビマウスオーバー処理
	----------------------------------------------------------------------*/
	jq_gnavi_a.click(function(e){

		index = jq_gnavi_a.index(this);
		
		if(jq_gnavi_a.eq(index).parent('li').hasClass('showSubnavi')) {
			
			e.preventDefault();
		
			if(jq_snavi.height() == 0) {
				
				//arrow表示	
				move_arrow('in', index);	
				open_subnavi(index);
				
			} else if(jq_snavi.height() == 135 && jq_snavi_inner.eq(index).is(':visible')) {				
				
				//arrow表示
				move_arrow('out', index);
				close_subnavi();
				
			} else if(jq_snavi.height() == 135 && jq_snavi_inner.is(':visible')) {

				var index_s;
				jq_snavi_inner.each(function(){
					if($(this).is(':visible')) index_s = jq_snavi_inner.index(this);
				});
				move_arrow('out', index_s);

				//arrow表示	
				move_arrow('in', index);	
				open_subnavi(index);
				
			}
			return false;
		}
		
	});
	

		/* function for this modules
		----------------------------------------------------------------------*/
		
		//arrowのアニメーション定義
		function  move_arrow(_inout, _index) {			
			
			var isCur = jq_gnavi_a.eq(_index).parent('li').hasClass('cur');
			
			if(isCur == false && _inout == 'in') { //curは対象外

				$('span',jq_gnavi_a.eq(_index)).stop(true, false).animate({left:'0px'},spd_gnavi_arrow_in,esg_gnavi_arrow_in).css('color','#5a5a5a');

			} else if(isCur == false && _inout == 'out') { //curは対象外
				
					$('span',jq_gnavi_a.eq(_index)).stop(true, false).animate({left:'-10px'},spd_gnavi_arrow_out,esg_gnavi_arrow_out).css('color','#969696');

			} else {
				return;
			}
		}
	
		//サブナビ開く
		function  open_subnavi(_index) {					
			
			if(!jq_snavi_inner.eq(_index).is(':visible')) {
				jq_snavi_inner.fadeOut(spd_snavi_fadeout);
			}
			
			//開く
			jq_snavi.stop(true, false).animate({height:'135px'},spd_snavi_in, esg_snavi_in);
			
			//表示するsubnavi_innerを抽出。他は非表示
			for(var i=0; i<= jq_snavi_inner.length; i++){

				if(i == _index){
					//inner表示
					jq_snavi_inner.eq(i).stop(true, true).fadeIn(spd_snavi_fadein);	
					
				} else {							
					//inner非表示
					jq_snavi_inner.eq(i).stop(true, true).fadeOut(spd_snavi_fadeout);
				}					
			}
				
		}

		//サブナビ閉じる
		function close_subnavi() {

			//閉じる
			jq_snavi.stop(true, false).animate({height:'0px'},spd_snavi_out, esg_snavi_out);
		
		}
}

/* modules ナビゲーション //'sp'
----------------------------------------------------------------------*/
function set_e_navi_sp(){
	
	//jquery object
	var jq_gnavi_a = $('#smpNavi ul.gN > li > span > a');
	var jq_snavi = $('#smpNavi ul.sN');
	
	//画面サイズ切り替え用処理
	if(device_type == 'sp')	{
		jq_snavi.show();
		jq_snavi.css('height','auto');
	}
	
	//init
	//高さが不確定の要素に対して高さ指定
	jq_snavi.each(function() {
		var index_s = jq_snavi.index(this);
		var isCur = jq_gnavi_a.eq(index_s).parent().parent('li').hasClass('cur');
		if(isCur == false) {
			$(this).css('height',$(this).height());
			$(this).hide();
		}
	});
	
	jq_gnavi_a.click(function(e){
		
		e.preventDefault();
		
		var index = jq_gnavi_a.index(this);
		var isCur = jq_gnavi_a.eq(index).parent().parent('li').hasClass('cur');
		//if(isCur == false) {
			if(jq_snavi.eq(index).is(':visible')){ //閉じる
				move_arrow('out', index);
				jq_snavi.eq(index).slideUp(spd_slidebox_out_val, esg_slidebox_out);
				return false;
			} else { //開く
				move_arrow('in', index);
				jq_snavi.eq(index).slideDown(spd_slidebox_in_val, esg_slidebox_in);
				return false;
			}
		//} else {
		//	return false;
		//}
	});
	
		/* function for this modules
		----------------------------------------------------------------------*/
		
		//arrowのアニメーション定義
		function  move_arrow(_inout, _index) {			
			
			var isCur = jq_gnavi_a.eq(_index).parent().parent('li').hasClass('cur');
			
			if(isCur == false && _inout == 'in') { //curは対象外

				$('span',jq_gnavi_a.eq(_index)).stop(true, false).animate({left:'0px'},spd_gnavi_arrow_in,esg_gnavi_arrow_in).css('color','#5a5a5a');

			} else if(isCur == false && _inout == 'out') { //curは対象外
				
				$('span',jq_gnavi_a.eq(_index)).stop(true, false).animate({left:'-10px'},spd_gnavi_arrow_out,esg_gnavi_arrow_out).css('color','#969696');

			} else {
				return;
			}
		}
		
}

/* modules スライドボックス
----------------------------------------------------------------------*/
function set_e_slide_box(){

	//jquery object
	var jq_content = $('.slideBox .slContent');
	var jq_button = $('.slideBox .slButton a');

	//画面サイズ切り替え用処理
	jq_content.show();
	jq_content.css('height','auto');

	//init
	//高さが不確定の要素に対して高さ指定
	jq_content.each(function() {
		$(this).css('height',$(this).height());
		$(this).hide();
	});
	
	jq_button.click(function(e){
		
		e.preventDefault();
		
		var index = jq_button.index(this);
		if(jq_content.eq(index).is(':visible')){ //閉じる
			jq_content.eq(index).slideUp(spd_slidebox_out_val, esg_slidebox_out
			,function(){
				jq_button.eq(index).text(jq_button.eq(index).attr('c'));
			});
       		return false;
	   	} else { //開く
       		jq_content.eq(index).slideDown(spd_slidebox_in_val, esg_slidebox_in
			,function(){
				jq_button.eq(index).text(jq_button.eq(index).attr('o'));
			});
			return false;
		}
	});
}


/* modules アコーディオンボックス
----------------------------------------------------------------------*/
function set_e_accordion_box(){

	//jquery object
	var jq_content = $('.accordionBox .acContent');
	var jq_button = $('.accordionBox .acButton a');

	//画面サイズ切り替え用処理
	jq_content.show();
	jq_content.css('height','auto');

	//init
	//高さが不確定の要素に対して高さ指定
	jq_content.each(function() {
		$(this).css('height',$(this).height());
		$(this).hide();
	});
	
	jq_button.click(function(e){
		
		e.preventDefault();
		
		var index = jq_button.index(this);
		if(jq_content.eq(index).is(':visible')){ //閉じる
			jq_content.eq(index).slideUp(spd_slidebox_out_val, esg_slidebox_out
			,function(){
				jq_button.eq(index).text(jq_button.eq(index).attr('c'));
			});
       		return false;
	   	} else { //開く

			//全部閉じる
			jq_content.each(function() {
				var each_index =  jq_content.index(this);
				jq_content.eq(each_index).slideUp(spd_slidebox_out_val, esg_slidebox_out
				,function(){
					jq_button.eq(each_index).text(jq_button.eq(each_index).attr('c'));
				});
			});
			
       		jq_content.eq(index).slideDown(spd_slidebox_in_val, esg_slidebox_in
			,function(){
				jq_button.eq(index).text(jq_button.eq(index).attr('o'));
			});
			
			return false;
		}
	});
}







/*a_home_gane*/