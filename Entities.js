const Distance = require("./Distance");
const Length = require("./Length");
const Intersection = require("./Intersection");
const Closest = require("./Closest");
const Triangulate = require("./Triangulate");
const Area = require("./Area");
const ErrorMessages = require("./ErrorMessages.json");
const DIMSTYLE_CODES = require("./DIMSTYLE_CODES.json");
const KEYS = require("./KEYS");
const CODES = require("./CODES");

const Entities = class {	
	constructor(data, tolerance) {
		this.entities = [];
		this.tables = {};
		this.blocks = [];
		this.tolerance = isNaN(tolerance) ? 0.0001 : tolerance;
		this.KEYS = KEYS;
		this.CODES = CODES;
		if (data && typeof data == "string") {
			this.processData(data.split("\n"));
		}
	}	
	
	getTables = (array, COUNT) => {			
		let ttype, json;
		while (COUNT < array.length - 1) {
			const code = array[COUNT].trim();
			const value = array[COUNT + 1].trim();	
			if (code == "0" && value == "TABLE") {
				ttype = array[COUNT + 3].trim();
				this.tables[ttype] = [];
			} else if (code == "0" && value == "ENDSEC") {
				return COUNT + 2;
			}
			
			if (ttype == "APPID") {
				if (code == "100" && value == "AcDbRegAppTableRecord") {
					if (json) this.tables.APPID.push(json);
					json = {};
				} else if (json && code == "0" && value == "ENDTAB") {
					this.tables.APPID.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;						
				}
			} else if (ttype == "BLOCK_RECORD") {
				if (code == "100" && value == "AcDbBlockTableRecord") {
					if (json) this.tables.BLOCK_RECORD.push(json);
					json = {};
				} else if (json && code == "0" && value == "ENDTAB") {
					if (json) this.tables.BLOCK_RECORD.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;
				} 
			} else if (ttype == "DIMSTYLE") {
				if (code == "100" && value == "AcDbDimStyleTableRecord") {
					if (json) this.tables.DIMSTYLE.push(json);
					json = {};
				} else if (json && code == "0" && value == "ENDTAB") {
					this.tables.DIMSTYLE.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;
				} else if (json && DIMSTYLE_CODES[code]) {
					if (code == "371" || code == "372") {
						let temp;
						if (value == "-3") {
							temp = "Standard";
						} else if (value == "-2") {
							temp = "ByLayer";
						} else if (value == "-1") {
							temp = "ByBlock";
						} else {
							temp = `${(parseFloat(value)/100)}mm`;
						}
						json[DIMSTYLE_CODES[code]] = temp;
					} else if (code == "280") {
						let temp;
						if (value == "0") {
							temp = "Centered";
						} else if (value == "1") {
							temp = "First extension line";
						} else if (value == "2") {
							temp = "Second extension line";
						} else if (value == "3") {
							temp = "Over first extension";
						} else if (value == "4") {
							temp = "Over second extension";
						} 
						json[DIMSTYLE_CODES[code]] = temp;
					} else if (code == "77") {
						let temp;
						if (value == "0") {
							temp = "Centered";
						} else if (value == "1") {
							temp = "Above dimension line";
						} else if (value == "2") {
							temp = "Outside";
						} else if (value == "3") {
							temp = "Japanese Industry Standards (JIS)";
						} else if (value == "4") {
							temp = "Below dimension line";
						} 
						json[DIMSTYLE_CODES[code]] = temp;
					} else if (code == "78" || code == "286") {
						let temp;
						if (value == "0") {
							json.suppress_zero_inches = "No";
							json.suppress_zero_feet = "Yes";
						} else if (value == "1") {
							json.suppress_zero_inches = "No";
							json.suppress_zero_feet = "No";
						} else if (value == "2") {
							json.suppress_zero_inches = "Yes";
							json.suppress_zero_feet = "No";
						} else if (value == "3") {
							json.suppress_zero_inches = "No";
							json.suppress_zero_feet = "Yes";
						} 
					}  else if (code == "284") {
						let temp;
						if (value == "0") {
							json.alt_suppress_leading_zeros = "No";
							json.alt_suppress_trailing_zeros = "No";
						} else if (value == "1") {
							json.alt_suppress_leading_zeros = "Yes";
							json.alt_suppress_trailing_zeros = "No";
						} else if (value == "2") {
							json.alt_suppress_leading_zeros = "No";
							json.alt_suppress_trailing_zeros = "Yes";
						} else if (value == "3") {
							json.alt_suppress_leading_zeros = "Yes";
							json.alt_suppress_trailing_zeros = "Yes";
						} 
					} else if (code == "79" || code == "285") {
						let temp;
						if (value == "0") {
							json.suppress_leading_zeros = "No";
							json.suppress_trailing_zeros = "No";
						} else if (value == "1") {
							json.suppress_leading_zeros = "Yes";
							json.suppress_trailing_zeros = "No";
						} else if (value == "2") {
							json.suppress_leading_zeros = "No";
							json.suppress_trailing_zeros = "Yes";
						} else if (value == "3") {
							json.suppress_leading_zeros = "Yes";
							json.suppress_trailing_zeros = "Yes";
						} 
					} else if (code == "148" || code == "171" || code == "179") {
						json[DIMSTYLE_CODES[code]] = value;
					} else if (code == "275") {
						let temp;
						if (value == "0") {
							temp = "Decimal degrees";
						} else if (value == "1") {
							temp = "Degrees/minutes/seconds";
						} else if (value == "2") {
							temp = "Gradians";
						} else if (value == "3") {
							temp = "Radians";
						} else if (value == "4") {
							temp = "Surveyor's units";
						} 
						json[DIMSTYLE_CODES[code]] = temp;
					} else if (code == "270") {
						let temp;
						if (value == "1") {
							temp = "Scientific";
						} else if (value == "2") {
							temp = "Decimal;";
						} else if (value == "3") {
							temp = "Engineering";
						} else if (value == "4") {
							temp = "Architectural (stacked)";
						} else if (value == "5") {
							temp = "Fractional (stacked)";
						} else if (value == "6") {
							temp = "Architectural";
						} else if (value == "7") {
							temp = "Fractional";
						} 
						json[DIMSTYLE_CODES[code]] = temp;
					} else if (code == "277") {
						let temp;
						if (value == "1") {
							temp = "Scientific";
						} else if (value == "2") {
							temp = "Decimal";
						} else if (value == "3") {
							temp = "Engineering";
						} else if (value == "4") {
							temp = "Architectural";
						} else if (value == "5") {
							temp = "Fractional";
						} else if (value == "6") {
							temp = "Windows desktop";
						} 
						json[DIMSTYLE_CODES[code]] = temp;
					} else if (code == "279") {
						let temp;
						if (value == "0") {
							temp = "Keep dim line with text";
						} else if (value == "1") {
							temp = "Move text, add leader";
						} else if (value == "2") {
							temp = "Move text, no leader";
						} 
						json[DIMSTYLE_CODES[code]] = temp;
					} else if (code == "283") {
						let temp;
						if (value == "0") {
							temp = "Top";
						} else if (value == "1") {
							temp = "Middle";
						} else if (value == "2") {
							temp = "Bottom";
						} 
						json[DIMSTYLE_CODES[code]] = temp;
					} else if (code == "289") {
						let temp;
						if (value == "0") {
							temp = "Text and Arrows";
						} else if (value == "1") {
							temp = "Arrows only";
						} else if (value == "2") {
							temp = "Text only";
						} else if (value == "3") {
							temp = "Best fit";
						} 
						json[DIMSTYLE_CODES[code]] = temp;
					} else {
						let temp = parseFloat(value);
						if (isNaN(temp)) temp = value;
						if (DIMSTYLE_CODES.booleans.indexOf(code) != -1) {
							temp = (temp == 1) ? "On" : "Off";
						}
						json[DIMSTYLE_CODES[code]] = temp;
					}
				}					
			} else if (ttype == "LAYER") {
				if (code == "100" && value == "AcDbLayerTableRecord") {
					if (json) this.tables.LAYER.push(json);
					json = {};
				} else if (json && code == "0" && value == "ENDTAB") {
					this.tables.LAYER.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;
				} else if (json && code == "70") {							
					if (value == "0") {
						json.status = "Thawed";  
					} else if (value == "1") {
						json.status = "Frozen";  
					} else if (value == "2") {
						json.status = "Frozen by default";  
					} else if (value == "4") {
						json.status = "Locked";  
					} 
				} else if (json && code == "62") {
					json.color_number = value;
				} else if (json && code == "6") {
					json.line_type = value;
				}
			} else if (ttype == "LTYPE") {
				if (code == "100" && value == "AcDbLinetypeTableRecord") {
					if (json) this.tables.LTYPE.push(json);
					json = {};
				} else if (json && code == "0" && value == "ENDTAB") {
					this.tables.LTYPE.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;
				} else if (json && code == "3") {
					json.description = value;
				} else if (json && code == "9") {
					if (!json.embedded_texts) json.embedded_texts = [];
					json.embedded_texts.push(value);						
				} else if (json && code == "40") {
					json.total_pattern_length = parseInt(value);
				} else if (json && code == "44") {
					if (!json.x_offsets) json.x_offsets = [];
					json.x_offsets.push(parseFloat(value));
				} else if (json && code == "45") {
					if (!json.y_offsets) json.y_offsets = [];
					json.y_offsets.push(parseFloat(value));
				} else if (json && code == "46") {
					if (!json.scale_value) json.scale_value = [];
					json.scale_value.push(parseFloat(value));
				} else if (json && code == "49") {
					if (!json.pattern_lengths) json.pattern_lengths = [];
					json.pattern_lengths.push(parseFloat(value));
				} else if (json && code == "50") {
					if (!json.embedded_element_rotations) json.embedded_element_rotations = [];
					json.embedded_element_rotations.push(parseFloat(value));
				} else if (json && code == "73") {							
					json.number_of_elements = parseInt(value);
				} else if (json && code == "74") {	
					if (value == "0") {
						json.embedded_element_type = "None";  
					} else if (value == "1") {
						json.embedded_element_rotation_type = "Absolute";  
					} else if (value == "2") {
						json.embedded_element_type = "Text";  
					} else if (value == "4") {
						json.embedded_element_type = "Shape";  
					} 
				} 
			} else if (ttype == "STYLE") {	
				if (code == "100" && value == "AcDbTextStyleTableRecord") {
					if (json) this.tables.STYLE.push(json);
					json = {text_height: 0};
				} else if (json && code == "0" && value == "ENDTAB") {
					this.tables.STYLE.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;
				} else if (json && code == "40") {
					json.text_height = parseFloat(value);
				} else if (json && code == "41") {
					json.width_factor = parseFloat(value);
				} else if (json && code == "50") {
					json.oblique_angle = parseFloat(value);
				} else if (json && code == "70") {	
					if (value == "1") {
						json.type = "Shape";  
					} else if (value == "4") {
						json.type = "Vertical text";  
					} 
				} else if (json && code == "71") {	
					if (value == "2") {
						json.text_type = "Backward (mirrored in X)";  
					} else if (value == "4") {
						json.text_type = "Upside down (mirrored in Y)";  
					} 
				} else if (json && code == "1071") {
					json.font_type = value;
				} 
			} else if (ttype == "UCS") {					
				if (code == "100" && value == "AcDbUCSTableRecord") {
					if (json) this.tables.UCS.push(json);
					json = {};
				} else if (json && code == "0" && value == "ENDTAB") {
					this.tables.UCS.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;
				} else if (json && code == "10") {
					json.origin = {x : parseFloat(value)};
				} else if (json && code == "11") {
					json.x_axis_direction = {x : parseFloat(value)};
				} else if (json && code == "12") {
					json.y_axis_direction = {x: parseFloat(value)};
				} else if (json && code == "13") {
					json.orthographic_origin = {x: parseFloat(value)};
				} else if (json && code == "20") {
					json.origin.y = parseFloat(value);
				} else if (json && code == "21") {
					json.x_axis_direction.y = parseFloat(value);
				} else if (json && code == "22") {
					json.y_axis_direction.y = parseFloat(value);
				} else if (json && code == "23") {
					json.orthographic_origin.y = parseFloat(value);
				} else if (json && code == "30") {
					json.origin.z = parseFloat(value);
				} else if (json && code == "31") {
					json.x_axis_direction.z = parseFloat(value);
				} else if (json && code == "32") {
					json.y_axis_direction.z = parseFloat(value);
				} else if (json && code == "33") {
					json.orthographic_origin.z = parseFloat(value);
				} else if (json && code == "71") {	
					if (value == "1") {
						json.orthographic_type = "Top";  
					} else if (value == "2") {
						json.orthographic_type = "Bottom";  
					} else if (value == "3") {
						json.orthographic_type = "Front";  
					} else if (value == "4") {
						json.orthographic_type = "Back";  
					} else if (value == "5") {
						json.orthographic_type = "Left";  
					} else if (value == "6") {
						json.orthographic_type = "Right";  
					} 
				} else if (json && code == "146") {
					json.elevation = parseFloat(value);
				}
			} else if (ttype == "VIEW") {					
				if (code == "100" && value == "AcDbViewTableRecord") {
					if (json) this.tables.VIEW.push(json);
					json = {hasUCS: false};
				} else if (json && code == "0" && value == "ENDTAB") {
					this.tables.VIEW.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;
				} else if (json && code == "10") { 
					json.center = {x : parseFloat(value)};
				} else if (json && code == "11") { 
					json.direction = {x : parseFloat(value)};
				} else if (json && code == "12") { 
					json.target_point = {x: parseFloat(value)};
				} else if (json && code == "20") { 
					json.center.y = parseFloat(value);
				} else if (json && code == "21") { 
					json.direction.y = parseFloat(value);
				} else if (json && code == "22") { 
					json.target_point.y = parseFloat(value);
				} else if (json && code == "31") { 
					json.direction.z = parseFloat(value);
				} else if (json && code == "32") { 
					json.target_point.z = parseFloat(value);
				} else if (json && code == "40") { 
					json.height = parseFloat(value);
				} else if (json && code == "41") { 
					json.width = parseFloat(value);
				} else if (json && code == "42") { 
					json.lens_angle = parseFloat(value);
				} else if (json && code == "50") { 
					json.twist_angle = parseFloat(value);
				} else if (json && code == "70") {	
					if (value == "1") {
						json.type = "Paper space view";  
					} 
				} else if (json && code == "72") {	
					if (value == "1") {
						json.hasUCS = true;  
					} 
				} else if (json && code == "79") {	
					if (value == "0") {
						json.orthographic_type = "N/A";  
					} else if (value == "1") {
						json.orthographic_type = "Top";  
					} else if (value == "2") {
						json.orthographic_type = "Bottom";  
					} else if (value == "3") {
						json.orthographic_type = "Front";  
					} else if (value == "4") {
						json.orthographic_type = "Back";  
					} else if (value == "5") {
						json.orthographic_type = "Left";  
					} else if (value == "6") {
						json.orthographic_type = "Right";  
					} 
				} else if (json && code == "110") { 
					json.origin = {x: parseFloat(value)};
				} else if (json && code == "111") { 
					json.ucs_x = {x: parseFloat(value)};
				} else if (json && code == "112") { 
					json.ucs_y = {x: parseFloat(value)};
				} else if (json && code == "120") { 
					json.origin.y = parseFloat(value);
				} else if (json && code == "121") { 
					json.ucs_x.y = parseFloat(value);
				} else if (json && code == "122") { 
					json.ucs_y.y = parseFloat(value);
				} else if (json && code == "130") { 
					json.origin.z = parseFloat(value);
				} else if (json && code == "131") { 
					json.ucs_x.z = parseFloat(value);
				} else if (json && code == "132") { 
					json.ucs_y.z = parseFloat(value);
				} else if (json && code == "146") { 
					json.elevation = parseFloat(value);
				} 
			} else if (ttype == "VPORT") {					
				if (code == "100" && value == "AcDbViewportTableRecord") {
					if (json) this.tables.VPORT.push(json);
					json = {};
				} else if (json && code == "0" && value == "ENDTAB") {
					this.tables.VPORT.push(json);
					json = null;
				} else if (json && code == "2") {
					json.name = value;
				} else if (json && code == "10") { 
					json.lower_left_corner = {x : parseFloat(value)};
				} else if (json && code == "11") { 
					json.upper_right_corner = {x : parseFloat(value)};
				} else if (json && code == "12") {
					json.center = {x: parseFloat(value)};
				} else if (json && code == "13") {
					json.snap_base_point = {x: parseFloat(value)};
				} else if (json && code == "14") {
					json.snap_spacing = {x: parseFloat(value)};
				} else if (json && code == "15") {
					json.grid_spacing = {x: parseFloat(value)};
				} else if (json && code == "16") {
					json.view_direction = {x: parseFloat(value)};
				} else if (json && code == "17") {
					json.target_point = {x: parseFloat(value)};
				} else if (json && code == "20") { 
					json.lower_left_corner.y = parseFloat(value);
				} else if (json && code == "21") { 
					json.upper_right_corner.y = parseFloat(value);
				} else if (json && code == "22") { 
					json.center.y = parseFloat(value);
				} else if (json && code == "23") { 
					json.snap_base_point.y = parseFloat(value);
				} else if (json && code == "24") { 
					json.snap_spacing.y = parseFloat(value);
				} else if (json && code == "25") { 
					json.grid_spacing.y = parseFloat(value);
				} else if (json && code == "26") { 
					json.view_direction.y = parseFloat(value);
				} else if (json && code == "27") { 
					json.target_point.y = parseFloat(value);
				} else if (json && code == "36") { 
					json.view_direction.z = parseFloat(value);
				} else if (json && code == "37") { 
					json.target_point.z = parseFloat(value);
				} else if (json && code == "45") { 
					json.height = parseFloat(value);
				} else if (json && code == "42") { 
					json.lens_length = parseFloat(value);
				} else if (json && code == "50") { 
					json.snap_rotation_angle = parseFloat(value);
				} else if (json && code == "51") { 
					json.twist_angle = parseFloat(value);
				} else if (json && code == "72") {						
					json.circle_sides = value; 
				} else if (json && code == "79") {	
					if (value == "0") {
						json.orthographic_type = "N/A";  
					} else if (value == "1") {
						json.orthographic_type = "Top";  
					} else if (value == "2") {
						json.orthographic_type = "Bottom";  
					} else if (value == "3") {
						json.orthographic_type = "Front";  
					} else if (value == "4") {
						json.orthographic_type = "Back";  
					} else if (value == "5") {
						json.orthographic_type = "Left";  
					} else if (value == "6") {
						json.orthographic_type = "Right";  
					} 
				} else if (json && code == "110") { 
					json.origin = {x: parseFloat(value)};
				} else if (json && code == "111") { 
					json.ucs_x = {x: parseFloat(value)};
				} else if (json && code == "112") { 
					json.ucs_y = {x: parseFloat(value)};
				} else if (json && code == "120") { 
					json.origin.y = parseFloat(value);
				} else if (json && code == "121") { 
					json.ucs_x.y = parseFloat(value);
				} else if (json && code == "122") { 
					json.ucs_y.y = parseFloat(value);
				} else if (json && code == "130") { 
					json.origin.z = parseFloat(value);
				} else if (json && code == "131") { 
					json.ucs_x.z = parseFloat(value);
				} else if (json && code == "132") { 
					json.ucs_y.z = parseFloat(value);
				} else if (json && code == "146") { 
					json.elevation = parseFloat(value);
				}
			} 
			COUNT = COUNT + 2;
		}
	}
	
	getBlocks = (array, COUNT) => {
		let json, json2, blockBegan = false, entityStarted = false;
		while (COUNT < array.length - 1) {
			const code = array[COUNT].trim();
			const value = array[COUNT + 1].trim();
			if (code == "0" && value == "BLOCK") {
				json = {};
			} else if (code == "0" && value == "ENDSEC") {
				this.blocks.push(json);
				return COUNT + 2;
			} else if (code == "0" && value == "ENDBLK") {
				if (json.entities && json2) json.entities.push(json2);
				this.blocks.push(json);
				blockBegan = false;				
			} else if (code == "100" && value == "AcDbBlockBegin") {
				blockBegan = true;
				entityStarted = false;
			} 
			
			if (blockBegan && code == "0") {
				if (!json.entities) json.entities = [];
				json2 = {etype: value};
				entityStarted = true;
			} else if (blockBegan && json.entities && code == "330") {
				json.entities.push(json2);
			} else if (blockBegan && code == "2") {
				json.name = value;
			}  else if (blockBegan && code == "4") {
				json.description = value;
			} else if (!blockBegan && code == "8") {
				json.layer = value;
			} else if (!entityStarted && code == "10") {
				json.base_point = { x : parseFloat(value) };
			} else if (!entityStarted && code == "20") {
				json.base_point.y = parseFloat(value);
			} else if (!entityStarted && code == "30") {
				json.base_point.z = parseFloat(value);
			} else if (blockBegan && json2) {
				this.insertEntity(code, value, json2);
			}
			
			COUNT = COUNT + 2;
		}
	}
	
	getEntities = (array, COUNT) => {
		let json, json2;
		
		while (COUNT < array.length - 1) {
			const code = array[COUNT].trim();
			const value = array[COUNT + 1].trim();	
			if (code == "0" && value == "ENDSEC" && json.etype != "SEQEND") {	
				/* if (json.subclass == "AcDbPolyline") {
					const A = this.area(json);
					const L = this.length(json);
					if (!isNaN(A.area)) json.area = A.area;
					if (!isNaN(L)) json.perimeter = L;
				} */
				this.entities.push(json);
				return COUNT + 2;
			}
					
			if (code == "0" && (!json || (json.subclass && json.subclass != "AcDb3dPolyline" && json.etype != "SEQEND"))) {					
				if (json) {
					/* if (json.subclass == "AcDbPolyline" && json.area === undefined) {						
						const A = this.area(json);
						const L = this.length(json);
						if (!isNaN(A.area)) json.area = A.area;
						if (!isNaN(L)) json.perimeter = L;
					} */
					this.entities.push(json);
				}
				json = {};
				this.insertEntity(code, value, json);
			} else if (code == "0" && json && json.subclass == "AcDb3dPolyline" && value == "SEQEND") {
				if (json) this.entities.push(json);
				json = {};
				json2 = undefined;
				while (array[COUNT + 2].trim() != "0") {
					COUNT = COUNT + 2;
				}				
				//this.insertEntity(code, value, json);
			} else if (code == "0" && json && json.subclass == "AcDb3dPolyline") {
				if (!json.vertices) json.vertices = [];
				if (json2) json.vertices.push(json2);		
				json2 = {};
				this.insertEntity(code, value, json2);				 
			} else if (json2) {
				this.insertEntity(code, value, json2);
			} else {
				this.insertEntity(code, value, json);
			}
			
			COUNT = COUNT + 2;
		}
	}
	
	insertEntity = (code, value, json) => {
		if (json && !json.etype && code == "0") {					
			json.etype = value;			
			json.line_type = "ByLayer";
			json.color = "ByLayer";
		} else if (code == "1") {					
			if (json.subclass == "AcDbText" || json.subclass == "AcDbMText") {
				const regex = /(\\P|\\L|\{|\}|\\*\\*a\d+;|\\H\d+\.?\d*x;|\+\/\-|%%u|\\Fromanc\||\\f.*p\d+;|t\d+;|c\d+;|\\fFutura Md BT\||\\Fsimplex\||\\fitalic.*c.*\d+;|scale.*\d+:\d+)/gim;
				
				json.text = value.replace(regex, "");
				json.style = "STANDARD";
				json.rotation = 0; 
			} else if (json.subclass == "AcDbDimension") {
				const regex = /(\\P|\\L|\{|\}|\\*\\*a\d+;|\\H\d+\.?\d*x;|\+\/\-|%%u|\\Fromanc\||\\f.*p\d+;|t\d+;|c\d+;|\\fFutura Md BT\||\\Fsimplex\||\\fitalic.*c.*\d+;|scale.*\d+:\d+)/gim;
				json.text_override = value.replace(regex, "");  
			} else if (json.subclass == "AcDbModelerGeometry") {
				if (!json.proprietary_data) json.proprietary_data = [];
				json.proprietary_data.push(value);
			} 
		} else if (code == "2") {
			if (json.subclass == "AcDbShape" || json.subclass == "AcDbMline" || json.subclass == "AcDbHatch") {
				json.style_name = value;  
			} else if (json.subclass == "AcDbBlockReference") {
				json.block_name = value;  
			}
		} else if (code == "3") {
			if (json.subclass == "AcDbDimension" || json.subclass == "AcDbLeader") {
				json.dimension_style = value;  
			} else if (json.subclass == "AcDbModelerGeometry") {
				const temp = json.proprietary_data[json.proprietary_data.length - 1];
				json.proprietary_data[json.proprietary_data.length - 1] = temp + value;
			}
		} else if (code == "6") {
			json.line_type = value;
		} else if (code == "7") {
			if (json.subclass == "AcDbMText") {
				json.style = value;  
			} if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].text_style = value;
				} else {
					json.text_style = value;
				}
			}
		} else if (code == "8") {
			json.layer = value;
		} else if (code == "10") {
			if (json.subclass == "AcDbLine" || json.subclass == "AcDbRay" || json.subclass == "AcDbMline") {
				json.start_x = parseFloat(value);  
			} else if (json.subclass == "AcDbPolyline" || json.subclass == "AcDbLeader") {
				if (!json.vertices) json.vertices = [];
				json.vertices.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbSpline") {
				if (!json.control_points) json.control_points = [];
				json.control_points.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (!json.corners) json.corners = [];
				json.corners.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbHatch") {
				if (!json.seed_points) json.seed_points = [];
				json.seed_points.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbHelix") {
				if (!json.axis_base_point) json.axis_base_point = [];
				json.axis_base_point.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbRasterImage") {
				if (!json.insertion_point) json.insertion_point = [];
				json.insertion_point.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbXline") {
				if (!json.first_point) json.first_point = {};
				json.first_point.x = parseFloat(value);
			} else {
				json.x = parseFloat(value);
			} 
		} else if (code == "11") {
			if (json.subclass == "AcDbLine") {
				json.end_x = parseFloat(value);  
			} else if (json.subclass == "AcDbSpline") {
				if (!json.fit_points) json.fit_points = [];
				json.fit_points.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbEllipse") {
				json.major_end_dx = parseFloat(value);  
			} else if (json.subclass == "AcDbDimension") {
				json.x_text = parseFloat(value);  
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (!json.corners) json.corners = [];
				json.corners.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbRay") {
				json.unit_direction_x = parseFloat(value);  
			} else if (json.subclass == "AcDbHelix") {
				if (!json.start_point) json.start_point = [];
				json.start_point.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbMline") {
				if (!json.vertices) json.vertices = [];
				json.vertices.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbXline") {
				if (!json.unit_direction_vector) json.unit_direction_vector = {};
				json.unit_direction_vector.x = parseFloat(value);
			} else if (json.subclass == "AcDbRasterImage") {
				if (!json.u_vector) json.u_vector = [];
				json.u_vector.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				if (!json.axis_vector) json.axis_vector = [];
				json.axis_vector.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				if (!json.ref_vector) json.ref_vector = [];
				json.ref_vector.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbBlockReference" && json.specific_type == "AcDbTable") {
				json.direction_vector = {x: parseFloat(value)};
			} 
		} else if (code == "12") {
			if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (!json.corners) json.corners = [];
				json.corners.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbMline") {
				if (json.vertices && json.vertices.length > 0) { 
					for (let i = 0; i < json.vertices.length; i++) {
						if (json.vertices[i].segment_dir_vector_x !== undefined) continue;
						json.vertices[i].segment_dir_vector_x = parseFloat(value);
						break;
					}
				}
			} else if (json.subclass == "AcDbHelix") {
				if (!json.axis_vector) json.axis_vector = [];
				json.axis_vector.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbRasterImage") {
				if (!json.v_vector) json.v_vector = [];
				json.v_vector.push({x: parseFloat(value)});
			} 				
		} else if (code == "13") {
			if (json.specific_type == "AcDbAlignedDimension" || json.specific_type == "AcDb3PointAngularDimension") {
				json.ext_line1_x = parseFloat(value);  
			} else if (json.specific_type == "AcDbOrdinateDimension") {
				json.location_x = parseFloat(value);  
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (!json.corners) json.corners = [];
				json.corners.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbMline") {
				if (json.vertices && json.vertices.length > 0) { 
					for (let i = 0; i < json.vertices.length; i++) {
						if (json.vertices[i].miter_dir_vector_x !== undefined) continue;
						json.vertices[i].miter_dir_vector_x = parseFloat(value);
						break;
					}
				}
			} else if (json.subclass == "AcDbRasterImage") {
				json.u_value = parseFloat(value);  
			} 
		} else if (code == "14") {
			if (json.specific_type == "AcDbAlignedDimension" || json.specific_type == "AcDb3PointAngularDimension") {
				json.ext_line2_x = parseFloat(value);  
			} else if (json.specific_type == "AcDbOrdinateDimension") {
				json.leader_end_x = parseFloat(value);  
			} else if (json.subclass == "AcDbRasterImage") {
				if (!json.clip_vertex) json.clip_vertex = [];
				json.clip_vertex.push({x: parseFloat(value)});
			} 
		} else if (code == "15") {
			if (json.specific_type == "AcDb3PointAngularDimension") {
				json.vertex_x = parseFloat(value);  
			} else if (json.specific_type == "AcDbRadialDimension" || json.specific_type == "AcDbDiametricDimension") {
				json.dim_first_point_x = parseFloat(value);  
			} 
		} else if (code == "16") {
			if (json.specific_type == "AcDb3PointAngularDimension") {
				json.arc_dim_line_x = parseFloat(value); 
			} 
		} else if (code == "20") {
			if (json.subclass == "AcDbLine" || json.subclass == "AcDbRay" || json.subclass == "AcDbMline") {
				json.start_y = parseFloat(value);  
			} else if (json.subclass == "AcDbPolyline" || json.subclass == "AcDbLeader") {
				json.vertices[json.vertices.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbSpline") {
				json.control_points[json.control_points.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (json.corners && json.corners[0]) {
					json.corners[0]["y"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbHatch") {
				json.seed_points[json.seed_points.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbHelix") {
				json.axis_base_point[json.axis_base_point.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbRasterImage") {
				json.insertion_point[json.insertion_point.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbXline") {
				json.first_point.y = parseFloat(value);
			} else {
				json.y = parseFloat(value);
			} 
		} else if (code == "21") {
			if (json.subclass == "AcDbLine") {
				json.end_y = parseFloat(value);  
			} else if (json.subclass == "AcDbSpline") {
				json.fit_points[json.fit_points.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbEllipse") {
				json.major_end_dy = parseFloat(value);  
			} else if (json.subclass == "AcDbDimension") {
				json.y_text = parseFloat(value);  
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (json.corners && json.corners[1]) {
					json.corners[1]["y"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbRay") {
				json.unit_direction_y = parseFloat(value);  
			} else if (json.subclass == "AcDbHelix") {
				json.start_point[json.start_point.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbMline") {
				if (json.vertices && json.vertices.length > 0) {
					json.vertices[json.vertices.length - 1]["y"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbXline") {
				json.unit_direction_vector.y = parseFloat(value);
			} else if (json.subclass == "AcDbRasterImage") {
				json.u_vector[json.u_vector.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.axis_vector[json.axis_vector.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				json.ref_vector[json.ref_vector.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbBlockReference" && json.specific_type == "AcDbTable") {
				json.direction_vector["y"] = parseFloat(value);
			} 
		} else if (code == "22") {
			if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (json.corners && json.corners[2]) {
					json.corners[2]["y"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbMline") {
				if (json.vertices && json.vertices.length > 0) { 
					for (let i = 0; i < json.vertices.length; i++) {
						if (json.vertices[i].segment_dir_vector_y !== undefined) continue;
						json.vertices[i].segment_dir_vector_y = parseFloat(value);
						break;
					}
				}
			} else if (json.subclass == "AcDbHelix") {
				json.axis_vector[json.axis_vector.length - 1]["y"] = parseFloat(value);
			} else if (json.subclass == "AcDbRasterImage") {
				json.v_vector[json.v_vector.length - 1]["y"] = parseFloat(value);
			} 
		} else if (code == "23") {
			if (json.specific_type == "AcDbAlignedDimension" || json.specific_type == "AcDb3PointAngularDimension") {
				json.ext_line1_y = parseFloat(value);  
			} else if (json.specific_type == "AcDbOrdinateDimension") {
				json.location_y = parseFloat(value);  
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (json.corners && json.corners[3]) {
					json.corners[3]["y"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbMline") {
				if (json.vertices && json.vertices.length > 0) { 
					for (let i = 0; i < json.vertices.length; i++) {
						if (json.vertices[i].miter_dir_vector_y !== undefined) continue;
						json.vertices[i].miter_dir_vector_y = parseFloat(value);
						break;
					}
				}
			} else if (json.subclass == "AcDbRasterImage") {
				json.v_value = parseFloat(value);  
			} 
		} else if (code == "24") {
			if (json.specific_type == "AcDbAlignedDimension" || json.specific_type == "AcDb3PointAngularDimension") {
				json.ext_line2_y = parseFloat(value);  
			} else if (json.specific_type == "AcDbOrdinateDimension") {
				json.leader_end_y = parseFloat(value);  
			} else if (json.subclass == "AcDbRasterImage") {
				json.clip_vertex[json.clip_vertex.length - 1]["y"] = parseFloat(value); 
			} 
		} else if (code == "25") {
			if (json.specific_type == "AcDb3PointAngularDimension") {
				json.vertex_y = parseFloat(value);  
			} else if (json.specific_type == "AcDbRadialDimension" || json.specific_type == "AcDbDiametricDimension") {
				json.dim_first_point_y = parseFloat(value);  
			} 
		} else if (code == "26") {
			if (json.specific_type == "AcDb3PointAngularDimension") {
				json.arc_dim_line_y = parseFloat(value);   
			}  
		} else if (code == "30") {
			if (json.subclass == "AcDbLine" || json.subclass == "AcDbRay" || json.subclass == "AcDbMline") {
				json.start_z = parseFloat(value);  
			} else if (json.subclass == "AcDbPolyline" || json.subclass == "AcDbLeader") {
				json.vertices[json.vertices.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbSpline") {
				json.control_points[json.control_points.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (json.corners && json.corners[0]) {
					json.corners[0]["z"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbHatch") {
				json.seed_points[json.seed_points.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbHelix") {
				json.axis_base_point[json.axis_base_point.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbRasterImage") {
				json.insertion_point[json.insertion_point.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbXline") {
				json.first_point.z = parseFloat(value);
			} else {
				json.z = parseFloat(value);
			} 
		} else if (code == "31") {
			if (json.subclass == "AcDbLine") {
				json.end_z = parseFloat(value);
				json.length = this.length(json);
			} else if (json.subclass == "AcDbSpline") {
				json.fit_points[json.fit_points.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbEllipse") {
				json.major_end_dz = parseFloat(value);  
			} else if (json.subclass == "AcDbDimension") {
				json.z_text = parseFloat(value);  
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (json.corners && json.corners[1]) {
					json.corners[1]["z"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbRay") {
				json.unit_direction_z = parseFloat(value);  
			} else if (json.subclass == "AcDbHelix") {
				json.start_point[json.start_point.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbMline") {
				if (json.vertices && json.vertices.length > 0) {
					json.vertices[json.vertices.length - 1]["z"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbXline") {
				json.unit_direction_vector.z = parseFloat(value);
			} else if (json.subclass == "AcDbRasterImage") {
				json.u_vector[json.u_vector.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.axis_vector[json.axis_vector.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				json.ref_vector[json.ref_vector.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbBlockReference" && json.specific_type == "AcDbTable") {
				json.direction_vector["z"] = parseFloat(value);
			}
		} else if (code == "32") {
			if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (json.corners && json.corners[2]) {
					json.corners[2]["z"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbMline") {
				if (json.vertices && json.vertices.length > 0) { 
					for (let i = 0; i < json.vertices.length; i++) {
						if (json.vertices[i].segment_dir_vector_z !== undefined) continue;
						json.vertices[i].segment_dir_vector_z = parseFloat(value);
						break;
					}
				}
			} else if (json.subclass == "AcDbHelix") {
				json.axis_vector[json.axis_vector.length - 1]["z"] = parseFloat(value);
			} else if (json.subclass == "AcDbRasterImage") {
				json.v_vector[json.v_vector.length - 1]["z"] = parseFloat(value);
			} 
		} else if (code == "33") {
			if (json.specific_type == "AcDbAlignedDimension" || json.specific_type == "AcDb3PointAngularDimension") {
				json.ext_line1_z = parseFloat(value);  
			} else if (json.specific_type == "AcDbOrdinateDimension") {
				json.location_z = parseFloat(value);  
			} else if (json.subclass == "AcDbTrace" || json.subclass == "AcDbFace") {
				if (json.corners && json.corners[3]) {
					json.corners[3]["z"] = parseFloat(value);
				}
			} else if (json.subclass == "AcDbMline") {
				if (json.vertices && json.vertices.length > 0) { 
					for (let i = 0; i < json.vertices.length; i++) {
						if (json.vertices[i].miter_dir_vector_z !== undefined) continue;
						json.vertices[i].miter_dir_vector_z = parseFloat(value);
						break;
					}
				}
			} 
		} else if (code == "34") {
			if (json.specific_type == "AcDbAlignedDimension" || json.specific_type == "AcDb3PointAngularDimension") {
				json.ext_line2_z = parseFloat(value);  
			} else if (json.specific_type == "AcDbOrdinateDimension") {
				json.leader_end_z = parseFloat(value);  
			} else if (json.subclass == "AcDbRasterImage") {
				json.clip_vertex[json.clip_vertex.length - 1]["z"] = parseFloat(value); 
			} 
		} else if (code == "35") {
			if (json.specific_type == "AcDb3PointAngularDimension") {
				json.vertex_z = parseFloat(value);  
			} else if (json.specific_type == "AcDbRadialDimension" || json.specific_type == "AcDbDiametricDimension") {
				json.dim_first_point_z = parseFloat(value);  
			} 
		} else if (code == "36") {
			if (json.specific_type == "AcDb3PointAngularDimension") {
				json.ext_line1_p1_x = json.ext_line1_x;
				json.ext_line1_p2_x = json.ext_line2_x;
				json.ext_line2_p1_x = json.x;
				json.ext_line2_p2_x = json.vertex_x;
				json.ext_line1_p1_y = json.ext_line1_y;
				json.ext_line1_p2_y = json.ext_line2_y;
				json.ext_line2_p1_y = json.y;
				json.ext_line2_p2_y = json.vertex_y;
				
				json.ext_line1_p1_z = json.ext_line1_z;
				json.ext_line1_p2_z = json.ext_line2_z;
				json.ext_line2_p1_z = json.z;
				json.ext_line2_p2_z = json.vertex_z;
				
				json.arc_dim_line_z = parseFloat(value);  
				delete json.ext_line1_x;
				delete json.ext_line2_x;
				delete json.x;
				delete json.vertex_x;
				delete json.ext_line1_y;
				delete json.ext_line2_y;
				delete json.y;
				delete json.vertex_y; 
				
				delete json.ext_line1_z;
				delete json.ext_line2_z;
				delete json.z;
				delete json.vertex_z; 
			}  
		} else if (code == "40") {
			if (json.subclass == "AcDbCircle") {
				json.radius = parseFloat(value);
				let A = this.area(json);
				const C = this.length(json);
				json.area = A.area;
				json.circumference = C;
			} else if (json.subclass == "AcDbEllipse") {
				json.minorToMajor = parseFloat(value);  
			} else if (json.subclass == "AcDbSpline") {
				if (!json.knot_values) json.knot_values = [];
				json.knot_values.push(parseFloat(value));
			} else if (json.subclass == "AcDbText" || json.subclass == "AcDbMText") {
				json.height = parseFloat(value);  
			} else if (json.subclass == "AcDbVertex") {
				json.start_width = parseFloat(value);  
			} else if (json.subclass == "AcDbShape") {
				json.size = parseFloat(value);  
			} else if (json.subclass == "AcDbMline") {
				json.scale_factor = parseFloat(value);  
			} else if (json.subclass == "AcDbDimension") {
				json.leader_length = parseFloat(value);  
			} else if (json.subclass == "AcDbHelix") {
				json.radius = parseFloat(value);  
			} else if (json.subclass == "AcDbLeader") {
				json.text_height = parseFloat(value);  
			} else if (json.subclass == "AcDbPolyline") {
				json.vertices[json.vertices.length - 1]["start_width"] = parseFloat(value);  
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.revolve_angle = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbExtrudedSurface") {
				if (!json.transform_matrix_revolved) json.transform_matrix_revolved = [];
				json.transform_matrix_revolved.push(parseFloat(value));
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbLoftedSurface") {
				if (!json.transform_matrix) json.transform_matrix = [];
				json.transform_matrix.push(parseFloat(value));
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbSweptSurface") {
				if (!json.transform_matrix_sweep2) json.transform_matrix_sweep2 = [];
				json.transform_matrix_sweep2.push(parseFloat(value));
			} else if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				json.horizontal_margin = parseFloat(value); 
			}
		} else if (code == "41") {
			if (json.subclass == "AcDbEllipse") {
				json.start_parameter = parseFloat(value);
				if (!isNaN(json.end_parameter)) {
					this.getEllipseAngles(json);
				}
			} else if (json.subclass == "AcDbText") {
				json.width = parseFloat(value);  
			} else if (json.subclass == "AcDbVertex") {
				json.end_width = parseFloat(value);  
			} else if (json.subclass == "AcDbMline") {
				if (!json.element_params) json.element_params = [];
				json.element_params.push({x: parseFloat(value)});
			} else if (json.subclass == "AcDbHatch") {
				json.pattern_scale = parseFloat(value);  
			} else if (json.subclass == "AcDbBlockReference") {
				json.scale_x = parseFloat(value);  
			} else if (json.subclass == "AcDbHelix") {
				json.number_of_turns = parseFloat(value);  
			} else if (json.subclass == "AcDbLeader") {
				json.text_width = parseFloat(value);  
			} else if (json.subclass == "AcDbPolyline") {
				json.vertices[json.vertices.length - 1]["end_width"] = parseFloat(value);  
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.start_angle = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbLoftedSurface") {
				json.start_draft_angle = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbSweptSurface") {
				if (!json.transform_matrix_path2) json.transform_matrix_path2 = [];
				json.transform_matrix_path2.push(parseFloat(value));
			} else if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				json.vertical_margin = parseFloat(value); 
			}
		} else if (code == "42") {
			if (json.subclass == "AcDbEllipse") {
				json.end_parameter = parseFloat(value);
				if (!isNaN(json.start_parameter)) {
					this.getEllipseAngles(json);
				}
			} else if (json.subclass == "AcDbText") {
				json.character_width = parseFloat(value);  
			} else if (json.subclass == "AcDbDimension") {
				json.actual_measurement = parseFloat(value);
				if (json.text_override == "<>") {
					json.text_override = value;
				}
			} else if (json.subclass == "AcDbBlockReference") {
				json.scale_y = parseFloat(value);  
			} else if (json.subclass == "AcDbHelix") {
				json.turn_height = parseFloat(value);  
			} else if (json.subclass == "AcDbPolyline") {
				json.vertices[json.vertices.length - 1]["bulge"] = parseFloat(value);  
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				if (!json.transform_matrix) json.transform_matrix = [];
				json.transform_matrix.push(parseFloat(value));
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				json.draft_angle = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbLoftedSurface") {
				json.end_draft_angle = parseFloat(value);
			} 
		} else if (code == "43") {
			if (json.subclass == "AcDbBlockReference") {
				json.scale_z = parseFloat(value);  
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.draft_angle = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				json.start_draft_distance = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbLoftedSurface") {
				json.start_draft_magnitude = parseFloat(value);
			} 
		} else if (code == "44") {
			if (json.subclass == "AcDbBlockReference") {
				json.column_spacing = parseFloat(value);  
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.start_draft_distance = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				json.end_draft_distance = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbLoftedSurface") {
				json.end_draft_magnitude = parseFloat(value);
			} 
		} else if (code == "45") {
			if (json.subclass == "AcDbBlockReference") {
				json.row_spacing = parseFloat(value);  
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.end_draft_distance = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				json.twist_angle = parseFloat(value);
			} 
		} else if (code == "46") {
			if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.twist_angle = parseFloat(value);
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				if (!json.transform_matrix_sweep) json.transform_matrix_sweep = [];
				json.transform_matrix_sweep.push(parseFloat(value));
			} 
		} else if (code == "47") {
			if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				if (!json.transform_matrix_path) json.transform_matrix_path = [];
				json.transform_matrix_path.push(parseFloat(value));
			} 
		} else if (code == "48") {
			json.line_scale = parseFloat(value);
		} else if (code == "49") {
			if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				json.align_angle = parseFloat(value);
			} 
		} else if (code == "50") {
			if (json.subclass == "AcDbCircle") {
				json.start_angle = parseFloat(value);   
			} else if (json.subclass == "AcDbDimension") {
				json.rotation = parseFloat(value);   
			} else if (json.subclass == "AcDbVertex") {
				json.curve_fit_tangent_direction = value;   
			} else if (json.subclass == "AcDbShape") {
				json.rotation = parseFloat(value);   
			} else if (json.subclass == "AcDbText" || json.subclass == "AcDbMText") {
				json.rotation = parseFloat(value);   
			} else if (json.subclass == "AcDbBlockReference") {
				json.rotation = parseFloat(value);  
			} 				 
		} else if (code == "51") {
			if (json.subclass == "AcDbCircle") {
				json.end_angle = parseFloat(value);
				const A = this.area(json);
				const C = this.length(json);
				delete json.circumference;
				json.area = A.area;
				json.arc_length = C;
			} 					  
		} else if (code == "52") {
			if (json.subclass == "AcDbHatch") {
				json.pattern_angle = parseFloat(value);  
			} else if (json.subclass == "AcDbDimension") {
				json.ext_line_rotation = parseFloat(value);  
			} 					  
		} else if (code == "60") {
			if (value == "1") {
				json.visibility = "Invisible";  
			} 					  
		} else if (code == "62") {
			if (value == "0") {
				json.color = "ByBlock";  
			} else if (value == "256") {
				json.color = "ByLayer";  
			} else if (parseInt(value) > 0 && parseInt(value) < 256) {
				json.color = parseInt(value);  
			} else if (parseInt(value) < 0) {
				json.color = "Layer turned-off";  
			} 		
		} else if (code == "63") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].fill_color = value;
				} else {
					json.fill_color = value;
				}
			}			
		} else if (code == "64") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].text_color = value;
				} else {
					json.text_color = value;
				}
			}			
		} else if (code == "65") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].border_color_right = value;
				} else {
					json.border_color_right = value;
				}
			}			
		} else if (code == "66") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].border_color_bottom = value;
				} else {
					json.border_color_bottom = value;
				}
			}			
		} else if (code == "68") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].border_color_left = value;
				} else {
					json.border_color_left = value;
				}
			}			
		} else if (code == "69") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].border_color_top = value;
				} else {
					json.border_color_top = value;
				}
			}			
		} else if (code == "70") {
			if (json.subclass == "AcDbPolyline") {
				if (value == "1") {
					json.type = "Closed";  
				} else if (value == "128") {
					json.type = "Plinegen";  
				} 
			} else if (json.subclass == "AcDbSpline") {
				if (value == "1") {
					json.type = "Closed";  
				} else if (value == "2") {
					json.type = "Periodic";  
				} else if (value == "4") {
					json.type = "Rational";  
				} else if (value == "8") {
					json.type = "Planar";  
				} else if (value == "16") {
					json.type = "Linear";  
				} 
			} else if (json.subclass == "AcDbDimension") {
				if (value == "0") {
					json.type = "Rotated, horizontal, or vertical";  
				} else if (value == "1") {
					json.type = "Aligned";  
				} else if (value == "2") {
					json.type = "Angular";  
				} else if (value == "3") {
					json.type = "Diameter";  
				} else if (value == "4") {
					json.type = "Radius";  
				} else if (value == "5") {
					json.type = "Angular 3 point";  
				} else if (value == "6") {
					json.type = "Ordinate";  
				} else if (value == "64") {
					json.ordinate = "X-Type";  
				}
			} else if (json.subclass == "AcDbVertex") {
				if (value == "1") {
					json.type = "Extra vertex created by curve-fitting";  
				} else if (value == "2") {
					json.type = "Curve-fit tangent defined for this vertex";  
				} else if (value == "4") {
					json.type = "Not used";  
				} else if (value == "8") {
					json.type = "Spline vertex created by spline-fitting";  
				} else if (value == "16") {
					json.type = "Spline frame control point";  
				} else if (value == "32") {
					json.type = "3D polyline vertex";  
				} else if (value == "64") {
					json.type = "3D polygon mesh";  
				} else if (value == "128") {
					json.type = "Polyface mesh vertex";  
				}
			} else if (json.subclass == "AcDbMline") {
				if (value == "0") {
					json.justification = "Top";  
				} else if (value == "1") {
					json.justification = "Middle";  
				} else if (value == "2") {
					json.justification = "Bottom";  
				} 
			} else if (json.subclass == "AcDbHatch") {
				if (value == "0") {
					json.fill_type = "Pattern";  
				} else if (value == "1") {
					json.fill_type = "Solid";  
				} 
			} else if (json.subclass == "AcDbBlockReference") {
				json.column_count = parseFloat(value);  
			} else if (json.subclass == "AcDbRasterImage") {
				if (value == "1") {
					json.image_display_properties = "Show image";  
				} else if (value == "2") {
					json.image_display_properties = "Show image when not aligned with screen";  
				} else if (value == "4") {
					json.image_display_properties = "Use clipping boundary";  
				} else if (value == "8") {
					json.image_display_properties = "Transparency is on";  
				}
			} else if (json.subclass == "AcDbFace") {
				if (value == "1") {
					json.invisible_edge = "First";  
				} else if (value == "2") {
					json.invisible_edge = "Second";  
				} else if (value == "4") {
					json.invisible_edge = "Third";  
				} else if (value == "8") {
					json.invisible_edge = "Fourth";  
				}
			} else if (json.subclass == "AcDbModelerGeometry" && (json.specific_type == "AcDbExtrudedSurface" || json.specific_type == "AcDbSweptSurface")) {
				if (value == "0") {
					json.sweep_alignment_option = "No alignment";  
				} else if (value == "1") {
					json.sweep_alignment_option = "Align sweep entity to path";  
				} else if (value == "2") {
					json.sweep_alignment_option = "Translate sweep entity to path";  
				} else if (value == "3") {
					json.sweep_alignment_option = "Translate path to sweep entity";  
				} 
			} 
		} else if (code == "71") {
			if (json.subclass == "AcDbSpline") {
				json.degree_of_curve = parseFloat(value);
			} else if (json.subclass == "AcDbDimension") {
				if (value == "1") {
					json.attachement_point = "Top left";  
				} else if (value == "2") {
					json.attachement_point = "Top center";  
				} else if (value == "3") {
					json.attachement_point = "Top right";  
				} else if (value == "4") {
					json.attachement_point = "Middle left";  
				} else if (value == "5") {
					json.attachement_point = "Middle center";  
				} else if (value == "6") {
					json.attachement_point = "Middle right";  
				} else if (value == "7") {
					json.attachement_point = "Bottom left";  
				} else if (value == "8") {
					json.attachement_point = "Bottom center";  
				} else if (value == "9") {
					json.attachement_point = "Bottom right";  
				} 
			} else if (json.subclass == "AcDbMline") {
				if (value == "1") {
					json.type = "Has at least one vertex";  
				} else if (value == "2") {
					json.type = "Closed";  
				} else if (value == "4") {
					json.type = "Suppress start caps";  
				} else if (value == "8") {
					json.type = "Suppress end caps";  
				}  
			} else if (json.subclass == "AcDbHatch") {
				if (value == "0") {
					json.associative = false;  
				} else if (value == "1") {
					json.associative = true;  
				} 
			} else if (json.subclass == "AcDbBlockReference") {
				json.row_count = parseFloat(value);  
			} else if (json.subclass == "AcDbLeader") {
				if (value == "0") {
					json.arrow_head_disabled = "Yes";  
				} else if (value == "1") {
					json.arrow_head_disabled = "No";  
				} 
			} else if (json.subclass == "AcDbRasterImage") {
				if (value == "1") {
					json.clip_boundary_type = "Rectangular";  
				} else if (value == "2") {
					json.clip_boundary_type = "Polygonal";  
				} 
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.n_u_isolines = parseFloat(value);
			} 
		} else if (code == "72") {
			if (json.subclass == "AcDbSpline") {
				json.number_of_knots = parseFloat(value);
			} else if (json.subclass == "AcDbMline") {
				json.number_of_vertices = parseFloat(value);
			} else if (json.subclass == "AcDbMText") {
				if (value == "1") {
					json.drawing_direction = "Left to Right";  
				} else if (value == "3") {
					json.drawing_direction = "Top to Bottom";  
				} else if (value == "5") {
					json.drawing_direction = "Inherited from text style";  
				} 
			} else if (json.subclass == "AcDbLeader") {
				if (value == "0") {
					json.path_type = "Straight line";  
				} else if (value == "1") {
					json.path_type = "Spline";  
				} 
			} else if (json.subclass == "AcDbModelerGeometry" && json.specific_type == "AcDbRevolvedSurface") {
				json.n_v_isolines = parseFloat(value);
			}
		} else if (code == "73") {
			if (json.subclass == "AcDbSpline") {
				json.number_of_control_points = parseFloat(value);
			} else if (json.subclass == "AcDbLeader") {
				if (value == "0") {
					json.created = "with text annotation";  
				} else if (value == "1") {
					json.created = "with tolerance annotation";  
				} else if (value == "2") {
					json.created = "with block reference annotation";  
				} else if (value == "3") {
					json.created = "without any annotation";  
				} 
			} 
		} else if (code == "74") {
			if (json.subclass == "AcDbSpline") {
				json.number_of_fit_points = parseFloat(value);
			} else if (json.subclass == "AcDbLeader") {
				if (value == "0") {
					json.hookline_direction = "opposite direction from the horizontal vector";  
				} else if (value == "1") {
					json.hookline_direction = "the same direction as horizontal vector";  
				} 
			} 
		} else if (code == "75") {					
			if (json.subclass == "AcDbHatch") {
				if (value == "0") {
					json.style = "Hatch odd parity area";  
				} else if (value == "1") {
					json.style = "Hatch outermost area only ";  
				} else if (value == "2") {
					json.style = "Hatch through entire area";  
				} 
			} else if (json.subclass == "AcDbLeader") {
				if (value == "0") {
					json.has_hookline = "No";  
				} else if (value == "1") {
					json.has_hookline = "Yes";  
				} 
			} 
		} else if (code == "76") {					
			if (json.subclass == "AcDbHatch") {
				if (value == "0") {
					json.pattern = "User-defined";  
				} else if (value == "1") {
					json.pattern = "Predefined";  
				} else if (value == "2") {
					json.pattern = "Custom";  
				} 
			} else if (json.subclass == "AcDbLeader") {
				json.number_of_vertices = parseFloat(value);
			}
		} else if (code == "77") {
			if (json.subclass == "AcDbLeader") {
				json.color = value;
			} 
		} else if (code == "78") {
			if (json.subclass == "AcDbHatch") {
				json.number_of_lines = parseFloat(value);
			} 
		} else if (code == "90") {
			if (json.subclass == "AcDbPolyline") {
				json.number_of_vertices = parseFloat(value);
			} 
		} else if (code == "91") {
			if (json.subclass == "AcDbHatch") {
				json.number_of_boundary_paths = parseFloat(value);
			} else if (json.subclass == "AcDbRasterImage") {
				json.number_of_clip_vertices = parseFloat(value);
			} else if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference" && json.n_rows === undefined) {
				json.n_rows = parseFloat(value);
			}			
		} else if (code == "92") {
			if (json.etype == "ACAD_TABLE" && json.subclass === undefined) {
				json.n_bytes_proxy_graphics = parseFloat(value);
			} else if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference" && json.n_columns === undefined) {
				json.n_columns = parseFloat(value);
			}
		} else if (code == "98") {
			if (json.subclass == "AcDbHatch") {
				json.number_of_seed_points = parseFloat(value);
			} 
		} else if (code == "100" && value != "AcDbEntity" && value != "AcDbBlockBegin") {
			if (json.subclass && json.subclass != value) {
				json.specific_type = value;
			} else {
				json.subclass = value;
			}
		} else if (code == "140") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].text_height = parseFloat(value);
				} else {
					json.text_height = value;
				}
			}
		} else if (code == "141") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (!json.row_heights) json.row_heights = [];
				json.row_heights.push(parseFloat(value));
			}
		} else if (code == "142") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (!json.column_widths) json.column_widths = [];
				json.column_widths.push(parseFloat(value));
			}
		} else if (code == "144") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].block_scale = parseFloat(value);
				} else {
					json.block_scale = parseFloat(value);
				}
			}			
		} else if (code == "145") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].rotation = parseFloat(value);
				} else {
					json.rotation = parseFloat(value);
				}
			}	
		} else if (code == "170") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				let txt;
				if (value == "1") {
					txt = "Top left";  
				} else if (value == "2") {
					txt = "Top center";  
				} else if (value == "3") {
					txt = "Top right";  
				} else if (value == "4") {
					txt = "Middle left";  
				} else if (value == "5") {
					txt = "Middle center";  
				} else if (value == "6") {
					txt = "Middle right";  
				} else if (value == "7") {
					txt = "Bottom left";  
				} else if (value == "8") {
					txt = "Bottom center";  
				} else if (value == "9") {
					txt = "Bottom right";  
				} 
				if (json.cells && json.cells[json.cells.length - 1]) {					
					json.cells[json.cells.length - 1].alignement = txt;
				} else {
					json.alignement = txt;
				}
			}
		} else if (code == "171") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (!json.cells) json.cells = [];
				json.cells.push({alignment: "Middle center"});
				if (value == "1") {
					json.cells[json.cells.length - 1].type = "Text";
				} else if (value == "2") {
					json.cells[json.cells.length - 1].type = "Block";
				}
			}
		} else if (code == "175") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].border_width = parseFloat(value);
				} 
			}
		} else if (code == "176") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].border_height = parseFloat(value);
				} 
			}
		} else if (code == "210") {
			if (json.subclass == "AcDbLeader") {
				if (!json.normal_vector) json.normal_vector = [];
				json.normal_vector.push({x: parseFloat(value)});
			} 
		} else if (code == "211") {
			if (json.subclass == "AcDbLeader") {
				if (!json.horizontal_direction) json.horizontal_direction = [];
				json.horizontal_direction.push({x: parseFloat(value)});
			} 
		} else if (code == "212") {
			if (json.subclass == "AcDbLeader") {
				if (!json.offset_from_insertion_point) json.offset_from_insertion_point = [];
				json.offset_from_insertion_point.push({x: parseFloat(value)});
			} 
		} else if (code == "213") {
			if (json.subclass == "AcDbLeader") {
				if (!json.offset_from_annotation) json.offset_from_annotation = [];
				json.offset_from_annotation.push({x: parseFloat(value)});
			} 
		} else if (code == "220") {
			if (json.subclass == "AcDbLeader") {				
				json.normal_vector[json.normal_vector.length - 1]["y"] = parseFloat(value);
			} 
		} else if (code == "221") {
			if (json.subclass == "AcDbLeader") {				
				json.horizontal_direction[json.horizontal_direction.length - 1]["y"] = parseFloat(value);
			} 
		} else if (code == "222") {
			if (json.subclass == "AcDbLeader") {				
				json.offset_from_insertion_point[json.offset_from_insertion_point.length - 1]["y"] = parseFloat(value);
			} 
		} else if (code == "223") {
			if (json.subclass == "AcDbLeader") {				
				json.offset_from_annotation[json.offset_from_annotation.length - 1]["y"] = parseFloat(value);
			} 
		} else if (code == "230") {
			if (json.subclass == "AcDbLeader") {				
				json.normal_vector[json.normal_vector.length - 1]["z"] = parseFloat(value);
			} 
		} else if (code == "231") {
			if (json.subclass == "AcDbLeader") {				
				json.horizontal_direction[json.horizontal_direction.length - 1]["z"] = parseFloat(value);
			} 
		} else if (code == "232") {
			if (json.subclass == "AcDbLeader") {				
				json.offset_from_insertion_point[json.offset_from_insertion_point.length - 1]["z"] = parseFloat(value);
			} 
		} else if (code == "233") {
			if (json.subclass == "AcDbLeader") {				
				json.offset_from_annotation[json.offset_from_annotation.length - 1]["z"] = parseFloat(value);
			} 
		} else if (code == "275") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].line_weight_right = value;
				} else {
					json.line_weight_right = value;
				}
			}			
		} else if (code == "276") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].line_weight_bottom = value;
				} else {
					json.line_weight_bottom = value;
				}
			}			
		} else if (code == "278") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].line_weight_left = value;
				} else {
					json.line_weight_left = value;
				}
			}			
		} else if (code == "279") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].line_weight_top = value;
				} else {
					json.line_weight_top = value;
				}
			}			
		} else if (code == "289") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].top_boreder_visible = value == "1" ? true : false;
				} else {
					json.top_boreder_visible = value == "1" ? true : false;
				}
			}			
		} else if (code == "290") {					
			if (json.subclass == "AcDbRasterImage") {
				if (value == "0") {
					json.clip_mode = "Outside";  
				} else if (value == "1") {
					json.clip_mode = "Inside";  
				}
			} 
		} else if (code == "302") {					
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].text = value;
				} 
			}
		} else if (code == "303") {
			if (json.etype == "ACAD_TABLE" && json.subclass == "AcDbBlockReference") {
				if (json.cells && json.cells[json.cells.length - 1]) {
					json.cells[json.cells.length - 1].text = json.cells[json.cells.length - 1].text + value;
				} 
			}
		} else if (code == "310") {					
			if (json.subclass == "AcDbModelerGeometry") {
				json.binary_data = value; 
			} else if (json.etype == "ACAD_TABLE" && json.subclass === undefined) {
				if (!json.proxy_graphics_data) json.proxy_graphics_data = "";
				json.proxy_graphics_data = json.proxy_graphics_data + value;
			}
		} else if (code == "450") {					
			if (json.subclass == "AcDbHatch") {
				if (value == "0") {
					json.gradient = false;  
				} else if (value == "1") {
					json.gradient = true;  
				}
			} 
		}
	}
	
	processData = (array) => {		
		let COUNT = 0;			
		while(COUNT < array.length - 1) {			
			let code = array[COUNT].trim();
			let value = array[COUNT + 1].trim();
			
			if (code == "0" && value == "SECTION") {
				const code2 = array[COUNT + 2].trim();
				const value2 = array[COUNT + 3].trim();
				if (code2 == "2" && value2 == "TABLES") {
					COUNT = this.getTables(array, COUNT + 4);
					COUNT = this.getBlocks(array, COUNT + 4);
					this.getEntities(array, COUNT + 4);
					return;
				} 
			}
			COUNT = COUNT + 2;
		}
	}	
	
	getEllipseAngles = (entity) => {
		let dx = entity.major_end_dx;
		let dy = entity.major_end_dy;
		let dz = entity.major_end_dz;
		if (Math.abs(dz) > this.tolernace && Math.abs(dx) < this.tolerance) {
			dx = dz;
		}
		if (Math.abs(dz) > this.tolernace && Math.abs(dy) < this.tolerance) {
			dy = dz;
		}
		const ratio = entity.minorToMajor;
		const a = Math.sqrt(dx*dx + dy*dy);
		const b = ratio*a;		
		const theta = Math.atan2(dy, dx);		
		let sa = entity.start_parameter;
		let ea = entity.end_parameter;
		
		const zs = (a - b)*Math.sin(sa);
		const ze = (a - b)*Math.sin(ea);
		const dx1s = zs*Math.sin(theta);
		const dy1s = zs*Math.cos(theta);
		const dx1e = ze*Math.sin(theta);
		const dy1e = ze*Math.cos(theta);
		
		const xp1s = a*Math.cos(sa + theta);
		const yp1s = a*Math.sin(sa + theta);
		const xp1e = a*Math.cos(ea + theta);
		const yp1e = a*Math.sin(ea + theta);
		const true_sa = (Math.atan2((yp1s - dy1s), (xp1s + dx1s)))*180/Math.PI;
		const true_ea = (Math.atan2((yp1e - dy1e), (xp1e + dx1e)))*180/Math.PI;
		entity.start_angle = parseFloat(true_sa.toFixed(12));
		entity.end_angle = parseFloat(true_ea.toFixed(12));
		let temp1 = Math.atan2(ratio*Math.sin(sa), Math.cos(sa))*180/Math.PI;
		let temp2 = Math.atan2(ratio*Math.sin(ea), Math.cos(ea))*180/Math.PI;
		if (temp1 < 0) temp1 = temp1 + 360;
		if (temp2 < 0) temp2 = temp2 + 360;
		entity.start_angle2 = temp1;
		entity.end_angle2 = temp2;
		let A = this.area(entity);
		entity.area = A.area;
		if (A.area_sector) entity.area_sector = A.area_sector;
		if (A.area_full) entity.area_full = A.area_full;
	}	
	
	checkText = (text, item) => {
		if (item.subclass != "AcDbText") return false;
		if (text.height !== undefined && item.height != text.height) return false;
		if (text.rotation !== undefined && item.rotation != text.rotation) return false;
		if (text.style && (!item.style || item.style.toLowerCase() != text.style.toLowerCase())) return false;
		if (text.regex && (!item.text || !text.regex.test(item.text))) return false;
		
		let txt = item.text;
		if (text.i && txt) {
			txt = txt.toLowerCase();
		}
		let eq = !text.equals, neq = !text.notequals, st = !text.starts, nst = !text.notstarts, en = !text.ends, nen = !text.notends, con = !text.contains, ntc = !text.notcontains;
		
		if (text.equals) {
			eq = text.i ? (text.equals.toLowerCase() == txt) : (text.equals == txt);
		}
		if (text.notequals) {
			neq = text.i ? (text.notequals.toLowerCase() !== txt) : (text.notequals !== txt);
		}
		if (text.starts) {
			st = text.i ? (txt && txt.indexOf(text.starts.toLowerCase()) == 0) : (txt && txt.indexOf(text.starts) == 0);
		} 
		if (text.notstarts) {
			nst = text.i ? (!txt || txt.indexOf(text.notstarts.toLowerCase()) != 0) : (!txt || txt.indexOf(text.notstarts) != 0);
		} 
		if (text.ends) {
			en = text.i ? (txt && txt.lastIndexOf(text.ends.toLowerCase()) != -1 && (txt.lastIndexOf(text.ends.toLowerCase()) == (txt.length - text.ends.length))) : 
						  (txt && txt.lastIndexOf(text.ends) != -1 && (txt.lastIndexOf(text.ends) == (txt.length - text.ends.length)));
		} 
		if (text.notends) {
			nen = text.i ? (!txt || txt.lastIndexOf(text.notends.toLowerCase()) == -1 || (txt.lastIndexOf(text.notends.toLowerCase()) != (txt.length - text.notends.length))) : 
						  (!txt || txt.lastIndexOf(text.notends) == -1 || (txt.lastIndexOf(text.notends) != (txt.length - text.notends.length)));
		} 
		if (text.contains) {
			con = text.i ? (txt && txt.indexOf(text.contains.toLowerCase()) != -1) : (txt && txt.indexOf(text.contains) != -1);
		}
		if (text.notcontains) {
			ntc = text.i ? (txt && txt.indexOf(text.notcontains.toLowerCase()) == -1) : (txt && txt.indexOf(text.notcontains) == -1);
		}
		if (text.operator && (text.operator == "||" || text.operator.toLowerCase().trim() == "or")) {
			return ((text.equals && eq) || (text.starts && st) || (text.ends && en) || (text.contains && con) || 
			(text.notequals && neq) || (text.notstarts && nst) || (text.notends && nen) || (text.notcontains && ntc));
		} else {
			return eq && st && en && con && neq && nst && nen && ntc;
		}
		
	}

	checkColor = (color, item) => {	
		if ((typeof color == "number" && color == 0) || (typeof color == "string" && color.trim() == "0")) {
			color = "byblock";		
		} else if ((typeof color == "number" && color == 256) || (typeof color == "string" && color.trim() == "256")) {
			color = "bylayer";		
		} else if (typeof color == "number") {
			color = "" + color;
		}
		return color == item.color.toLowerCase();
	}
	
	getAxes = (plane) => {
		if (plane) {
			plane = plane.trim();
			if (plane != "x-y" && plane != "y-z" && plane != "z-x" && plane != "y-x" && plane != "z-y" && plane != "x-z") { // 3d plane to be added later
				return [];
			}
		}
		let ax1 = "x", ax2 = "y";
		if (plane) {			
			ax1 = plane.substring(0,1);
			ax2 = plane.substring(2,3);
		}
		return [ax1, ax2];
	}
	
	getCorners = (entity, plane) => {
		if (typeof entity != "object") {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		let [ax1, ax2] = this.getAxes(plane);
		if (plane && ax1 === undefined && ax2 === undefined) {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		let corners = [];
				
		if (entity.subclass == "AcDbPolyline") {
			const vertices = entity.vertices;			
			let temp = [];
			let x0 = vertices[vertices.length - 1][ax1], y0 = vertices[vertices.length - 1][ax2], x1 = vertices[0][ax1], y1 = vertices[0][ax2], x2, y2;
			for (let i = 1; i <= vertices.length; i++) {
				let j = i < vertices.length ? i : 0;				
				x2 = vertices[j][ax1];
				y2 = vertices[j][ax2];	
				const m1 = Math.abs((y1 - y0)/(x1 - x0));	
				const m2 = Math.abs((y2 - y1)/(x2 - x1));				
				const txt = x1 + "," + y1;
				if (Math.abs(m1 - m2) > this.tolerance && temp.indexOf(txt) == -1) {
					corners.push(vertices[i == vertices.length ? (vertices.length - 1) : (j - 1)]);
					temp.push(txt);
				}					
				x0 = x1;
				y0 = y1;
				x1 = x2;
				y1 = y2;
			}
		}
		return corners;
	}
	
	checkNoOfSides = (criteria, item, ax1, ax2) => {
		if (item.subclass == "AcDbPolyline") {
			const vertices = item.vertices;
			let temp = [vertices[0]], nSides;
			for (let i = 1; i < vertices.length; i++) {				
				const isCorner = this.checkCorner([vertices[i][ax1], vertices[i][ax2]], item, ax1, ax2);
				let exists = false;
				for (let j = 1; j < temp.length; j++) {
					if (Math.abs(temp[j][ax1] - vertices[i][ax1]) <= this.tolerance && Math.abs(temp[j][ax2] - vertices[i][ax2]) <= this.tolerance) {
						exists = true;
					}
				}
				if (isCorner && !exists) {
					temp.push(vertices[i]);
				}
			}
			if (item.type == "Closed") {
				nSides = temp.length;
			} else {
				nSides = temp.length - 1;
			}
			const n = criteria.value || 1;
			const c = criteria.comparison || "gte";
			
			if (c == "eq") {
				return n == nSides;
			} else if (c == "gt") {
				return nSides > n;
			} else if (c == "gte") {
				return nSides >= n;
			} else if (c == "lt") {
				return nSides < n;
			} else if (c == "lte") {
				return nSides <= n;
			} else if (c == "ne") {
				return nSides != n;
			} 
		}
		return false;
	}
	
	checkBetween = (boundaries, item) => {
		const xmin = boundaries.xmin || -Infinity;
		const xmax = boundaries.xmax || Infinity;
		const ymin = boundaries.ymin || -Infinity;
		const ymax = boundaries.ymax || Infinity;
		const zmin = boundaries.zmin || -Infinity;
		const zmax = boundaries.zmax || Infinity;
		
		if (item.subclass == "AcDbLine" || item.subclass == "AcDbRay" || item.subclass == "AcDbMline") {
			return (item.start_x - xmin)*(item.start_x - xmax) <= this.tolerance && (item.start_y - ymin)*(item.start_y - ymax) <= this.tolerance &&
			(item.start_z - zmin)*(item.start_z - zmax) <= this.tolerance && (item.end_x - xmin)*(item.end_x - xmax) <= this.tolerance &&
				    (item.end_y - ymin)*(item.end_y - ymax) <= this.tolerance && (item.end_z - zmin)*(item.end_z - zmax) <= this.tolerance;
		} else if (item.subclass == "AcDbPolyline") {
			const vertices = item.vertices;
			for (let i = 0; i < vertices.length; i++) {
				if ((vertices[i].x - xmin)*(vertices[i].x - xmax) > this.tolerance || (vertices[i].y - ymin)*(vertices[i].y - ymax) > this.tolerance
				|| (vertices[i].z - zmin)*(vertices[i].z - zmax) > this.tolerance) {
					return false;
				}
			}
			return true;
		} else if (item.subclass == "AcDbSpline") {
			const points = item.control_points;
			for (let i = 0; i < points.length; i++) {
				if ((points[i].x - xmin)*(points[i].x - xmax) > this.tolerance || (points[i].y - ymin)*(points[i].y - ymax) > this.tolerance || 
				 (points[i].z - zmin)*(points[i].z - zmax) > this.tolerance) {
					return false;
				}
			}
			return true;
		} else if (item.subclass == "AcDbTrace") {
			const corners = item.corners;
			for (let i = 0; i < corners.length; i++) {
				if ((corners[i].x - xmin)*(corners[i].x - xmax) > this.tolerance || (corners[i].y - ymin)*(corners[i].y - ymax) > this.tolerance || 
				(corners[i].z - zmin)*(corners[i].z - zmax) > this.tolerance) {
					return false;
				}
			}
			return true;
		} else if (item.subclass == "AcDbHatch") {
			const spoints = item.seed_points;
			for (let i = 0; i < spoints.length; i++) {
				if ((spoints[i].x - xmin)*(spoints[i].x - xmax) > this.tolerance || (spoints[i].y - ymin)*(spoints[i].y - ymax) > this.tolerance || 
				(spoints[i].z - zmin)*(spoints[i].z - zmax) > this.tolerance) {
					return false;
				}
			}
			return true;
		} else {
			return (item.x - xmin)*(item.x - xmax) <= this.tolerance && (item.y - ymin)*(item.y - ymax) <= this.tolerance && (item.z - zmin)*(item.z - zmax) <= this.tolerance;
		} 
	}	
	
	filter = (criteria, entities, plane) => {
		if (!criteria || Array.isArray(criteria) || typeof criteria != "object") {
			throw new Error(ErrorMessages.FILTER_CRITERIA);
			return;
		}			
		if (!entities) entities = this.entities;
		if (!entities) {
			throw new Error(ErrorMessages.FILTER);
			return;
		}
		if (!Array.isArray(entities)) {
			throw new Error(ErrorMessages.FILTER_ENTITIES);
			return;
		}
		let [ax1, ax2] = this.getAxes(plane);
		if (plane && ax1 === undefined && ax2 === undefined) {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		return entities.filter((item) => 
			(!criteria.subclass || !Array.isArray(criteria.subclass) || criteria.subclass.filter((en) => (("acdb" + en) == item.subclass.toLowerCase()) || (item.specific_type && ("acdb" + en) == item.specific_type.toLowerCase())).length > 0) &&
			(!criteria.layer || !Array.isArray(criteria.layer) || criteria.layer.filter((la) => la == item.layer).length > 0) && 
			(!criteria.between || this.checkBetween(criteria.between, item)) &&
			(!criteria.radius || criteria.radius == item.radius) &&
			(criteria.text === undefined || this.checkText(criteria.text, item)) &&
			(criteria.color === undefined || this.checkColor(criteria.color, item)) &&
			(!criteria.line_type || (item.line_type && criteria.line_type.toLowerCase() == item.line_type.toLowerCase())) &&
			(!criteria.visibility || (item.visibility && criteria.visibility.toLowerCase() == item.visibility.toLowerCase())) &&
			(!criteria.arc || Math.abs(criteria.arc.angle*(criteria.arc.unit == "degrees" ? 1 : 180/Math.PI) - Math.abs(item.start_angle - item.end_angle)) < this.tolerance) &&	
			(!criteria.nsides || this.checkNoOfSides(criteria.nsides, item, ax1, ax2)));
	}
	
	checkCorner = (data, item, ax1, ax2) => {
		if (!Array.isArray(data) && data.subclass != "AcDbPoint") return false;
		const etype = item.subclass;
		const x = Array.isArray(data) ? data[0] : data[ax1];
		const y = Array.isArray(data) ? data[1] : data[ax2];
		if (etype == "AcDbPoint" || etype == "AcDbText" || etype == "AcDbSpline" || etype == "AcDbMline" 
			|| etype == "AcDbLine" || etype == "AcDbCircle" || etype == "AcDbEllipse") {
			return false;
		} else if (etype == "AcDbPolyline") {
			const vertices = item.vertices;			
			let x0 = vertices[vertices.length - 1][ax1], y0 = vertices[vertices.length - 1][ax2], x1 = vertices[0][ax1], y1 = vertices[0][ax2], x2, y2;
			for (let i = 1; i <= vertices.length; i++) {
				let j = i < vertices.length ? i : 0;				
				x2 = vertices[j][ax1];
				y2 = vertices[j][ax2];	
				const m1 = Math.abs((y1 - y0)/(x1 - x0));	
				const m2 = Math.abs((y2 - y1)/(x2 - x1));				
				const txt = x1 + "," + y1;
				if (Math.abs(m1 - m2) > this.tolerance && Math.abs(x - x1) <= this.tolerance && Math.abs(y - y1) <= this.tolerance) {
					return true;
				}					
				x0 = x1;
				y0 = y1;
				x1 = x2;
				y1 = y2;
			}
			return false;
		} 
		return false;
	}	
	
	checkEccentric = (entity1, entity2, plane) => {
		if (typeof entity1 != "object" || typeof entity2 != "object") {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		let [ax1, ax2] = this.getAxes(plane);
		if (plane && ax1 === undefined && ax2 === undefined) {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		const etype1 = entity1.subclass;
		const etype2 = entity2.subclass;
		if (etype1 == "AcDbCircle" && etype2 == "AcDbCircle") {
			let xc1 = entity1[ax1];
			let yc1 = entity1[ax2];
			let xc2 = entity2[ax1];
			let yc2 = entity2[ax2];
			const r1 = entity1.radius;
			const r2 = entity2.radius;
			if ((Math.abs(xc1 - xc2) < this.tolerance && Math.abs(yc1 - yc2) < this.tolerance) || Math.abs(r1 - r2) < this.tolerance) {
				return false;
			}
			
			const isInside = ((xc1 - xc2)*(xc1 - xc2) + (yc1 - yc2)*(yc1 - yc2)) + this.tolerance < (r2 - r1)*(r2 - r1);  
				// the center of the inner circle should be within an imaginery circle (with the same center as the outer circle and a radius of |r2 - r1|)
			return isInside;
		}
		return false;		
	}
	
	checkConcentric = (entity1, entity2, plane) => {
		if (typeof entity1 != "object" || typeof entity2 != "object") {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		let [ax1, ax2] = this.getAxes(plane);
		if (plane && ax1 === undefined && ax2 === undefined) {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		const etype1 = entity1.subclass;
		const etype2 = entity2.subclass;
		
		if (etype1 == "AcDbCircle" && etype2 == "AcDbCircle") {
			let xc1 = entity1[ax1];
			let yc1 = entity1[ax2];
			let xc2 = entity2[ax1];
			let yc2 = entity2[ax2];
			const r1 = entity1.radius;
			const r2 = entity2.radius;
			return Math.abs(xc1 - xc2) < this.tolerance && Math.abs(yc1 - yc2) < this.tolerance && Math.abs(r1 - r2) > this.tolerance;
		}
		return false;
	}	
	
	distance = (entity, entity2, plane) => {
		return Distance(entity, entity2, plane, this.getAxes, this.tolerance);
	}
	
	length = (entity, plane) => {
		return Length(entity, plane, this.getAxes, this.tolerance);			
	}	
	
	intersection = (entity1, entity2, plane) => {
		return Intersection(entity1, entity2, plane, this.getAxes, this.tolerance);		
	}
	
	closest = (entity, etype, mode, list) => {
		return Closest(entity, etype, mode, list, this.entities, this.tolerance);
	}
	
	triangulate = (vertices, plane)  => {
		return Triangulate(vertices, plane, this.getAxes, this.tolerance);
	}
	
	area = (entity, plane)  => {
		return Area(entity, plane, this.getAxes, this.tolerance);
	}
}
	
module.exports = Entities;
