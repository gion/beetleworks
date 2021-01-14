(function(global,undefined){
	var bw = global.bw || {};

	bw.name = 'beetleworx';

	bw.init = function(){
		// remove jquery from the global namespace
		bw.jquery = bw.$ = global.jQuery.noConflict(true);	

		// remove underscore from the global namespace
		bw.underscore = bw._ = global._.noConflict();

		// remove backbone from the global namespace
		bw.backbone = bw.b = global.Backbone.noConflict();	

		// set our jquery as the backbone dom lib
		bw.backbone.setDomLibrary(bw.jquery);

		bw.sm = bw.soundManager = global.soundManager;




		(function(Raphael){

		/*
		* raphael.shapes 0.0.2
		*
		* Copyright (c) 2009 Wout Fierens
		* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
		*/
		// extending raphael with a polygon function (to be used with raw SVG polygon data)
		Raphael.fn.polygon = function (cx, cy, points) {
			return this.path()
							.sett({
								type: "polygon",
								points: points
							})
							.translate(cx, cy);
		};

		// adding a n-gon element
		Raphael.fn.ngon = function (cx, cy, r, points) {
		return this.path()
						.sett({
							type: "ngon",
							r: r,
							points: points
						})
						.translate(cx, cy);
		}

		// adding a star element
		Raphael.fn.star = function (cx, cy, r1, r2, points) {
			return this.path()
							.sett({
								type: "star",
								r1: r1,
								r2: r2,
								cx : cx,
								cy : cy,
								points: points
							});//.translate(cx, cy);
		}

		// adding a star element
		Raphael.el.sett = function () {
			var setts = {};
			if (typeof arguments[0] == "string") 
				{
					setts[arguments[0]] = arguments[1];
				} 
			else if (arguments[0]) 
				{
					setts = arguments[0];
				}
			this.setts = bw.jquery.extend({},this.setts,setts);
			//console.log(this.setts);
			return this.attr("path", this[this.setts.type]());
		}

		// n-gon path function
		Raphael.el.ngon = function () {
			var points = [],
			n = this.setts.points,
			r = this.setts.r,
			part = 360 / n;
			for(var i=0;i<n;i++)
			{
				var a = i * part - 90,
					x = r * Math.cos(a * Math.PI / 180),
					y = r * Math.sin(a * Math.PI / 180);
				points.push((i == 0 ? "M" : "L") + x + "," + y);
			}
			points.push("Z");
			return points.join(" ");
		}

		// star path function
		Raphael.el.star = function () {
			var points = [],
				n = this.setts.points,
				r1 = this.setts.r1,
				r2 = this.setts.r2,
				cx = this.setts.cx,
				cy = this.setts.cy,
				part = 360 / n;
			for(var i=0;i<n;i++)
				{
					var a = i * part + 90,
						x = r1 * Math.cos(a * Math.PI / 180) + cx,
						y = r1 * Math.sin(a * Math.PI / 180) + cy;
					points.push((i == 0 ? "M" : "L") + x + "," + y);
					a += part / 2;
					x = r2 * Math.cos(a * Math.PI / 180)+ cx, y = r2 * Math.sin(a * Math.PI / 180)+ cy, points.push("L" + x + "," + y);
				};
			points.push("Z");
			return points.join(" ");
		}

		// polygon function
		Raphael.el.polygon = function () {
			var poly_array = ["M"];
			$w(this.setts.points).each(function (point, i) {
				point.split(",").each(function (c) {
					poly_array.push(parseFloat(c));
				});
				if (i == 0) poly_array.push("L");
			});
			poly_array.push("Z");
			return poly_array.compact();
		}

	})(Raphael);

		// remove raphael from the global namespace (ninja mode activated :)) )
		bw.raphael = global.Raphael;//.ninja();

		try
			{
				if(global.__originalSiteLibs && Object.isFrozen && Object.isFrozen(global.__originalSiteLibs))
					bw.$.extend(global,global.__originalSiteLibs);
				delete global.__originalSiteLibs;
/*				
				global.$ = global.__dollarSign;
				global._ = global.__underscore;
				global.Backbone = global.__backbone;
				global.Raphael = global.__raphael;

				delete global.__dollarSign;
				delete global.__underscore;
				delete global.__backbone;
				delete global.__raphael;*/
			}
		catch(e)
			{
				// bummer, that didn't work
				// looks like we've overwriten or introduced some libs into the current site
			//	console.error(e);
			}


		if(bw.$.browser.msie && bw.$.browser.version < 9)
			alert("You're using Internet Explorer " + bw.$.browser.version + 
			  	", thus the game might have performance issue.\n" +
			  	"In order to fully take advantige of the game experience, " +
			  	"we recommend you use a modern browser (chrome/firefox/ie9)");

		// make the bw namespace act like an event dispatcher
		bw._.extend(bw, bw.backbone.Events);

		bw.config.init();

		bw.util.init();


		if(bw.$.browser.msie)
			bw.util.forceIE9();

		if(bw.$.browser.chrome)
			{
				bw.$('html').addClass('google-chrome');
			}




		bw._initSound();

		bw._initDom();

		bw._initMVCComponents();

		bw._initMVC();
		
		bw._bindEventHandlers();

		bw.processDom();

		bw.history = bw.backbone.history;
		bw.history.start(bw.definitions.history);

		// initialize the position/size of the component
		bw.dom.window.triggerHandler('resize.bw');

		bw.navigate('game');


	
		return this;
	}

	bw._bindEventHandlers = function(){

		bw.dom.window
			.on('resize.bw scroll.bw', function(e){
				if(bw.config.reParseDomOnViewportChange)
					{
						bw.util.markDestroyableElements();
					}
			})
			.on('resize.bw',function(e){
				var newSize = bw.util.getWindowSize();

				// resize overlay
				bw.dom.overlay.width(newSize.width);
				bw.dom.overlay.height(newSize.height);

				// update the stage size
				bw.stage.resize(newSize.width, newSize.height);

				bw.dom.grid.width(newSize.width * .96);
				bw.dom.grid.height(newSize.height * .96);
				bw.dom.grid.css({
					marginTop : newSize.height * .015,
					marginBottom : newSize.height * .015,
					marginLeft : newSize.width * .015,
					marginRight : newSize.width * .015
				});
				


				// reposition weapon
				bw.weapon.updatePos();
			})
			.on('mousemove.bw',function(e){
				var c = bw.util.getEventCoordinates(e,false,true),
					angle = bw.util.getWeaponAngle(c);

				
				
				
				bw.weapon.updateAngle(angle);
			})		
			.on('mouseup.bw', bw.stage.canvas, function(e){
				bw.mousedown = false;

			//	bw.weapon.deactivate();
			})
			.on('keyup', function(e){
				// hit escape
				if(e.keyCode == 27)
					bw.pause();
				switch(String.fromCharCode(e.keyCode).toLowerCase()){
					case 'p' :
						bw.sounds.background.pauseToggle();
						break;
				}

			})
			.on('blur', function(e){
				if(bw.config.pauseOnBlur)
					bw.pause();
			});

			bw.$(bw.stage.canvas).on('mousedown.bw', function(e){

				var target = bw.$(e.target),
					id = bw.dom.sidebar.attr('id');

				// do not activate the weapon if the event's target is the sidebar
				if(target.attr('id') == id || target.closest('#' + id).length > 0)
					{
						return;
					}

				var point = bw.util.getEventCoordinates(e);

				bw.mousedown = true;

				bw.weapon.activate(point);
			});
			

		bw.weapon.on('change:active',function(weapon, active){
			if(!active)
				return;
			
			bw.zapp();

		});


		// don't let them change the url
		bw.dom.window.get(0).onbeforeunload = function(){
			return 'The site is trying to modify the url.\n\
				This critical modifocation will interrupt your game.\n\
				Do you wish to proceed?';
		}

		bw.dom.window.get(0).onerror = function(){
			if(console && console.error)
				console.error('[ERROR]',arguments);
		}


		// custom internal events
		bw
			.on('score:increment', function(score, point){
				bw.addScore(score, point);
			}, this);
	}

	bw._initSound = function(){
		
		bw.sounds = {
			_internal : {},
			_events : {
				onfinish : 'ended',
				onload : 'loadedmetadata'
			}
		};

		
		bw.soundObject = function(id, src, events){
			if(bw.sm)
				{ 
					var s = bw.sm.createSound(bw.$.extend({
						id : id,
						url : src
					}, events));
					return s;
				}

			this.stopped = false;
			this.id = id;
			this.ref = bw.sounds._internal[id];
			this.api = this.ref.api;
			this.bindEventHandlers(events);
		};

		bw.soundObject.prototype = {
			play : function(events){
				var self = this;
				this.stopped = false;
				try{
					if(events)
						this.bindEventHandlers(events);

					this.api.play();

				}catch(e){
					console.error(e);
				}
				return this;
			},
			stop : function(){
				this.stopped = true;
				try{
					this.api.pause();
					this.setCurrentTime(0);
				}catch(e){

				}
				return this;
			},
			pause : function(){
				this.stopped = true;
				this.api.pause();
				return this;
			},
			pauseToggle : function(){
				return this[this.stopped ? 'play' : 'pause']();
			},
			setCurrentTime : function(t){
				this.api.currentTime = t;

				return this;
			},
			bindEventHandlers : function(events){
				var api = this.api;
				if(api.addEventListener)
					bw.$.each(events, function(ev, handler){
						if(bw.sounds._events[ev])
							api.addEventListener(bw.sounds._events[ev], handler, false);
					});
				return this;
			}
		};
		bw.dummySoundObject = function(){};
		bw.$.each('play pause stop loop setCurrentTime setCurrentTime bindEventHandlers pauseToggle'.split(' '), function(i,k){
			bw.dummySoundObject.prototype[k] = function(){};
		});
		bw.sounds.createSound = function(o){



			if(!o.id)
				o.id = 'randomSoundId_' + (new Date()).getTime(); 

			var id = o.id;


			bw.sounds._internal[id] = {
				api  : typeof global.Audio == 'function' 
						? new global.Audio(o.url) 
						: bw.$('<audio />',{src:o.url}).get(0)
			};
			return new bw.soundObject(id, o.url, o.events);
		};
		bw.sounds.play = function(id){
			var sound = bw.sounds[id];
			if(sound /*&& sound.isReady*/)
				sound.play();
			return this;
		}
		bw.sounds._loopSound = function(sound){

			sound.api.loop = 'loop';
			
			if(sound.setCurrentTime)
				sound.setCurrentTime(0);

			sound.play();
/*
			sound.play({
				onfinish : function(){
					bw.sounds._loopSound(sound);
				}
			});*/
			return this;
		};
		bw.sounds.loop = function(id){
			var sound = bw.sounds[id];
			if(sound/* && sound.isReady*/)
				{
					bw.sounds._loopSound(sound);
				}
			return this;
		}
		bw.sounds.stop = function(id){
			var sound = bw.sounds[id];
			if(sound/* && sound.isReady*/)
				sound.stop();
			return this;
		}

		var soundManagerOptions = bw.$.extend({}, bw.config.soundManagerOptions, {
			onready : function(){
				bw.$.each(bw.config.sounds, function(name, src){
					bw.sounds[name] =  bw.config.enableSounds
											? bw.sounds.createSound({
													id : name,
													url : src,
													events : {
														onload : function(){
															bw.sounds[name].isReady = true;
														}
													}
												})
											: new bw.dummySoundObject();

					//bw.sounds[name].isReady = false;
				});
				if(bw.sounds.background)
					{
						
						if(!bw.config.enableBackgroundSound)
							bw.sounds.background = new bw.dummySoundObject();
						else
							bw.sounds.background.bindEventHandlers({
								onload : function(){
									bw.sounds.background.isReady = true;
									bw.sounds.loop('background');
								}
							});
					}

			}
		});



	//	console.log(soundManagerOptions);
		if(bw.sm)
			{
				bw.soundManager.setup(soundManagerOptions);
				bw.soundManager.onready = soundManagerOptions.onready;
			}
		else
			{
				// our own "sound manager"
				soundManagerOptions.onready();
			}
	};

	bw._initDom = function(){
		bw.dom = {
			window : bw.$(window),
			overlay : bw.$('<div />',{'class' : bw.config.className, id : bw.config.prefix + 'overlay'})
						.appendTo('body')
		};
		
		bw.stage = new bw.RenderingEngine(bw.dom.overlay.get(0),bw.util.getWindowSize());


		bw.dom.grid = bw.$('<div />',{'class' : bw.config.className, id : bw.config.prefix + 'grid'})
							.insertBefore(bw.stage.domCanvas);
		


		bw.dom.sidebar = bw.$('<div />',{'class' : bw.config.className, id : bw.config.prefix + 'sidebar'})
							.appendTo(bw.dom.overlay);

		// get the Maximum z-index on the page , 
		// so that we can move our layers on top of those elements
		bw.$('*').each(function(i,el){
			bw._maxZindex = Math.max((bw._maxZindex||1),(+bw.$(el).css('z-index')||0));
		});
		
		// outbid the highest z-index on page >:)
		bw._maxZindex = bw._maxZindex + 1;

		bw.dom.overlay.css({zIndex : bw._maxZindex});
	}

	bw._initMVCComponents = function(){
		bw.$.each('models,collections,views'.split(','),function(i,v){
			var module = bw[v] || {};
	//		console.log(v,module);

			var backboneName = v.slice(0,1).toUpperCase() + v.slice(1).toLowerCase().replace(/s$/,'');
			
			if(bw.definitions[v])
				{
					// initialize the components that do not extend any obj
					bw.$.each(bw.definitions[v],function(componentName,componentDefinition){
						if(!componentDefinition['extends'] || !componentDefinition._model)
							module[componentName] = bw.backbone[backboneName].extend(componentDefinition);
					});

					// initialize the components that extend (rely on) other components to exists
					bw.$.each(bw.definitions[v],function(componentName,componentDefinition){
						if(componentDefinition['extends'] && module[componentDefinition['extends']])
							module[componentName] = module[componentDefinition['extends']].extend(componentDefinition);
						if(componentDefinition._model)
							{
								componentDefinition.model = bw.models[componentDefinition._model];
		//						console.log(componentName,componentDefinition._model,bw.models[componentDefinition._model],componentDefinition.model);
								module[componentName] = bw.backbone[backboneName].extend(componentDefinition);
							}
					});
				}
			bw[v] = module;
		});

		
	};

	bw._initMVC = function(){

		bw.cursor = new bw.models.cursor;

		bw.sidebar = new bw.models.sidebar;	
		new bw.views.sidebar({
			el : bw.dom.sidebar,
			model : bw.sidebar
		});

		var weaponSize = {
			w : 495,
			h : 102
		};
		var windowSize = bw.util.getWindowSize();
		bw.weapon = new bw.models.weapon({
			debug : true,
			src : bw.config.host + 'assets/images/weapon/remote.png',
			activeSrc : bw.config.host + 'assets/images/weapon/remote_active.png',
			x : windowSize.width - weaponSize.w,
			y : windowSize.height - weaponSize.h,
			width : weaponSize.w,
			height : weaponSize.h,
			ray :{
				imgs : {
					left : [
						bw.config.host + 'assets/images/weapon/ray/light-left-1.png',
						bw.config.host + 'assets/images/weapon/ray/light-left-2.png'
					],
					right : [
						bw.config.host + 'assets/images/weapon/ray/light-right-1.png',
						bw.config.host + 'assets/images/weapon/ray/light-right-2.png'
					]
				},
				hitImage : {
					width : 200,
					height : 180,
					src : bw.config.host + 'assets/images/weapon/hit/electric_noMatte_forever.gif'
				//	src : bw.config.host + 'assets/images/weapon/hit/electric_matteWhite_forever.gif'
				},
				width : 202,
				height : 124,
			   	offsetLeft : 215,
			   	innerOffset : {
			   		left : 30,
			   		right : 30,
			   		top : 0,
			   		bottom : 0
			   	}
			}
		});


		bw.enemies = new bw.collections.enemies;
		bw.secretParts = new bw.collections.secretParts;

		var routerClass = bw.backbone.Router.extend(bw.definitions.router);
		bw.router = new routerClass();
		

		// this function will change the routes (trigger the controller)
		bw.navigate = function(route,o){

			// if `silentNavigation` is ON or no additional options provided, the navigation
			// will be done via history's `loadUrl` method to prevent the url from changing
			if(bw.config.silentNavigation || arguments.length == 1)
				return bw.history.loadUrl(route);
			return bw.router.navigate.apply(bw.router,arguments);
		}
	}

	// process the dom and remove/replace/add/normalize some components
	bw.processDom = function(){
		if(bw.config.replaceFlash)
			bw.util.replaceFlash();

		bw.util.markDestroyableElements();

		if(bw.config.parseDomInterval)
			{
				bw.parseDomInterval = setInterval(bw.util.markDestroyableElements, bw.config.parseDomInterval * 1000);
			}
	}

	// to do : destroy method :-?? 
	bw.destroy = function(){
		global.onbeforeunload = null;
		global.location.reload();
	}

	bw.zapp = function(){

		var point = bw.weapon.get('coord'),
			windowScroll = new bw.util.point(bw.util.getWindowScroll()),
			element = null,
			$element = null;

		//	point.add(windowScroll);


		// hide the overlay so that it isn't captured by the method
		bw.dom.overlay.hide();//css({visibility : 'hidden'});

		element = bw.util.getElementFromPoint(point.x, point.y);

		// restore the overlay's visibility
		bw.dom.overlay.show();//css({visibility : 'visible'});

		if(element == null)
			return;
		
		$element = bw.$(element);

	//	global.$el = $element;
	//	global.el = element;
	//	console.log(element);

//		el = $element;
		
		if($element.hasClass(bw.config.className + '-destroyable') && $element.attr('data-destroyableOptions'))
			{
				var isDestroyableElement = JSON.parse($element.attr('data-destroyableOptions'));
			}
		else
			isDestroyableElement = bw.util.isDestroyableElement(element);

	//	global.isDestroyableElement = isDestroyableElement;

		if(!!isDestroyableElement)
			{
				bw.util.removeElement(element);
				bw.trigger('score:increment', isDestroyableElement.score, point);
			}
	};

	bw.addScore = function(score, point){

		// show a floating text with the amount of points won
		bw.stage.domTextExplosion(point || bw.weapon.get('coord'),{
			text : '+' + score,
			duration : 1000,
			fill : '#00ffd8',
			'font-size' : 50,
			'font-weight' : 'normal',
			stroke : '#000000',
			'stroke-width' : '3px',
			'stroke-linecap' : 'butt',
			'stroke-linejoin' : 'miter',
			'stroke-opacity' : 1
		});

		// actually increment the score
		bw.sidebar.incrementScore(score);

		return this;
	}

	bw.pause = function(){
		alert(bw.config.pauseMsg);
		return this;
	}


	bw.end = function(){
		bw.ended = true;
		bw.config.congrats();
		throw new Error('[util.getNextDestroyableElement]: ... no more destroyable elements? :-/');		
	}
	global.bw = bw;
})(this);