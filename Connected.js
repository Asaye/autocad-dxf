const ErrorMessages = require("./ErrorMessages.json");

const getConnected = (list, backward_start, forward_start, ax1, ax2, tolerance) => {
	let haveMerged = false;
	let backward =[];
	let forward =[];
	let counter = 0;
	let len_f_1 = 0, len_f_2 = 1, len_b_1 = 0, len_b_2 = 1;
	let xbf = backward_start[0], ybf = backward_start[1], xff = forward_start[0], yff = forward_start[1];	
	
	while (!haveMerged && counter < 100 && (len_f_1 != len_f_2 || len_b_1 != len_b_2)) {
		counter++;	
		
		len_f_1 = forward.length;
		len_b_1 = backward.length;
		
		for (let n = 0; n < list.length; n++) {			
			const epn = getEndPoints(list[n], ax1, ax2);
			if (!epn) continue;
			const [start_x, start_y, end_x, end_y] = epn;			
			
			if (!isNaN(xbf) && Math.abs(start_x - xbf) < tolerance && Math.abs(start_y - ybf) < tolerance) { // check if one end of the line is already in backward			
				xbf = end_x;
				ybf = end_y;
				backward.push(list[n]);
				list.splice(n, 1);				
				break;
			} else if (!isNaN(xbf) && Math.abs(end_x - xbf) < tolerance && Math.abs(end_y - ybf) < tolerance) { // check if the other end of the line is already in backward				
				xbf = start_x;
				ybf = start_y;
				backward.push(list[n]);
				list.splice(n, 1);				
				break;
			}
			
			if (!isNaN(xff) && Math.abs(start_x - xff) < tolerance && Math.abs(start_y - yff) < tolerance) {
				xff = end_x;
				yff = end_y;
				forward.push(list[n]);
				list.splice(n, 1);
				break;
			} else if (!isNaN(xff) && Math.abs(end_x - xff) < tolerance && Math.abs(end_y - yff) < tolerance) {
				xff = start_x;
				yff = start_y;
				forward.push(list[n]);
				list.splice(n, 1);
				break;
			}			
		}
		len_f_2 = forward.length;
		len_b_2 = backward.length;
	}
	
	return [backward, forward];				
};

const getEndPoints = (item, ax1, ax2) => {
	let x_left, y_left, x_right, y_right;
	const etype = item.etype;
	if (etype == "LINE") {
		x_left = item[`start_${ax1}`];
		y_left = item[`start_${ax2}`];		
		x_right = item[`end_${ax1}`];
		y_right = item[`end_${ax2}`];		
	} else if (etype == "ARC") {
		x_left = item[ax1] + item.radius*Math.cos(item.start_angle*Math.PI/180);
		y_left = item[ax2] + item.radius*Math.sin(item.start_angle*Math.PI/180);		
		x_right = item[ax1] + item.radius*Math.cos(item.end_angle*Math.PI/180);
		y_right = item[ax2] + item.radius*Math.sin(item.end_angle*Math.PI/180);			
	} else if (etype == "ELLIPSE") {
		let dx = item[`major_end_d${ax1}`];
		let dy = item[`major_end_d${ax2}`];		
		const ratio = item.minorToMajor;
		const a = Math.sqrt(dx*dx + dy*dy);
		const b = ratio*a;
		const theta = Math.atan2(dy, dx);
		
		x_left = item[ax1] + a*Math.cos(theta)*Math.cos(item.start_parameter) - b*Math.sin(theta)*Math.sin(item.start_parameter);
		y_left = item[ax2] + a*Math.sin(theta)*Math.cos(item.start_parameter) + b*Math.cos(theta)*Math.sin(item.start_parameter);	
		x_right = item[ax1] + a*Math.cos(theta)*Math.cos(item.end_parameter) - b*Math.sin(theta)*Math.sin(item.end_parameter);
		y_right = item[ax2] + a*Math.sin(theta)*Math.cos(item.end_parameter) + b*Math.cos(theta)*Math.sin(item.end_parameter);			
	} else if (etype == "LWPOLYLINE") {
		x_left = item.vertices[0][ax1];
		y_left = item.vertices[0][ax2];		
		x_right = item.vertices[item.vertices.length - 1][ax1];
		y_right = item.vertices[item.vertices.length - 1][ax2];
	} else {
		return;
	}
	return [x_left, y_left, x_right, y_right];
};

module.exports = (entity, plane, entities, getAxes, tolerance) => {
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
	
	const filtered = entities.filter((item, index) => {
				if (JSON.stringify(item) == txt) return false;
				return (item.etype == "LINE" || (item.etype == "ELLIPSE" && (Math.abs(item.start_parameter - item.end_parameter) - tolerance) < 2*Math.PI) ||
				item.etype == "ARC" || (item.etype == "LWPOLYLINE" && item.etype != "Closed" && 
					((item.vertices[0][ax1] !== undefined && (Math.abs(item.vertices[0][ax1] - item.vertices[item.vertices.length - 1][ax1]) > tolerance)) || 
					((item.vertices[0][ax2] !== undefined && (Math.abs(item.vertices[0][ax2] - item.vertices[item.vertices.length - 1][ax2]) > tolerance))))));
			});		
			
	let [x_left, y_left, x_right, y_right] = getEndPoints(entity, ax1, ax2);
	const result = getConnected(filtered, [x_left, y_left], [x_right, y_right], ax1, ax2, tolerance);
	if (result.length > 0) {
		return {
			left: result[0],
			right: result[1]
		};
	} else {
		return null;
	}	
};


		

