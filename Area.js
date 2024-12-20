const Triangulate = require("./Triangulate");
const BSpline = require("./BSpline");
const ErrorMessages = require("./ErrorMessages.json");

module.exports = (entity, plane, getAxes, tolerance) => {
	if (typeof entity != "object") {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	const etype = entity.subclass;
	if (etype == "AcDbPolyline") {
		let sum = 0;
		let triangles = Triangulate(entity.vertices, plane, getAxes, tolerance);
		for (let i = 0; i < triangles.length; i++) {
			let triangle = triangles[i];
			const L1 = Math.sqrt((triangle[0][ax1] - triangle[1][ax1])*(triangle[0][ax1] - triangle[1][ax1]) + (triangle[0][ax2] - triangle[1][ax2])*(triangle[0][ax2] - triangle[1][ax2]));
			const L2 = Math.sqrt((triangle[0][ax1] - triangle[2][ax1])*(triangle[0][ax1] - triangle[2][ax1]) + (triangle[0][ax2] - triangle[2][ax2])*(triangle[0][ax2] - triangle[2][ax2]));
			const L3 = Math.sqrt((triangle[2][ax1] - triangle[1][ax1])*(triangle[2][ax1] - triangle[1][ax1]) + (triangle[2][ax2] - triangle[1][ax2])*(triangle[2][ax2] - triangle[1][ax2]));
			const S = (L1 + L2 + L3)/2;
			const area = Math.sqrt(S*(S - L1)*(S-L2)*(S - L3));			
			sum = sum + area;
		}
		return {area: sum};
	} else if (etype == "AcDbCircle" && entity.etype == "CIRCLE") {
		const r = entity.radius;
		return {area: Math.PI*r*r};
	} else if (etype == "AcDbCircle" && entity.etype == "ARC") {
		const r = entity.radius;
		const start_angle = entity.start_angle;
		const end_angle = entity.end_angle;
		let d;
		if (start_angle < end_angle) {
			d = Math.abs(start_angle - end_angle);
		} else {
			d = 360 - Math.abs(start_angle - end_angle);
		}
		const A = Math.PI*r*r*d/360;
		return {area: A - r*r*Math.cos(d*Math.PI/360)*Math.sin(d*Math.PI/360), area_sector: A};
	} else if (etype == "AcDbEllipse") {
		const start_angle = entity.start_angle2*Math.PI/180;
		const end_angle = entity.end_angle2*Math.PI/180;
		const dx = entity[`major_end_d${ax1}`];
		const dy = entity[`major_end_d${ax2}`];
		const ratio = entity.minorToMajor;
		const a = Math.sqrt(dx*dx + dy*dy);
		const b = ratio*a;
		
		const a1 = Math.tan(end_angle) > 100000 ? Math.PI/2 : (Math.tan(end_angle) < -100000 ? 3*Math.PI/2 : Math.atan(a*Math.tan(end_angle)/b));
		const a2 = Math.tan(start_angle) > 100000 ? Math.PI/2 : (Math.tan(start_angle) < -100000 ? 3*Math.PI/2 : Math.atan(a*Math.tan(start_angle)/b));	
		const A = 0.5*a*b*Math.abs(a1 - a2);
		const A2 = 0.5*a*b*(Math.abs(a1 - a2) - Math.sin(Math.abs(a1 - a2)));
		let json = {area: Math.PI*a*b - A2};
		if (A > 0.000001) {
			json.area_sector = A;
		}
		if (A2 > 0.000001) {
			json.area_full = Math.PI*a*b;
		}
		return json;
	} else if (etype == "AcDbSpline") {	
		const result = BSpline(entity);
		return {area: result.area }  //Approximate
	}
	return {};		
};
	

