//Global configuration for the application
define(['angular', 'models/BaseModel', 'services/PolledService'], function(angular){
	return angular.module('GlobalConfig', ['PolledService', 'BaseModel']).factory('GlobalConfig', ['PolledService', 'BaseModel', function(PolledService, BaseModel){
		var service = PolledService.create({
			httpConfig : {
				method : 'GET',
				url : 'mock/global_config.json'
			},
			interval : 30000
		});

		function GlobalConfig(service){
			BaseModel.apply(this, arguments);
			this.service = service;
		}

		angular.extend(GlobalConfig.prototype, BaseModel.prototype, {
			constructor : GlobalConfig,
			_activate : function(){
				var self = this;
				this.service.start();
				this.service.on('data', function(data){
					self.data = data;
				});
			},
			_deactivate : function(){
				this.service.pause();
				this.service.off('data');
			}
		});

		return new GlobalConfig(service);
	}]);
});