(function(){

	var $window = $(window), $document = $(document), $body = $('body');

	/*
	 * @placeholder
	 */
	var $input = $('#form').find('input, textarea'),
			length = $input.length;





	function Placeholder(element){
		this.element = element;
		this.initialize();
	}

	var isInput = /^（例）:/;
	var singleByte = ['area', 'city', 'areaCode', 'cityCode', 'subscriberCode'];

	Placeholder.prototype = {

		initialize: function(){
			this.keyword = this.element.val();
			this.className = this.element.attr('class');
			this.focus();
			this.blur();

			var isSingleByte = true;

			
			// 役職は必須ではないので、空 || 例じゃなければgreen
			if ( this.element.attr('name') === 'post' ) {

				if ( !isInput.test(this.keyword) && this.keyword !== '' ) {

					this.element.css({
						'color': '#333',
						'background': '#effbb2'
					});

				}

			}

			/* index_back.htmlの初期表示のための処理 */
			/* （例）： という文字列がはいっていない && 空じゃない → 緑にする */
			if(!isInput.test(this.keyword) && this.keyword !== '' ) {

				this.element.css({
					'color': '#333',
					'background': '#effbb2'
				});

			}

			// 半角数字でヒダイチェックはエラーなのに、inputが緑を防ぐ
			for ( var j = 0, l = singleByte.length; j < l; j++ ) {

				if ( this.element.attr('name') === singleByte[j] ) {

					/* バリデエラー && （例）： という文字列がはいっていない */
					if ( !/^[0-9]+$/.test(this.keyword) && !isInput.test(this.keyword) ) {
						this.element.css({
							'color': 'gray',
							'background': '#faebe6'
						});
					}

				}

			}

			//php validation > /^([a-z0-9_]|\\-|\\.)+@(([a-z0-9_]|\\-)+\\.)+[a-z]{2,4}$/
			if( this.element.attr('name') === 'mail' ) {

				if ( !/[\w\d_-]+@[\w\d_-]+\.[\w\d._-]/.test(this.keyword) && !isInput.test(this.keyword) ) {

					this.element.css({
						'color': 'gray',
						'background': '#faebe6'
					});

				}

			}
			

		},

		focus: function(){
			var _this = this;
			this.element.focus(function(){
				_this.element.css('color', '#333');
				if(this.value === _this.keyword && isInput.test(_this.keyword)) $(this).val('').removeClass('error').addClass('active');
				else $(this).removeClass('error').addClass('active');
			});
		},

		blur: function(){
			var _this = this;
			this.element.blur(function(){
				_this.element.removeClass('active').css('backgroundColor', '');
				if(this.value === '' && isInput.test(_this.keyword)) $(this).val(_this.keyword).css('color', '#808080');
				if(/error/.test(_this.className) && (this.value === '' || this.value === _this.keyword)) $(this).addClass('error');
				if(this.value !== '' && !isInput.test(this.value)) $(this).css('backgroundColor', '#effbb2');
			});
		}

	}

	for(var i = 0; i < length; i++) new Placeholder($input.eq(i));
	//for(var i = 0; i < 1; i++) new Placeholder($input.eq(i));


	/*
   * @check
   */
	var $transmission = $('#transmission'),
			$checkContainer = $transmission.find('#checkContainer');

	$checkContainer.html([
		'<p class="mb15 fz12">「プライバシーポリシーに同意する」にチェックの上お進みください。</p>',
    '<div class="mod_block_01 mb30">',
			'<p><input type="checkbox" id="check" /><label for="check">プライバシーポリシーに同意する</label></p>',
		'</div>',
		'<p id="button"><img src="/contact/img/btn_01_dis.gif" alt="" width="210" height="61" /></p>'
	].join(''));

	var $check = $transmission.find('#check'),
			$button = $transmission.find('#button');
	var html = (function(){
		return {
			enable: '<input type="image" src="/contact/img/btn_01.gif" alt="内容を確認する" class="rollover" />',
			disabled: '<img src="/contact/img/btn_01_dis.gif" alt="内容を確認する" width="210" height="61" />'
		}	
	}());

	$check.on('click', function(){
		if(this.checked) $button.html(html.enable);
		else $button.html(html.disabled);
	});

}());