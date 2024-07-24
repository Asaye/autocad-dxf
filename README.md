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
## Front-end example

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
## Back-end example

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
- New entities (```AcDbTable```, ```AcDbRevolvedSurface```, ```AcDbLoftedSurface```, ```AcDbSweptSurface``` and ```AcDbExtrudedSurface```) are added.
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

For the ease of convenience, the ```blocks```, ```entities``` and ```tables``` properties discussed above use custom keys instead of the AutoCAD dxf codes. If desired, all the custom keys used in this module can be accessed using ```KEYS``` ([link](https://github.com/Asaye/autocad-dxf/blob/main/KEYS.json)) property while the corresponding AutoCAD codes can be referred via the ```CODES``` ([link](https://github.com/Asaye/autocad-dxf/blob/main/CODES.json)) property.
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

#### &#x1F537; filter(criteria :object [, entities :Array, plane :string]): 

This function is used to filter entities based on a certain criteria. An array of entities can be those which are read from the DXF file or provided as a second parameter. It returns an array of filtered entities. 

The <code>criteria</code> parameter has the following properties

Property | Type | Description
------ | ----- |  ---------
[etype] | array | The set of entity types to be filtered. The possible values for the elements of the array are: <code>line</code>,<code>mline</code>,<code>circle</code>,<code>polyline</code>,<code>dimension</code>,<code>text</code>,<code>mtext</code>,<code>spline</code>,<code>ellipse</code>,<code>arc</code>. If not given, all entity types are considered.
[layer] | array | An array of strings (layer names) to filter from.
[color] | string/number | A string (```ByBlock``` or ```ByLayer```) or a number from 0 to 256 representing AutoCAD color number.
[visibility] | string | A string (```visible``` or ```invisible```).
[line_type] | string | A string representing the line type.
[text] | object | An object which is used to filter texts. It has ```equals```, ```notequals```, ```starts```, ```notstarts```, ```ends```, ```notends```, ```contains```, ```notcontains```,```regex```,```height```,```style```, ```rotation```, ```operator``` and ```i``` keys. The ```equals```, ```starts```,```ends```, ```contains``` and ```notcontains``` keys take string value where: ```equals``` filters texts equal to the given text. ```starts``` filters texts which start with the given text. ```ends``` filters texts which end with the given text. ```contains``` filters texts which contain the given text. The ```notequals```, ```notstarts```, ```notends``` and ```notcontains``` are the corresponding negations. If these properties are provided at the same time, the ```operator``` property is used to specify which logical operator (<code>&&</code> or <code>\|\|</code>) to use while combining the filters. If the value of ```operator``` property is ```or``` or <code>\|\|</code>, the ```OR``` logical operator is used otherwise the ```AND``` logical operator will be used. The case sensitivity of the filters can be set using the ```i``` property which takes a boolean value. If not given or ``` i: false ``` specifies that the filtering is case sensitive. Alternatively, a regular expression (literal or ```RegExp``` class object) can be passed for filtering using the ```regex``` property. The ```height``` and ```rotation``` properties take numbers representing the height and rotation (in degrees) of the text respectively. The ```style``` property takes a string representing the style of the text.
[between] | object | The bounding coordinates of the entities to be filtered. It has six optional properies: <code>xmin</code>,<code>xmax</code>, <code>ymin</code>,<code>ymax</code>,<code>zmin</code> and <code>zmax</code>. The default value for <code>xmin</code>, <code>ymin</code> and <code>zmin</code> is <code>-Infinity</code>. The default value for <code>xmax</code>, <code>ymax</code> and <code>zmax</code> is <code>Infinity</code>.
[radius] | number | A radius value, if the <code>etype</code> propery contains <code>circle</code> or <code>arc</code>.
[arc] | object | The degree of the arc and the unit of the arc angle if the <code>etype</code> propery contains <code>arc</code>. It contains two properties <code>angle</code> which is a number representing the arc angle and <code>unit</code> which is a string which can be either <code>radians</code> or <code>degrees</code>.
[nsides] | object | A comparison for the number of sides of the entities to be filtered. It contains two properties <code>value</code> and <code>comparison</code>. The <code>value</code> property contains the numerical value of the number of sides to compare and its default value is 1. Whereas <code>comparison</code> is a string which can be one of <code>eq</code> for equal to, <code>gt</code> for greater than, <code>gte</code> for greater than or equal to (default value), <code>lt</code> for less than, <code>lte</code> for less than, <code>ne</code> for not equal to. This property is applicable for polygons (<code>AcDbPolyline</code>) only.

The optional <code>entities</code> parameter can be part or the whole of ```entities``` property or a custom made list of entities (json) with keys from this [list](https://github.com/Asaye/autocad-dxf/blob/main/KEYS.json).
The optional <code>plane</code> parameter specifies on which plane that the filterning will be performed and it is applicable when ```nsides``` property is defined. Its possible values are ```x-y``` (or ```y-x```), ```y-z```(or ```z-y```), and ```x-z```(or ```z-x```). If not given, ```x-y``` will be used.

### Example
Filter lines and texts on layers 'dims' and 'titles';
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const filtered = res.filter({
		etype: ["line", "text"], 
		layer: ["dims", "texts"]
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

#### &#x1F537; distance(entity1 :object, entity2 :object [, plane :string]): 

This function is used to determine the shortest distance between two entities: ```entity1``` and ```entity2``` as described below. Both or one of these entities can be a one-dimensional array with a format of: ```[x, y]```.
+ If both  ```entity1``` and ```entity2``` are points (```AcDbPoint```) or texts(```AcDbText/AcDbMText```) or vertices(```AcDbVertex```) or arrays  or any combination of these, the distance between the two points will be returned.
+ If both  ```entity1``` and ```entity2``` are circles or arcs or ellipses or any combination of these, the distance between the centers will be returned.
+ If either  ```entity1``` or ```entity2``` is a array/point/circle/text/vertex/ellipse and the other parameter is a line, the perpendicular distance between the point/center to (extension of) the line will be returned.
+ If either  ```entity1``` or ```entity2``` is a array/point/circle/text/vertex/ellipse and the other parameter is a polyline, the perpendicular distance between the point/center to (extension of) the closest edge will be returned.
+ If both  ```entity1``` or ```entity2``` are lines which are parallel, the perpendicular distance between (extensions of) the lines will be returned. If the lines are not parallel, ```undefined``` is returned.
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

#### &#x1F537; length(entity :object [, plane :string]): 

This function is used to determine the length of an entity as described below. 
+ If ```entity``` is a line/circle/arc, the length/circumference/arc length of the line/circle/arc will be returned.
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

#### &#x1F537; intersection(entity1 :object, entity2 :object [, plane :string]): 

This function is used to determine the intersection point/s of two entities: ```entity1``` and ```entity2```. The return type is an array of intersection points with each element of the form ```{x: x_value, y: y_value}```. If there is no intersection point, an empty array will be returned. The ```entity1``` and ```entity2``` parameters can be a combination of (both ways): 
+ ```line``` and ```line/polyline/circle/arc/ellipse```.
+ ```circle/arc``` and ```polyline/circle/arc```.

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

#### &#x1F537; closest(entity :object, [etype :array], [mode :string], [list :array]): 

This function is used to obtain the closest entity to a given ```entity``` which is passed as the first parameter. It is applicable for points (```AcDbPoint```), circles(```AcDbCircle```), ellipses (```AcDbEllipse```), texts (```AcDbText``` or ```AcDbMText```), dimension lines (```AcDbDimension```), lines (```AcDbLine```), polylines (```AcDbPolyline```) and splines [where control points are used] (```AcDbSpline```).
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


## Issues or suggestions?
If you have any issues or want to suggest something , your can write it [here](https://github.com/Asaye/autocad-dxf/issues).
