/*
	Creates an n-sided cylinder
*/

define(['angular'], function(angular){
	'use strict';

	var module = angular.module('CylinderViewModel', []);
	function toDegree(radian){
		return radian/Math.PI * 180;
	}

	function toRadian(degree){
		return Math.PI/180 * degree;
	}

	function CylinderViewModel(sides, center, faceWidth){
		this.center = center || angular.copy(CylinderViewModel.defaults.center);
		this.faceWidth = faceWidth || CylinderViewModel.defaults.faceWidth;
		this.sides = (sides < 3)?CylinderViewModel.defaults.sides:sides;

		this.calculate();
	}

	angular.extend(CylinderViewModel, {
		defaults : {
			center : {x:0, y:0, z:0},
			faceWidth : 1200,
			sides : 12
		}
	});

	angular.extend(CylinderViewModel.prototype, {
		calculate : function(){
			this.cornerAngle = (Math.PI * 2)/this.sides;
			this.cornerCompliment = Math.PI - this.cornerAngle;
			this.cylinderRadius = this.faceWidth/2 * Math.tan(this.cornerCompliment / 2);
		},
		setCenter : function(center){
			if(!angular.isUndefined(center)){
				this.center = center;
			}
			return center;
		},
		setSides : function(sides){
			if(typeof sides !== 'undefined'){
				if(sides < 3){
					sides = 3;
				}
				this.sides = sides;
				this.calculate();
			}
			return sides;
		},
		setWidth : function(width){
			if(!angular.isUndefined(width)){
				this.faceWidth = width;
				this.calculate();
			}
			return width;
		},
		applyFace : function(data, index){
			data = data || {};
			var angle = index * -this.cornerAngle;
			data.x = Math.round(this.cylinderRadius * Math.cos(angle)) + this.center.x;
			data.y = this.center.y;
			data.z = Math.round(this.cylinderRadius * Math.sin(angle)) + this.center.z;
			data.rotation = toDegree(Math.PI/2 - angle);
			return data;
		}
	});

	module.provider('CylinderViewModel', function(){
		return {
			$get : function(){
				return CylinderViewModel;
			},
			defaults : function(obj){
				if(obj){
					angular.extend(CylinderViewModel.defaults, obj);
				}
				return CylinderViewModel.defaults;
			}
		};
	});

	return module;
});