(function(global,undefined){
	var bw = global.bw || {};
	var definitions = bw.definitions || {};
	var models = definitions.models || {};

	models.cursor = {
		defaults : {
			duration : 4000,
			image : 'assets/images/weapon/reticule.png',
			outerWidth : 200,
			outerHeight : 200,
			innerWidth : 56,
			innerHeight : 56
		},
		initialize : function(){
			this.addView();
		},
		addView : function(){
			if(!this.view)
				new bw.views.cursor({
					model : this
				});
		},
		getOffset : function(){
			return this.view.getOffset();
		}
	};

	definitions.models = models;
	bw.definitions = definitions;
	global.bw = bw;
})(this)