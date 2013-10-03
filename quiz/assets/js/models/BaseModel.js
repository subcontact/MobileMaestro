//
define('models/BaseModel', ['angular'], function(angular){

	return angular.module('BaseModel', []).factory('BaseModel', [function(){
		function BaseModel(){
			
		}

		angular.extend(BaseModel.prototype, {
			constructor : BaseModel,
			init : function(active){
				this.isActive = active || false;
				if(this.isActive){
					this._activate();
				}
			},
			destroy : function(){
				this.passive();
			},
			active : function(){
				if(!this.isActive){
					this.active = true;
					this._activate();
				}
			},
			passive : function(){
				if(this.isActive){
					this.active = false;
					this._deactivate();
				}
			},
			_activate : angular.noop,
			_deactive : angular.noop
		});

		return BaseModel;
	}]);
});