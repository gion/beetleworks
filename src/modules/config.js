(function(global,undefined){
	var bw = global.bw || {},
		config = bw.config || {};

	config.init = function(){
		bw.$.extend(config,{
			// the script host url
			host : bw.host,

			// if this flag is set, the the router navigation won't alter the url state
			// NOTE: this might be helpful if the host site already has change eventHandlers on the url/hash 
			silentNavigation : true,
			
			// the className that's going to be used in our app
			className : 'beetleworx-component-' + (new Date().getTime()),

			// a prefix used on classes or ids
			prefix : 'beetleworx-',

			minWindowWidth : 800,
			minWindowHeight : 600,

			// the elements that do not have actual width/height or do not alter
			// the dom view in any critical way
			hiddenElements : 'br hr'.split(' '),

			// the elements that we sill NOT remove
			ignoredElements : 'html head body script title meta style link shape line group image stroke fill skew path textpath ins'.split(' '),

			// elements that will b treated as images (flash, movies...)
			imgElements : 'img video embed object canvas'.split(' '),

			// the point value of the targeted elements
			score : {
				img : 25,
				word : 1
			},

			soundManagerOptions : {
				url : bw.host + 'assets/swf/',
				debugMode : true
			},

			sounds : (function(){
				var a = typeof global.Audio == 'function' ? new global.Audio : bw.$('<audio />').get(0),
					types = 'mp3 ogg'.split(' '),
					type = types[0];
				
				if(typeof a.canPlayType == 'function')
					for(var i=0;i<types.length;i++)
						if(a.canPlayType('audio/' + types[i]) != '')
							{
								type = types[i];
								break;
							}

				return {
					bonus : bw.host + 'assets/audio/Bonus.' + type,
					enemyImpact : bw.host + 'assets/audio/EnemyImpact.' + type,
					fire : bw.host + 'assets/audio/RemoteFire_initial.' + type,
					explode : bw.host + 'assets/audio/EnemyExplode.' + type,
					background : bw.host + 'assets/audio/soundtrack.' + type
				}
			})(),

			// the message that will be displayed when pausing the game
			pauseMsg : 'The game is now paused. \nPress OK to resume!',

			// when enabled, the game pauses when the window loses focus
			// CAUTION :  because the current pause mechanism relies on an alert box, this functionality may be annoying
			pauseOnBlur : false,

			// fn that congratulates the player only ONCE!
			congrats : bw._.once(function(){
				alert('Congrats! you\'ve destroyed all the elements on this site!');
			}),

			// if enabled, when moving the mouse the weapon will automatically be disabled
			deactivateWeaponOnMouseMove : true,

			// FLORIN AICI !!!
			disableRay : false,

			// disabled the ray animation
			// usefull for slow machines
			disableRayAnimation : true,

			// disables the hit animation (gif or sprite animation of a semi-explosion)
			disableHitAnimation : false,

			// after any enemy eats some dom content,
			// no enemy can eat again before this interval
			// this is usefull for debugging and testing the speed of the browser's dom api 
			maxEatingInterval : 50, // ms

			// if enabled, the app replaces all the flash/embed/object/applet from the dom with an empty div
			replaceFlash : true,

			// the interval after wich the aplication should 
			// re-parse the dom in search of new target elements
			// can be disabled if = 0
			parseDomInterval : 20, // s

			// if enabled, after every dom parsing, the enemies will have "updated" tasks,
			// making them aware of the possible new target elements dicovered
			reassignEnemyTasksAfterParsingDom : false,

			// if enabled, all the enemies will only have a targeted element inside the viewport
			// (all of the elements with styles like "left:-999999px" will be ignored)
			returnTargetsWithinViewport : false,

			// if enabled, forces the re-parsing of the dom when the viewport changes
			// (such as window scrolling or resizing)
			// this is usefull if you want to make sure that the targets are in the viewport
			reParseDomOnViewportChange : false,


			// enables sounds
			enableSounds : true,

			// enables the background sound [obsolete if enableSounds flag is false]
			enableBackgroundSound : true
		});

		delete bw.host;
	}

	bw.config = config;
	global.bw = bw;
})(this);