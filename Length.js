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
	if (etype == "AcDbLine") {
		const x1 = entity[`start_${ax1}`];
		const y1 = entity[`start_${ax2}`];
		const x2 = entity[`end_${ax1}`];
		const y2 = entity[`end_${ax2}`];
		return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
	} else if (etype == "AcDbPolyline") {
		const vertices = JSON.parse(JSON.stringify(entity.vertices));
		if (entity.type == "Closed") vertices.push(vertices[0]);
		let length = 0;
		for (let i = 1; i < vertices.length; i++) {
			const x1 = vertices[i - 1][`${ax1}`];
			const y1 = vertices[i - 1][`${ax2}`];
			const x2 = vertices[i][`${ax1}`];
			const y2 = vertices[i][`${ax2}`];
			length = length + Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
		}			
		return length;
	} else if (etype == "AcDbCircle") {
		const start_angle = entity.start_angle;
		const end_angle = entity.end_angle;
		if (start_angle && end_angle) {
			let d;
			if (start_angle < end_angle) {
				d = Math.abs(start_angle - end_angle);
			} else {
				d = 360 - Math.abs(start_angle - end_angle);
			}				
			return 2*Math.PI*(entity.radius)*d/360;
		} else {
			return 2*Math.PI*entity.radius;
		}
	} else if (etype == "AcDbEllipse") {			
		if (Math.abs(Math.abs(entity.start_parameter - entity.end_parameter) - 2*Math.PI) > tolerance) { // not full ellipse
			return;							
		}
		const dx = entity[`major_end_d${ax1}`];
		const dy = entity[`major_end_d${ax2}`];
		const ratio = entity.minorToMajor;
		const a = Math.sqrt(dx*dx + dy*dy);
		const b = ratio*a;
		const h = (a - b)*(a - b)/((a + b)*(a + b));
		
		return Math.PI*(a + b)*(1 + 3*h/(10 + Math.sqrt(4 - 3*h)));  //Approximate
	}
	return;		
};
	

