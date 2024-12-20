const checkPointInside = (vert, x, y, ax1, ax2) => {
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
		
		if ((Math.abs(x - x1) < 0.000001 && Math.abs(y - y1) < 0.000001) || 
		    (Math.abs(x - x2) < 0.000001 && Math.abs(y - y2) < 0.000001)) {
			return true;	
		}
		
		if (Math.abs(x1 - xofy) < this.tolerance && Math.abs(y1 - yofx) < this.tolerance) {
			continue;
		}
		
		m = (y1 - y0)/(x1 - x0);
		if (Math.abs(m) == Infinity) {
			if ((y - y0)*(y - y1) < 0.000001 && Math.abs(x - x0) < 0.000001) {
				return true;
			}
		} else {
			if ((x - x0)*(x - x1) < 0.000001 && (y - y0)*(y - y1) < 0.000001 && Math.abs(y - (m*x + y0 - m*x0)) < 0.000001) {
				return true;
			}
		}
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
module.exports = checkPointInside;
		

