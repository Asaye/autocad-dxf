const ErrorMessages = require("./ErrorMessages.json");
const Entities = class {	
	constructor(data, tolerance) {
		this.entities = [];
		this.tables = {};
		this.blocks = [];
		this.tolerance = tolerance || 0.0001;
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
						json.type = "Thawed";  
					} else if (value == "1") {
						json.type = "Frozen";  
					} else if (value == "2") {
						json.type = "Frozen by default";  
					} else if (value == "4") {
						json.type = "Locked";  
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
					if (!json.pattern_length) json.pattern_length = [];
					json.pattern_length.push(parseFloat(value));
				} else if (json && code == "50") {
					if (!json.embedded_element_rotations) json.embedded_element_rotations = [];
					json.embedded_element_rotations.push(parseFloat(value));
				} else if (json && code == "73") {							
					json.number_of_elements = parseInt(value);
				} else if (json && code == "74") {	
					if (value == "0") {
						json.embedded_element = "None";  
					} else if (value == "1") {
						json.embedded_element_rotation_type = "Absolute";  
					} else if (value == "2") {
						json.embedded_element = "Text";  
					} else if (value == "4") {
						json.embedded_element = "Shape";  
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
				} else if (json && code == "13") {
					json.orthographic_origin.y = parseFloat(value);
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
					json.target_point = parseFloat(value);
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
			
			if (blockBegan && code == "100" && value == "AcDbEntity") {
				if (!json.entities) json.entities = [];
				json2 = {};
				entityStarted = true;
			} else if (blockBegan && json.entities && code == "330") {
				json.entities.push(json2);
			} else if (blockBegan && code == "2") {
				json.name = value;
			} else if (!blockBegan && code == "8") {
				json.layer = value;
			} else if (!entityStarted && code == "10") {
				json.base_point = { x : parseFloat(value) };
			} else if (!entityStarted && code == "20") {
				json.base_point.y = parseFloat(value);
			} else if (blockBegan && json2) {
				this.insertEntity(code, value, json2);
			}
			
			COUNT = COUNT + 2;
		}
	}
	
	getEntities = (array, COUNT) => {
		let json;
		while (COUNT < array.length - 1) {
			const code = array[COUNT].trim();
			const value = array[COUNT + 1].trim();	
			if (code == "0" && value == "ENDSEC") {
				this.entities.push(json);
				return COUNT + 2;
			}
			if (code == "100" && value == "AcDbEntity") {					
				if (json) this.entities.push(json);
				json = {};
			} else {
				this.insertEntity(code, value, json);
			}
			COUNT = COUNT + 2;
		}
	}
	
	insertEntity = (code, value, json) => {
		if (code == "1") {					
			if (json.etype == "AcDbText" || json.etype == "AcDbMText") {
				json.text = value;
				json.style = "STANDARD";
				json.rotation = 0; 
			} else if (json.etype == "AcDbDimension") {
				json.user_measurement = parseFloat(value);  
			}
		} else if (code == "2") {
			if (json.etype == "AcDbShape" || json.etype == "AcDbMline" || json.etype == "AcDbHatch") {
				json.name = value;  
			} 
		} else if (code == "3") {
			if (json.etype == "AcDbDimension") {
				json.dimension_style = value;  
			} 
		} else if (code == "6") {
			json.line_type = value;
		} else if (code == "7") {
			if (json.etype == "AcDbMText") {
				json.style = value;  
			} 
		} else if (code == "8") {
			json.layer = value;
		} else if (code == "10") {
			if (json.etype == "AcDbLine" || json.etype == "AcDbRay" || json.etype == "AcDbMline") {
				json.start_x = parseFloat(value);  
			} else if (json.etype == "AcDbPolyline") {
				if (!json.vertices) json.vertices = [];
				json.vertices.push({x: parseFloat(value)});
			} else if (json.etype == "AcDbSpline") {
				if (!json.control_points) json.control_points = [];
				json.control_points.push({x: parseFloat(value)});
			} else if (json.etype == "AcDbTrace") {
				if (!json.corners) json.corners = [];
				json.corners.push({x: parseFloat(value)});
			} else if (json.etype == "AcDbHatch") {
				if (!json.seed_points) json.seed_points = [];
				json.seed_points.push({x: parseFloat(value)});
			} else {
				json.x = parseFloat(value);
			} 
		} else if (code == "11") {
			if (json.etype == "AcDbLine") {
				json.end_x = parseFloat(value);  
			} else if (json.etype == "AcDbSpline") {
				if (!json.fit_point) json.fit_point = [];
				json.fit_point.push({x: parseFloat(value)});
			} else if (json.etype == "AcDbEllipse") {
				json.major_end_dx = parseFloat(value);  
			} else if (json.etype == "AcDbDimension") {
				json.x_text = value;  
			} else if (json.etype == "AcDbTrace") {
				if (!json.corners) json.corners = [];
				json.corners.push({x: parseFloat(value)});
			} else if (json.etype == "AcDbRay") {
				json.unit_direction_x = parseFloat(value);  
			} else if (json.etype == "AcDbMline") {
				if (!json.vertices) json.vertices = [];
				json.vertices.push({x: parseFloat(value)});
			} 
		} else if (code == "12") {
			if (json.etype == "AcDbTrace") {
				if (!json.corners) json.corners = [];
				json.corners.push({x: parseFloat(value)});
			} else if (json.etype == "AcDbMline") {
				json.vertices[json.vertices - 1]["direction_vector_segment_x"] = parseFloat(value);
			} 				
		} else if (code == "13") {
			if (json.etype == "AcDbAlignedDimension") {
				json.x_def_point = parseFloat(value);  
			} else if (json.etype == "AcDbTrace") {
				if (!json.corners) json.corners = [];
				json.corners.push({x: parseFloat(value)});
			} else if (json.etype == "AcDbMline") {
				json.vertices[json.vertices - 1]["direction_vector_miter_x"] = parseFloat(value);
			}
		} else if (code == "14") {
			if (json.etype == "AcDbAlignedDimension") {
				json.x_def_point2 = parseFloat(value);  
			} 
		} else if (code == "15") {
			if (json.etype == "AcDbAlignedDimension") {
				json.x_def_point3 = parseFloat(value);  
			} 
		} else if (code == "16") {
			if (json.etype == "AcDbAlignedDimension") {
				json.x_def_point4 = parseFloat(value);  
			} 
		} else if (code == "20") {
			if (json.etype == "AcDbLine" || json.etype == "AcDbRay" || json.etype == "AcDbMline") {
				json.start_y = parseFloat(value);  
			} else if (json.etype == "AcDbPolyline") {
				json.vertices[json.vertices.length - 1]["y"] = parseFloat(value);
			} else if (json.etype == "AcDbSpline") {
				json.control_points[json.control_points.length - 1]["y"] = parseFloat(value);
			} else if (json.etype == "AcDbTrace") {
				json.corners[json.corners.length - 1]["y"] = parseFloat(value);
			} else if (json.etype == "AcDbHatch") {
				json.seed_points[json.seed_points.length - 1]["y"] = parseFloat(value);
			} else {
				json.y = parseFloat(value);
			} 
		} else if (code == "21") {
			if (json.etype == "AcDbLine") {
				json.end_y = parseFloat(value);  
			} else if (json.etype == "AcDbSpline") {
				json.fit_point[json.fit_point.length - 1]["y"] = parseFloat(value);
			} else if (json.etype == "AcDbEllipse") {
				json.major_end_dy = parseFloat(value);  
			} else if (json.etype == "AcDbDimension") {
				json.y_text = value;  
			} else if (json.etype == "AcDbTrace") {
				json.corners[json.corners.length - 1]["y"] = parseFloat(value);
			} else if (json.etype == "AcDbRay") {
				json.unit_direction_y = parseFloat(value);  
			} else if (json.etype == "AcDbMline") {
				json.vertices[json.vertices - 1]["y"] = parseFloat(value);
			} 
		} else if (code == "22") {
			if (json.etype == "AcDbTrace") {
				json.corners[json.corners.length - 1]["y"] = parseFloat(value);
			} else if (json.etype == "AcDbMline") {
				json.vertices[json.vertices - 1]["direction_vector_segment_y"] = parseFloat(value);
			}
		} else if (code == "23") {
			if (json.etype == "AcDbAlignedDimension") {
				json.y_def_point = parseFloat(value);  
			} else if (json.etype == "AcDbTrace") {
				json.corners[json.corners.length - 1]["y"] = parseFloat(value);
			} else if (json.etype == "AcDbMline") {
				json.vertices[json.vertices - 1]["direction_vector_miter_y"] = parseFloat(value);
			} 
		} else if (code == "24") {
			if (json.etype == "AcDbAlignedDimension") {
				json.y_def_point2 = parseFloat(value);  
			} 
		} else if (code == "25") {
			if (json.etype == "AcDbAlignedDimension") {
				json.y_def_point3 = parseFloat(value);  
			} 
		} else if (code == "26") {
			if (json.etype == "AcDbAlignedDimension") {
				json.y_def_point4 = parseFloat(value);  
			} 
		} else if (code == "40") {
			if (json.etype == "AcDbCircle") {
				json.radius = parseFloat(value);  
			} else if (json.etype == "AcDbEllipse") {
				json.minorToMajor = parseFloat(value);  
			} else if (json.etype == "AcDbSpline") {
				if (!json.knot_value) json.knot_value = [];
				json.knot_value.push(parseFloat(value));
			} else if (json.etype == "AcDbText" || json.etype == "AcDbMText") {
				json.height = parseFloat(value);  
			} else if (json.etype == "AcDbVertex") {
				json.start_width = parseFloat(value);  
			} else if (json.etype == "AcDbShape") {
				json.size = parseFloat(value);  
			} else if (json.etype == "AcDbMline") {
				json.scale_factor = parseFloat(value);  
			}
		} else if (code == "41") {
			if (json.etype == "AcDbEllipse") {
				json.start_angle = parseFloat(value);  
			} else if (json.etype == "AcDbText") {
				json.width = parseFloat(value);  
			} else if (json.etype == "AcDbVertex") {
				json.end_width = parseFloat(value);  
			} else if (json.etype == "AcDbMline") {
				if (!json.element_params) json.element_params = [];
				json.element_params.push({x: parseFloat(value)});
			} else if (json.etype == "AcDbHatch") {
				json.pattern_scale = parseFloat(value);  
			}
		} else if (code == "42") {
			if (json.etype == "AcDbEllipse") {
				json.end_angle = parseFloat(value);  
			} else if (json.etype == "AcDbText") {
				json.characterWidth = parseFloat(value);  
			} else if (json.etype == "AcDbDimension") {
				json.actual_measurement = parseFloat(value);  
			} else if (json.etype == "AcDbMline") {
				if (!json.area_params) json.area_params = [];
				json.area_params.push({x: parseFloat(value)});
			} 
		} else if (code == "48") {
			json.line_scale = parseFloat(value);
		} else if (code == "50") {
			if (json.etype == "AcDbEllipse") {
				json.start_angle = parseFloat(value);  
			} else if (json.etype == "AcDbArc") {
				json.start_angle = parseFloat(value);   
			} else if (json.etype == "AcDbAlignedDimension") {
				json.rotation_angle = parseFloat(value);   
			} else if (json.etype == "AcDbVertex") {
				json.curve_fit_tangent_direction = value;   
			} else if (json.etype == "AcDbShape") {
				json.rotation = parseFloat(value);   
			} else if (json.etype == "AcDbText" || json.etype == "AcDbMText") {
				json.rotation = parseFloat(value);   
			}				 
		} else if (code == "51") {
			if (json.etype == "AcDbArc") {
				json.end_angle = parseFloat(value);  
			} 					  
		} else if (code == "52") {
			if (json.etype == "AcDbHatch") {
				json.pattern_angle = parseFloat(value);  
			} 					  
		} else if (code == "60") {
			if (value == "1") {
				json.visibility = "Invisible";  
			} 					  
		} else if (code == "70") {
			if (json.etype == "AcDbPolyline") {
				if (value == "1") {
					json.type = "Closed";  
				} else if (value == "128") {
					json.type = "Plinegen";  
				} 
			} else if (json.etype == "AcDbSpline") {
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
			} else if (json.etype == "AcDbDimension") {
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
			} else if (json.etype == "AcDbVertex") {
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
			} else if (json.etype == "AcDbMline") {
				if (value == "0") {
					json.justification = "Top";  
				} else if (value == "1") {
					json.justification = "0";  
				} else if (value == "2") {
					json.justification = "Bottom";  
				} 
			} else if (json.etype == "AcDbHatch") {
				if (value == "0") {
					json.fill = "Pattern";  
				} else if (value == "1") {
					json.fill = "Solid";  
				} 
			} 
		} else if (code == "71") {
			if (json.etype == "AcDbSpline") {
				json.degree_of_curve = parseFloat(value);
			} else if (json.etype == "AcDbDimension") {
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
			} else if (json.etype == "AcDbMline") {
				if (value == "1") {
					json.type = "Has at least one vertex";  
				} else if (value == "2") {
					json.type = "Closed";  
				} else if (value == "4") {
					json.type = "Suppress start caps";  
				} else if (value == "8") {
					json.type = "Suppress end caps";  
				}  
			} else if (json.etype == "AcDbHatch") {
				if (value == "0") {
					json.associative = false;  
				} else if (value == "1") {
					json.associative = true;  
				} 
			} else if (json.etype == "AcDbSpline") {
				json.degree_of_curve = parseFloat(value);
			} 
		} else if (code == "72") {
			if (json.etype == "AcDbSpline") {
				json.number_of_knots = parseFloat(value);
			} else if (json.etype == "AcDbMline") {
				json.number_of_vertices = parseFloat(value);
			} else if (json.etype == "AcDbMText") {
				if (value == "1") {
					json.drawing_direction = "Left to Right";  
				} else if (value == "3") {
					json.drawing_direction = "Top to Bottom";  
				} else if (value == "5") {
					json.drawing_direction = "Inherited from text style";  
				} 
			} 
		} else if (code == "73") {
			if (json.etype == "AcDbSpline") {
				json.number_of_control_points = parseFloat(value);
			} 
		} else if (code == "74") {
			if (json.etype == "AcDbSpline") {
				json.number_of_fit_points = parseFloat(value);
			} 
		} else if (code == "75") {					
			if (json.etype == "AcDbHatch") {
				if (value == "0") {
					json.style = "Hatch odd parity area";  
				} else if (value == "1") {
					json.style = "Hatch outermost area only ";  
				} else if (value == "2") {
					json.style = "Hatch through entire area";  
				} 
			} 
		} else if (code == "76") {					
			if (json.etype == "AcDbHatch") {
				if (value == "0") {
					json.pattern = "User-defined";  
				} else if (value == "1") {
					json.pattern = "Predefined";  
				} else if (value == "2") {
					json.pattern = "Custom";  
				} 
			} 
		} else if (code == "78") {
			if (json.etype == "AcDbHatch") {
				json.number_of_lines = parseFloat(value);
			} 
		} else if (code == "90") {
			if (json.etype == "AcDbPolyline") {
				json.number_of_vertices = parseFloat(value);
			} 
		} else if (code == "91") {
			if (json.etype == "AcDbHatch") {
				json.number_of_boundary_paths = parseFloat(value);
			} 
		} else if (code == "98") {
			if (json.etype == "AcDbHatch") {
				json.number_of_seed_points = parseFloat(value);
			} 
		} else if (code == "100") {
			json.etype = value;
		} else if (code == "450") {					
			if (json.etype == "AcDbHatch") {
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
	
	filter = (criteria, entities) => {
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
		return entities.filter((item) => 
			(!criteria.etype || !Array.isArray(criteria.etype) || criteria.etype.filter((en) => ("acdb" + en) == item.etype.toLowerCase()).length > 0) &&
			(!criteria.layer || !Array.isArray(criteria.layer) || criteria.layer.filter((la) => la == item.layer).length > 0) && 
			(!criteria.between || this.checkBetween(criteria.between, item)) &&
			(!criteria.radius || criteria.radius == item.radius) &&
			(!criteria.arc || Math.abs(criteria.arc.angle*(criteria.arc.unit == "degrees" ? 1 : 180/Math.PI) - Math.abs(item.start_angle - item.end_angle)) < this.tolerance) &&	
			(!criteria.nsides || this.checkNoOfSides(criteria.nsides, item)));
	}	
	
	getCorners = (entity) => {
		if (typeof entity != "object") {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		let corners = [];
		if (entity.etype == "AcDbPolyline") {
			const vertices = entity.vertices;			
			let temp = [];
			let x0 = vertices[vertices.length - 1].x, y0 = vertices[vertices.length - 1].y, x1 = vertices[0].x, y1 = vertices[0].y, x2, y2;
			for (let i = 1; i <= vertices.length; i++) {
				let j = i < vertices.length ? i : 0;				
				x2 = vertices[j].x;
				y2 = vertices[j].y;	
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
	
	checkNoOfSides = (criteria, item) => {
		if (item.etype == "AcDbPolyline") {
			const vertices = item.vertices;
			let temp = [vertices[0]], nSides;
			for (let i = 1; i < vertices.length; i++) {				
				const isCorner = this.checkCorner([vertices[i].x, vertices[i].y], item);
				let exists = false;
				for (let j = 1; j < temp.length; j++) {
					if (Math.abs(temp[j].x - vertices[i].x) <= this.tolerance && Math.abs(temp[j].y - vertices[i].y) <= this.tolerance) {
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
		
		if (item.etype == "AcDbLine" || item.etype == "AcDbRay" || item.etype == "AcDbMline") {
			return (item.start_x - xmin)*(item.start_x - xmax) <= this.tolerance && (item.start_y - ymin)*(item.start_y - ymax) <= this.tolerance &&
				   (item.end_x - xmin)*(item.end_x - xmax) <= this.tolerance && (item.end_y - ymin)*(item.end_y - ymax) <= this.tolerance;
		} else if (item.etype == "AcDbPolyline") {
			const vertices = item.vertices;
			for (let i = 0; i < vertices.length; i++) {
				if ((vertices[i].x - xmin)*(vertices[i].x - xmax) > this.tolerance || (vertices[i].y - ymin)*(vertices[i].y - ymax) > this.tolerance) {
					return false;
				}
			}
			return true;
		} else if (item.etype == "AcDbSpline") {
			const points = item.control_points;
			for (let i = 0; i < points.length; i++) {
				if ((points[i].x - xmin)*(points[i].x - xmax) > this.tolerance || (points[i].y - ymin)*(points[i].y - ymax) > this.tolerance) {
					return false;
				}
			}
			return true;
		} else if (item.etype == "AcDbTrace") {
			const corners = item.corners;
			for (let i = 0; i < corners.length; i++) {
				if ((corners[i].x - xmin)*(corners[i].x - xmax) > this.tolerance || (corners[i].y - ymin)*(corners[i].y - ymax) > this.tolerance) {
					return false;
				}
			}
			return true;
		} else if (item.etype == "AcDbHatch") {
			const spoints = item.seed_points;
			for (let i = 0; i < spoints.length; i++) {
				if ((spoints[i].x - xmin)*(spoints[i].x - xmax) > this.tolerance || (spoints[i].y - ymin)*(spoints[i].y - ymax) > this.tolerance) {
					return false;
				}
			}
			return true;
		} else {
			return (item.x - xmin)*(item.x - xmax) <= this.tolerance && (item.y - ymin)*(item.y - ymax) <= this.tolerance;
		} 
	}	
	
	checkCorner = (data, item) => {
		if (!Array.isArray(data) && data.etype != "AcDbPoint") return false;
		const etype = item.etype;
		const x = Array.isArray(data) ? data[0] : data.x;
		const y = Array.isArray(data) ? data[1] : data.y;
		if (etype == "AcDbPoint" || etype == "AcDbText" || etype == "AcDbSpline" || etype == "AcDbMLine" 
			|| etype == "AcDbLine" || etype == "AcDbCircle" || etype == "AcDbArc" || etype == "AcDbEllipse") {
			return false;
		} else if (etype == "AcDbPolyline") {
			const vertices = item.vertices;			
			let x0 = vertices[vertices.length - 1].x, y0 = vertices[vertices.length - 1].y, x1 = vertices[0].x, y1 = vertices[0].y, x2, y2;
			for (let i = 1; i <= vertices.length; i++) {
				let j = i < vertices.length ? i : 0;				
				x2 = vertices[j].x;
				y2 = vertices[j].y;	
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
	
	checkEccentric = (entity1, entity2) => {
		if (typeof entity1 != "object" || typeof entity2 != "object") {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		const etype1 = entity1.etype;
		const etype2 = entity2.etype;
		if (etype1 == "AcDbCircle" && etype2 == "AcDbCircle") {
			let xc1 = entity1.x;
			let yc1 = entity1.y;
			let xc2 = entity2.x;
			let yc2 = entity2.y;
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
	
	checkConcentric = (entity1, entity2) => {
		if (typeof entity1 != "object" || typeof entity2 != "object") {
			throw new Error(ErrorMessages.INCORRECT_PARAMS);
			return;
		}
		const etype1 = entity1.etype;
		const etype2 = entity2.etype;
		
		if (etype1 == "AcDbCircle" && etype2 == "AcDbCircle") {
			let xc1 = entity1.x;
			let yc1 = entity1.y;
			let xc2 = entity2.x;
			let yc2 = entity2.y;
			const r1 = entity1.radius;
			const r2 = entity2.radius;
			return Math.abs(xc1 - xc2) < this.tolerance && Math.abs(yc1 - yc2) < this.tolerance && Math.abs(r1 - r2) > this.tolerance;
		}
		return false;
	}
}
	
module.exports = Entities;
