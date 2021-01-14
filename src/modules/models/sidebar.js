(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var models = definitions.models || {};

	models.sidebar = {
		defaults : {
			// the games score
			score : 0

			// the length of the string that represents the score
			// eg : score "346" will be displayer as "00000346", where the "0" count
			// is equal to scoreLength - score.toString().length
			,scoreLength : 7
			,animationDuration : 1200// ms
			,sliderRefreshRate : 4000// ms
			,imgPath : bw.config.host + 'assets/images/sidebar/'
			,images : [
				'mickey-mouse.gif'
				,'Mickey-Mouse-Club.jpg'
				,'mickey-mouse-face.jpg'
			]
			,currentImageIndex : 0
			,currentImage : ''
			,preorderLink : 'http://www.disneystore.com/'
			,shareLink : 'http://facebook.com'
		},

		initialize : function(){
			var self = this;

			// update the slider image every `sliderRefreshRate` ms
			global.setInterval(function(){
				self.updateSlider.call(self);
			},this.sliderRefreshRate);


			// update the image when the image index changes
			this.on('change:currentImageIndex',function(model,index){
				model.set('currentImage',model.get('images')[index]);
			});

			// update the image index 
			// which updates the image
			// which triggers the view to render
			this.updateSlider();
		},

		incrementScore : function(points){
			return this.updateScore(+this.get('score') + (+points));
		},

		updateScore : function(newScore){

			// this will trigger a change event that will cause the view to render
			// so... there's nothing left for us to do here :D
			this.set('score', newScore);

			// maintain chainability
			return this;
		},

		updateSlider : function(){return;
			var newIndex = (this.get('currentImageIndex') + 1) % this.get('images').length;

			// same change thing. we're done :D
			this.set('currentImageIndex', newIndex);
		}
	};

	definitions.models = models;
	bw.definitions = definitions;
	global.bw = bw;
})(this)