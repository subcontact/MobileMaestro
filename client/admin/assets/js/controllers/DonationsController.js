define(['angular', 'impress', 'underscore', 'viewmodels/CylinderViewModel', 'models/DonationsCollection', 'utils/ScopeUtils'], function(angular, impress, _){
	var module = angular.module('DonationsController', ['CylinderViewModel', 'DonationsCollection', 'ScopeUtils']);

	function DonationsController($scope, $timeout, CylinderViewModel, DonationsCollection, ScopeUtils){
		var self = this;
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.donationsData = new DonationsCollection();
		this.impressAPI = impress('impress');

		var center = {
			x : 0,
			z : 0,
			y : 0
		};
		this.viewModel = new CylinderViewModel(0, center, 1500);

		this.donationsData.on('collectionUpdate', function(modified){
			$scope.donations = self.donationsData.items.values();
			if(modified){
				self.viewModel.setSides($scope.donations.length);
				angular.forEach($scope.donations, function(item, index){
					self.viewModel.applyFace(item, index);
				});
				if($scope.donations.length){
					self.$scope.$evalAsync(function(){
						self.jumpTo(self.currentStep);
					});
				}
			}
		});

		this.onAnimationTimeout = angular.bind(this, this.onAnimationTimeout);
		this.focus();
	}

	angular.extend(DonationsController, {
		$inject : ['$scope', '$timeout', 'CylinderViewModel', 'DonationsCollection', 'ScopeUtils']
	});

	angular.extend(DonationsController.prototype, {
		focus : function(){
			var self = this;
			this.donationsData.init().then(function(response){
				if(response.data.items.length){
					//TODO:abstract-impress abstract the impress api into angular
					//1 more frame to let impress update its data before we animate to it
					setTimeout(function(){
						self.$scope.$apply(function(){
							self.currentStep = 0;
							self.gotoItem(self.currentStep);
							self.donationsData.active();
							self.setAnimationTimeout();
						});
					});
				} else {
					self.completeModule();
				}
			});
		},
		blur : function(){
			this.clearAnimationTimeout();
			this.donationsData.passive();
		},
		completeModule : function(){
			//TODO implement
		},
		onAnimationTimeout : function(){
			if(this.currentStep < this.$scope.donations.length){
				this.gotoItem(this.currentStep);
				this.currentStep++;
				this.setAnimationTimeout();
			} else {
				/* TODO implement
				self.completeModule();
				*/
				//Make it loop for now
				this.gotoItem(0);
				this.currentStep = 1;
				this.setAnimationTimeout();
			}
		},
		setAnimationTimeout : function(){
			this.animationTimeoutId = this.$timeout(this.onAnimationTimeout, 5000);
		},
		clearAnimationTimeout : function(){
			if(this.animationTimeoutId){
				this.$timeout.cancel(this.animationTimeoutId);
			}
		},
		getItemIdFromIndex : function(index){
			var item = this.$scope.donations[index];
			return (item)?item.id:-1;
		},
		gotoItem : function(index){
			this.impressAPI.goto(this.getItemIdFromIndex(index));
		},
		jumpTo : function(index){
			this.impressAPI.goto(this.getItemIdFromIndex(index), 0);
		}
	});

	module.controller('DonationsController', DonationsController);

	return module;
});