const ErrorMessages = require("./ErrorMessages.json");

const triangulate = (ver, ax1, ax2, tolerance, triangles) => {
	if (ver.length == 3) {
		let temp = [];
		ver.forEach((t) => {
			let json = {};
			json[ax1] = t[ax1];
			json[ax2] = t[ax2];
			temp.push(json);
		});
		triangles.push(temp);
		return; 
	}
	
	let temp = JSON.parse(JSON.stringify(ver));
		
	if (temp[0][ax1] == temp[temp.length - 1][ax1] && temp[0][ax2] == temp[temp.length - 1][ax2]) {
		temp.pop();
	}
	
	let area = 0;
	for (let i = 0; i < temp.length - 1; i++) {
		area = area + temp[i][ax1]*temp[i + 1][ax2] - temp[i + 1][ax1]*temp[i][ax2];
	}
	area = area + temp[temp.length - 1][ax1]*temp[0][ax2] - temp[0][ax1]*temp[temp.length - 1][ax2];
	
	if (area < 0) {
		temp.reverse();
	}
			
	for (let i = 0; i < temp.length; i++) {		
		const p1 = temp[i];
		const index0 = (i + 1) < temp.length ? (i + 1) : (i - temp.length + 1);
		const p2 = temp[index0];
		const p3 = (i + 2) < temp.length ? temp[i + 2] : temp[i - temp.length + 2];		
		const x11 = p1[ax1];
		const y11 = p1[ax2];
		const x12 = p3[ax1];
		const y12 = p3[ax2];
		const cp = crossproduct(p1, p2, p3, ax1, ax2);
		
		if (cp > 0) {
			let crosses = false;
			for (let j = (i + 3); j < temp.length + i; j++) {
				const index1 = j < temp.length ? j : (j - temp.length);
				const index2 = (j + 1) < temp.length ? (j + 1) : (j + 1 - temp.length);	
				const x21 = temp[index1][ax1];
				const y21 = temp[index1][ax2];
				const x22 = temp[index2][ax1];
				const y22 = temp[index2][ax2];
				const det = (x12 - x11)*(y22 - y21) - (x22 - x21)*(y12 - y11);
				if (det > 0.000001) {
					const det1 = (x22 - x11)*(y22 - y21) - (x22 - x21)*(y22 - y11);
					const det2 = (x12 - x11)*(y12 - y21) - (x12 - x21)*(y12 - y11);
					
					if (det1 >= 0 && det1 <= det && det2 >= 0 && det2 <= det) {
						crosses = true;						
						break;
					}
				}
			}
			
			if (!crosses) {
				temp.splice(index0, 1);
				triangulate(temp, ax1, ax2, tolerance, triangles);
				
				triangulate([p1, p2, p3], ax1, ax2, tolerance, triangles);
				return;
			}
		}
	}
};

const crossproduct = (p1, p2, p3, ax1, ax2) => {
	return (p2[ax1] - p1[ax1])*(p3[ax2] - p2[ax2]) - (p2[ax2] - p1[ax2])*(p3[ax1] - p2[ax1]);
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
	
	let triangles = [], temp = [], vertices = [];

	for (let i = 0; i < ver.length; i++) {
		const txt = JSON.stringify(ver[i]);
		
		if (temp.indexOf(txt) == -1) {
			vertices.push(ver[i]);
			temp.push(txt);			
		}
	}
	
	triangulate(vertices, ax1, ax2, tolerance, triangles);
		
	return triangles;
};
		

