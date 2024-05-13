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

- [KEYS](https://github.com/Asaye/autocad-dxf/KEYS.json) and [CODES](https://github.com/Asaye/autocad-dxf/CODES.json) properties are added. These properties also have accessible JSON files with descriptions and AutoCAD dxf codes for each key used in ```tables```, ```blocks``` and ```entities``` variables discussed below.
- More properties are added to ```DIMSTYLE``` property in ```tables```.

# Constructor

The constructor of the ```Entities``` class takes two parameters. 
```
const res = new Entities(data, tolerance);
```
```data``` - is a string data which is read from the dxf file. This is an optional parameter. If not provided, user defined data can be used to call the built-in functions via the ```Entities``` class object. The user defined data should be as per the custom keys defined in this module. The list of these custom keys can be accessed via the ```KEYS``` property,  
```tolerance``` - is a tolerable numerical difference between two numbers to be considered equal. This is an optional parameter. The default value is 0.0001.

### Get all parsed data

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

For the ease of convenience, the ```blocks```, ```entities``` and ```tables``` properties discussed above use custom keys instead of the AutoCAD dxf codes. If desired, all the custom keys used in this module can be accessed using ```KEYS``` property while the corresponding AutoCAD codes can be referred via the ```CODES``` property.
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

#### &#x1F537; filter(criteria :object [, entities :Array]): 

This function is used to filter entities based on a certain criteria. An array of entities can be those which are read from the DXF file or provided as a second parameter. It returns an array of filtered entities. 

The <code>criteria</code> parameter has the following properties

Property | Type | Description
------ | ----- |  ---------
[etype] | array | The set of entity types to be filtered. The possible values for the elements of the array are: <code>line</code>,<code>mline</code>,<code>circle</code>,<code>polyline</code>,<code>dimension</code>,<code>text</code>,<code>mtext</code>,<code>spline</code>,<code>ellipse</code>,<code>arc</code>. If not given, all entity types are considered.
[layer] | array | An array of strings (layer names) to filter from.
[between] | object | The bounding coordinates of the entities to be filtered. It has four optional properies: <code>xmin</code>,<code>xmax</code>, <code>ymin</code> and <code>ymax</code>. The default value for <code>xmin</code> and <code>ymin</code> is <code>-Infinity</code>. The default value for <code>xmax</code> and <code>ymax</code> is <code>Infinity</code>.
[radius] | number | A radius value, if the <code>etype</code> propery contains <code>circle</code> or <code>arc</code>.
[arc] | object | The degree of the arc and the unit of the arc angle if the <code>etype</code> propery contains <code>arc</code>. It contains two properties <code>angle</code> which is a number representing the arc angle and <code>unit</code> which is a string which can be either <code>radians</code> or <code>degrees</code>.
[nsides] | object | A comparison for the number of sides of the entities to be filtered. It contains two properties <code>value</code> and <code>comparison</code>. The <code>value</code> property contains the numerical value of the number of sides to compare and its default value is 1. Whereas <code>comparison</code> is a string which can be one of <code>eq</code> for equal to, <code>gt</code> for greater than, <code>gte</code> for greater than or equal to (default value), <code>lt</code> for less than, <code>lte</code> for less than, <code>ne</code> for not equal to. This property is applicable for polygons (<code>AcDbPolyline</code>) only.


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

#### &#x1F537; getCorners(entity :object): 

This function is used to determine the coordinates of corner points (vertices with bends) of a polyline. Only polylines (<code>AcDbPolyline</code>) are supported. Hence, the passed parameter has to be a custom polyline object or a polyline element from the <code>entities</code> property of ```Entities``` class object. The function returns an array of corner points or <code>null</code> if the passed entity object is not supported. 


### Example
Get corners of a custome polyline
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const polygon = {
		etype: "AcDbPolyline",
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

#### &#x1F537; checkConcentric(entity1 :object, entity2 :object): 
This function is used to check if two circle objects ```entity1``` and ```entity2``` are concentric. 

### Example
Check if the first and the second elements of the ```entities``` property of the object of ```Entities``` class are concentric circles.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const areConcentric = res.checkConcentric(res.entities[0], res.entities[1]);
	
	console.log(areConcentric);
```

#### &#x1F537; checkEccentric(entity1 :object, entity2 :object): 

This function is used to check if two circle objects ```entity1``` and ```entity2``` are eccentric. 


### Example
Check if the first and the second elements of the ```entities``` property of the object of ```Entities``` class are eccentric circles.
```
	const Entities = require("autocad-dxf");
	const data = "DATA_FROM_DXF_FILE";
	
	const res = new Entities(data);
	const areEccentric = res.checkEccentric(res.entities[0], res.entities[1]);
	
	console.log(areEccentric);
```




## Issues or suggestions?
If you have any issues or want to suggest something , your can write it [here](https://github.com/Asaye/autocad-dxf/issues).
