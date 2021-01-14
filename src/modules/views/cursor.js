(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var views = definitions.views || {};

	views.cursor =  {
		initialize : function(){
			var self = this;

			this.model.view = this;
			this.svg = bw.stage.image(bw.config.host + this.model.get('image'),{
				x : (this.model.get('outerWidth') - this.model.get('innerWidth')) /2,
				y : (this.model.get('outerHeight') - this.model.get('innerHeight')) /2,
				height : this.model.get('innerHeight'),
				width : this.model.get('innerWidth')
			});

			this.setElement(this.svg.node);



			this.start();

			this.bindEventHandlers();
		
		},

		bindEventHandlers : function(){
			var self = this;
			bw.$(bw.stage.canvas)
				.on('mousemove', function(e){
					self.updateCursorPosition(e);
				});
		},
		start : function(){return this;
			var self = this,
				duration = this.model.get('duration');
			this.isStopped = false;
			this.svg
		//		.stop()
				.animate({
					"15%" : {
						transform : 't40,-30'
					},
				   "40%" : {
				   		transform : 't-40,40'
				   	},
				   "55%" : {
				   		transform : 't-40,-30'
				   	},
				    "85%" : {
				    		transform : 't30,20'
				    	},
					"100%" : {
							transform : 't0,0',
						    callback: function(){
						    	self.start.call(self);
						    }
						}
				   }, 
				   duration
			  	); 

			return this;
		},

		stop : function(){
			this.svg.stop();
			this.isStopped = true;
			return this;
		},

		getInnerOffset : function(){
			var t = this.svg.transform(),
				p = new bw.util.point(0,0);

			if(t.length > 0)
				 p.add({
					x : t[0][1],
					y : t[0][2]
				});

			return p;
		},

		getOuterOffset : function(){
			return new bw.util.point({
				x : this.model.get('outerHeight') / 2,
				y : this.model.get('outerWidth') / 2
			});
		},

		getOffset : function(){
			return this.getInnerOffset();//.substract(this.getOuterOffset());
		},

		updateOffset : function(){
			this.model.set('offset', this.getOffset());
			return this;
		},

		updateCursorPosition : function(e){
			var c = bw.util.getEventCoordinates(e, false, true);

			c.substract(new bw.util.point({
				x : this.model.get('innerHeight') / 2,
				y : this.model.get('innerWidth') / 2
			}));

			this.svg.attr(c);
			return this;
		}
	};

	definitions.views = views;
	bw.definitions = definitions;
	global.bw = bw;
})(this)