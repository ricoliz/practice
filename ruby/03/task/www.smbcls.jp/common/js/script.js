(function(){

	/**
	 * サイト唯一のwindowオブジェクト
	 */

	window.smbc = window.smbc || {};

	window.smbc.ua = (function() {
    return {
      lteIE6:  typeof window.addEventListener === 'undefined' && typeof document.documentElement.style.maxHeight === 'undefined',
      lteIE7:  typeof window.addEventListener === 'undefined' && typeof document.querySelectorAll === 'undefined',
      lteIE8:  typeof window.addEventListener === 'undefined' && typeof document.getElementsByClassName === 'undefined',
      IE:      document.uniqueID,
      Firefox: window.sidebar,
      Opera:   window.opera,
      Webkit:  !document.uniqueID && !window.opera && !window.sidebar && window.localStorage && typeof window.orientation === 'undefined',
      Mobile:  typeof window.orientation != 'undefined'
    }
  }());

  /**
   * utility 引数で設定がいらないものは即時関数
   */
  $window = $(window);

	/**
	 * rollover
	 */
	function rollover(e, s){

		if(!e || !s) return;

		var $element = $(e), selector = s, $selector = $(selector);

		$element.on('mouseover', selector, function(){
			this.src = this.src.replace(/^(.+)(\.[a-z]+)$/, '$1_on$2');
		});

		$element.on('mouseout', selector, function(){
			this.src = this.src.replace(/^(.+)_on(\.[a-z]+)$/, '$1$2');
		});

		$selector.each(function(){
			$('<img>').attr('src', this.src.replace(/^(.+)(\.[a-z]+)$/, '$1_on$2'));
		});

	};

	/**
	 * current
	 */
	function current(rcn){

		var $a = $('#header').find('ul').find('a');
		var length = $a.length,
				removeClassName = rcn;
				pathname = location.pathname,
				flag = false;

		for(var i = 0; i < length; i++){
			var _$a = $a.eq(i), href = _$a.attr('href');
			if(pathname === href || pathname === href + 'index.html'){
				var _$img = _$a.find('img');
				_$img.attr('src', _$img.attr('src').replace(/^(.+)(\.[a-z]+)$/, '$1_in$2')).removeClass(removeClassName);
				flag = true;
			}
		}

		if(!flag){
			for(var i = 0; i < length; i++){
				var _$a = $a.eq(i), href = _$a.attr('href');
				if(href === pathname.slice(0, pathname.indexOf('/', 1) + 1) ){
					var _$img = _$a.find('img');
					_$img.attr('src', _$img.attr('src').replace(/^(.+)(\.[a-z]+)$/, '$1_in$2')).removeClass(removeClassName);
					flag = true;
				}
			}
		}
		
	};

	/**
	 * animation scroll
	 */
	function scroll(e, s, o){

		var $element = $(e), selector = s, $target = $('html, body');
		var options = o || {}, duration = options.duration || 800, easing = options.easing || 'linear';

		$element.on('click', selector, function(){
			$target.animate({
				scrollTop: $(this.hash).offset().top
			}, duration, easing);
			return false;
		});

	};

	/**
	 * align height
	 */
	function alignHeight(e, c){

		var $element = $(e), children = c;

		$element.each(function(i, element){
			var _element = $(this).find(children), length = _element.length, i = 0, maxHeight = 0;
			if(2 > length) return;
			for(; i < length; i++) maxHeight = Math.max(maxHeight, _element.eq(i).height());
			_element.css( 'height', maxHeight );
		});
		
	};

	/**
	 * side nav current
	 * 下のスクリプトより前に実行しないと、下のスクリプトが正常に動作しない
	 */
	(function (){

		var $categoryNav = $('#categoryNav').find('ul');
				$hasChild = $categoryNav.find('.hasChild');
				$a = $categoryNav.find('a');

		var length = $a.length,
				pathname = location.pathname,
				directory = pathname.split('/')[1],
				flag = false,
				array = [];

		if(!$categoryNav.length) return;

		/*
		 * カテゴリーごとにナビを出し分ける
		 */
		// 最初に全部のナビを非表示にする
		for(var i = 0, _length = $hasChild.length; i < _length; i++) $hasChild.eq(i).css('display', 'none');

		// 第一階層のパスを見て、対応したliを表示する
		switch (directory){
			case 'aboutus':
				$hasChild.eq(0).css('display', 'block');
				break;
			case 'program':
				$hasChild.eq(1).css('display', 'block');
				break;
			case 'column':
				$hasChild.eq(2).css('display', 'block');
				break;
			// TODO OPEN後削除
			case 'column2':
				$hasChild.eq(2).css('display', 'block');
				break;
			case 'company':
				$hasChild.eq(3).css('display', 'block');
				break;
			case 'contact':
				$hasChild.eq(4).css('display', 'block');
				break;
		}

		// pathnameとリンク先が一致したら、arrayにpush
		for(var i = 0; i < length; i++){
			var _$a = $a.eq(i), href = _$a.attr('href');
			if(pathname === href || pathname === href + 'index.html'){
				array.push(_$a.parent());
				flag = true;
			}
		}

		if(!flag){
			var reg = new RegExp( pathname.slice(0, pathname.lastIndexOf('/') + 1) );
			for(var i = 0; i < length; i++){
				var _$a = $a.eq(i), href = _$a.attr('href');
				if( reg.test(href) ) array.push(_$a.parent());
			}
		}

		// 配列が2個以上あったら、一個目を削除
		if(array.length >= 2) array.splice(0, 1);

		// 配列が空なら終了
		if(!array.length) return;

		// 配列の先頭にcurrentのクラスを振る
		array[0].addClass('current');

	}());

	/**
	 * side　& contents equal height
	 */
	(function (){

		var $side　= $('#side'),
				$contents = $('#contents'),
				$article = $contents.find('.article');
		var sideHeight = $side.height(),
				contentsHeight = $contents.height(),
				articleHeight = $article.height(),
				differ = sideHeight - contentsHeight;

		if(sideHeight > contentsHeight) $article.css('height', articleHeight + differ);

	}());

	function footerFixed() {

		var $body = $('body'),
				$header = ($('#header').length)? $('#header'): $('#header_en'),
				$container = $('#container'),
				$footerContainer = ($('#footerContainer').length)? $('#footerContainer'): $('#footerContainer_en'),
				pathname = location.pathname;

		$container.css('height', '');

		if ( $window.height() > $body.height() ) {

			if ( pathname === '/' || pathname === '/index.html' || pathname === '/en/' || pathname === '/en/index.html' ) {

				var height = $window.height() - $header.height() - $footerContainer.height() - $('.stage').eq(1).height() - 90 - 25;
				$container.css('height', height);

			} else {

				var height = $window.height() - $header.height() - $footerContainer.height() - 90;
				$container.css('height', height);

			}

		}

	}

	footerFixed();
	$window.on('resize', footerFixed);

	/**
	 * run
	 */
	rollover('body', '.rollover');

	current('rollover');

	scroll('body', '[href^=#]', {
		duration: 1000,
		easing: 'easeInOutQuad'
	});

	alignHeight('.alignGroup', '.align');

}());