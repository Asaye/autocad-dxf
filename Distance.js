const ErrorMessages = require("./ErrorMessages.json");

module.exports = (entity, entity2, plane, getAxes, tolerance) => {
	if (typeof entity != "object" || typeof entity2 != "object") {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}

	let etype = entity.subclass;
	let etype2 = entity2.subclass;
	if (Array.isArray(entity) && Array.isArray(entity2)) {
		return Math.sqrt((entity[0] - entity2[0])*(entity[0] - entity2[0]) + (entity[1] - entity2[1])*(entity[1] - entity2[1]));
	} else if ((etype == "AcDbPoint" || etype == "AcDbCircle" || etype == "AcDbEllipse" || etype == "AcDbText" || etype == "AcDbMText" || etype == "AcDbVertex")  && 
		(etype2 == "AcDbPoint" || etype2 == "AcDbCircle" || etype2 == "AcDbEllipse" || etype2 == "AcDbText" || etype2 == "AcDbMText" || etype2 == "AcDbVertex")) {
			const x1 = entity[ax1];
			const y1 = entity[ax2];
			const x2 = entity2[ax1];
			const y2 = entity2[ax2];
		return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
	} else if ((etype == "AcDbPoint" || etype == "AcDbCircle" || etype == "AcDbEllipse" || etype == "AcDbText" || etype == "AcDbMText" || etype == "AcDbVertex")  && 
		Array.isArray(entity2)) {
			const x1 = entity[ax1];
			const y1 = entity[ax2];
			const x2 = entity2[0];
			const y2 = entity2[1];
			return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
	} else if ((etype2 == "AcDbPoint" || etype2 == "AcDbCircle" || etype2 == "AcDbEllipse" || etype2 == "AcDbText" || etype2 == "AcDbMText" || etype2 == "AcDbVertex")  && 
		Array.isArray(entity)) {
			const x1 = entity2[ax1];
			const y1 = entity2[ax2];
			const x2 = entity[0];
			const y2 = entity[1];
			return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
	}  else if (Array.isArray(entity) && typeof entity2 == "object") {
		etype = "point";
		entity = {x: entity[0], y: entity[1]};
	} else if (Array.isArray(entity2) && typeof entity == "object") {
		etype = "point";
		const temp = entity;
		entity = {x: entity2[0], y: entity2[1]};
		entity2 = temp;
	}
	
	if (etype == "AcDbLine" || etype2 == "AcDbLine" || 
	(etype == "AcDbDimension" && (entity.specific_type == 'AcDbRotatedDimension' || entity.specific_type == 'AcDbAlignedDimension')) ||
	(etype2 == "AcDbDimension" && (entity2.specific_type == 'AcDbRotatedDimension' || entity2.specific_type == 'AcDbAlignedDimension'))) {
		if (etype == "AcDbLine" || etype == "AcDbDimension") {
			const temp = entity;
			entity = entity2;
			entity2 = temp;
			etype = etype2.toLowerCase().replace("acdb", "");
		} else {
			etype = etype.toLowerCase().replace("acdb", "");
		}
		
		let x1, y1, x2, y2;
		if (entity2.subclass == "AcDbLine") {
			x1 = entity2[`start_${ax1}`];
			y1 = entity2[`start_${ax2}`];
			x2 = entity2[`end_${ax1}`];
			y2 = entity2[`end_${ax2}`];
		} else {
			x1 = entity2[`${ax1}`];
			y1 = entity2[`${ax2}`];
			x2 = entity2[`${ax1}_end`];
			y2 = entity2[`${ax2}_end`];
		}
		
		const slope = (y2 - y1)/(x2 - x1);
		
		if (etype == "point" || etype == "circle" || etype == "ellipse" || etype == "text" || etype == "mtext" || etype == "vertex") {			
			if (slope == Infinity || slope == -Infinity) {					
				return Math.abs(entity[ax1] - x1);
			} else {
				const A = -slope;
				const B = 1;
				const C = slope*x1 - y1;
				const D = Math.sqrt(A*A + 1);
				return Math.abs(A*entity[ax1] + B*entity[ax2] + C)/D;
			}				
		} else if (etype == "line" || etype == "dimension") { 
			let x21, y21, x22, y22;
			if (entity.subclass == "AcDbLine") {
				x21 = entity[`start_${ax1}`];
				y21 = entity[`start_${ax2}`];
				x22 = entity[`end_${ax1}`];
				y22 = entity[`end_${ax2}`];
			} else {
				x21 = entity[`${ax1}`];
				y21 = entity[`${ax2}`];
				x22 = entity[`${ax1}_end`];
				y22 = entity[`${ax2}_end`];
			}
			
			const slope2 = -(y22 - y21)/(x22 - x21);
			
			if (Math.abs(slope) == Infinity && Math.abs(slope2) >= 1/tolerance || 
				Math.abs(slope2) == Infinity && Math.abs(slope) >= 1/tolerance ||
				Math.abs(Math.abs(slope2) - Math.abs(slope)) <= tolerance) {
					if (Math.abs(slope) == Infinity || Math.abs(slope2) == Infinity) {
						return Math.abs(x21 - x1);
					} else {
						const A = -slope;
						const B = 1;
						const C = slope*x1 - y1;
						const D = Math.sqrt(A*A + B*B);
						return Math.abs(A*x21 + B*y21 + C)/D;
					}
			} else {
				return undefined;
			}
		}				
	} else if (etype == "AcDbPolyline" || etype2 == "AcDbPolyline") {
		if (etype == "AcDbPolyline") {
			const temp = entity;
			entity = entity2;
			entity2 = temp;
			etype = etype2.toLowerCase().replace("acdb", "");
		} else {
			etype = etype.toLowerCase().replace("acdb", "");
		}
		
		if (etype == "point" || etype == "circle" || etype == "ellipse" || etype == "text" || etype == "mtext" || etype == "vertex") {
			const vertices = JSON.parse(JSON.stringify(entity2.vertices));
			let x0 = vertices[0][ax1], y0 = vertices[0][ax2], x1, y1;
			let dmin = Infinity;
			if (entity.type == "Closed") vertices.push(vertices[0]);
			const xref = entity[ax1], yref = entity[ax2];
			for (let i = 1; i < vertices.length; i++) {
				x1 = vertices[i][ax1];
				y1 = vertices[i][ax2];
				const slope = (y1 - y0)/(x1 - x0);
				if (slope == Infinity || slope == -Infinity) {					
					dmin = Math.min(dmin, Math.abs(entity2[ax1] - x1));
				} else {
					const A = -slope;
					const B = 1;
					const C = slope*x1 - y1;
					const D = Math.sqrt(A*A + 1);
					dmin = Math.min(dmin, Math.abs(A*xref + B*yref + C)/D);
				}
				x0 = x1;
				y0 = y1;
			}
			return dmin;				
		} 				
	}
};
		

