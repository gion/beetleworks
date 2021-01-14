(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var models = definitions.models || {};

	models.secretPart = {
		defaults : {
			sprite : {
				imgArray : [],
				options : {
					x : 0,
					y : 0,
					width : 0,
					height : 0,
					rate : 100
				}
			},

			star : {
				options : {
					innerRadius : 75,
					outerRadius : 50,
					pointCount : 12,
					fill : 'rgba(250,180,0,0.7)',
					src : 'assets/images/secret-parts/part-collected.png'
				},
				text : {
					text : 'PART \n collected', 
					x : 0,
					y : 0,
					font : '20px "Arial"'
				},
				duration : 1500
			},

			type : 'normal',

			score : 0,

			// the total time (including fadein/fadeout animations) after which this item dissapears from the screen 
			duration : 10000,

			// the fadein animation duration
			fadeInDuration : 1500,

			// the total fadeout animation duration (it includes the blink animations)
			fadeOutDuration : 2500,

			// the number of blink (fadeout/fadein) pairs before removing the element
			blinkIterations : 4,

			// the target point of this part
			point : {
				x : 0,
				y : 0
			}
		},

		initialize : function(){
			
			var sprite = this.get('sprite');

			sprite.options.x = this.get('point').x;
			sprite.options.y = this.get('point').y;
			this.set('sprite', sprite, {silent : true});

			this.set('isBodyPart', this.get('sprite').type == 'bodyPart'); 
			
			if(!this.get('isBodyPart'))
				{
					var star = this.get('star');
					star.options.src = bw.util.normalizeLink(star.options.src);
					this.set('star', star);
				}
			else
				{
					//console.log('body part', this.attributes);
				}

			this
				.bindEventHandlers()
				.addView();
		},

		bindEventHandlers : function(){
			return this;
		},

		addView : function(){
			if(!this.view)
				new bw.views.secretPart({
					model : this
				});

			return this;
		},

		destroy : function(){
			if(this.view)
				{
					this.view.destroy();
					this.view = null;
				}
			bw.backbone.Model.prototype.destroy.apply(this, arguments);
		}
	};


	definitions.models = models;
	bw.definitions = definitions;
	global.bw = bw;
})(this);