/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* setup
----------------------------------------------------------------------*/
$(document).ready(call_blogger_json);　//document.ready


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* global
----------------------------------------------------------------------*/

/* global トップページ blogger jsonp格納用変数
----------------------------------------------------------------------*/
var blogger_json_obj;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* modules
----------------------------------------------------------------------*/

/* modules トップページ blogger jsonpコールバック関数
----------------------------------------------------------------------*/
function get_blogger_json_data(external_obj){
	var html;	
	
	blogger_json_obj = external_obj;

	//html生成
	
	//リスト件数(max4件)
	var n_list = (blogger_json_obj.feed.entry.length < 4 ? blogger_json_obj.feed.entry.length : 4); 

	var html;
	html = '<div class="inner">' + '\n'
	     + '<p><a href="http://breakthroughcampbyimj.blogspot.jp/" target="_blank"><img src="/jp/resources/top/img/bloggerLogo.gif" alt="Blogger" /></a></p>' + '\n'
	     + '<div class="lists">' + '\n';

	for(var i=0; i< n_list; i++) {
		var date = parse_date(blogger_json_obj.feed.entry[i].published.$t);
		html += '<dl>' + '\n';
		if(blogger_json_obj.feed.entry[i].link.length >= 4) {
			html += '<dt>' + date.yy + '.' + date.mm + '.' + date.dd + '  ' + '</dt><dd><a target="_blank" href="' + blogger_json_obj.feed.entry[i].link[4].href + '">' + blogger_json_obj.feed.entry[i].title.$t + '</a></dd>' + '\n';
		} else { //記事が非公開の場合		
			html += '<dt>' + date.yy + '.' + date.mm + '.' + date.dd + '  ' + '</dt><dd>' + blogger_json_obj.feed.entry[i].title.$t + '</dd>' + '\n';
		}	
		html += '</dl>' + '\n';
	}
	
	html += '</div>' + '\n'
	     + '</div>' + '\n';

	$('div.blogger').append(html);


		/* function for this modules
		----------------------------------------------------------------------*/
		
		function parse_date(date_obj){
			var date = {
				yy: date_obj.substring(0, 4),
				mm: date_obj.substring(5, 7),
				dd: date_obj.substring(8, 10)
			};
			return date;
		}

}

/* modules トップページ blogger json呼び出し
----------------------------------------------------------------------*/
function call_blogger_json() {
	var s = document.createElement("script");
	var url = "http://www.blogger.com/feeds/610260228493188926/posts/default?alt=json-in-script&callback=get_blogger_json_data";
	s.type = "text/javascript";
	s.charset = "utf-8";
	s.src = url;
	document.getElementsByTagName('head')[0].appendChild(s);
}

/*a_home_gane*/