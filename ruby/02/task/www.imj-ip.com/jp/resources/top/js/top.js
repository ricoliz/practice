func_after_loaded_webfont = function() {
	set_e_visual_slide();
	set_e_top_carousel();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* modules トップページ メインビジュアルフェードインアウト
----------------------------------------------------------------------*/
function set_e_visual_slide(){

	//jquery object
	var jq_vs_li = $('.visualSlide li');

	//init
	var img_length = jq_vs_li.length;
	for(i=0; i<img_length; i++) {
		jq_vs_li.eq(i).css('z-index', -(i+1));
		if(i>0) jq_vs_li.eq(i).hide();
	}
	
	//timerセット
	var j = 0;
	var timer = window.setInterval(function() {
		
		if(j < img_length-1) {
			jq_vs_li.eq(j).fadeOut(spd_visual_slide_fadeout);
			jq_vs_li.eq(j+1).delay(spd_visual_slide_fadein_delay).fadeIn(spd_visual_slide_fadein);
			j++;
		} else {
			jq_vs_li.eq(j).fadeOut(spd_visual_slide_fadeout);
			jq_vs_li.eq(0).delay(spd_visual_slide_fadein_delay).fadeIn(spd_visual_slide_fadein);
			j=0;
		}
		
	},spd_visual_slide_interval);
}


/* modules トップページ youtubeカルーセル
----------------------------------------------------------------------*/
function set_e_top_carousel(){

	var content_w = 286;
	if(device_type == 'pc' || device_type == 'tb') { var slide_n = 3; } else if(device_type == 'sp') { var slide_n = 1; }

	//jquery object
	var jq_ca_content = $('.carousel .ca_content');
	var jq_ca_content_ul = $('.carousel .ca_content ul');
	var jq_ca_control_next = $('.carousel .ca_control .next');
	var jq_ca_control_prev = $('.carousel .ca_control .prev');
	
	//init
	var length = $('.carousel .ca_content ul li').length;
	jq_ca_content_ul.width(content_w*length);
	var content_h = jq_ca_content_ul.height();
	jq_ca_content.height(content_h);
	jq_ca_control_prev.css('top', content_h/2-25+'px');
	jq_ca_control_next.css('top', content_h/2-25+'px');

	//要素数によって表示制御
	if(length <= slide_n) {
		for(var i=0; i<=length; i++){
			jq_ca_content.width(content_w*i);
		}
		jq_ca_control_next.hide();
		jq_ca_control_prev.hide();
	} else {
		jq_ca_control_prev.hide();
	}
	
	//スライド
	var j = 0;
	jq_ca_control_next.click(function(){
		
		j = j + slide_n;
		
		var left_val = -(j*content_w);
		jq_ca_content_ul.stop(true, false).animate({left: left_val + 'px'},spd_carousel,esg_carousel);
		
		if(j >= (length-slide_n)) {
			jq_ca_control_next.hide();
			jq_ca_control_prev.show();
		} else {
			jq_ca_control_next.show();
			jq_ca_control_prev.show();
		}
		return false;
	});
	jq_ca_control_prev.click(function(){
													
		j = j - slide_n;

		var left_val = -(j*content_w);
		jq_ca_content_ul.stop(true, false).animate({left: left_val + 'px'},spd_carousel,esg_carousel);
		
		if(j <= 0) {
			jq_ca_control_next.show();
			jq_ca_control_prev.hide();
		} else {
			jq_ca_control_next.show();
			jq_ca_control_prev.show();
		}
		return false;
	});
}

/*a_home_gane*/