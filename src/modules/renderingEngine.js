(function(global,undefined){
	var bw = global.bw || {};
	var RenderingEngine = function(node,o){
		this.stage = bw.raphael(node,o.width,o.height);
		this.node = node;
		this.canvas = this.stage.canvas;
		this.domCanvas = bw.$('<div id="beetleworx-dom-canvas"/>').insertBefore(this.canvas);
		this.elements = [];
	}

	RenderingEngine.prototype = {
		resize : function(w,h){
			this.stage.setSize(w,h);
			this.domCanvas.width(w);
			this.domCanvas.height(h);
			return this;
		},
		el : function(type){
			if(RenderingEngine.prototype[type] != 'function')
				return null;
			return RenderingEngine.prototype[type].apply(this,Array.prototype.slice.call(arguments,1));
		},
		path : function(){
			return this.stage.path.apply(this.stage,arguments);
		},
		image : function(src,o){
	//		console.log(arguments);
			return this.stage.image(src,o.x,o.y,o.width,o.height);
		},
		domImage : function(src,o){
	//		console.log(arguments);
			var img = bw.$('<img />').css({
				height : o.height,
				width : o.width
			});
			if(o.container)
				{
					img.appendTo(
						o.container
							.css({
								left : o.x,
								top : o.y
							})
					);
				}
			return img;
		},
		sprite : function(imgArray,o){
			return new sprite(this.stage,imgArray,o);
		},
		domSprite : function(imgArray,o){
			return new domSprite(imgArray,o);
		},
		star : function(pos, starOptions, textOptions){
			return new explosion(this.stage, pos, starOptions, textOptions);
		},
		star2 : function(pos, options){
			return new staticStar(this, pos, options);
		},
		lifeBar : function(o){
			return new lifeBar(o);
		},
		ray : function(o){
			return new ray(this.stage,o.src,o);
		},
		ray2 : function(o){
			return new ray2(this.stage,o.src,o);
		},
		ray3 : function(o){
			return new ray3(this.stage,o.src,o);
		},
		textExplosion : function(pos, o){
			return new textExplosion(this.stage,pos, o);
		},
		domTextExplosion : function(pos, o){
			return new domTextExplosion(pos, o);
		}
	};


	var sprite = function(stage,imgArray,options){
		
/*		if(imgArray.length < 2)
				throw 'cmon, need at least 2 images';
*/
		var self = this;

		this.stage = stage;
		this.imgArray = imgArray;
		this.frames = stage.set();
		this.options = bw.$.extend(true,{},this.defaults,options);
		this.frameIndex = 0;
		this.frame = null;
		this._t = null;

		var self = this;
		bw.$.each(this.imgArray,function(i,el){
			self.frames.push(
				bw.stage
						.image(el,self.options)
						.transform('t' + (-self.options.width/2) + ',' + (-self.options.height/2))
						.hide()
			);
		});

		this.$frames = bw.$(
			bw.$.map(this.frames,function(f){
				return f.node;
			})
		);

		this.bindEventHandlers();

		this.updateFrame(this.options.initialFrameIndex);
	}
	sprite.prototype = {
		bindEventHandlers : function(){
			if(!this.options.events)
				return this;

			var self = this,
				r = new RegExp('\.' + this.options.eventNamespace + '$');
		
			bw.$.each(this.options.events,function(eventName,handler){
				var ev =  r.test(eventName) 
							? eventName 
							: eventName + '.' + self.options.eventNamespace;
				self.$frames.on(eventName, handler);
		//		console.log(eventName, handler);
			});	

			return this;
		},
		unbindEventHandlers : function(){
			this.$frames.off('.' + this.options.eventNamespace);
			return this;
		},
		setFrameIndex : function(i){
			this.frameIndex = i % this.frames.length;
			return this;
		},
		setFrame : function(){
			this.frame = this.frames[this.frameIndex];
		},
		updateFrame : function(i){
			if(this.frames.length == 1)
				return this;

			this
					.setFrameIndex(i)
					.setFrame();
			bw.$.each(this.frames,function(i,f){
				/*if(f == this.frame)
					f.show();
				else*/
					f.hide();
			});
			this.frame.show();
			return this;
		},
		nextFrame : function(){
			return this.updateFrame(this.frameIndex + 1);
		},
		prevFrame : function(){
			return this.updateFrame(this.frameIndex - 1);
		},
		play : function(){
			if(this.frames.length == 1)
				{
					this.frames.show();
					return this;
				}
			this.stop();

			if(this.options.hideOnStop)
				this.frames[this.frameIndex].show();

			var self = this;

			this._t = global.setInterval(function(){
			//	console.log(self.frameIndex,);
				if(self.frameIndex == self.frames.length - 1)
					{
						if(typeof self.options.loopCallback == 'function')
							self.options.loopCallback();
						if(self.options.loop == false)
							return self.stop();
					}
				if(typeof self.options.hook == 'function')
					self.options.hook();
				self.nextFrame();
			},this.options.rate);

			return this;
		},
		pause : function(){
			global.clearInterval(this._t);
			return this;
		},
		stop : function(){
			global.clearInterval(this._t);

			if(this.options.hideOnStop && !this.frames[0].removed)
				this.frames.hide();

			return this;
		},
		show : function(){
			this.frames.show();
			return this;
		},
		hide : function(){
			this.frames.hide();
			return this;
		},
		animate : function(){
			this.frames.animate.apply(this.frames, arguments);
			return this;
		},
		destroy : function(){
			this.stop();
			this.frames.remove();
		},
		defaults : {

			// when the sprite stops, hide it
			hideOnStop : true,

			// loop through the frames
			loop : true,

			// the frame switch interval in ms
			rate : 100,

			// the first frame index after inisialisation
			initialFrameIndex : 0,

			x : 0,

			y : 0,

			width : 100,

			height : 100,

			eventNamespace : 'bw'
		}
	};



	var domSprite = function(imgArray,options){
		
/*		if(imgArray.length < 2)
				throw 'cmon, need at least 2 images';
*/
		var self = this;

		this.stage = stage;
		this.imgArray = imgArray;
		if(!options.container)
			options.container = $('<div class="beetleworx-dom-canvas-sprite-container"/>');
		this.frames = options.container;
		this.frames.appendTo(bw.stage.domCanvas);

		if(options.width && options.x)
			options.x -= options.width / 2;
		if(options.height && options.y)
			options.y -= options.height / 2;

		this.options = bw.$.extend(true,{},this.defaults,options);
		this.frameIndex = 0;
		this.frame = null;
		this._t = null;

		var self = this;
		bw.$.each(this.imgArray,function(i,el){
			bw.stage
					.domImage(el,self.options)
					.hide()
		});

		this.children = this.frames.children();

		this.bindEventHandlers();

		this.updateFrame(this.options.initialFrameIndex);
	}
	domSprite.prototype = {
		bindEventHandlers : function(){
			if(!this.options.events)
				return this;

			var self = this,
				r = new RegExp('\.' + this.options.eventNamespace + '$');
		
			bw.$.each(this.options.events,function(eventName,handler){
				var ev =  r.test(eventName) 
							? eventName 
							: eventName + '.' + self.options.eventNamespace;
				self.frames.on(eventName, handler);
		//		console.log(eventName, handler);
			});	

			return this;
		},
		unbindEventHandlers : function(){
			this.frames.off('.' + this.options.eventNamespace);
			return this;
		},
		setFrameIndex : function(i){
			this.frameIndex = i % this.imgArray.length;
			return this;
		},
		setFrame : function(){
			this.frame = this.children.eq(this.frameIndex);
		},
		updateFrame : function(i){
			if(this.imgArray.length == 1)
				return this;

			this
					.setFrameIndex(i)
					.setFrame();
			this.children.not(this.frame.show()).hide();
			return this;
		},
		nextFrame : function(){
			return this.updateFrame(this.frameIndex + 1);
		},
		prevFrame : function(){
			return this.updateFrame(this.frameIndex - 1);
		},
		play : function(){
			if(this.frames.length == 1)
				{
					this.frames.show();
					return this;
				}
			this.stop();

			if(this.options.hideOnStop)
				this.frames[this.frameIndex].show();

			var self = this;

			this._t = global.setInterval(function(){
			//	console.log(self.frameIndex,);
				if(self.frameIndex == self.frames.length - 1)
					{
						if(typeof self.options.loopCallback == 'function')
							self.options.loopCallback();
						if(self.options.loop == false)
							return self.stop();
					}
				if(typeof self.options.hook == 'function')
					self.options.hook();
				self.nextFrame();
			},this.options.rate);

			return this;
		},
		pause : function(){
			global.clearInterval(this._t);
			return this;
		},
		stop : function(){
			global.clearInterval(this._t);

			if(this.options.hideOnStop && !this.frames[0].removed)
				this.frames.hide();

			return this;
		},
		show : function(){
			this.frames.show();
			return this;
		},
		hide : function(){
			this.frames.hide();
			return this;
		},
		animate : function(){
			this.frames.animate.apply(this.frames, arguments);
			return this;
		},
		destroy : function(){
			this.stop();
			this.frames.remove();
		},
		defaults : {

			// when the sprite stops, hide it
			hideOnStop : true,

			// loop through the frames
			loop : true,

			// the frame switch interval in ms
			rate : 100,

			// the first frame index after inisialisation
			initialFrameIndex : 0,

			x : 0,

			y : 0,

			width : 100,

			height : 100,

			eventNamespace : 'bw'
		}
	};



	var textExplosion = function(stage, pos, options){
		var self = this;
		this.stage = stage;

		this.options = bw.jquery.extend({},this.defaults,pos,options);
		this.text = this.stage.text(pos.x,pos.y,this.options.text).attr(this.options).hide();
		if(this.options.autoPlay)
			this.start();
	}

	textExplosion.prototype = {
		start : function(callback){
			var self = this;
			this.text.show().animate(
				this.options.animationParams,
				this.options.duration, 
				this.options.easing, 
				function(){
					if(typeof callback == 'function')
						callback();
					if(self.options.removeOnFinish)
						self.destroy();
				}
			);
			return this;
		},
		fadeOut : function(callback){
			this.stop().text.animate({opacity : 0},this.options.duration,this.optoins.easing,callback);
			return this;
		},
		stop : function(fast){
			this.text.stop();
			return this;
		},
		destroy : function(){
			this.text.remove();
		},
		defaults : {
			animationParams : {
				fill : 'red',
				transform : 's8,8',
				opacity : 0
			},
			'font-family' : 'Impact, Tahoma',
			duration : 400,
			easing : '',
			removeOnFinish : true,
			autoPlay : true
		}
	};


	var domTextExplosion = function(pos, options){
		var self = this;
		this.options = bw.jquery.extend({},this.defaults,pos,options);		
		if(!this.options.container)
			this.options.container = bw.stage.domCanvas;
		this.text = bw.$('<span class="beetleworx-dom-canvas-text-explosion" />')
						.text(this.options.text)
						.css({
							left : pos.x,
							top : pos.y
						})
						.addClass(this.options.className)
						.appendTo(this.options.container);
		if(this.options.autoPlay)
			this.start();
	}

	domTextExplosion.prototype = {
		start : function(callback){
			var self = this;
			this.text.show().animate(
				this.options.animationParams,
				this.options.duration, 
				this.options.easing, 
				function(){
					if(typeof callback == 'function')
						callback();
					if(self.options.removeOnFinish)
						self.destroy();
				}
			);
			return this;
		},
		fadeOut : function(callback){
			this.stop().text.animate({opacity : 0},this.options.duration,this.optoins.easing,callback);
			return this;
		},
		stop : function(fast){
			this.text.stop();
			return this;
		},
		destroy : function(){
			this.text.remove();
		},
		defaults : {
			animationParams : {
				top : '-=100px',
				opacity : 0,
				leaveTransforms : true,
		//		useTranslate3d : true,
				avoidTransforms : false
			},
			text : '',
			className : 'increase-score',
			duration : 1000,
			easing : '',
			removeOnFinish : true,
			autoPlay : true
		}
	};



	var staticStar = function(stage,pos,options){
		var self = this;
		this.stage = stage;

		this.options = bw.jquery.extend({},this.defaults,pos,options);
		this.pos = pos;
		this.pos.x -= this.options.width/2;
		this.pos.y -= this.options.height/2;
		this.options.x = this.pos.x;
		this.options.y = this.pos.y;
		this.image = this.stage.image(this.options.src, this.options).hide().toFront();
	}
	staticStar.prototype = {
		start : function(callback){
			this.image
					.transform('s0.1')
					.show()
					.animate({
							transform : ''
						},
						this.options.duration,
						this.options.easing,
						callback
					);
			return this;
		},
		stop : function(){
			this.image.stop();
			return this;
		},
		destroy : function(){
			this.image.remove();
			return this;
		},
		defaults : {
			duration : 1000,
			easing : 'elastic',
			width : 200,
			height : 165,
			x : 0,
			y : 0
		}
	};

	var explosion = function(stage,pos,starOptions,textOptions){
		var self = this;

		this.stage = bw.stage.stage;
		this.set = this.stage.set();

		this.pos = pos;
		this.textOptions = textOptions;
		this.starOptions = bw.jquery.extend({},pos,starOptions);

		this.textOptions.x = this.pos.x;
		this.textOptions.y = this.pos.y;

		this.star = self.stage.star(this.starOptions.x,this.starOptions.y,this.starOptions.innerRadius,this.starOptions.outerRadius,this.starOptions.pointCount).attr(this.starOptions);
		this.text = self.stage.text(this.textOptions.x,this.textOptions.y,this.textOptions.text).attr(this.textOptions);
		this.set.push(this.star,this.text).hide();
		this.stop();
	};

	explosion.prototype = {
		stop : function(){
			var center = (this.starOptions.x /*- this.starOptions.outerRadius*/) +','+(this.starOptions.y /*- this.starOptions.outerRadius*/);
			this.star.originalTransform = this.star.transform()+'';
			this.text.originalTransform = this.text.transform()+'';
			this.set.hide().transform('s0.1,0.1,' + center + 'r-720,' + center);
			return this;
		},

		start : function(callback){
		//	var center = this.starOptions.x + this.starOptions.outerRadius/2 +','+this.starOptions.y + this.starOptions.outerRadius/2;
			this.set.show().animate({
				transform : ''
			}, 500, callback);
			return this;
		},

		destroy : function(){
			this.set.remove();
		}
	};


	var ray = function(stage,src,o){
		this.src = src;
		this.stage = stage;
		this.set = this.stage.set();
		this.x = 0;
		this.width = 0;
		this.options = bw.$.extend({},this.defaults,o);
		this.on = false;
		this.timeouts = [];
	}
	ray.prototype = {
		addImage : function(){
			var img = bw.stage.image(this.src,this.options.imageOptions);
			this.set.push(img);
			return img;
		},
		animateImage : function(img){
			var self = this;
			img.animate({x:this.x},this.options.duration,function(){
				img.remove();
				if(self.on)
					self.animateImage(self.addImage());
			});
		},
		addImages : function(n){
			while((n--) > 0)
				this.addImage();
			return this;
		},
		removeImages : function(){
			while(this.set.length > 0)
				this.set.splice(0,1).remove();
		},
		play : function(){
			this.stop();
			this.on = true;
			var self = this;
			bw.$.each(this.set,function(i,el){
				el.attr('x',self.width + self.x);
				self.timeouts.push(
					setTimeout(
						function(){
							self.animateImage(el);
						},
						i * self.options.t
					)
				)
			});

			return this;
		},
		stop : function(){
			this.on = false;
			bw.$.each(this.timeouts,function(i,el){
				global.clearTimeout(el);
			});
			this.timeouts = [];
			return this;
		},
		defaults : {
			t : 100,
			imageOptions : {
				x : 400,
				y : 0,
				width : 100		
			}
		}
	}

	var ray2 = function(stage,src,o){
		this.options = bw.$.extend({},this.defaults,o);
		this.stage = stage;
		this.src = src;
		this.startSrc = this.options.startSrc || src;
		this.endSrc = this.options.endSrc || src;
		this.set = this.stage.set();
		this.init();
	}

	ray2.prototype = {
		init : function(){
			var self = this;

			// aux fn
			var getSrc = function(i){
				var src = self.src;
				if(i==0)
					src = self.startSrc;
				if(i == (self.options.frameCount-1)) 
					src = self.endSrc;
		//		console.log(i,src);
				return src;
			};

			for(var i=0;i<this.options.frameCount-1;i++)
				this.set.push(
					this.stage
						.rect(0,0,0,0)
							.attr({
								'stroke-width' : '0',
								'stroke' : 'transparent',
								fill : 'url('+ getSrc(i) +')'
							})
							.toBack()
							.hide()
				);
			this.last = this.stage.image(this.src,0,0,0,0);
			this.set.push(this.last);

			this.patternSelector = '';
			for(var i=0;i<this.set.length;i++)
				{
					var fill = this.set[i].node.getAttribute('fill');
					if(fill)
						this.patternSelector += ',' + fill.toString().replace(/^url\((#.*?)\)$/,'$1');
				}
			this.patternSelector = this.patternSelector.substring(1);

			

		},
		updatePos : function(x,y){
			if(this._t)
				clearTimeout(this._t);

			var self = this,
				p = new bw.util.point(x,y),
				windowSize = new bw.util.point(bw.util.getWindowSize()),
				rawAngle = bw.util.getWeaponAngle(p),
				angle = (rawAngle + 180) % 360,
				_width = windowSize.dist(p) - this.options.offsetLeft,
				width =  Math.max(this.options.width, _width),
				height = this.options.height - this.options.offsetTop,
				translation = 't'+ this.options.offsetLeft +',' + this.options.offsetTop,
				rotation = 'r' + angle + ',' + windowSize.x + ',' + (windowSize.y),// + this.options.height / 2),
				transformation = rotation + translation;

			this.position = p;


			this.set.attr({
				x : windowSize.x
				,y : windowSize.y - this.options.height / 2
				,width : width
				,height : height
		//		,'clip-rect' : '0 0 ' + width + ' ' + this.options.height
			});

			this.set.transform(transformation);

			var pace = this.options.width / this.set.length * 2;
			//var pace = width % this.options.width / this.options.frameCount;
			var hiddenFrames = [];
			for(var j = 0;j < this.set.length / 3;j++)
				hiddenFrames.push(this.getRandomFrame());

			this.last.toFront();

			for(var i=0;i<=this.set.length-2;i++)
				{
					var el = this.set[i];

					if(bw.$.inArray(i,hiddenFrames) != -1)
						el.hide();
					else
						{
							var offset = Math.random() * (i * pace) + (i * pace);
							el
								.attr({
									width : Math.max(0, (width - offset) - ((width - offset) % this.options.width))
								})
								.transform(transformation + 't'+ offset +',0')
								.show();
						}

					if(i == 0)
						{
							el.attr({
								width : Math.min(this.options.width, _width)
							});
						}
					
					el.toFront();
				}

				var theOffset = width % this.options.width;
		//		console.log('t'+ (theOffset + this.options.offsetLeft) +',0');
				this.last
					.attr({
						width : Math.min(this.options.width, _width)
						,height : this.options.height
						,x : p.x
						,y : p.y - this.options.height / 2
					})
					.transform(
						'r' + rawAngle + ',' + p.x + ',' + p.y
						 + 't'+ (this.options.height / 2 - this.options.offsetLeft) +',' + (this.options.offsetTop)
					)
					.show();







			if(!this.patterns || this.patterns.length == 0)
				this.patterns = bw.$(this.patternSelector);

			bw.$.each(this.patterns,function(i,el){
				el.setAttribute('patternTransform',"");
			//	el.setAttribute('preserveAspectRatio',"xMidYMid slice");
				el.setAttribute('x',windowSize.x);
				el.setAttribute('y',windowSize.y - self.options.height / 2);
		//		el.setAttribute('patternUnits',"objectBoundingBox");
			});

			var self = this;
			if(this.on)
				this._t = setTimeout(function(){
					self.updatePos(x,y);
				},this.options.t);

			return this;
		},
		play : function(point){
			this.set.show();
			this.on = true;
			if(point)
				this.updatePos(point.x,point.y);
		},
		stop : function(){
			this.on = false;
			if(this._t)
				clearTimeout(this._t);
			this.set.hide();
			return this;
		},
		getRandomFrame : function(){
			return 1 + Math.round(Math.random() * (this.set.length - 2));
		},
		defaults : {
			frameCount : 6,
			height : 80,
			width : 200,
			t : 30,
			offsetLeft : 0,
			offsetTop : 0
		}
	};










/*third time*/
	var ray3 = function(stage,src,o){
		this.options = bw.$.extend({},this.defaults,o);
		this.stage = stage;
		this.set = this.stage.set();
		this.isHidden = true;
		this.init();
	}

	ray3.prototype = {
		init : function(){
			var self = this;

			this.imgs = {};
			bw.$.each(this.options.imgs, function(dir, arr){
				bw.$.each(arr, function(i, im){
					self.imgs[dir] = self.imgs[dir] || [];
					self.imgs[dir].push(self.stage.image(im,0,0,self.options.width,self.options.height).hide());					
				});
			});

			if(!bw.config.disableHitAnimation)
				this.hitImage = this.stage.image(this.options.hitImage.src,0,0,this.options.hitImage.width,this.options.hitImage.height).hide();

		},
		
		clearTimeout : function(){
			if(this._t)
				clearTimeout(this._t);
			return this;
		},

		setTimeout : function(fn, delay){
			this._t = setTimeout(fn, delay || this.options.timeoutDelay);
			return this;
		},

		clearSet : function(){
			this.clearTimeout();

			this.set.remove();
			this.set = this.stage.set();

			return this;
		},

		updatePos : function(x,y){
			this.clearSet();

			var self = this,
				p = new bw.util.point(x,y),
				windowSize = new bw.util.point(bw.util.getWindowSize()),
				rawAngle = bw.util.getWeaponAngle(p),
				angle = (rawAngle + 180) % 360,
				_width = windowSize.dist(p) - this.options.offsetLeft - this.options.innerOffset.left,
				widthWidthOffset = this.options.width - this.options.innerOffset.left - this.options.innerOffset.right,
				width =  Math.max(widthWidthOffset, _width),
				height = this.options.height - this.options.offsetTop,
				translation = 't'+ this.options.offsetLeft +',' + this.options.offsetTop,
				rotation = 'r' + angle + ',' + windowSize.x + ',' + (windowSize.y),// + this.options.height / 2),
				transformation = rotation + translation;

			this.position = p;


			this.set.attr({
				x : windowSize.x
				,y : windowSize.y - this.options.height / 2
				,width : width
				,height : height
		//		,'clip-rect' : '0 0 ' + width + ' ' + this.options.height
			});

			

			var imgCount = Math.floor(width / widthWidthOffset) + 1,
				leftOver = width % widthWidthOffset,
				widthScale = (leftOver / widthWidthOffset),
				imgTransform = 's' + (1 + widthScale) + ',1'; 

		//	console.log(imgCount,leftOver, widthScale, imgTransform, this.options.width, widthWidthOffset);

			var theOne = Math.round(Math.random() * (imgCount - 1));
			var x = 0;
			for(var i=0;i<imgCount;i++)
				{
					var a = this.imgs[i%2 ? 'left' : 'right'],
						clone = a[Math.round(Math.random() * (a.length - 1))]
									.clone()
									.hide()
									.attr({
										x : x
									});
					if(i == theOne)
						{
							clone.attr({
								width : widthScale * this.options.width
							});
							x += leftOver;
						}
					else
						x += widthWidthOffset;
				//	console.log(a,i%2 ? 'left' : 'right');
					this.set.push(clone);
				}
		//	this.set.transform(transformation);
			r.set.transform('r'+ angle +',' + windowSize.x + ',' + windowSize.y + 't'+ (windowSize.x + this.options.offsetLeft) + ',' + (windowSize.y - this.options.height/2 + this.options.offsetTop));
		//	console.log(transformation);
/*
			bw.$.each(this.set,function(i, img){
				console.log(img.transform() + imgTransform + ',' + img.attr('x') + ',' + img.attr('y'));
				if(window.__a == false)
					img.transform(img.transform() + imgTransform + ',' + img.attr('x') + ',' + img.attr('y'));
			});
*/	
			if(this.hitImage)
				r.set.push(
					this.hitImage.clone()
							.attr({
								x : this.position.x - this.hitImage.attrs.width/2,
								y : this.position.y - this.hitImage.attrs.height/2
							})
							.toBack()
				);

			return this;
		},
		play : function(point){
			if(point)
				this.updatePos(point.x,point.y);

			this.set.show();
			this.on = true;

			if(bw.config.disableRayAnimation == false)
				this.animate();

			return this;
		},
		animate : function(){
			var self = this;
			this.setTimeout(function(){
				self.toggleVisibility.call(self);
				self.animate.call(self);
			}, this.options.minAnimateDuration + Math.random() * (this.options.maxAnimateDuration - this.options.minAnimateDuration));
		},
		addHitImage : function(){
			},
		stop : function(){
			this.clearTimeout();
			this.on = false;
			this.set.hide();
			return this;
		},
		
		show : function(){
			this.set.show();
			this.isHidden =  false;
			return this;
		},

		hide : function(){
			this.set.hide();
			this.isHidden =  true;
			return this;
		},
		toggleVisibility : function(){
			return this[this.isHidden ? 'show' : 'hide']();
		},
		defaults : {
			timeoutDelay : 100,
			frameCount : 6,
			height : 80,
			width : 200,
			t : 30,
			offsetLeft : 0,
			offsetTop : 0,
			minAnimateDuration : 40,
			maxAnimateDuration : 160
		}
	};

	var lifeBar = function(options){
		this.stage = bw.stage.stage;
		this.options = bw.$.extend({}, this.defaults, options);
		this.set = this.stage.set();

		this.border = this.stage.rect(this.options.x, this.options.y, this.options.width, this.options.height)
						.attr({
							'stroke-width' : this.options.border,
							stroke : this.options.borderColor,
							fill : this.options.fill
						});

		this.life = this.stage.rect(this.options.x , this.options.y,this.options.width - this.options.border/4 , this.options.height - this.options.border/4)
						.attr({
							stroke : 'none',
							'stroke-width' : 0
						});


		this.set.push(this.border, this.life);
/*
		if(this.options.orientation == 'vertical')
			this.set.rotate(180);
*/
		this.set.transform('t' + this.options.offset.x + ',' + this.options.offset.y);
		this.percent = 0;

	}

	lifeBar.prototype = {
		show : function(){
			this.set.show();
		},
		hide : function(){
			this.set.hide();
		},
		animate : function(){
			this.set.animate.apply(this,arguments);
			return this;
		},
		stop : function(){
			this.set.stop();
			return this;
		},
		animateLife : function(p, callback){
			if(p != undefined)
				this.setPercent(p);
			this.life.animate(this.getAnimationParams(), this.options.duration,callback);
			return this;
		},

		setPercent : function(p){
			p = Math.abs(p);

			while(p > 1) 
				p /= 10;

			this.percent = p;

			return this;
		},

		getAnimationParams : function(percent){
			if(percent)
				this.setPercent(percent);

			var o = {	
				fill : this.getColor()
			};

			if(this.options.orientation == 'vertical')
				{
					o.height = this.getHeight();
			//		o.y = this.border.attrs.x this.options.height - o.height;
					o.transform = 't' + this.options.offset.x + ',' + (this.options.offset.y + this.options.height - o.height - this.options.border/2);
				}
			else
				{
					o.width - this.getWidth();
					o.transform = 't' + this.options.offset.x + ',' + this.options.offset.y;
				}
			
			return o;
		},

		// green => 100%
		// red => 0%
		// percent should be < 1 (56% => 0.56) 
		getColor : function(percent){
			if(percent)
				this.setPercent(percent);

			var max = 255, r, g, b = 0;

			if(this.percent < .5)
				{
					r = max;
					g = 2 * this.percent * max
				}
			else
				{
					g = max;
					r = max - (max - 2 * (0.5 - this.percent) * max) / 2;
				}
		/*	r = (1 - this.percent) * max;
			g = this.percent * max;
			b = max;*/
		//	console.log('rgb(' + r + ',' + g + ',' + b + ')');
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		},

		getWidth : function(percent){
			if(percent)
				this.setPercent(percent);

			return (this.options.width - this.options.border) * this.percent;
		},

		getHeight : function(percent){
			if(percent)
				this.setPercent(percent);

			return (this.options.height - this.options.border) * this.percent;
		},

		defaults : {
			x : 0,
			y : 0,
			width : 0,
			height : 0,
			border : 2,
			borderColor : '#000000',
			fill : 'none',
			duration : 500, // the animation duration in ms
			orientation : 'vertical' // or horizontal
		}
	};

	var verticalLifeBar = function(){

	};

	bw.RenderingEngine = RenderingEngine;
	global.bw = bw;
})(this)