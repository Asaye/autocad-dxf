const Intersection = require("./Intersection");
const Distance = require("./Distance");
const CheckPointInside = require("./PolylineInside");
const BSpline = require("./BSpline");
const ErrorMessages = require("./ErrorMessages.json");

const checkInside = (data, item, plane, getAxes, tolerance) => {	
	const etype = item.subclass;		
	let [ax1, ax2] = getAxes(plane);
	
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	
	if (etype == "AcDbLine") {		
		let x, y;
		if (Array.isArray(data)) {
			x = data[0];
			y = data[1];			
		} else if (typeof data == "object" && data.subclass == "AcDbPoint") {
			x = data[ax1];
			y = data[ax2];
		} 
		
		if (isNaN(x) || isNaN(y)) {
			return false;
		} else {
			const x0 = item[`start_${ax1}`];
			const x1 = item[`end_${ax1}`];
			const y0 = item[`start_${ax2}`];
			const y1 = item[`end_${ax2}`];
			const m = (y0 - y1)/(x0 - x1);
			if (Math.abs(m) == Infinity) {
				return x == x0 && (y - y0)*(y - y1) < tolerance;
			} else {
				return Math.abs(y - (m*x + (y0 - m*x0))) < tolerance && (x - x0)*(x - x1) < tolerance && (y - y0)*(y - y1) < tolerance;
			}
		}
	} else if (etype == "AcDbCircle") {
		if (item.etype == "ARC") return false;
		const xc = item[ax1];
		const yc = item[ax2];		
		const radius = item.radius;
		if (Array.isArray(data)) {
			const x = data[0];
			const y = data[1];
			return ((x - xc)*(x - xc) + (y - yc)*(y - yc) <= (radius + tolerance)*(radius + tolerance));
		} else if (typeof data == "object") {
			data = JSON.parse(JSON.stringify(data));
			const etype2 = data.subclass;				
			if (etype2 == "AcDbPoint" || etype2 == "AcDbText" || etype2 == "AcDbMText") {
				data = [data[ax1], data[ax2]];					
				return checkInside(data, item, plane, getAxes, tolerance);
			} else if (etype2 == "AcDbLine") {
				const startPointInside = checkInside([data[`start_${ax1}`], data[`start_${ax2}`]], item, plane, getAxes, tolerance);				
				const endPointInside = checkInside([data[`end_${ax1}`], data[`end_${ax2}`]], item, plane, getAxes, tolerance);				
				return startPointInside && endPointInside;
			} else if (etype2 == "AcDbPolyline") {
				const vertices = data.vertices;
				for (let i = 0; i < vertices.length; i++) {
					const vertexInside = checkInside([vertices[i][ax1], vertices[i][ax2]], item, plane, getAxes, tolerance);
					if (!vertexInside) return false;
				}
				return true;
			} else if (etype2 == "AcDbCircle" && data.etype == "CIRCLE") {
				const radius2 = data.radius;
				if (radius2 > (radius + tolerance)) {
					return false;
				} else {
					item.radius = item.radius - data.radius;
					data = [data[ax1], data[ax2]];					
					return checkInside(data, item, plane, getAxes, tolerance);
				}
			} else if (etype2 == "AcDbCircle" && data.etype == "ARC") {
				const radius2 = data.radius;
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				let sa = data.start_angle*Math.PI/180, ea = data.end_angle*Math.PI/180;
				const x1 = data[ax1] + data.radius*Math.cos(sa);
				const y1 = data[ax2] + data.radius*Math.sin(sa);
				const x2 = data[ax1] + data.radius*Math.cos(ea);
				const y2 = data[ax2] + data.radius*Math.sin(ea);
			
				if ((!intersection || intersection.length == 0) && checkInside([x1, y1], item, plane, getAxes, tolerance)) { // there should not be intersection and any of the end points should be inside
					return true;
				} else if (intersection.length == 2 && checkInside([x1, y1], item, plane, getAxes, tolerance) && checkInside([x2, y2], item, plane, getAxes, tolerance)) { // there is intersection but both of the end points should be on the circle and the mid point along the arc must be outside
					if (sa > ea) {
						sa = sa - 2*Math.PI;
					}
					const x_mid = data[ax1] + data.radius*Math.cos((sa + ea)/2);
					const y_mid = data[ax2] + data.radius*Math.sin((sa + ea)/2);					
					return checkInside([x_mid, y_mid], item, plane, getAxes, tolerance);
				} else if (intersection.length == 1 && checkInside([x1, y1], item, plane, getAxes, tolerance) && checkInside([x2, y2], item, plane, getAxes, tolerance)) { // there is tangency and the arc ends must be inside
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else if (etype == "AcDbPolyline") {
		const vertices = JSON.parse(JSON.stringify(item.vertices));		
		if (Array.isArray(data)) {				
			const x = data[0], y = data[1];
			return CheckPointInside(vertices, x, y, ax1, ax2);
		} else if (typeof data == "object") {
			const etype2 = data.subclass;
			if (etype2 == "AcDbPoint" || etype2 == "AcDbText" || etype2 == "AcDbMText") {				
				return CheckPointInside(vertices, data[ax1], data[ax2], ax1, ax2);
			} else if (etype2 == "AcDbLine") {
				let x0 = data[`start_${ax1}`], y0 = data[`start_${ax2}`];
				let x1 = data[`end_${ax1}`], y1 = data[`end_${ax2}`];
				
				const ipt = Intersection(data, item, plane, getAxes, tolerance);
				
				if (ipt && ipt.length > 0) {
					for (let j = 0; j < ipt.length; j++) {
						if ((Math.abs(ipt[j][ax1] - x0) > tolerance || Math.abs(ipt[j][ax2] - y0) > tolerance) && 
							(Math.abs(ipt[j][ax1] - x1) > tolerance || Math.abs(ipt[j][ax2] - y1) > tolerance)) {
							return false;
						}
					}
				}
				const startPointInside = CheckPointInside(vertices, x0, y0, ax1, ax2);							
				const endPointInside = CheckPointInside(vertices, x1, y1, ax1, ax2);
				
				return startPointInside && endPointInside;
			} else if (etype2 == "AcDbPolyline") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				const vert = data.vertices;
				
				if (!intersection || intersection.length == 0) {					
					for (let i = 0; i < vert.length; i++) {
						let x = vert[i][ax1], y = vert[i][ax2];
						const vertexInside = CheckPointInside(vertices, x, y, ax1, ax2);
						if (!vertexInside) return false;
					}
					return true;
				} else {				
					for (let i = 0; i < intersection.length; i++) {
						let isVertex = false;
						const x = intersection[i][ax1];
						const y = intersection[i][ax2];
						for (let j = 0; j < vert.length; j++) {
							const pointInside = CheckPointInside(vertices, vert[j][ax1], vert[j][ax2], ax1, ax2);							
							if (!pointInside) return false;
							if (Math.abs(x - vert[j][ax1]) < tolerance && Math.abs(y - vert[j][ax2]) < tolerance) {
								isVertex = true;
							}
						}
						if (!isVertex) return false;
					}
					return true;
				}
			} else if (etype2 == "AcDbCircle" && data.etype == "CIRCLE") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);				
				let x = data[ax1], y = data[ax2], r = data.radius;
				if (!intersection || intersection.length == 0) {					
					return CheckPointInside(vertices, x, y, ax1, ax2);
				} else { // center inside, all intersections are tangents
					const centerInside = CheckPointInside(vertices, x, y, ax1, ax2);
					if (!centerInside) {
						return false;
					}
					for (let i = 0; i < intersection.length; i++) {						
						if (!intersection[i].tangency_point) {
							return false
						}							
					}
					return true;
				}
			} else if (etype2 == "AcDbCircle" && data.etype == "ARC") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				const x1 = data[ax1] + data.radius*Math.cos(data.start_angle);
				const y1 = data[ax2] + data.radius*Math.sin(data.start_angle);
				const x2 = data[ax1] + data.radius*Math.cos(data.end_angle);
				const y2 = data[ax2] + data.radius*Math.sin(data.end_angle);
				const p1Inside = CheckPointInside(vertices, x1, y1, ax1, ax2);
				const p2Inside = CheckPointInside(vertices, x2, y2, ax1, ax2);
				if ((!intersection || intersection.length == 0) && p1Inside) { // there should not be intersection and any of the end points should be inside
					return true;
				} else if (intersection.length == 2 && p1Inside && p2Inside &&
					!CheckPointInside(vertices, data[ax1], data[ax2], ax1, ax2)) { // there is intersection but both of the end points should be on the circle and the center must be outside
					return true;
				} else if (intersection.length == 1 && p1Inside && p2Inside) { // there is tangency and the arc ends must be inside
					return true;
				} else {
					return false;
				}
			} else if (etype2 == "AcDbEllipse") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				console.log(intersection);
				let x = data[ax1], y = data[ax2];				
				if (!intersection || intersection.length == 0) {
					if (!isNaN(data[`start_${ax1}`]) && !isNaN(data[`start_${ax2}`])) {
						return CheckPointInside(vertices, data[`start_${ax1}`], data[`start_${ax2}`], ax1, ax2);
					} else {
						return CheckPointInside(vertices, x, y, ax1, ax2);
					} 	
				} else { // center inside, all intersections are tangents or ellipse end points
					if (!isNaN(data[`start_${ax1}`]) && !isNaN(data[`start_${ax2}`])) {
						const x0 = data[`start_${ax1}`];
						const y0 = data[`start_${ax2}`];
						const x1 = data[`end_${ax1}`];
						const y1 = data[`end_${ax2}`];
						const p1Inside = CheckPointInside(vertices, x0, y0, ax1, ax2);
						
						if (!p1Inside) {
							return false;
						}
						const p2Inside = CheckPointInside(vertices, x1, y1, ax1, ax2);						
						if (!p2Inside) {
							return false;
						}
						
						let dx = data[`major_end_d${ax1}`];
						let dy = data[`major_end_d${ax2}`];						
						const ratio = data.minorToMajor;
						const a = Math.sqrt(dx*dx + dy*dy);
						const b = ratio*a;		
						const theta = Math.atan2(dy, dx);		
						let sa = data.start_parameter;
						let ea = data.end_parameter;
						if (sa > ea) {
							sa = sa - 2*Math.PI;
						}
						const mid = (sa + ea)/2;
						const mid_x = data[ax1] + a*Math.cos(mid)*Math.cos(theta) - b*Math.sin(mid)*Math.sin(theta);
						const mid_y = data[ax2] + a*Math.cos(mid)*Math.sin(theta) + b*Math.sin(mid)*Math.cos(theta);
						const midInside = CheckPointInside(vertices, mid_x, mid_y, ax1, ax2);
						if (!midInside) {
							return false;
						}
						for (let i = 0; i < intersection.length; i++) {
							const endPt = (Math.abs(intersection[i][ax1] - x0) < tolerance && Math.abs(intersection[i][ax2] - y0) < tolerance) || 
										  (Math.abs(intersection[i][ax1] - x1) < tolerance && Math.abs(intersection[i][ax2] - y1) < tolerance);
							if (!intersection[i].tangency_point && !endPt) {
								return false
							}							
						}
					} else {
						const centerInside = CheckPointInside(vertices, x, y, ax1, ax2);
						if (!centerInside) {
							return false;
						}
						for (let i = 0; i < intersection.length; i++) {						
							if (!intersection[i].tangency_point) {
								return false
							}							
						}
					}
					
					return true;
				}
			} else {
				return false;
			}
		}
	} else if (etype == "AcDbEllipse") {
		const sa = item.start_parameter;
		const ea = item.end_parameter;
		if (Math.abs(Math.abs(ea - sa) - 2*Math.PI) > tolerance) {
			return false;
		}
		const xc = item[ax1];
		const yc = item[ax2];
		const dx = item[`major_end_d${ax1}`];
		const dy = item[`major_end_d${ax2}`];
		const ratio = item.minorToMajor;
		const a = Math.sqrt(dx*dx + dy*dy);
		const b = ratio*a;
		const theta = Math.atan2(dy, dx);
		const A = Math.pow(a*Math.sin(theta), 2) + Math.pow(b*Math.cos(theta), 2);
		const B = 2*(b*b - a*a)*Math.sin(theta)*Math.cos(theta);
		const C = Math.pow(a*Math.cos(theta), 2) + Math.pow(b*Math.sin(theta), 2);
		const D = -2*A*xc - B*yc;
		const E = -B*xc - 2*C*yc;
		const F = A*xc*xc + B*xc*yc + C*yc*yc - a*a*b*b;
		if (Array.isArray(data)) {
			const x = data[0];
			const y = data[1];			
			return (A*x*x + B*x*y + C*y*y + D*x + E*y + F) <= tolerance;
		} else if (typeof data == "object") {
			data = JSON.parse(JSON.stringify(data));
			const etype2 = data.subclass;
			
			if (etype2 == "AcDbPoint" || etype2 == "AcDbText" || etype2 == "AcDbMText") {
				data = [data[ax1], data[ax2]];
				return checkInside(data, item, plane, getAxes, tolerance);
			} else if (etype2 == "AcDbLine") {
				const startPointInside = checkInside([data[`start_${ax1}`], data[`start_${ax2}`]], item, plane, getAxes, tolerance);
				const endPointInside = checkInside([data[`end_${ax1}`], data[`end_${ax2}`]], item, plane, getAxes, tolerance);
				return startPointInside && endPointInside;
			} else if (etype2 == "AcDbPolyline") {
				const vertices = data.vertices;
				for (let i = 0; i < vertices.length; i++) {
					data = [vertices[i][ax1], vertices[i][ax2]];
					const vertexInside = checkInside(data, item, plane, getAxes, tolerance);
					if (!vertexInside) return false;
				}
				return true;
			} else if (etype2 == "AcDbCircle") {
				return false; // to be implemented
			} else if (etype2 == "AcDbArc") {
				return false; // to be implemented
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	return false;
};

const checkOutside = (data, item, plane, getAxes, tolerance) => {	
	const etype = item.subclass;		
	let [ax1, ax2] = getAxes(plane);
	
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	
	if (etype == "AcDbPoint" || etype == "AcDbMLine" || etype == "AcDbDimension" || etype == "AcDbAlignedDimension"
		|| etype == "AcDbText" || etype == "AcDbMText" || etype == "AcDbSpline") {
		return false;
	} else if (etype == "AcDbLine") {		
		let x, y;
		if (Array.isArray(data)) {
			x = data[0];
			y = data[1];			
		} else if (typeof data == "object") {
			x = data[ax1];
			y = data[ax2];
		} 
		
		if (isNaN(x) || isNaN(y)) {
			return false;
		} else {
			const x0 = item[`start_${ax1}`];
			const x1 = item[`end_${ax1}`];
			const y0 = item[`start_${ax2}`];
			const y1 = item[`end_${ax2}`];
			const m = (y0 - y1)/(x0 - x1);
			const intersection = Intersection(data, item, plane, getAxes, tolerance);
			
			if (intersection.length > 1) {
				return false;
			}
			
			if (intersection.length == 1 && (Math.abs(x - x0) > tolerance || Math.abs(y - y0) > tolerance) && (Math.abs(x - x1) > tolerance || Math.abs(y - y1) > tolerance)) {
				return false;
			}
			if (Math.abs(m) == Infinity) {
				return Math.abs(x - x0) > tolerance || (y - y0)*(y - y1) > tolerance;
			} else {
				return Math.abs(y - (m*x + (y0 - m*x0))) > tolerance || (x - x0)*(x - x1) > tolerance || (y - y0)*(y - y1) > tolerance;
			}
		}
	} else if (etype == "AcDbCircle") {
		const xc = item[ax1];
		const yc = item[ax2];
		
		const radius = item.radius;
		if (Array.isArray(data)) {
			const x = data[0];
			const y = data[1];
			return ((x - xc)*(x - xc) + (y - yc)*(y - yc) > (radius + tolerance)*(radius + tolerance));
		} else if (typeof data == "object") {
			data = JSON.parse(JSON.stringify(data));
			const etype2 = data.subclass;				
			if (etype2 == "AcDbPoint" || etype2 == "AcDbText" || etype2 == "AcDbMText") {
				data = [data[ax1], data[ax2]];					
				return checkOutside(data, item, plane, getAxes, tolerance);
			} else if (etype2 == "AcDbLine") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				if (intersection.length > 1) {
					return false;
				} else {
					const x0 = data[`start_${ax1}`];
					const y0 = data[`start_${ax2}`];
					const x1 = data[`end_${ax1}`];
					const y1 = data[`end_${ax2}`];
					const startPointOutside = checkOutside([x0, y0], item, plane, getAxes, tolerance);				
					const endPointOutside = checkOutside([x1, y1], item, plane, getAxes, tolerance);	
					if (intersection.length == 1) {
						const xi = intersection[0][ax1];
						const yi = intersection[0][ax2];
						return (((startPointOutside || endPointOutside) && ((Math.abs(x0 - xi) < tolerance && Math.abs(y0 - yi) < tolerance) || 
						(Math.abs(x1 - xi) < tolerance && Math.abs(y1 - yi) < tolerance))) || // both points outside or one point outside and one point on the circle
						(startPointOutside && endPointOutside && intersection[0].tangency_point));  // both points outside but the line is tangent
					} else {		
						return startPointOutside && endPointOutside;
					}
				}
			} else if (etype2 == "AcDbPolyline") {
				const vertices = JSON.parse(JSON.stringify(data.vertices));	
				if (data.type == "Closed") {
					vertices.push(vertices[0]);
				}
				for (let i = 1; i < vertices.length; i++) {
					const x0 = vertices[i - 1][ax1];
					const y0 = vertices[i - 1][ax2];
					const x1 = vertices[i][ax1];
					const y1 = vertices[i][ax2];
					const json = {subclass: "AcDbLine"};
					json[`start_${ax1}`] = x0;
					json[`start_${ax2}`] = y0;
					json[`end_${ax1}`] = x1;
					json[`end_${ax2}`] = y1;
					const vertexOutside = checkOutside(json, item, plane, getAxes, tolerance);
					if (!vertexOutside) return false;
				}
				return true;
			} else if (etype2 == "AcDbCircle" && data.etype == "CIRCLE") {
				const radius2 = data.radius;
				if (radius2 > (radius + tolerance)) {
					return true;
				} else {
					item.radius = item.radius - data.radius;
					data = [data[ax1], data[ax2]];					
					return checkOutside(data, item, plane, getAxes, tolerance);
				}
			} else if (etype2 == "AcDbCircle" && data.etype == "ARC") {
				const radius2 = data.radius;
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				let sa = data.start_angle*Math.PI/180, ea = data.end_angle*Math.PI/180;
				const x1 = data[ax1] + data.radius*Math.cos(sa);
				const y1 = data[ax2] + data.radius*Math.sin(sa);
				const x2 = data[ax1] + data.radius*Math.cos(ea);
				const y2 = data[ax2] + data.radius*Math.sin(ea);
			
				if ((!intersection || intersection.length == 0) && checkOutside([x1, y1], item, plane, getAxes, tolerance)) { // there should not be intersection and any of the end points should be inside
					return true;
				} else if (intersection.length == 2 && checkInside([x1, y1], item, plane, getAxes, tolerance) && checkInside([x2, y2], item, plane, getAxes, tolerance)) { // there is intersection but both of the end points should be on the circle and the mid point along the arc must be outside
					if (sa > ea) {
						sa = sa - 2*Math.PI;
					}
					const x_mid = data[ax1] + data.radius*Math.cos((sa + ea)/2);
					const y_mid = data[ax2] + data.radius*Math.sin((sa + ea)/2);					
					return !checkInside([x_mid, y_mid], item, plane, getAxes, tolerance);
				} else if (intersection.length == 1 && 
					(((intersection[0][ax1] - x1) < tolerance && (intersection[0][ax2] - y1) < tolerance && checkOutside([x2, y2], item, plane, getAxes, tolerance)) || 
					((intersection[0][ax1] - x2) < tolerance && (intersection[0][ax2] - y2) < tolerance && checkOutside([x1, y1], item, plane, getAxes, tolerance)))) { // there is tangency and the arc ends must be inside
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else if (etype == "AcDbPolyline") {
		const vertices = JSON.parse(JSON.stringify(item.vertices));		
		if (Array.isArray(data)) {				
			const x = data[0], y = data[1];
			return !CheckPointInside(vertices, x, y, ax1, ax2);
		} else if (typeof data == "object") {
			const etype2 = data.subclass;
			if (etype2 == "AcDbPoint" || etype2 == "AcDbText" || etype2 == "AcDbMText") {				
				return !CheckPointInside(vertices, data[ax1], data[ax2], ax1, ax2);
			} else if (etype2 == "AcDbLine") {
				let x0 = data[`start_${ax1}`], y0 = data[`start_${ax2}`];
				let x1 = data[`end_${ax1}`], y1 = data[`end_${ax2}`];
				
				const ipt = Intersection(data, item, plane, getAxes, tolerance);
				console.log(ipt);
				const startPointInside = CheckPointInside(vertices, x0, y0, ax1, ax2);				
				if (!ipt || ipt.length == 0) {
					return !startPointInside;
				} else {					
					ipt.sort((a, b) => x1 > x0 && a[ax1] > b[ax1] ? 1 : (x1 == x0 && y1 > y0 ? (a[ax2] > b[ax2] ? 1: -1): -1));
					console.log(ipt);
					const d1 = (ipt[0][ax1] - x0)*(ipt[0][ax1] - x0) + (ipt[0][ax2] - y0)*(ipt[0][ax2] - y0); 
					const d2 = (ipt[0][ax1] - x1)*(ipt[0][ax1] - x1) + (ipt[0][ax2] - y1)*(ipt[0][ax2] - y1); 
					
					if (d1 > tolerance) {
						const x_mid = (ipt[0][ax1] + x0)/2;
						const y_mid = (ipt[0][ax2] + y0)/2;
						const midPointInside = CheckPointInside(vertices, x_mid, y_mid, ax1, ax2);
						if (midPointInside) return false;
					}
					if (d2 > tolerance) {
						const x_mid = (ipt[ipt.length - 1][ax1] + x1)/2;
						const y_mid = (ipt[ipt.length - 1][ax2] + y1)/2;
						const midPointInside = CheckPointInside(vertices, x_mid, y_mid, ax1, ax2);
						if (midPointInside) return false;
					}
					for (let j = 1; j < ipt.length; j++) { // any mid point between end points and intersection points or between two consecutive intersection points should be outside
						if ((Math.abs(ipt[j][ax1] - x0) < tolerance && Math.abs(ipt[j][ax2] - y0) < tolerance) || 
							(Math.abs(ipt[j][ax1] - x1) < tolerance && Math.abs(ipt[j][ax2] - y1) < tolerance)) {
							continue;
						}
						
						const x_mid = (ipt[j][ax1] + ipt[j - 1][ax1])/2;
						const y_mid = (ipt[j][ax2] + ipt[j - 1][ax2])/2;
						
						const midPointInside = CheckPointInside(vertices, x_mid, y_mid, ax1, ax2);
						if (midPointInside) return false;
					}
				}
				return true;
			} else if (etype2 == "AcDbPolyline") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				const vert = data.vertices;
				
				if (!intersection || intersection.length == 0) {					
					for (let i = 0; i < vert.length; i++) {
						let x = vert[i][ax1], y = vert[i][ax2];
						const vertexInside = CheckPointInside(vertices, x, y, ax1, ax2);
						if (vertexInside) return false;
					}
					return true;
				} else {
					// all the intersection points should be one of the vertices of either polyline and at least one vertex of the outer polyline should be outside;
					let onePointOutside = false;
					
					for (let i = 0; i < intersection.length; i++) {
						let isVertex = false;
						const x = intersection[i][ax1];
						const y = intersection[i][ax2];
						for (let j = 0; j < vert.length; j++) {
							if (!onePointOutside) {
								const pointInside = CheckPointInside(vertices, vert[j][ax1], vert[j][ax2], ax1, ax2);	
								if (!pointInside) {
									onePointOutside = true;
								} 
							}
							if (Math.abs(x - vert[j][ax1]) < tolerance && Math.abs(y - vert[j][ax2]) < tolerance) {
								isVertex = true;
							}
						}
						for (let j = 0; j < vertices.length; j++) {							
							if (Math.abs(x - vertices[j][ax1]) < tolerance && Math.abs(y - vertices[j][ax2]) < tolerance) {
								isVertex = true;
								break;
							}
						}
						
						if (!isVertex) return false;
					}
					
					return onePointOutside;
				}
			} else if (etype2 == "AcDbCircle" && data.etype == "CIRCLE") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);				
				let x = data[ax1], y = data[ax2], r = data.radius;
				if (!intersection || intersection.length == 0) {					
					return !CheckPointInside(vertices, x, y, ax1, ax2);
				} else { // center inside, all intersections are tangents
					const centerInside = CheckPointInside(vertices, x, y, ax1, ax2);
					if (centerInside) {
						return false;
					}
					for (let i = 0; i < intersection.length; i++) {						
						if (!intersection[i].tangency_point) {
							return false
						}							
					}
					return true;
				}
			} else if (etype2 == "AcDbCircle" && data.etype == "ARC") {
				const radius2 = data.radius;
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				let sa = data.start_angle*Math.PI/180, ea = data.end_angle*Math.PI/180;
				const x1 = data[ax1] + data.radius*Math.cos(sa);
				const y1 = data[ax2] + data.radius*Math.sin(sa);
				const x2 = data[ax1] + data.radius*Math.cos(ea);
				const y2 = data[ax2] + data.radius*Math.sin(ea);
			
				if ((!intersection || intersection.length == 0) && checkOutside([x1, y1], item, plane, getAxes, tolerance)) { // there should not be intersection and any of the end points should be inside
					return true;
				} else if (intersection.length == 2 && checkInside([x1, y1], item, plane, getAxes, tolerance) && checkInside([x2, y2], item, plane, getAxes, tolerance)) { // there is intersection but both of the end points should be on the circle and the mid point along the arc must be outside
					if (sa > ea) {
						sa = sa - 2*Math.PI;
					}
					const x_mid = data[ax1] + data.radius*Math.cos((sa + ea)/2);
					const y_mid = data[ax2] + data.radius*Math.sin((sa + ea)/2);					
					return !checkInside([x_mid, y_mid], item, plane, getAxes, tolerance);
				} else if (intersection.length == 1 && 
					(((intersection[0][ax1] - x1) < tolerance && (intersection[0][ax2] - y1) < tolerance && checkOutside([x2, y2], item, plane, getAxes, tolerance)) || 
					((intersection[0][ax1] - x2) < tolerance && (intersection[0][ax2] - y2) < tolerance && checkOutside([x1, y1], item, plane, getAxes, tolerance)))) { // there is tangency and the arc ends must be inside
					return true;
				} else {
					return false;
				}
			} else if (etype2 == "AcDbEllipse") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				
				let x = data[ax1], y = data[ax2];				
				if (!intersection || intersection.length == 0) {
					if (!isNaN(data[`start_${ax1}`]) && !isNaN(data[`start_${ax2}`])) {
						return !CheckPointInside(vertices, data[`start_${ax1}`], data[`start_${ax2}`], ax1, ax2);
					} else {
						return !CheckPointInside(vertices, x, y, ax1, ax2);
					} 	
				} else { // center inside, all intersections are tangents
					if (!isNaN(data[`start_${ax1}`]) && !isNaN(data[`start_${ax2}`])) {
						const x0 = data[`start_${ax1}`];
						const y0 = data[`start_${ax2}`];
						const x1 = data[`end_${ax1}`];
						const y1 = data[`end_${ax2}`];
						let p1EndPoint = false, p2EndPoint = false;
						for (let j = 0; j < intersection.length; j++) {
							const x = intersection[j][ax1];
							const y = intersection[j][ax2];
							if (!p1EndPoint && Math.abs(x0 - x) < tolerance && Math.abs(y0 - y) < tolerance && !intersection[j].tangency_point) {
								p1EndPoint = true;
							}
							if (!p2EndPoint && Math.abs(x1 - x) < tolerance && Math.abs(y1 - y) < tolerance && !intersection[j].tangency_point) {
								p2EndPoint = true;
							}
						}
						const p1Inside = CheckPointInside(vertices, x0, y0, ax1, ax2);
						
						if (p1Inside && !p1EndPoint) {
							return false;
						}
						const p2Inside = CheckPointInside(vertices, x1, y1, ax1, ax2);
						if (p2Inside && !p2EndPoint) {
							return false;
						}
						let dx = data[`major_end_d${ax1}`];
						let dy = data[`major_end_d${ax2}`];						
						const ratio = data.minorToMajor;
						const a = Math.sqrt(dx*dx + dy*dy);
						const b = ratio*a;		
						const theta = Math.atan2(dy, dx);		
						let sa = data.start_parameter;
						let ea = data.end_parameter;
						if (sa > ea) {
							sa = sa - 2*Math.PI;
						}
						const mid = (sa + ea)/2;
						const mid_x = data[ax1] + a*Math.cos(mid)*Math.cos(theta) - b*Math.sin(mid)*Math.sin(theta);
						const mid_y = data[ax2] + a*Math.cos(mid)*Math.sin(theta) + b*Math.sin(mid)*Math.cos(theta);
						const midInside = CheckPointInside(vertices, mid_x, mid_y, ax1, ax2);
						if (midInside) {
							return false;
						}
					} else {
						const centerInside = CheckPointInside(vertices, x, y, ax1, ax2);
						if (centerInside) {
							return false;
						}
						for (let i = 0; i < intersection.length; i++) {						
							if (!intersection[i].tangency_point) {
								return false
							}							
						}
					}
					
					return true;
				}
			} else {
				return false;
			}
		}
	} else if (etype == "AcDbEllipse") {
		const sa = item.start_parameter;
		const ea = item.end_parameter;
		if (Math.abs(Math.abs(ea - sa) - 2*Math.PI) > tolerance) {
			return false;
		}
		const xc = item[ax1];
		const yc = item[ax2];
		const dx = item[`major_end_d${ax1}`];
		const dy = item[`major_end_d${ax2}`];
		const ratio = item.minorToMajor;
		const a = Math.sqrt(dx*dx + dy*dy);
		const b = ratio*a;
		const theta = Math.atan2(dy, dx);
		const A = Math.pow(a*Math.sin(theta), 2) + Math.pow(b*Math.cos(theta), 2);
		const B = 2*(b*b - a*a)*Math.sin(theta)*Math.cos(theta);
		const C = Math.pow(a*Math.cos(theta), 2) + Math.pow(b*Math.sin(theta), 2);
		const D = -2*A*xc - B*yc;
		const E = -B*xc - 2*C*yc;
		const F = A*xc*xc + B*xc*yc + C*yc*yc - a*a*b*b;
		if (Array.isArray(data)) {
			const x = data[0];
			const y = data[1];			
			return (A*x*x + B*x*y + C*y*y + D*x + E*y + F) > tolerance;
		} else if (typeof data == "object") {
			data = JSON.parse(JSON.stringify(data));
			const etype2 = data.subclass;
			
			if (etype2 == "AcDbPoint" || etype2 == "AcDbText" || etype2 == "AcDbMText") {
				data = [data[ax1], data[ax2]];
				return !checkInside(data, item, plane, getAxes, tolerance);
			} else if (etype2 == "AcDbLine") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				const startPointOutside = checkOutside([data[`start_${ax1}`], data[`start_${ax2}`]], item, plane, getAxes, tolerance);
				const endPointOutside = checkOutside([data[`end_${ax1}`], data[`end_${ax2}`]], item, plane, getAxes, tolerance);
				if (!intersection || intersection.length == 0) {
					return startPointOutside && endPointOutside;
				} else if (intersection.length > 1) {
					return false;
				} else {
					const i = intersection[0];
					const tangent = i.tangency_point;
					const x0 = data[`start_${ax1}`];
					const y0 = data[`start_${ax2}`];
					const x1 = data[`end_${ax1}`];
					const y1 = data[`end_${ax2}`];
					const endPt = ((Math.abs(i[ax1] - x0) < tolerance && Math.abs(i[ax2] - y0) < tolerance)) || 
							      ((Math.abs(i[ax1] - x1) < tolerance && Math.abs(i[ax2] - y1) < tolerance));
					return (startPointOutside || endPointOutside) && (tangent || endPt);
				}
			} else if (etype2 == "AcDbPolyline") {
				const intersection = Intersection(data, item, plane, getAxes, tolerance);
				if (!intersection || intersection.length == 0) {
					const vertices = data.vertices;
					for (let i = 0; i < vertices.length; i++) {
						data = [vertices[i][ax1], vertices[i][ax2]];
						const vertexOutside = checkOutside(data, item, plane, getAxes, tolerance);					
						if (!vertexOutside) return false;
					}
				} else {
					const vertices = JSON.parse(JSON.stringify(data.vertices));
					if (data.type == "Closed") {
						vertices.push(vertices[0]);
					}
					for (let i = 0; i < intersection.length; i++) {
						const x = intersection[i][ax1];
						const y = intersection[i][ax2];
						let endPoint = false;
						for (let j = 0; j < vertices.length; j++) {
							if (j > 0) {
								const mid_x = (vertices[j - 1][ax1] + vertices[j][ax1])/2;
								const mid_y = (vertices[j - 1][ax2] + vertices[j][ax2])/2;
								const midOutside = checkOutside([mid_x, mid_y], item, plane, getAxes, tolerance);
								if (!midOutside) return false;
							}
							if (Math.abs(vertices[j][ax1] - x) < tolerance && Math.abs(vertices[j][ax2] - y) < tolerance) {
								endPoint = true;
								break;
							}
						}
						if (!endPoint) return false;
					}
				}
				
				return true;
			} else if (etype2 == "AcDbCircle") {
				return false; // to be implemented
			} else if (etype2 == "AcDbArc") {
				return false; // to be implemented
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	return false;
};


	
const checkOnside = (data, item, plane, getAxes, tolerance) => {	
	const etype = item.subclass;
	
	let [ax1, ax2] = getAxes(plane);
	
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	const x = Array.isArray(data) ? data[0] : data[ax1];
	const y = Array.isArray(data) ? data[1] : data[ax2];
	
	if (etype == "AcDbPoint" || etype == "AcDbText" || etype == "AcDbMText") {		
		return Math.abs(x - item[ax1]) < tolerance && Math.abs(y - item[ax2]) < tolerance;
	} else if (etype == "AcDbLine") {
		const x0 = item[`start_${ax1}`];
		const y0 = item[`start_${ax2}`];
		const x1 = item[`end_${ax1}`];
		const y1 = item[`end_${ax2}`];
		const m = (y1 - y0)/(x1 - x0);		
		if (Math.abs(m) == Infinity) {			
			return (y0 - y)*(y1 - y) < tolerance && (Math.abs(x - x0) <= tolerance);
		} else {
			const isInside = (x0 - x)*(x1 - x) < tolerance && (y0 - y)*(y1 - y) < tolerance;			
			return isInside && (Math.abs(y - (m*(x - x1) + y1)) <= tolerance);
		}		
	} else if (etype == "AcDbCircle" && item.etype == "CIRCLE") {
		const xc = item[ax1];
		const yc = item[ax2];
		const radius = item.radius;
		const d = Math.sqrt((x - xc)*(x - xc) + (y - yc)*(y - yc));
		return Math.abs(d - radius) <= tolerance;
	} else if (etype == "AcDbCircle") {
		const xc = item[ax1];
		const yc = item[ax2];
		const radius = item.radius;
		const d = Math.sqrt((x - xc)*(x - xc) + (y - yc)*(y - yc));
		let theta = Math.atan2(y - yc, x - xc);
		if (theta < 0) {
			theta = 2*Math.PI + theta;
		}
		let sa = item.start_angle*Math.PI/180;
		let ea = item.end_angle*Math.PI/180;
		
		if (sa > ea) {
			sa = sa - 2*Math.PI;
		}
		
		const isInside = (sa - theta)*(ea - theta) < tolerance;
		return isInside && Math.abs(d - radius) <= tolerance;
	} else if (etype == "AcDbSpline") { // excluding points on each end 
		const eqn = BSpline(item).equations;
		
		const X = ax1.toUpperCase();
		const Y = ax2.toUpperCase();
		for (let i = 0; i < eqn.length; i++) {
			const interval = eqn[i].interval;			
			const lower = parseFloat(interval.substring(0, interval.indexOf("≤")));
			const upper = parseFloat(interval.substring(interval.lastIndexOf("≤") + 1));			
			const nurbs = eqn[i].nurbs;
			const x_num = nurbs[X].coefficients_numerator;
			const x_denom = nurbs[X].coefficients_denominator;			
			const x_fn = (t) => (((x_num[0]*t*t*t + x_num[1]*t*t + x_num[2]*t + x_num[3])/(x_denom[0]*t*t*t + x_denom[1]*t*t + x_denom[2]*t + x_denom[3])) - x);
			const y_num = nurbs[Y].coefficients_numerator;
			const y_denom = nurbs[Y].coefficients_denominator;
			const y_fn = (t) => (((y_num[0]*t*t*t + y_num[1]*t*t + y_num[2]*t + y_num[3])/(y_denom[0]*t*t*t + y_denom[1]*t*t + y_denom[2]*t + y_denom[3])) - y);
			const x_sol = bisection(x_fn, lower, upper, 0.0000001);
			const y_sol = bisection(y_fn, lower, upper, 0.0000001);	
			
			if (x_sol === undefined || y_sol === undefined) continue;
			
			if ((x_sol - lower)*(x_sol - upper) < tolerance && (y_sol - lower)*(y_sol - upper) < tolerance && Math.abs(x_sol - y_sol) < tolerance) {
				return true;
			}
		}
		return false;
	} else if (etype == "AcDbPolyline") {
		const vertices = JSON.parse(JSON.stringify(item.vertices));
		if (vertices.type == "Closed") {
			vertices.push(vertices[0]);
		}
		
		for (let i = 1; i < vertices.length; i++) {
			const x0 = vertices[i - 1][ax1];
			const y0 = vertices[i - 1][ax2];
			const x1 = vertices[i][ax1];
			const y1 = vertices[i][ax2];
			const m = (y1 - y0)/(x1 - x0);		
			if (Math.abs(m) == Infinity) {			
				if ((y0 - y)*(y1 - y) < tolerance && (Math.abs(x - x0) <= tolerance)) {
					return true;
				}
			} else {
				const isInside = (x0 - x)*(x1 - x) < tolerance && (y0 - y)*(y1 - y) < tolerance;			
				if (isInside && (Math.abs(y - (m*(x - x1) + y1)) <= tolerance)) {
					return true;
				}
			}			
		}
		
		return false;
	} else if (etype == "AcDbEllipse") {
		const xc = item[ax1];
		const yc = item[ax2];
		const dx = item[`major_end_d${ax1}`];
		const dy = item[`major_end_d${ax2}`];
		const ratio = item.minorToMajor;
		const a = Math.sqrt(dx*dx + dy*dy);
		const b = ratio*a;
		const theta = Math.atan2(dy, dx);	
		if (!isNaN(item[`start_${ax1}`]) && !isNaN(item[`start_${ax2}`])) {				
			let sa = 0;			
			let ea = item.end_angle - item.start_angle;			
			const a1 = a*Math.cos(theta);
			const b1 = -b*Math.sin(theta);
			const c1 = x - xc;
			const a2 = a*Math.sin(theta);
			const b2 = b*Math.cos(theta);
			const c2 = y - yc;
			const sin_a = (a2*c1 - a1*c2)/(a2*b1 - a1*b2);
			const cos_a = (b2*c1 - b1*c2)/(b2*a1 - b1*a2);
			const alpha = Math.atan2(sin_a, cos_a);
			const zs = (a - b)*Math.sin(alpha);		
			const dx1s = zs*Math.sin(theta);
			const dy1s = zs*Math.cos(theta);		
			const xp1s = a*Math.cos(alpha + theta);
			const yp1s = a*Math.sin(alpha + theta);		
			let true_sa = (Math.atan2((yp1s - dy1s), (xp1s + dx1s)))*180/Math.PI- item.start_angle;
			if (true_sa < -tolerance) true_sa = true_sa + 360;
			if (ea < -tolerance) ea = ea + 360;			
			if ((sa - true_sa)*(ea - true_sa) > tolerance) return false;
		} 
		
		const A = Math.pow(a*Math.sin(theta), 2) + Math.pow(b*Math.cos(theta), 2);
		const B = 2*(b*b - a*a)*Math.sin(theta)*Math.cos(theta);
		const C = Math.pow(a*Math.cos(theta), 2) + Math.pow(b*Math.sin(theta), 2);
		const D = -2*A*xc - B*yc;
		const E = -B*xc - 2*C*yc;
		const F = A*xc*xc + B*xc*yc + C*yc*yc - a*a*b*b;
		const eqn = (A*x*x + B*x*y + C*y*y + D*x + E*y + F);		
		return Math.abs(eqn) <= tolerance;
	}
	return false;
};

const bisection = (fn, xl, xu, tolerance) => {
	let ea = Infinity, xr_prev;
	const fxl = fn(xl);
	const fxu = fn(xu);
	
	if (fxl*fxu > 0) return;
	//let xr = (xu*fxl - xl*fxu)/(fxl - fxu); // false-position formula
	let xr = 0.5*(xl + xu);
	let count = 0;
	
	do { 
		count++;
		xr_prev = xr;		
		if (fn(xl)*fn(xr) < 0) {
			xu = xr;
		} else if (fn(xl)*fn(xr) > 0) {
			xl = xr;
		} else {
			return xr;
		}
		//xr = (xu*fn(xl) - xl*fn(xu))/(fn(xl) - fn(xu)); // false-position formula
		xr = 0.5*(xl + xu);
		
		//if (Math.abs(fn(xr)) < tolerance) {	to avoid instabilities associated with false-position formula		
			//return xr;
		//}
		
		ea = xr_prev === 0 ? (xr - xr_prev)/xr : (xr - xr_prev)/xr_prev;
	} while (Math.abs(ea) > tolerance && count < 50);
	
	if (count >= 50) return;
	return xr;
};

const checkParallel = (data, item, plane, getAxes, tolerance, getCorners) => {	
	const etype1 = data.subclass;
	const etype2 = item.subclass;
	let [ax1, ax2] = getAxes(plane);
	
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}	
	
	if ((etype1 == "AcDbLine") && (etype2 == "AcDbLine")) {
		const x11 = data[`start_${ax1}`];
		const y11 = data[`start_${ax2}`];
		const x12 = data[`end_${ax1}`];
		const y12 = data[`end_${ax2}`];
		const x21 = item[`start_${ax1}`];
		const y21 = item[`start_${ax2}`];
		const x22 = item[`end_${ax1}`];
		const y22 = item[`end_${ax2}`];	
		const len1 = Math.sqrt((x11 - x12)*(x11 - x12) + (y11 - y12)*(y11 - y12));
		const len2 = Math.sqrt((x21 - x22)*(x21 - x22) + (y21 - y22)*(y21 - y22));
		const dotproduct = ((x11 - x12)*(x21 - x22) + (y11 - y12)*(y21 - y22))/(len1*len2);
		
		return Math.abs(dotproduct - 1) < tolerance || Math.abs(dotproduct + 1) < tolerance;		
	} else if (etype1 == "AcDbPolyline" && etype2 == "AcDbPolyline") {
		const intersection = Intersection(data, item, plane, getAxes, tolerance);		
		if (intersection && intersection.length > 0) return false;
		
		const vertices1 = JSON.parse(JSON.stringify(data.vertices));
		const vertices2 = JSON.parse(JSON.stringify(item.vertices));
		if (data.type == "Closed") {
			vertices1.push(vertices1[0]);
		}
		if (item.type == "Closed") {
			vertices2.push(vertices2[0]);
		}
		const start_x = vertices1[0][ax1];
		const start_y = vertices1[0][ax2];
		
		let corners1 = getCorners(data, plane), corners2 = getCorners(item, plane);
		if (corners1.length > corners2.length) {
			let temp = corners1;
			corners1 = corners2;
			corners2 = temp;
		}
		
		// pick corresponding sides
		const x0 = corners1[0][ax1];
		const y0 = corners1[0][ax2];
		const x1 = corners1[1][ax1];
		const y1 = corners1[1][ax2];
		const line1 = {subclass: "AcDbLine", start_x: x0, start_y: y0, end_x: x1, end_y: y1};
		const len1 = Math.sqrt((x1 - x0)*(x1 - x0) + (y1 - y0)*(y1 - y0));
		let hasParallel = false;
		for (let i = 1; i < corners2.length; i++) {
			const x20 = corners2[i - 1][ax1];
			const y20 = corners2[i - 1][ax2];
			const x21 = corners2[i][ax1];
			const y21 = corners2[i][ax2];
			const line2 = {subclass: "AcDbLine", start_x: (x20 + x21)/2, start_y: (y20 + y21)/2, end_x: (x0 + x1)/2, end_y: (y0 + y1)/2};
			const len2 = Math.sqrt((x21 - x20)*(x21 - x20) + (y21 - y20)*(y21 - y20));
			const dotproduct = ((x1 - x0)*(x21 - x20) + (y1 - y0)*(y21 - y20))/(len1*len2);
			let intersected = false;
			
			if (Math.abs(dotproduct - 1) < tolerance || Math.abs(dotproduct + 1) < tolerance) {
				for (let j = 1; j < corners2.length; j++) {
					if (j == i) continue;
					const x30 = corners2[j - 1][ax1];
					const y30 = corners2[j - 1][ax2];
					const x31 = corners2[j][ax1];
					const y31 = corners2[j][ax2];
					const line3 = {subclass: "AcDbLine", start_x: x30, start_y: y30, end_x: x31, end_y: y31};
					const intersection = Intersection(line2, line3, plane, getAxes, tolerance);
					if (intersection && intersection.length > 0) {						
						intersected = true;
						break;
					}
				}
			}
			if (!intersected && Math.abs(dotproduct - 1) < tolerance) {	
				corners2 = [...corners2.slice(i - 1), ...corners2.slice(0, i - 1)];
				hasParallel = true;
				break;
			} else if (!intersected && Math.abs(dotproduct + 1) < tolerance) {
				corners2 = [...corners2.slice(0, i + 1).reverse(), ...corners2.slice(i + 1).reverse()];
				hasParallel = true;
				break;
			}
		}
		
		if (!hasParallel) {
			return false;
		}
		if (data.type == "Closed" || ((data.vertices[0][ax1] - data.vertices[data.vertices.length - 1][ax1]) < tolerance 
			&& (data.vertices[0][ax2] - data.vertices[data.vertices.length - 1][ax2]) < tolerance)) {
				corners1.push(corners1[0]);
		}
		if (item.type == "Closed" || ((item.vertices[0][ax1] - item.vertices[item.vertices.length - 1][ax1]) < tolerance 
			&& (item.vertices[0][ax2] - item.vertices[item.vertices.length - 1][ax2]) < tolerance)) {
				corners2.push(corners2[0]);
		}
		
		// dot products for each corresponding unit vector should be either consistently 1 or -1
		// perpendicular distances between corresponding sides are consistent
		let isParallel = false, dprev;
		for (let i = 1; i < corners1.length; i++) {
			const x0 = corners1[i - 1][ax1];
			const y0 = corners1[i - 1][ax2];
			const x1 = corners1[i][ax1];
			const y1 = corners1[i][ax2];
			const len1 = Math.sqrt((x1 - x0)*(x1 - x0) + (y1 - y0)*(y1 - y0));
			const x20 = corners2[i - 1][ax1];
			const y20 = corners2[i - 1][ax2];
			const x21 = corners2[i][ax1];
			const y21 = corners2[i][ax2];
			const len2 = Math.sqrt((x21 - x20)*(x21 - x20) + (y21 - y20)*(y21 - y20));
			const dotproduct = ((x1 - x0)*(x21 - x20) + (y1 - y0)*(y21 - y20))/(len1*len2);
			
			if (Math.abs(dotproduct - 1) > tolerance) return false;
			const line = {subclass: "AcDbLine", start_x: x20, start_y: y20, end_x: x21, end_y: y21};
			const d1 = Distance([x0, y0], line, plane, getAxes, tolerance);
			const d2 = Distance([x1, y1], line, plane, getAxes, tolerance);
			if (Math.abs(d1 - d2) > tolerance) return false;
			if (dprev === undefined) {
				dprev = d1;
			} else {
				if (Math.abs(dprev - d1) > tolerance) return false;
			}
		}		
		
		return true;		
	} else {
		return false;
	}
};

const checkOrthogonal = (data, item, plane, getAxes, tolerance) => {
	const etype1 = data.subclass;
	const etype2 = item.subclass;
	let [ax1, ax2] = getAxes(plane);
	
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}		
	
	if ((etype1 == "AcDbLine") && (etype2 == "AcDbLine")) {
		const x11 = data[`start_${ax1}`];
		const y11 = data[`start_${ax2}`];
		const x12 = data[`end_${ax1}`];
		const y12 = data[`end_${ax2}`];
		const x21 = item[`start_${ax1}`];
		const y21 = item[`start_${ax2}`];
		const x22 = item[`end_${ax1}`];
		const y22 = item[`end_${ax2}`];	
		const m1 = (y12 - y11)/(x12 - x11);
		const m2 = (y22 - y21)/(x22 - x21);
		if (Math.abs(m1) != Infinity && Math.abs(m2) == Infinity) {
			return Math.abs(m1) < tolerance && (y11 - y21)*(y11 - y22) < tolerance && (x21 - x11)*(x21 - x12) < tolerance;
		} else if (Math.abs(m2) != Infinity && Math.abs(m1) == Infinity) {
			return Math.abs(m2) < tolerance && (y21 - y11)*(y21 - y12) < tolerance && (x11 - x21)*(x11 - x22) < tolerance;
		} else if (Math.abs(m2) != Infinity && Math.abs(m1) != Infinity) {
			const intersection = Intersection(data, item, plane, getAxes, tolerance);
			if (!intersection || intersection.length != 1) {
				return false;
			}			
			return Math.abs(m2*m1 + 1) < tolerance;
		} else {
			return false;
		} 
	} else if (etype1 == "AcDbCircle" && etype2 == "AcDbCircle") {
		const intersection = Intersection(data, item, plane, getAxes, tolerance);
		if (!intersection || intersection.length == 0) return false;
		const xc1 = data[ax1];
		const yc1 = data[ax2];
		const xc2 = item[ax1];
		const yc2 = item[ax2];
		for (let i = 0; i < intersection.length; i++) {
			const x = intersection[i][ax1];
			const y = intersection[i][ax2];
			const m1 = (y - yc1)/(x - xc1);
			const m2 = (y - yc2)/(x - xc2);
			if (Math.abs(m1) != Infinity && Math.abs(m2) == Infinity) {
				if (Math.abs(m1) < tolerance) return true;
			} else if (Math.abs(m2) != Infinity && Math.abs(m1) == Infinity) {
				if (Math.abs(m2) < tolerance) return true;
			} else if (Math.abs(m2) != Infinity && Math.abs(m1) != Infinity) {
				if (Math.abs(m2*m1 + 1) < tolerance) return true;
			} 
		}
		return false;
	} else {
		return false;
	}
	
	// ellipse vs ellipse - product of tangent slopes = -1
};

const checkAligned = (data, item, plane, getAxes, tolerance) => {
	const etype1 = data.subclass;
	const etype2 = item.subclass;
	let [ax1, ax2] = getAxes(plane);
	
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}		
	if ((etype1 == "AcDbLine") && (etype2 == "AcDbLine")) {
		const x11 = data[`start_${ax1}`];
		const y11 = data[`start_${ax2}`];
		const x12 = data[`end_${ax1}`];
		const y12 = data[`end_${ax2}`];
		const x21 = item[`start_${ax1}`];
		const y21 = item[`start_${ax2}`];
		const x22 = item[`end_${ax1}`];
		const y22 = item[`end_${ax2}`];	
		const m1 = (y12 - y11)/(x12 - x11);
		const m2 = (y22 - y21)/(x22 - x21);
		if (Math.abs(m1) == Infinity && Math.abs(m2) == Infinity) {
			return Math.abs(x11 - x21) < tolerance;
		} else if (Math.abs(m1) != Infinity && Math.abs(m2) == Infinity) {
			return Math.abs(m1) > 10000 && Math.abs(x11 - x21) < tolerance;
		} else if (Math.abs(m2) != Infinity && Math.abs(m1) == Infinity) {
			return Math.abs(m2) > 10000 && Math.abs(x11 - x21) < tolerance;
		} else {
			const b1 = y11 - m1*x11;
			const b2 = y21 - m2*x21;			
			return Math.abs(m1 - m2) < tolerance && Math.abs(b1 - b2) < tolerance;
		} 
	} else if (etype1 == "AcDbCircle" && etype2 == "AcDbCircle") {
		let xc1 = item[ax1];
		let yc1 = item[ax2];
		let xc2 = data[ax1];
		let yc2 = data[ax2];
		const r1 = item.radius;
		const r2 = data.radius;
		return Math.abs(xc1 - xc2) < tolerance && Math.abs(yc1 - yc2) < tolerance && Math.abs(r1 - r2) < tolerance;
	} else if (etype1 == "AcDbEllipse" &&	etype2 == "AcDbEllipse") {			
		const xc1 = item[ax1];
		const yc1 = item[ax2];
		const dx1 = item[`major_end_d${ax1}`];
		const dy1 = item[`major_end_d${ax2}`];		
		const ratio1 = item.minorToMajor;
		const theta1 = Math.atan2(dy1, dx1);
		const xc2 = data[ax1];
		const yc2 = data[ax2];
		const dx2 = data[`major_end_d${ax1}`];
		const dy2 = data[`major_end_d${ax2}`];
		const ratio2 = data.minorToMajor;
		const theta2 = Math.atan2(dy2, dx2);
		
		return Math.abs(xc1 - xc2) < tolerance && Math.abs(yc1 - yc2) < tolerance && 
			   (Math.abs(theta1 - theta2) < tolerance || 
			   (Math.abs(theta1 - theta2) < (Math.PI + tolerance) && Math.abs(theta1 - theta2) > (Math.PI - tolerance)) || 
			   (Math.abs(theta1 - theta2) < (2*Math.PI + tolerance) && Math.abs(theta1 - theta2) > (2*Math.PI - tolerance)))  && 
			   Math.abs(ratio1 - ratio2) < tolerance;
	}
	return false;		
};

const checkConvex = (line1, line2, plane, getAxes, tolerance) => {	
	let [ax1, ax2] = getAxes(plane);
	
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let p1, p2, p3;
	if (line1.subclass == "AcDbLine" && line2.subclass == "AcDbLine") {
		const intersection = Intersection(line1, line2, plane, getAxes, tolerance);
		if (!intersection || intersection.length == 0) return false;
		const x = intersection[0][`${ax1}`];
		const y = intersection[0][`${ax2}`];
		p2 = [x, y];
		
		if (Math.abs(line1[`start_${ax1}`] - x) < tolerance && Math.abs(line1[`start_${ax2}`] - y) < tolerance) {
			p1 = [line1[`end_${ax1}`], line1[`end_${ax2}`]];
		} else if (Math.abs(line1[`end_${ax1}`] - x) < tolerance && Math.abs(line1[`end_${ax2}`] - y) < tolerance) {
			p1 = [line1[`start_${ax1}`], line1[`start_${ax2}`]];
		} else {
			return false;
		}
		if (Math.abs(line2[`start_${ax1}`] - x) < tolerance && Math.abs(line2[`start_${ax2}`] - y) < tolerance) {
			p3 = [line2[`end_${ax1}`], line2[`end_${ax2}`]];
		} else if (Math.abs(line2[`end_${ax1}`] - x) < tolerance && Math.abs(line2[`end_${ax2}`] - y) < tolerance) {
			p3 = [line2[`start_${ax1}`], line2[`start_${ax2}`]];
		} else {
			return false;
		}
	} else {
		p1 = line1[0];
		p2 = line1[1];
		p3 = line2[1];
	}
	
	const x1 = p1[0], y1 = p1[1];
	const x2 = p2[0], y2 = p2[1];
	const x3 = p3[0], y3 = p3[1];
	
	return (x2 - x1)*(y3 - y2) - (y2 - y1)*(x3 - x2) > tolerance;
};

const checkDelaunay = (triangle, point, plane, getAxes, tolerance) => {	
	let [ax1, ax2] = getAxes(plane);
	
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	const x = point[ax1] || point[0];
	const y = point[ax2] || point[1];
	const p1 = Array.isArray(triangle) ? triangle[0] : [triangle.vertices[0][ax1], triangle.vertices[0][ax2]];
	const p2 = Array.isArray(triangle) ? triangle[1] : [triangle.vertices[1][ax1], triangle.vertices[1][ax2]]; 
	const p3 = Array.isArray(triangle) ? triangle[2] : [triangle.vertices[2][ax1], triangle.vertices[2][ax2]]; 
	const x1 = p1[0], y1 = p1[1];
	let x2 = p2[0], y2 = p2[1];
	let x3 = p3[0], y3 = p3[1];
	
	const crossproduct = (x2 - x1)*(y3 - y2) - (y2 - y1)*(x3 - x2);
	if (crossproduct < 0) {
		const temp1 = x2, temp2 = y2;
		x2 = x3;
		y2 = y3;
		x3 = temp1;
		y3 = temp2;
	}
	const X1 = x1 - x, Y1 = y1 - y, X2 = x2 - x, Y2 = y2 - y, X3 = x3 - x, Y3 = y3 - y;
	const det1 = (X1*X1 + Y1*Y1)*(X2*Y3 - X3*Y2);
	const det2 = (X2*X2 + Y2*Y2)*(X1*Y3 - X3*Y1);
	const det3 = (X3*X3 + Y3*Y3)*(X1*Y2 - X2*Y1);
	const det = det1 - det2 + det3;
	
	return det <= tolerance;
};

module.exports = {
	checkInside: checkInside,
	checkOutside: checkOutside,
	checkOnside: checkOnside,
	checkParallel: checkParallel,
	checkOrthogonal: checkOrthogonal,
	checkAligned: checkAligned,	
	checkConvex: checkConvex,
	checkDelaunay: checkDelaunay
};
	

