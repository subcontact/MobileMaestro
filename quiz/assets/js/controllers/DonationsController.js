define(['angular', 'viewmodels/CylinderViewModel'], function(angular){
	function DonationsController($scope, CylinderViewModel, $timeout){
		this.viewModelClass = CylinderViewModel;
		this.$scope = $scope;
	}

	angular.extend(DonationsController, {
		$inject : ['$scope', 'CylinderViewModel', '$timeout']
	});

	angular.extend(DonationsController.prototype, {
		init : function(i){
			var center = {
				x : 0,
				z : 0
			};
			center.y = i * 2000;
			this.viewModel = new this.viewModelClass(6 + i*6, center, 1200);
			Array.prototype.push.apply(this.$scope.steps, this.viewModel.faces);
		}
	});

	return angular.module('DonationsController', ['CylinderViewModel']).controller('DonationsController', DonationsController);
});