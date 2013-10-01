(function(angular, impress){
	'use strict';
	var module = angular.module('impress', []);

	module.directive('impressModule', ['$compile', function($compile){
		var idx = 0;
		function ImpressController($scope, $element){
			this.$scope = $scope;
			this.$element = $element;

			if(!$element.attr('id')){
				$element.attr('id', 'impress-module-' + idx++);
			}
			this.impress = impress($element.attr('id'));
		}

		angular.extend(ImpressController, {
			$inject : ['$scope','$element'],
			STEP_DATA_ATTRIBUTES : ['x', 'y', 'z', 'rotate', 'rotate-x', 'rotate-y', 'rotate-z', 'scale']
		});

		angular.extend(ImpressController.prototype, {
			init : function(){
				var self = this;
				this.impress.init();

				this.$scope.$watch('impressData', angular.bind(this, this.dataWatch), true);
				this.$scope.$watch(function(){
					return self.impress.getActiveStepId();
				}, function(val){
					self.$scope.activeId = val;
				});
				var digest = angular.bind(this.$scope, this.$scope.$digest);
				this.$element[0].addEventListener('impress:stepleave', digest);
				this.$element[0].addEventListener('impress:stepenter', digest);

				//A map of previous ids
				this.stepIds = {};
			},
			addStep : function(data, index){
				var el = this.constructStep(data);
				this.impress.addStep(el, index);
				data.id = el.id;
				this.stepIds[data.id] = true;
			},
			removeStep : function(id){
				var el = angular.element(this.impress.removeStep(id));
				this.stepIds[id] = false;
				//Call remove so $destroy event will be fired
				el.remove();
				return el;
			},
			updateStep : function(id){
				return this.impress.updateStep(id);
			},
			indexOf : function(id){
				return this.impress.indexOf(id);
			},
			goto : function(id, duration){
				return this.impress.goto(id, duration);
			},
			dataWatch : function(newVal, oldVal){
				var self = this;
				if(newVal === oldVal){
					angular.forEach(newVal, function(data){
						self.addStep(data);
					});
				} else {
					//Get a copy of the current list of ids, with true signifying it has not been processed
					var idDiff = angular.copy(this.stepIds);
					//Last found index is used to insert the item in the correct location
					var lastFoundIndex = 0;
					angular.forEach(newVal, function(data, index){
						if(idDiff.hasOwnProperty(data.id)){
							idDiff[data.id] = false;
							self.updateStep(data.id);
							lastFoundIndex = self.indexOf(data.id);
						} else {
							self.addStep(data, ++lastFoundIndex);
						}
					});
					angular.forEach(idDiff, function(hasNotBeenProcessed, key){
						if(hasNotBeenProcessed){
							self.removeStep(key);
						}
					});
				}

				if(this.$scope.activeId){
					this.goto(this.$scope.activeId);
				}
			},
			constructStep : function(data){
				var parsed = angular.copy(data);
				ImpressController.STEP_DATA_ATTRIBUTES.forEach(function(key){
					if(parsed.hasOwnProperty(key)){
						parsed['data-'+key] = parsed[key];
						delete parsed[key];
					}
				});
				var el = angular.element('<div class="step" />');
				el.attr(parsed);
				var compileFn = $compile(el);
				var scope = this.$scope.$new();
				scope.impressData = data;
				compileFn(scope);
				el.bind('$destroy', function(){
					scope.$destroy();
				});

				return el[0];
			}
		});

		return {
			scope : {
				'impressData' : '='
			},
			replace : true,
			controller : ImpressController,
			link : function($scope, $element, $attr, impressController){
				impressController.init();
			}
		};
	}]);
}(window.angular, window.impress));