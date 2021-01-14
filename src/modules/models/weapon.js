(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var models = definitions.models || {};

	models.weapon = {
		defaults : {
			angle : 0,
			x : 100,
			y : 100,
			width : 100,
			height : 100,
			src : bw.config.host + 'assets/images/remote.png',
			activeSrc : bw.config.host + 'assets/images/remote_active.png',
			debug : false,
			ray :{
				imgs : {
					left : [
						bw.config.host + 'assets/images/weapon/ray/light-left-1.png',
						bw.config.host + 'assets/images/weapon/ray/light-left-2.png'
					],
					right : [
						bw.config.host + 'assets/images/weapon/ray/light-right-1.png',
						bw.config.host + 'assets/images/weapon/ray/light-right-2.png'
					]
				},
				width : 202,
				height : 124,
			   	offsetLeft : 200,
			   	innerOffset : {
			   		left : 10,
			   		right : 10,
			   		top : 0,
			   		bottom : 0
			   	}
			},
			fireDuration : 1000, // ms

			// when enabled, the cursor animation stops while the weapon is active
			stopCursorWhenActive : true
		},

		initialize : function(){
			// make a copy of the original src			
			this.set('originalSrc',this.get('src'));

			this.addView();
			
		/*	this.on('change',function(model,prop){
				if(model.get('debug'))
					{
						console.log('[debug]',arguments);
					}
			});*/
		},

		addView : function(){
			if(!this.view)
				new bw.views.weapon({
					model : this
				});

			return this;
		},

		updateCoord : function(point){
			this.set('coord',point);
			this.updateAngle(bw.util.getWeaponAngle(point));
		},

		updateAngle : function(deg){
			if(!deg)
				var deg = bw.util.getWeaponAngle(this.get('coord'));
			this.set('angle',deg);

			// deactivate the gun when the mouse moves
			if(bw.config.deactivateWeaponOnMouseMove)
				this.set('active', false);

			return this;
		},
		
		updatePos : function(){
			var p = bw.util.getWindowSize();
			this.set('x',p.width);
			this.set('y',p.height);

			return this;
		},
		
		activate : function(point){
			if(this._t)
				clearTimeout(this._t);

			if(point)
				this.updateCoord(point);
			else
				var point = this.get('coord');

			var self = this;
			this.set('active',true);
			this._t = setTimeout(function(){
				self.deactivate();
			},this.get('fireDuration'));

			return this;
		},
		deactivate : function(){
			if(this._t)
				clearTimeout(this._t);
			this.set('active',false);	

			return this;
		}
	};

	definitions.models = models;
	bw.definitions = definitions;
	global.bw = bw;
})(this)