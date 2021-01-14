(function(global,undefined){
	var bw = global.bw || {};
	var util = bw.util || {};

	util.init = function(){
		bw.$.extend(util,{

			// function that make relative links absolute by adding the host path from config
			normalizeLink : function(src){
				if(/^(http|www)/.test(src))
					return src;
				return bw.config.host + src;
			},

			indexOf : function(){
				return bw.$.inArray.apply(this,arguments);
			},

			// function that concatenates n chars to the end or beginning of the provided string
			fillSpaceWith : function(string, char, charCount, concatenateBeforeString){
				var s = (new Array(charCount + 1)).toString().replace(/,/g, char);
				return concatenateBeforeString
						? s + string
						: string + s;
			},

			getEventCoordinates : function(e, doNotNormalize, doNotAddCursorOffset){
				var p = new util.point(0,0),
					cursorOffset = bw.cursor.view.getOffset();

				if (e.pageX != undefined && e.pageY != undefined) 
					{ 
						p.x = e.pageX;
						p.y = e.pageY;
					}
				else 
					{ 
						p.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
						p.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
					}

				if(!doNotNormalize)
					{
						p.substract(util.getWindowScroll());
					}

				if(!doNotAddCursorOffset && cursorOffset)
					{
						p.add(cursorOffset);
					}
				return p;
			},


			preloadImages : function(imgArray,masterCallback){
				var l = imgArray.length,
					resultArr = [],
					callback = function(img){
						resultArr.push(img);
						if(--l > 0)
							return;
						if(typeof masterCallback == 'function')
							masterCallback(resultArr);
					}
				util.each(imgArray,function(i,src){
					util.preloadImage(src,callback,callback);
				});
			},


			preloadImage : function(src,success,error){
				var img = new Image();
				img.onload = function(){
					if(typeof success == 'function')
						success(img);
				};
				img.onerror = function(){
					if(typeof success == 'function')
						error(img);
				};
				img.src = src;
			},


			radToDeg : function(r){
	   			return r * 180 / Math.PI;
	   		},


	   		degToRad : function(deg){
	   			return deg * Math.PI / 180;
	   		},


	   		getWeaponAngle : function(p){
   				return new util.point(util.getWindowSize()).angle(new util.point(p));
	   		},

	   		// function that forces the cursor to bw drawn on top of other elements (aka highest z-index)
	   		bringCursorToFront : function(){
	   			if(bw.cursor)
	   				bw.cursor.view.svg.toFront();
	   			return this;
	   		},

			hasOnlyTextualChildren : function(element){
				if ( element.offsetLeft < -100 && element.offsetWidth > 0 && element.offsetHeight > 0 ) return false;
				if ( util.indexOf(bw.config.hiddenElements, element.tagName) != -1 ) return true;
				
				if ( element.offsetWidth == 0 && element.offsetHeight == 0 ) return false;
				
				var clientW = 0, clientH = 0, isPass = false;
				
				for ( var i = 0; i < element.childNodes.length; i++ ) {
					clientW = 0;
					clientH = 0;
					
					if(typeof element.childNodes[i].offsetWidth != 'undefined'){
						clientW += element.childNodes[i].offsetWidth;
						clientH += element.childNodes[i].offsetHeight;
					}
					
					if(clientW && clientH){
						isPass = true;
						break;
					}
				}
				
				if(!isPass){
					return true;
				}
				
				for ( var i = 0; i < element.childNodes.length; i++ ) {
					// <br /> doesn't count... and empty elements
					if (util.indexOf(bw.config.hiddenElements, element.childNodes[i].tagName) == -1 && element.childNodes[i].childNodes.length != 0) return false;
				}
				return true;
			},

			getWindowSize : function(doNotNormalize){
				var r = {
					width : bw.dom.window.width(),
					height : bw.dom.window.height()
				};
				if(!doNotNormalize)
					{
						r.width = Math.max(r.width, bw.config.minWindowWidth);
						r.height = Math.max(r.height, bw.config.minWindowHeight);
					}
				return r;
			},
			getWindowScroll : function(){
				return new util.point({
					y : bw.dom.window.scrollTop(),
					x : bw.dom.window.scrollLeft()
				});
			},

			// function that generates a random point within the specified bounderies (corners top-left & bottom-right)
			// if no boundery is specified, it will consist of the window size
			getRandomPoint : function(p1,p2){
				if(arguments.length == 0)
					{
						p1 = {x:0,y:0}
						p2 = util.getWindowSize();
					}
				p1 = new util.point(p1);
				p2 = new util.point(p2);

				return new util.point(
					p1.x + Math.random() * (p2.x -p1.x),
					p1.y + Math.random() * (p2.y -p1.y)
				);
			},

			getRandomPointExceptTheseZones : function(){
				var zones = Array.prototype.slice.call(arguments),p;

				while(true)
					{
						p = util.getRandomPoint();
						var ok = true;
						for(var i = 0;i<zones.length;i++)
							if(util.isPointInsideSquare(p, zones[i][0], zones[i][1]))
								{
									ok = false;
									break;
								}
						if(ok)
							return p;
					}
			},

			getRandomPointOutsideWindow : function(distanceToWindow){
				var d = distanceToWindow || 200,
					w = new util.point(util.getWindowSize()),
					a = Math.random() > 0.5 ? 'x' : 'y',
					b = a == 'x' ? 'y' : 'x';

				w[a]  = Math.random() * w[a];
				w[b] = (Math.random() > 0.5 ? -d : w[b] + d);

				return w;
			},

			// function that verifies if a given point is inside a square(defined by 2 points)
			isPointInsideSquare : function(p, squareLeftTop, squareRightBottom){
				return (p.x >= squareLeftTop.x && p.x <= squareRightBottom.x
					&& p.y >= squareLeftTop.y && p.y <= squareRightBottom.y);
			},

			stopEvent : function(e, shouldNotPreventDefault){

				if(e.stopImmediatePropagation)
					e.stopImmediatePropagation();


				if(e.stopPropagation)
					e.stopPropagation();

				/*if(shouldNotPreventDefault && e.preventDefault)
					e.preventDefault();
*/
				e.cancelBubble = true;

				return false;
			},

			getElementBBox : function(el, returnPoints){
				var $el = bw.$(el);
				var r = $el.offset(),
					w = $el.width(),
					h = $el.height();
				if(returnPoints)
					{
						return [new bw.util.point(r.left, r.top), new bw.util.point(r.left + w, r.top + h)];
					}
				return {
					x : r.left,
					y : r.top,
					height : h,
					width : w
				}
			},

			getElementCenter : function(el, doNotNormalize){
				var p = bw.util.getElementBBox(el, true),
					r = p[1].clone().substract(p[1].substract(p[0]).divide(2));
				if(doNotNormalize)
					return r;

				return r.substract(new bw.util.point(bw.util.getWindowScroll()));
			},

			getElementFromPoint : function(x,y){
				if(!document.elementFromPoint)
					return null;
				var el = document.elementFromPoint(x,y);
				return el;
			},
			removeElement : function(el){
				return bw.$(el).remove();
			},

			// fn that checks if a given element is removed from the dom
			isRemoved : function(el){
				!bw.$(el).closest('html').length;
			},


			// this fn will process the host dom in order
			// to prepare it for the bw shooting engine
			// for eg, this function will
			//	- replace the flash objects withouth WMODE set to transparent with images 
			//  - remove any media types from the dom (in order to ensure that only our app's audio is enabled)
			processDom : function(){
				var 
					// the jQuery lib ref
					$ = bw.jQuery,

					// the window (jquery obj) ref
					$window = bw.dom.window,

					// the bw app dom wrapper (jquery obj)
					$overlay = bw.dom.overlay;


				// @TO DO : ADD CODE HERE



				// maintain chainability
				return this;
			},

			// function that returns all the elements that might be destroyed
			getTargetedAllElements : function(){
				if(bw.ended)
					return bw.$();

				var siblings = bw.dom.overlay.siblings(),
					all = siblings
							.add(siblings.find('*'))
							.filter(function(i){
								return bw.$.inArray(this.tagName.toLowerCase(), bw.config.ignoredElements) == -1;
							});
				
				if(all.length == 0)
					bw.end();

				if(bw.config.returnTargetsWithinViewport)
					all = all.filter(':within-viewport');



				return all;
			},

			// function that checks if the given element is destroyable
			// returns false on failure and an object containing score & type on success
			isDestroyableElement : function(el){
				var element = el instanceof bw.$ ? el.get(0) : el; 
				var $element = el instanceof bw.$ ? el : bw.$(el);

				if(element && element.tagName)
					{
						if(element == bw.dom.overlay.get(0) || $element.closest(bw.dom.overlay).length > 0)
							{
								console.log('wtf???');
							}
						else
							{

								if(bw.$.inArray(element.tagName.toLowerCase(), bw.config.imgElements) != -1)
									{
										return {
											score : bw.config.score.img,
											type : 'image'
										};
									}
								else 
									{
										if(bw.$.inArray(element.tagName.toLowerCase(), bw.config.ignoredElements) == -1 
											&& bw.util.hasOnlyTextualChildren(element))
											{
												var wordCount = bw.$(element).text().split(/\s+/g).length;
												return {
													score : bw.config.score.word * wordCount,
													tag : 'text'
												};
											}
									}
							}
					}
				return false;
			},

			// function that sets some attributes to the element that has been identifyed as destroyable
			// in order to be easily targeted by enemyes
			markElementAsDestroyable : function(element, elementOptions){
				var $el = element instanceof bw.$ ? element : bw.$(element);
				/*if(element.tagName.toLowerCase() == 'embed')
					console.log(elementOptions);*/
				$el
					.addClass(bw.config.className + '-destroyable beetleworx-destroyable')
					.attr('data-destroyableOptions', JSON.stringify(elementOptions));
				//	.data('destroyableOptions', elementOptions);
				return $el;
			},



			markDestroyableElements : function(){
		//		console.log('markDestroyableElements');

				if(bw.ended)
					return bw.$();
				
				var all = bw.util.getTargetedAllElements().filter(function(i){
					var isDestroyable = bw.util.isDestroyableElement(this);
					if(isDestroyable !== false)
						{
							bw.util.markElementAsDestroyable(this, isDestroyable);
							return true;
						}
					return false;
				}); 
				if(bw.config.reassignEnemyTasksAfterParsingDom && bw.enemies)
					{
						bw.enemies.reasignTasks();
					}

				return all;
			},


			// function that returns a jQuery collection of all the marked elements
			getDestroyableElements : function(){
				if(bw.ended)
					return bw.$();

				var els = bw.$('.' + bw.config.className + '-destroyable');
				if(els.length == 0)
					{
						els = bw.util.markDestroyableElements();
					}
				if(els.length == 0)
					{
						bw.end();
					}
				return els;
			},

			// fn that returns the first marked destroyable element
			getNextDestroyableElement : function(){
				var r = bw.util.getDestroyableElements().get(0);
			//	console.log('next destroyable el',r);
				return r;
			},

			getRandomDestroyableElement : function(){
				var els = bw.util.getDestroyableElements();
				var i = Math.round(Math.random() * (els.length - 1));

				return els.get(i);				
			},

			getClosestDestroyableElement : function(point, filterOutElements){
				if(bw.ended)
					return bw.$();

				var p = new bw.util.point(bw.util.getWindowScroll()).add(point),
					all = bw.util.getDestroyableElements(),
					map;

				if(filterOutElements)
					{
						if(!filterOutElements instanceof bw.$)
							{
								var a = bw.$(filterOutElements[0]);
								bw.$.each(filterOutElements, function(i, el){
									if(i > 0)
										a.add(el);
								});
								filterOutElements = a;
							}
			//			console.log('filterOutElements', filterOutElements);
						all = all.not(filterOutElements);
					}

				if(bw.config.returnTargetsWithinViewport)
					{
						all = all.filter(':within-viewport');
					}

				if(all.length == 0)
					bw.end();

				map = bw.$.map(all,function(el, i){
					return {
						index : i,
						center : bw.util.getElementCenter(el)
					};
				})
				.sort(function(a, b){
					return p.dist(a.center) - p.dist(b.center);
				});
			//	console.log(map, all);
				return {
					el : all.get(map[0].index),
					point : map[0].center
				};
			},


			getLifeBarColor : function(percent){
				var max = 255, r, g, b = 0;

				if(percent < .5)
					{
						r = max;
						g = 2 * percent * max
					}
				else
					{
						g = max;
						r = max - (max - 2 * (0.5 - percent) * max) / 2;
					}
			/*	r = (1 - this.percent) * max;
				g = this.percent * max;
				b = max;*/
			//	console.log(percent,'rgb(' + r + ',' + g + ',' + b + ')');
				return 'rgb(' + r + ',' + g + ',' + b + ')';
		},

		replaceFlash : function(){
			/*var all = bw.util.getTargetedAllElements(),
				objects = all.find('object'),
				embeds = all.find('embed'),
				replacement = bw.$('<div class="beetleworx-flash-replacement" />'),
				replace = function(i, el){
					var $el = bw.$(el),
						w = $el.width(),
						h = $el.height(),
						r = replacement.clone();

					r
						.width(w)
						.height(h)
						.insertBefore($el);

					$el.remove();
				};
			
			objects
				.filter(function(el){
					var p = bw.$(el).find('param[wmode]');
					return !p || p.attr('wmode').toLowerCase() != 'transparent';
				})
				.each(replace);
*/

			bw.$("embed[wmode=window], embed:not([wmode])").attr("wmode", "opaque").wrap("<div/>").unwrap();
			bw.$("object:has(param[name=wmode][value=window]), object:not(:has(> param[name=wmode]))").each(object);

			function object() {
			  this.outerHTML = this.outerHTML.replace(/<(?:[^">]+|(["']).*?\1)*>/g, '$&<param name="wmode" value="opaque"/>');
			}


			return this;
		},

		forceIE9 : function(){
			var meta = bw.$('meta[http-equiv=X-UA-Compatible]');
			if(meta.length == 0)
				{
					meta = bw.$('<meta />',{
							'http-equiv' : 'X-UA-Compatible',
							'content' : 'IE=9; IE=8; IE=7; IE=EDGE'
						})
						.appendTo('head');
				}
			else
				{
					meta.attr('content','IE=9; IE=8; IE=7; IE=EDGE');
				}
			return this; 
		}

	});
		
		util.point = function(x,y){
			if(typeof x == 'object')
				{
					if(x.x != undefined)
						{
							this.x = x.x;
							this.y = x.y;
						}
					else if(x.left != undefined)
						{
							this.x = x.left;
							this.y = x.top;
						}
					else if(x.width != undefined)
						{
							this.x = x.width;
							this.y = x.height;
						}
				}
			else
				{
					this.x = x;
					this.y = y;
				}
		}
		util.point.prototype = {
			toString : function(){
				return '{x:' + this.x+', y:' + this.y+'}';
			},
			toJSON : function(){
				return {
					x : this.x,
					y : this.y
				};
			},
			clone : function(){
				return new util.point(this.x,this.y);
			},
			equals : function(p){
				return this.x == p.x && this.y == p.y;
			},
			add : function(p){
				if(p.x == undefined)
					return this.add({x:p,y:p});

				this.x += p.x;
				this.y += p.y;
				return this;
			},
			substract : function(p){
				if(p.x == undefined)
					return this.substract({x:p,y:p});

				this.x -= p.x;
				this.y -= p.y;
				return this;
			},
			multiply : function(p){
				if(p.x == undefined)
					return this.multiply({x:p,y:p});

				this.x *= p.x;
				this.y *= p.y;
				return this;
			},
			divide : function(p){
				if(p.x == undefined)
					return this.divide({x:p,y:p});

				this.x /= p.x;
				this.y /= p.y;
				return this;
			},
			dist : function(p){
				return Math.sqrt((p.x-this.x)*(p.x-this.x) + (p.y-this.y)*(p.y-this.y));
			},

			// this fn returns the angle between this point and the one provided as argument
			// !NOTE: this fn relies on Raphael.js
			angle : function(p){
				return bw.raphael.angle(this.x,this.y,p.x,p.y);
			}
		};

		util.triangle = function(p1,p2,p3,doNotResolve){
			this.A = p1;
			this.B = p2;
			this.C = p3;
			this.angle = {};
			if(!doNotResolve)
				this.resolve();
		}
		util.triangle.prototype = {
			resolveDist : function(){
				this.a = this.B.dist(this.C);
				this.b = this.A.dist(this.C);
				this.c = this.A.dist(this.B);
				return this;
			},
			resolveAngles : function(){
	   			this.angle.b = Math.acos((this.a * this.a + this.c * this.c - this.b * this.b) / (2 * this.a * this.c));
	   			this.angle.c = Math.asin((this.c * Math.sin(this.angle.b)) / this.b);
				this.angle.a = Math.PI - this.angle.c - this.angle.b;
				return this;
			},
			resolvePerimeter : function(){
				this.perimeter = this.a + this.b + this.c;
				return this;
			},
			resolveSurface : function(){
				this.surface = Math.sqrt(this.perimeter * (this.perimeter - this.a) * (this.perimeter - this.b) * (this.perimeter - this.c));
				return this;
			},
			resolve : function(){
				return this
						.resolveDist()
						.resolveAngles()
						.resolvePerimeter()
						.resolveSurface();
			},
			// this checks if a point is inside the triangle
			// http://www.dzone.com/snippets/point-inside-polygon
			isPointInside : function(pt){
				for(var c = false, poly = [this.A,this.B,this.C], i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
					((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
					&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
					&& (c = !c);
				return c;
			}
		};
		
	};

	bw.util = util;
	global.bw = bw;
})(this)