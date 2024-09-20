const ErrorMessages = require("./ErrorMessages.json");

const vLineIntersection = (x11, y11, x12, y12, x21, y21, x22, y22, ax1, ax2, tolerance) => {
	const m1 = (y12 - y11)/(x12 - x11);
	const m2 = (y22 - y21)/(x22 - x21);
	
	if (Math.abs(m1) == Infinity && Math.abs(m2) != Infinity) {
		const y = m2*(x11 - x22) + y22;
		if ((y - y11)*(y - y12) < tolerance && (x11 - x21)*(x11 - x22) < tolerance) {
			let json = {};
			json[`${ax1}`] = x11;
			json[`${ax2}`] = y;
			return [json];
		}
		return [];
	} else if (Math.abs(m1) != Infinity && Math.abs(m2) == Infinity) {
		const y = m1*(x22 - x12) + y12;
		if ((y - y21)*(y - y22) < tolerance && (x22 - x11)*(x22 - x12) < tolerance) {
			let json = {};
			json[`${ax1}`] = x22;
			json[`${ax2}`] = y;			
			return [json];
		}
		return [];
	} 
	return [];
};

const intersection = (entity1, entity2, plane, getAxes, tolerance) => {	
	if (typeof entity1 != "object" || typeof entity2 != "object" || Array.isArray(entity1) || Array.isArray(entity2)) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}		

	const etype1 = entity1.subclass;		
	const etype2 = entity2.subclass;

	if (etype1 == "AcDbLine" && etype2 == "AcDbLine") {
		const x11 = entity1[`start_${ax1}`];
		const y11 = entity1[`start_${ax2}`];
		const x12 = entity1[`end_${ax1}`];
		const y12 = entity1[`end_${ax2}`];
		const x21 = entity2[`start_${ax1}`];
		const y21 = entity2[`start_${ax2}`];
		const x22 = entity2[`end_${ax1}`];
		const y22 = entity2[`end_${ax2}`];
		
		const m1 = (y12 - y11)/(x12 - x11);
		const m2 = (y22 - y21)/(x22 - x21);
		
		if (Math.abs(m1) == Infinity || Math.abs(m2) == Infinity) {
			return vLineIntersection(x11, y11, x12, y12, x21, y21, x22, y22, ax1, ax2, tolerance);
		}		
		
		if (Math.abs(m1 - m2) < tolerance) return [];
		const x = ((-m2*x21 + y21) - (-m1*x11 + y11))/(m1 - m2);
		const y = m1*x + (-m1*x11 + y11);
		const isCrossing = (x - x11)*(x - x12) < tolerance && (x - x21)*(x - x22) < tolerance && 
					(y - y11)*(y - y12) < tolerance && (y - y21)*(y - y22) < tolerance;
		
		if (isCrossing) {
			let json = {};
			json[`${ax1}`] = x;
			json[`${ax2}`] = y;
			return [json];
		} 
		return [];		
	} else if ((etype1 == "AcDbLine" && etype2 == "AcDbPolyline") || (etype2 == "AcDbLine"  && etype1 == "AcDbPolyline")) {
		if (etype1 == "AcDbPolyline") {
			const temp = entity1;
			entity1 = entity2;
			entity2 = temp;
		}
		const x11 = entity1[`start_${ax1}`];
		const y11 = entity1[`start_${ax2}`];
		const x12 = entity1[`end_${ax1}`];
		const y12 = entity1[`end_${ax2}`];
		const m1 = (y12 - y11)/(x12 - x11);
		const vertices = JSON.parse(JSON.stringify(entity2.vertices));
		
		if (entity2.type == "Closed") {
			vertices.push(vertices[0]);
		}
		
		let points = [];
		for (let i = 1; i < vertices.length; i++) {
			const x21 = vertices[i - 1][`${ax1}`];
			const y21 = vertices[i - 1][`${ax2}`];
			const x22 = vertices[i][`${ax1}`];
			const y22 = vertices[i][`${ax2}`];				
			const m2 = (y22 - y21)/(x22 - x21);		
			const x = ((-m2*x21 + y21) - (-m1*x11 + y11))/(m1 - m2);
			const y = m1*x + (-m1*x11 + y11);
			
			if (Math.abs(m1) == Infinity || Math.abs(m2) == Infinity) {
				const intersection = vLineIntersection(x11, y11, x12, y12, x21, y21, x22, y22, ax1, ax2, tolerance);
				if (intersection.length > 0) {						
					points.push(intersection[0]);
				}
			} else {
				const temp = (x - x11)*(x - x12) < tolerance && (x - x21)*(x - x22) < tolerance && 
				   (y - y11)*(y - y12) < tolerance && (y - y21)*(y - y22) < tolerance;
				if (temp) {
					let json = {};
					json[`${ax1}`] = x;
					json[`${ax2}`] = y;
					points.push(json);
				}
			}
			
		}
		
		return points;			
	} else if ((etype1 == "AcDbLine" && etype2 == "AcDbCircle" && entity2.etype != "ARC") || 
		(etype2 == "AcDbLine" && etype1 == "AcDbCircle"  && entity1.etype != "ARC")) {
		if (etype1 == "AcDbCircle") {
			const temp = entity1;
			entity1 = entity2;
			entity2 = temp;
		}
		const x0 = entity2[`${ax1}`];
		const y0 = entity2[`${ax2}`];
		const radius = entity2.radius;
		const x1 = entity1[`start_${ax1}`];
		const y1 = entity1[`start_${ax2}`];
		const x2 = entity1[`end_${ax1}`];
		const y2 = entity1[`end_${ax2}`];
		const m = (y2 - y1)/(x2 - x1);
		
		if (Math.abs(m) == Infinity) {
			const det = radius*radius - (x1 - x0)*(x1 - x0);
			if (det < 0) {
				return [];
			} else if (det == 0) {
				if ((y0 - y1)*(y0 - y2) > tolerance) return [];
				let json = {};
				json[`${ax1}`] = x1;
				json[`${ax2}`] = y0;
				return [json];
			} else {
				let ysol1 = y0 - Math.sqrt(det);
				let ysol2 = y0 + Math.sqrt(det);
				let points = [];
				if ((ysol1 - y1)*(ysol1 - y2) < tolerance) {
					let json1 = {};
					json1[`${ax1}`] = x1;
					json1[`${ax2}`] = ysol1;
					points.push(json1);
				}
				if ((ysol2 - y1)*(ysol2 - y2) < tolerance) {
					let json2 = {};
					json2[`${ax1}`] = x1;
					json2[`${ax2}`] = ysol2;
					points.push(json2);
				}
				return points;
			}
		}
		
		const b = y1 - m*x1;
		const A = m*m + 1;
		const B = 2*(m*(b - y0) - x0);
		const C = x0*x0 + (b - y0)*(b - y0) - radius*radius;
		const det = B*B - 4*A*C;
		let points = [];
		if (det < 0) {
			return [];
		} else if (det == 0) {
			const sol1 = (-B)/(2*A);
			const ysol1 = m*sol1 + b;
			if (((sol1 - x1)*(sol1 - x2) > tolerance) || ((ysol1 - y1)*(ysol1 - y2) > tolerance)) return [];
			let json = {};
			json[`${ax1}`] = sol1;
			json[`${ax2}`] = ysol1;
			points.push(json);
		} else {
			const sol1 = (-B + Math.sqrt(det))/(2*A);
			const sol2 = (-B - Math.sqrt(det))/(2*A);
			const ysol1 = m*sol1 + b;
			const ysol2 = m*sol2 + b;
			
			const isCrossing =  ((sol1 - x1)*(sol1 - x2) < tolerance && (ysol1 - y1)*(ysol1 - y2) < tolerance) ||
				   ((sol2 - x1)*(sol2 - x2) < tolerance && (ysol2 - y1)*(ysol2 - y2) < tolerance);
			
							
			if (isCrossing) {
				if ((sol1 - x1)*(sol1 - x2) < tolerance && (ysol1 - y1)*(ysol1 - y2) < tolerance) {
					let json1 = {};
					json1[`${ax1}`] = sol1;
					json1[`${ax2}`] = ysol1;
					points.push(json1);
				}
				if ((sol2 - x1)*(sol2 - x2) < tolerance && (ysol2 - y1)*(ysol2 - y2) < tolerance) {
					let json2 = {};
					json2[`${ax1}`] = sol2;
					json2[`${ax2}`] = ysol2;
					points.push(json2);
				}
			} 
			
		}
		return points;
	} else if ((etype1 == "AcDbLine" && etype2 == "AcDbCircle") || (etype2 == "AcDbLine" && etype1 == "AcDbCircle")) {
		if (etype1 == "AcDbCircle") {
			const temp = entity1;
			entity1 = entity2;
			entity2 = temp;
		}
		const xc = entity2[`${ax1}`];
		const yc = entity2[`${ax2}`];
		const radius = entity2.radius;
		const x1 = entity1[`start_${ax1}`];
		const y1 = entity1[`start_${ax2}`];
		const x2 = entity1[`end_${ax1}`];
		const y2 = entity1[`end_${ax2}`];
		let m = (y2 - y1)/(x2 - x1);
		let sol1, sol2, ysol1, ysol2;
		let points = [];
		
		if (Math.abs(m) == Infinity) {
			const det = radius*radius - (x1 - xc)*(x1 - xc);
			
			if (det < 0) {
				return [];
			} else if (det == 0) {				
				sol1 = x1;
				ysol1 = yc;
			} else {
				ysol1 = yc - Math.sqrt(det);
				ysol2 = yc + Math.sqrt(det);
				let points = [];
				if ((ysol1 - y1)*(ysol1 - y2) < tolerance) {						
					sol1 = x1;
				}
				if ((ysol2 - y1)*(ysol2 - y2) < tolerance) {						
					sol2 = x1;
				}
			}
		} else {			
			const b = y1 - m*x1;
			const A = m*m + 1;
			const B = 2*(m*(b - yc) - xc);
			const C = xc*xc + (b - yc)*(b - yc) - radius*radius;
			const det = B*B - 4*A*C;
			
			if (det < tolerance) {
				return [];
			} else {
				sol1 = (-B + Math.sqrt(det))/(2*A);
				sol2 = (-B - Math.sqrt(det))/(2*A);
				ysol1 = m*sol1 + b;
				ysol2 = m*sol2 + b;
			}
		}
		let sa = entity2.start_angle*Math.PI/180;
		let ea = entity2.end_angle*Math.PI/180;
				
		if (sol1 && ysol1) {
			//let ang1 = Math.atan2((ysol1 - yc),(sol1 - xc));
			let ang1 = Math.abs(Math.atan((ysol1 - yc)/(sol1 - xc)));
			const isCrossing1 =  ((sol1 - x1)*(sol1 - x2) < tolerance && (ysol1 - y1)*(ysol1 - y2) < tolerance);
			if (ysol1 > yc && sol1 < xc) {
				ang1 = Math.PI - ang1;
			} else if (ysol1 < yc && sol1 < xc) {
				ang1 = Math.PI + ang1;
			} else if (ysol1 < yc && sol1 > xc) {
				ang1 = 2*Math.PI - ang1;
			} 
			if (isCrossing1 && ((sa < ea && ((ang1 - sa)*(ang1 - ea) < tolerance)) || (sa > ea && ((ang1 - sa)*(ang1 - ea) > tolerance)))) {
				let json1 = {};
				json1[`${ax1}`] = sol1;
				json1[`${ax2}`] = ysol1;
				points.push(json1);
			}
		}
		
		if (sol2 && ysol2) {
			//let ang2 = Math.atan2((ysol2 - yc),(sol2 - xc));
			let ang2 = Math.abs(Math.atan((ysol2 - yc)/(sol2 - xc)));
			const isCrossing2 =  ((sol2 - x1)*(sol2 - x2) < tolerance && (ysol2 - y1)*(ysol2 - y2) < tolerance);
			if (ysol2 > yc && sol2 < xc) {
				ang2 = Math.PI - ang2;
			} else if (ysol2 < yc && sol2 < xc) {
				ang2 = Math.PI + ang2;
			} else if (ysol2 < yc && sol2 > xc) {
				ang2 = 2*Math.PI - ang2;
			} 
			if (isCrossing2 && ((sa < ea && ((ang2 - sa)*(ang2 - ea) < tolerance)) || (sa > ea && ((ang2 - sa)*(ang2 - ea) > tolerance)))) {
				let json2 = {};
				json2[`${ax1}`] = sol2;
				json2[`${ax2}`] = ysol2;
				points.push(json2);
			}
		}
		
		return points;	
	} else if ((etype1 == "AcDbLine" && etype2 == "AcDbEllipse") || (etype2 == "AcDbLine" &&	etype1 == "AcDbEllipse")) {
		if (etype1 == "AcDbEllipse") {
			const temp = entity1;
			entity1 = entity2;
			entity2 = temp;
		}
		
		const xc = entity2[`${ax1}`];
		const yc = entity2[`${ax2}`];
		const radius = entity2.radius;
		const x1 = entity1[`start_${ax1}`];
		const y1 = entity1[`start_${ax2}`];
		const x2 = entity1[`end_${ax1}`];
		const y2 = entity1[`end_${ax2}`];
		let m = (y2 - y1)/(x2 - x1);
		let sol1, sol2, ysol1, ysol2;
		let points = [];
		
		const dx = entity2[`major_end_d${ax1}`];
		const dy = entity2[`major_end_d${ax2}`];
		const ratio = entity2.minorToMajor;
		const a = Math.sqrt(dx*dx + dy*dy);
		const b = ratio*a;
		const theta = Math.atan2(dy, dx);
		const A = Math.pow(a*Math.sin(theta), 2) + Math.pow(b*Math.cos(theta), 2);
		const B = 2*(b*b - a*a)*Math.sin(theta)*Math.cos(theta);
		const C = Math.pow(a*Math.cos(theta), 2) + Math.pow(b*Math.sin(theta), 2);
		const D = -2*A*xc - B*yc;
		const E = -B*xc - 2*C*yc;
		const F = A*xc*xc + B*xc*yc + C*yc*yc - a*a*b*b;
		let sa = entity2.start_angle;
		let ea = entity2.end_angle;	
		
		if (Math.abs(m) == Infinity) {
			const det = (B*x1 + E)*(B*x1 + E) - 4*C*(A*x1*x1 + D*x1 + F);				
			if (det < 0) {
				return [];
			} else if (det == 0) {				
				sol1 = x1;
				ysol1 = -(B*x1 + E)/(2*C);
			} else {
				ysol1 = -(B*x1 + E - Math.sqrt(det))/(2*C);
				ysol2 = -(B*x1 + E + Math.sqrt(det))/(2*C);
				
				if ((ysol1 - y1)*(ysol1 - y2) < tolerance) {						
					sol1 = x1;
				}
				if ((ysol2 - y1)*(ysol2 - y2) < tolerance) {						
					sol2 = x1;
				}
			}
		} else {
			const y_int = -m*x1 + y1;
			const AA = (A + B*m + C*m*m);
			const BB = (B*y_int + 2*C*m*y_int + D + E*m);
			const CC = (C*y_int*y_int + E*y_int + F);
			const det = BB*BB - 4*AA*CC;
			
			if (det <= tolerance) {							
				return [];
			} else {
				const b = y1 - m*x1;						
				sol1 = (-BB + Math.sqrt(det))/(2*AA);
				sol2 = (-BB - Math.sqrt(det))/(2*AA);						
				ysol1 = m*sol1 + b;
				ysol2 = m*sol2 + b;	
			}
		}
		
		if (Math.abs(Math.abs(entity2.start_parameter - entity2.end_parameter) - 2*Math.PI) < tolerance) { // full ellipse
			if ((sol1 - x1)*(sol1 - x2) < tolerance && (ysol1 - y1)*(ysol1 - y2) < tolerance) {
				let json1 = {};
				json1[`${ax1}`] = sol1;
				json1[`${ax2}`] = ysol1;
				points.push(json1);
			}
			if ((sol2 - x1)*(sol2 - x2) < tolerance && (ysol2 - y1)*(ysol2 - y2) < tolerance) {
				let json2 = {};
				json2[`${ax1}`] = sol2;
				json2[`${ax2}`] = ysol2;
				points.push(json2);
			}
		} else {
			sa = sa*Math.PI/180;
			ea = ea*Math.PI/180;
			if (sol1 && ysol1) {
				let ang1 = Math.abs(Math.atan((ysol1 - yc)/(sol1 - xc)));
				const isCrossing1 =  ((sol1 - x1)*(sol1 - x2) < tolerance && (ysol1 - y1)*(ysol1 - y2) < tolerance);
				if (ysol1 > yc && sol1 < xc) {
					ang1 = Math.PI - ang1;
				} else if (ysol1 < yc && sol1 < xc) {
					ang1 = Math.PI + ang1;
				} else if (ysol1 < yc && sol1 > xc) {
					ang1 = 2*Math.PI - ang1;
				}
				if (isCrossing1 && ((sa < ea && ((ang1 - sa)*(ang1 - ea) < tolerance)) || (sa > ea && ((ang1 - sa)*(ang1 - ea) > tolerance)))) {
					let json1 = {};
					json1[`${ax1}`] = sol1;
					json1[`${ax2}`] = ysol1;
					points.push(json1);
				}
			}
			
			if (sol2 && ysol2) {
				let ang2 = Math.abs(Math.atan((ysol2 - yc)/(sol2 - xc)));
				const isCrossing2 =  ((sol2 - x1)*(sol2 - x2) < tolerance && (ysol2 - y1)*(ysol2 - y2) < tolerance);
				if (ysol2 > yc && sol2 < xc) {
					ang2 = Math.PI - ang2;
				} else if (ysol2 < yc && sol2 < xc) {
					ang2 = Math.PI + ang2;
				} else if (ysol2 < yc && sol2 > xc) {
					ang2 = 2*Math.PI - ang2;
				}
				if (isCrossing2 && ((sa < ea && ((ang2 - sa)*(ang2 - ea) < tolerance)) || (sa > ea && ((ang2 - sa)*(ang2 - ea) > tolerance)))) {
					let json2 = {};
					json2[`${ax1}`] = sol2;
					json2[`${ax2}`] = ysol2;
					points.push(json2);
				}
			}
		}
		return points;
	} else if ((etype1 == "AcDbPolyline" &&	etype2 == "AcDbCircle") || (etype2 == "AcDbPolyline" &&	etype1 == "AcDbCircle")) {	
		if ((etype2 == "AcDbPolyline" &&	etype1 == "AcDbCircle")) {
			const temp = entity1;
			entity1 = entity2;
			entity2 = temp;
		}			
		const vertices = JSON.parse(JSON.stringify(entity1.vertices));			
		if (entity2.type == "Closed") {
			vertices.push(vertices[0]);
		}
		let points = [];
		let x0 = vertices[0][`${ax1}`], x1;
		let y0 = vertices[0][`${ax2}`], y1;
		
		for (let i = 1; i < vertices.length; i++) {
			x1 = vertices[i][`${ax1}`];
			y1 = vertices[i][`${ax2}`];
			let json = {subclass: "AcDbLine"};
			json[`start_${ax1}`] = x0;
			json[`start_${ax2}`] = y0;
			json[`end_${ax1}`] = x1;
			json[`end_${ax2}`] = y1;
			const intn = intersection(json, entity2, `${ax1}-${ax2}`, getAxes, tolerance);
			if (Array.isArray(intn)) {
				intn.forEach((p) => {
					let x = p[ax1];
					let y = p[ax2];
					let isInserted = false;
					for (let j = 0; j < points.length; j++) {
						if (Math.abs(points[j][ax1] - x) < tolerance && Math.abs(points[j][ax2] - y) < tolerance) {
							isInserted = true;
							break;
						}
					}
					if (!isInserted) {							
						points.push(p);
					}
				});
			}
			x0 = x1;
			y0 = y1;
		}			
		return points;
	} else if ((etype1 == "AcDbPolyline" && etype2 == "AcDbEllipse") || (etype2 == "AcDbPolyline" && etype1 == "AcDbEllipse")) {
		if ((etype2 == "AcDbPolyline" && etype1 == "AcDbEllipse")) {
			const temp = entity1;
			entity1 = entity2;
			entity2 = temp;
		}
		let points = [], arcConnected = false;
		const vertices = JSON.parse(JSON.stringify(entity1.vertices));
		
		if (entity2.type == "Closed") {
			vertices.push(vertices[0]);
		}
		
		let x0 = vertices[0][`${ax1}`], x1;
		let y0 = vertices[0][`${ax2}`], y1;
		
		for (let i = 1; i < vertices.length; i++) {
			x1 = vertices[i][`${ax1}`];
			y1 = vertices[i][`${ax2}`];
			let json = {subclass: "AcDbLine"};
			json[`start_${ax1}`] = x0;
			json[`start_${ax2}`] = y0;
			json[`end_${ax1}`] = x1;
			json[`end_${ax2}`] = y1;
			const intn = intersection(json, entity2, `${ax1}-${ax2}`, getAxes, tolerance);
			if (Array.isArray(intn)) {
				intn.forEach((p) => {
					let x = p[ax1];
					let y = p[ax2];
					let isInserted = false;
					for (let j = 0; j < points.length; j++) {
						if (Math.abs(points[j][ax1] - x) < tolerance && Math.abs(points[j][ax2] - y) < tolerance) {
							isInserted = true;
							break;
						}
					}
					if (!isInserted) {							
						points.push(p);
					}
				});
			}
			x0 = x1;
			y0 = y1;
		}	
		return points;
	}
	return [];
};

module.exports = intersection;	
	

