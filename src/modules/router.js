(function(global,undefined){
	var bw = global.bw || {},
		definitions = bw.definitions || {},
		router = definitions.router || {},
		history = definitions.router || {};

	
	router = {
		routes : {
			build : 'build',
			game : 'game'
		},
		build : function(){
			//alert('building');
		},
		game : function(){
			//alert('gaming');
		}
	};


	history.pushState = false;

	definitions.history = history;
	definitions.router = router;
	bw.definitions = definitions;
	global.bw = bw;
})(this)