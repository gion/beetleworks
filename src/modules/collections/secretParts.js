(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var collections = definitions.collections || {};

	collections.secretParts = {
		_model : 'secretPart',

		defaults : {
			secretPartSpanInterval : 10, // seconds

			maxSecretPartCount : 1,

			commonSecretPartChance : 0.6,

			rareSecretPartChance : 0.3,

			superRareSecretPartChance : 0.1
		},

		initialize : function(){
			this
				.bindEventHandlers();

			//	.startSpanningSecretParts();
		},

		bindEventHandlers : function(){
			// when the weapon fires
			bw.weapon.on('change:active', function(weapon, activeState){
				if(!activeState)
					return;

				this.clickOnMap(weapon.get('coord'));

			}, this);

			this.on('change:active', function(secretPart, active){
				if(active == true)
					return;
				this.removeSecretPart(secretPart);
			}, this);

			this.on('remove', function(secretPart){
				secretPart.destroy();
			}, this);

			return this;
		},

		clickOnMap : function(point){
			var self = this;

			this.each(function(el, i){
				if(self.clickedOnSecretPart(el, point))
					{
						el.set('active', false);
					}
			});
		},

		clickedOnSecretPart : function(part, point){
			var bounds = part.view.getBBox(),
				result = (point.x >= bounds.x 
						&& point.x <= bounds.x + bounds.width
						&& point.y >= bounds.y
						&& point.y <= bounds.y + bounds.height);

			return result;
		},

		addBodyPart : function(point, type){
			var options = {
				type : type,
				point : point
			};

			return this.addSecretPart('bodyPart', options);
		},

		// function that adds a secretPart to the collection
		// it takes the secretPart type (normal/rare) as arguments
		// if not provided, it will default to 'normal'
		addSecretPart : function(type, options){
			var types = 'bodyPart common rare superRare'.split(' '),
				o = {
					type : type || types[Math.round(Math.random() * (types.length-1))],				
					options : options					
				},
				secretPartOptions = {
					sprite : o,
					point : options.point || bw.util.getRandomPoint()
				};

			// generate sprite options based on the secret part type
			switch(o.type){

				// @TO DO:
				// well.. implement some logic!
				
					
				// this is the case of a body part that is NOT a secret part
				// it appears after a beetle is destroyed
				// since it has the same look & feel as the secret part, 
				// the "secretParts" collection will manage these ones also 
				case 'bodyPart' : 

					o.type = 'bodyPart';
					var bodyPartTypes = 'head leg torso'.split(' '),
						bodyPartType = (o.options.type && bw.$.inArray(o.options.type,bodyPartTypes) != -1) 
											? o.options.type
											: bodyPartTypes[Math.round(Math.random() * (bodyPartTypes.length - 1))];

					bodyPartType = bodyPartType.slice(0,1).toUpperCase() + bodyPartType.slice(1);

					o.imgArray = [
						bw.config.host + 'assets/images/enemy/body-parts/' + bodyPartType + '-active.png'
					];
					o.options.width = 40;
					o.options.height = 40;
					
					// NOTE :  these values should be in a config file	
					var minScore = 1, maxScore = 10;

					secretPartOptions.score = minScore + Math.round(Math.random() * (maxScore - minScore)); 
					if(bodyPartType == 'Torso')
						{
							o.options.width = 70;
							o.options.height = 70;
							secretPartOptions.score += 10;
						}
					break;

				case 'rare' : 
				case 'superRare' : 
				case 'common' : 
				default : 
					o.imgArray = [
						bw.config.host + 'assets/images/enemy/body-parts/Arm-active.png'
					];
					o.options.width = 78;
					o.options.height = 100;
					break;	
			}

		//	console.log(secretPartOptions.point+'');
			this.add(new bw.models.secretPart(secretPartOptions));
			return this;
		},

		// fn that removes an secretPart from this collection
		removeSecretPart : function(secretPart){

			// remove the secretPart from this collection
			this.remove(secretPart);
			return this;
		},

		spanSecretPart : function(){

			// do not span any secretPart if the max secretPart count is reached
			if(this.length >= this.defaults.maxSecretPartCount)
				return this;

			var chance = Math.random();

			if(chance >= this.defaults.commonSecretPartChance + this.defaults.rareSecretPartChance)
				var type = 'common';
			else if(chance >= this.defaults.commonSecretPartChance)
				type = 'rare';
			else
				type = 'superRare'

			var point = bw.util.getRandomPointOutsideWindow();

			this.addSecretPart(type, {
				targetPoint : point
			});

			return this;
		},


		startSpanningSecretParts : function(rightAway){
			var self = this;

			this._secretPartSpanInterval = setInterval(function(){
				self.spanSecretPart.call(self);
			}, this.defaults.secretPartSpanInterval * 1000);

			// span one right away
			if(rightAway)
				this.spanSecretPart();

			return this;
		},

		stopSpanningSecretParts : function(){
			if(this._secretPartSpanInterval)
				global.clearInterval(this._secretPartSpanInterval);

			return this;
		}
	}


	definitions.colections = collections;
	bw.definitions = definitions;
	global.bw = bw;
})(this);