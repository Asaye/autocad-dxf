const ErrorMessages = require("./ErrorMessages.json");
const DIMSTYLE_CODES = require("./DIMSTYLE_CODES.json");
const KEYS = require("./KEYS");
const CODES = require("./CODES");

const Entities = class {	
	constructor(data, tolerance) {
		this.entities = [];
		this.tables = {};
		this.blocks = [];
		this.tolerance = tolerance || 0.0001;
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
				this.entities.push(json);
				return COUNT + 2;
			}
					
			if (code == "0" && (!json || (json.subclass && json.subclass != "AcDb3dPolyline" && json.etype != "SEQEND"))) {					
				if (json) this.entities.push(json);
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
			} 
		} else if (code == "43") {
			if (json.subclass == "AcDbBlockReference") {
				json.scale_z = parseFloat(value);  
			} 
		} else if (code == "44") {
			if (json.subclass == "AcDbBlockReference") {
				json.column_spacing = parseFloat(value);  
			} 
		} else if (code == "45") {
			if (json.subclass == "AcDbBlockReference") {
				json.row_spacing = parseFloat(value);  
			} 
		} else if (code == "48") {
			json.line_scale = parseFloat(value);
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
		} else if (code == "290") {					
			if (json.subclass == "AcDbRasterImage") {
				if (value == "0") {
					json.clip_mode = "Outside";  
				} else if (value == "1") {
					json.clip_mode = "Inside";  
				}
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
		if (typeof entity != "object" || typeof entity2 != "object") {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		let [ax1, ax2] = this.getAxes(plane);
		if (plane && ax1 === undefined && ax2 === undefined) {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		//array/point/circle/text/vertex/ellipse
		let etype = entity.subclass;
		let etype2 = entity2.subclass;
		if (Array.isArray(entity) && Array.isArray(entity2)) {
			return Math.sqrt((entity[0] - entity2[0])*(entity[0] - entity2[0]) + (entity[1] - entity2[1])*(entity[1] - entity2[1]));
		} else if ((etype == "AcDbPoint" || etype == "AcDbCircle" || etype == "AcDbEllipse" || etype == "AcDbText" || etype == "AcDbMText" || etype == "AcDbVertex")  && 
			(etype2 == "AcDbPoint" || etype2 == "AcDbCircle" || etype2 == "AcDbEllipse" || etype2 == "AcDbText" || etype2 == "AcDbMText" || etype2 == "AcDbVertex")) {
				const x1 = entity[ax1];
				const y1 = entity[ax2];
				const x2 = entity2[ax1];
				const y2 = entity2[ax2];
			return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
		} else if ((etype == "AcDbPoint" || etype == "AcDbCircle" || etype == "AcDbEllipse" || etype == "AcDbText" || etype == "AcDbMText" || etype == "AcDbVertex")  && 
			Array.isArray(entity2)) {
				const x1 = entity[ax1];
				const y1 = entity[ax2];
				const x2 = entity2[0];
				const y2 = entity2[1];
				return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
		} else if ((etype2 == "AcDbPoint" || etype2 == "AcDbCircle" || etype2 == "AcDbEllipse" || etype2 == "AcDbText" || etype2 == "AcDbMText" || etype2 == "AcDbVertex")  && 
			Array.isArray(entity)) {
				const x1 = entity2[ax1];
				const y1 = entity2[ax2];
				const x2 = entity[0];
				const y2 = entity[1];
				return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
		}  else if (Array.isArray(entity) && typeof entity2 == "object") {
			etype = "point";
			entity = {x: entity[0], y: entity[1]};
		} else if (Array.isArray(entity2) && typeof entity == "object") {
			etype = "point";
			const temp = entity;
			entity = {x: entity2[0], y: entity2[1]};
			entity2 = temp;
		}
		
		if (etype == "AcDbLine" || etype2 == "AcDbLine") {
			if (etype == "AcDbLine") {
				const temp = entity;
				entity = entity2;
				entity2 = temp;
				etype = etype2.toLowerCase().replace("acdb", "");
			} else {
				etype = etype.toLowerCase().replace("acdb", "");
			}
			
			const x1 = entity2[`start_${ax1}`];
			const y1 = entity2[`start_${ax2}`];
			const x2 = entity2[`end_${ax1}`];
			const y2 = entity2[`end_${ax2}`];
			const slope = (y2 - y1)/(x2 - x1);
			
			if (etype == "point" || etype == "circle" || etype == "ellipse" || etype == "text" || etype == "mtext" || etype == "vertex") {			
				if (slope == Infinity || slope == -Infinity) {					
					return Math.abs(entity[ax1] - x1);
				} else {
					const A = -slope;
					const B = 1;
					const C = slope*x1 - y1;
					const D = Math.sqrt(A*A + 1);
					return Math.abs(A*entity[ax1] + B*entity[ax2] + C)/D;
				}				
			} else if (etype == "line") { 
				const x21 = entity[`start_${ax1}`];
				const y21 = entity[`start_${ax2}`];
				const x22 = entity[`end_${ax1}`];
				const y22 = entity[`end_${ax2}`];
				const slope2 = -(y22 - y21)/(x22 - x21);
				
				if (Math.abs(slope) == Infinity && Math.abs(slope2) >= 1/this.tolerance || 
					Math.abs(slope2) == Infinity && Math.abs(slope) >= 1/this.tolerance ||
					Math.abs(Math.abs(slope2) - Math.abs(slope)) <= this.tolerance) {
						if (Math.abs(slope) == Infinity || Math.abs(slope2) == Infinity) {
							return Math.abs(x21 - x1);
						} else {
							const A = -slope;
							const B = 1;
							const C = slope*x1 - y1;
							const D = Math.sqrt(A*A + B*B);
							return Math.abs(A*x21 + B*y21 + C)/D;
						}
				} else {
					return undefined;
				}
			}				
		} else if (etype == "AcDbPolyline" || etype2 == "AcDbPolyline") {
			if (etype == "AcDbPolyline") {
				const temp = entity;
				entity = entity2;
				entity2 = temp;
				etype = etype2.toLowerCase().replace("acdb", "");
			} else {
				etype = etype.toLowerCase().replace("acdb", "");
			}
			
			if (etype == "point" || etype == "circle" || etype == "ellipse" || etype == "text" || etype == "mtext" || etype == "vertex") {
				const vertices = JSON.parse(JSON.stringify(entity2.vertices));
				let x0 = vertices[0][ax1], y0 = vertices[0][ax2], x1, y1;
				let dmin = Infinity;
				if (entity.type == "Closed") vertices.push(vertices[0]);
				const xref = entity[ax1], yref = entity[ax2];
				for (let i = 1; i < vertices.length; i++) {
					x1 = vertices[i][ax1];
					y1 = vertices[i][ax2];
					const slope = (y1 - y0)/(x1 - x0);
					if (slope == Infinity || slope == -Infinity) {					
						dmin = Math.min(dmin, Math.abs(entity2[ax1] - x1));
					} else {
						const A = -slope;
						const B = 1;
						const C = slope*x1 - y1;
						const D = Math.sqrt(A*A + 1);
						dmin = Math.min(dmin, Math.abs(A*xref + B*yref + C)/D);
					}
					x0 = x1;
					y0 = y1;
				}
				return dmin;				
			} 				
		}
	}
	
	length = (entity, plane) => {
		if (typeof entity != "object") {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		let [ax1, ax2] = this.getAxes(plane);
		if (plane && ax1 === undefined && ax2 === undefined) {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		const etype = entity.subclass;
		if (etype == "AcDbLine") {
			const x1 = entity[`start_${ax1}`];
			const y1 = entity[`start_${ax2}`];
			const x2 = entity[`end_${ax1}`];
			const y2 = entity[`end_${ax2}`];
			return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
		} else if (etype == "AcDbPolyline") {
			const vertices = JSON.parse(JSON.stringify(entity.vertices));
			if (entity.type == "Closed") vertices.push(vertices[0]);
			let length = 0;
			for (let i = 1; i < vertices.length; i++) {
				const x1 = vertices[i - 1][`${ax1}`];
				const y1 = vertices[i - 1][`${ax2}`];
				const x2 = vertices[i][`${ax1}`];
				const y2 = vertices[i][`${ax2}`];
				length = length + Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
			}			
			return length;
		} else if (etype == "AcDbCircle") {
			const start_angle = entity.start_angle;
			const end_angle = entity.end_angle;
			if (start_angle && end_angle) {
				let d;
				if (start_angle < end_angle) {
					d = Math.abs(start_angle - end_angle);
				} else {
					d = 360 - Math.abs(start_angle - end_angle);
				}				
				return 2*Math.PI*(entity.radius)*d/360;
			} else {
				return 2*Math.PI*entity.radius;
			}
		} else if (etype == "AcDbEllipse") {			
			if (Math.abs(Math.abs(entity.start_angle - entity.end_angle) - 2*Math.PI) > this.tolerance) { // full ellipse
				return;							
			}
			const dx = entity[`major_end_d${ax1}`];
			const dy = entity[`major_end_d${ax2}`];
			const ratio = entity.minorToMajor;
			const a = Math.sqrt(dx*dx + dy*dy);
			const b = ratio*a;
			const h = (a - b)*(a - b)/((a + b)*(a + b));
			
			return Math.PI*(a + b)*(1 + 3*h/(10 + Math.sqrt(4 - 3*h)));  //Approximate
		}
		return;		
	}
	
	vLineIntersection = (x11, y11, x12, y12, x21, y21, x22, y22, ax1, ax2) => {
		const m1 = (y12 - y11)/(x12 - x11);
		const m2 = (y22 - y21)/(x22 - x21);
		
		if (Math.abs(m1) == Infinity && Math.abs(m2) != Infinity) {
			const y = m2*(x11 - x22) + y22;
			if ((y - y11)*(y - y12) < this.tolerance) {
				let json = {};
				json[`${ax1}`] = x11;
				json[`${ax2}`] = y;
				return [json];
			}
			return [];
		} else if (Math.abs(m1) != Infinity && Math.abs(m2) == Infinity) {
			const y = m1*(x22 - x12) + y12;
			if ((y - y21)*(y - y22) < this.tolerance) {
				let json = {};
				json[`${ax1}`] = x22;
				json[`${ax2}`] = y;
				return [json];
			}
			return [];
		} 
		return [];
	}
	
	intersection = (entity1, entity2, plane) => {
		if (typeof entity1 != "object" || typeof entity2 != "object" || Array.isArray(entity1) || Array.isArray(entity2)) {
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
	
		if (etype1 == "AcDbLine" && etype2 == "AcDbLine") {
			const x11 = entity1[`start_${ax1}`];
			const y11 = entity1[`start_${ax2}`];
			const x12 = entity1[`end_${ax1}`];
			const y12 = entity1[`end_${ax2}`];
			const x21 = entity2[`start_${ax1}`];
			const y21 = entity2[`start_${ax2}`];
			const x22 = entity2[`end_${ax1}`];
			const y22 = entity2[`end_${ax2}`];
			
			const m1 = (y12 - y11)/(x12 - x11);
			const m2 = (y22 - y21)/(x22 - x21);
			
			if (Math.abs(m1) == Infinity || Math.abs(m2) == Infinity) {
				return this.vLineIntersection(x11, y11, x12, y12, x21, y21, x22, y22, ax1, ax2);
			}		
			
			if (Math.abs((Math.abs(m1) - Math.abs(m2))) < this.tolerance) return [];
			const x = ((-m2*x21 + y21) - (-m1*x11 + y11))/(m1 - m2);
			const y = m1*x + (-m1*x11 + y11);
			const isCrossing = (x - x11)*(x - x12) < this.tolerance && (x - x21)*(x - x22) < this.tolerance && 
			            (y - y11)*(y - y12) < this.tolerance && (y - y21)*(y - y22) < this.tolerance;
			
			if (isCrossing) {
				let json = {};
				json[`${ax1}`] = x;
				json[`${ax2}`] = y;
				return [json];
			} else {
				return [];
			}
		} else if ((etype1 == "AcDbLine" && etype2 == "AcDbPolyline") || (etype2 == "AcDbLine"  && etype1 == "AcDbPolyline")) {
			if (etype1 == "AcDbPolyline") {
				const temp = entity1;
				entity1 = entity2;
				entity2 = temp;
			}
			const x11 = entity1[`start_${ax1}`];
			const y11 = entity1[`start_${ax2}`];
			const x12 = entity1[`end_${ax1}`];
			const y12 = entity1[`end_${ax2}`];
			const m1 = (y12 - y11)/(x12 - x11);
			const vertices = JSON.parse(JSON.stringify(entity2.vertices));
			
			if (entity2.type == "Closed") {
				vertices.push(vertices[0]);
			}
			
			let points = [];
			for (let i = 1; i < vertices.length; i++) {
				const x21 = vertices[i - 1][`${ax1}`];
				const y21 = vertices[i - 1][`${ax2}`];
				const x22 = vertices[i][`${ax1}`];
				const y22 = vertices[i][`${ax2}`];				
				const m2 = (y22 - y21)/(x22 - x21);		
				const x = ((-m2*x21 + y21) - (-m1*x11 + y11))/(m1 - m2);
				const y = m1*x + (-m1*x11 + y11);
				
				if (Math.abs(m1) == Infinity || Math.abs(m2) == Infinity) {
					const intersection = this.vLineIntersection(x11, y11, x12, y12, x21, y21, x22, y22, ax1, ax2);
					if (intersection.length > 0) {						
						points.push(intersection[0]);
					}
				} else {
					const temp = (x - x11)*(x - x12) < this.tolerance && (x - x21)*(x - x22) < this.tolerance && 
					   (y - y11)*(y - y12) < this.tolerance && (y - y21)*(y - y22) < this.tolerance;
					if (temp) {
						let json = {};
						json[`${ax1}`] = x;
						json[`${ax2}`] = y;
						points.push(json);
					}
				}
				
			}
			
			return points;			
		} else if ((etype1 == "AcDbLine" && etype2 == "AcDbCircle" && entity2.etype != "ARC") || 
			(etype2 == "AcDbLine" && etype1 == "AcDbCircle"  && entity1.etype != "ARC")) {
			if (etype1 == "AcDbCircle") {
				const temp = entity1;
				entity1 = entity2;
				entity2 = temp;
			}
			const x0 = entity2[`${ax1}`];
			const y0 = entity2[`${ax2}`];
			const radius = entity2.radius;
			const x1 = entity1[`start_${ax1}`];
			const y1 = entity1[`start_${ax2}`];
			const x2 = entity1[`end_${ax1}`];
			const y2 = entity1[`end_${ax2}`];
			const m = (y2 - y1)/(x2 - x1);
			
			if (Math.abs(m) == Infinity) {
				const det = radius*radius - (x1 - x0)*(x1 - x0);
				if (det < 0) {
					return [];
				} else if (det == 0) {
					if ((y0 - y1)*(y0 - y2) > this.tolerance) return [];
					let json = {};
					json[`${ax1}`] = x1;
					json[`${ax2}`] = y0;
					return [json];
				} else {
					let ysol1 = y0 - Math.sqrt(det);
					let ysol2 = y0 + Math.sqrt(det);
					let points = [];
					if ((ysol1 - y1)*(ysol1 - y2) < this.tolerance) {
						let json1 = {};
						json1[`${ax1}`] = x1;
						json1[`${ax2}`] = ysol1;
						points.push(json1);
					}
					if ((ysol2 - y1)*(ysol2 - y2) < this.tolerance) {
						let json2 = {};
						json2[`${ax1}`] = x1;
						json2[`${ax2}`] = ysol2;
						points.push(json2);
					}
					return points;
				}
			}
			
			const b = y1 - m*x1;
			const A = m*m + 1;
			const B = 2*(m*(b - y0) - x0);
			const C = x0*x0 + (b - y0)*(b - y0) - radius*radius;
			const det = B*B - 4*A*C;
			let points = [];
			if (det < 0) {
				return [];
			} else if (det == 0) {
				const sol1 = (-B)/(2*A);
				const ysol1 = m*sol1 + b;
				if (((sol1 - x1)*(sol1 - x2) > this.tolerance) || ((ysol1 - y1)*(ysol1 - y2) > this.tolerance)) return [];
				let json = {};
				json[`${ax1}`] = sol1;
				json[`${ax2}`] = ysol1;
				points.push(json);
			} else {
				const sol1 = (-B + Math.sqrt(det))/(2*A);
				const sol2 = (-B - Math.sqrt(det))/(2*A);
				const ysol1 = m*sol1 + b;
				const ysol2 = m*sol2 + b;
				
				const isCrossing =  ((sol1 - x1)*(sol1 - x2) < this.tolerance && (ysol1 - y1)*(ysol1 - y2) < this.tolerance) ||
					   ((sol2 - x1)*(sol2 - x2) < this.tolerance && (ysol2 - y1)*(ysol2 - y2) < this.tolerance);
				
								
				if (isCrossing) {
					if ((sol1 - x1)*(sol1 - x2) < this.tolerance && (ysol1 - y1)*(ysol1 - y2) < this.tolerance) {
						let json1 = {};
						json1[`${ax1}`] = sol1;
						json1[`${ax2}`] = ysol1;
						points.push(json1);
					}
					if ((sol2 - x1)*(sol2 - x2) < this.tolerance && (ysol2 - y1)*(ysol2 - y2) < this.tolerance) {
						let json2 = {};
						json2[`${ax1}`] = sol2;
						json2[`${ax2}`] = ysol2;
						points.push(json2);
					}
				} 
				
			}
			return points;
		} else if ((etype1 == "AcDbLine" && etype2 == "AcDbCircle") || (etype2 == "AcDbLine" && etype1 == "AcDbCircle")) {
			if (etype1 == "AcDbCircle") {
				const temp = entity1;
				entity1 = entity2;
				entity2 = temp;
			}
			const xc = entity2[`${ax1}`];
			const yc = entity2[`${ax2}`];
			const radius = entity2.radius;
			const x1 = entity1[`start_${ax1}`];
			const y1 = entity1[`start_${ax2}`];
			const x2 = entity1[`end_${ax1}`];
			const y2 = entity1[`end_${ax2}`];
			let m = (y2 - y1)/(x2 - x1);
			let sol1, sol2, ysol1, ysol2;
			let points = [];
			
			if (Math.abs(m) == Infinity) {
				const det = radius*radius - (x1 - xc)*(x1 - xc);
				
				if (det < 0) {
					return [];
				} else if (det == 0) {				
					sol1 = x1;
					ysol1 = yc;
				} else {
					ysol1 = yc - Math.sqrt(det);
					ysol2 = yc + Math.sqrt(det);
					let points = [];
					if ((ysol1 - y1)*(ysol1 - y2) < this.tolerance) {						
						sol1 = x1;
					}
					if ((ysol2 - y1)*(ysol2 - y2) < this.tolerance) {						
						sol2 = x1;
					}
				}
			} else {			
				const b = y1 - m*x1;
				const A = m*m + 1;
				const B = 2*(m*(b - yc) - xc);
				const C = xc*xc + (b - yc)*(b - yc) - radius*radius;
				const det = B*B - 4*A*C;
				
				if (det < this.tolerance) {
					return [];
				} else {
					sol1 = (-B + Math.sqrt(det))/(2*A);
					sol2 = (-B - Math.sqrt(det))/(2*A);
					ysol1 = m*sol1 + b;
					ysol2 = m*sol2 + b;
				}
			}
			let sa = entity2.start_angle*Math.PI/180;
			let ea = entity2.end_angle*Math.PI/180;
					
			if (sol1 && ysol1) {
				//let ang1 = Math.atan2((ysol1 - yc),(sol1 - xc));
				let ang1 = Math.abs(Math.atan((ysol1 - yc)/(sol1 - xc)));
				const isCrossing1 =  ((sol1 - x1)*(sol1 - x2) < this.tolerance && (ysol1 - y1)*(ysol1 - y2) < this.tolerance);
				if (ysol1 > yc && sol1 < xc) {
				 	ang1 = Math.PI - ang1;
				} else if (ysol1 < yc && sol1 < xc) {
					ang1 = Math.PI + ang1;
				} else if (ysol1 < yc && sol1 > xc) {
					ang1 = 2*Math.PI - ang1;
				} 
				if (isCrossing1 && ((sa < ea && ((ang1 - sa)*(ang1 - ea) < this.tolerance)) || (sa > ea && ((ang1 - sa)*(ang1 - ea) > this.tolerance)))) {
					let json1 = {};
					json1[`${ax1}`] = sol1;
					json1[`${ax2}`] = ysol1;
					points.push(json1);
				}
			}
			
			if (sol2 && ysol2) {
				//let ang2 = Math.atan2((ysol2 - yc),(sol2 - xc));
				let ang2 = Math.abs(Math.atan((ysol2 - yc)/(sol2 - xc)));
				const isCrossing2 =  ((sol2 - x1)*(sol2 - x2) < this.tolerance && (ysol2 - y1)*(ysol2 - y2) < this.tolerance);
				if (ysol2 > yc && sol2 < xc) {
					ang2 = Math.PI - ang2;
				} else if (ysol2 < yc && sol2 < xc) {
					ang2 = Math.PI + ang2;
				} else if (ysol2 < yc && sol2 > xc) {
					ang2 = 2*Math.PI - ang2;
				} 
				if (isCrossing2 && ((sa < ea && ((ang2 - sa)*(ang2 - ea) < this.tolerance)) || (sa > ea && ((ang2 - sa)*(ang2 - ea) > this.tolerance)))) {
					let json2 = {};
					json2[`${ax1}`] = sol2;
					json2[`${ax2}`] = ysol2;
					points.push(json2);
				}
			}
			
			return points;	
		} else if ((etype1 == "AcDbLine" && etype2 == "AcDbEllipse") || (etype2 == "AcDbLine" &&	etype1 == "AcDbEllipse")) {
			if (etype1 == "AcDbEllipse") {
				const temp = entity1;
				entity1 = entity2;
				entity2 = temp;
			}
			
			const xc = entity2[`${ax1}`];
			const yc = entity2[`${ax2}`];
			const radius = entity2.radius;
			const x1 = entity1[`start_${ax1}`];
			const y1 = entity1[`start_${ax2}`];
			const x2 = entity1[`end_${ax1}`];
			const y2 = entity1[`end_${ax2}`];
			let m = (y2 - y1)/(x2 - x1);
			let sol1, sol2, ysol1, ysol2;
			let points = [];
			
			const dx = entity2[`major_end_d${ax1}`];
			const dy = entity2[`major_end_d${ax2}`];
			const ratio = entity2.minorToMajor;
			const a = Math.sqrt(dx*dx + dy*dy);
			const b = ratio*a;
			const theta = Math.atan2(dy, dx);
			const A = Math.pow(a*Math.sin(theta), 2) + Math.pow(b*Math.cos(theta), 2);
			const B = 2*(b*b - a*a)*Math.sin(theta)*Math.cos(theta);
			const C = Math.pow(a*Math.cos(theta), 2) + Math.pow(b*Math.sin(theta), 2);
			const D = -2*A*xc - B*yc;
			const E = -B*xc - 2*C*yc;
			const F = A*xc*xc + B*xc*yc + C*yc*yc - a*a*b*b;
			let sa = entity2.start_angle;
			let ea = entity2.end_angle;	
			
			if (Math.abs(m) == Infinity) {
				const det = (B*x1 + E)*(B*x1 + E) - 4*C*(A*x1*x1 + D*x1 + F);				
				if (det < 0) {
					return [];
				} else if (det == 0) {				
					sol1 = x1;
					ysol1 = -(B*x1 + E)/(2*C);
				} else {
					ysol1 = -(B*x1 + E - Math.sqrt(det))/(2*C);
					ysol2 = -(B*x1 + E + Math.sqrt(det))/(2*C);
					
					if ((ysol1 - y1)*(ysol1 - y2) < this.tolerance) {						
						sol1 = x1;
					}
					if ((ysol2 - y1)*(ysol2 - y2) < this.tolerance) {						
						sol2 = x1;
					}
				}
			} else {
				const y_int = -m*x1 + y1;
				const AA = (A + B*m + C*m*m);
				const BB = (B*y_int + 2*C*m*y_int + D + E*m);
				const CC = (C*y_int*y_int + E*y_int + F);
				const det = BB*BB - 4*AA*CC;
				
				if (det <= this.tolerance) {							
					return [];
				} else {
					const b = y1 - m*x1;						
					sol1 = (-BB + Math.sqrt(det))/(2*AA);
					sol2 = (-BB - Math.sqrt(det))/(2*AA);						
					ysol1 = m*sol1 + b;
					ysol2 = m*sol2 + b;	
				}
			}
			
			if (Math.abs(Math.abs(entity2.start_parameter - entity2.end_parameter) - 2*Math.PI) < this.tolerance) { // full ellipse
				if ((sol1 - x1)*(sol1 - x2) < this.tolerance && (ysol1 - y1)*(ysol1 - y2) < this.tolerance) {
					let json1 = {};
					json1[`${ax1}`] = sol1;
					json1[`${ax2}`] = ysol1;
					points.push(json1);
				}
				if ((sol2 - x1)*(sol2 - x2) < this.tolerance && (ysol2 - y1)*(ysol2 - y2) < this.tolerance) {
					let json2 = {};
					json2[`${ax1}`] = sol2;
					json2[`${ax2}`] = ysol2;
					points.push(json2);
				}
			} else {
				sa = sa*Math.PI/180;
				ea = ea*Math.PI/180;
				if (sol1 && ysol1) {
					let ang1 = Math.abs(Math.atan((ysol1 - yc)/(sol1 - xc)));
					const isCrossing1 =  ((sol1 - x1)*(sol1 - x2) < this.tolerance && (ysol1 - y1)*(ysol1 - y2) < this.tolerance);
					if (ysol1 > yc && sol1 < xc) {
						ang1 = Math.PI - ang1;
					} else if (ysol1 < yc && sol1 < xc) {
						ang1 = Math.PI + ang1;
					} else if (ysol1 < yc && sol1 > xc) {
						ang1 = 2*Math.PI - ang1;
					}
					if (isCrossing1 && ((sa < ea && ((ang1 - sa)*(ang1 - ea) < this.tolerance)) || (sa > ea && ((ang1 - sa)*(ang1 - ea) > this.tolerance)))) {
						let json1 = {};
						json1[`${ax1}`] = sol1;
						json1[`${ax2}`] = ysol1;
						points.push(json1);
					}
				}
				
				if (sol2 && ysol2) {
					let ang2 = Math.abs(Math.atan((ysol2 - yc)/(sol2 - xc)));
					const isCrossing2 =  ((sol2 - x1)*(sol2 - x2) < this.tolerance && (ysol2 - y1)*(ysol2 - y2) < this.tolerance);
					if (ysol2 > yc && sol2 < xc) {
						ang2 = Math.PI - ang2;
					} else if (ysol2 < yc && sol2 < xc) {
						ang2 = Math.PI + ang2;
					} else if (ysol2 < yc && sol2 > xc) {
						ang2 = 2*Math.PI - ang2;
					}
					if (isCrossing2 && ((sa < ea && ((ang2 - sa)*(ang2 - ea) < this.tolerance)) || (sa > ea && ((ang2 - sa)*(ang2 - ea) > this.tolerance)))) {
						let json2 = {};
						json2[`${ax1}`] = sol2;
						json2[`${ax2}`] = ysol2;
						points.push(json2);
					}
				}
			}
			return points;
		} else if ((etype1 == "AcDbPolyline" &&	etype2 == "AcDbCircle") || (etype2 == "AcDbPolyline" &&	etype1 == "AcDbCircle")) {	
			if ((etype2 == "AcDbPolyline" &&	etype1 == "AcDbCircle")) {
				const temp = entity1;
				entity1 = entity2;
				entity2 = temp;
			}			
			const vertices = JSON.parse(JSON.stringify(entity1.vertices));			
			if (entity2.type == "Closed") {
				vertices.push(vertices[0]);
			}
			let points = [];
			let x0 = vertices[0][`${ax1}`], x1;
			let y0 = vertices[0][`${ax2}`], y1;
			
			for (let i = 1; i < vertices.length; i++) {
				x1 = vertices[i][`${ax1}`];
				y1 = vertices[i][`${ax2}`];
				let json = {subclass: "AcDbLine"};
				json[`start_${ax1}`] = x0;
				json[`start_${ax2}`] = y0;
				json[`end_${ax1}`] = x1;
				json[`end_${ax2}`] = y1;
				const intersection = this.intersection(json, entity2, `${ax1}-${ax2}`);
				if (Array.isArray(intersection)) {
					intersection.forEach((p) => {
						let x = p[ax1];
						let y = p[ax2];
						let isInserted = false;
						for (let j = 0; j < points.length; j++) {
							if (Math.abs(points[j][ax1] - x) < this.tolerance && Math.abs(points[j][ax2] - y) < this.tolerance) {
								isInserted = true;
								break;
							}
						}
						if (!isInserted) {							
							points.push(p);
						}
					});
				}
				x0 = x1;
				y0 = y1;
			}			
			return points;
		} else if ((etype1 == "AcDbPolyline" && etype2 == "AcDbEllipse") || (etype2 == "AcDbPolyline" && etype1 == "AcDbEllipse")) {
			if ((etype2 == "AcDbPolyline" && etype1 == "AcDbEllipse")) {
				const temp = entity1;
				entity1 = entity2;
				entity2 = temp;
			}
			let points = [], arcConnected = false;
			const vertices = JSON.parse(JSON.stringify(entity1.vertices));
			
			if (entity2.type == "Closed") {
				vertices.push(vertices[0]);
			}
			
			let x0 = vertices[0][`${ax1}`], x1;
			let y0 = vertices[0][`${ax2}`], y1;
			
			for (let i = 1; i < vertices.length; i++) {
				x1 = vertices[i][`${ax1}`];
				y1 = vertices[i][`${ax2}`];
				let json = {subclass: "AcDbLine"};
				json[`start_${ax1}`] = x0;
				json[`start_${ax2}`] = y0;
				json[`end_${ax1}`] = x1;
				json[`end_${ax2}`] = y1;
				const intersection = this.intersection(json, entity2, `${ax1}-${ax2}`);
				if (Array.isArray(intersection)) {
					intersection.forEach((p) => {
						let x = p[ax1];
						let y = p[ax2];
						let isInserted = false;
						for (let j = 0; j < points.length; j++) {
							if (Math.abs(points[j][ax1] - x) < this.tolerance && Math.abs(points[j][ax2] - y) < this.tolerance) {
								isInserted = true;
								break;
							}
						}
						if (!isInserted) {							
							points.push(p);
						}
					});
				}
				x0 = x1;
				y0 = y1;
			}	
			return points;
		}
	}
	
	closest = (entity, etype, mode, list) => {
		if (!entity || (typeof entity != "object")|| Array.isArray(entity) || (etype && !Array.isArray(etype))) {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		const etype2 = entity.subclass;
		let domain;
		if (list && Array.isArray(list)) {
			domain = list;
		} else {
			domain = this.entities
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
					
					if ((x1 === undefined && y1 === undefined && z1 === undefined) || etype3 == etype2 && Math.abs(x - x1) < this.tolerance && Math.abs(y - y1) < this.tolerance && Math.abs(z - z1) < this.tolerance) {
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
		entity.start_angle = true_sa;
		entity.end_angle = true_ea;
	}
}
	
module.exports = Entities;
