const ErrorMessages = require("./ErrorMessages.json");

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
		const det = (x12 - x11)*(y22 - y21) - (x22 - x21)*(y12 - y11);	
		const det1 = (x22 - x11)*(y22 - y21) - (x22 - x21)*(y22 - y11);
		const det2 = (x12 - x11)*(y12 - y21) - (x12 - x21)*(y12 - y11);
		const r1 = det1/det;
		const r2 = det2/det;
		
		if (r1 >= 0 && r1 <= 1 && r2 >= 0 && r2 <= 1) {			
			let json = {};
			json[`${ax1}`] = x11 + det1*(x12 - x11)/det;
			json[`${ax2}`] = y11 + det1*(y12 - y11)/det;
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
			const det = (x12 - x11)*(y22 - y21) - (x22 - x21)*(y12 - y11);	
			const det1 = (x22 - x11)*(y22 - y21) - (x22 - x21)*(y22 - y11);
			const det2 = (x12 - x11)*(y12 - y21) - (x12 - x21)*(y12 - y11);
			const r1 = det1/det;
			const r2 = det2/det;
			
			if (r1 < 0 || r1 > 1 || r2 < 0 || r2 > 1) {
				continue;
			}
			
			const x = x11 + det1*(x12 - x11)/det;
			const y = y11 + det1*(y12 - y11)/det;
			let pointAdded = false;
			for (let j = 0; j < points.length; j++) {
				if (Math.abs(points[j][ax1] - x) < tolerance && Math.abs(points[j][ax2] - y) < tolerance) {
					pointAdded = true;
					break;
				}
			}
			if (!pointAdded) {
				let json = {};
				json[`${ax1}`] = x;
				json[`${ax2}`] = y;
				points.push(json);
			}
		}
		
		return points;			
	} else if ((etype1 == "AcDbPolyline" && etype2 == "AcDbPolyline") || (etype2 == "AcDbPolyline"  && etype1 == "AcDbPolyline")) {		
		const vertices1 = JSON.parse(JSON.stringify(entity1.vertices));
		const vertices2 = JSON.parse(JSON.stringify(entity2.vertices));
		if (entity1.type == "Closed") {
			vertices1.push(vertices1[0]);
		}
		
		if (entity2.type == "Closed") {
			vertices2.push(vertices2[0]);
		}
		
		let points = [];
		for (let i = 1; i < vertices1.length; i++) {
			const x11 = vertices1[i - 1][`${ax1}`];
			const y11 = vertices1[i - 1][`${ax2}`];
			const x12 = vertices1[i][`${ax1}`];
			const y12 = vertices1[i][`${ax2}`];				
			
			for (let j = 1; j < vertices2.length; j++) {
				const x21 = vertices2[j - 1][`${ax1}`];
				const y21 = vertices2[j - 1][`${ax2}`];
				const x22 = vertices2[j][`${ax1}`];
				const y22 = vertices2[j][`${ax2}`];				
				const det = (x12 - x11)*(y22 - y21) - (x22 - x21)*(y12 - y11);			
				
				const det1 = (x22 - x11)*(y22 - y21) - (x22 - x21)*(y22 - y11);
				const det2 = (x12 - x11)*(y12 - y21) - (x12 - x21)*(y12 - y11);
				const r1 = det1/det;
				const r2 = det2/det;
		
				if (r1 < 0 || r1 > 1 || r2 < 0 || r2 > 1) {
					continue;
				}
				
				const x = x11 + det1*(x12 - x11)/det;
				const y = y11 + det1*(y12 - y11)/det;
				let pointAdded = false;
				for (let j = 0; j < points.length; j++) {
					if (Math.abs(points[j][ax1] - x) < tolerance && Math.abs(points[j][ax2] - y) < tolerance) {
						pointAdded = true;
						break;
					}
				}
				if (!pointAdded) {
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
			} else if (Math.abs(det) < 0.0000001) {
				if ((y0 - y1)*(y0 - y2) > tolerance) return [];
				let json = {};
				json[`${ax1}`] = x1;
				json[`${ax2}`] = y0;
				json.tangency_point = true;
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
		let p1_tangent = false;
		if (det < 0) {
			return [];
		} else if (Math.abs(det) < 0.0000001) {
			const sol1 = (-B)/(2*A);
			const ysol1 = m*sol1 + b;
			if (((sol1 - x1)*(sol1 - x2) > tolerance) || ((ysol1 - y1)*(ysol1 - y2) > tolerance)) return [];
			let json = {};
			json[`${ax1}`] = sol1;
			json[`${ax2}`] = ysol1;
			json.tangency_point = true;
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
		let p1_tangent = false;
		if (Math.abs(m) == Infinity) {
			const det = radius*radius - (x1 - xc)*(x1 - xc);
			
			if (det < 0) {
				return [];
			} else if (Math.abs(det) < 0.0000001) {				
				sol1 = x1;
				ysol1 = yc;
				p1_tangent = true;
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
			} else if (Math.abs(det) < 0.0000001) {				
				sol1 = -B/(2*A);
				ysol1 = m*sol1 + b;
				p1_tangent = true;
			} else {
				sol1 = (-B + Math.sqrt(det))/(2*A);
				sol2 = (-B - Math.sqrt(det))/(2*A);
				ysol1 = m*sol1 + b;
				ysol2 = m*sol2 + b;
			}
		}
		
		
		let sa = entity2.start_angle*Math.PI/180;
		let ea = entity2.end_angle*Math.PI/180;
		
		if (sa > ea) {
			sa = sa - 2*Math.PI;
		}	
		
		if (sol1 !== undefined && ysol1 !== undefined && (x1 - sol1)*(x2 - sol1) < tolerance && (y1 - ysol1)*(y2 - ysol1) < tolerance) {
			let ang1 = Math.atan2(ysol1 - yc, sol1 - xc);
			if ((sa - ang1)*(ea - ang1) < tolerance || 
				(sa + 2*Math.PI - ang1)*(ea + 2*Math.PI - ang1) < tolerance || 
				(sa - 2*Math.PI - ang1)*(ea - 2*Math.PI - ang1) < tolerance) {
				let json = {};
				json[`${ax1}`] = sol1;
				json[`${ax2}`] = ysol1;						
				points.push(json);
			}
		}
		
		if (sol2 !== undefined && ysol2 !== undefined && (x1 - sol2)*(x2 - sol2) < tolerance && (y1 - ysol2)*(y2 - ysol2) < tolerance) {
			let ang2 = Math.atan2(ysol2 - yc, sol2 - xc);
			
			if ((sa - ang2)*(ea - ang2) < tolerance || 
				(sa + 2*Math.PI - ang2)*(ea + 2*Math.PI - ang2) < tolerance || 
				(sa - 2*Math.PI - ang2)*(ea - 2*Math.PI - ang2) < tolerance) {
				let json = {};
				json[`${ax1}`] = sol2;
				json[`${ax2}`] = ysol2;						
				points.push(json);
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
		let p_tangent = false;
		if (Math.abs(m) == Infinity) {
			const det = (B*x1 + E)*(B*x1 + E) - 4*C*(A*x1*x1 + D*x1 + F);				
			if (det < 0) {
				return [];
			} else if (Math.abs(det) < 0.0000001) {				
				sol1 = x1;
				ysol1 = -(B*x1 + E)/(2*C);
				p_tangent = true;
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
			
			if (det < 0) {							
				return [];
			} else if (Math.abs(det) < 0.0000001) {				
				const b = y1 - m*x1;						
				sol1 = -BB/(2*AA);									
				ysol1 = m*sol1 + b;				
				p_tangent = true;
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
				if (p_tangent) {
					json1.tangency_point = true;
				}
				points.push(json1);
			}
			if ((sol2 - x1)*(sol2 - x2) < tolerance && (ysol2 - y1)*(ysol2 - y2) < tolerance) {
				let json2 = {};
				json2[`${ax1}`] = sol2;
				json2[`${ax2}`] = ysol2;
				points.push(json2);
			}
		} else {
			let sa = entity2.start_parameter;
			let ea = entity2.end_parameter;	
			const a11 = a*Math.cos(theta);
			const a12 = b*Math.sin(theta);
			const a21 = a*Math.sin(theta);
			const a22 = b*Math.cos(theta);
			let alpha1, alpha2, isCrossing1, isCrossing2;
			
			if (sol1 && ysol1) {
				const c1 = sol1 - xc;
				const c2 = ysol1 - yc;
				let cosa = ((a22*c1 + a12*c2)/(a22*a11 + a12*a21));
				let sina = (a11*cosa - c1)/a12;
				alpha1 = Math.atan2(sina, cosa);
				isCrossing1 =  ((sol1 - x1)*(sol1 - x2) < tolerance && (ysol1 - y1)*(ysol1 - y2) < tolerance);
			}			
			
			if (sol2 && ysol2) {
				const c1 = sol2 - xc;
				const c2 = ysol2 - yc;
				let cosa = ((a22*c1 + a12*c2)/(a22*a11 + a12*a21));
				let sina = (a11*cosa - c1)/a12;
				alpha2 = Math.atan2(sina, cosa);
				isCrossing2 =  ((sol2 - x1)*(sol2 - x2) < tolerance && (ysol2 - y1)*(ysol2 - y2) < tolerance);
			}
			
			if (alpha1 < 0 || alpha2 < 0) {
				alpha1 = alpha1 + 2*Math.PI;
				alpha2 = alpha2 + 2*Math.PI;
			}
			if (isCrossing1 && (alpha1 - sa)*(alpha1 - ea) < tolerance) {
				let json1 = {};
				json1[`${ax1}`] = sol1;
				json1[`${ax2}`] = ysol1;
				if (p_tangent) {
					json1.tangency_point = true;
				}
				points.push(json1);
			}
			if (isCrossing2 && (alpha2 - sa)*(alpha2 - ea) < tolerance) {
				let json2 = {};
				json2[`${ax1}`] = sol2;
				json2[`${ax2}`] = ysol2;
				points.push(json2);
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
		if (entity1.type == "Closed") {
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
		
		if (entity1.type == "Closed") {
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
	}  else if ((etype1 == "AcDbCircle" && etype2 == "AcDbCircle")) {
		const x1 = entity1[ax1];
		const y1 = entity1[ax2];
		const x2 = entity2[ax1];
		const y2 = entity2[ax2];
		const r1 = entity1.radius;
		const r2 = entity2.radius;
		const R = Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
		const A = (r1*r1 - r2*r2)/R/R;
		const B = (r1*r1 + r2*r2)/R/R;
		const det = 2*B + - A*A - 1;
		let points = [];
		
		if (det < 0) {
			return [];
		} else if (Math.abs(det) < 0.0000001) {
			if (entity1.etype == "CIRCLE" && entity2.etype == "CIRCLE") {
				const xi1 = ((x1 + x2) + A*(x2 - x1))/2;
				const yi1 = ((y1 + y2) + A*(y2 - y1))/2;				
				let json = {};
				json[ax1] = xi1;
				json[ax2] = yi1;	
				json.tangency_point = true;				
				return [json];
			}
		} else {
			const sol1 = ((x1 + x2) + A*(x2 - x1) + Math.sqrt(det)*(y2 - y1))/2;
			const ysol1 = ((y1 + y2) + A*(y2 - y1) + Math.sqrt(det)*(x1 - x2))/2;
			const sol2 = ((x1 + x2) + A*(x2 - x1) - Math.sqrt(det)*(y2 - y1))/2;
			const ysol2 = ((y1 + y2) + A*(y2 - y1) - Math.sqrt(det)*(x1 - x2))/2;
			
			if (entity1.etype == "CIRCLE" && entity2.etype == "CIRCLE") {				
				let json = {}, json2 = {};
				json[ax1] = sol1;
				json[ax2] = ysol1;
				json2[ax1] = sol2;
				json2[ax2] = ysol2;
				return [json, json2];
			} else if ((entity1.etype == "ARC" && entity2.etype != "ARC") || 
			        (entity1.etype != "ARC" && entity2.etype == "ARC")) {
				let sa, ea;
				if (entity1.etype == "ARC") {
					sa = entity1.start_angle*Math.PI/180;
					ea = entity1.end_angle*Math.PI/180;
				} else {
					sa = entity2.start_angle*Math.PI/180;
					ea = entity2.end_angle*Math.PI/180;
				}
				
				if (sa > ea) {
					sa = sa - 2*Math.PI;
				}
				let points = [];
				
				let ang1 = Math.atan2(ysol1 - y1, sol1 - x1);
				let ang2 = Math.atan2(ysol2 - y1, sol2 - x1);
				
				if ((sa - ang1)*(ea - ang1) < tolerance || 
				    (sa + 2*Math.PI - ang1)*(ea + 2*Math.PI - ang1) < tolerance || 
				    (sa - 2*Math.PI - ang1)*(ea - 2*Math.PI - ang1) < tolerance) {
					let json = {};
					json[`${ax1}`] = sol1;
					json[`${ax2}`] = ysol1;						
					points.push(json);
				}
				
				if ((sa - ang2)*(ea - ang2) < tolerance || 
				    (sa + 2*Math.PI - ang2)*(ea + 2*Math.PI - ang2) < tolerance || 
				    (sa - 2*Math.PI - ang2)*(ea - 2*Math.PI - ang2) < tolerance) {
					let json = {};
					json[`${ax1}`] = sol2;
					json[`${ax2}`] = ysol2;						
					points.push(json);
				}						
				
				return points;
			
			} else {
				let sa1 = entity1.start_angle*Math.PI/180;
				let ea1 = entity1.end_angle*Math.PI/180;
				let sa2 = entity2.start_angle*Math.PI/180;
				let ea2 = entity2.end_angle*Math.PI/180;
				let ang1 = Math.atan2(ysol1 - y1, sol1 - x1);
				let ang2 = Math.atan2(ysol2 - y1, sol2 - x1);
				let ang3 = Math.atan2(ysol1 - y2, sol1 - x2);
				let ang4 = Math.atan2(ysol2 - y2, sol2 - x2);
				let points = [];
								
				if (sa1 > ea1) {
					sa1 = sa1 - 2*Math.PI;
				}
				if (sa2 > ea2) {
					sa2 = sa2 - 2*Math.PI;
				}
				
				if (((sa1 - ang1)*(ea1 - ang1) < tolerance || 
				    (sa1 + 2*Math.PI - ang1)*(ea1 + 2*Math.PI - ang1) < tolerance || 
				    (sa1 - 2*Math.PI - ang1)*(ea1 - 2*Math.PI - ang1) < tolerance) &&
					((sa2 - ang3)*(ea2 - ang3) < tolerance || 
				    (sa2 + 2*Math.PI - ang3)*(ea2 + 2*Math.PI - ang3) < tolerance || 
				    (sa2 - 2*Math.PI - ang3)*(ea2 - 2*Math.PI - ang3) < tolerance))	{
					let json = {};
					json[`${ax1}`] = sol1;
					json[`${ax2}`] = ysol1;						
					points.push(json);
				}
				
				if (((sa1 - ang2)*(ea1 - ang2) < tolerance || 
				    (sa1 + 2*Math.PI - ang2)*(ea1 + 2*Math.PI - ang2) < tolerance || 
				    (sa1 - 2*Math.PI - ang2)*(ea1 - 2*Math.PI - ang2) < tolerance) && 
					((sa2 - ang4)*(ea2 - ang4) < tolerance || 
				    (sa2 + 2*Math.PI - ang4)*(ea2 + 2*Math.PI - ang4) < tolerance || 
				    (sa2 - 2*Math.PI - ang4)*(ea2 - 2*Math.PI - ang4) < tolerance)) {
					let json = {};
					json[`${ax1}`] = sol2;
					json[`${ax2}`] = ysol2;						
					points.push(json);
				}	
				
				return points;
			}
		}	
		
		
		return points;
	}
	return [];
};

module.exports = intersection;	
	

