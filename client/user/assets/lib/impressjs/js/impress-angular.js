//TODO:abstract-impress abstract the impress api into angular
define(['angular', 'impress', 'emitter'], function(angular, impress, EventEmitter){
	var module = angular.module('impress-angular', []);
	
	module.directive('impress', [
		'$compile',
		function($compile){
			var idx = 0;

			function ImpressController($scope, $element, $transclude){
				EventEmitter.apply(this);
				this.$scope = $scope;
				this.$element = $element;
				this.$transclude = $transclude;
			}

			angular.extend(ImpressController, {
				$inject : ['$scope', '$element', '$transclude'],
				STEP_DATA_ATTRIBUTES : ['x', 'y', 'z', 'rotate', 'rotate-x', 'rotate-y', 'rotate-z', 'scale']
			});

			angular.extend(ImpressController.prototype, EventEmitter.prototype, {
				init : function(){
					var self = this;
					this.impress = impress(this.$element.attr('id'));
					this.impress.init();
					this.$transclude(function(clone){
						self.$element.children('div').append(clone);
					});
				},
				addStep : function(el, childScope){
					var index = this.$element.find('.step').index(el);
					this.impress.addStep(el[0], index);
				},
				removeStep : function(el, childScope){
					this.impress.removeStep(el[0]);
				},
				updateStep : function(el, childScope){
					this.impress.updateStep(el[0]);
				},
				goto : function(id, duration){
					return this.impress.goto(id, duration);
				}
			});

			return {
				controller : ImpressController,
				transclude : true,
				compile : function(tElement, tAttr, transclude){
					if(!tElement.attr('id')){
						tElement.attr('id', 'impress-module-' + idx++);
					}
					return function($scope, $element, $attr, impressController){
						impressController.init();
					};
				}
			};
		}
	]);

	module.directive('impressStep', [
		function(){
			var STEP_ATTRIBUTES = ['data-x', 'data-y', 'data-z', 'data-rotate', 'data-rotate-x', 'data-rotate-y', 'data-rotate-z', 'data-scale'];
			var ANGULAR_ATTRIBUTES = ['impressX', 'impressY', 'impressZ', 'impressRotate', 'impressRotateX', 'impressRotateY', 'impressRotateZ', 'impressScale'];
			return {
				require : '^impress',
				compile : function(tElement, tAttr){
					tElement.addClass('step');
					return function($scope, $element, $attr, impressController){
						$element.attr('id', $scope.$eval($attr['impressStep']));
						impressController.addStep($element, $scope);
						$scope.$on('$destroy', function(){
							impressController.removeStep($element, $scope);
						});
						angular.forEach(STEP_ATTRIBUTES, function(attrName, index){
							var scopeName = ANGULAR_ATTRIBUTES[index];
							var unwatch;
							$attr.$observe(scopeName, function(value){
								if(unwatch){
									unwatch();
								}
								unwatch = $scope.$watch(value, function(scopeVal){
									$scope[scopeName] = scopeVal;
									$element.attr(attrName, scopeVal);
								});
							});
						});
						$scope.$watch(function(){
							var str = [];
							//Inlined for speed
							for(var i = 0, length = ANGULAR_ATTRIBUTES.length; i < length; i++){
								str.push($scope[ANGULAR_ATTRIBUTES[i]]);
							}
							return str.join(':');
						}, function(value){
							impressController.updateStep($element, $scope);
						}, true);
					};
				}
			};
		}
	]);

	function makeImpressEventDirective(name){
		var directiveName = 'impress' + name[0].toUpperCase() + name.substring(1);
		module.directive(directiveName, function(){
			return {
				link : function($scope, $element, $attr){
					$element.bind('impress:step' + name, function(e){
						var step = this;
						$scope.$apply(function(){
							$scope.$eval($attr[directiveName], {
								$event : e,
								step : step
							});
						});
					});
				}
			};
		});
	}

	makeImpressEventDirective('enter');
	makeImpressEventDirective('leave');
});