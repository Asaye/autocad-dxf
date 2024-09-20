const ErrorMessages = require("./ErrorMessages.json");

const checkBending = (vertices, ax1, ax2, tolerance) => {	
	let isBent = false;

	let x0 = vertices[vertices.length - 1][ax1], y0 = vertices[vertices.length - 1][ax2], x1 = vertices[0][ax1], y1 = vertices[0][ax2], x2, y2;
	for (let i = 1; i <= vertices.length; i++) {
		let j = i < vertices.length ? i : 0;				
		x2 = vertices[j][ax1];
		y2 = vertices[j][ax2];	
		const m1 = Math.abs((y1 - y0)/(x1 - x0));	
		const m2 = Math.abs((y2 - y1)/(x2 - x1));				
		const txt = x1 + "," + y1;
		if (Math.abs(m1 - m2) > tolerance) {
			isBent = true;
			break;
		}					
		x0 = x1;
		y0 = y1;
		x1 = x2;
		y1 = y2;
	}
	return isBent;
};

const threeCorners = (vertices) => {
	let corners = []
	for (let i = 0; i < vertices.length; i++) {
		for (let j = i + 1; j < vertices.length; j++) {
			for (let k = j + 1; k < vertices.length; k++) {
				corners.push([i, j, k]);
			}
		}
	}
	return corners;
};

const vLineIntersection = (x11, y11, x12, y12, x21, y21, x22, y22, ax1, ax2, tolerance) => {
	const m1 = (y12 - y11)/(x12 - x11);
	const m2 = (y22 - y21)/(x22 - x21);
	
	if (Math.abs(m1) == Infinity && Math.abs(m2) != Infinity) {
		const y = m2*(x11 - x22) + y22;
		if ((y - y11)*(y - y12) < tolerance) {
			let json = {};
			json[`${ax1}`] = x11;
			json[`${ax2}`] = y;
			return [json];
		}
		return [];
	} else if (Math.abs(m1) != Infinity && Math.abs(m2) == Infinity) {
		const y = m1*(x22 - x12) + y12;
		if ((y - y21)*(y - y22) < tolerance) {
			let json = {};
			json[`${ax1}`] = x22;
			json[`${ax2}`] = y;
			return [json];
		}
		return [];
	} 
	return [];
};

const intersection = (line1, line2, ax1, ax2, tolerance) => {
	let x0 = line1[0];
	let y0 = line1[1];
	let x1 = line1[2];
	let y1 = line1[3];
	
	let x11 = line2[0];
	let y11 = line2[1];
	let x12 = line2[2];
	let y12 = line2[3];
	const m0 = (y1 - y0)/(x1 - x0);
	const m1 = (y12 - y11)/(x12 - x11);
	let intersected = [];
	if (Math.abs(m0) == Infinity || Math.abs(m1) == Infinity) {
		let points = vLineIntersection(x0, y0, x1, y1, x11, y11, x12, y12, ax1, ax2, tolerance);
		
		if (points.length == 1) {
			const x = points[0][ax1];
			const y = points[0][ax2];
			const isEndPoint = ((Math.abs(x - line1[0]) < tolerance && Math.abs(y - line1[1]) < tolerance) || 
								(Math.abs(x - line1[2]) < tolerance && Math.abs(y - line1[3]) < tolerance));
			
			const isCrossing = (x - x1)*(x - x0) < tolerance && (x - x11)*(x - x12) < tolerance && 
							   (y - y1)*(y - y0) < tolerance && (y - y11)*(y - y12) < tolerance;
			
			if (isCrossing && !isEndPoint) {
				intersected = points;
			}
		}
	} else {	
		const x = ((-m1*x11 + y11) - (-m0*x1 + y1))/(m0 - m1);
		const y = m0*x + (-m0*x1 + y1);		
		const isCrossing = (x - x1)*(x - x0) < tolerance && (x - x11)*(x - x12) < tolerance && 
		(y - y1)*(y - y0) < tolerance && (y - y11)*(y - y12) < tolerance;
		const isEndPoint = ((Math.abs(x - line1[0]) < tolerance && Math.abs(y - line1[1]) < tolerance) || 
							(Math.abs(x - line1[2]) < tolerance && Math.abs(y - line1[3]) < tolerance));
							
		if (isCrossing && !isEndPoint) {
			let json = {};
			json[ax1] = x;
			json[ax2] = y;
			intersected = [json];
		} 
	}
	
	return intersected;
};


const getVisibleCorners = (vertices, corners, ax1, ax2, tolerance) => {
	let x0 = vertices[0][ax1], y0 = vertices[0][ax2], x1, y1;
	let temp = [];
	for (let i = 1; i <= vertices.length; i++) {
		if (i < vertices.length) {
			x1 = vertices[i][ax1];
			y1 = vertices[i][ax2];
		} else {
			x1 = vertices[0][ax1];
			y1 = vertices[0][ax2];
			if (x0 == x1 && y0 == y1 || typeof corners[0][0] != "number") {
				break;
			}
		}
		
		const line0 = [x0, y0, x1, y1];
		
		for (let j = 0; j < corners.length; j++) {
			let line1, line2, line3;
			if (corners[j].length == 3 && typeof corners[j][0] == "number") {
				line1 = [vertices[corners[j][0]][ax1], vertices[corners[j][0]][ax2], vertices[corners[j][1]][ax1], vertices[corners[j][1]][ax2]];
				line2 = [vertices[corners[j][0]][ax1], vertices[corners[j][0]][ax2], vertices[corners[j][2]][ax1], vertices[corners[j][2]][ax2]];
				line3 = [vertices[corners[j][2]][ax1], vertices[corners[j][2]][ax2], vertices[corners[j][1]][ax1], vertices[corners[j][1]][ax2]];
			} else {
				line1 = corners[0][0];
				line2 = corners[0][1];
				line3 = corners[0][2];
			}
			
			const d1 = Math.sqrt((line1[0] - line1[2])*(line1[0] - line1[2]) + (line1[1] - line1[3])*(line1[1] - line1[3]));
			const d2 = Math.sqrt((line2[0] - line2[2])*(line2[0] - line2[2]) + (line2[1] - line2[3])*(line2[1] - line2[3]));
			const d3 = Math.sqrt((line3[0] - line3[2])*(line3[0] - line3[2]) + (line3[1] - line3[3])*(line3[1] - line3[3]));
			
			if (((d1 + d2) <= d3) || ((d1 + d3) <= d2) || ((d2 + d3) <= d1)) {
				if (temp.indexOf(j) == -1) {
					temp.push(j);
				}				
			} else if ((line1[0] == line1[2] && line1[1] == line1[3]) || 
					   (line2[0] == line2[2] && line2[1] == line2[3]) || 
					   (line3[0] == line3[2] && line3[1] == line3[3])) {
				if (temp.indexOf(j) == -1) {
					temp.push(j);
				}				
			} else {
				let intersected = intersection(line0, line1, ax1, ax2, tolerance);
				if (intersected.length == 0) {				
					intersected = intersection(line0, line2, ax1, ax2, tolerance);
				}
				if (intersected.length == 0) {				
					intersected = intersection(line0, line3, ax1, ax2, tolerance);
				}
				
				if (intersected.length > 0 && temp.indexOf(j) == -1) {
					temp.push(j);
				}
			}
		}
		x0 = x1;
		y0 = y1;
	}
	
	return corners.filter((item, index) => temp.indexOf(index) == -1);
};

const checkMidPointInside = (vert, x, y, ax1, ax2) => {
	let vertices = JSON.parse(JSON.stringify(vert));
	// Get the triangulating line	
	
	let x0 = vertices[0][ax1], y0 = vertices[0][ax2], x1, y1, x2, y2;
	let left = 0, right = 0, bottom = 0, top = 0;	
	// A point is inside if a vertical and a horizontal line through the point crosses odd number of lines
	// on each side of the point in both vertical and horizontal directions.
	let yofx, xofy, m, angle;
	for (let i = 1; i <= vertices.length; i++) {
		x1 = i <= (vertices.length - 1) ? vertices[i][ax1] : vertices[i - vertices.length][ax1];
		y1 = i <= (vertices.length - 1) ? vertices[i][ax2] : vertices[i - vertices.length][ax2];
		x2 = i <= (vertices.length - 2) ? vertices[i + 1][ax1] : vertices[i - vertices.length + 1][ax1];
		y2 = i <= (vertices.length - 2) ? vertices[i + 1][ax2] : vertices[i - vertices.length + 1][ax2];
		if (Math.abs(x1 - xofy) < this.tolerance && Math.abs(y1 - yofx) < this.tolerance) {
			continue;
		}
		m = (y1 - y0)/(x1 - x0);
		yofx = m*(x - x1) + y1;
		xofy = (y - y1)/m + x1;	
		
		let hbend = 0, vbend = 0;
		if ((x1 - x0)*(x2 - x1) < 0 && Math.abs(x1 - xofy) < this.tolerance && Math.abs(y1 - yofx) < this.tolerance) vbend = 1;
		if ((y1 - y0)*(y2 - y1) < 0 && Math.abs(x1 - xofy) < this.tolerance && Math.abs(y1 - yofx) < this.tolerance) hbend = 1;
		
		if ((x0 - x)*(x1 - x) < 0 && yofx < y) bottom = bottom + 1 + vbend;
		else if ((x0 - x)*(x1 - x) < 0 && yofx > y) top = top + 1 + vbend;
		
		if ((y0 - y)*(y1 - y) < 0 && xofy < x) left = left + 1 + hbend;
		else if ((y0 - y)*(y1 - y) < 0 && xofy > x) right = right + 1 + hbend;				
		
		x0 = x1;
		y0 = y1;
	}	
	return bottom % 2 != 0 && top % 2 != 0 && left % 2 != 0 && right % 2 != 0;
	return true;
};

module.exports = (ver, plane, getAxes, tolerance) => {
	if (!Array.isArray(ver)) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let temp = JSON.parse(JSON.stringify(ver));
	if (ver[0][ax1] == ver[ver.length - 1][ax1] && ver[0][ax2] == ver[ver.length - 1][ax2]) {
		temp = temp.slice(0, ver.length - 1);
	}
	let tempV = [], temp2 = [], V = [];
	for (let i = 0; i < temp.length; i++) {
		const str = temp[i][ax1] + "," + temp[i][ax2];
		if (temp2.indexOf(str) != -1 && temp2.indexOf(str) != (temp2.length - 1)) {
			V.push(tempV);
			tempV = [temp[i]];
		} else if (temp2.indexOf(str) == -1 || temp2.indexOf(str) != (temp2.length - 1)) {
			tempV.push(temp[i]);
			temp2.push(str);
		} 
	}
	V.push(tempV);
	let triangles = [];
	for (let count = 0; count < V.length; count++) {
		let vertices = V[count];
		const isBent = checkBending(vertices, ax1, ax2, tolerance);
		if (isBent) {
			let corners = threeCorners(vertices);		
			corners = getVisibleCorners(vertices, corners, ax1, ax2, tolerance);
			
			if (corners.length == 0) return [];
			let triangulated = [corners[0]];
			let temp = [[
				{x: vertices[corners[0][0]][ax1], y: vertices[corners[0][0]][ax2]},
				{x: vertices[corners[0][1]][ax1], y: vertices[corners[0][1]][ax2]},
				{x: vertices[corners[0][2]][ax1], y: vertices[corners[0][2]][ax2]},
				{x: vertices[corners[0][0]][ax1], y: vertices[corners[0][0]][ax2]}
			]];
			let temp2 = [corners[0]];
			for (let i = 1; i < corners.length; i++) {
				const line1 = [vertices[corners[i][0]][ax1], vertices[corners[i][0]][ax2], vertices[corners[i][1]][ax1], vertices[corners[i][1]][ax2]];
				const line2 = [vertices[corners[i][1]][ax1], vertices[corners[i][1]][ax2], vertices[corners[i][2]][ax1], vertices[corners[i][2]][ax2]];
				const line3 = [vertices[corners[i][2]][ax1], vertices[corners[i][2]][ax2], vertices[corners[i][0]][ax1], vertices[corners[i][0]][ax2]];
				
				let crosses = false;
				for (let j = 0; j < temp.length; j++) {
					let c = getVisibleCorners(temp[j], [[line1, line2, line3]], ax1, ax2, tolerance);
					if (c.length == 0) {
						crosses = true;
						break;
					}
				}
				
				if (!crosses) {					
					temp.push([{x: line1[0], y: line1[1]}, {x: line2[0], y: line2[1]}, {x: line3[0], y: line3[1]}, {x: line1[0], y: line1[1]}]); 
					let x1, y1, x2, y2, x3, y3, inside1 = true, inside2 = true, inside3 = true;
					if (Math.abs(corners[i][0] - corners[i][1]) > 1 && (Math.abs(corners[i][0] - corners[i][1]) < (vertices.length - 1))) {
						x1 = (line1[0] + line1[2])/2;
						y1 = (line1[1] + line1[3])/2;
					}
					if (!isNaN(x1) && !isNaN(y1)) {
						inside1 = checkMidPointInside(vertices, x1, y1, ax1, ax2);
					}
					
					if (Math.abs(corners[i][1] - corners[i][2]) > 1 && (Math.abs(corners[i][1] - corners[i][2]) < (vertices.length - 1))) {
						x2 = (line2[0] + line2[2])/2;
						y2 = (line2[1] + line2[3])/2;
					}
					
					if (!isNaN(x2) && !isNaN(y2)) {
						inside2 = checkMidPointInside(vertices, x2, y2, ax1, ax2);
					}
					
					if (Math.abs(corners[i][0] - corners[i][2]) > 1 && (Math.abs(corners[i][0] - corners[i][2]) < (vertices.length - 1))) {
						x3 = (line3[0] + line3[2])/2;
						y3 = (line3[1] + line3[3])/2;
					}
					if (!isNaN(x3) && !isNaN(y3)) {
						inside3 = checkMidPointInside(vertices, x3, y3, ax1, ax2);
					} 
					
					if (inside1 && inside2 && inside3) {
						temp2.push(corners[i]);
					}
				}
				
			}
			
			temp2.forEach((t) => {
				let temp = [];
				for (let i = 0; i < t.length; i++) {
					let json = {};
					json[ax1] = vertices[t[i]][ax1];
					json[ax2] = vertices[t[i]][ax2];
					temp.push(json);
				}
				triangles.push(temp);
			});
		}
	}
	
	return triangles;
};
		

