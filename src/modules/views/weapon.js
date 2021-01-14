(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var views = definitions.views || {};

	views.weapon =  {

		// init fn
		initialize : function(){
			var self = this;

			this.model.view = this;

			//well... render it
			this.render();

			// render this view when the model changes
			this.model.on('change:src', this.updateImage, this);
			this.model.on('change:active', this.changeActiveState, this);
			this.model.on('change:x', this.updatePos, this);
			this.model.on('change:y', this.updatePos, this);
			this.model.on('change', this.update, this);

			return this;
		},

		// render the view
		render : function(){
			this.renderingModel =  bw.stage.stage.set();

			this.image = bw.stage.image(this.model.get('src'),{
				x : this.model.get('x'),
				y : this.model.get('y'),
				width : this.model.get('width'),
				height : this.model.get('height')
			});
			this.activeImage = bw.stage.image(this.model.get('activeSrc'),{
				x : this.model.get('x'),
				y : this.model.get('y'),
				width : this.model.get('width'),
				height : this.model.get('height')
			}).hide();

			this.renderingModel.push(this.image);
			this.renderingModel.push(this.activeImage);
			window.r = this.ray = bw.stage.ray3(this.model.get('ray'));

			this.update();

			this.setElement(this.image.node);

			return this;
		},
		
		changeActiveState : function(){
			if(this.model.get('active'))
				{
					bw.sounds.play('fire');
				//	this.updateImage(this.model.get('activeSrc'));

					this.activeImage.show();
					this.image.hide();

			//		if(!bw.config.disableRay)
						this.ray.play(this.model.get('coord'));
				}
			else
				{
					this.ray.stop();	
				//	this.updateImage(this.model.get('src'));	

					this.image.show();	
					this.activeImage.hide();

					bw.sounds.stop('fire');		
				}

			return this;
		},

		// Update press & release states for the remote
		updateImage : function(src){
			if(!src)
				var src = this.model.get('src');
			this.renderingModel.attr('src', src);
			return this;
		},

		// update the weapon position (on window resize)
		updatePos : function(){
			this.renderingModel.attr({
				x : this.model.get('x') - this.model.get('width'),
				y : this.model.get('y') - this.model.get('height')
			});
			return this;
		},

		// update the rendering model's transformations
		update : function(){
			var w = this.model.get('width') / 2,
				h = this.model.get('height') / 2,
				s = bw.util.getWindowSize(),
				angle = this.model.get('angle'),
				translation = 't' + w + ',' + h,
				rotation = 'r' + angle + ',' + (s.width - w) + ',' + (s.height - h),
				transformation = translation + rotation;
				
			

			if(this.model.get('active'))
				{
					var point = this.model.get('coord');
				//	point.substract(new bw.util.point(bw.util.getWindowScroll()));
				/*	if(!bw.config.disableRay)
						this.ray.updatePos(point.x, point.y);
*/
					if(this.model.get('stopCursorWhenActive'))
						bw.cursor.view.stop();

					// if before activating the weapon the weapon was still active (aka click spam)
					// then the "active" flag was never false, meaning that the weapon angle
					// might have not been updated 
					// => update the weapon angle
			/*		console.log('previous : ', this.model.previous('active'));
					if(this.model.previous('active'))
						{
							this.renderingModel.transform(transformation);
						}*/
				}
			else
				{
					this.renderingModel.transform(transformation);
					if(this.model.get('stopCursorWhenActive') && bw.cursor.view.isStopped)
						bw.cursor.view.start();
				}

			return this;
		}
	};

	definitions.views = views;
	bw.definitions = definitions;
	global.bw = bw;
})(this)