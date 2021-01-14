// a snippet for quick copy-paste when creating new modules
(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var collections = definitions.collections || {};

	collections.enemies = {
		defaults : {

			// enables logging (mostly)
			debug : false

			// the time interval after which we span another bug
			,waveSpanInterval : 10 // seconds

			// chances (percentage) that the next spanned enemy should be a light one
			,lightEnemyChance : 0.5 // 50%

			// chances (percentage) that the next spanned enemy should be a medium one
			,mediumEnemyChance : 0.3 // 50%

			// chances (percentage) that the next spanned enemy should be a heavy one
			,heavyEnemyChance : 0.2 // 50%

			// the maximum number of enemies simultanious on the screen
			// @TO DO :
			// this number should depend on the screen size/level(points earned) 
			,maxEnemyCount : 4
			

		},
		
		_model : '_enemy',

		initialize : function(){
			// add to this model the possibility to
			// bind & trigger custom events
			bw._.extend(this, bw.backbone.Events);


			if(bw.$.browser.msie || bw.$.browser.mozilla)
				{
					var factor = 2;
					this.defaults.waveSpanInterval = this.defaults.waveSpanInterval * factor;
					this.defaults.maxEnemyCount = this.defaults.maxEnemyCount / factor;
				}


			this.stats = {
				totalEnemyCount : 0,
				waveCount : 0
			};

			this
				.bindEventHandlers()
				.startSpanningEnemies();

			this.latestEnemyEatTimestamp = null;
		},

		bindEventHandlers : function(){

			if(this.defaults.debug)
				{
					this.on('reset',function(){
						console.log('reset collection',arguments);
					});

					this.on('add',function(enemy){
						console.log('add from collection', arguments);
					},this);

					this.on('remove',function(enemy){
						console.log('remove from collection', arguments);
					},this);
				}

			this.on('endAction',function(){
		//		console.log('all',arguments);
			});
			// assign a new task to the enemy (move/eat)
			this.on('add', this.assignTask, this);
			this.on('endAction:eat', function(){
				this.latestEnemyEatTimestamp = new Date();
			}, this);
			this.on('endAction:move endAction:eat endAction:stun', function(enemy){
		//		console.log('move-end',arguments);
				this.assignTask(arguments[0]);
			}, this);

			// remove the enemy after it exploded (died)
			this.on('endAction:die', function(enemy){

				// update the score with the value of the killed enemy
				bw.sidebar.incrementScore(enemy.get('score'));

				// remove the enemy after it died
				this.removeEnemy(enemy);
			}, this);

			this.on('remove', function(enemy, collection, options){

				// call the destructor
				enemy.destroy();
			}, this);

			
			this.on('change:life', function(enemy, life){
		//		console.log('beetleworx life : ', life);

				if(life <= 0)
					// trigger the dying process
					enemy.die();
			}, this);

			// when the weapon fires
			bw.weapon.on('change:active', function(weapon, activeState){
				if(!activeState)
					return;

				this.clickOnMap(weapon.get('coord'));

			}, this);



			return this;
		},


		clickOnMap : function(point){
			
			var self = this;

			this.each(function(el,i){
				if(self.clickedOnEnemy(el,point))
					{
						el.hit();
					}
			});
		},

		clickedOnEnemy : function(enemy, point){
			var bounds = enemy.view.getBBox(),
				result = (point.x >= bounds.x 
						&& point.x <= bounds.x + bounds.width
						&& point.y >= bounds.y
						&& point.y <= bounds.y + bounds.height);

			return result;
		},

		// function that adds an enemy to the collection
		// it takes the enemy type (light/medium/heavy) as arguments
		// if not provided, it will default to lightEnemy
		addEnemy : function(type,attrs){
			// for PHASE 1 we only need light enemyes:D
		//	var enemyClass = (type || 'light') + 'Enemy',
		//	var enemyClass = 'lightEnemy',

		// for PHASE 2 we need only light & medium enemies
			var enemyClass = (Math.random() > .5 ? 'light' : 'medium') + 'Enemy',
				options = bw.$.extend({},attrs);

			this.each(function(){});

		//	console.log(options,enemyClass,bw.models[enemyClass],enemy);

			this.add( new bw.models[enemyClass](options));

			return this;
		},

		// fn that removes an enemy from this collection
		removeEnemy : function(enemy){

			// prevent the enemy from executing any other timed tasks
			enemy.clearTimeout();

			// remove the enemy from this collection
			this.remove(enemy);
			return this;
		},

		spanEnemy : function(){
			// do not span an enemy if the max enemy count is reached
			if(this.length >= this.defaults.maxEnemyCount)
				return this;

			var chance = Math.random();

			if(chance >= this.defaults.lightEnemyChance + this.defaults.mediumEnemyChance)
				var type = 'heavy';
			else if(chance >= this.defaults.lightEnemyChance)
				type = 'medium';
			else
				type = 'light'


			var w = new bw.util.point(bw.util.getWindowSize()),
				m = this.first(),
				diff = new bw.util.point({
					x :  50 + bw.weapon.get('ray').offsetLeft + (!!m ? m.get('sprites').move.up.options.height : 200),
					y :  50 + bw.weapon.get('ray').offsetLeft + (!!m ? m.get('sprites').move.up.options.width : 200)
				}),
				point = bw.util.getRandomPointOutsideWindow();

			// prevent the enemies from being spanned under the weapon
			while(point.x > diff.x || point.y > diff.y)
				point = bw.util.getRandomPointOutsideWindow();

			this.addEnemy(type, {
				targetPoint : point
			});

			return this;
		},

		spanEnemies : function(n){
			var self = this;


			bw._.times(n,function(){
				self.spanEnemy();
			});
		},

		spanWave : function(){
			this.spanEnemies(this.getWaveEnemyCount());
			this.stats.waveCount++;

			return this;
		},

		startSpanningEnemies : function(){
			var self = this;

			this._waveSpanInterval = setInterval(function(){
				self.spanWave.call(self);
			}, this.defaults.waveSpanInterval * 1000);

			// span one right away
			this.spanWave();

			return this;
		},

		stopSpanningEnemies : function(){
			if(this._waveSpanInterval)
				global.clearInterval(this._waveSpanInterval);

			return this;
		},

		getWaveEnemyCount : function(){
			return Math.min(this.defaults.maxEnemyCount - this.length, 1 + this.stats.waveCount);
		},



		assignTask : function(enemy){
			if(!enemy)
				{
					console.error('wtf?');
					return this;
				}

			var moveChance = enemy.get('moveCance'),
				eatChance = enemy.get('eatChance'),
				action = 'eat',
				queuedAction = enemy.get('queuedAction');

			var applyingRule = enemy.getApplyingRule();

			// if we have a rule that applies to our needs
			// and it wasn't already applied on the previous fn call
			if(applyingRule != null && enemy.get('latestAppliedRule') != enemy.get('hitCount'))
				{
					if(applyingRule.speedMultiplier == 0)
						{
							// stunnthe enemy and let him be!
					//		console.log('should stun', enemy);
							enemy.stun.call(enemy);
							return this;
						}
					else if(applyingRule.speedMultiplier)
						{
							var initialSpeed = enemy.get('initialSpeed');
							enemy.set('speed', applyingRule.speedMultiplier * initialSpeed);

							// make sure the next action is a movement one, (only if a queued action is not present)
							// so that the speed diff is visible
							moveChance = 1;
						}
					enemy.set('latestAppliedRule', enemy.get('hitCount'));
				}




		//	console.log(enemy.get('life'), enemy.get('isDying'));

		
			/*
			switch(enemy.get('type')){
				case 'light' :
					eatChance = 0.5;
					break;
					
				case 'medium' :
					eatChance = 0.5;
					break;
					
				case 'heavy' :
					eatChance = 0.8;
					break;

				default : 
					eatChance = 0.5;
			}*/

			var canEat = !bw.ended && !(this.latestEnemyEatTimestamp != null && (new Date().getTime()) - this.latestEnemyEatTimestamp.getTime() < bw.config.maxEatingInterval);

			if(canEat && queuedAction !== null)
				{
		//			console.log('queuedAction', queuedAction.action);
					switch(queuedAction.action){
						case 'eat':
							enemy.eat.call(enemy, queuedAction);
							break;

						case 'goEat':
							try{
								enemy.goEat.call(enemy);
							}catch(e){
								enemy.set('queuedAction', {
									action : 'move'
								});
								this.assignTask(enemy);
							}
							break;

						case 'move':
							var w = new bw.util.point(bw.util.getWindowSize()),
							m = this.first(),
							diff = new bw.util.point({
								x :  50 + bw.weapon.get('ray').offsetLeft + (!!m ? m.get('sprites').move.up.options.height : 200),
								y :  50 + bw.weapon.get('ray').offsetLeft + (!!m ? m.get('sprites').move.up.options.width : 200)
							}),
							p = bw.util.getRandomPointExceptTheseZones([
								w.clone().substract(diff),
								w
							]);
							enemy.move.call(enemy, p);

							break;

					}

					enemy.set('queuedAction', null);
				}
			else
				{

					// if we can eat, move!
					if(!canEat)
						action = 'move';
					else
						{
							var chance = Math.random();

							if(chance <= moveChance)
								action = 'move';
							else
								action = 'eat';
						}

			//		console.log('new action => ', action);

					if(action == 'move')
						{
							var w = new bw.util.point(bw.util.getWindowSize()),
								m = this.first(),
								diff = new bw.util.point({
									x :  50 + bw.weapon.get('ray').offsetLeft + (!!m ? m.get('sprites').move.up.options.height : 200),
									y :  50 + bw.weapon.get('ray').offsetLeft + (!!m ? m.get('sprites').move.up.options.width : 200)
								}),
								p = bw.util.getRandomPointExceptTheseZones([
									w.clone().substract(diff),
									w
								]);
							enemy.move.call(enemy, p);
						}
					// gotta eat some stuff
					else if(action == 'eat')
						{
							// @TO DO :  
							//  - find the nearest eatable element 
							//  - move towords it
							//  - do not trigger "move-end"
							//  - eat it
							try{
								enemy.goEat.call(enemy);
							}catch(e){
								enemy.set('queuedAction', {
									action : 'move'
								});
								this.assignTask(enemy);
							}
						}
					/*else
						{
							enemy.die();
						}*/
				}

			

			return this;
		},

		// function that calls "assign task" on each of the collections elements
		reasignTasks : function(){
			var self = this;
			this.each(function(el){
				self.assignTask(el);
			});

			return this;
		},

		// funciton that returns an array of elements that are currently 
		// targeted to be eaten by the enemies
		getTargetedElements : function(){
			var r = this
				.filter(function(el){
					return el.get('targetedElement') != null;
				})
				.map(function(el){
					return el.get('targetedElement');
				});

	//		console.log('targetedElements',r);
			return r;
		}
	};

	definitions.collections = collections;
	bw.definitions = definitions;
	global.bw = bw;
})(this);