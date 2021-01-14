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
			
			

			// the sprite collection
			this.sprites = {};

			// initialize the sprites
			bw.$.each(this.model.get('sprites'),function(key,val){
				if(key == 'move')
					{
						bw.$.each(val, function(direction, o){
							var options = bw.$.extend(true,{}, self.model.get('spriteOptions'), 
											o.options, self.model.get('targetPoint').toJSON());

							var k = 'move' + direction.slice(0,1).toUpperCase() + direction.slice(1);
							self.sprites[k] = bw.stage.sprite(o.imgs, options);
							self.sprites[k].frames.toBack();
						});
					}
				else
					{
						/*if(key == 'die')
							val.imgs[0] = val.imgs[0].replace(/[^\/]+?\.gif$/, (new Date().getTime()) + '.gif');
*/
						options = bw.$.extend(true, {}, self.model.get('spriteOptions'), 
													val.options, self.model.get('targetPoint').toJSON());

						self.sprites[key] = bw.stage.sprite(val.imgs, options)
						self.sprites[key].frames.toBack();
					}

			});

			this.lifeBar = bw.stage.lifeBar(bw.$.extend(true, {}, this.model.get('lifeBar'), self.model.get('targetPoint')));

			bw.util.bringCursorToFront();

			this.bindEventHandlers();

			//well... render it
			this.render();

			this.updateLifeBar();

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

				sprite = this.currentSprite;
				sprite.frames.stop();
				sprite.pause()
			},this);
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
			if(action == 'stun')
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
			bw.$.each(this.sprites,function(i,sprite){
				sprite.frames.stop();
				sprite.stop();
				/*if(a)
					sprite.frames.attr(a);*/
			});

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
			else
				{
					/*if(this.model.isVirgin)
						{
							sprite.frames.attr({opacity : 0}).animate({opacity : 1}, 1000,function(){
								sprite.play();
							});
						}
					else*/

					sprite.frames.show();

					if(this.model.get('currentAction') != 'stun')
						sprite.play();
					else
						{
							bw.$.each(sprite.frames, function(i, el){
								if(i > 0)
									el.hide();
							});

							var center = this.getBBox(),
								target = this.model.get('targetPoint');

							center.x += center.width/2;
							center.y += center.height/2;

							bw.stage.textExplosion(new bw.util.point(center.x,center.y),{
								text : 'STUNNED!',
								duration : 1000
							});
						}

				}
			return this;
		},

		animatePosition : function(){
		//	console.log('animatePosition call');
			if(!this.currentSprite)
				{
	//				console.log('animatePosition fail');
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
			
			var callback = function(){
				self.currentPoint = p;
				self.model.trigger('endAction:move',self.model);
			};
			bw.$.each(this.sprites,function(i,el){
				el.frames.animate(p,actualSpeed, el == sprite ? callback : null);
			});
			this.lifeBar.set.animate(p,actualSpeed);
			return this;
		},

		updateLifeBar : function(callback){
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

			this.currentSprite.frames.show();

			var gifExplosionDuration = 2000,
				partChance = 0.75;

			setTimeout(callback, gifExplosionDuration);

			if(Math.random() > partChance)
				{
					bw.secretParts.addSecretPart(null,{
						x : this.sprites.die.frames[0].attrs.x,
						y : this.sprites.die.frames[0].attrs.y
					});
				}

			return this;

			var self = this,
				p = this.getCurrentPoint(),
				speed = this.model.get('speed'),
				sprite = this.currentSprite,
				frames = sprite.frames;

				sprite.pause();
				sprite.frames.stop().show();

			var	b = frames[0].getBBox(),
				easings = ['linear','<','>','<>','back-in','back-out','elastic','bounce'],
				bbox = (function(){
						
						w = new bw.util.point(bw.util.getWindowSize());
						p1 = new bw.util.point(b.x,b.y);
						p2 = new bw.util.point(b.width, b.height);
						offset = new bw.util.point(0,0);

				//	return [offset,w];

					p1.substract(p2.clone().divide({x:4,y:4}));
					p2.multiply({x:4,y:4}).add(p1);

					if(p2.x > w.x)
						offset.x = w.x - p2.x;
					else if(p1.x < 0)
						offset.x = p1.x;
					
					if(p2.y > w.y)
						offset.y = w.y - p2.y;
					else if(p1.y < 0)
						offset.y = p1.y;
					

					return [p1.add(offset), p2.add(offset)];
				})();
			
			



			bw.$.each(frames,function(i, f){
				var point = bw.util.getRandomPoint(bbox[0],bbox[1]),
					angle = (Math.random() > .5 ? 1 : -1) * Math.random() * 360 * 2,
					dist = point.dist(p),
					actualSpeed = actualSpeed = dist / speed * 1000,
					transform = f.transform() + 'r' + angle ,//+ ',' + ((b.x + b.width) / 2)+',' + ((b.y + b.height) / 2),
					randomEasing = easings[Math.round(Math.random() * (easings.length-1))],
					params = {
						x : point.x,
						y : point.y,
						transform : transform
					};
					f.animate(params, 1500, randomEasing, function(){
						f.animate({opacity : 0},100, i == 0 ? callback : null);
					});
			});

			return this;
		},

		addBodyParts : function(){
			var	b = this.sprites.moveUp.frames[0].getBBox(),
				p1 = new bw.util.point(b.x, b.y),
				p2 = new bw.util.point(b.x + b.width, b.y + b.height);

			bw.$.each('head leg torso'.split(' '), function(i, el){
				bw.secretParts.addBodyPart(bw.util.getRandomPoint(p1, p2), el);
			});
		},

		die : function(){
			var self = this;

			this.model.clearTimeout();
			this.stopSprites(true);

			this.sprites.die.options.loopCallback = function(){
				self.model.trigger('endAction:die', self.model);
			}

			this.sprites.die.show().play();

			this.updateLifeBar(function(){
			/*	var gifExplosionDuration = 2000;
				setTimeout(function(){
					self.addBodyParts();
				}, gifExplosionDuration / 2)*/
				self.addBodyParts();
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
		getBBox : function(){
			var s = this.currentSprite || this.sprites.moveUp;
			if(s && s.frames)
				return s.frames.getBBox();

			console.warn('no bbox');
			var p = this.model.get('targetPoint');
			return {x:p.x,y:p.y,width:150 + p.x,height : 150 + p.y};
		},

		// fn that returns the current (even when animating) sprite position
		getCurrentPoint : function(){
			var f = this.currentSprite;
			if(f && f.frames && f.frames[0])
				return new bw.util.point(f.frames[0].attrs.x,f.frames[0].attrs.y);
			return this.currentPoint;
		},

		remove : function(){
			return this.destroy();
		},

		destroy : function(){

			bw.$.each(this.sprites,function(i, sprite){
				sprite
					.unbindEventHandlers()
					.stop()
					.frames
						.remove();
			});

			this.lifeBar.set.remove();

			bw.backbone.View.prototype.remove.apply(this, arguments);
		}
	};

	definitions.views = views;
	bw.definitions = definitions;
	global.bw = bw;
})(this);

