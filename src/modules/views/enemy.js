(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var views = definitions.views || {};

	views.enemy =  {
		// init fn
		initialize : function(){
			var self = this;

			this.model.view = this;

			this.currentPoint = this.model.get('targetPoint');
			
			this.addElement();			

			// the sprite collection
			this.sprites = {};

			// initialize the sprites
			bw.$.each(this.model.get('sprites'), function(key,val){
				if(key == 'move')
					{
						bw.$.each(val, function(direction, o){
							var options = bw.$.extend(true,{}, self.model.get('spriteOptions'), 
											o.options, self.model.get('targetPoint').toJSON(),{container : self.el});

							var k = 'move' + direction.slice(0,1).toUpperCase() + direction.slice(1);

							self.sprites[k] = bw.$('<div class="beetleworx-dom-canvas-sprite"/>')
													.css({
														height : options.height,
														width : options.width,
														marginLeft : -options.width / 2,
														marginTop : -options.height / 2
													})
													.hide()
													.appendTo(self.$el);

							bw.$.each(o.imgs, function(i, el){
								self.sprites[k].append('<img src="'+ el +'" alt="" class="beetleworx-dom-canvas-sprite-image"/>');
							});
						});
					}
				else
					{
						/*if(key == 'die')
							val.imgs[0] = val.imgs[0].replace(/[^\/]+?\.gif$/, (new Date().getTime()) + '.gif');
*/
						options = bw.$.extend(true, {}, self.model.get('spriteOptions'), 
													val.options, self.model.get('targetPoint').toJSON());

						
						self.sprites[key] = bw.$('<div class="beetleworx-dom-canvas-sprite"/>')
												.css({
													height : options.height,
													width : options.width,
													marginLeft : -options.width / 2,
													marginTop : -options.height / 2
												})
												.hide()
												.appendTo(self.$el);
							bw.$.each(val.imgs, function(i, el){
								self.sprites[key].append('<img src="'+ el +'" alt="" class="beetleworx-dom-canvas-sprite-image"/>');
							});
					}

			});

		var a = this.model.get('spriteOptions');
		this.$el.css({
			width : a.width,
			height : a.height
		});
		//	this.lifeBar = bw.stage.lifeBar(bw.$.extend(true, {}, this.model.get('lifeBar'), self.model.get('targetPoint')));

		//	bw.util.bringCursorToFront();

			this.bindEventHandlers();

			//well... render it
			this.render();

			this.updateLifeBar();

			return this;
		},
		addElement : function(){
			var el = bw.$('<div class="beetleworx-dom-canvas-sprite-container"><div class="beetleworx-dom-canvas-sprite-lifebar-wrapper"><div class="beetleworx-dom-canvas-sprite-lifebar-value"></div></div></div>').appendTo(bw.stage.domCanvas);
			this.lifeBar = el.find('.beetleworx-dom-canvas-sprite-lifebar-value');
			this.setElement(el.get(0));
			return this;
		},
		// attach the event handlers to the models events
		bindEventHandlers : function(){
			// render this view when the model changes
		//	this.model.on('change', this.update, this);
			this.model.on('change:currentAction', function(model, val){
				if(!val)
					return;
		//		if(model == bw.enemies.first())
		//			console.log('currentAction',model,val);
				// let him die already!
			/*	if(this.sprites.die == this.currentSprite)
					return;*/

				this.activateCurrentSprite();
			}, this);
			this.model.on('change:targetPoint', this.animatePosition, this);
			this.model.on('change:life', this.updateLifeBar, this);

		/*	this.model.on('endAction:move',function(){
				this.animatePosition();
			}, this);*/
			this.model.on('endAction:move endAction:eat',function(){
				if(!this.currentSprite)
					return;

				this.$el.stop();
			},this);
		},
		events : {
			'click' : 'clicked'
		},
		clicked : function(){
		//	this.model.trigger('clicked');
			console.log('clickkckckckckckckckck');
			this.model.hit();
			return this;
		},
		// render the view
		render : function(){
			this.update();
			return this;
		},

		// update the rendering model's transformations
		update : function(){
			
			return this;
		},

/*		getAllSprites : function(){
			var s = {};
			bw.$.each(this.sprites, function(i, s){
				if(i != 'move')
					s[i] = s;
			});

			bw.$.each(this.sprites.move, function(i, s){
				s['move' + i.slice(0,1).toUpperCase() + i.slice(1)] = s;
			});

			return s;
		},*/

		getCurrentSprite : function(){
			return this._getCurrentSprite() || this.sprites.moveUp;
		},
		_getCurrentSprite : function(){
			var action = this.model.get('currentAction') || 'move';
			if(!action)
				{
		//			console.log('no action!!!', this.model);
					return null;
				}
			if(action == 'stun' || action == 'eat')
				action = 'move';

			if(action == 'move')
				{
					var direction = this.model.get('direction');
					action = 'move' + direction.slice(0,1).toUpperCase() + direction.slice(1);
				}

			if(!this.sprites[action])
				throw 'the sprite "'+ action +'" does not exist!';

			this.currentSprite = this.sprites[action];
	//		console.log(this.model.get('currentAction'), action, this.currentSprite);
			return this.currentSprite;
		},

		// function that stops all the sprites animation
		stopSprites : function(doNotStopTheLifeBar){
			// let the men die!
			if(this.model.get('isDying'))
				return this;
/*			if(this.currentSprite)
				{
					var a = new bw.util.point(this.currentSprite.frames[0].attrs.x,this.currentSprite.frames[0].attrs.y);
				}*/
			this.$el.stop();
			return this;

			bw.$.each(this.sprites,function(i,sprite){
				sprite.frames.stop();
				sprite.stop();
				/*if(a)
					sprite.frames.attr(a);*/
			});

			return this;
			if(doNotStopTheLifeBar != true)
				{
					this.lifeBar.stop();
					this.lifeBar.animateLife();
				}
			return this;
		},

		// function that animates the current sprite
		activateCurrentSprite : function(){
			this.getCurrentSprite();
			if(!this.currentSprite)
				return;



			this.stopSprites();
			
			var point = this.getCurrentPoint();

			var sprite = this.currentSprite;
		//	sprite.frames.attr(point);


			if(this.model.get('currentAction') == 'die')
				this.die();
			else if(this.model.get('currentAction') != 'eat')
				{
					this.$el.children().not(sprite).not(this.lifeBar.parent().show()).hide();
					sprite.show();


					

					if(this.model.get('currentAction') == 'stun')
						{	
							var p = this.$el.position(),
								point = {
									x : p.left - sprite.width() / 2,
									y : p.top - sprite.height() / 2
								};
						//	alert('stun here');
							a= bw.stage.domTextExplosion(new bw.util.point(point),{
								text : 'STUNNED!',
								duration : 1000,
								className : 'stunned'
							});
				//			console.log(sprite, point, a);
						}
				}
			return this;
		},

		animatePosition : function(){
		//	console.log('animatePosition call');
			if(!this.currentSprite)
				{
					console.log('animatePosition fail');
					return this;
				}

			var self = this,
				p = this.model.get('targetPoint'),
				speed = this.model.get('speed'),
				sprite = this.currentSprite,
				frames = sprite.frames,
				currentPoint = this.currentPoint,
				dist = currentPoint.dist(p),
				actualSpeed = dist / speed * 1000;
			

			this.activateCurrentSprite();
			
			this.$el.animate({
				left : p.x,
				top : p.y,
				leaveTransforms : true,
				useTranslate3d : true,
				avoidTransforms : false
			},actualSpeed,function(){
				self.currentPoint = p;
				self.model.trigger('endAction:move',self.model);
			});

		//	this.lifeBar.set.animate(p,actualSpeed);
			return this;
		},

		updateLifeBar : function(callback){
			var percent = this.model.get('life') / this.model.get('initialLife');
			
			this.lifeBar.css({
				height :  (100 * percent) + '%',
				backgroundColor : bw.util.getLifeBarColor(percent)
			});
			if(percent == 0)
				{
					var lifeBar = this.lifeBar;
					lifeBar.css('opacity', 0);
					setTimeout(function(){
						lifeBar.parent().hide();
					},300);
				}

			if(typeof callback == 'function')
				callback();

			return this;


			var lifeBar = this.lifeBar,
				life = this.model.get('life'),
				percent = life / this.model.get('initialLife');
			
			if(!this.model.set('isDying'))
				this.lifeBar.stop();

			this.lifeBar.animateLife(percent, function(){
					if(life == 0)
						lifeBar.set.animate({
							opacity : 0,
							'fill-opacity' : 0
						}, 50, function(){
							lifeBar.set.hide();
						});
					if(typeof callback == 'function')
						callback();
				});
			return this;
		},

		explode : function(callback){
			if(!this.currentSprite)
				return;

			this.$el.children().not(this.sprites.die).not(this.lifeBar.parent().show()).hide();

			function showFrame(i, frames, delay, callback){
				if(i >= frames.length)
					return callback();

				frames.not(frames.eq(i).show()).hide();
				setTimeout(function(){
					showFrame(i+1, frames, delay, callback);
				}, delay);
			}

			var frames = this.sprites.die.children();

			showFrame(0, frames, this.model.get('explosionDuration') / frames.length, function(){
				if(typeof callback == 'function')
					callback();
			});

			if(Math.random() > partChance)
				{
					var p = this.sprites.die.position();
					setTimeout(function(){
						bw.secretParts.addSecretPart(null,{
							x : p.left,
							y : p.top
						});
					}, this.model.get('explosionDuration') / 2);
				}

			return this;
		},

		addBodyParts : function(){
			var	b = this.getBBox(this.sprites.moveUp),
				p1 = new bw.util.point(b.x - b.width / 3 , b.y - b.height / 3),
				p2 = new bw.util.point(b.x + b.width * 1.3, b.y + b.height * 1.3);

			bw.$.each('head leg torso'.split(' '), function(i, el){
				bw.secretParts.addBodyPart(bw.util.getRandomPoint(p1, p2), el);
			});

			// add a secret part
			// @TO DO: add this secret part based on the enemy moels's config (common/rare/super rare)
			bw.secretParts.addSecretPart('rare', {
				point : bw.util.getRandomPoint(p1, p2)
			});
		},

		die : function(){
			var self = this;

			this.model.clearTimeout();
			
/*
			this.sprites.die.options.loopCallback = function(){
				self.model.trigger('endAction:die', self.model);
			}*/

			this.$el.children().not(this.sprites.die.show()).not(this.lifeBar.parent().show()).hide();

			function showFrame(i, frames, delay, callback){
	//			console.log('showFrame', i, frames, delay, callback);
				if(i >= frames.length)
					return callback();

				frames.not(frames.eq(i).show()).hide();
				setTimeout(function(){
					showFrame(i+1, frames, delay, callback);
				}, delay);
			}

			var frames = this.sprites.die.children();

			showFrame(0, frames, this.model.get('explosionDuration') / frames.length, function(){
				self.model.trigger('endAction:die', self.model);
			});

			bw.sounds.play('explode');

			setTimeout(function(){	
				self.addBodyParts();
			},this.model.get('explosionDuration') / 2);

			this.updateLifeBar(function(){
			/*	var gifExplosionDuration = 2000;
				setTimeout(function(){
					self.addBodyParts();
				}, gifExplosionDuration / 2)*/
				
				/*self.explode(function(){
					self.model.trigger('endAction:die', self.model);
				});*/
			});/*
			bw.$.each(this.sprites, function(i, el){
				if(i != 'die')
					el.frames.hide();
			});*/

			this.model.set('isDying',true);

			return this;
		},

		// return the current sprite bounding-box
		getBBox : function(sprite){
			var s = sprite || this.currentSprite || this.sprites.moveUp,
				p = this.$el.position(),
				w = s.width(),
				h = s.height();
			return {
				x : p.left - w/2,
				y : p.top - h/2,
				width : w,
				height : h
			};
		},

		// fn that returns the current (even when animating) sprite position
		getCurrentPoint : function(){
			var p = this.$el.position();
			this.currentPoint = new bw.util.point({
				x : p.left,
				y : p.top
			});
			return this.currentPoint;
		},

		remove : function(){
			return this.destroy();
		},

		destroy : function(){

	/*		bw.$.each(this.sprites,function(i, sprite){
				sprite
					.unbindEventHandlers()
					.stop()
					.frames
						.remove();
			});

			this.lifeBar.set.remove();
*/
			bw.backbone.View.prototype.remove.apply(this, arguments);
		}
	};

	definitions.views = views;
	bw.definitions = definitions;
	global.bw = bw;
})(this);

