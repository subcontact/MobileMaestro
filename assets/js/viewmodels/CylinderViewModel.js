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

		this.faces = [];
		for(var i = 0; i < sides; i++){
			this._addFace();
		}
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
		_addFace : function(index){
			var face = {
				x : 0,
				y : 0,
				rotation : 0
			};
			if(angular.isNumber(index)){
				this.faces.splice(index, 0, face);
			} else {
				this.faces.push(face);
			}
			return face;
		},
		_removeFace : function(index){
			var face = this.faces.splice(index, 1);
			return face;
		},
		addFace : function(index){
			var face = this._addFace(index);
			this.calculate();
			return face;
		},
		removeFace : function(index){
			var face = this._removeFace(index);
			this.calculate();
			return face;
		},
		calculate : function(){
			if(this.faces.length < 3) return;
			var cornerAngle = (Math.PI * 2)/this.faces.length;
			var cornerCompliment = Math.PI - cornerAngle;
			var cylinderRadius = this.faceWidth/2 * Math.tan(cornerCompliment / 2);
			var x = this.center.x;
			var y = this.center.y;
			var z = this.center.z;
			angular.forEach(this.faces, function(face, index){
				//Anti-clockwise
				var angle = index * -cornerAngle;
				face.x = Math.round(cylinderRadius * Math.cos(angle) + x);
				face.y = y;
				face.z = Math.round(cylinderRadius * Math.sin(angle) + z);
				face['rotate-y'] = toDegree(Math.PI/2 - angle);
			});
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