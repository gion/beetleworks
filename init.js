/*yepnope1.5.x|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);

(function(global,y,doc,undefined){

	// if the namespace already exists and it is our object
	if(global.bw && global.bw.name == 'beetleworx')
		{
			var errorMsg = "Cannot load multiple instances of the game.";
			alert(errorMsg);
			throw errorMsg;
		}

	// initialise the namespace
	var bw = global.bw || {},

		// this is the url where our files are hosted
		// this should link to something like "beetleworx.com" after dev : 
		// host = http://beetleworx.com
		host = (function(){
			if(/(127.0.0.1)|(localhost)/.test(document.location))
				bw.host = 'http://localhost:8080/';
			else
				bw.host = 'https://gion.github.io/beetleworks/';

			return bw.host;
		})(),

		timestamp = (new Date()).getTime(),
		modules = {
	//		jquery : host + 'assets/js/jquery-1.7.2.min.js'

			// added jquery 1.8 :D
			jquery : host + 'assets/js/jquery-1.8.0.min.js'
			,jqueryTransit : host + 'assets/js/jquery.transit.min.js'
			,jqueryWithinViewport : host + 'assets/js/jquery.withinViewport.js'
			,renderDependency : host + 'assets/js/raphael-min.js'
			,underscore : host + 'assets/js/underscore-min.js'
			,backbone : host + 'assets/js/backbone-min.js'
			,json : host + 'assets/js/json2.js'
			,soundManager : host + 'assets/js/soundmanager2-nodebug-jsmin.js'
			,debug : host + 'assets/js/remoteDebug.js'
			,css : host + 'assets/css/style.css?t=' + timestamp
			,app : {
				modules : {
					config : host + 'src/modules/config.js'
					,util : host + 'src/modules/util.js'
					,renderingEngine : host + 'src/modules/renderingEngine.js'
					,router : host + 'src/modules/router.js'
				}
				,models : {
					cursor : host + 'src/modules/models/cursor.js',
					sidebar : host + 'src/modules/models/sidebar.js',
					weapon : host + 'src/modules/models/weapon.js',
					enemy : host + 'src/modules/models/enemy.js',
					secretPart : host + 'src/modules/models/secretPart.js'
				}
				,collections : {	
					enemies : host + 'src/modules/collections/enemies.js',
					secretParts : host + 'src/modules/collections/secretParts.js'
				}
				,views : {
					cursor : host + 'src/modules/views/cursor.js',
					sidebar : host + 'src/modules/views/sidebar.js',
					weapon : host + 'src/modules/views/weapon.js',
					enemy : host + 'src/modules/views/enemy.js',
					secretPart : host + 'src/modules/views/secretPart.js'
				}
				,main : host + 'src/app.js'
			}
		};


	function init(){
	/*	try
			{
				// try to prevet our libs from overwriting the current page's variables
				const __dollarSign = global.$;
				const __underscore = global._;
				const __backbone = global.Backbone;
			}
		catch(e)
			{*/
				
				global.__originalSiteLibs = {
					jQuery : global.jQuery,
					backbone : global.Backbone,
					underscore : global.underscore,
					soundManager : global.soundManager,
					$ : global.$
				};

				if(Object.freeze)
					{
						var lockerFn = typeof Object.seal == 'function' ? 'seal' : 'freeze';
						for(var lib in global.__originalSiteLibs)
							if(global.__originalSiteLibs.hasOwnProperty(lib) &&  typeof lib == 'object')
								Object[lockerFn](global.__originalSiteLibs[lib]);
						Object.freeze(global.__originalSiteLibs);
					}
		/*	}*/
		
		// load the stylesheet
		y.injectCss(modules.css);

		y([
			{
				test: typeof global.JSON == 'object' && global.JSON.stringify != undefined && global.JSON.parse != undefined,
	 			nope: modules.json
			},
			{
				test : (global.jQuery && global.jQuery.fn.jquery >= '1.7'),
				nope : modules.jquery 
			},
			{
				test : (global._ && global._.VERSION && global._.VERSION >= '1.3.3'),
				nope : modules.underscore
			},
			{
				test : (global.Backbone && global.Backbone.VERSION && global.Backbone.VERSION >= '0.9.2'),
				nope : modules.backbone
			},
			{
				test : (global.Raphael && global.Raphael.version && global.Raphael.version >= '2.1.0'),
				nope : modules.renderDependency
			},/*
			{
				// if it's firefox
				test : /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent),
				yep : modules.soundManager
			},*/
			{
				load : [
					
					
					modules.jqueryTransit,
					modules.jqueryWithinViewport,
					modules.app.main,

					modules.app.modules.config,
					modules.app.modules.util,
					modules.app.modules.router,

					modules.app.modules.renderingEngine,

					// models
					modules.app.models.cursor,
					modules.app.models.sidebar,
					modules.app.models.weapon,
					modules.app.models.enemy,
					modules.app.models.secretPart,

					// collections
					modules.app.collections.enemies,
					modules.app.collections.secretParts,

					// views
					modules.app.views.cursor,
					modules.app.views.sidebar,
					modules.app.views.weapon,
					modules.app.views.enemy,
					modules.app.views.secretPart
				],
				complete : function(){
					//call our init fn on dom ready
					global.jQuery(global.bw.init);
				}
			}
		]);
	};
	init();

	global.bw = bw;
})(this,this.yepnope,this.document);
