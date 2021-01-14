(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var views = definitions.views || {};

	views.secretPart = {

		initialize : function(){
			this.model.view = this;
			this.sprite = bw.stage.sprite(this.model.get('sprite').imgArray, this.model.get('sprite').options)
									.stop();

			this.sprite.frames.toBack();
			bw.util.bringCursorToFront();
									
			this
				.bindEventHandlers()
				.addStar()
				.render();
		},

		bindEventHandlers : function(){

			this.model.on('change:active', function(model, active){
				if(active == true)
					return;

				if(this.model.get('score'))
					bw.trigger('score:increment', this.model.get('score'), new bw.util.point(this.sprite.options.x, this.sprite.options.y));
				
				if(!this.model.get('isBodyPart'))
					{
						bw.sounds.play('bonus');
						this.showBonusMessage();
					}
				
			}, this);

			return this;
		},

		addStar : function(){
			var spriteOptions = this.model.get('sprite').options,
				pos = new bw.util.point(spriteOptions.x - spriteOptions.width / 2, spriteOptions.y - spriteOptions.height / 2),
				o = this.model.get('star');

			o.options.src = bw.util.normalizeLink(o.options.src);

			this.star = bw.stage.star2(pos, o.options, o.text);

			bw.util.bringCursorToFront();
			return this;
		},

		render : function(){
			var self = this;

			var remove = function(){
					try{self.sprite.destroy.call(self.sprite);}catch(e){};
				},
				fadeIterations = this.model.get('blinkIterations'),
				animationIndex = 0,
				animation = bw.raphael.animation({opacity : 0},self.model.get('fadeOutDuration') * 2 / fadeIterations,function(){
					if(--fadeIterations > 0)
						return;
					remove();
				});

			this.sprite
					.frames
						.hide()
						.attr('opacity', 0)
						.show()
						.animate({opacity : 1}, self.model.get('fadeInDuration'), function(){
							self.sprite.play();
							self.timeout = setTimeout(function(){
								try{
									self.sprite.frames.animate(animation.repeat(fadeIterations));
								} catch(e){
									// the sprite has already been removed by the user
									// and the animation is trying to reach a removed element
									remove();
								}
							}, self.model.get('duration') -  self.model.get('fadeInDuration') -  self.model.get('fadeOutDuration'));
						});

			return this;
		},

		getBBox : function(){
			return this.sprite.frames.getBBox();
		},

		remove : function(){
			clearTimeout(this.timeout);
			return this.destroy.apply(this, arguments);
		},

		showBonusMessage : function(){
			var star = this.star,
				duration = this.model.get('star').duration || 1000;
			if(star)
				star.start(function(){
					setTimeout(function(){
						star.image.animate({opacity : 0}, duration / 2, function(){
							star.destroy();
						});
					}, duration / 2);
				});
		},

		destroy : function(){
			try
				{
					this.sprite.destroy();
				} 
			catch(e)
				{
					// I'm already destroyed :-??
				}
			finally
				{
					bw.backbone.View.prototype.remove.apply(this, arguments);
				}
		}
	};

	definitions.views = views;
	bw.definitions = definitions;
	global.bw = bw;
})(this);