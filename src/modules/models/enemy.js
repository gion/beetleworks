(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var models = definitions.models || {};

	// the default enemy model
	models._enemy = {
		defaults : {
			sprites : {
				move : {
					up : {
						imgs : [
							'assets/images/enemy/movement/Up/up.gif'
						//	'assets/images/enemy/walkcycles/Up/Up_00000_1.gif'
							/*,
							'assets/images/enemy/walkcycles/Up/Up_00000.png',
							'assets/images/enemy/walkcycles/Up/Up_00001.png',
							'assets/images/enemy/walkcycles/Up/Up_00002.png',
							'assets/images/enemy/walkcycles/Up/Up_00003.png',
							'assets/images/enemy/walkcycles/Up/Up_00004.png',
							'assets/images/enemy/walkcycles/Up/Up_00005.png',
							'assets/images/enemy/walkcycles/Up/Up_00006.png',
							'assets/images/enemy/walkcycles/Up/Up_00007.png',
							'assets/images/enemy/walkcycles/Up/Up_00008.png',
							'assets/images/enemy/walkcycles/Up/Up_00009.png',
							'assets/images/enemy/walkcycles/Up/Up_00010.png',
							'assets/images/enemy/walkcycles/Up/Up_00011.png',
							'assets/images/enemy/walkcycles/Up/Up_00012.png',
							'assets/images/enemy/walkcycles/Up/Up_00013.png',
							'assets/images/enemy/walkcycles/Up/Up_00014.png',
							'assets/images/enemy/walkcycles/Up/Up_00015.png',
							'assets/images/enemy/walkcycles/Up/Up_00016.png',
							'assets/images/enemy/walkcycles/Up/Up_00017.png',
							'assets/images/enemy/walkcycles/Up/Up_00018.png',
							'assets/images/enemy/walkcycles/Up/Up_00019.png',
							'assets/images/enemy/walkcycles/Up/Up_00020.png',
							'assets/images/enemy/walkcycles/Up/Up_00021.png',
							'assets/images/enemy/walkcycles/Up/Up_00022.png',
							'assets/images/enemy/walkcycles/Up/Up_00023.png',
							'assets/images/enemy/walkcycles/Up/Up_00024.png'*/
						],
						options : {
							width : 150,
							height : 150,
							rate : 100
						}
					},
					down : {
						imgs : [
							'assets/images/enemy/movement/Down/down.gif'
						/*	'assets/images/enemy/walkcycles/Down/Top_00000.png',
							'assets/images/enemy/walkcycles/Down/Top_00001.png',
							'assets/images/enemy/walkcycles/Down/Top_00002.png',
							'assets/images/enemy/walkcycles/Down/Top_00003.png',
							'assets/images/enemy/walkcycles/Down/Top_00004.png',
							'assets/images/enemy/walkcycles/Down/Top_00005.png',
							'assets/images/enemy/walkcycles/Down/Top_00006.png',
							'assets/images/enemy/walkcycles/Down/Top_00007.png',
							'assets/images/enemy/walkcycles/Down/Top_00008.png',
							'assets/images/enemy/walkcycles/Down/Top_00009.png',
							'assets/images/enemy/walkcycles/Down/Top_00010.png',
							'assets/images/enemy/walkcycles/Down/Top_00011.png',
							'assets/images/enemy/walkcycles/Down/Top_00012.png',
							'assets/images/enemy/walkcycles/Down/Top_00013.png',
							'assets/images/enemy/walkcycles/Down/Top_00014.png',
							'assets/images/enemy/walkcycles/Down/Top_00015.png',
							'assets/images/enemy/walkcycles/Down/Top_00016.png',
							'assets/images/enemy/walkcycles/Down/Top_00017.png',
							'assets/images/enemy/walkcycles/Down/Top_00018.png',
							'assets/images/enemy/walkcycles/Down/Top_00019.png',
							'assets/images/enemy/walkcycles/Down/Top_00020.png',
							'assets/images/enemy/walkcycles/Down/Top_00021.png',
							'assets/images/enemy/walkcycles/Down/Top_00022.png',
							'assets/images/enemy/walkcycles/Down/Top_00023.png',
							'assets/images/enemy/walkcycles/Down/Top_00024.png'*/
						],
						options : {
							width : 150,
							height : 150,
							rate : 100
						}
					},
					left : {
						imgs : [
							'assets/images/enemy/movement/Left/left.gif'
						/*	'assets/images/enemy/walkcycles/Left/Left_00000.png',
							'assets/images/enemy/walkcycles/Left/Left_00001.png',
							'assets/images/enemy/walkcycles/Left/Left_00002.png',
							'assets/images/enemy/walkcycles/Left/Left_00003.png',
							'assets/images/enemy/walkcycles/Left/Left_00004.png',
							'assets/images/enemy/walkcycles/Left/Left_00005.png',
							'assets/images/enemy/walkcycles/Left/Left_00006.png',
							'assets/images/enemy/walkcycles/Left/Left_00007.png',
							'assets/images/enemy/walkcycles/Left/Left_00008.png',
							'assets/images/enemy/walkcycles/Left/Left_00009.png',
							'assets/images/enemy/walkcycles/Left/Left_00010.png',
							'assets/images/enemy/walkcycles/Left/Left_00011.png',
							'assets/images/enemy/walkcycles/Left/Left_00012.png',
							'assets/images/enemy/walkcycles/Left/Left_00013.png',
							'assets/images/enemy/walkcycles/Left/Left_00014.png',
							'assets/images/enemy/walkcycles/Left/Left_00015.png',
							'assets/images/enemy/walkcycles/Left/Left_00016.png',
							'assets/images/enemy/walkcycles/Left/Left_00017.png',
							'assets/images/enemy/walkcycles/Left/Left_00018.png',
							'assets/images/enemy/walkcycles/Left/Left_00019.png',
							'assets/images/enemy/walkcycles/Left/Left_00020.png',
							'assets/images/enemy/walkcycles/Left/Left_00021.png',
							'assets/images/enemy/walkcycles/Left/Left_00022.png',
							'assets/images/enemy/walkcycles/Left/Left_00023.png',
							'assets/images/enemy/walkcycles/Left/Left_00024.png'*/
						],
						options : {
							width : 150,
							height : 150,
							rate : 100
						}
					},
					right : {
						imgs : [
							'assets/images/enemy/movement/Right/right.gif'
						/*	'assets/images/enemy/walkcycles/Right/Side_00000.png',
							'assets/images/enemy/walkcycles/Right/Side_00001.png',
							'assets/images/enemy/walkcycles/Right/Side_00002.png',
							'assets/images/enemy/walkcycles/Right/Side_00003.png',
							'assets/images/enemy/walkcycles/Right/Side_00004.png',
							'assets/images/enemy/walkcycles/Right/Side_00005.png',
							'assets/images/enemy/walkcycles/Right/Side_00006.png',
							'assets/images/enemy/walkcycles/Right/Side_00007.png',
							'assets/images/enemy/walkcycles/Right/Side_00008.png',
							'assets/images/enemy/walkcycles/Right/Side_00009.png',
							'assets/images/enemy/walkcycles/Right/Side_00010.png',
							'assets/images/enemy/walkcycles/Right/Side_00011.png',
							'assets/images/enemy/walkcycles/Right/Side_00012.png',
							'assets/images/enemy/walkcycles/Right/Side_00013.png',
							'assets/images/enemy/walkcycles/Right/Side_00014.png',
							'assets/images/enemy/walkcycles/Right/Side_00015.png',
							'assets/images/enemy/walkcycles/Right/Side_00016.png',
							'assets/images/enemy/walkcycles/Right/Side_00017.png',
							'assets/images/enemy/walkcycles/Right/Side_00018.png',
							'assets/images/enemy/walkcycles/Right/Side_00019.png',
							'assets/images/enemy/walkcycles/Right/Side_00020.png',
							'assets/images/enemy/walkcycles/Right/Side_00021.png',
							'assets/images/enemy/walkcycles/Right/Side_00022.png',
							'assets/images/enemy/walkcycles/Right/Side_00023.png',
							'assets/images/enemy/walkcycles/Right/Side_00024.png'*/
						],
						options : {
							width : 150,
							height : 150,
							rate : 100
						}
					}
				}
/*				,eat :{
					imgs : [
						'assets/images/enemy/light/eat/eat1.gif'
						'assets/images/enemy/light/eat/enemy-eat-1.png',
						'assets/images/enemy/light/eat/enemy-eat-2.png',
						'assets/images/enemy/light/eat/enemy-eat-3.png',
						'assets/images/enemy/light/eat/enemy-eat-4.png',
						'assets/images/enemy/light/eat/enemy-eat-5.png',
						'assets/images/enemy/light/eat/enemy-eat-6.png',
						'assets/images/enemy/light/eat/enemy-eat-7.png',
						'assets/images/enemy/light/eat/enemy-eat-8.png'
					],
					options : {
						width : 150,
						height : 150,
						rate : 40
					}
				}*/
				,die : {
					imgs : [
			//			'assets/images/enemy/explosion/explosion_items.gif'
						'assets/images/enemy/explosion/sprite/Explode-ONLY_00001.png',
						'assets/images/enemy/explosion/sprite/Explode-ONLY_00002.png',
						'assets/images/enemy/explosion/sprite/Explode-ONLY_00003.png',
						'assets/images/enemy/explosion/sprite/Explode-ONLY_00004.png',
						'assets/images/enemy/explosion/sprite/Explode-ONLY_00005.png',
						

						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00006.png',












				//		'assets/images/enemy/explosion/sprite/Explode-ONLY_00006.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00007.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00008.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00009.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00010.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00011.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00012.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00013.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00014.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00015.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00016.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00017.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00018.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00019.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00020.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00021.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00022.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00023.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00024.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00025.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00026.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00027.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00028.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00029.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00030.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00031.png',
						'assets/images/enemy/explosion/HORIZONTAL/Explosion/Explosion_00032.png'
					],
					options : {
						width : 550 /** .8*/,
						height : 400 /** .8*/,
						rate : 50,
						loop : false
					}
				}
				,dieOriginal : {
					imgs : [
						'assets/images/enemy/light/die/left-leg.png',
						'assets/images/enemy/light/die/right-leg.png',
						'assets/images/enemy/light/die/arm.png',
						'assets/images/enemy/light/die/head.png'
					],
					options : {}
				}
			}
			,spriteOptions : {
				// the duration of a frame (the frame rate)
				rate : 200,
				width : 150,
				height : 150
			}
			,lifeBar : {
				offset : {
					x : 50,
					y : -30
				},
				width : 6,
				height : 54,
				duration : 200,
				border : 2,
				fill : "90-#000-#666",
				borderColor : '#000000',
				orientation : 'vertical'
			}
	//		,currentAction : 'move'

			// the enemy's target point
			,targetPoint : {x:0,y:0}

			// the enemy's direction
			// the sprites are divided into directional sprites 
			// (each directions - up/down/left/right) has it's own sprite
			,direction : 'left'

			// this is the game speed
			// to not be confused with the sprite animation (frames) speed
			,speed : 75 // pixel/second

			// don't know if this is going to be used at all
			,stamina : 100

			// no of hits to kill
			,initialLife : 3

			// no of hits taken by this enemy
			// 1 hit = 1 life point 
			,hitCount : 0

			// if enabled, the enemy will move only up/down/left/right
			,directionRestriction : true

			// the duration of the stun
			// before the last hit, the enemy is stun
			,stunDuration : 3000 // ms

			// the rules map speed factor alterations based on the current hitCount
			,rules : {}

			// the no  of points gained after killing this enemy
			,score : 50

			// rarePart
			// @to do: 
			,rarePart : null

			// an object that holds info about the enemy's next action
			,queuedAction : {
				action : 'move'
			}

			,explosionDuration : 2000

			// the cahnce that the next action will be a move (~ 40%)
			,moveChance : 0.6

			// the cahnce that the next action will be a eat (~ 60%)
			,eatChance : 0.4
		},

		initialize : function(){

			// update the sprite images urls if they are hosted on our host
			var sprites = this.get('sprites');
			bw.$.each(sprites,function(i,sprite){
		/*		if(i == 'die')
					{
						var newExplosionGifSrc = sprite.imgs[0].replace(/[^\/]+?\.gif$/, (new Date().getTime()) + Math.random() + '.gif');
						//console.log(newExplosionGifSrc);
						sprite.imgs[0] = newExplosionGifSrc;
					}*/
				
				if(sprite.imgs)
					bw.$.each(sprite.imgs,function(j,img){
						sprite.imgs[j] = bw.util.normalizeLink(img);
					});
				else 
					bw.$.each(sprite,function(k, v){
						if(v.imgs)
							bw.$.each(v.imgs,function(j,img){
								v.imgs[j] = bw.util.normalizeLink(img);
							});
					});	
			});	



			this.set('sprites', sprites, {silent : true});

			// remember some initial values for later use
			this.set('initialSpeed', this.get('speed'));
			this.set('initialStamina', this.get('stamina'));


			// convert the normal object to a point when set
			this.set('targetPoint', new bw.util.point(this.get('targetPoint')));

			this.isVirgin = true;


			this
				.updateLife()
				.bindEventHandlers()
				.applyRules()
				.addView();
			
		},

		addView : function(){
			if(!this.view)
				this.view = new bw.views.enemy({
					model : this
				});
			return this;
		},

		// guess
		bindEventHandlers : function(){
			this.on('change:hitCount', function(){
				this.updateLife();
	//			this.applyRules();
				this.endAction();
			}, this);

			this.on('endAction:move endAction:eat',function(){
				try{
				var s = this.view != null ? this.view.getCurrentSprite() : null;
				if(s && s.frames && s.frames[0])
					// update the current target to the view's actual current position
					this.set('targetPoint', new bw.util.point(s.frames[0].attrs.x,s.frames[0].attrs.y), {silent : true});
				}catch(e){}
				this.trigger.apply(this, ['endAction'].concat(Array.prototype.slice.call(arguments)));
			}, this);

			this.on('endAction',function(){
				this.clearTimeout();
				this.set('currentAction', null);
			}, this);

			this.on('change:targetPoint', function(enemy, targetPoint){
				var prevPoint = enemy.previous('targetPoint'),
					dist = targetPoint.clone().substract(prevPoint),
					direction;

					// x is the longest
					if(Math.max(Math.abs(dist.x), Math.abs(dist.y)) == Math.abs(dist.x))
						{
							if(dist.x < 0)
								direction = 'left';
							else
								direction = 'right';
						}
					else
						{
							if(dist.y < 0)
								direction = 'up';
							else
								direction = 'down';
						}

/*					console.log({
						oldDirection : this.get('direction'),
						newDirection : direction,
						prevPoint : prevPoint+'',
						newPoint : targetPoint+'',
						dist : dist + '',
					});*/
					this.set('direction', direction);

			}, this);

			this.on('change:currentAction', function(enemy, action){
			//	console.log('currentAction', action);
				if(action == 'stun')
					this.set('targetPoint', this.view.getCurrentPoint(),{silent : true});

				if(action != 'eat')
					this.set('targetedElement', null);

			});


			this.on('change:queuedAction', function(e, a){
		//		console.log('queuedAction', a);
			});

			this.on('change:targetedElement', function(enemy, targetedElement){
				if(targetedElement != null)
					{
						bw.$(targetedElement).addClass('beetleworx-targeted-elements');
					}

				if(this.previous('targetedElement') != null)
					{
						bw.$(this.previous('targetedElement')).removeClass('beetleworx-targeted-elements');
					}

			}, this);

			return this;
		},

		updateLife : function(){

			this.set('life', this.get('initialLife') - this.get('hitCount'));
			return this;
		},

		hit : function(){
			//console.log('hit');
			// remove the stun-end callback if the enemy is stunned
		//	this.clearTimeout();
			var hitCount = this.get('hitCount') + 1;
			this.set('hitCount', hitCount);

			bw.sounds.play('enemyImpact');
			bw.sounds.stop('fire');
		},

		move : function(point){
		//	console.log('move call', point);
			if(!(point instanceof bw.util.point))
				point = new bw.util.point(point);

	//		console.log('before move');
			this.set('currentAction', 'move');
	//		console.log('after move');
	//		console.log('before point');
			this.set('targetPoint', point);
	//		console.log('after point');

			return this;
		},

		// fn that moves the enemy towords a specified target
		// and eats that target when ariives at it's given point (if possible)
		goEat : function(options){
			if(arguments.length == 0 || !options.element)
				options = bw.util.getClosestDestroyableElement(this.view.getCurrentPoint(), bw.enemies.getTargetedElements());

		//	console.log('goEat call', options);

			this.set('targetedElement', options.el);


			options.action = 'eat';

			this.set('queuedAction', options);

			this.move(options.point);

			return this;
		},

		// @TO DO:
		// eat duration clarification
		eat : function(options){
		//	console.log('start eat fn', options);
			var self = this;			

			this.set('currentAction', 'eat');
			
			this.clearTimeout();

			// get the info we need before removing the element
			var elementInfo = bw.$(options.el).attr('data-destroyableOptions');
			if(elementInfo)
				elementInfo = JSON.parse(elementInfo);
				
		//	console.log('elementInfo',elementInfo);
			if(!elementInfo || bw.util.isRemoved(options.el)/* || !options.point.equals(bw.util.getElementCenter(options.el))*/)
				{
				//	console.log('is removed :(');

					// bummer
					// someone else (user/ another enemy or even the original site)
					// has altered (removed/renamed/replaced)
					// the element and it's not eatable anyMore :(

			/*		OR we have scrolled and the element's position has changed :(*/

					// soo.. cancel the eating process, trigger an "endAction:eat"
					// and queue a "goEat" action so that the enemy won't starve! :)
					
					this.set('queuedAction', {
						action : 'goEat'
					});

					// hardcode
					bw.enemies.assignTask(this);
					/*this.trigger('endAction:move', this);
					console.log('de aici.. canci');*/
					return this;
				}
			// else => party time!

			// remove the element
			bw.util.removeElement(options.el);

			// leave the eating animation some time
			this.set('timeout', global.setTimeout(function(){

				// show a floating text with the amount of points eaten by the bug
				bw.stage.domTextExplosion(options.point, {
					text : '-' + elementInfo.score,
					duration : 1000,
					className : 'decrease-score'
				});


				// force the bug to move after eating
				// don't let the fat build up!
				self.set('queuedAction', {
					action : 'move'
				});

				// trigger the "endEat"
				self.trigger('endAction:move', self);

				// hardcode
				bw.enemies.assignTask(self);
			}, 50000 / this.get('speed')));

			return this;
		},

		die : function(){
			this.set('currentAction', 'die');
			return this;
		},

		stun : function(){
			var self = this;
			this.set('currentAction', 'stun');

			this.clearTimeout();
			this.set('timeout', setTimeout(function(){
				// the stun-end callback
				self.set('hitCount', self.get('hitCount') - 1);
				self.trigger('endAction:stun');
			}, self.get('stunDuration')));

		//	console.log('this one is stunned for ' + this.get('stunDuration') + ' miliseconds');
			return this;
		},

		endAction : function(){
			this.clearTimeout();
			var action = 'endAction:' + (this.get('currentAction') || 'stun');
			if(this.get('currentAction') !== 'die')
				{
					this.trigger(action, this);
				//	console.log('end action : ',action);
				}
			return this;
		},

		clearTimeout : function(){
			var timeout = this.get('timeout');
			if(timeout)
				global.clearTimeout(timeout);
			return this;
		},

		// function that modifies other parameters (such as speed)
		// when the enemy is being hit, depending on it's class
		applyRules : function(){
			var rules = this.get('rules'),
				hitCount = this.get('hitCount'),
				rule = rules[hitCount];

		//	console.log('apply rules', rule);

			// if there is a rule defined for the current number of hits
			if(rule)
				{
					if(rule.speedMultiplier !== undefined)
						{
							// if the enemy should be stunned
							if(rule.speedMultiplier == 0)
								{
									var self = this;
									this.clearTimeout();
									this.set('timeout', function(){
										// the stun-end callback
										self.set('hitCount', self.get('hitCount') - 1);
									}, this.get('stunDuration'));
								}
							else
								{
									this.set('speed', this.get('initialSpeed') * rule.speedMultiplier);
								}
						}

					// end the current action (eat/move)
					// so that the enemy can be assigned a new action where
					// the new rule options can be seened in action
					// (instantly see speed change)
				}

			return this;
		},

		getApplyingRule : function(){
			return this.get('rules')[this.get('hitCount')] || null;
		},

		destroy : function(){
			if(this.view)
				{
					this.view.remove();
					this.view = null;
				}
			bw.backbone.Model.prototype.destroy.apply(this, arguments);
		}
	};

	// the light Beetleworx enemy
	models.lightEnemy = {
		'extends' : '_enemy',
		defaults : (function(){
			var d = JSON.parse(JSON.stringify(models._enemy.defaults));
			d.rules = {
				1 : {
					speedMultiplier : 2 
				},
				2 : {
					speedMultiplier : 0 
				}
			};
			return d;
		})()
	};

	// the medium Beetleworx enemy
	models.mediumEnemy = {
		'extends' : '_enemy',
		defaults : (function(){
			var d = JSON.parse(JSON.stringify(models._enemy.defaults));
			d.rules = {
				3 : {
					speedMultiplier : 2 
				},
				4 : {
					speedMultiplier : 0 
				}
			};

			d.speed = models._enemy.defaults.speed * 2;

			// stamina ??
			d.stamina = models._enemy.defaults.stamina * 2;
			d.initialLife = 5;
			d.directionRestriction = false;
			d.score = 100;

			// the cahnce that the next action will be a move (~ 25%)
			d.moveChance = 0.4;

			// the cahnce that the next action will be a eat (~ 75%)
			d.eatChance = 0.6;
			return d;
		})()
	};

	// the heavy Beetleworx enemy
	models.heavyEnemy = {
		'extends' : 'mediumEnemy',
		defaults : (function(){
			var d = JSON.parse(JSON.stringify(models.mediumEnemy.defaults));

			d.rules = {
				3 : {
					speedMultiplier : 2
				},
				5 : {
					speedMultiplier : 4 
				},
				6 : {
					speedMultiplier : 0 
				}
			}

			d.initialLife = 7;
			d.score = 200;

			// the cahnce that the next action will be a move (~ 10%)
			d.moveChance = 0.2;

			// the cahnce that the next action will be a eat (~ 90%)
			d.eatChance = 0.8;

			return d;
		})()
	};

	models.enemy = {
		initialize : function(attrs){
			var enemyClass = (attrs.type || 'light') + 'Enemy';
		//	console.log(attrs,enemyClass,bw.models[enemyClass]);
			return new bw.models[enemyClass](attrs);
		}
	}

	definitions.models = models;
	bw.definitions = definitions;
	global.bw = bw;
})(this);