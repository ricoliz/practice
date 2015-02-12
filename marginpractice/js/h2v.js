/* h2v.js version 3.5.0
    last modified at Nov 16 2014
    (c)tyz@freefielder.jp 
    For detail , please visit http://tategaki.info/h2v/
		Contact : tyz@freefielder.jp
    ** Don't remove this copyright message **
*/

var h2vconvert = {
	version : '3.5.0',
	target : {},

	/* default value */
	defaultval : { 'auto' : true ,
						'chars' : 25 ,
						'fontsize' : '16px' ,
						'lineInterval' : 0.4 ,
						'rotate' : true ,
						'bar' : true , 
						'barForeColor' : '#999' ,
						'barBackColor' : '#eee' ,
						'showcredit' : true ,
						'multiCols' : true ,
						'splash' : true ,
						'fontSet' : 'gothic'
						 } ,

	fontSet : {
		gothic : "'ヒラギノ角ゴ ProN','Hiragino Kaku Gothic ProN','ヒラギノ角ゴ Pro','Hiragino Kaku Gothic Pro','メイリオ','Meiryo','ＭＳ ゴシック','MS Gothic','SimHei','HiraKakuProN-W3','STHeitiJ-Medium','TakaoExゴシック','TakaoExGothic','MotoyaLCedar','Droid Sans Japanese','Droid Sans Fallback',monospace" ,
		mincho : "'ヒラギノ明朝 ProN','Hiragino Mincho ProN','ヒラギノ明朝 Pro','Hiragino Mincho Pro','ＭＳ 明朝','MS Mincho','SimSun','HiraMinProN-W3','STHeitiJ-Medium','TakaoEx明朝','TakaoExMincho','MotoyaLCedar','Droid Sans Japanese','Droid Sans Fallback',monospace"
		},
	tmpdiv : null ,
	styleSet : false ,

	/* browser flags */
	envs : {
		ua : '' ,
		isOld : false ,
		isIE8 : false,
		isIE : false },

	/* functions */
	init : function( params ){
		var hc = h2vconvert,
			ua = hc.envs.ua;

		if( hc.envs.isOld ){
			for( id in params ){ 
					if( window.addEventListener){
							(function(id){window.addEventListener("load",
																	function(){hc.addErrBar(id,'最新のブラウザでは縦書きで閲覧できます')},false);})(id);
					}else{
							(function(id){window.attachEvent("onload",
																	function(){hc.addErrBar(id,'最新のブラウザでは縦書きで閲覧できます')});})(id);
					}						
			}
			return false;
		}

		if(document.addEventListener ){
			if( !/safari/.test(ua)){ 
				document.addEventListener("DOMContentLoaded",
															function(){ hc.startConvert( params )} ,
																false);
			}else{
				window.addEventListener( 'load' ,
															function(){ hc.startConvert( params ) } ,
															false );
			}
		}else if(/msie/.test(ua)){
			try{
				document.documentElement.doScroll("left");
			}catch(err){
				setTimeout(function(){ hc.init( params )}, 0);
				return;
			}
			hc.startConvert( params );
		}else{
			window.onload = function(){ hc.startConvert( params ); };
		}
	},

	startConvert : function( params ){
		var hc = h2vconvert;
		if( !hc.styleSet && hc.envs.isIE ) h2v_ie.setStyleSheet();

		hc.styleSet = true ;

		var id;

		for( id in params ){
			if( tyz.getById( id ) ) hc.target[id] = new hc.h2v( params , id );
		}
	
		for( id in params ){
			if( tyz.getById( id ) ){
				/* 3.5.0 */
				try{
					hc.ruby_enabler( id );
				}catch(err){
					hc.onErr(tyz.getById(id),hc.target[id]);
				}
				hc.target[id].org = tyz.getById( id ).cloneNode( true )
			}
		}

		for( id in params ){
			if( !tyz.getById( id ) )continue;
			var tgt = hc.target[id],
				dest = tyz.getById( id );
			if( tgt.auto && !tyz.getByClass( dest , 'h2v' ).length ){
				if( tgt.splash ) hc.showSplash(id);
				(function( id , dest , tgt ){
						setTimeout( function(){
						try{
							hc.convert( id );
						}catch( err ){
							hc.onErr( dest , tgt );
						}
						if( tgt.splash ) hc.hideSplash(id);
						} , 1 ) ; } )( id , dest , tgt );
			}else{ 
				if( tgt.bar ){ hc.addBar( tgt.id , '<span onclick="h2vconvert.switcher( \'' + id + '\');">横→縦切替</span>' );}
				dest.style.visibility = 'visible' ;
			}
		}
	} ,

	convert : function( id ){
		var hc = h2vconvert,
			tgt = hc.target[id],
			dest = tyz.getById( id ),
			i,j;

		if( tgt.converted == '' ){		//未変換なら変換。
			tyz.setStyles( dest , { 'fontFamily' : tgt.fontSet , 'fontSize' : tgt.fontsize } );
			if( tyz.getById( 'b'+id ) )tyz.getById( 'b'+id ).parentNode.removeChild( tyz.getById( 'b' + id ) );

			// script / style tags
			var extTags,extern=['SCRIPT','STYLE'];
			for( i = 0 ; i < extern.length ; i++ ){
				extTags = tyz.getByTag( dest , extern[i] );
				for( j = extTags.length-1 ; j >= 0 ; j-- ){
					dest.parentNode.appendChild( extTags[j] );
				}
			}

			var po = tyz.getByTag( dest , 'PRE' ),
					pc = [];
			for( i = 0 ; i < po.length ; i++ ){
				pc[i] = po[i].cloneNode( true );
			}
			/* 3.5.0 */
			dest.innerHTML = dest.innerHTML.replace( /[\f\n\r\t\v\u0020\u00A0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u2028\u2029\u202f\u205f]+/g , ' ' );		
			/*--3.5.0*/	
			po = tyz.getByTag( dest , 'PRE' );
			for( i= 0 ; i < po.length ; i++){
				po[i].parentNode.replaceChild( pc[i] , po[i] );
			}

			// replace center tags to p tags
			var centers = tyz.getByTag( dest , 'CENTER' ),dcenter;
			for( i = centers.length-1 ; i >=0 ; i--){
				dcenter = tyz.newEle( 'P' , {} , { 'textAlign' : 'center' } );
				dcenter.appendChild( hc.extractNodeContents( centers[i] ) ); 
				centers[i].parentNode.replaceChild( dcenter , centers[i] );
			}

			dest.normalize();
			tgt.html = hc.extractNodeContents( dest );

			var lineH = tgt.chars * tgt.fsPX ;
			hc.tmpdiv = hc.createTmpdiv( id );
			hc.tmpdiv.style.height = lineH + 'px' ;

			var lines = hc.separateLines( id , tgt.html , tgt.fsPX , lineH,0 );
			var tate_area = tyz.newEle( 'DIV' , {} , { 'position':'absolute','left':'0' } );
			for( i = 0 ; i < lines.length ; i++ ){
				tate_area.appendChild( lines[i] );
			}
			tgt.converted = tate_area.cloneNode( true );	// backup
		}else{
			var tate_area = tgt.converted.cloneNode( true );
			var lineH = tgt.chars * tgt.fsPX ;
			hc.tmpdiv = hc.createTmpdiv( id );
		}

		var cols = [] ;
		if( !tgt.multiCols ){
			cols[0] = hc.oneCol( id , tate_area ,lineH*1 + tgt.fsPX*1 );
		}else{
			cols = hc.separateCols( id , tate_area ,lineH*1 + tgt.fsPX*1 ); 
		}

		dest.innerHTML = '' ;
		var tateDiv;
		if( tgt.multiCols ){
			tateDiv = tyz.newEle( 'DIV' , { 'class' : 'h2v' } , { 'fontSize' : tgt.fontsize  });
		}else{
			tateDiv = tyz.newEle( 'DIV' , { 'class' : 'h2v' } , { 'fontSize' : tgt.fontsize ,'direction':'rtl' });
		}
		if( tgt.bar )hc.addBar( tgt.id , '<span onclick="h2vconvert.switcher( \'' + id + '\');">縦→横切替</span>');

		for( i = 0 ; i < cols.length ; i++ ){
			tateDiv.appendChild( cols[i] );
			if( i != cols.length-1 )tateDiv.appendChild( tyz.newEle( 'DIV' , { 'class' : 'h2v_separator' } ) );
		}

		if( tgt.showcredit ){
			var rec = tyz.newEle( 'DIV' , { 'class' : 'h2v_bar' } , { 'marginTop' : '10px' , 'color' : tgt.barForeColor , 'backgroundColor' : tgt.barBackColor } );
			rec.innerHTML = '<a href="http://tategaki.info/h2v/" target="_blank">h2v.js '+ hc.version +'</a>'
			tateDiv.appendChild( rec );
		}

		tgt.cols = tateDiv.cloneNode( true ); //backup
		dest.appendChild( tateDiv );

		dest.appendChild( tyz.newEle( 'DIV' , { 'class' : 'h2v_clearfix' } ) ) ;
		hc.removeTmpdiv(id );
		if( dest.style.visibility!='visible')dest.style.visibility = 'visible';
	},

	separateLines : function( id , basenode , baseFont , maxHeight ,spacing ){
		/* Modified at Jul 2013. ver 3.3.0. */
		var lines = [],
			df,
			tate_line,
			hc = h2vconvert,
			tgt = hc.target[id];

		tgt.mL = 0;
		tgt.mR = 0;

		var mH = maxHeight;

		if(tgt.flt)mH=maxHeight-tgt.fH;

		while( df = hc.seekNodes( id , basenode , baseFont , mH ,spacing ,true) ){/*3.5.0*/
			if( hc.isDispBlock( df ,id)=='b' || hc.isList( df ) || hc.isThru( df )){ /* here */

				if( df.className=='h2v_imgFloat_clear'){
					while(tgt.fW> 0){
						var w = tyz.round(tgt.lineSpace*2+baseFont,2);
						lines[lines.length] = tyz.newEle( 'SPAN' , { 'class' : 'h2v_e' } ,
															 { 'marginLeft' : tgt.lineSpace+'px' , 'marginRight' : tgt.lineSpace +'px','width':baseFont+'px'});
						tgt.fW-=w;
					}
					tgt.flt=false;
					mH = maxHeight;
				}

				if( hc.getDispS( df , ['display'] , false , id ).display == 'none' ){
					lines[lines.length] = tyz.newEle( 'DIV' );
					lines[lines.length-1].appendChild( hc.extractRange( basenode, df ));
				}else{
					if( tgt.flt ){
						tgt.fW-=(tyz.PX(df.style.paddingLeft)+tyz.PX(df.style.padingRight)+tyz.PX(df.style.marginLeft)+tyz.PX(df.style.marginRight)+tyz.PX(df.style.width));
					}
					lines[lines.length]=hc.extractRange( basenode , df );
					
				}
			}else if( tgt.flt && tgt.floatCount==0){
				tgt.mL+=tgt.lineSpace;
				tgt.mR+=tgt.lineSpace;
				lines[lines.length] = tyz.newEle( 'SPAN' , { 'class' : 'h2v_imgFloat' },{'marginRight':Math.round(tgt.fW)+'px','marginLeft':'-'+Math.round(tgt.fW)+'px'} );
				if(tgt.flt=='right'){lines[lines.length-1].style.marginTop=mH-tgt.fH+2+'px';}
				lines[lines.length-1].appendChild( hc.extractRange(basenode,df ));
			}else{
				addLine();

				tate_line.appendChild( hc.extractRange( basenode, df  ) );
				lines[lines.length] = hc.setTextAlign( tate_line,mH,tgt,baseFont,0);
				if( basenode.hasChildNodes() ){
					var bfc = basenode.firstChild ;
					if( ( hc.isInline( bfc ) || bfc.nodeName== 'SPAN') ){
							if( bfc.innerHTML == ''||bfc.innerHTML==' ' )basenode.removeChild( bfc );
					}
				}
			}
			
			tgt.mL = 0;
			tgt.mR = 0;
			tgt.cH = 0;

			if( tgt.fW >0 ){
				mH = maxHeight - tgt.fH;
				tgt.floatCount++;
			}else{
				mH=maxHeight;
			}
			tgt.okuri=null;
		}

		/*3.5.0*/
		if( basenode.hasChildNodes() ){
			if( !(basenode.childNodes.length == 1 && basenode.firstChild.nodeName == '#text' && basenode.firstChild.nodeValue == '')){
			addLine();
			tate_line.appendChild( hc.extractNodeContents( basenode ) );
			lines[lines.length] = hc.setTextAlign( tate_line,mH,tgt,baseFont,4);}
		}

		return lines;

		function addLine(){
			tgt.mL+=tgt.lineSpace;
			tgt.mR+=tgt.lineSpace;
			tate_line = tyz.newEle( 'SPAN' , { 'class' : 'h2v_e' } ,
															 { 'marginLeft' : tyz.round(tgt.mL,2)+'px' , 'marginRight' : tyz.round(tgt.mR,2) +'px','width':baseFont+'px' }); 

			if( tgt.flt ){
				if( tgt.floatCount != 0 && tgt.flt=='left')tate_line.style.marginTop = tgt.fH+2+'px';//この行は余白がいる
				tgt.fW-=(baseFont+tgt.mL+tgt.mR );
				if( tgt.fW < 0 ){
					tgt.flt = false;
					tgt.floatCount = 0;
				}
			}
		}

	} ,

	/* ver 3.3.0. 'setTextAlign' was moved from Local Function to here. */
	setTextAlign : function( line , mH , tgt ,baseFont, jfc){
		var line_p,mgn,hc=h2vconvert;
		if( line.hasChildNodes() && line.lastChild.nodeName == 'BR' ){
			jfc=4;
			if(line.childNodes.length != 1)line.removeChild( line.lastChild );
		}
		
		switch( tgt.tAlign+jfc ){
			case 0: case 4: case 7:return line;
		}
		
		line_p = tyz.newEle( 'DIV' , {} , { 'fontSize' : baseFont + 'px' } );
		line_p.appendChild( line );
		hc.tmpdiv.appendChild( line_p );
		var d ,s=0,t=0,c,l,e,eh=0,sh=0;
		
		if( tgt.tAlign == 3 ){//justify処理
			if( (d=mH-line.offsetHeight) > 0 ){
				c=line.childNodes;
				for( l=0;l<c.length;l++){
					e=c[l];
					switch(e.nodeName){
						case '#text':
							t+=e.nodeValue.length;
							break;
						case 'SPAN':
						case'RUBY':case'FONT':case'STRONG':case'BIG':case'SMALL':case'I':case'B':case'EM':case'A':
							s++;
							break;
					}
				}
				if( (eh = hc.getExtraHeight(d,t))>0 ){
					line.style.lineHeight = baseFont+eh+'px';
				}
				d-=((t)*eh);

				if(s>0 && (sh = Math.round(d/s)) != 0){
					for(l=0;l<c.length;l++){
						e=c[l];
						switch(e.nodeName){
							case 'SPAN':
							case'RUBY':case'FONT':case'STRONG':case'BIG':case'SMALL':case'I':case'B':case'EM':case'A':
								e.style.marginBottom = tyz.PX(e.style.marginBottom)+sh+'px';
								break;
						}
					}
				}
			}
		}else{	//right || center 処理
			line.style.marginTop = tyz.PX(line.style.marginTop) + (( mH - line.offsetHeight ) / tgt.tAlign) + 'px' ;			
		}
		
		hc.tmpdiv.removeChild( line_p );
		return line;
	},

	getExtraHeight : function( d, t ){
		if(t==0)return 0;
		return tyz.round( (d/t) , 2 );
	},
	getExtraHeight_webkit : function( d, t){
		if(t==0)return 0;
		return Math.floor( d / t );
	},

	Okuri : function( o ,kutoCount){ // Modified at July 2013 ver 3.2.1
		if( !o )return null;
		if( o.nodeName == '#document-fragment' )return null;
		var oN,tmp,oC;
		oN = o.nodeName ;
		switch(oN){
			case '#text' :
				if( o.length == 0 )return this.Okuri(o.previousSibling , kutoCount );
				if( o.length == 1 )return o;
				tmp = o.splitText( o.length-1 );
				return o;

			case 'SPAN' :
				oC = tyz.getAttr(o,'class');
				if( /h2v_kuto|h2v_kakko_b|h2v_tcy/.test(oC) ){
					kutoCount++;
					if( kutoCount >= 3 )return null;
					return this.Okuri( o.previousSibling||o.parentNode.previousSibling , kutoCount );
				}
				if( /h2v_sp|h2v_cho|h2v_komoji/.test(oC))return o.previousSibling||this.addBlank(o);
				if( /h2v_alpha/.test(oC)){
						if( /okurare/.test(oC) ){
							kutoCount++;
							if( kutoCount >= 3 )return o;
							return this.Okuri( o.previousSibling||o.parentNode.previousSibling,kutoCount);
						}
						return null;
				}
				//それ以外ならば
				return this.Okuri(o.lastChild , kutoCount )||o.lastChild||this.addBlank(o);

			case 'FONT': case 'STRONG': case 'BIG': case 'SMALL': case 'I': case 'B': case 'EM': case 'SUB': case'SUP': case'A': case'MARK': case'TIME': case'METER': case'S': case'CITE': case'Q': case'DFN': case'ABBR': case'CODE': case'VAR': case'SAMP': case'KBD':
				return this.Okuri(o.lastChild , kutoCount )||o.lastChild||this.addBlank(o);

			case 'RUBY' :
				oC = tyz.getAttr(o,'class');
				if( /okurare/.test(oC) ){
					kutoCount++;
					if( kutoCount >= 3 )return o;
					return this.Okuri( o.previousSibling||o.parentNode.previousSibling,kutoCount);
				}
				return null;
		}
		return null;
	},

	addBlank : function(node){
		var tt = document.createTextNode('');
		node.parentNode.insertBefore( tt , node );
		return tt;
	},

	seekNodes : function( id , node , baseFont , maxHeight ,spacing , ws){/*3.5.0*/
		var	cn=node.firstChild, nodename,
				hc = h2vconvert,
				tgt = hc.target[id],
				i,
				chbk=0,nodeheight=0,extraheight=0;
		for( i = 0 ; i < node.childNodes.length ; i++ ){
			cn = node.childNodes[i];
			nodename = cn.nodeName;
			if( nodename == 'SPAN' )nodename = hc.getSpanFlag(cn);

			var tmp;
			
			if( i==0 && ws && nodename == '#text'){ cn.nodeValue = cn.nodeValue.replace(/^ /,'');if(cn.nodeValue.length==0)continue;ws=true;}/*3.5.0*/

			if( nodename == '#text' && !( hc.span_match( node , /h2v_/ ) ) && cn.nodeValue != '' ){
				ws=false;/*3.5.0*/
				hc.addVTags( cn );
				cn=node.childNodes[i];
				nodename = cn.nodeName;
				if( nodename == 'SPAN' )nodename = hc.getSpanFlag(cn);
			}

			switch(nodename){
				case '#text' :
					nodeheight = (baseFont+spacing*1) * cn.length; /* 3.4.0 */
					if( nodeheight == 0 )break;
					extraheight = maxHeight - tgt.cH ; 
					if( extraheight <= 0 )extraheight = 0;
					tgt.cH+=nodeheight;

					if( tyz.ceil( extraheight , 2 ) <= tyz.floor( nodeheight , 2 ) ){
						var el = Math.floor( extraheight / (baseFont+spacing*1)) ;
						if( el == 0 ){			// 入らない。
							return tgt.okuri || cn.previousSibling || hc.addBlank(cn);
						}else if( el < cn.length ){  //一部はみ出る
							tmp = cn.splitText( el );
							return cn;
						}
					}
					break;

				case 1 : /*h2v_kuto , h2v_kakko_b ぶら下がり*/
				case 5: /* h2v_tcy */
					if( tgt.okuri)return tgt.okuri;
					if( (maxHeight-(tgt.cH-baseFont))/baseFont <1 ){
						tgt.okuri = hc.Okuri(cn.previousSibling , 0)||cn.previousSibling||hc.addBlank(cn);
					}
					tgt.cH+= baseFont+spacing ;
					cn.style.lineHeight = baseFont+spacing+'px';
					break;

				case 2 : /*・h2v_kakko_t	送り出し*/
					tgt.cH +=baseFont+spacing ;
					cn.style.lineHeight = baseFont+spacing+'px';
					cn.style.marginBottom = spacing/2 +'px';
					if( maxHeight-tgt.cH <=1)return tgt.okuri||cn.previousSibling ||hc.addBlank(cn);
					break;

				case 3 :/* h2v_komoji, h2v_rotate*//*3.4.0*/
					if( spacing != 0 ){
						tyz.setStyles( cn,{ lineHeight:baseFont+spacing+'px',marginBottom:0});
						if(hc.envs.isIE8){ tyz.setStyles( cn , { 'marginTop':spacing/2+'px',marginBottom:spacing/2+'px',lineHeight:'1em'});}
					}
					tgt.cH +=baseFont+spacing ;
					if( maxHeight-tgt.cH <0)return tgt.okuri||cn.previousSibling|| hc.addBlank(cn) ;
					break;
				case 10:/*h2v_cho */ /*3.4.0*/
					tgt.cH +=baseFont+spacing ;
					if( maxHeight-tgt.cH <0)return tgt.okuri||cn.previousSibling|| hc.addBlank(cn) ;
					tyz.setStyles( cn , { marginTop:spacing/2+'px',marginBottom:spacing/2+'px'});
					break;

				case 4 : /* ・h2v_sp*/ /* Modified at July 2013 ver 3.2.1 */
					
					var nodeheight = tyz.PX( hc.getDispS( cn , ['width'] ,true , id , false ).width) ;
					tyz.setStyles( cn , { letterSpacing:0+'px',lineHeight:'1em'});
					tgt.cH+=nodeheight+spacing;
					if( !cn['done_h2v'] )tyz.setStyles( cn, { 'width':nodeheight+'px','marginBottom' : Math.ceil(nodeheight - baseFont-spacing/2)+'px' } );

					if( maxHeight - tgt.cH < 0 ){			//はみ出している
						if( cn['done_h2v'] )return cn;
						if( cn.previousSibling ){
							cn['done_h2v']=true;
							return cn.previousSibling;
						}else　if( hc.isList(node)||node.nodeName=='SPAN' ){
							cn['done_h2v']=true;
							return hc.addBlank(cn);
						}
					}
					if( nodeheight <= baseFont ){cn.className= "okurare "+cn.className;}

					break;

				case 6 : /*h2v_alpha*/
					var origLS = hc.getLS( cn , id );
					var nodeheight = tyz.PX( hc.getDispS( cn , ['width'] ,true , id , false ).width) ;
					tyz.setStyles( cn , { letterSpacing:origLS+'px',lineHeight:'1em'});
					tgt.cH+=nodeheight;
					if( !cn['done_h2v'] )tyz.setStyles( cn, { 'width':nodeheight+'px','marginBottom' : Math.ceil(nodeheight - baseFont-spacing/2)+'px','marginTop': spacing/2 + 'px' } );

					if( maxHeight - tgt.cH < 0 ){			//はみ出している
						if( cn['done_h2v'] )return cn;
						if( cn.previousSibling ){
							cn['done_h2v']=true;
							return cn.previousSibling;
						}else　if( hc.isList(node)||node.nodeName=='SPAN' ){
							cn['done_h2v']=true;
							return hc.addBlank(cn);
						}
					}
					if( nodeheight <= baseFont ){cn.className= "okurare "+cn.className;}

					break;

				case 7:
				case 'RB': /*case 'RT': case 'RTC':*/ case 'RBC':/*3.4.0*/
					chbk = tgt.cH ;
					cn.style.lineHeight = baseFont + spacing + 'px';
					hc.seekNodes( id , cn , baseFont , 1000 ,spacing,false) ;/*3.5.0*/
					tgt.cH = chbk;
					if( cn.style.MozTransform )cn.style.MozTransform = null ;
					break;
					
				case 9: case'RT': case 'RTC':/*3.4.0*/
					chbk = tgt.cH ;
					hc.seekNodes( id , cn , baseFont , 1000 ,0,false) ;/*3.5.0*/
					tgt.cH = chbk;
					if( cn.style.MozTransform )cn.style.MozTransform = null ;
					break;
					

				case 0: case 8:/* 他 */
				case'FONT':case'STRONG':case'BIG':case'SMALL':case'I':case'B':case'EM':case'SUB':case'SUP':
				case'A':case'MARK':case'TIME':case'METER':case'S':case'CITE':case'Q':case'DFN':case'ABBR':
				case'CODE':case'VAR':case'SAMP':case'KBD':

				case'DIV':case'P':case'BLOCKQUOTE':
				case'UL':case'OL':case'DL':case'LI':case'DT':case'DD':
				case'H1':case'H2':case'H3':case'H4':case'H5':case'H6':
				case'ADDRESS':case'ARTICLE':case'ASIDE':case'FOOTER':case'HEADER':case'HGROUP':case'NAV':case'DETAILS':case'SECTION':case'SUMMARY':				
				
				var bflag= hc.isDispBlock(cn , id),
					vs =  hc.getLS( cn ,id),
							newProp,
							ds,
							fs,
							lsp,
							cnp= cn.parentNode,
							mh; /* 3.4.0 */		
											
				var lsp=0,cnp= cn.parentNode;
				if(cnp  && cnp.nodeName!='#document-fragment'){lsp = hc.getLS(cn.parentNode,id)}/* 3.4.0 */

				switch( bflag ){
					case 'i':
					/* inline here ------ */
						if( tgt.okuri && maxHeight-tgt.cH < 0 )return tgt.okuri;
						newProp = hc.getNewProp( cn ,vs , lsp, id ,true),
						ds = newProp.ds;
						fs = tyz.PX( ds.fontSize ); 
						
						newProp.s['marginLeft'] = (-fs - tyz.PX(ds.paddingTop) - tyz.PX(ds.paddingBottom)-tyz.PX(ds.borderTopWidth) - tyz.PX(ds.borderBottomWidth))/2 + 'px' ;

						if(nodename==8)newProp.s.marginLeft=(tyz.PX(newProp.s.marginLeft)-(-tyz.PX(ds.borderTopWidth)/2))+'px';

						mh = maxHeight - tyz.PX( ds.marginLeft)- tyz.PX( ds.paddingLeft ) -tyz.PX( ds.borderLeftWidth ) ;
						if( mh <= 0 )mh = fs;

						hc.setLineMargin( id , fs , ds );

						var df = hc.seekNodes( id , cn , fs , mh ,vs,ws) ; /* 3.5.0 */
						ws=false;
						if( df ) {
							var clonecn = cn.cloneNode( false ),
								excn = hc.extractRange( cn , df );
							clonecn.appendChild( excn );
							tyz.setStyles(clonecn,newProp.s);
							clonecn['done_h2v'] = true;
							tyz.setStyles( clonecn , { 'marginBottom' : 0 , 'paddingBottom':0 ,'borderBottomWidth':0} );
							tyz.setStyles( cn , { 'marginLeft':0,'paddingLeft':0,'borderLeftWidth':0});
							cn.parentNode.insertBefore(clonecn,cn );
							return clonecn;
						}

						tgt.cH+=newProp.xm*1;
						if(!cn.done_h2v){newProp.s['width']='1em';tyz.setStyles( cn , newProp.s );}
						cn['done_h2v']=true;
						if( cn.previousSibling ){
							if( cn.previousSibling.nodeType != 3)cn.style.marginTop = -spacing/2 + 'px';
						}
						if( cn.nextSibling ){cn.style.marginBottom = -spacing/2+'px';

						}
						break;
						/* ------ inline */

					case 'b':
					default:
						/* block here-------*/
						if( tgt.fW > 0 ){
							var cssClear = tyz.getStyle(cn,'clear') || hc.getDispS( cn , ['clear'] , false , id );
							if( cssClear && cssClear!='none'){
								return imgFloat_clear();
							}
						}
						newProp = hc.getNewProp( cn ,vs,0, id );
						ds = newProp.ds;
						fs = tyz.PX( ds.fontSize ); 
						
						if( ds.position != 'static' )cn.style.position = 'static' ;

						/* Modified at Jul 2013. ver 3.3.0. to fix a bug about text-align style inheritance. */
						var curTAlign = tgt.tAlign;
						switch(ds.textAlign ){
							case 'justify' : 
								tgt.tAlign = 3 ;
								break;
							case 'center' :
								tgt.tAlign = 2;
								break;
							case 'right' :
								tgt.tAlign = 1;
								break;
							case 'left' : 
							default:
								tgt.tAlign = 0;
								break;
						}

						var ow = tyz.PX( ds.width ),
							oh = tyz.PX( ds.height ) ;

						maxHeight = ow == 0 ? maxHeight : ow ;
						newProp.xm = ow == 0 ? newProp.xm : 0 ;

						mh = maxHeight - newProp.xm ;
						if( mh <= 0 ) mh = fs;

						hc.setLineMargin( id , fs );

						var lines = hc.separateLines( id , cn , fs , mh ,vs);

						tyz.setStyles( cn , newProp.s );
						if( hc.isInline(cn) || cn.nodeName =='SPAN' ) tyz.setStyles( cn,{ 'cssFloat' : 'right'}); /* 3.4.0 */

						cn.style.width = oh == 0 ? 'auto' : oh + 'px' ;
						if( ow == 0 ){
							cn.style.height = 'auto' ;
						}else{
							cn.style.height = null;
							cn.style.minHeight = ow + 'px' ;
						}

						for( var u=0 ; u< lines.length ; u++ ){
							cn.appendChild( lines[u] );
						}

						if( nodename == 'LI' ){
							var mark = tyz.newEle('SPAN' , {'class' : 'h2v_mark'} );
							mark.appendChild( document.createTextNode( '・' ) ) ;
							cn.children[0].insertBefore( mark , cn.children[0].firstChild );
						}

						tgt.tAlign = curTAlign;
						return cn ;
						break; // list , block
					/* block -------- */
				}
				break;
				

				case'PRE':case'IFRAME':case'TABLE':case'TEXTAREA':
				case'FORM':case'AUDIO':case'CANVAS':case'EMBED':case'FIGURE':case'VIDEO':case'MENU':case'OBJECT':case'MAP':
					var ds = hc.getDispS( cn , ['width','marginTop','marginBottom','marginLeft','marginRight','paddingLeft','paddingRight','borderLeftWidth','borderRightWidth'],true , id , true),
						newMargin = tyz.PX(ds.marginLeft)+'px '+tyz.PX(ds.marginTop)+'px '+ tyz.PX(ds.marginRight)+'px '+tyz.PX( ds.marginBottom )+'px';
					tyz.setStyles( cn , { 'margin' : newMargin, 'paddingLeft':tyz.PX(ds.paddingLeft)+'px', 'paddingRight':tyz.PX(ds.paddingRight)+'px', 'borderLeftWidth':tyz.PX(ds.borderLeftWidth)+'px', 'borderRightWidth':tyz.PX(ds.borderRightWidth)+'px', 'width':tyz.PX(ds.width)+'px','maxWidth':tyz.PX(ds.width)+'px'} );

					if( tgt.flt=='left' && tgt.fW > 0 ){
						tyz.setStyles(cn , {'paddingTop':tgt.fH+'px'});
					}

					return cn;
					break;

				case 'RUBY' :
					if( cn.done_h2v ){
						delete cn.done_h2v;
						cn.style.lineHeight = baseFont + spacing + 'px';
						var rH = (hc.envs.isIE8)? tyz.PX(cn.style.height) : tyz.PX( hc.getDispS( cn , ['height'] , true , id ).height ),
							mr = tyz.floor( baseFont*0.7,2 );
						tgt.cH +=rH;
						if( tgt.mR-mr < 0 ){tgt.mR = mr - baseFont*( tgt.lineInterval/2 )}
						if( maxHeight - tgt.cH < 0 ){			//はみ出している
							if(maxHeight - rH > 0 )return cn.previousSibling||hc.addBlank(cn);  //自分は行の高さより短い
							return cn;
						}
						break;
					}
					cn = this.ruby_to_html4_style( cn );
					chbk = tgt.cH ;
					hc.seekNodes( id , cn , baseFont , 1000 ,spacing,false) ; /* 3.5.0 */
					tgt.cH = chbk;
					var rH,rW,rb,rbH,rt,rtH,H,nH =0 , rl,
						rbc,rtc;

					tyz.setStyles( cn , { fontSize:baseFont+'px',lineHeight:baseFont+spacing+'px'});
					var tmp_e = tyz.newEle( 'SPAN' , { 'class' : 'h2v_e' } );
					var ccn = cn.cloneNode( true );
					var topFlag = false;
					tmp_e.appendChild( ccn );
					hc.tmpdiv.appendChild( tmp_e );
					rH = ccn.offsetHeight;
					rW = ccn.offsetWidth;
					rbc = tyz.getByTag( ccn , 'RBC' );
							rb =  tyz.getByTag( ccn , 'RB' );
							if(tyz.getByTag(ccn,'RT')){tyz.getByTag(ccn,'RT')[0].style.display = 'none'; /* here */}
							rbH = rb[0].offsetHeight;
							if(tyz.getByTag(ccn,'RT')){tyz.getByTag(ccn,'RT')[0].style.display =  'table-cell'; /* here */}
						if( rH-rbH > 0 ){
							rb[0].style.lineHeight = Math.floor( rH*baseFont /rbH ) + 'px' ;
							topFlag = true;
						}

					hc.tmpdiv.removeChild( tmp_e );
					cn.style.height = rH+'px';
					
					if(topFlag){cn.style.marginTop = spacing/2+'px'; /* here */}

					if( cn.nextSibling && cn.nextSibling.nodeType !=3 )cn.style.marginBottom = spacing/2 + 'px';

					rH = rH-nH > 0 ? rH : nH ;
					tgt.cH+=rH;

					if( maxHeight - tgt.cH < 0 ){			//はみ出している
						if( cn.previousSibling ){
							cn['done_h2v']=true;
							return cn.previousSibling;
						}else　if( hc.isList(node)||node.nodeName=='SPAN' ){
							cn['done_h2v']=true;
							return hc.addBlank(cn);
						}
					}

					if( rH <= baseFont ){cn.className= "okurare "+cn.className;}

					cn['done_h2v']=true;
					var mr = ( rW - baseFont );
					if( tgt.mR-mr < 0 )tgt.mR = mr - baseFont*( tgt.lineInterval/2 );
					break;

				case 'IMG' :
					var ds = hc.getDispS( cn , ['width','height','marginLeft','marginRight','paddingLeft','paddingRight','paddingTop','paddingBottom', 'borderLeftWidth','borderRightWidth','borderTopWidth','borderBottomWidth','marginTop','marginBottom','cssFloat'],true , id),
					nodeheight,left;
					if( hc.envs.isIE8 ){ds.height = tyz.PX(h2v_ie.getOH(cn))-tyz.PX(ds.paddingTop)-tyz.PX(ds.paddingBottom)-tyz.PX(ds.borderTopWidth)-tyz.PX(ds.borderBottomWidth);}
					nodeheight = tyz.PX( ds.height ) + tyz.PX( ds.paddingTop ) + tyz.PX( ds.paddingBottom ) + tyz.PX( ds.marginTop ) + tyz.PX(ds.marginBottom )+tyz.PX(ds.borderTopWidth)+tyz.PX(ds.borderBottomWidth);
					left = tyz.PX(ds.width)-tgt.fsPX+tyz.PX(ds.paddingLeft)+tyz.PX(ds.paddingRight)+tyz.PX(ds.borderLeftWidth)+tyz.PX(ds.borderRightWidth);

					ds['maxWidth'] = ds.width;
					ds['maxHeight']=ds.height;

					if( cn.done_h2v ){
						set_left();
						return cn;
					}

					if( (ds.cssFloat=='left'||ds.cssFloat=='right') && maxHeight-nodeheight>baseFont ){
						if( tgt.flt )return imgFloat_clear();
						tgt.flt = ds.cssFloat;
						ds.cssFloat = 'none';
						tyz.setStyles(cn,ds);
						tgt.fH = nodeheight;
						tgt.fW = tyz.round( (tyz.PX(ds.width) + tyz.PX(ds.paddingLeft)+tyz.PX(ds.paddingRight)+tyz.PX(ds.borderLeftWidth)+tyz.PX(ds.borderRightWidth)+tyz.PX(ds.marginLeft)+tyz.PX(ds.marginRight) ) , 2 );
						tgt.floatCount=0;
						return cn;
					}

					ds.cssFloat ='none';

					tyz.setStyles( cn , ds );

					if( maxHeight - nodeheight < 0 && cn.previousSibling){cn['done_h2v']=true;return cn.previousSibling;}
					tgt.cH +=nodeheight;
					if( maxHeight - tgt.cH < 0 && cn.previousSibling )return cn.previousSibling;

					set_left();

					break;

				case 'BR' :
					return tgt.okuri||cn;

				case 'HR' :
					if(!cn.done_h2v){
						cn['done_h2v']=true;
						cn.style.height = tyz.PX(tgt.pageheight)*0.8 + 'px';
						return tgt.okuri||cn.previousSibling||hc.addBlank(cn);
					}else{
						return cn;
					}

				default :
					var df = hc.seekNodes( id , cn , baseFont , maxHeight ,0,false) ;/*3.5.0*/
					if( df ) return df;
					break;
			}//nodename

			if(cn.nextSibling ){
				var ns = cn.nextSibling; 
				if( hc.isDispBlock( ns,id )=='b' || hc.isThru( ns )){return tgt.okuri||cn;}
			}
		}
		return tgt.okuri||false;
		/* local funcs */
		function set_left(){
			if( left != 0 ){
				left =( left + tyz.PX( ds.width )) /2 ;
				tgt.mR = left + tyz.PX( ds.marginRight ) ;
			}
		}

		function imgFloat_clear(){
			var tmp = tyz.newEle( 'DIV' , { 'class':'h2v_imgFloat_clear' });
			cn.parentNode.insertBefore( tmp , cn );
			return tmp;
		}
	},

	getSpanFlag : function(node){
		var cName = tyz.getAttr( node , 'class' );
		if( /h2v_kuto|h2v_kakko_b/.test( cName ))return 1;
		if( /h2v_kakko_t/.test( cName ))return 2;
		if( /h2v_komoji|h2v_rotate/.test( cName ))return 3;
		if( /h2v_sp/.test( cName ))return 4;
		if( /h2v_tcy/.test( cName ))return 5;
		if( /h2v_alpha/.test( cName ))return 6;
		if( /psdo_rb/.test( cName ))return 7; /* 3.4.0 */
		if( /bousen_/.test( cName ))return 8;
		if( /psdo_rt/.test( cName ))return 9; /* 3.4.0 */
		if( /h2v_cho/.test( cName ))return 10;		/* 3.4.0 */

		return 0;
	},

	oneCol : function( id , node , ph ){
		this.tmpdiv.appendChild( node );
		var iw = node.offsetWidth+1,
			ih = node.offsetHeight,
			pw = tyz.PX( this.target[id].pagewidth ) - 3 ;
		if( pw > iw ){ iw = pw ; node.style.width = iw+'px' ; }
		var colInner = tyz.newEle( 'DIV' , { 'class' : 'h2v_pinner' } , { 'width' : iw + 'px' } );
		colInner.appendChild( node );
		var colOuter = tyz.newEle( 'DIV' , { 'class' : 'h2v_oc' } , { 'width' : pw + 'px' ,'height' : ih + 15 + 'px' ,'minHeight' : ph + 'px' } );
		colOuter.appendChild( colInner );
		return colOuter ;
	},

	separateCols : function( id , node , ph){
		var cols = [],
			PW = tyz.PX( this.target[id].pagewidth ),
			pw,
			df;
		node.normalize();

		df = document.createDocumentFragment();
		df.appendChild(node);
		resizeImgs();
		resizeThrus( 'PRE' );
		resizeThrus( 'TABLE' );

		var cutAt,
			innerW,viewW,right,
			cw=0,sft = 0,
			pinner,innerH,
			maskR = 0;

		while( 1 ){
			viewW = 0;
			pw = PW+Math.ceil(sft);
			cutAt = findCut( node );
			if( cutAt === null )break;
			innerW = Math.ceil(cw+sft+5);
			if(viewW-PW>0){viewW=PW;}

			right = ( sft <= 0 ? '0' : '-' + Math.floor(sft) ) + 'px';

			pinner = tyz.newEle( 'DIV' , { 'class' : 'h2v_pinner' } , { 'width' : innerW + 'px' , 'right' : right   } ) ;
			pinner.appendChild( this.extractRange( node , cutAt.cnt ));
			innerH = this.envs.isIE8 ? h2v_ie.getOH(pinner) : this.getDispS( pinner , ['height'] , true , id , true ).height ;
			cols[cols.length] = tyz.newEle( 'DIV' , { 'class' : 'h2v_page' } , { 'width' : viewW + 'px' , 'minHeight' : ph + 'px','height':innerH} );
			cols[cols.length-1].appendChild( pinner );

			cw = 0;
			sft = maskR;
			maskR=0;
		}

		right = ( sft <= 0 ? 0 : '-' + Math.floor(sft) ) + 'px';
		innerW = Math.ceil(cw+sft+5);
		pinner = tyz.newEle( 'DIV' , { 'class' : 'h2v_pinner' } , { 'width' : innerW + 'px' , 'right' : right} ) ;
		pinner.appendChild( this.extractNodeContents( node ) );
		innerH = this.envs.isIE8 ? h2v_ie.getOH(pinner) : this.getDispS( pinner , ['height'] , true , id , true ).height ;
		cols[cols.length] = tyz.newEle( 'DIV' , { 'class' : 'h2v_page' } , { 'width' : pw + 'px' , 'minHeight' : ph + 'px' , 'height' : innerH } );
		cols[cols.length-1].appendChild( pinner );

		return cols;

		var imgtmp,imgEx;
		function findCut( node ){
			var cn = node.childNodes,
				i,cns={},W,tmp,ctmp;

			for( i=0;i<cn.length;i++){
				if( cn[i].nodeName == '#text' )continue;
				if( !cn[i].style )continue;
				tmp=cn[i].style;
				cns['mR']=tyz.PX(tmp.marginRight);
				cns['bR']=tyz.PX(tmp.borderRightWidth);
				cns['pR']=tyz.PX(tmp.paddingRight);
				cns['w']=tyz.PX(tmp.width);
				cns['pL']=tyz.PX(tmp.paddingLeft);
				cns['bL']=tyz.PX(tmp.borderLeftWidth);
				cns['mL']=tyz.PX(tmp.marginLeft);

				W = cns.mR + cns.bR + cns.pR + cns.w + cns.pL + cns.bL;

				if( h2vconvert.isThru(cn[i])||
							h2vconvert.span_match(cn[i],'h2v_e')||
								h2vconvert.isDispBlock(cn[i],id)=='i'||
									(h2vconvert.isDispBlock(cn[i],id)=='b'&&!cn[i].hasChildNodes() ) ){//分割できない要素の時
					cw+=W;

					if( cw - pw > 0 ){  //はみ出した。
						if( W - PW >= 0 ){//ページ幅より自分の幅が広い。どうやっても入らないので、仕方なく自分まで含める。
							cw+=cns.mL;
							viewW = cw-sft;
							return {'cnt':cn[i],'desc':'e'};
						}
						//そうでなければ自分の前まで入る。
						cw-=W;
						viewW = cw-sft;
						if( imgtmp ){
							imgtmp.style.marginRight = imgEx-cw+'px';
							imgtmp.style.marginLeft = -(imgEx-cw)+'px';
							cn[i].parentNode.insertBefore( imgtmp.cloneNode(true) ,cn[i]);
							imgtmp=null;
						}
						return { 'cnt' : cn[i].previousSibling||h2vconvert.addBlank(cn[i]),'desc':'e'};
					}
					//はみ出さなかったら
					cw+=cns.mL;
					continue;
				}else if( h2vconvert.span_match(cn[i],'h2v_imgFloat') ){
					var tmpCW=cw+W;
					if( tmpCW-pw>0){
						imgEx = tmpCW;//はみ出し
						imgtmp=cn[i].cloneNode(true);
					}
					continue;
				}

				var prevL = cw*1;

				cw+=cns.mR;
				if( cw - pw > 0 ){
					maskR=pw-prevL;
					ctmp=cn[i].cloneNode(false);
					cn[i].parentNode.insertBefore(ctmp,cn[i]);
					cw+= cns.bR + cns.pR + cns.w + cns.pL + cns.bL + cns.mL;
					viewW = PW;
					return {'cnt':ctmp, 'desc':''};
				}

				cw+= cns.bR + cns.pR;
				if(cw-pw>0){
					maskR = pw - prevL;
					ctmp=cn[i].cloneNode(false);
					cn[i].parentNode.insertBefore(ctmp,cn[i]);
					cw+= cns.w + cns.pL + cns.bL + cns.mL;
					viewW = PW;
					return {'cnt':ctmp, 'desc':''};
				}

				var prevcw = cw*1,
					ca = findCut( cn[i] ),
					inner_width = cw-prevcw;
				if( inner_width - Math.round(cns.w) < 0 )inner_width = cns.w;

				if( ca===null){//中身が全部入ったor中身が空。
					cw = prevcw+inner_width;
					if( cw-pw>0 ){//中身が空で、本体の途中で切れる
						maskR = pw-prevL;
						ctmp = cn[i].cloneNode(true);
						cn[i].parentNode.insertBefore(ctmp,cn[i]);
						cw+= cns.pL + cns.bL + cns.mL;
						viewW = PW;
						return {'cnt':ctmp, 'desc':''};
					}
					//中身は入っていた
					cw+= cns.pL + cns.bL;
					if( cw-pw>0 ){//paddingLeftの途中で切れる
						maskR = pw-prevL;
						ctmp = cn[i].cloneNode(true);
						cn[i].parentNode.insertBefore(ctmp,cn[i]);
						cw+=cns.mL;
						viewW = PW;
						return {'cnt':ctmp, 'desc':''};
					}
					//marginLeftの途中で切れる
					cw+=cns.mL;
					if(cw-pw>0){
						maskR = pw-prevL;
						ctmp = cn[i].cloneNode(true);
						cn[i].parentNode.insertBefore(ctmp,cn[i]);
						viewW = PW;
						return {'cnt':ctmp, 'desc':''};
					}
					//きれなかった
					continue;
				}
				//中身が途中で切れた.戻ってきた ca までこのカラムに入る
				cw+= inner_width + cns.pL + cns.bL + cns.mL;
				if( ca.desc=='e'&&cns.w!= 0 ){
					ctmp = cn[i].cloneNode(true);
					cn[i].parentNode.insertBefore(ctmp,cn[i]);
					ca.cnt=ctmp;
					ca.desc='';
					maskR = cw-prevL;
				}else{
					maskR+= cns.mR + cns.bR + cns.pR;
				}

				return ca;
			}//cn loop
			return null;
		}

		function findAncestor( pn , stopAt ){
			while(1){
				if( pn.nodeName == '#document-fragment' )return false;
				if( tyz.getAttr( pn , 'class' ) == stopAt ) return pn ;
				pn = pn.parentNode ;
			}
		}

		function resizeImgs(){
			var imgs = tyz.getByTag( node , 'IMG' ),
				h2v_e,imgS,il,hs,
				imgW=0,origW=0,origH=0,newW=0,newH=0;
			for( il = 0 ; il < imgs.length ; il++ ){
				h2v_e = findAncestor( imgs[il].parentNode , 'h2v_e' );//.parentNode;
				if( h2v_e === false )continue;
				hs = h2v_e.style;
				imgW = tyz.PX(hs.width) + tyz.PX(hs.marginLeft)+tyz.PX(hs.marginRight)+tyz.PX(hs.paddingLeft)+tyz.PX(hs.paddingRight)+tyz.PX(hs.borderLeftWidth)+tyz.PX(hs.borderRightWidth) ; 
				if( imgW-PW > 0 ){
					origW = tyz.PX( imgs[il].style.width );
					origH = tyz.PX( imgs[il].style.height );
					if( h2vconvert.envs.isIE8 ) origH = tyz.PX( h2v_ie.getOH( imgs[il] ));
					newW = origW - ( imgW - PW );
					if( newW > 0 ){
						newH = origH * newW / origW ;
						tyz.setStyles( imgs[il] , { width:newW+'px' , 'height' : newH+'px' } );
						h2v_e.style.marginRight = tyz.PX( hs.marginRight ) - (imgW - PW ) + 'px' ;
					}
				}
			}
		}

		function resizeThrus( tag ){
			var eles = tyz.getByTag( node , tag ),
				e=0,eleS,eleW=0,newW=0;
			for( e = 0 ; e < eles.length ; e++ ){
				eleS = eles[e].style;
				eleW = tyz.PX( eleS.width ) + tyz.PX(eleS.paddingLeft )+tyz.PX( eleS.paddingRight ) + tyz.PX(eleS.marginRight ) + tyz.PX( eleS.marginLeft ) + tyz.PX(eleS.borderLeftWidth )+ tyz.PX(eleS.borderRightWidth );
				if( eleW-PW > 0 ){
					newW = tyz.PX( eleS.width ) - ( eleW - PW );
					if( newW > 0 )eles[e].style.width = newW+ 'px' ;
				}
			}
		}
	},

	addVTags : function( node ){
		var tmpnode=node.cloneNode(true);
		tmpnode.nodeValue = tmpnode.nodeValue.replace( this.orig_ex , function(m){ return h2vconvert.repl_a[m]} );
			result = [],cname = [],place = [],plength = [];
		while( result = this.ptn.exec( tmpnode.nodeValue ) ){ 
			if( result[1] ){
				cname[ cname.length] = 'h2v_komoji' ;
			}else if( result[2] ){
				cname[cname.length] = 'h2v_cho' ;
			}else if( result[3] ){
				cname[cname.length] = 'h2v_kuto' ;
			}else if( result[4]){ 
				cname[cname.length] = 'h2v_sp' ;
			}else if( result[5]){ 
				cname[cname.length] = 'h2v_alpha' ;
			}else if( result[6] ){
				cname[cname.length] = 'h2v_kakko_t_nr' ;
			}else if( result[7] ){
				cname[cname.length] = 'h2v_kakko_b_nr';
			}else if( result[8] ){
				cname[cname.length]='h2v_kakko_t';
			}else if( result[9] ){
				cname[cname.length]='h2v_kakko_b';
			}else if( result[10]){
				cname[cname.length]='h2v_rotate';
			}else if( result[11]){
				cname[cname.length]='h2v_kuto_s';
			}
			plength[plength.length] = result[0].length;
			place[place.length] = this.ptn.lastIndex-result[0].length;
		}

		var endtext,sur,newspan,newtext,j,
			tmpdf = document.createDocumentFragment();
		tmpdf.appendChild(tmpnode);
		for( j = cname.length -1 ; j >= 0 ; j -- ){
			endtext = tmpnode.splitText(place[j]+plength[j]);
			sur=tmpnode.splitText(place[j]);
			newspan = tyz.newEle('SPAN',{'class':cname[j]});
			newtext = document.createTextNode(sur.nodeValue);
			newspan.appendChild(newtext);
			tmpdf.replaceChild(newspan,sur);
		}

		var tfc;
		if( this.envs.isIE8){
			var tmpdd = tyz.newEle('DIV');
			tmpdd.appendChild(tmpdf.cloneNode(true));
			tmpdd.normalize();
			tmpdf=document.createDocumentFragment();
			tmpdf.appendChild( h2vconvert.extractNodeContents(tmpdd));
		}else{
			tmpdf.normalize();
		}
		while( tmpdf.firstChild){
			node.parentNode.insertBefore(tmpdf.firstChild,node);
		}

		node.parentNode.removeChild(node);
	} ,

	resizeTimer : null ,
	resizeFlag : false,
	resizeW : 0,

	doresize : function(){
		if( !h2vconvert.resizeFlag ){
			h2vconvert.resizeFlag = true;
			h2vconvert.resizeTimer = setInterval( function(){
																							if( h2vconvert.resizeW == window.innerWidth ){
																								clearInterval( h2vconvert.resizeTimer );
																								h2vconvert.resizing();
																								setTimeout( function(){
																										h2vconvert.resizeFlag=false;},1);
																							}else{
																								h2vconvert.resizeW = window.innerWidth ;
																								return false;
																							}
																						},100);
		}else{
			return false;
		}
	},

	resizing : function(){
		var hc = h2vconvert,dest,tgt,id,parentWidth ;
		for( id in hc.target ){
			dest = tyz.getById( id );
			if( tyz.getByClass( dest , 'h2v' ).length == 0 ) return false;
			tgt = hc.target[id];
			parentWidth = tyz.getById( id ).offsetWidth - tyz.getPxStyle( dest , 'paddingLeft' ) - tyz.getPxStyle( dest , 'paddingRight' ) - tyz.getPxStyle( dest , 'borderLeftWidth' ) - tyz.getPxStyle( dest , 'borderRightWidth' ) ;
			if( hc.reConvert( tgt , parentWidth ) ){
				(function( id , dest , tgt ){
						setTimeout( function(){
						try{
							h2vconvert.convert( id ); 
						}catch( err ){
							h2vconvert.onErr( dest , tgt );
						} 
					} , 1 ) ; } 
				)( id , dest , tgt );
			}
		}
	},

	reConvert : function( tgt , w ){
		if( !tgt.cols ){ 
			if( tgt.fixedwidth && Math.round(tyz.PX( tgt.fixedwidth )) <= w ){
				tgt.pagewidth = tgt.fixedwidth ;
			}else{
				tgt.pagewidth = w + 'px' ;
			}
			return true ;
		}else{
			if( tgt.fixedwidth && Math.round(tyz.PX( tgt.fixedwidth ))<= w ){
				if( tgt.pagewidth == tgt.fixedwidth ){
					return false ;
				}else{
					tgt.pagewidth = tgt.fixedwidth;
					return true;
				}
			}else{ 
				if( Math.round(tyz.PX( tgt.pagewidth )) == w ){
					return false ;
				}else{
					tgt.pagewidth = w +'px';
					return true ;
				}
			}
		}
	} ,

	getNewProp : function( cn ,lsc,lsp, id , flag){
		var ds = h2vconvert.getDispS( cn , ['fontSize',
																'width',
																'height' ,
																'marginTop' , 
																'marginLeft' ,
																'marginBottom' ,
																'marginRight' ,
																'paddingTop' ,
																'paddingLeft' , 
																'paddingBottom' ,
																'paddingRight' ,
																'borderTopStyle' ,
																'borderRightStyle' ,
																'borderBottomStyle' ,
																'borderLeftStyle' ,
																'borderLeftWidth' ,
																'borderRightWidth',
																'borderTopWidth' ,
																'borderBottomWidth' ,
																'textAlign' ,
																'position' , 
																'display'
														],flag , id ),
			xm = tyz.PX( ds.marginLeft ) + tyz.PX( ds.marginRight ) + tyz.PX( ds.paddingLeft ) + tyz.PX( ds.paddingRight ) + tyz.PX( ds.borderLeftWidth ) + tyz.PX( ds.borderRightWidth ),
			newMargin = (tyz.PX(ds.marginLeft) - (-lsp/2) - lsc/2)+'px '+tyz.PX(ds.marginTop)+'px '+tyz.PX(ds.marginRight)+'px '+tyz.PX(ds.marginBottom)+'px',
			newPadding = tyz.PX(ds.paddingLeft)+'px '+tyz.PX(ds.paddingTop)+'px '+(tyz.PX(ds.paddingRight)-(lsc/2))+'px '+tyz.PX(ds.paddingBottom)+'px' ,
			newStyles = { 'margin' : newMargin ,
										 'padding' : newPadding ,
										 'fontSize':tyz.PX(ds.fontSize)+'px',
										 'lineHeight':tyz.PX(ds['fontSize'])-(-lsc) + 'px',
										 'letterSpacing':'normal'
			} ,
			newBorder = this.rotateBdr( { 'Top' : ds.borderTopStyle ,
															'Right' : ds.borderRightStyle,
															'Bottom' : ds.borderBottomStyle,
															'Left' : ds.borderLeftStyle } , cn , id );
		for( var bkey in newBorder ){
			newStyles[bkey] = newBorder[bkey];
		}
		return { 's' : newStyles , 'xm' : xm , 'ds' : ds } ;
	} ,

	rotateBdr : function( bdr , node , id ){
		var newBdr = {} ;
		for( var pos in bdr ){
			if( bdr[pos] && bdr[pos] != 'none' ){
				newBdr['border'+r(pos)+'Style'] = bdr[pos] ;
				var wcp=[];
				wcp.push( 'border'+pos+'Width','border'+pos+'Color');
				var wc = this.getDispS( node , wcp , false , id );
				newBdr['border'+r(pos)+'Width'] = wc['border'+pos+'Width'];
				newBdr['border'+r(pos)+'Color'] = wc['border'+pos+'Color'];
			}else{
				newBdr['border'+r(pos)+'Style'] = 'none' ;
				newBdr['border'+r(pos)+'Width'] = '0';
			}
		}

		return newBdr ;

		function r( pos ){
			var newKey = { 'Top' : 'Right' , 'Right' : 'Bottom' , 'Bottom' : 'Left' , 'Left' : 'Top' } ;
			return newKey[pos];
		}
	},

	setLineMargin : function( id , fs , ds ){
		var tgt = this.target[id] ;
		if( ds ){
			fs+=(tyz.PX(ds.marginTop)+tyz.PX(ds.marginBottom)+tyz.PX(ds.paddingTop)+tyz.PX(ds.paddingBottom))/2;
		}
		if( tgt.fsPX-fs < 0 ) {
			var ml = ( fs - tgt.fsPX )/2;
			if( tgt.mL-ml < 0 ) tgt.mL = ml;
			var mr = ( fs - tgt.fsPX ) /2;
			if( tgt.mR-mr < 0 ) tgt.mR = mr;
		}
	} ,

	addBar : function( id , msg ){ 
		var bid = 'b'+id,
			bar = tyz.getById( bid ) || tyz.newEle( 'DIV' , { 'class' : 'h2v_bar' , 'id' : bid } , { 'color' : this.target[id].barForeColor , 'backgroundColor' : this.target[id].barBackColor } ) ;
		bar.innerHTML = msg ;
		tyz.getById( id ).insertBefore( bar , tyz.getById(id).firstChild );
	},

	addErrBar : function( id , msg ){
		var bid = 'b'+id,
			bar = tyz.getById( bid ) || tyz.newEle( 'DIV' , { 'class' : 'h2v_bar' , 'id' : bid } , { 'color' : '#999' , 'backgroundColor' : '#eee' } ) ;
		bar.innerHTML = msg ;
		tyz.getById( id ).insertBefore( bar , tyz.getById(id).firstChild );		
	},

	showSplash : function( id ){ 
		var dest = tyz.getById( id ),
			sp = tyz.newEle( 'DIV' , { 'class' : 'h2v_splash' , 'id' : 'sp' + id } , { 'top' : dest.offsetTop*1+15 + 'px' , 'left' : dest.offsetLeft + 'px' , 'width' : dest.offsetWidth -58+ 'px' } );
		sp.innerHTML = '縦書きレイアウトに変換しています…' ;
		dest.parentNode.appendChild( sp );
		dest.style.opacity = '0.5' ;
		if( this.envs.isIE8 )dest.style.filter = 'alpha(opacity=50)';
	} ,

	hideSplash : function( id ){
		var sp = tyz.getById( 'sp'+id ),
			ds = tyz.getById( id ).style ;
		ds.opacity = this.target[id].orgOpacity ;
		if( this.envs.isIE8 ) ds.filter = this.target[id].orgOpacity;
		if( !sp )return;
		sp.style.opacity = '0' ;
		setTimeout( function(){sp.parentNode.removeChild( sp );} , 500 );
	},

	onErr : function( dest , tgt ){
		dest.innerHTML = '' ;
		dest.parentNode.replaceChild( tgt.org.cloneNode(true) , dest );
		this.addBar( tgt.id , '<a href="http://tategaki.info/h2v/" target="_blank">h2v.js Failed!</a>');
		tyz.setStyles( tyz.getById( tgt.id ) , tgt.orgStyles );
	},

	isDispBlock : function( node ,id){ /* 3.4.0 */
		if( !this.isBlock(node) && !this.isInline(node) && node.nodeName!='SPAN')return false;

		var d = h2vconvert.getDispS( node , ['display'] , false , id ).display;

		switch( d ){
			case 'block':
				return 'b';
			case 'inline-block':
			case 'inline':
				return 'i';
			default :
				return false;
		}
	},

	isBlock : function( node ){
		switch(node.nodeName){
			case'DIV':case'P':case'BLOCKQUOTE':case'UL':case'OL':case'DL':
			case'H1':case'H2':case'H3':case'H4':case'H5':case'H6':
			case'ADDRESS':case'ARTICLE':case'ASIDE':case'FOOTER':case'HEADER':case'HGROUP':case'NAV':case'DETAILS':case'SECTION':case'SUMMARY':
				return true;
			default:
				return false;
		}
	},

	isList : function( node ){
		switch(node.nodeName){
			case'LI':case'DT':case'DD':
				return true;
			default:
				return false;
		}
	},

	isInline : function( node ){
		switch(node.nodeName){
			case'FONT':case'STRONG':case'BIG':case'SMALL':case'I':case'B':case'EM':case'SUB':case'SUP':
			case'A':case'MARK':case'TIME':case'METER':case'S':case'CITE':case'Q':case'DFN':case'ABBR':
			case'CODE':case'VAR':case'SAMP':case'KBD':
				return true;
			default:
				return false;
		}
	},

	isThru : function( node ){
		switch(node.nodeName){
			case'PRE':case'IFRAME':case'TABLE':case'TEXTAREA':
			case'FORM':case'AUDIO':case'CANVAS':case'EMBED':case'FIGURE':case'VIDEO':case'MENU':case'OBJECT':case'MAP':
				return true;
			default:
				return false;
		}
	},

	span_match : function( node , class_name ){
		if( node.nodeName == 'SPAN' && tyz.getAttr( node , 'class' ).match( class_name ) )return true;
		return false;
	},
	
	getLS : function( src , id ){ /* 3.4.0 */
		var vs = this.getDispS( src , ['letterSpacing'] , false , id ),
				ls = vs['letterSpacing'];
		switch( ls ){
			case 'normal':
			case 'initial' : 
				return 0;
			default : 
				return tyz.PX( ls );
		}	
	},

	getDispS : function( src , prop , flag , id , vflag){
		var df = src.cloneNode(flag),
			 pn = src.parentNode,
			 depth = 0,
			 td,myself,vPage,p,d;
		while( pn && pn.nodeName != '#document-fragment' ){ 
			td = pn.cloneNode( false );
			td.appendChild(df);
			df = td;
			depth++;
			pn = pn.parentNode;
		}

		if( vflag ){
			myself = df.cloneNode(flag );
			this.tmpdiv.appendChild( myself );
		}else{
			vPage = tyz.newEle( 'DIV' , { 'id' : 'h2v_tmp_sq'} , { 'height' : this.target[id].pageheight , 'width' : this.target[id].pageheight } );
			myself = df.cloneNode( true );
			vPage.appendChild( myself ); 
			this.tmpdiv.appendChild( vPage );
		}
		for( d = 0 ; d < depth ; d++ ){
			myself = myself.lastChild;
		}
		p = tyz.getStyles( myself , prop );
		this.tmpdiv.removeChild( this.tmpdiv.lastChild );
		return p ;
	} ,

	createTmpdiv : function( id ){
		if( !tyz.getById( 'h2v_tmp_div' ) ){
			var tcpl = this.target[id].orgHeight * tyz.getById( id ).offsetWidth * tyz.PX( this.target[id].orgStyles.fontSize) / ( this.target[id].chars * tyz.PX( this.target[id].fontsize ) ),
				width = Math.ceil( tcpl * (1 + ( this.target[id].lineInterval ) * 2 )) ,
				tmpdiv = tyz.newEle( 'DIV' , { 'id' : 'h2v_tmp_div' , 'class' : 'h2v' } , { 'width' : width+'px' , 'fontSize' : this.target[id].fontsize,'fontFamily':this.target[id].fontSet } );
			tyz.getById( id ).appendChild( tmpdiv );
			return tmpdiv;
		}else{
			return tyz.getById( 'h2v_tmp_div' );
		}
	} ,

	removeTmpdiv : function( id ){
		if( tyz.getById( 'h2v_tmp_div' ) ){
			tyz.getById(id).removeChild( tyz.getById('h2v_tmp_div'));
		}
	},

	rubyEnabled : false ,

	ruby_enabler : function( id ){	// Modified at July 2013 ver 3.2.1
		setTimeout( function(){ h2vconvert.rubyEnabled = true;} , 1 );

		var envs = h2vconvert.envs,
			ua = envs.ua,
			i, j,k,
			newRUBY,
			pRUBY,
			ruby = tyz.getByTag( tyz.getById( id ) , 'RUBY' );

		if( /webkit/.test(ua)|| envs.isIE ){		
			var rbc,rtc,rb,rt;
			var append;
			for( i = ruby.length-1 ; i >= 0 ; i-- ){
				ruby[i].normalize();
				rbc = tyz.getByTag( ruby[i] , 'RBC' );
				rtc = tyz.getByTag( ruby[i] , 'RTC' );
				if( rbc.length != rtc.length )continue;
				rb = tyz.getByTag( ruby[i] , 'RB' );
				rt = tyz.getByTag( ruby[i] , 'RT' );
				pRUBY = document.createDocumentFragment();
				if(rb.length != 0 ){
					for(j =0 ; j < rb.length ; j++){
						newRUBY = tyz.newEle( 'RUBY' );
						newRUBY.appendChild( document.createTextNode( rb[j].innerHTML ));
						newRUBY.appendChild( rt[j].cloneNode( true ) );
						pRUBY.appendChild( newRUBY.cloneNode(true));
					}
				}else{
					for(j=0;j<rt.length;j++ ){
						newRUBY = tyz.newEle('RUBY');
						append = rt[j].previousSibling;
						/* 3.5.0 */
						while( /*append && */append.nodeName != '#text' ){
							try{
								append = append.previousSibling;
							}catch(err){
								append = rt[j].previousSibling;
								break;
							}
						}
//						if( append ){
							newRUBY.appendChild( append.cloneNode(true) );
							newRUBY.appendChild( rt[j].cloneNode(true) );
							pRUBY.appendChild(newRUBY.cloneNode(true));
//						}
					}
				}
				ruby[i].parentNode.replaceChild( pRUBY , ruby[i] );
			}
			return ;
		}
		/* そのた: Firefox や Opera : HTML4 の記述に合わせてスタイル適用*/
		var cs,fs,lh,tly,rt,rb,rtc;
		for( i = ruby.length-1 ; i >= 0 ; i-- ){
			ruby[i].innerHTML = ruby[i].innerHTML.replace( /[\n\r\t]/g , '' );
			ruby[i].normalize();
			cs = document.defaultView.getComputedStyle( ruby[i] , null );
			fs = cs.fontSize.replace( 'px' , '' );
			lh = cs.lineHeight.replace( 'px' , '' );
			tly = ( lh - fs ) /2 - 2 ;
			tly = tly <= 0 ? 0 : tly ;
			rt = tyz.getByTag( ruby[i] , 'RT' );
			rb = tyz.getByTag( ruby[i] , 'RB' );
			rtc = tyz.getByTag( ruby[i] , 'RTC' );
			if( rtc.length == 0 ){
				var newRBC,newRTC,
					cn,new_rb;
				if( rt.length < 2 ){
					newRBC = document.createDocumentFragment();
					newRTC = document.createDocumentFragment();
				}else{
					newRBC = tyz.newEle( 'RBC' );
					newRTC = tyz.newEle( 'RTC' );
				}
				for(j = 0 ; j < ruby[i].childNodes.length ; j++ ){
					cn = ruby[i].childNodes[j];
					switch( cn.nodeName ){
						case'#text':
							new_rb = tyz.newEle( 'RB' );
							new_rb.appendChild( cn.cloneNode( true ) );
							newRBC.appendChild( new_rb );
						break;
						case'RB':
							newRBC.appendChild( cn.cloneNode(true) );
						break;
						case'RT':
							newRTC.appendChild( cn.cloneNode(true) );
							if( tly )newRTC.lastChild.style.MozTransform = "translate(0," + tly+"px)" ;
 						break;
					}
				}
				pRUBY = document.createDocumentFragment();
				for( k=0;k<newRBC.childNodes.length;k++){
					newRUBY = tyz.newEle( 'RUBY' );
					newRUBY.appendChild( newRBC.childNodes[k].cloneNode(true) );
					newRUBY.appendChild( newRTC.childNodes[k].cloneNode(true) );
					pRUBY.appendChild( newRUBY.cloneNode(true));
				}
				ruby[i].parentNode.replaceChild( pRUBY , ruby[i] );
			}else{
				pRUBY = document.createDocumentFragment();
				for( k=0;k<rb.length;k++){
					newRUBY = tyz.newEle( 'RUBY' );
					newRUBY.appendChild( rb[k].cloneNode(true) );
					newRUBY.appendChild( rt[k].cloneNode(true) );
					pRUBY.appendChild( newRUBY.cloneNode(true));
				}
				ruby[i].parentNode.replaceChild( pRUBY , ruby[i] );
				if( tly )rtc[0].style.MozTransform =  "translate(0," + tly+"px)" ; 
			}
		}

		if( !h2vconvert.rubyEnabled ){ /* Firefox , Opera 用スタイル設定 */
			var newss = tyz.newEle( 'STYLE' );
			newss.innerHTML = "ruby{display:inline-table;text-align:center !important ;text-indent:0 !important;margin:0;padding:0 !important;vertical-align:bottom}\n" + 
			"ruby>rb,ruby>rbc{display:table-row-group;}\n" + 
			"ruby>rt,ruby>rtc{display:table-header-group;font-size:8px;line-height:1em;letter-spacing:0 !important;font-weight:normal !important;font-style:normal !important;}\n" + 
			"rbc>rb{display:table-cell;}\n" + 
			"rtc>rt{display:table-cell;letter-spacing:0 !important;line-height:1em;}\n" + 
			"rp{display:none !important;}\n" ;

			if( /opera/gi.test(ua) ){
				newss.innerHTML += "ruby,ruby>rb,ruby>rbc,ruby>rt,ruby>rtc,rbc>rb,rtc>rb{line-height:1em;}\n" +
						"ruby{vertical-align:0.95em;}\n";
			}
			tyz.getByTag( document,'HEAD')[0].appendChild(newss);
		}
		return ; 
	},

	ruby_to_html4_style : function( cn ){	// Modified at July 2013 ver 3.2.1
		var hc = h2vconvert,
			newRUBY = tyz.newEle( 'RUBY' ),
			rt,rbc,rtc,
			div,replaced;

			rt =tyz.getByTag( cn , 'RT' );
			rbc =tyz.getByTag( cn , 'RBC' );
			rtc =tyz.getByTag( cn , 'RTC' );

		if( rtc.length == 0 ){
			var newRBC,newRTC,ccn,newRB;
			if( rt.length < 2 ){
				newRBC = document.createDocumentFragment();
				newRTC = document.createDocumentFragment();
			}else{
				newRBC = tyz.newEle( 'RBC'  ) ;
				newRTC = tyz.newEle( 'RTC'  ) ;
			}
			for( var i = 0 ; i < cn.childNodes.length ; i++ ){
				ccn = cn.childNodes[i] ;
				switch( ccn.nodeName ){
					case"#text":
						ccn.nodeValue = ccn.nodeValue.replace( /^\s+|\s+$/, '' );
						newRB = tyz.newEle( 'RB' ) ;
						newRB.appendChild( ccn.cloneNode( true ) );
						newRB.innerHTML = '<span class="psdo_rb_inner">'+newRB.innerHTML + '</span>'; /*3.4.0*/
						newRBC.appendChild( newRB );
						break;
					case"RB":
						newRB = ccn.cloneNode(true);
						newRB.innerHTML = '<span class="psdo_rb_inner">'+newRB.innerHTML + '</span>'; /*3.4.0*/
						newRBC.appendChild( newRB );
						break;
					case"RT":
						newRB = ccn.cloneNode(true);
						newRB.innerHTML = '<span class="psdo_rt_inner">'+newRB.innerHTML + '</span>'; /*3.4.0*/
						newRTC.appendChild( newRB );
						break;
				}
			}
			newRUBY.appendChild( newRBC );
			newRUBY.appendChild( newRTC );

			cn.parentNode.replaceChild( newRUBY , cn );
			return newRUBY ;
		}else{ 
			if( rbc.length != 0 ) return cn ;
			throw new Error();
		}
		throw new Error();
	},

	h2v : function( params , id ){ 
		this.id = id;
		var p = params[id],
			hc = h2vconvert,
			key,d,parentWidth;
		for( key in hc.defaultval ){
			this[key] = hc.defaultval[key];
		}
		for( key in p ){
			this[key] = p[key] ;
		}

		d = tyz.getById(id);
		parentWidth = d.offsetWidth - tyz.getPxStyle( d , 'paddingLeft' ) - tyz.getPxStyle( d , 'paddingRight' ) - tyz.getPxStyle( d , 'borderLeftWidth' ) - tyz.getPxStyle( d , 'borderRightWidth' ) ;
		this.pagewidth = p.pagewidth !== undefined ? p.pagewidth : ( parentWidth+'px' );
		this.fixedwidth = p.pagewidth !== undefined ? p.pagewidth : false ;

		if( tyz.PX( this.pagewidth ) > parentWidth ){ 
			this.pagewidth = parentWidth+'px';
		}

		this.fsPX = tyz.PX(this.fontsize) ;
		this.pageheight = this.chars * this.fsPX + 'px' ;
		this.mR = 0;
		this.mL = 0;
		this.lineSpace = Math.round(this.fsPX * this.lineInterval/2);
		this.cH = 0;
		this.tAlign = 0;

		/* backup original html and properties */
		this.org = document.createDocumentFragment();
		this.org.appendChild( d.cloneNode( true ) );
		this.orgStyles = tyz.getStyles( d ,['fontSize', 'fontFamily'] );
		this.orgStyles.visibility = 'visible' ;
		this.orgHeight= d.offsetHeight;
		this.orgOpacity = hc.envs.isIE8 ? tyz.getStyle( d , 'msFilter' ) : tyz.getStyle( d , 'opacity' );
		this.okuri = null;

		this.html = '' ;
		this.converted = '';

		if( this.fontSet.toLowerCase() == 'mincho' ){
			this.fontSet = hc.fontSet.mincho;
		}else{
			this.fontSet = hc.fontSet.gothic;
		}

		this.flt = false;
		this.floatCount = 0;
		this.justify = false;
	},

	extractRange : function( basenode , endAfter ){
		var r = document.createRange();
		r.setStartBefore( basenode.firstChild );
		r.setEndAfter( endAfter );
		return r.extractContents();
	},

	extractNodeContents : function( node ){
		var r = document.createRange();
		r.selectNodeContents( node );
		return r.extractContents();
	},

	switcher : function( id ){
		var tgt = this.target[id],
			dest = tyz.getById( id );
		if( tyz.getByClass( dest , 'h2v' ).length ){
			dest.innerHTML = '' ;
			dest.parentNode.replaceChild( tgt.org.cloneNode(true) , dest );
			dest = tyz.getById( id );
			if( tgt.bar )this.addBar( tgt.id , '<span onclick="h2vconvert.switcher( \'' + id + '\');">横→縦切替</span>');
			tyz.setStyles( dest , tgt.orgStyles );
		}else{
			var parentWidth = dest.offsetWidth - tyz.getPxStyle( dest , 'paddingLeft' ) - tyz.getPxStyle( dest , 'paddingRight' ) - tyz.getPxStyle( dest , 'borderLeftWidth' ) - tyz.getPxStyle( dest , 'borderRightWidth' ) ;
			if( this.reConvert( tgt , parentWidth )){
				if( tgt.splash ) this.showSplash( id );
				( function( id , dest , tgt ){
					setTimeout( function(){
						try{
							h2vconvert.convert(id);
						}catch( err ){
							h2vconvert.onErr( dest , tgt );
						}
						if( tgt.splash ) h2vconvert.hideSplash( id );
					} , 1 ); } )( id ,dest , tgt );
			}else{
				try{
					dest.innerHTML = '';
					if( tgt.bar )this.addBar( tgt.id , '<span onclick="h2vconvert.switcher( \'' + id + '\');">縦→横切替</span>');
					dest.style.fontFamily=tgt.fontSet;
					dest.appendChild( tgt.cols.cloneNode( true ) );
					dest.appendChild( tyz.newEle( 'DIV' , { 'class' : 'h2v_clearfix' } ) ) ;
				}catch( err ){
					this.onErr( dest , tgt );
				}
			}
		}
	},

	komojis : ['ぁ','ぃ','ぅ','ぇ','ぉ','っ','ゃ','ゅ','ょ','ゎ',
							'ァ','ィ','ゥ','ェ','ォ','ッ','ャ','ュ','ョ','ヮ'].join( '' ),

	kakko_t_kagi_a : ['「','『'],//xpでは回転・それ以外は置換
	kakko_t_kagi_r_a : ['﹁','﹃'],
	kakko_t_a :  ['（','｛','〈','《','〔','【'],//置換
	kakko_t_r_a :['︵','︷','︿','︽','︹','︻'],

	kakko_b_kagi_a : ['」','』'],
	kakko_b_kagi_r_a :['﹂','﹄'],
	kakko_b_a :   ['）','｝','〉','》','〕','】'],//置換
	kakko_b_r_a : ['︶','︸','﹀','︾','︺','︼'],

	dash_a :   ['―','—','‥','ー'],	//置換
	dash_r_a : ['︱','︱','︰','丨'/*U+4E28*/],

	kakkos_tr : [ '［','〘'].join(''),//回転
	kakkos_br : [ '］','〙'].join(''),

	rotates : ['↑','↓','→','←','…','＝','−','：','；','＜','＞'/*,'◀','▶','▲','▼','◁','▷','△','▽'*/].join(''),
	rotate_mirrors : ['〜'/* 301c ( mac ) */,'～'/* ff5e ( win ) */].join(''),

	kutos : ['。','、','，'].join(''),

	orig_ex : null , //置換元 kakko_t + kakko_b + dash 
	repl_a : [],//置換先	 kakko_t_r + kakko_b_r + dash_r
	ptn :null 
};

var tyz = {
	getByClass : function( ele , cName ){
		if( ele.getElementsByClassName ){
			return ele.getElementsByClassName( cName );
		}else{
			var obj = tyz.getByTag( ele , '*' ),
				ret = [];
			for( var i = 0 ; i < obj.length ; i++ ){
				if( tyz.getAttr( obj[i] , 'class' ) == cName ){
					ret[ret.length] = obj[i] ;
				}
			}
			return ret;
		}
	} ,

	getById : function( id ){
		return document.getElementById( id );
	} ,

	getByTag : function( ele , tag ){
		 return ele.getElementsByTagName( tag );
	} ,

	getStyle : function( ele , prop){ 
		return document.defaultView.getComputedStyle( ele , null )[prop];
	},

	getStyles : function( ele , prop ){
		var s = document.defaultView.getComputedStyle( ele , null ),
			p = {};
		for( var i=0;i<prop.length;i++){
			p[prop[i]]=s[prop[i]];
		}
		return p;
	},

	getAttr : function( ele , attr ){
		return ele.getAttribute( attr ) || '' ;
	} ,

	PX : function( src ){
		src += '';
		if( src=='')return 0;
		if( src.match( "px" ) ) return tyz.round(src.replace( 'px' , '' )*1,2);
		if( src.match( "pt" ) ) return tyz.round(src.replace( 'pt' , '' ) * 4 / 3 ,2);
		if( src.match( "em") ) return tyz.round(src.replace( 'em' , '' ) * h2vconvert.defaultFS*1,2);
		if( src.match( /[^0-9\.]/g ) )return 0;
		return tyz.round( src*1 ,2) ;
	} ,

	getPxStyle : function( ele , prop ){
		var style = document.defaultView.getComputedStyle( ele , null );
		return this.PX( style[prop] );
	},

	setStyles : function( ele , styles ){
		for( var s in styles ){
			ele.style[s] = styles[s];
		}
		return ele;
	} ,

	newEle : function( tagName , attributes , styles ){
		var ele = document.createElement( tagName ),
			a,s;
		for( a in attributes ){
				ele.setAttribute( a , attributes[a] );
		}
		for( s in styles ){
			ele.style[ s ] = styles[s];
		}
		return ele;
	} ,

	round : function( val ,sig ){
		var pwr=Math.pow(10,sig);
		return Math.round( val*pwr)/pwr;
	},

	ceil : function( val , sig ){
		var pwr=Math.pow(10,sig);
		return Math.ceil(val*pwr)/pwr ;
	} , 

	floor : function( val ,sig ){
		var pwr=Math.pow(10,sig);
		return Math.floor(val *pwr)/pwr ;
	}
};

var h2v_ie = {
	getStyle : function( ele , prop){
		if( h2v_ie.checkVal_w( prop ) || h2v_ie.checkVal_h( prop ) )return h2v_ie.getSize( ele , prop ) + 'px' ;
		if( prop == 'fontSize' )return h2v_ie.getFontSize( ele ) + 'px' ;
		if( prop == 'cssFloat')return ele.currentStyle['styleFloat'];
		if( prop == 'letterSpacing' )return h2v_ie.getSize(ele,prop)+'px'; /* 3.4.0 */
		return ele.currentStyle[prop];
	},

	getStyles : function( ele , prop ){
		var p = {},i;
		for( i = 0 ; i< prop.length ; i++ ){
			p[prop[i]]=h2v_ie.getStyle( ele , prop[i] );
		}
		return p;
	},

	getPxStyle : function( ele , prop ){
		var val = h2v_ie.getStyle( ele , prop );
		return tyz.PX( val );
	},

	getAttr : function( ele , attr ){
		if( attr == 'class' ) return ele.className || '' ;
		return ele.getAttribute( attr ) || '' ;
	} ,

	setStyles : function( ele , styles ){
		for( var s in styles ){
			if( s == 'cssFloat'){ele.style['styleFloat']=styles[s];continue;}
			ele.style[s] = styles[s];
		}
		return ele;
	} ,

	checkVal_w : function( prop ){
		switch(prop){
			case'width':
			case'marginLeft':case'marginRight':
			case'paddingLeft':case'paddingRight':
			case'borderLeftWidth':case'borderRightWidth':
				return true;
			default:
				return false;
		}
	},

	checkVal_h : function( prop ){
		switch(prop){
			case'height':
			case'marginTop':case'marginBottom':
			case'paddingTop':case'paddingBottom':
			case'borderTopWidth':case'borderBottomWidth':
				return true;
			default:
				return false;
		}
	},

	getFontSize : function( node ){
		var tt = tyz.newEle( 'DIV' , {} , { 'width' : '10em','letterSpacing' : 'normal' } ), /* 3.4.0 */
			fs;
		try{
			node.appendChild( tt );
			fs = Math.ceil(tt.offsetWidth/10);
			node.removeChild(tt);
		}catch(err){
			if( node.parentNode && node.parentNode.nodeName != 'HTML' ){
				fs = h2v_ie.getFontSize( node.parentNode );
			}else{
				fs = 14;
			}
		}
		return fs;
	},

	getSize : function( node , prop , flag ){ 
		var cs = node.currentStyle[prop] ;
		if( cs.match( 'px' ) ) return cs.replace( 'px' , '' )*1 ;
		if( cs.match( '%' ) ){ 
			var ratio = cs.replace( '%' , '' ) / 100,
				std = h2v_ie.checkVal_w( prop ) ? 'width' : 'height' ,
				sz = h2v_ie.getSize( node.parentNode , std , true);
			return ratio*sz ;
		}
		if( cs.match( 'pt' ) )return tyz.round(cs.replace( 'pt' , '' ) * 3/4+0.01,0);
		if( cs.match( 'em' ) )return tyz.round(cs.replace( 'em' , '' ) * tyz.PX( h2v_ie.getFontSize( node ) )+0.01,0) ;
		if( cs.match( 'auto' )){
			if( prop == 'width' ){
				 return ( node.offsetWidth - h2v_ie.getPxStyle( node , 'paddingLeft' ) - h2v_ie.getPxStyle( node , 'paddingRight' ) - h2v_ie.getPxStyle( node , 'borderLeftWidth' ) - h2v_ie.getPxStyle( node , 'borderRightWidth' ));
			}
			if( prop == 'height' && flag ){
				return ( node.offsetHeight - h2v_ie.getPxStyle( node , 'paddingTop' ) - h2v_ie.getPxStyle( node , 'paddingBottom' ) - h2v_ie.getPxStyle( node , 'borderTopWidth' ) - h2v_ie.getPxStyle( node , 'borderBottomWidth' ));
			}
			return 0;
		}
		if( prop.match( /border/ ) ){
			var bs = h2v_ie.getStyle( node , prop.replace( 'Width' , 'Style' ));
			if( bs != 'none' && bs != 'hidden' ){
				if( cs == 'thin' ) return 2;
				if( cs == 'medium' ) return 4;
				if( cs == 'thick' ) return 6 ;
			}
			return 0;
		}
		return 0;
	},

	extractRange : function( basenode , endAfter){

		var rng = document.createDocumentFragment();
		var bcl=basenode.childNodes.length;
		while(1){
			var fs = basenode.firstChild ;
			if( !fs )break;
			if( fs === endAfter ){
				rng.appendChild( basenode.removeChild(fs) );
				break;
			}
			var flag = false;
			if( fs.nodeName != '#text' ){ 
				 var ea = endAfter;
				 if( ea.nodeName == '#text' ){
					 ea = ea.parentNode;
					 if( ea.nodeName == '#document-fragment' ){
						flag = false;
					}else{
						flag = fs.contains(ea);
					}
				}else{
					flag = fs.contains( ea ) ;
				}
			}

			if( flag ){
				rng.appendChild( fs.cloneNode( false ) );
				var lastElements = h2vconvert.extractRange( fs , endAfter);
				rng.lastChild.appendChild( lastElements );
				if( !fs.hasChildNodes() )basenode.removeChild(fs);
					break;
			}else{
				rng.appendChild( basenode.removeChild( fs ) );
			}
		}

		return rng;
	},

	extractNodeContents : function( node ){
		var rng = document.createDocumentFragment(),
			fs=node.firstChild;
		while(fs){
			rng.appendChild( node.removeChild( fs ) );
			fs = node.firstChild;
		}
		return rng;
	},

	getOH : function( node ){
		var hc = h2vconvert,
			nc = node.cloneNode( true );
		hc.tmpdiv.appendChild( nc );
		var oh = nc.offsetHeight +1+ 'px' ;
		hc.tmpdiv.removeChild( nc );
		return oh;
	},

	setStyleSheet : function(){
		var ss = document.styleSheets[ document.styleSheets.length -1 ] ;
		ss.addRule( '.h2v_e span.h2v_sp' , "height:1em;" );
		if( h2vconvert.envs.isIE8 ){
			var ss = document.styleSheets[ document.styleSheets.length -1 ] ;
			ss.addRule( '.h2v_e span.h2v_cho' , "filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1, mirror=1);" );
			ss.addRule( '.h2v_e span.h2v_alpha,.h2v_e span.h2v_sp,.h2v_e span.h2v_rotate' , "filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);" );
			ss.addRule( '.h2v_e .h2v_kakko_t,.h2v_e .h2v_kakko_b',"filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);font-family:'ＭＳ ゴシック','MS Gochic' !important;" ); // Added at July 2013 ver 3.2.1
		}
	}
};

(function(){

		var hc = h2vconvert,
			envs = hc.envs ;
		envs.ua = navigator.userAgent.toLowerCase();
		var ua = envs.ua,
			version = window.opera ? (opera.version().replace(/\d$/, "") - 0) 
				: parseFloat((/(?:ie |fox\/|ome\/|ion\/|rv:)(\d+\.\d)/.exec( ua ) || [,0])[1]); /* IE 11+ */

		if( /msie/.test( ua ) ){		/* IE 10- */
			if( document.documentMode !== undefined )version = document.documentMode ; 
		}
		

		if( ( /opera/.test( ua ) && version < 10.5 ) ||
				( /firefox/.test( ua ) && version < 3.5 ) || 
				( ( !/chrome/.test( ua ) && !/opera/.test(ua) && /safari/.test( ua ) && !/mobile/.test(ua) ) && version < 3 ) || //webkit Opera対策
			( /msie/.test( ua ) && version < 8 ) ) envs.isOld = true;

//		if( /msie/.test(ua)) envs.isIE = true; /* IE 10- */
		if( /trident/.test(ua)) envs.isIE = true; /* IE 11も含む*/

		if( /msie/.test(ua) && version < 9 ) envs.isIE8 = true;

		if( envs.isIE8 ){/*replace functions*/
			tyz.getStyle = h2v_ie.getStyle ;
			tyz.getStyles = h2v_ie.getStyles ;
			tyz.getPxStyle = h2v_ie.getPxStyle;
			tyz.setStyles = h2v_ie.setStyles;
			hc.extractRange = h2v_ie.extractRange;
			hc.extractNodeContents = h2v_ie.extractNodeContents;
			tyz.newEle( 'RB' );	// Added at July 2013 ver 3.2.1
		}

		if(/webkit|opera/.test(ua)  )hc.getExtraHeight = hc.getExtraHeight_webkit; //added at Jul 2013 ver 3.3.0. 

		if( document.addEventListener ){
			window.addEventListener( 'resize' , h2vconvert.doresize , false );
		}else{
			window.attachEvent( 'onresize' , h2vconvert.doresize );
		}

		var orig_a,repl_a,i;/* 置換文字列 */
		var kakkos_t,kakkos_b;
		if(/windows nt 5/.test(ua)){/*win xp*/
			orig_a = hc.kakko_t_a.concat(hc.kakko_b_a ,hc.dash_a);
			repl_a = hc.kakko_t_r_a.concat(hc.kakko_b_r_a,hc.dash_r_a);
			hc.orig_ex = RegExp( '('+orig_a.join('|')+')', 'g' );
			for( i=0;i<orig_a.length;i++){
				hc.repl_a[orig_a[i]]=repl_a[i];
			}
			hc.kakkos_tr += hc.kakko_t_kagi_a.join('');
			hc.kakkos_br += hc.kakko_b_kagi_a.join('');
			kakkos_t = hc.kakko_t_r_a.join('');
			kakkos_b = hc.kakko_b_r_a.join('');
		}else{
			orig_a = hc.kakko_t_a.concat(hc.kakko_b_a ,hc.kakko_t_kagi_a, hc.kakko_b_kagi_a, hc.dash_a );
			repl_a = hc.kakko_t_r_a.concat( hc.kakko_b_r_a ,hc.kakko_t_kagi_r_a , hc.kakko_b_kagi_r_a, hc.dash_r_a );
			hc.orig_ex = RegExp( '('+orig_a.join('|')+')', 'g' );
			for( i=0 ; i< orig_a.length ;i++ ){
				hc.repl_a[orig_a[i]] = repl_a[i];
			} 
			kakkos_t = hc.kakko_t_r_a.join('')+hc.kakko_t_kagi_r_a.join('');
			kakkos_b = hc.kakko_b_r_a.join('')+hc.kakko_b_kagi_r_a.join('');
		}
		/*3.5.0*/
		h2vconvert.ptn = RegExp( '([' + hc.komojis + '])|([' + hc.rotate_mirrors + '])|([' + hc.kutos + '])|( |\\u00A0|　)|([!-~‘”“’]+\\s?)|([' + kakkos_t + '])|([' + kakkos_b + '])|(['+ hc.kakkos_tr + '])|([' + hc.kakkos_br + '])|(['+hc.rotates+'])|([！？])' , 'g' );

})();