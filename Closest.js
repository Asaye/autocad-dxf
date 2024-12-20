const ErrorMessages = require("./ErrorMessages.json");

module.exports = (entity, etype, mode, list, list2, tolerance) => {
	if (!entity || (typeof entity != "object")|| Array.isArray(entity) || (etype && !Array.isArray(etype))) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	const etype2 = entity.subclass;
	let domain;
	if (list && Array.isArray(list)) {
		domain = list;
	} else {
		domain = list2;
	}
	let filtered;
	if (Array.isArray(etype)) {
		filtered = [];
		domain.forEach((item, index) => {				
			const txt = item.subclass.replace("AcDb", "").toLowerCase();
			const txt2 = item.etype ? item.etype.toLowerCase() : "";
			if (etype.indexOf(txt) != -1 || (txt2.length > 0 && etype.indexOf(txt2) != -1)) {
				filtered.push(item);
			}
		});
	} else {
		filtered = domain;
	}
	
	if (etype2 == "AcDbLine") {
		const x1 = entity.start_x;
		const y1 = entity.start_y;
		const z1 = entity.start_z;
		const x2 = entity.end_x;
		const y2 = entity.end_y;
		const z2 = entity.end_z;			
		
		let dmin = Infinity, index = -1;
		filtered.forEach((item, i) => {
			let d = Infinity;
			let etype3 = item.subclass;
			if (etype3 && (etype3 == "AcDbPoint" || etype3  =="AcDbCircle" || etype3 == "AcDbEllipse" || 
				etype3 == "AcDbText" || etype3 == "AcDbMText" || etype3 == "AcDbDimension")) {
				const x = item.x;
				const y = item.y;
				const z = item.z;
				if (mode == "end" || mode == "corner") {
					const d1 = (x - x1)*(x - x1) + (y - y1)*(y - y1) + (z - z1)*(z - z1);
					const d2 = (x - x2)*(x - x2) + (y - y2)*(y - y2) + (z - z2)*(z - z2);
					d = Math.min(d1, d2);
				} else if (mode == "perpendicular") {
					let m1, m2, m3;
					if (x !== undefined && y !== undefined) {
						m1 = (y2 - y1)/(x2 - x1);
					}
					if (y !== undefined && z !== undefined) {
						m2 = (z2 - z1)/(y2 - y1);
					}
					if (x !== undefined && z !== undefined) {
						m3 = (x2 - x1)/(z2 - z1);
					}
					
					if (Math.abs(m1) == Infinity && !m2 && (isNaN(m3) || !m3)) {
						const d1 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
						const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
						d = Math.sqrt(d1*d1 + d2*d2);
					} else if (Math.abs(m2) == Infinity && !m3 && (isNaN(m1) || !m1)) {
						const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
						const d2 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
						d = Math.sqrt(d1*d1 + d2*d2);
					} else if (Math.abs(m3) == Infinity && !m1 && (isNaN(m2) || !m2)) {
						const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
						const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
						d = Math.sqrt(d1*d1 + d2*d2);
					} else if ((!m3 || Math.abs(m3) == Infinity) && !m2 && Math.abs(m1) > 0) {
						const A = -m1;
						const B = 1;
						const C = m1*x1 - y1;
						d = Math.abs(A*x + B*y + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(z1*z)) {
							d = Math.sqrt(d*d + (z1 - z)*(z1 - z));
						}
					} else if ((!m1 || Math.abs(m1) == Infinity) && !m3 && Math.abs(m2) > 0) {
						const A = -m2;
						const B = 1;
						const C = m2*y1 - z1;
						d = Math.abs(A*y + B*z + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(x1*x)) {
							d = Math.sqrt(d*d + (x1 - x)*(x1 - x));
						}
					} else if ((!m2 || Math.abs(m2) == Infinity) && !m1 && Math.abs(m3) > 0) {
						const A = -m3;
						const B = 1;
						const C = m3*z1 - x1;
						d = Math.abs(A*z + B*x + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(y1*y)) {
							d = Math.sqrt(d*d + (y1 - y)*(y1 - y));
						}
					} else {
						const ii = (z - z1)*(y2 - y1) - (y - y1)*(z2 - z1);
						const jj = (x - x1)*(z2 - z1) - (z - z1)*(x2 - x1);
						const kk = (y - y1)*(x2 - x1) - (x - x1)*(y2 - y1);
						const d1 = (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) + (z1 - z2)*(z1 - z2);
						d = Math.sqrt(ii*ii + jj*jj + kk*kk)/Math.sqrt(d1);
					}
					d = d*d;
				} else {
					d = (x - (x1 + x2)/2)*(x - (x1 + x2)/2) + (y - (y1 + y2)/2)*(y - (y1 + y2)/2) + (z - (z1 + z2)/2)*(z - (z1 + z2)/2);
				}
			} else if (etype3 && etype3 == "AcDbLine") {
				const x21 = item.start_x;
				const y21 = item.start_y;
				const z21 = item.start_z;
				const x22 = item.end_x;
				const y22 = item.end_y;
				const z22 = item.end_z;
				
				if (x1 == x21 && y1 == y21 && z1 == z21 && x2 == x22 && y2 == y22 && z2 == z22) {
					return;
				}
				
				if (mode == "end" || mode == "corner") {
					const d1 = (x21 - x1)*(x21 - x1) + (y21 - y1)*(y21 - y1) + (z21 - z1)*(z21 - z1);
					const d2 = (x21 - x2)*(x21 - x2) + (y21 - y2)*(y21 - y2) + (z21 - z2)*(z21 - z2);
					const d3 = (x22 - x1)*(x22 - x1) + (y22 - y1)*(y22 - y1) + (z22 - z1)*(z22 - z1);
					const d4 = (x22 - x2)*(x22 - x2) + (y22 - y2)*(y22 - y2) + (z22 - z2)*(z22 - z2);
					d = Math.min(d1, d2, d3, d4);
				} else if (mode == "perpendicular") {
					let m1, m2, m3;
					if (x21 !== undefined && y21 !== undefined) {
						m1 = (y2 - y1)/(x2 - x1);
					}
					if (y21 !== undefined && z21 !== undefined) {
						m2 = (z2 - z1)/(y2 - y1);
					}
					if (x21 !== undefined && z21 !== undefined) {
						m3 = (x2 - x1)/(z2 - z1);
					}
					
					if (Math.abs(m1) == Infinity && !m2 && (isNaN(m3) || !m3)) {
						const d1 = isNaN(Math.abs(x1 - x21)) ? 0 : Math.abs(x1 - x21);
						const d2 = isNaN(Math.abs(z1 - z21)) ? 0 : Math.abs(z1 - z21);
						const d3 = isNaN(Math.abs(x1 - x22)) ? 0 : Math.abs(x1 - x22);
						const d4 = isNaN(Math.abs(z1 - z22)) ? 0 : Math.abs(z1 - z22);
						d = Math.min(Math.sqrt(d1*d1 + d2*d2), Math.sqrt(d3*d3 + d4*d4));
					} else if (Math.abs(m2) == Infinity && !m3 && (isNaN(m1) || !m1)) {
						const d1 = isNaN(Math.abs(y1 - y21)) ? 0 : Math.abs(y1 - y21);
						const d2 = isNaN(Math.abs(x1 - x21)) ? 0 : Math.abs(x1 - x21);
						const d3 = isNaN(Math.abs(y1 - y22)) ? 0 : Math.abs(y1 - y22);
						const d4 = isNaN(Math.abs(x1 - x22)) ? 0 : Math.abs(x1 - x22);
						d = Math.min(Math.sqrt(d1*d1 + d2*d2), Math.sqrt(d3*d3 + d4*d4));
					} else if (Math.abs(m3) == Infinity && !m1 && (isNaN(m2) || !m2)) {
						const d1 = isNaN(Math.abs(y1 - y21)) ? 0 : Math.abs(y1 - y21);
						const d2 = isNaN(Math.abs(z1 - z21)) ? 0 : Math.abs(z1 - z21);
						const d3 = isNaN(Math.abs(y1 - y22)) ? 0 : Math.abs(y1 - y22);
						const d4 = isNaN(Math.abs(z1 - z22)) ? 0 : Math.abs(z1 - z22);
						d = Math.min(Math.sqrt(d1*d1 + d2*d2), Math.sqrt(d3*d3 + d4*d4));
					} else if ((!m3 || Math.abs(m3) == Infinity) && !m2 && Math.abs(m1) > 0) {
						const A = -m1;
						const B = 1;
						const C = m1*x1 - y1;
						let d1 = Math.abs(A*x21 + B*y21 + C)/Math.sqrt(A*A + B*B);
						let d2 = Math.abs(A*x22 + B*y22 + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(z1*z21)) {
							d1 = Math.sqrt(d1*d1 + (z1 - z21)*(z1 - z21));
						}
						if (!isNaN(z1*z22)) {
							d2 = Math.sqrt(d2*d2 + (z1 - z22)*(z1 - z22));
						}
						d = Math.min(d1, d2);
					} else if ((!m1 || Math.abs(m1) == Infinity) && !m3 && Math.abs(m2) > 0) {
						const A = -m2;
						const B = 1;
						const C = m2*y1 - z1;
						let d1 = Math.abs(A*y21 + B*z21 + C)/Math.sqrt(A*A + B*B);
						let d2 = Math.abs(A*y22 + B*z22 + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(x1*x21)) {
							d1 = Math.sqrt(d1*d1 + (x1 - x21)*(x1 - x21));
						}
						if (!isNaN(x1*x22)) {
							d2 = Math.sqrt(d2*d2 + (x1 - x22)*(x1 - x22));
						}
						d = Math.min(d1, d2);
					} else if ((!m2 || Math.abs(m2) == Infinity) && !m1 && Math.abs(m3) > 0) {
						const A = -m3;
						const B = 1;
						const C = m3*z1 - x1;							
						let d1 = Math.abs(A*z21 + B*x21 + C)/Math.sqrt(A*A + B*B);
						let d2 = Math.abs(A*z22 + B*x22 + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(y1*y21)) {
							d1 = Math.sqrt(d1*d1 + (y1 - y21)*(y1 - y21));
						}
						if (!isNaN(y1*y22)) {
							d2 = Math.sqrt(d2*d2 + (y1 - y22)*(y1 - y22));
						}
						d = Math.min(d1, d2);
					} else {
						const d1 = (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) + (z1 - z2)*(z1 - z2);
						const ii = (z21 - z1)*(y2 - y1) - (y21 - y1)*(z2 - z1);
						const jj = (x21 - x1)*(z2 - z1) - (z21 - z1)*(x2 - x1);
						const kk = (y21 - y1)*(x2 - x1) - (x21 - x1)*(y2 - y1);							
						const d2 = Math.sqrt(ii*ii + jj*jj + kk*kk)/Math.sqrt(d1);
						const ii2 = (z22 - z1)*(y2 - y1) - (y22 - y1)*(z2 - z1);
						const jj2 = (x22 - x1)*(z2 - z1) - (z22 - z1)*(x2 - x1);
						const kk2 = (y22 - y1)*(x2 - x1) - (x22 - x1)*(y2 - y1);
						const d3 = Math.sqrt(ii2*ii2 + jj2*jj2 + kk2*kk2)/Math.sqrt(d1);
						d = Math.min(d2, d3);
					}
					d = d*d;
				} else {
					d = ((x21 + x22)/2 - (x1 + x2)/2)*((x21 + x22)/2 - (x1 + x2)/2) + 
						((y21 + y22)/2 - (y1 + y2)/2)*((y21 + y22)/2 - (y1 + y2)/2) + 
						((z21 + z22)/2 - (z1 + z2)/2)*((z21 + z22)/2 - (z1 + z2)/2);
				}
			} else if (etype3 && (etype3 == "AcDbPolyline" || etype3 == "AcDbSpline")) {
				let va;
				if (etype3 == "AcDbSpline") {
					va = item.control_points;
				} else {
					va = item.vertices;
				}
				for (let i = 0; i < va.length; i++) {
					const x = va[i].x;
					const y = va[i].y;
					const z = va[i].z;
					let d0 = Infinity;
					let d1 = 0, d2 = 0;
					if (mode == "end" || mode == "corner") {								
						if (x !== undefined) {
							d1 = d1 + (x - x1)*(x - x1);
							d2 = d2 + (x - x2)*(x - x2);
						}
						if (y !== undefined) {
							d1 = d1 + (y - y1)*(y - y1);
							d2 = d2 + (y - y2)*(y - y2);
						}
						if (z !== undefined) {
							d1 = d1 + (z - z1)*(z - z1);
							d2 = d2 + (z - z2)*(z - z2);
						}
						d0 = Math.min(d1, d2);
					} else if (mode == "perpendicular") {
						let m1, m2, m3;
						if (x !== undefined && y !== undefined) {
							m1 = (y2 - y1)/(x2 - x1);
						}
						if (y !== undefined && z !== undefined) {
							m2 = (z2 - z1)/(y2 - y1);
						}
						if (x !== undefined && z !== undefined) {
							m3 = (x2 - x1)/(z2 - z1);
						}
						
						if (Math.abs(m1) == Infinity && !m2 && (isNaN(m3) || !m3)) {
							const d1 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
							const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
							d0 = Math.sqrt(d1*d1 + d2*d2);
						} else if (Math.abs(m2) == Infinity && !m3 && (isNaN(m1) || !m1)) {
							const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
							const d2 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
							d0 = Math.sqrt(d1*d1 + d2*d2);
						} else if (Math.abs(m3) == Infinity && !m1 && (isNaN(m2) || !m2)) {
							const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
							const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
							d0 = Math.sqrt(d1*d1 + d2*d2);
						} else if ((!m3 || Math.abs(m3) == Infinity) && !m2 && Math.abs(m1) > 0) {
							const A = -m1;
							const B = 1;
							const C = m1*x1 - y1;
							d0 = Math.abs(A*x + B*y + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(z1*z)) {
								d0 = Math.sqrt(d0*d0 + (z1 - z)*(z1 - z));
							}
						} else if ((!m1 || Math.abs(m1) == Infinity) && !m3 && Math.abs(m2) > 0) {
							const A = -m2;
							const B = 1;
							const C = m2*y1 - z1;
							d0 = Math.abs(A*y + B*z + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(x1*x)) {
								d0 = Math.sqrt(d0*d0 + (x1 - x)*(x1 - x));
							}
						} else if ((!m2 || Math.abs(m2) == Infinity) && !m1 && Math.abs(m3) > 0) {
							const A = -m3;
							const B = 1;
							const C = m3*z1 - x1;
							d0 = Math.abs(A*z + B*x + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(y1*y)) {
								d0 = Math.sqrt(d0*d0 + (y1 - y)*(y1 - y));
							}
						} else {
							const ii = (z - z1)*(y2 - y1) - (y - y1)*(z2 - z1);
							const jj = (x - x1)*(z2 - z1) - (z - z1)*(x2 - x1);
							const kk = (y - y1)*(x2 - x1) - (x - x1)*(y2 - y1);
							const d1 = (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) + (z1 - z2)*(z1 - z2);
							d0 = Math.sqrt(ii*ii + jj*jj + kk*kk)/Math.sqrt(d1);
						}
						d0 = d0*d0;
					} else {
						if (x !== undefined ) {
							d1 = d1 + (x - (x1 + x2)/2)*(x - (x1 + x2)/2);
						}
						if (y !== undefined ) {
							d1 = d1 + (y - (y1 + y2)/2)*(y - (y1 + y2)/2);
						}
						if (z !== undefined ) {
							d1 = d1 + (z - (z1 + z2)/2)*(z - (z1 + z2)/2);
						}
						d0 = d1;
					}
					if (d0 < d) {
						d = d0;
					}
				}
			}
			if (d < dmin) {
				dmin = d;
				index = i;
			}
		});
		if (index > -1) {
			return filtered[index];
		} else {
			return {};
		}
	} else if (etype2 == "AcDbPoint" || etype2 == "AcDbCircle" || etype2 == "AcDbEllipse" || etype2 == "AcDbText" || etype2 == "AcDbMText" || etype2 == "AcDbDimension") {
		const x = entity.x;
		const y = entity.y;
		const z = entity.z;		
		
		let dmin = Infinity, index = -1;
		filtered.forEach((item, i) => {
			let d = Infinity;
			let etype3 = item.subclass;
			if (etype3 == "AcDbLine") {
				const x1 = item.start_x;
				const y1 = item.start_y;
				const z1 = item.start_z;
				const x2 = item.end_x;
				const y2 = item.end_y;
				const z2 = item.end_z;
				if (mode == "end" || mode == "corner") {
					const d1 = (x - x1)*(x - x1) + (y - y1)*(y - y1) + (z - z1)*(z - z1);
					const d2 = (x - x2)*(x - x2) + (y - y2)*(y - y2) + (z - z2)*(z - z2);
					d = Math.min(d1, d2);
				} else if (mode == "perpendicular") {
					let m1, m2, m3;
					if (x !== undefined && y !== undefined) {
						m1 = (y2 - y1)/(x2 - x1);
					}
					if (y !== undefined && z !== undefined) {
						m2 = (z2 - z1)/(y2 - y1);
					}
					if (x !== undefined && z !== undefined) {
						m3 = (x2 - x1)/(z2 - z1);
					}
					
					if (Math.abs(m1) == Infinity && !m2 && (isNaN(m3) || !m3)) {
						const d1 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
						const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
						d = Math.sqrt(d1*d1 + d2*d2);
					} else if (Math.abs(m2) == Infinity && !m3 && (isNaN(m1) || !m1)) {
						const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
						const d2 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
						d = Math.sqrt(d1*d1 + d2*d2);
					} else if (Math.abs(m3) == Infinity && !m1 && (isNaN(m2) || !m2)) {
						const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
						const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
						d = Math.sqrt(d1*d1 + d2*d2);
					} else if ((!m3 || Math.abs(m3) == Infinity) && !m2 && Math.abs(m1) > 0) {
						const A = -m1;
						const B = 1;
						const C = m1*x1 - y1;
						d = Math.abs(A*x + B*y + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(z1*z)) {
							d = Math.sqrt(d*d + (z1 - z)*(z1 - z));
						}
					} else if ((!m1 || Math.abs(m1) == Infinity) && !m3 && Math.abs(m2) > 0) {
						const A = -m2;
						const B = 1;
						const C = m2*y1 - z1;
						d = Math.abs(A*y + B*z + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(x1*x)) {
							d = Math.sqrt(d*d + (x1 - x)*(x1 - x));
						}
					} else if ((!m2 || Math.abs(m2) == Infinity) && !m1 && Math.abs(m3) > 0) {
						const A = -m3;
						const B = 1;
						const C = m3*z1 - x1;
						d = Math.abs(A*z + B*x + C)/Math.sqrt(A*A + B*B);
						if (!isNaN(y1*y)) {
							d = Math.sqrt(d*d + (y1 - y)*(y1 - y));
						}
					} else {
						const ii = (z - z1)*(y2 - y1) - (y - y1)*(z2 - z1);
						const jj = (x - x1)*(z2 - z1) - (z - z1)*(x2 - x1);
						const kk = (y - y1)*(x2 - x1) - (x - x1)*(y2 - y1);
						const d1 = (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) + (z1 - z2)*(z1 - z2);
						d = Math.sqrt(ii*ii + jj*jj + kk*kk)/Math.sqrt(d1);
					}
					
					d = d*d;
					
				} else {
					d = (x - (x1 + x2)/2)*(x - (x1 + x2)/2) + (y - (y1 + y2)/2)*(y - (y1 + y2)/2) + (z - (z1 + z2)/2)*(z - (z1 + z2)/2);
				}
			} else if (etype3 == "AcDbPolyline" || etype3 == "AcDbSpline") {
				let va;
				if (etype3 == "AcDbSpline") {
					va = item.control_points;
				} else {
					va = item.vertices;
				}
				if (item.type == "Closed") {
					va = JSON.parse(JSON.stringify(va));
					va.push(va[0]);
				}
				d = Infinity;
				for (let i = 0; i < va.length; i++) {
					const x1 = va[i].x;
					const y1 = va[i].y;
					const z1 = va[i].z;
					let d0 = Infinity;
					let d1 = 0, d2 = 0;
					
					if (mode == "end" || mode == "corner") {
						d0 = 0;							
						if (x !== undefined && x1 !== undefined) {
							d0 = d0 + (x - x1)*(x - x1);
						}
						if (y !== undefined && y1 !== undefined) {
							d0 = d0 + (y - y1)*(y - y1);
						}
						if (z !== undefined && z1 !== undefined) {
							d0 = d0 + (z - z1)*(z - z1);
						}
					} else if (mode == "perpendicular") {
						if ((i + 1) >= va.length) continue;
						const x2 = va[i + 1].x;
						const y2 = va[i + 1].y;
						const z2 = va[i + 1].z;
						let m1, m2, m3;
						if (x !== undefined && y !== undefined) {
							m1 = (y2 - y1)/(x2 - x1);
						}
						if (y !== undefined && z !== undefined) {
							m2 = (z2 - z1)/(y2 - y1);
						}
						if (x !== undefined && z !== undefined) {
							m3 = (x2 - x1)/(z2 - z1);
						}
						
						if (Math.abs(m1) == Infinity && !m2 && (isNaN(m3) || !m3)) {
							const d1 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
							const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
							d0 = Math.sqrt(d1*d1 + d2*d2);
						} else if (Math.abs(m2) == Infinity && !m3 && (isNaN(m1) || !m1)) {
							const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
							const d2 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
							d0 = Math.sqrt(d1*d1 + d2*d2);
						} else if (Math.abs(m3) == Infinity && !m1 && (isNaN(m2) || !m2)) {
							const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
							const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
							d0 = Math.sqrt(d1*d1 + d2*d2);
						} else if ((!m3 || Math.abs(m3) == Infinity) && !m2 && Math.abs(m1) > 0) {
							const A = -m1;
							const B = 1;
							const C = m1*x1 - y1;
							d0 = Math.abs(A*x + B*y + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(z1*z)) {
								d0 = Math.sqrt(d0*d0 + (z1 - z)*(z1 - z));
							}
						} else if ((!m1 || Math.abs(m1) == Infinity) && !m3 && Math.abs(m2) > 0) {
							const A = -m2;
							const B = 1;
							const C = m2*y1 - z1;
							d0 = Math.abs(A*y + B*z + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(x1*x)) {
								d0 = Math.sqrt(d0*d0 + (x1 - x)*(x1 - x));
							}
						} else if ((!m2 || Math.abs(m2) == Infinity) && !m1 && Math.abs(m3) > 0) {
							const A = -m3;
							const B = 1;
							const C = m3*z1 - x1;
							d0 = Math.abs(A*z + B*x + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(y1*y)) {
								d0 = Math.sqrt(d0*d0 + (y1 - y)*(y1 - y));
							}
						} else {
							const ii = (z - z1)*(y2 - y1) - (y - y1)*(z2 - z1);
							const jj = (x - x1)*(z2 - z1) - (z - z1)*(x2 - x1);
							const kk = (y - y1)*(x2 - x1) - (x - x1)*(y2 - y1);
							const d1 = (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) + (z1 - z2)*(z1 - z2);
							d0 = Math.sqrt(ii*ii + jj*jj + kk*kk)/Math.sqrt(d1);
						}
						d0 = d0*d0;
					} else {
						if ((i + 1) >= va.length) continue;
						const x2 = va[i + 1].x;
						const y2 = va[i + 1].y;
						const z2 = va[i + 1].z;
						if (x1 !== undefined && x2 !== undefined ) {
							d1 = d1 + (x - (x1 + x2)/2)*(x - (x1 + x2)/2);
						}
						if (y1 !== undefined && y2 !== undefined ) {
							d1 = d1 + (y - (y1 + y2)/2)*(y - (y1 + y2)/2);
						}
						if (z1 !== undefined && z2 !== undefined ) {
							d1 = d1 + (z - (z1 + z2)/2)*(z - (z1 + z2)/2);
						}
						d0 = d1;
					}
					if (d0 < d) {
						d = d0;
					}
				}
			} else if (etype3 && (etype3 == "AcDbPoint" || etype3  =="AcDbCircle" || etype3 == "AcDbEllipse" || 
				etype3 == "AcDbText" || etype3 == "AcDbMText" || etype3 == "AcDbDimension")) { 
				const x1 = item.x;
				const y1 = item.y;
				const z1 = item.z;
				
				if ((x1 === undefined && y1 === undefined && z1 === undefined) || etype3 == etype2 && Math.abs(x - x1) < tolerance && Math.abs(y - y1) < tolerance && Math.abs(z - z1) < tolerance) {
					d = Infinity;
					return;
				}
				d = (x - x1)*(x - x1) + (y - y1)*(y - y1) + (z - z1)*(z - z1);
			}
			if (d < dmin) {
				dmin = d;
				index = i;			
			}
		});
		
		if (index > -1) {
			return filtered[index];
		} else {
			return {};
		}
	} else if (etype2 == "AcDbPolyline" || etype2 == "AcDbSpline") {
		let vb;
		if (etype2 == "AcDbSpline") {
			vb = entity.control_points;
		} else {
			vb = entity.vertices;
		}
		if (entity.type == "Closed") {
			vb = JSON.parse(JSON.stringify(vb));
			vb.push(vb[0]);
		}
		let dmin = Infinity, index = -1;
		
		for (let k = 1; k < vb.length; k++) {
			const x1 = vb[k - 1].x;
			const y1 = vb[k - 1].y;
			const z1 = vb[k - 1].z;
			const x2 = vb[k].x;
			const y2 = vb[k].y;
			const z2 = vb[k].z;	
			
			filtered.forEach((item, i) => {
				
				let d = Infinity;
				let etype3 = item.subclass;
				if (etype3 && (etype3 == "AcDbPoint" || etype3  =="AcDbCircle" || etype3 == "AcDbEllipse" || 
					etype3 == "AcDbText" || etype3 == "AcDbMText" || etype3 == "AcDbDimension")) { 
					const x = item.x;
					const y = item.y;
					const z = item.z;
					if (mode == "end" || mode == "corner") {
						const d1 = (x - x1)*(x - x1) + (y - y1)*(y - y1) + (z - z1)*(z - z1);
						const d2 = (x - x2)*(x - x2) + (y - y2)*(y - y2) + (z - z2)*(z - z2);
						d = Math.min(d1, d2);
					} else if (mode == "perpendicular") {
						let m1, m2, m3;
						if (x !== undefined && y !== undefined) {
							m1 = (y2 - y1)/(x2 - x1);
						}
						if (y !== undefined && z !== undefined) {
							m2 = (z2 - z1)/(y2 - y1);
						}
						if (x !== undefined && z !== undefined) {
							m3 = (x2 - x1)/(z2 - z1);
						}
						
						if (Math.abs(m1) == Infinity && !m2 && (isNaN(m3) || !m3)) {
							const d1 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
							const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
							d = Math.sqrt(d1*d1 + d2*d2);
						} else if (Math.abs(m2) == Infinity && !m3 && (isNaN(m1) || !m1)) {
							const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
							const d2 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
							d = Math.sqrt(d1*d1 + d2*d2);
						} else if (Math.abs(m3) == Infinity && !m1 && (isNaN(m2) || !m2)) {
							const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
							const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
							d = Math.sqrt(d1*d1 + d2*d2);
						} else if ((!m3 || Math.abs(m3) == Infinity) && !m2 && Math.abs(m1) > 0) {
							const A = -m1;
							const B = 1;
							const C = m1*x1 - y1;
							d = Math.abs(A*x + B*y + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(z1*z)) {
								d = Math.sqrt(d*d + (z1 - z)*(z1 - z));
							}
						} else if ((!m1 || Math.abs(m1) == Infinity) && !m3 && Math.abs(m2) > 0) {
							const A = -m2;
							const B = 1;
							const C = m2*y1 - z1;
							d = Math.abs(A*y + B*z + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(x1*x)) {
								d = Math.sqrt(d*d + (x1 - x)*(x1 - x));
							}
						} else if ((!m2 || Math.abs(m2) == Infinity) && !m1 && Math.abs(m3) > 0) {
							const A = -m3;
							const B = 1;
							const C = m3*z1 - x1;
							d = Math.abs(A*z + B*x + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(y1*y)) {
								d = Math.sqrt(d*d + (y1 - y)*(y1 - y));
							}
						} else {
							const ii = (z - z1)*(y2 - y1) - (y - y1)*(z2 - z1);
							const jj = (x - x1)*(z2 - z1) - (z - z1)*(x2 - x1);
							const kk = (y - y1)*(x2 - x1) - (x - x1)*(y2 - y1);
							const d1 = (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) + (z1 - z2)*(z1 - z2);
							d = Math.sqrt(ii*ii + jj*jj + kk*kk)/Math.sqrt(d1);
						}
						d = d*d;
					} else {
						d = (x - (x1 + x2)/2)*(x - (x1 + x2)/2) + (y - (y1 + y2)/2)*(y - (y1 + y2)/2) + (z - (z1 + z2)/2)*(z - (z1 + z2)/2);
					}
					
				} else if (etype3 == "AcDbLine") {
					const x21 = item.start_x;
					const y21 = item.start_y;
					const z21 = item.start_z;
					const x22 = item.end_x;
					const y22 = item.end_y;
					const z22 = item.end_z;
					
					if (x1 == x21 && y1 == y21 && z1 == z21 && x2 == x22 && y2 == y22 && z2 == z22) {
						return;
					}
					
					if (mode == "end" || mode == "corner") {
						let d1 = 0, d2 = 0, d3 = 0, d4 = 0;
						if (x1 && x2) {
							d1 = d1 + (x21 - x1)*(x21 - x1);
							d2 = d2 + (x21 - x2)*(x21 - x2);
							d3 = d3 + (x22 - x1)*(x22 - x1);
							d4 = d4 + (x22 - x2)*(x22 - x2);
						} 
						if (y1 && y2) {
							d1 = d1 + (y21 - y1)*(y21 - y1);
							d2 = d2 + (y21 - y2)*(y21 - y2);
							d3 = d3 + (y22 - y1)*(y22 - y1);
							d4 = d4 + (y22 - y2)*(y22 - y2);
						} 
						if (z1 && z2) {
							d1 = d1 + (z21 - z1)*(z21 - z1);
							d2 = d2 + (z21 - z2)*(z21 - z2);
							d3 = d3 + (z22 - z1)*(z22 - z1);
							d4 = d4 + (z22 - z2)*(z22 - z2);
						}							
						d = Math.min(d1, d2, d3, d4);
					} else if (mode == "perpendicular") {
						let m1, m2, m3;
						if (x21 !== undefined && y21 !== undefined) {
							m1 = (y2 - y1)/(x2 - x1);
						}
						if (y21 !== undefined && z21 !== undefined) {
							m2 = (z2 - z1)/(y2 - y1);
						}
						if (x21 !== undefined && z21 !== undefined) {
							m3 = (x2 - x1)/(z2 - z1);
						}
						
						if (Math.abs(m1) == Infinity && !m2 && (isNaN(m3) || !m3)) {
							const d1 = isNaN(Math.abs(x1 - x21)) ? 0 : Math.abs(x1 - x21);
							const d2 = isNaN(Math.abs(z1 - z21)) ? 0 : Math.abs(z1 - z21);
							const d3 = isNaN(Math.abs(x1 - x22)) ? 0 : Math.abs(x1 - x22);
							const d4 = isNaN(Math.abs(z1 - z22)) ? 0 : Math.abs(z1 - z22);
							d = Math.min(Math.sqrt(d1*d1 + d2*d2), Math.sqrt(d3*d3 + d4*d4));
						} else if (Math.abs(m2) == Infinity && !m3 && (isNaN(m1) || !m1)) {
							const d1 = isNaN(Math.abs(y1 - y21)) ? 0 : Math.abs(y1 - y21);
							const d2 = isNaN(Math.abs(x1 - x21)) ? 0 : Math.abs(x1 - x21);
							const d3 = isNaN(Math.abs(y1 - y22)) ? 0 : Math.abs(y1 - y22);
							const d4 = isNaN(Math.abs(x1 - x22)) ? 0 : Math.abs(x1 - x22);
							d = Math.min(Math.sqrt(d1*d1 + d2*d2), Math.sqrt(d3*d3 + d4*d4));
						} else if (Math.abs(m3) == Infinity && !m1 && (isNaN(m2) || !m2)) {
							const d1 = isNaN(Math.abs(y1 - y21)) ? 0 : Math.abs(y1 - y21);
							const d2 = isNaN(Math.abs(z1 - z21)) ? 0 : Math.abs(z1 - z21);
							const d3 = isNaN(Math.abs(y1 - y22)) ? 0 : Math.abs(y1 - y22);
							const d4 = isNaN(Math.abs(z1 - z22)) ? 0 : Math.abs(z1 - z22);
							d = Math.min(Math.sqrt(d1*d1 + d2*d2), Math.sqrt(d3*d3 + d4*d4));
						} else if ((!m3 || Math.abs(m3) == Infinity) && !m2 && Math.abs(m1) > 0) {
							const A = -m1;
							const B = 1;
							const C = m1*x1 - y1;
							let d1 = Math.abs(A*x21 + B*y21 + C)/Math.sqrt(A*A + B*B);
							let d2 = Math.abs(A*x22 + B*y22 + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(z1*z21)) {
								d1 = Math.sqrt(d1*d1 + (z1 - z21)*(z1 - z21));
							}
							if (!isNaN(z1*z22)) {
								d2 = Math.sqrt(d2*d2 + (z1 - z22)*(z1 - z22));
							}
							d = Math.min(d1, d2);
						} else if ((!m1 || Math.abs(m1) == Infinity) && !m3 && Math.abs(m2) > 0) {
							const A = -m2;
							const B = 1;
							const C = m2*y1 - z1;
							let d1 = Math.abs(A*y21 + B*z21 + C)/Math.sqrt(A*A + B*B);
							let d2 = Math.abs(A*y22 + B*z22 + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(x1*x21)) {
								d1 = Math.sqrt(d1*d1 + (x1 - x21)*(x1 - x21));
							}
							if (!isNaN(x1*x22)) {
								d2 = Math.sqrt(d2*d2 + (x1 - x22)*(x1 - x22));
							}
							d = Math.min(d1, d2);
						} else if ((!m2 || Math.abs(m2) == Infinity) && !m1 && Math.abs(m3) > 0) {
							const A = -m3;
							const B = 1;
							const C = m3*z1 - x1;							
							let d1 = Math.abs(A*z21 + B*x21 + C)/Math.sqrt(A*A + B*B);
							let d2 = Math.abs(A*z22 + B*x22 + C)/Math.sqrt(A*A + B*B);
							if (!isNaN(y1*y21)) {
								d1 = Math.sqrt(d1*d1 + (y1 - y21)*(y1 - y21));
							}
							if (!isNaN(y1*y22)) {
								d2 = Math.sqrt(d2*d2 + (y1 - y22)*(y1 - y22));
							}
							d = Math.min(d1, d2);
						} else {
							const d1 = (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) + (z1 - z2)*(z1 - z2);
							const ii = (z21 - z1)*(y2 - y1) - (y21 - y1)*(z2 - z1);
							const jj = (x21 - x1)*(z2 - z1) - (z21 - z1)*(x2 - x1);
							const kk = (y21 - y1)*(x2 - x1) - (x21 - x1)*(y2 - y1);							
							const d2 = Math.sqrt(ii*ii + jj*jj + kk*kk)/Math.sqrt(d1);
							const ii2 = (z22 - z1)*(y2 - y1) - (y22 - y1)*(z2 - z1);
							const jj2 = (x22 - x1)*(z2 - z1) - (z22 - z1)*(x2 - x1);
							const kk2 = (y22 - y1)*(x2 - x1) - (x22 - x1)*(y2 - y1);
							const d3 = Math.sqrt(ii2*ii2 + jj2*jj2 + kk2*kk2)/Math.sqrt(d1);
							d = Math.min(d2, d3);
						}
						d = d*d;
					} else {
						d = 0;
						if (x1 && x2 && x21 && x22) {
							let d1 = (x21 - (x1 + x2)/2)*(x21 - (x1 + x2)/2);
							let d2 = (x22 - (x1 + x2)/2)*(x22 - (x1 + x2)/2);
							d = d + Math.min(d1, d2);
						} 
						if (y1 && y2 && y21 && y22) {
							let d1 = (y21 - (y1 + y2)/2)*(y21 - (y1 + y2)/2);
							let d2 = (y22 - (y1 + y2)/2)*(y22 - (y1 + y2)/2);
							d = d + Math.min(d1, d2);
						} 
						if (z1 && z2 && z21 && z22) {
							let d1 = (z21 - (z1 + z2)/2)*(z21 - (z1 + z2)/2);
							let d2 = (z22 - (z1 + z2)/2)*(z22 - (z1 + z2)/2);
							d = d + Math.min(d1, d2);
						}
					}
				} else if (etype3 == "AcDbPolyline" || etype == "AcDbSpline") {
					let va;
					if (etype3 == "AcDbSpline") {
						va = item.control_points;
					} else {
						va = item.vertices;
					}
					
					if (entity.type == "Closed") {
						if ((va + "") == (vb.slice(0, vb.length - 1) + "")) return;
					} else {
						if ((va + "") == (vb + "")) return;
					}						
					
					for (let i = 0; i < va.length; i++) {
						const x = va[i].x;
						const y = va[i].y;
						const z = va[i].z;
						let d0 = Infinity;
						let d1 = 0, d2 = 0;
						if (mode == "end" || mode == "corner") {								
							if (x !== undefined) {
								d1 = d1 + (x - x1)*(x - x1);
								d2 = d2 + (x - x2)*(x - x2);
							}
							if (y !== undefined) {
								d1 = d1 + (y - y1)*(y - y1);
								d2 = d2 + (y - y2)*(y - y2);
							}
							if (z !== undefined) {
								d1 = d1 + (z - z1)*(z - z1);
								d2 = d2 + (z - z2)*(z - z2);
							}
							d0 = Math.min(d1, d2);
						} else if (mode == "perpendicular") {
							let m1, m2, m3;
							if (x !== undefined && y !== undefined) {
								m1 = (y2 - y1)/(x2 - x1);
							}
							if (y !== undefined && z !== undefined) {
								m2 = (z2 - z1)/(y2 - y1);
							}
							if (x !== undefined && z !== undefined) {
								m3 = (x2 - x1)/(z2 - z1);
							}
							
							if (Math.abs(m1) == Infinity && !m2 && (isNaN(m3) || !m3)) {
								const d1 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
								const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
								d = Math.sqrt(d1*d1 + d2*d2);
							} else if (Math.abs(m2) == Infinity && !m3 && (isNaN(m1) || !m1)) {
								const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
								const d2 = isNaN(Math.abs(x1 - x)) ? 0 : Math.abs(x1 - x);
								d = Math.sqrt(d1*d1 + d2*d2);
							} else if (Math.abs(m3) == Infinity && !m1 && (isNaN(m2) || !m2)) {
								const d1 = isNaN(Math.abs(y1 - y)) ? 0 : Math.abs(y1 - y);
								const d2 = isNaN(Math.abs(z1 - z)) ? 0 : Math.abs(z1 - z);
								d = Math.sqrt(d1*d1 + d2*d2);
							} else if ((!m3 || Math.abs(m3) == Infinity) && !m2 && Math.abs(m1) > 0) {
								const A = -m1;
								const B = 1;
								const C = m1*x1 - y1;
								d = Math.abs(A*x + B*y + C)/Math.sqrt(A*A + B*B);
								if (!isNaN(z1*z)) {
									d = Math.sqrt(d*d + (z1 - z)*(z1 - z));
								}
							} else if ((!m1 || Math.abs(m1) == Infinity) && !m3 && Math.abs(m2) > 0) {
								const A = -m2;
								const B = 1;
								const C = m2*y1 - z1;
								d = Math.abs(A*y + B*z + C)/Math.sqrt(A*A + B*B);
								if (!isNaN(x1*x)) {
									d = Math.sqrt(d*d + (x1 - x)*(x1 - x));
								}
							} else if ((!m2 || Math.abs(m2) == Infinity) && !m1 && Math.abs(m3) > 0) {
								const A = -m3;
								const B = 1;
								const C = m3*z1 - x1;
								d = Math.abs(A*z + B*x + C)/Math.sqrt(A*A + B*B);
								if (!isNaN(y1*y)) {
									d = Math.sqrt(d*d + (y1 - y)*(y1 - y));
								}
							} else {
								const ii = (z - z1)*(y2 - y1) - (y - y1)*(z2 - z1);
								const jj = (x - x1)*(z2 - z1) - (z - z1)*(x2 - x1);
								const kk = (y - y1)*(x2 - x1) - (x - x1)*(y2 - y1);
								const d1 = (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) + (z1 - z2)*(z1 - z2);
								d = Math.sqrt(ii*ii + jj*jj + kk*kk)/Math.sqrt(d1);
							}
							d = d*d;
						} else {
							if (x !== undefined ) {
								d1 = d1 + (x - (x1 + x2)/2)*(x - (x1 + x2)/2);
							}
							if (y !== undefined ) {
								d1 = d1 + (y - (y1 + y2)/2)*(y - (y1 + y2)/2);
							}
							if (z !== undefined ) {
								d1 = d1 + (z - (z1 + z2)/2)*(z - (z1 + z2)/2);
							}
							d0 = d1;
						}
						if (d0 < d) {
							d = d0;
						}
					}
				}
				if (d < dmin) {
					dmin = d;
					index = i;
				}
			});
		}
		if (index > -1) {
			return filtered[index];
		} else {
			return {};
		}
	}
};
	
	

