(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var views = definitions.views || {};

	views.sidebar =  {
	//	model : bw.models.sidebar,
		tagName : 'div',
		className : bw.config.className,
		template : '<div>'
						+ '<h1 id=\'beetleworks-sidebar-score\'><%= score %></h1>'
						+ '<a id="build-button" href="#" title="build"></a>'
						+ '<a id="share-button" href="#" title="share"></a>'
						+ '<a id="help-button" href="#" title="help"></a>'
						+ '<a id=\'sidebar-slider\' href="#"></a>'
						+ '<a id=\'pre-order-button\' href="#"></a>'				
						+ '<a id="toggle-sidebar" class="toggle-slide" title="toggle the sidebar"></a>'
					+ '</div>',
		//template : '<h1 id=\'beetleworks-sidebar-score\'><%= score %></h1><a href="#" class="toggle-slide">TOGGLE SLIDE</a>',
		
		// bind eventHandlers
		events : {
			'click .toggle-slide' : 'slideToggle',
			'click #help-button' : 'toggleHelp'
		},

		// the eventHandlers
		triggerBuilder : function(){
			// trigger the builder route-handler withouth modifying the url
			alert('build');
			//bw.router.trigger('builder');
		},

		toggleHelp : function(){
			bw.$('html').toggleClass('beetleworx-help-enabled');
		},

		// init fn
		initialize : function(){
			this.model.view = this;

			// render this view when the model changes
			this.model.bind('change', this.render, this);

			this.slideUp(true);

			this.$el.css({
				visibility : 'visible'
			});

			// slide down the panel
			this.slideDown();

			this.render();
		},

		// render the view
		render : function(){
			var data = this.model.toJSON();
			data.score = bw.util.fillSpaceWith(data.score, '0', this.model.get('scoreLength') - data.score.toString().length, true);
			
			this.$el.html(
				bw._.template(this.template)(data)
			);
		},

		// other fn
		slideUp : function(noAnimation){
			this.$el
					.stop(true,true)
					.animate({
						top : -this.$el.height()
					},{
						duration : noAnimation ? 0 : this.model.get('animationDuration'),
						complete : function(){
							
						}
					});
			
			this.latestSlideDirection = 'up';

			// maintain chaining
			return this;
		},

		slideDown : function(){
			this.$el
					.stop(true,true)
					.animate({
						top : 0
					},{
						duration : this.model.get('animationDuration'),
						complete : function(){
							
						}
					});

			this.latestSlideDirection = 'down';

			// maintain chaining
			return this;
		},

		slideToggle : function(e){
			bw.$('#toggle-sidebar').toggleClass('toggle-down');
			if(this.latestSlideDirection == 'down')
				{
					return this.slideUp();
				}
			this.stopEvent(e);

			return this.slideDown();
		},

		stopEvent : function(e){
			return bw.util.stopEvent(e, true);
		}
	};

	definitions.views = views;
	bw.definitions = definitions;
	global.bw = bw;
})(this)