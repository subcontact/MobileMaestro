(function(){
	function ProjectViewModel(angle, faceAngle){
		this.angle = angle;
		this.faceAngle = faceAngle;
		this.init();
	}

	ProjectViewModel.width = 1200;

	ProjectViewModel.prototype = {
		init : function(){
			this.el = $('<div class="step"></div>');
			this.calculate();
			this.update();
		},
		calculate : function(){
			var radian = Math.toRadian(this.angle);
			var faceRadian = Math.toRadian(this.faceAngle);
			var faceComplimentary = Math.PI - faceRadian;
			var height = ProjectViewModel.width/2 * Math.tan(faceComplimentary / 2);

			this.x = height * Math.cos(radian);
			this.y = height * Math.sin(radian);
			this.rotation = Math.PI/2 - radian;
		},
		update : function(){
			this.el.attr({
				'data-x' : Math.round(this.x),
				'data-z' : Math.round(this.y),
				'data-rotate-y' : Math.toDegree(this.rotation)
			});
		}
	};

	Math.toDegree = function(radian){
		return radian/Math.PI * 180;
	};

	Math.toRadian = function(degree){
		return Math.PI/180 * degree;
	};

	$(function(){
		var maxSteps = 13;
		var angle = 360/maxSteps;
		var complimentary = 180 - angle;
		var faces = [];
		var wrapper = $('#impress');
		for(var i = 0; i < maxSteps; i++){
			var face = new ProjectViewModel(-angle * i, angle);
			wrapper.append(face.el);
			faces.push(face);
		}
		var elevationAngle = Math.toRadian(-45);
		var sphereLength = ProjectViewModel.width/2 * Math.tan((Math.PI - Math.toRadian(angle))/2)*3;
		var overviewZ = Math.round(sphereLength * Math.cos(elevationAngle));
		var overviewY = Math.round(sphereLength * Math.sin(elevationAngle));
		var overviewRotation = Math.toDegree(Math.PI/2 + elevationAngle);
		wrapper.append('<div class="step" id="overview" data-z="' + overviewZ +'" data-y="' + overviewY +'" data-rotate-x="' + overviewRotation +'" />');
		window.impress().init();
	});
}());