const Intersection = require("./Intersection");
const ErrorMessages = require("./ErrorMessages.json");

module.exports = (entity, etypes, plane, entities, getAxes, tolerance) => {
	if (typeof entity != "object" || typeof entities != "object") {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	
	const txt = JSON.stringify(entity);	
	let filtered;
	if (etypes && Array.isArray(etypes)) {
		filtered = entities.filter((item, index) => {
			if (JSON.stringify(item) == txt) return false;
			return (etypes && Array.isArray(etypes) && etypes.filter((en) => (("acdb" + en.toLowerCase()) == item.subclass.toLowerCase()) || (item.specific_type && ("acdb" + en.toLowerCase()) == item.specific_type.toLowerCase())).length > 0);
		});
	} else {
		filtered = entities;
	}
		
	
	let crossing = [];	
	const etype = entity.etype;
	
	filtered.forEach((item) => {		
		const points = Intersection(entity, item, plane, getAxes, tolerance);		
		if (points && points.length > 0) {
			if (etype == "LINE") {
				for (let i = 0; i < points.length; i++) {
					if (crossing.indexOf(item) != -1) continue;
					if ((Math.abs(points[i][ax1] - entity[`start_${ax1}`]) > tolerance || Math.abs(points[i][ax2] - entity[`start_${ax2}`]) > tolerance) && 
						(Math.abs(points[i][ax1] - entity[`end_${ax1}`]) > tolerance || Math.abs(points[i][ax2] - entity[`end_${ax2}`]) > tolerance)) {
						crossing.push(item);
						break;
					}
				}
			} else if (etype == "LWPOLYLINE") {	
				for (let i = 0; i < points.length; i++) {
					if (crossing.indexOf(item) != -1) continue;
					const temp = entity.vertices.filter((v) => {
						return (Math.abs(points[i][ax1] - v[ax1]) < tolerance && Math.abs(points[i][ax2] - v[ax2]) < tolerance);
					});
					
					const vertices = JSON.parse(JSON.stringify(entity.vertices));
					if (entity.type == "Closed") {
						vertices.push(vertices[0]);
					}
					for (let j = 1; j < vertices.length; j++) {
						const x0 = vertices[j - 1][ax1];
						const y0 = vertices[j - 1][ax2];
						const x1 = vertices[j][ax1];
						const y1 = vertices[j][ax2];
						if (Math.abs(points[i][ax1] - x0) < tolerance && Math.abs(points[i][ax2] - y0) < tolerance) {
							continue;
						}
						if ((j == (vertices.length - 1)) && Math.abs(points[i][ax1] - x1) < tolerance && Math.abs(points[i][ax2] - y1) < tolerance) {
							continue;
						}
						const slope = (y1 - y0)/(x1 - x0);
						if (Math.abs(slope) == Infinity && Math.abs(x1 - points[i][ax1]) < tolerance) {
							continue;
						} else {
							if (Math.abs((slope*points[i][ax1] - slope*x0 + y0) - points[i][ax2]) < tolerance) {
								continue;
							}
						}
						
						
						if ((Math.abs(points[0][ax1] - x0) > tolerance || Math.abs(points[0][ax2] - y0) > tolerance) && 
							(Math.abs(points[0][ax1] - x1) > tolerance || Math.abs(points[0][ax2] - x1) > tolerance)) {
								
							
							if (item.etype == "LINE") {								
								if ((Math.abs(item[`start_${ax1}`] - points[i][ax1]) > tolerance || 
								    Math.abs(item[`start_${ax2}`] - points[i][ax2]) > tolerance) &&
									(Math.abs(item[`end_${ax1}`] - points[i][ax1]) > tolerance ||
									Math.abs(item[`end_${ax2}`] - points[i][ax2]) > tolerance)) {									
									crossing.push(item);
									break;
								}
							} else if (item.etype == "LWPOLYLINE") {
								const v = JSON.parse(JSON.stringify(item.vertices));
								if (item.type == "Closed") {
									v.push(vertices[0]);
								}
								for (let j = 1; j < v.length; j++) {
									if (crossing.indexOf(item) != -1) break;
									const x02 = v[j - 1][ax1];
									const y02 = v[j - 1][ax2];
									const x12 = v[j][ax1];
									const y12 = v[j][ax2];
									if ((Math.abs(points[0][ax1] - x02) > tolerance || Math.abs(points[0][ax2] - y02) > tolerance) && 
										(Math.abs(points[0][ax1] - x12) > tolerance || Math.abs(points[0][ax2] - x12) > tolerance)) {
										crossing.push(item);
										break;
									}
								}
							} else if (item.etype == "CIRCLE" || item.etype == "ARC") {
								const slope = (y0 - y1)/(x0 - x1);
								if ((Math.abs(slope) == Infinity && Math.abs(item[`{ax1}`] - points[i][ax1]) < item.radius)) {
									crossing.push(item);
									break;
								} else if (Math.abs(slope*item[`${ax1}`] - slope*x0 + y0 - item[`${ax2}`]) < item.radius) {
									crossing.push(item);
									break;
								}
							}
						}
					}
					/* if (temp.length == 0) {
						crossing.push(item);
						break;
					} */
				}
			} else if ((etype == "CIRCLE" || etype == "ARC") && crossing.indexOf(item) == -1) {	
		
				if ((item.etype == "CIRCLE" || item.etype == "ARC") && points.length > 1) {
					crossing.push(item);
				} else if ((item.etype == "ARC") && points.length == 1) {
					const d = Math.sqrt((entity[ax1] - item[ax1])*(entity[ax1] - item[ax1]) + (entity[ax2] - item[ax2])*(entity[ax2] - item[ax2]));					
					if ((entity.radius + item.radius - d) > tolerance) {
						crossing.push(item);
					}
				} else if (item.etype == "LINE" && points.length > 1) {
					crossing.push(item);
				} else if (item.etype == "LINE" && points.length == 1) {						
					if ((Math.abs(points[0][ax1] - item[`start_${ax1}`]) > tolerance || Math.abs(points[0][ax2] - item[`start_${ax2}`]) > tolerance) && 
						(Math.abs(points[0][ax1] - item[`end_${ax1}`]) > tolerance || Math.abs(points[0][ax2] - item[`end_${ax2}`]) > tolerance)) {
						
						const slope = (item[`start_${ax2}`] - item[`end_${ax2}`])/(item[`start_${ax1}`] - item[`end_${ax1}`]);
						if (Math.abs(slope) == Infinity && Math.abs(Math.abs(entity[ax1] - points[0][ax1]) - entity.radius) > tolerance) {
							crossing.push(item);
						} else if (Math.abs((-slope*entity[ax1] + entity[ax2] + slope*item[`start_${ax1}`] - item[`start_${ax2}`])/(Math.sqrt(1 + slope*slope))) < entity.radius) {
							crossing.push(item);
						}
					}					
				} else if (item.etype == "LWPOLYLINE") {
					const vertices = JSON.parse(JSON.stringify(item.vertices));
					if (item.type == "Closed") {
						vertices.push(vertices[0]);
					}
					for (let i = 1; i < vertices.length; i++) {
						const x0 = vertices[i - 1][ax1];
						const y0 = vertices[i - 1][ax2];
						const x1 = vertices[i][ax1];
						const y1 = vertices[i][ax2];
						for (let j = 0; j < points.length; j++) {
							if (crossing.indexOf(item) != -1) break;
							if ((Math.abs(points[j][ax1] - x0) > tolerance || Math.abs(points[j][ax2] - y0) > tolerance) && 
								(Math.abs(points[j][ax1] - x1) > tolerance || Math.abs(points[j][ax2] - x1) > tolerance)) {
								const slope = (y1 - y0)/(x1 - x0);
								if (Math.abs(slope) == Infinity && Math.abs(Math.abs(entity[ax1] - x0) - entity.radius) > tolerance) {
									crossing.push(item);
									break;
								} else if (Math.abs((-slope*entity[ax1] + entity[ax2] + slope*x0 - y0)/(Math.sqrt(1 + slope*slope)) - entity.radius) > tolerance) {
									crossing.push(item);
									break;
								}
							}
						}
					}
				}
			} 
		}
	});
	return crossing;
};


		

