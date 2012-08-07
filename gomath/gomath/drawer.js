(function(win, doc){
	var cvs, ctx;
	
	var MOVETO = 0,
	LINETO = 1,
	QUADTO = 2,
	CUBICTO = 3,
	CLOSE = 4;
	
	function inspect(obj){
		win.console&&console.log(obj);
	}
				
	function load(target, Constructor){
		var xhr = new XMLHttpRequest(),
		url = "http://localhost:8000/cgi-bin/service.py?";
		
		xhr.overrideMimeType("application/json; charset=UTF-8");
		url += "type="+target;
		
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function(e){
			if(this.readyState == 4) {
				if(this.status == 200 || this.status == 201) {
			 		var restxt = this.responseText,
			 		data = JSON.parse(restxt);
					if(data){
						for(var i = 0, len = data.length; i<len; i++){
							var shape = new Constructor(data[i]);
							shape.draw(); /* TODO: Not draw here. */
						}
					}
				}else{
					throw new Error("Geometry calculate request error!");
		    }
			}
		};
		
		xhr.send(null);	
	}
	
	function Pen(path, style){
		/* TODO:implement */
	}
				
	function Point(p){
		Point.prototype.draw = function(){
			ctx.beginPath();
			var radius = 5,
			endang = Math.PI*2;
						
			ctx.arc(p[0], p[1], radius, 0, endang, false);
			ctx.fill();						
		};
	}
				
	function Polygon(segments){
		Polygon.prototype.draw = function(){
			ctx.beginPath();
						
			for(var i = 0, lim = segments.length; i<lim; i++){
				var seg = segments[i],
				type = seg[seg.length-1];
							
				var x = seg[0],
				y = seg[1];
				switch(type){
					case MOVETO:
						ctx.moveTo(x, y);
						break;
					case LINETO:
						ctx.lineTo(x, y);
						break;
					case QUADTO:
						ctx.lineTo(seg[2], seg[3], x, y);
						break;
					case CUBICTO:
						ctx.bezierCurveTo(seg[2], seg[3], seg[4], seg[5], x, y);
						break;
					case CLOSE:
						ctx.closePath(x, y);
						break;
					default:
						ctx.lineTo(x, y);
				}							
			}
			
			ctx.stroke();
		};
	}
				
	function init(e){
		cvs = doc.querySelector("canvas");
		if(!cvs || !cvs.getContext){
			return;
		}
		ctx = cvs.getContext("2d");				
		load("testpoint", Point);
		load("testpolygon", Polygon);
	}
	
	win.onload = init;
})(window, document);
			
