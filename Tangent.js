const Intersection = require("./Intersection");
const ErrorMessages = require("./ErrorMessages.json");

const istangent = (line, circle, plane, getAxes, tolerance) => {
	if (typeof circle != "object" || typeof line != "object") {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	
	const x0 = line[`start_${ax1}`];
	const y0 = line[`start_${ax2}`];
	const x1 = line[`end_${ax1}`];
	const y1 = line[`end_${ax2}`];
	const slope = (y1 - y0)/(x1 - x0);
	if (Math.abs(slope) == Infinity) {
		return Math.abs(Math.abs(circle[ax1] - x0) - circle.radius) < tolerance;
	} else {
		const len = Math.abs(-slope*circle[ax1] + circle[ax2] + slope*x0 - y0)/(Math.sqrt(1 + slope*slope));		
		return Math.abs(len - circle.radius) < tolerance;
	}
	return false;
};

const tangent = (circle, angle, length, plane, getAxes, tolerance) => {
	if (typeof circle != "object") {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	
	if (Array.isArray(angle)) {		
		const x = angle[0];
		const y = angle[1];
		const r = circle.radius;
		const xc = circle[ax1];
		const yc = circle[ax2];		
		const len = (x - xc)*(x - xc) + (y - yc)*(y - yc) - r*r;
		
		if (len < 0) {  // point inside the circle
			return [];
		}
		
		const m = -(xc - x)/(yc - y);
		let b;
		
		if (Math.abs(m) == Infinity) {
			const theta = Math.asin(r/Math.sqrt(len));
			m = Math.tan(Math.PI/2 - theta);
			b = -m*x + y;
		} else {
			b = -(r*r - len + x*x - xc*xc + y*y - yc*yc)/(2*(yc - y));
		}		
		
		const A = m*m + 1;
		const B = 2*(m*(b - yc) - xc);
		const C = xc*xc + (b - yc)*(b - yc) - r*r;
		const det = B*B - 4*A*C;
		let xint1, yint1, xint2, yint2;
		
		if (det == 0) {
			xint1 = (-B)/(2*A);
			yint1 = m*sol1 + b;			
		} else if (det > 0) {
			xint1 = (-B + Math.sqrt(det))/(2*A);
			xint2 = (-B - Math.sqrt(det))/(2*A);
			yint1 = m*xint1 + b;
			yint2 = m*xint2 + b;		
		}
		let points = [];
		if (!isNaN(xint1) && !isNaN(yint1)) {
			let json = {};
			json[ax1] = xint1;
			json[ax2] = yint1;
			json.angle = Math.atan2((yint1 - circle[ax2]), (xint1 - circle[ax1]));
			points.push(json);
		}
		
		if (!isNaN(xint2) && !isNaN(yint2)) {
			let json = {};
			json[ax1] = xint2;
			json[ax2] = yint2;
			json.angle = Math.atan2((yint2 - circle[ax2]), (xint2 - circle[ax1]));
			points.push(json);
		}
		return points;
	} else {
		return tangent2(circle, angle, length, plane, getAxes, tolerance);
	}
	return;
};

const tangent2 = (circle, angle, length, plane, getAxes, tolerance) => {
	if (typeof circle != "object") {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	
	const r = circle.radius;
	const x = circle[ax1] + r*Math.cos(angle);
	const y = circle[ax2] + r*Math.sin(angle);
	const xc = circle[ax1];
	const yc = circle[ax2];
	
	const slope = (y - yc)/(x - xc);
	const m = -1/slope;
	let json1 = {}, json2 = {};
	json1[`start_${ax1}`] = x;
	json1[`start_${ax2}`] = y;
	json2[`start_${ax1}`] = x;
	json2[`start_${ax2}`] = y;
	
	if (Math.abs(m) == Infinity) {
		json1[`end_${ax1}`] = x;
		json1[`end_${ax2}`] = y + length;
		json2[`end_${ax1}`] = x;
		json2[`end_${ax2}`] = y - length;
	} else {
		const b = y - m*x;
		const A = m*m + 1;
		const B = 2*(m*(b - y) - x);
		const C = x*x + (b - y)*(b - y) - length*length;
		const det = B*B - 4*A*C;
		const sol1 = (-B + Math.sqrt(det))/(2*A);
		const sol2 = (-B - Math.sqrt(det))/(2*A);
		const ysol1 = m*sol1 + b;
		const ysol2 = m*sol2 + b;
		
		json1[`end_${ax1}`] = sol1;
		json1[`end_${ax2}`] = ysol1;
		json2[`end_${ax1}`] = sol2;
		json2[`end_${ax2}`] = ysol2;
	}
	
	return [json1, json2];
};

module.exports = {
	istangent: istangent,
	tangent: tangent
};


		

