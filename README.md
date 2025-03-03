# autocad-dxf

[![npm version](https://badge.fury.io/js/autocad-dxf.svg)](https://badge.fury.io/js/autocad-dxf)
[![npm downloads](https://img.shields.io/npm/dt/autocad-dxf.svg)](https://badge.fury.io/js/autocad-dxf)

This module is used to parse AutoCAD dxf files and to make programmatic and geometric operations on the AutoCAD drawing entities.

# Getting Started

### Installation
$ npm install autocad-dxf --save

# Usage
### Import

```import Entities from 'autocad-dxf';```
## ES6 module example

```
import Entities from 'autocad-dxf';


function fileEventListener() {  
  const [file] = document.querySelector("input[type=file]").files;
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {  
		const tolerance = 0.00001;		
		const res = new Entities(reader.result, tolerance);
		const lines = res.filter({etype: ["line"], layer: ["0"]});
		console.log(lines); 
    },
    false,
  );

  if (file) {
    reader.readAsText(file);
  }
}
```
## Node (CommonJS) example

```
const fs = require('fs');
const Entities = require("autocad-dxf");

fs.readFile('C:\\test\\example.dxf', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const tolerance = 0.00001;
  const res = new Entities(data, tolerance);
  const lines = res.filter({etype: ["line"], layer: ["0"]});
  console.log(lines);
});
```

### New updates in this version
- Coordinate system ```0-1``` is included among possible values of ```plane``` parameter to allow possibility for working with arrays in addition to JSON objects. 
- New properties: ```user_defined_dim_text_position```, ```x_end```, ```y_end```, ```z_end``` are added to aligned or rotated ```AcDbDimension```. The coordinates for both end points of aligned and rotated dimension lines can now be obtained. 
- Support for aligned and rotated dimension lines is included in ```checkif```, ```distance```, ```closest```, ```intersection```, ```connected```, ```crossing```, ```istangent``` and ```filter``` functions.

# Constructor

The constructor of the ```Entities``` class takes two parameters. 
```
const res = new Entities(data, tolerance);
```
```data``` - is a string data which is read from the dxf file. This is an optional parameter. If not provided, user defined data can be used to call the built-in functions via the ```Entities``` class object. The user defined data should be as per the custom keys defined in this module. The list of these custom keys can be accessed via the ```KEYS``` property,  
```tolerance``` - is a tolerable numerical difference between two numbers to be considered equal. This is an optional parameter. The default value is 0.0001.

### Get all parsed drawing entities

The ```entities``` property holds the parsed data in JSON format.

```
const Entities = require("autocad-dxf");
const data = "DATA_FROM_DXF_FILE";
const res = new Entities(data);
console.log(res.entities);

``` 
### Get AutoCAD document information 

The ```tables``` property holds the list of all AutoCAD file related information. It includes the list of all layers, dimension styles, text styles, line types, blocks, coordinates systems and view ports. The ```tables``` property is a json with the following keys: ```LTYPE```, ```LAYER```, ```VIEW```, ```UCS```, ```APPID```, ```DIMSTYLE```, ```BLOCK_RECORD```, ```VPORT``` and ```STYLE``` with each key having a value of an array of json data associated with the respective key. 
For instantance, the list of all AutoCAD layers can be printed in the following way.
```
const Entities = require("autocad-dxf");
const data = "DATA_FROM_DXF_FILE";
const res = new Entities(data);
console.log(res.tables.LAYER);

``` 

### Get AutoCAD block data 

The ```blocks``` property holds the list of all blocks along with their details. The ```blocks``` property is an array with json elements. Each json element contains four keys:  ```name``` (name of the block), ```layer``` (the name of the layer where the block is defined),```base_point```(a json with the x-y coordinates of the base point of the block) and ```entities``` (an array of the entities forming the block). 
For instantance, the list of all AutoCAD blocks can be printed in the following way.
```
const Entities = require("autocad-dxf");
const data = "DATA_FROM_DXF_FILE";
const res = new Entities(data);
console.log(res.blocks);

``` 
### Custom keys 

For the ease of convenience, the ```blocks```, ```entities``` and ```tables``` properties discussed above use custom keys instead of the AutoCAD dxf codes. If desired, all the custom keys used in this module can be accessed using ```KEYS``` ([link](https://github.com/Asaye/autocad-dxf/blob/main/KEYS.json)) property while the corresponding AutoCAD codes can be referred via the ```CODES``` ([link](https://github.com/Asaye/autocad-dxf/blob/main/CODES.json)) property. For ```AcDbDimensions```, there might be additional keys as described here ([link](https://github.com/Asaye/autocad-dxf/blob/main/DIMSTYLE_CODES.json)).

```
const Entities = require("autocad-dxf");
const data = "DATA_FROM_DXF_FILE";
const res = new Entities(data);
console.log(res.KEYS);  // list of all keys for all blocks, entities and tables
console.log(res.CODES); // list of all keys along with the descriptions and 
						// corresponding AutoCAD dxf codes for all blocks, 
						// entities and tables

``` 

# Functions

The following built-in functions can be called on the object of ```Entities``` class.

#### &#x1F537; triangulate(vertices :array [, plane :string]): 

This function is used to triangulate closed or closable (non-straight) and non-crossing polylines (polygons); i.e., to subdivide the polygon into a set of triangles. It takes an array of vertices of a polyline as a first parameter. Each element of the array needs to have a form of (for example in ```x-y``` plane): ```{x:123.456, y:789.012}```. 
The function returns a two-dimensional array where each internal array contains the coordinates of the three corners of a triangle. 

The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
A simple example to triangulate a square.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const polyline = {
		etype: 'LWPOLYLINE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbPolyline',
		number_of_vertices: 4,
		type: 'Closed',
		vertices: [
			{ x: -347.6186932202399, y: 1722.451518092545 },
			{ x: -247.6186932202399, y: 1722.451518092545 },
			{ x: -247.6186932202399, y: 1622.451518092544 },
			{ x: -347.6186932202399, y: 1622.451518092544 }
		]
	};
	
	const triangles = res.triangulate(polyline.vertices);
	
	console.log(triangles);  
	/* The output is: (the two triangles on each side of the diagonal)
	    [
		  [
			{ x: -347.6186932202399, y: 1722.451518092545 },
			{ x: -247.6186932202399, y: 1722.451518092545 },
			{ x: -247.6186932202399, y: 1622.451518092544 }
		  ],
		  [
			{ x: -347.6186932202399, y: 1722.451518092545 },
			{ x: -247.6186932202399, y: 1622.451518092544 },
			{ x: -347.6186932202399, y: 1622.451518092544 }
		  ]
		] 
	*/
```

#### &#x1F537; nurbs(spline :object): 

This function is used to obtain the equations of NURBS (B-Spline) for ```AcDbSpline``` of degree three. The function uses the combination of the values of ```control_points```, ```knot_values``` and ```weights``` properties to determine the equations. If the ```weights``` property is not given or if all its elements are of value 1, equations of the B-spline curves will be obtained. Along with, the length and area of the NURBS/splines for each respective interval will also be returned. The length and area of the splines are determined using 64-point Gauss-quadrature numerical integration.
 
See the example below for the type of returned data. 

### Example

```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const spline = {
		etype: 'SPLINE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbSpline',
		type: 'Planar',
		degree_of_curve: 3,
		number_of_knots: 10,
		number_of_control_points: 6,
		number_of_fit_points: 4,
		start_tangent: { x: -1, y: 0, z: 0 },
		knot_values: [
			0,
			0,
			0,
			0,
			638.3901689459577,
			1276.780337891915,
			2227.985036856916,
			2227.985036856916,
			2227.985036856916,
			2227.985036856916
		],
		control_points: [
			{ x: 4817.439144962657, y: -135.1812993643543, z: 0 },
			{ x: 4604.64242198067, y: -135.1812993643543, z: 0 },
			{ x: 4672.382692425447, y: 1016.8200288123, z: 0 },
			{ x: 4756.261548986535, y: -682.6540970671565, z: 0 },
			{ x: 5268.432815474485, y: 19.81275821550565, z: 0 },
			{ x: 5574.913243407952, y: 440.1650046279319, z: 0 }
		],
		fit_points: [
			{ x: 4817.439144962657, y: -135.1812993643543, z: 0 },
			{ x: 4667.464634920965, y: 485.3423940951325, z: 0 },
			{ x: 4817.439144962657, y: -135.1812993643543, z: 0 },
			{ x: 5574.913243407952, y: 440.1650046279319, z: 0 }
		]
	};
	
	const spline_data = res.nurbs(spline);
	
	console.log(spline_data); 
	
``` 
The output for this example can be found [here](https://github.com/Asaye/autocad-dxf/blob/main/spline_output.json).

#### &#x1F537; checkif(entity1 :object, criteria :string, entity2 :object [, plane :string]): 

This function is used to check if ```entity1``` fulfils a ```criteria``` with respect to ```entity2```. The ```criteria``` parameter can be one of ```inside```, ```outside```, ```on```, ```parallel```, ```orthogonal```, ```aligned```, ```delaunay``` or ```convex```. 
The applicable combinations of ```criteria```, ```entity1``` and ```entity2``` are given below. In all cobinations, wherever ```entity1``` or ```entity2```  is ```AcDbPoint``` (point), a shorthand array form of ```[x, y]``` (based on the used ```plane``` as described below) can be passed as an entity. 
In addition, an aligned or rotated dimension ```AcDbDimension``` (with ```specific_type``` of ```AcDbRotatedDimension``` or ```AcDbAlignedDimension```) will have the same functionality as  ```AcDbLine``` (line) where are the rest types of dimension lines will have the same functionality as  ```AcDbPoint``` (point). 



<table>
    <tr><td><a name="checkif"><code>criteria</code></a></td><td><code>etype1</code></td><td><code>etype2</code></td><td style="font-weight: 700">Remark</td></tr>
    <tr><td rowspan="4">inside/outside</td><td>point</td><td>line</td></tr>
	<tr><td>point/ text/ mtext/ line/ polyline/ circle/ arc</td><td>circle</td><td rowspan="3"><ul><li><small>An entity is considered to be inside/outside another entity if its whole part (except its end points which can be on the edges of the other entity) is inside/outside the other entity</small></li><li><small>For text, mtext and dimension line, only the alignment point is considered. The whole text/dimension line might not be inside/outside.</small></li></ul></td></tr>
	<tr><td>point/ text/ mtext/ line/ polyline/ circle/ arc/ ellipse</td><td>polyline</td></tr>  
	<tr><td>point/ text/ mtext/ line/ polyline</td><td>ellipse</td></tr>  
	<tr><td>on</td><td>point/text/mtext</td><td>point/ text/ mtext/ line/ circle/ arc/ ellipse/ spline</td><td><ul><li><small>points at the end points of splines are not considered to be inside</small></li></ul></td></tr>
	<tr><td rowspan="3">aligned</td><td>line</td><td>line</td></tr>
	<tr><td>circle/arc</td><td>circle/arc</td></tr>
	<tr><td>ellipse</td><td>ellipse</td></tr>
	<tr><td rowspan="2">orthogonal</td><td>line</td><td>line</td><td rowspan="2"><ul><li><small>Circles are considered to be orthogonal if their tangents at any of their intersection points are orthogonal.</small></li></ul></tr>
	<tr><td>circle/arc</td><td>circle/arc</td></tr>
	<tr><td rowspan="2">parallel</td><td>line</td><td>line</td><td rowspan="2"><ul><li><small>Polylines are considered to be parallel if all the corresponding sides are parallel and equidistant.</small></li></ul></tr>
	<tr><td>polyline</td><td>polyline</td></tr>	
	<tr><td>delaunay</td><td>triangle</td><td>point</td><td><ul><li><small>Checks if a triangle is delaunay with respect to a point. If the point is on the circum circle, the triangle is condiered to be delaunay. The triangle can be a polyline or a 2D array of corner coordinates ([[x1, y1], [x2, y2], [x3, y3]]).</small></li></ul></td></tr>
	<tr><td>convex</td><td>line</td><td>line</td><td><ul><li><small>Checks if two lines form a convex angle in counter clockwise direction. The lines can be two AcDbLine entities (which are connected at their ends) or 2D arrays of coordinates with a form of: [[x1, y1], [x0, y0]] for line1 and [[x0, y0], [x2, y2]] for line2.</small></li></ul></td></tr>
</table>

The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.


### Example
Check if a triangle is delaunay with respect to a certain point.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const triangle = {
		etype: 'LWPOLYLINE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbPolyline',
		number_of_vertices: 3,
		type: 'Closed',
		vertices: [
			{ x: 2997.987220935407, y: -362.2797956561553 },
			{ x: 2596.796797459803, y: -565.77617919932 },
			{ x: 2973.625046924248, y: -811.4690859126474 }
		]
	};
	const point = {
		etype: 'POINT',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbPoint',
		x: 3099.756850711536,
		y: -604.7810938548646,
		z: 0
	};
	const isDelaunay = res.checkif(triangle, "delaunay", point);
	
	console.log(isDelaunay);
	// output: false
```

#### &#x1F537; circumcircle(point1 :object, point2 :object, point3 :object [, plane :string]): 

This function is used to obtain a circumcircle which passes through ```point1```, ```point2``` and ```point3```. The ```point1```, ```point2``` and ```point3``` can be AcDbPoint entities or arrays of coordinates (as ```[x, y]```). If the points are collinear and a circle cannot be obtained, ```undefined``` is returned.
The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.


### Example
Get the a circum circle containing three points.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const p1 = [100.234, 100.567];
	const p2 = [150.123, 200.908];
	const p3 = [250.602, 126.099];

	const circle = res.circumcircle(p1, p2, p3);
	
	console.log(circle);
	// output: { radius: 77.49256897724132, x: 173.11361671171952, y: 126.90442042504074 }
```

#### &#x1F537; area(entity :object [, plane :string]): 

This function is used to calculate the area of ```polylines```, ```circles```, ```arcs```, ```splines```, ```ellipses``` and elliptical arcs. 
The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.


### Example
Get the area of a circular arc.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const arc = {
		  etype: 'ARC',
		  line_type: 'ByLayer',
		  color: 'ByLayer',
		  layer: 'Layer1',
		  subclass: 'AcDbCircle',
		  x: 3645.17968042402,
		  y: -390.706985299347,
		  z: 0,
		  radius: 222.3692867624095,		  
		  specific_type: 'AcDbArc',
		  start_angle: 98.67744913656281,
		  end_angle: 285.3692815173683
	};

	const area = res.area(arc);
	
	console.log(area);
	// output: { area: 83441.5993081676, area_sector: 80560.52660686847 }
```

#### &#x1F537; length(entity :object [, plane :string]): 

This function is used to determine the length of an entity as described below. 
+ If ```entity``` is a line/circle/arc/spline, the length/circumference/arc length of the line/circle/arc/spline will be returned.
+ If ```entity``` is a polyline, the sum of the lengths of each sides of the polyline will be returned.
+ If ```entity``` is a full ellipse, an approximate circumference of the ellipse using Ramanujan's second formula will be returned.

The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Get the circumference of a circle.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	
	const circle = {
		etype: 'CIRCLE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbCircle',
		x: 493.8669949609207,
		y: 505.568641983396,
		z: 0,
		radius: 165.089285258525
	};
	const length = res.length(circle);
	
	console.log(length);  // prints 1037.2865715091436
```

#### &#x1F537; distance(entity1 :object, entity2 :object [, plane :string]): 

This function is used to determine the shortest distance between two entities: ```entity1``` and ```entity2``` as described below. Both or one of these entities can be a one-dimensional array with a format of: ```[x, y]```.
+ If both  ```entity1``` and ```entity2``` are points (```AcDbPoint```) or texts(```AcDbText/AcDbMText```) or vertices(```AcDbVertex```) or arrays  or any combination of these, the distance between the two points will be returned.
+ If both  ```entity1``` and ```entity2``` are circles or arcs or ellipses or any combination of these, the distance between the centers will be returned.
+ If either  ```entity1``` or ```entity2``` is a array/point/circle/text/vertex/ellipse and the other parameter is a line or aligned or rotated dimension line, the perpendicular distance between the point/center to (extension of) the line/dimension line will be returned.
+ If either  ```entity1``` or ```entity2``` is a array/point/circle/text/vertex/ellipse and the other parameter is a polyline, the perpendicular distance between the point/center to (extension of) the closest edge will be returned.
+ If both  ```entity1``` or ```entity2``` are lines or aligned or rotated dimension lines which are parallel, the perpendicular distance between (extensions of) the lines will be returned. If the lines are not parallel, ```undefined``` is returned.
+ If the passed parameters are none of the above combinations, ```undefined``` is returned.

The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Get the closest distance between a circle and a line.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const line = {
		etype: 'LINE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbLine',
		start_x: 76.48716497852402,
		start_y: -120.4229218048302,
		start_z: 0,
		end_x: 888.3252621940712,
		end_y: -29.22024472584008,
		end_z: 0
	};
	const circle = {
		etype: 'CIRCLE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbCircle',
		x: 493.8669949609207,
		y: 505.568641983396,
		z: 0,
		radius: 165.089285258525
	};
	const distance = res.distance(line, circle);
	
	console.log(distance);  // prints 575.4826584729997
```

#### &#x1F537; closest(entity :object, [etype :array], [mode :string], [list :array]): 

This function is used to obtain the closest entity to a given ```entity``` which is passed as the first parameter. It is applicable for points (```AcDbPoint```), circles(```AcDbCircle```), ellipses (```AcDbEllipse```), texts (```AcDbText``` or ```AcDbMText```), aligned or rotated dimension lines (```AcDbDimension``` with ```AcDbAlignedDimension``` or ```AcDbRotatedDimension```), lines (```AcDbLine```), polylines (```AcDbPolyline```) and splines [where control points are used] (```AcDbSpline```).
The optional second parameter, ```etype```, is an array parameter which can be used to specify the list of possible types of entities which need to be considered while obtaining the closest entity. The possible values for the elements of ```etype``` array are: <code>point</code>, <code>line</code>, <code>mline</code>, <code>circle</code>, <code>polyline</code>, <code>dimension</code>, <code>text</code>, <code>mtext</code>, <code>spline</code>, <code>ellipse</code>, <code>arc</code>. If this parameter is not provided, any type of entity which is closest to the given ```entity``` parameter will be returned. 
The optional third parameter is used to define the mode of distance calculation for the determination of the closest entity. The possible values are:
+ ```center``` - (default value) - to determine the closest entity based on distances from a center point, (for lines, splines and polylines, end points or corner points to the center of the given entity will be determined)
+ ```end``` - to determine the closest entity based on distances from end point/s, 
+ ```corner``` - to determine the closest entity based on distances from corner points and 
+ ```perpendicular``` - to determine the closest entity based on perpendicular distances  (for lines, splines and polylines, end points or corner points to the given entity in terms of perpendicular distance will be determined)
 
The optional fourth parameter is used to define the set of entities from which the closest entity is sought from. It should be an array of entities. If not given, the ```entities``` property ( which contains the list of entities collected from the dxf text) of the object of ```Entities``` class will be used. 

### Example
Get the closest all types of texts to one of the ends of a given line (say the line is the first element of ```entities``` array).
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const line = res.entities[0];
	
	const closest = res.closest(line, ["text", "mtext"], "end");
	
	console.log(closest);  
```


#### &#x1F537; intersection(entity1 :object, entity2 :object [, plane :string]): 

This function is used to determine the intersection point/s of two entities: ```entity1``` and ```entity2```. The return type is an array of intersection points with each element of the form ```{x: 123.45, y: 678.90}```. If there is no intersection point, an empty array will be returned. The ```entity1``` and ```entity2``` parameters can be a combination of (both ways): 
+ ```line``` and ```line/dimension/polyline/circle/arc/ellipse```.
+ ```circle/arc``` and ```dimension/polyline/circle/arc```.

PS: For ```dimension```, only aligned or rotated dimension lines with ```specific_type``` of ```AcDbRotatedDimension```  or ```AcDbAlignedDimension``` are applicable.

The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Get the intersection points of a circle and a line.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const line = {
		etype: 'LINE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbLine',
		start_x: 13.51291280096347,
		start_y: 440.1406350864196,
		start_z: 0,
		end_x: 825.3510100165108,
		end_y: 531.3433121654098,
		end_z: 0
	};
	const circle = {
		etype: 'CIRCLE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbCircle',
		x: 493.8669949609207,
		y: 505.568641983396,
		z: 0,
		radius: 165.089285258525
	};
	const intersection = res.intersection(line, circle);
	
	console.log(intersection);  
	/* The output is: (giving the two intersection points)
	    [
           { x: 658.8050488328336, y: 512.6333777970402 },
           { x: 331.47271794408545, y: 475.8605471378831 }
        ] 
	*/
```

#### &#x1F537; connected(entity :object [, plane :string]): 

This function is used to obtain all the entities which are forming a chain with a given ```entity``` which is passed as the first parameter. Only end point to end point connections are considered and if multiple branches exist, only one arbitrary direction is followed to get the concatenated entities. The return type is an object with two keys: ```left``` and ```right``` where the associated values are one-dimensional arrays of entities which are connected (exclusive) to the given entity on the left and right sides respectively. The function is applicable for lines, aligned or rotated dimension lines, open polylines, arcs and open ellipses.  

The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Get the all the elements which are connected to the first element of ```entities```.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);	
	const connected = res.connected(res.entities[0]);
	
	console.log(connected);  
	
	/* The output is of the form:	    
            { 
				"left": [list of entities or empty array], 
				"right": [list of entities or empty array] 
			}
	*/
```

#### &#x1F537; crossing(entity :object [, etype :array, plane :string]): 

This function is used to obtain all the entities which cross a given ```entity``` (passed as the first parameter). This function is applicable for lines, aligned or rotated dimension lines, circles, arcs and polylines and the optional second parameter, ```etype```, (with array data type) is used to specify the desired types of crossing entities among these. The possible values for the elements of the array are: <code>line</code>, <code>dimension</code>, <code>polyline</code>, <code>circle</code>, and <code>arc</code>. If not given, all these four entity types will be considered. For ```dimension```, only aligned or rotated dimension lines with ```specific_type``` of ```AcDbRotatedDimension```  or ```AcDbAlignedDimension``` are applicable.

The function returns an array of entities which cross the given entity.

The optional third parameter <code>plane</code> specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Get the all lines and circles which are crossing the to the first element of ```entities```.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);	
	const crossing = res.crossing(res.entities[0], ["line", "circle"]);
	
	console.log(crossing);
```

#### &#x1F537; istangent(line: object, circle :object [, plane :string]): 

This function is used to check if a ```line``` (provided as the first parameter) is tangent to a ```circle``` (provided as the second parameter). The ```line``` parameter can also be an aligned or rotated dimension line. The function returns ```true``` if the ```line``` is tangent to the ```circle``` or ```false``` otherwise.

The optional third parameter <code>plane</code> specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Check if a line object is tangent to a circle.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);	
	const line = {
		etype: 'LINE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbLine',
		start_x: 1108.068045643199,
		start_y: -123.0727371516945,
		start_z: 0,
		end_x: 1486.826993488496,
		end_y: 20.28428544742638,
		end_z: 0,
		length: 404.98095819601366
	};
	const circle = {
		etype: 'CIRCLE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbCircle',
		x: 1343.469968505544,
		y: 399.0432280054415,
		z: 0,
		radius: 404.9809540949161,
		area: 515251.2702195186,
		circumference: 2544.5703804567474
	};
	const istangent = res.istangent(line, circle);
	
	console.log(istangent);   // returns true
```

#### &#x1F537; tangent(circle: object, point: array [, plane :string]): 

This function is used to obtain the possible points of tangency on a ```circle``` (provided as the first parameter) for lines which start from or pass through a ```point``` (provided as the second parameter). The ```point``` parameter is an array of the two coordinates of the```point``` as specified by the third parameter (```plane```). See below for details. For example, a ```point``` value of ```[123.00, 456.00]``` without specifying the third coordinate means the point from where we want to generate the tangen has an x-coordinate of 123.00 and y-coordinate of 456.00.

The function returns an array of coordinate objects for the points of tangency along with the angle of the line connecting the circle center and the point of tangency from the + x-axis (in radians).

The optional third parameter <code>plane</code> specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Get the two points of tangency for lines which pass through a given point.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);	
	const circle = {
		etype: 'CIRCLE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbCircle',
		x: 1343.469968505544,
		y: 399.0432280054415,
		z: 0,
		radius: 404.9809540949161,
		area: 515251.2702195186,
		circumference: 2544.5703804567474
	};
	
	const tp = res.tangent(circle, [1343.469968505544, 1051.487343584355]);
	console.log(tp);
	
	/* output:
	[
		{
			x: 1660.9901692001076,
			y: 650.4204253215717,
			angle: 0.669652572129677
		},
		{
			x: 1025.9497678109806,
			y: 650.4204253215717,
			angle: 2.471940081460116
		}
	]
	*/
```

#### &#x1F537; tangent(circle: object, angle: number, length: number [, plane :string]): 

This function is used to obtain the tangent lines of a specified ```length``` to a ```circle``` from a point of tangency forming an ```angle``` (in radians) from the + x-axis.

The function returns an array of line objects (with ```start_x```, ```start_y```, ```start_z```, ```end_x```, ```end_y```, ```end_z``` as keys) representing the tangents.

The optional fourth parameter <code>plane</code> specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Get the tangents with a length of 100 from a point of tangency which makes a given angle from + x-axis.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);	
	const circle = {
		etype: 'CIRCLE',
		line_type: 'ByLayer',
		color: 'ByLayer',
		layer: 'Layer1',
		subclass: 'AcDbCircle',
		x: 1343.469968505544,
		y: 399.0432280054415,
		z: 0,
		radius: 404.9809540949161,
		area: 515251.2702195186,
		circumference: 2544.5703804567474
	};
	
	const tangents = res.tangent(circle, 0.669652572129677, 100);
	console.log(tangents);
	
	/* output:
		[
			{
				start_x: 1660.9901692001076,
				start_y: 650.4204253215717,
				end_x: 1723.0615320072616,
				end_y: 572.0166886806273
			},
			{
				start_x: 1660.9901692001076,
				start_y: 650.4204253215717,
				end_x: 1598.9188063929537,
				end_y: 728.824161962516
			}
		]	
	*/
```

#### &#x1F537; getCorners(entity :object [, plane :string]): 

This function is used to determine the coordinates of corner points (vertices with bends) of a polyline. Only polylines (<code>AcDbPolyline</code>) are supported. Hence, the passed parameter has to be a custom polyline object or a polyline element from the <code>entities</code> property of ```Entities``` class object. The function returns an array of corner points or <code>null</code> if the passed entity object is not supported. 
The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.


### Example
Get corners of a custom polyline
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const polygon = {
		etype: "LWPOLYLINE",
		subclass: "AcDbPolyline",
		number_of_vertices: 7,
		type: "Closed",
		vertices: [{ x: 1099.271933374087, y: 341.0072904353435 },
		   { x: 1103.241801372366, y: 154.6366036367878 },
           { x: 1331.509237026766, y: 122.9139333484436 },
           { x: 1506.18344898143, y: 396.5219634399462 },
           { x: 1597.76655981698, y: 539.9768802531387 },
           { x: 1444.650486423653, y: 539.9768802531387 },
           { x: 1200.503578776138, y: 539.9768802531387 }]		
	};

	const corners = res.getCorners(polygon);
	
	console.log(corners);
	/* returns 
		[
			{ x: 1099.271933374087, y: 341.0072904353435 },
			{ x: 1103.241801372366, y: 154.6366036367878 },
			{ x: 1331.509237026766, y: 122.9139333484436 },
			{ x: 1597.76655981698, y: 539.9768802531387 },
			{ x: 1200.503578776138, y: 539.9768802531387 }
		]
	*/
```

#### &#x1F537; checkConcentric(entity1 :object, entity2 :object [, plane :string]): 
This function is used to check if two circle objects ```entity1``` and ```entity2``` are concentric. 
The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Check if the first and the second elements of the ```entities``` property of the object of ```Entities``` class are concentric circles.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const areConcentric = res.checkConcentric(res.entities[0], res.entities[1]);
	
	console.log(areConcentric);
```
#### &#x1F537; checkEccentric(entity1 :object, entity2 :object [, plane :string]): 

This function is used to check if two circle objects ```entity1``` and ```entity2``` are eccentric. 
The optional <code>plane</code> parameter specifies the applicable plane. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Check if the first and the second elements of the ```entities``` property of the object of ```Entities``` class are eccentric circles.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const areEccentric = res.checkEccentric(res.entities[0], res.entities[1]);
	
	console.log(areEccentric);
```

#### &#x1F537; filter(criteria :object [, entities :Array, plane :string]): 

This function is used to filter entities based on a certain criteria. An array of entities can be those which are read from the DXF file or provided as a second parameter. It returns an array of filtered entities. 

The <code>criteria</code> parameter has the following properties

Property | Type | Description
------ | ----- |  ---------
[etype] | array | The set of entity types to be filtered. The possible values for the elements of the array are: <code>line</code>,<code>mline</code>,<code>circle</code>,<code>polyline</code>,<code>dimension</code>,<code>text</code>,<code>mtext</code>,<code>spline</code>,<code>ellipse</code>,<code>arc</code>. If not given, all entity types are considered.
[layer] | array | An array of strings (layer names) to filter from.
[color] | string/number | A string (```ByBlock``` or ```ByLayer```) or a number from 0 to 256 representing AutoCAD color number.
[visibility] | string | A string (```visible``` or ```invisible```).
[line_type] | string | A string representing the line type.(```ByLayer```, ```ByBlock``` or other)
[text] | object | An object which is used to filter texts. It has ```equals```, ```notequals```, ```starts```, ```notstarts```, ```ends```, ```notends```, ```contains```, ```notcontains```,```regex```,```height```,```style```, ```rotation```, ```operator``` and ```i``` keys. The ```equals```, ```starts```,```ends```, ```contains``` and ```notcontains``` keys take string value where: ```equals``` filters texts equal to the given text. ```starts``` filters texts which start with the given text. ```ends``` filters texts which end with the given text. ```contains``` filters texts which contain the given text. The ```notequals```, ```notstarts```, ```notends``` and ```notcontains``` are the corresponding negations. If these properties are provided at the same time, the ```operator``` property is used to specify which logical operator (<code>&&</code> or <code>\|\|</code>) to use while combining the filters. If the value of ```operator``` property is ```or``` or <code>\|\|</code>, the ```OR``` logical operator is used otherwise the ```AND``` logical operator will be used. The case sensitivity of the filters can be set using the ```i``` property which takes a boolean value. If not given or ``` i: false ``` specifies that the filtering is case sensitive. Alternatively, a regular expression (literal or ```RegExp``` class object) can be passed for filtering using the ```regex``` property. The ```height``` and ```rotation``` properties take numbers representing the height and rotation (in degrees) of the text respectively. The ```style``` property takes a string representing the style of the text.
[between] | object | The bounding coordinates of the entities to be filtered. It has six optional properies: <code>xmin</code>,<code>xmax</code>, <code>ymin</code>,<code>ymax</code>,<code>zmin</code> and <code>zmax</code>. The default value for <code>xmin</code>, <code>ymin</code> and <code>zmin</code> is <code>-Infinity</code>. The default value for <code>xmax</code>, <code>ymax</code> and <code>zmax</code> is <code>Infinity</code>.
[radius] | number | A radius value, if the <code>etype</code> propery contains <code>circle</code> or <code>arc</code>.
[arc] | object | The degree of the arc and the unit of the arc angle if the <code>etype</code> propery contains <code>arc</code>. It contains two properties <code>angle</code> which is a number representing the arc angle and <code>unit</code> which is a string which can be either <code>radians</code> or <code>degrees</code>.
[nsides] | object | A comparison for the number of sides of the entities to be filtered. It contains two properties <code>value</code> and <code>comparison</code>. The <code>value</code> property contains the numerical value of the number of sides to compare and its default value is 1. Whereas <code>comparison</code> is a string which can be one of <code>eq</code> for equal to, <code>gt</code> for greater than, <code>gte</code> for greater than or equal to (default value), <code>lt</code> for less than, <code>lte</code> for less than, <code>ne</code> for not equal to. This property is applicable for polygons (<code>AcDbPolyline</code>) only.
[where] | array | A list of criteria in reference to other entities. Each element of the array should be a JSON object with two properties: ```condition``` and ```reference```. The value of the ```condition``` property can be one of: ```inside```, ```outside```, ```on```, ```parallel```, ```orthogonal```, ```aligned```, ```delaunay``` or ```convex```. Whereas, the ```reference``` property should be an entity object. Note that not all entity types are supported. The supported entities are the same as those described in [<code>checkif</code>](#checkif)  function. If there are more than one element in the ```where``` array,```AND``` (logical operator) is used to join the multiple criteria.

The optional <code>entities</code> parameter can be part or the whole of ```entities``` property or a custom made list of entities (json) with keys from this [list](https://github.com/Asaye/autocad-dxf/blob/main/KEYS.json).
The optional <code>plane</code> parameter specifies on which plane that the filterning will be performed and it is applicable when ```nsides``` property is defined. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Filter lines and texts on layers 'dims' and 'titles' and which are inside a circle (say the circle is the first element of ```entities``` array.)
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const filtered = res.filter({
		etype: ["line", "text"], 
		layer: ["dims", "texts"],
		where: [{condition: "inside", reference: res.entities[0]}]
	});
	
	console.log(filtered);
```

### Example
Filter all texts which contain the string "2nd" OR which end with the string "floor" (case insensitive);
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const filtered = res.filter({
		text: {contains: "2nd", ends: "floor", operator: "or", i: true}
	});
	
	console.log(filtered);
```




## Issues or suggestions?
If you have any issues or want to suggest something , your can write it [here](https://github.com/Asaye/autocad-dxf/issues).
