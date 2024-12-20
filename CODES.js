module.exports = {
	"AcDbArc": {
		"0": "etype",          // type of entity, ARC
		"6": "line_type",      // line type name
		"8": "layer",          // the layer on which the point is defined
		"10": "x",             // the x coordinate of the center
		"20": "y",             // the y coordinate of the center
		"30": "z",             // the z coordinate of the center		
		"40": "radius",        // radius of the arc
		"50": "start_angle",   // start angle 
		"51": "end_angle",     // end angle 
		"48": "line_scale",    // line type scale
		"60": "visibility",    // object visibility
		"62": "color",         // color number, 0 = ByBlock, 256 = ByLayer
		"100": "subclass"      // subclass marker, AcDbCircle
	},
	"AcDbBlockReference": {
		"0": "etype",          // type of entity, INSERT
		"2": "block_name",     // block name
		"6": "line_type",      // line type name
		"8": "layer",          // the layer on which the point is defined
		"41": "scale_x",       // scale in x direction
		"42": "scale_y",       // scale in y direction
		"43": "scale_z",       // scale in z direction
		"44": "column_spacing",// column spacing
		"45": "row_spacing",   // row spacing
		"48": "line_scale",    // line type scale
		"50": "rotation",      // block rotation
		"60": "visibility",    // object visibility
		"70": "column_count",  // column count
		"71": "row_count",     // row count
		"100": "subclass"      // subclass marker, AcDbBlockReference
	},	
	"AcDbCircle": {
		"0": "etype",          // type of entity, CIRCLE
		"6": "line_type",      // line type name
		"8": "layer",          // the layer on which the point is defined
		"10": "x",             // x coordinate of the center
		"20": "y",             // y coordinate of the center
		"30": "z",             // z coordinate of the center 		
		"40": "radius",        // radius of the circle
		"48": "line_scale",    // line type scale
		"60": "visibility",    // object visibility
		"62": "color",         // color number, 0 = ByBlock, 256 = ByLayer
		"100": "subclass/specific_type",      // subclass marker (AcDbCircle)/the specific type of the circle (AcDbArc)	
		"**": "area",          // area of a circle or the visible segment of a circular arc
		"***": "area_sector",  // area of a sector for arcs
		"****": "circumference/arc_length"     // circumeference of arc length
	},
	"AcDbDimension": {
		"0": "etype",                        // type of entity, DIMENSION		
		"1": "text_override",                // user defined value for the dimension
		"3": "dimension_style",              // the name of the dimension style
		"6": "line_type",                    // line type name
		"8": "layer",                        // the layer on which the point is defined		
		"10": "x",                           // the x coordinate of the dimension line
		"11": "x_text",                      // the x coordinate of the center of the dimension text
		"13": "ext_line1_x/ext_line1_p1_x/location_x",  // the x coordinate of the first extension line for linear or angular dimensions or the x coordinate of the first point of the first extension line in angular dimensions or the x value of the feature location of ordinate dimensions
		"14": "ext_line2_x/ext_line1_p2_x/leader_end_x",  // the x coordinate of the second extension line for linear or angular dimensions or the x coordinate of the second point of the first extension line in angular dimensions or the x value of the leader end point in ordinate dimensions
		"15": "vertex_x/dim_first_point_x/ext_line2_p2_x", // the x coordinate of the vertex of angular dimensions or the x coordinate of the first point of radial or dimateric dimensions or the x coordinate of the second point of the second extension line in angular dimensions
		"16": "arc_dim_line_x",              // the x coordinate of the point on the arc of angular dimensions
		"20": "y",                           // the y coordinate of the dimension line
		"21": "y_text",                      // the y coordinate of the center of the dimension text
		"23": "ext_line1_y/ext_line1_p1_y/location_y",  // the y coordinate of the first extension line for linear or angular dimensions or the y coordinate of the first point of the first extension line in angular dimensions  or the y value of the feature location of ordinate dimensions
		"24": "ext_line2_y/ext_line1_p2_y/leader_end_y",  // the y coordinate of the second extension line for linear or angular dimensions or the y coordinate of the second point of the first extension line in angular dimensions or the y value of the leader end point in ordinate dimensions
		"25": "vertex_y/dim_first_point_y/ext_line2_p2_y", // the y coordinate of the vertex of angular dimensions or the y coordinate of the first point of radial or dimateric dimensions or the y coordinate of the second point of the second extension line in angular dimensions
		"26": "arc_dim_line_y",              // the y coordinate of the point on the arc of angular dimensions
		"30": "z",                           // the z coordinate of the dimension line
		"31": "z_text",                      // the z coordinate of the center of the dimension text
		"33": "ext_line1_z/ext_line1_p1_z/location_z",  // the z coordinate of the first extension line for linear or angular dimensions or the z coordinate of the first point of the first extension line in angular dimensions  or the z value of the feature location of ordinate dimensions
		"34": "ext_line2_z/ext_line1_p2_z/leader_end_y",  // the z coordinate of the second extension line for linear or angular dimensions or the z coordinate of the second point of the first extension line in angular dimensions or the z value of the leader end point in ordinate dimensions
		"35": "vertex_z/dim_first_point_z/ext_line2_p2_z", // the z coordinate of the vertex of angular dimensions or the z coordinate of the first point of radial or dimateric dimensions or the z coordinate of the second point of the second extension line in angular dimensions
		"40": "leader_length",               // length of the leader
		"42": "actual_measurement",          // actual measurement of the dimension
		"48": "line_scale",                  // line type scale
		"50": "rotation",                    // rotation angle of the dimension line
		"52": "ext_line_rotation",           // rotation angle of the extension lines
		"60": "visibility",                  // object visibility
		"62": "color",                       // color number, 0 = ByBlock, 256 = ByLayer
		"70": "type",                        // type of the dimension line
		"71": "attachement_point",           // attachment point
		"100": "subclass/specific_type"      // subclass marker (AcDbDimension)/the specific type of the dimension (AcDbAlignedDimension/AcDb3PointAngularDimension/AcDbDiametricDimension/AcDbRadialDimension)		
	},	
	"AcDbEllipse": {
		"0": "etype",          // type of entity, ELLIPSE
		"6": "line_type",      // line type name
		"8": "layer",          // the layer on which the point is defined
		"10": "x",             // the x coordinate of the center
		"11": "major_end_dx",  // the delta X of the end point of the major axis w.r.t the center 
		"20": "y",             // the y coordinate of the center
		"21": "major_end_dy",  // the delta Y of the end point of the major axis w.r.t the center 
		"30": "z",             // the z coordinate of the center
		"31": "major_end_dz",  // the delta Z of the end point of the major axis w.r.t the center 
		"40": "minorToMajor",  // the length ratio of the minor axis to the major axis
		"41": "start_parameter",   // the parameteric angle of the start point of the ellipse, 0 for full ellipse
		"42": "end_parameter",     // the parameteric angle of the end point of the ellipse, 2*PI for full ellipse
		"41a": "start_angle",  // the start angle of the ellipse measured from +x axis, 0 for full ellipse
		"42a": "end_angle",    // the end angle of the ellipse measured from +x axis, 360 for full ellipse
		"41b": "start_angle2", // the start angle of the ellipse measured from the major axis, 0 for full ellipse
		"42b": "end_angle2",   // the end angle of the ellipse measured from the major axis, 360 for full ellipse
		"48": "line_scale",    // line type scale
		"60": "visibility",    // object visibility
		"62": "color",         // color number, 0 = ByBlock, 256 = ByLayer
		"100": "subclass",     // subclass marker, AcDbEllipse
		"**": "area",          // area of a circle or the visible segment of an elliptical arc
		"***": "area_sector",  // area of a sector for arcs
		"****": "area_full"    // the full area of the ellipse in case the ellipse is an arc
	},
	"AcDbExtrudedSurface": {
		"0": "etype",                        // type of entity, SURFACE
		"1": "proprietary_data",             // proprietary data upto 255 characters (exclusive)
		"3": "proprietary_data",             // proprietary data beyond 255 characters
		"6": "line_type",                    // line type name
		"8": "layer",                        // the layer on which the point is defined
		"10": "x",                           // the x coordinate of the sweep vector
		"20": "y",                           // the y coordinate of the sweep vector
		"30": "z",                           // the z coordinate of the sweep vector
		"11": "ref_vector.x",                // Reference vector for controlling twist, x value
		"21": "ref_vector.y",                // Reference vector for controlling twist, y value
		"31": "ref_vector.z",                // Reference vector for controlling twist, z value
		"40": "transform_matrix_revolved",   // Transform matrix of revolved entity (16 reals; row major format; default = identity matrix)		
		"42": "draft_angle",                 // Draft angle (in radians)
		"43": "start_draft_distance",        // Start draft distance
		"44": "end_draft_distance",          // End draft distance
		"45": "twist_angle",                 // Twist angle (in radians)
		"46": "transform_matrix_sweep",      // Transform matrix of sweep entity (16 reals; row major format; default = identity matrix)
		"47": "transform_matrix_path",       // Transform matrix of path entity (16 reals; row major format; default = identity matrix)
		"48": "scale_factor",                // Scale factor
		"49": "align_angle",                 // Align angle (in radians)
		"70": "sweep_alignment_option",      // Sweep alignment option
		"100": "subclass/specific_type",     // subclass marker, AcDbModelerGeometry/AcDbExtrudedSurface
		"310": "binary_data"                 // binary data
	},
	"AcDbFace": {
		"0": "etype",        // type of entity, 3DFACE
		"6": "line_type",    // line type name
		"8": "layer",        // the layer on which the point is defined
		"10": "corners.x",   // the x coordinate of the first corner
		"11": "corners.x",   // the x coordinate of the second corner
		"12": "corners.x",   // the x coordinate of the third corner
		"13": "corners.x",   // the x coordinate of the fourth corner
		"20": "corners.y",   // the y coordinate of the first corner
		"21": "corners.y",   // the y coordinate of the second corner
		"22": "corners.y",   // the y coordinate of the third corner
		"23": "corners.y",   // the y coordinate of the fourth corner
		"30": "corners.z",   // the z coordinate of the first corner
		"31": "corners.z",   // the z coordinate of the second corner
		"48": "line_scale",  // line type scale
		"60": "visibility",  // object visibility
		"62": "color",       // color number, 0 = ByBlock, 256 = ByLayer
		"70": "invisible_edge",       // invisible edge flag, First/Second/Third/Fourth
		"100": "subclass"    // subclass marker, AcDbFace
	},
	"AcDbFcf": {
		"0": "etype",                     // type of entity, TOLERANCE
		"1": "visual_representation",     // String representing the visual representation of the tolerance
		"6": "line_type",                 // line type name
		"3": "dimension_style",           // dimension style name
		"8": "layer",                     // the layer on which the point is defined
		"10": "insertion_point.x",        // the x coordinate of the insertion point		
		"11": "x_axis_direction.x",       // the x coordinate of the X-axis direction vector		
		"20": "insertion_point.y",        // the y coordinate of the insertion point
		"21": "x_axis_direction.y",       // the y coordinate of the X-axis direction vector
		"30": "insertion_point.z",        // the z coordinate of the insertion point
		"31": "x_axis_direction.z",       // the z coordinate of the X-axis direction vector		
		"48": "line_scale",               // line type scale
		"60": "visibility",               // object visibility
		"62": "color",                    // color number, 0 = ByBlock, 256 = ByLayer		
		"100": "subclass",                // subclass marker, AcDbFcf
		"210": "extrusion_direction.x",   // the x coordinate of the Extrusion direction	
		"220": "extrusion_direction.y",   // the y coordinate of the Extrusion direction
		"230": "extrusion_direction.z"    // the z coordinate of the Extrusion direction		
	},
	"AcDbHatch": {
		"0": "etype",                      // type of entity, HATCH
		"2": "style_name",	               // style name
		"6": "line_type",                  // line type name		
		"8": "layer",                      // the layer on which the point is defined
		"10": "seed_points.x",             // the x coordinate of a seed point
		"20": "seed_points.y",             // the y coordinate of a seed point
		"30": "seed_points.z",             // the z coordinate of a seed point
		"41": "pattern_scale",             // pattern scale
		"48": "line_scale",                // line type scale
		"52": "pattern_angle",             // angle of rotation of the pattern
		"60": "visibility",                // object visibility
		"62": "color",                     // color number, 0 = ByBlock, 256 = ByLayer
		"70": "fill_type",                 // fill type, Pattern/Solid
		"71": "associative",               // associativity flag
		"75": "style",                     // the hatch style
		"76": "pattern",                   // the type of hatch pattern, User-defined/Predefined/Custom
		"78": "number_of_lines",           // total number of lines
		"91": "number_of_boundary_paths",  // number of boundary paths
		"98": "number_of_seed_points",     // number of seed points
		"100": "subclass",                 // subclass marker, AcDbHatch
		"450": "gradient"                  // true if the hatch is of gradient color or false otherwise
	},
	"AcDbHelix": {
		"0": "etype",                      // type of entity, HELIX		
		"8": "layer",                      // the layer on which the point is defined
		"10": "axis_base_point.x",         // the x coordinate of the axis base point
		"20": "axis_base_point.y",         // the y coordinate of the axis base point
		"30": "axis_base_point.z",         // the z coordinate of the axis base point
		"11": "start_point.x",             // the x coordinate of the start point
		"21": "start_point.y",             // the y coordinate of the start point
		"31": "start_point.z",             // the z coordinate of the start point
		"12": "axis_vector.x",             // the x coordinate of the axis vector
		"22": "axis_vector.y",             // the y coordinate of the axis vector
		"32": "axis_vector.z",             // the z coordinate of the axis vector
		"40": "radius",                    // the radius of the helix
		"41": "number_of_turns",           // the number of turns
		"42": "turn_height",               // the number of turns
		"48": "line_scale",                // line type scale
		"60": "visibility",                // object visibility
		"100": "subclass"                  // subclass marker, AcDbHelix
	},	
	"AcDbLeader": {
		"0": "etype",                               // type of entity, LEADER
		"3": "dimension_style",                     // dimension style
		"6": "line_type",                           // line type name
		"8": "layer",                               // the layer on which the point is defined
		"10": "vertices.x",                         // the x coordinate of a vertex
		"20": "vertices.y",                         // the y coordinate of a vertex
		"30": "vertices.z",                         // the z coordinate of a vertex
		"40": "text_height",                        // the height of annotation text
		"41": "text_width",                         // the width of annotation text
		"48": "line_scale",                         // line type scale
		"60": "visibility",                         // object visibility
		"71": "arrow_head_disabled",                // arrow head disablity flag, Yes/No		
		"72": "path_type",                          // leader path type, Straight line/Spline	
		"73": "created",                            // leader creation flag	
		"74": "hookline_direction",                 // Hookline (or end of tangent for a splined leader) direction
		"75": "has_hookline",                       // Hookline flag, Yes/No
		"76": "number_of_vertices",                 // Number of vertices in leader (ignored for OPEN)
		"77": "color",                              // Color to use if leader's dimension color is BYBLOCK
		"100": "subclass",                          // subclass marker, AcDbLeader
		"210": "normal_vector.x",                   // the x value of the normal vector
		"211": "horizontal_direction.x",            // the x value of the “Horizontal” direction for leader
		"212": "offset_from_insertion_point.x",     // the x value of the Offset of last leader vertex from block reference insertion point
		"213": "offset_from_annotation.x",          // the x value of the Offset of last leader vertex from annotation placement point
		"220": "normal_vector.y",                   // the y value of the normal vector
		"221": "horizontal_direction.y",            // the y value of the “Horizontal” direction for leader
		"222": "offset_from_insertion_point.y",     // the y value of the Offset of last leader vertex from block reference insertion point
		"223": "offset_from_annotation.y",          // the y value of the Offset of last leader vertex from annotation placement point
		"230": "normal_vector.z",                   // the z value of the normal vector
		"231": "horizontal_direction.z",            // the z value of the “Horizontal” direction for leader
		"232": "offset_from_insertion_point.z",     // the z value of the Offset of last leader vertex from block reference insertion point
		"233": "offset_from_annotation.z"           // the z value of the Offset of last leader vertex from annotation placement point
	},
	"AcDbLine": {
		"0": "etype",        // type of entity, LINE
		"6": "line_type",    // line type name
		"8": "layer",        // the layer on which the point is defined
		"10": "start_x",     // the x coordinate of the starting point
		"11": "end_x",       // the x coordinate of the end point
		"20": "start_y",     // the y coordinate of the starting point
		"21": "end_y",       // the y coordinate of the end point
		"30": "start_z",     // the z coordinate of the starting point
		"31": "end_z",       // the z coordinate of the end point
		"48": "line_scale",  // line type scale
		"60": "visibility",  // object visibility
		"62": "color",       // color number, 0 = ByBlock, 256 = ByLayer		
		"100": "subclass",   // subclass marker. AcDbLine in this case
		"**": "length"       // length of the line
	},
	"AcDbLoftedSurface": {
		"0": "etype",                    // type of entity, SURFACE
		"1": "proprietary_data",         // proprietary data upto 255 characters (exclusive)
		"3": "proprietary_data",         // proprietary data beyond 255 characters
		"6": "line_type",                // line type name
		"8": "layer",                    // the layer on which the point is defined		
		"40": "transform_matrix",        // Revolve angle (in radians)
		"41": "start_draft_angle",       // Start draft angle (in radians)
		"42": "end_draft_angle",         // End draft angle (in radians)
		"43": "start_draft_magnitude",   // Start draft magnitude
		"44": "end_draft_magnitude",     // End draft magnitude		
		"48": "scale_factor",            // Scale factor
		"100": "subclass/specific_type"  // subclass marker, AcDbModelerGeometry/AcDbLoftedSurface
	},	
	"AcDbModelerGeometry": {
		"0": "etype",               // type of entity, 3DSOLID
		"1": "proprietary_data",    // proprietary data upto 255 characters (exclusive)
		"3": "proprietary_data",    // proprietary data beyond 255 characters
		"6": "line_type",           // line type name
		"7": "style",               // text style name
		"8": "layer",               // the layer on which the point is defined
		"48": "line_scale",         // line type scale
		"60": "visibility",         // object visibility
		"62": "color",              // color number, 0 = ByBlock, 256 = ByLayer
		"100": "subclass"           // subclass marker, AcDbMText
	},
	"AcDbMText": {
		"0": "etype",               // type of entity, MTEXT
		"1": "text",                // text value
		"6": "line_type",           // line type name
		"7": "style",               // text style name
		"8": "layer",               // the layer on which the point is defined
		"10": "x",                  // the x coordinate of the text insertion point
		"20": "y",                  // the y coordinate of the text insertion point	
		"30": "z",                  // the z coordinate of the text insertion point	
		"40": "height",             // text height
		"48": "line_scale",         // line type scale
		"50": "rotation",           // rotation angle 
		"60": "visibility",         // object visibility
		"62": "color",              // color number, 0 = ByBlock, 256 = ByLayer
		"72": "drawing_direction",  // the drawing direction of the text
		"100": "subclass"           // subclass marker, AcDbMText
	},
	"AcDbMline": {
		"0": "etype",                            // type of entity, MLINE
		"2": "style_name",                       // the name of the style used
		"6": "line_type",                        // line type name
		"8": "layer",                            // the layer on which the point is defined
		"10": "start_x",                         // the x coordinate of the starting point
		"11": "vertices.x",                      // the x coordinate of a vertex
		"12": "vertices.segment_dir_vector_x",   // the x value of the direction vector of the segment at the vertex
		"13": "vertices.miter_dir_vector_x",     // the x value of the direction vector of the miter at the vertex
		"20": "start_y",                         // the y coordinate of the starting point	
		"21": "vertices.y",                      // the y coordinate of a vertex
		"22": "vertices.segment_dir_vector_y",   // the y value of the direction vector of the segment at the vertex
		"23": "vertices.miter_dir_vector_y",     // the y value of the direction vector of the miter at the vertex
		"30": "start_z",                         // the z coordinate of the starting point	
		"31": "vertices.z",                      // the z coordinate of a vertex
		"40": "scale_factor",                    // scale factor
		"41": "vertices.parameters",             // Element parameters
		"42": "vertices.area_fill_parameters",   // Area fill parameters
		"48": "line_scale",                      // line type scale
		"60": "visibility",                      // object visibility
		"62": "color",                           // color number, 0 = ByBlock, 256 = ByLayer
		"70": "justification",                   // justification, Top/Middle/Bottom
		"71": "type",                            // multiline type
		"72": "number_of_vertices",              // number of vertices
		"74": "vertices.number_of_parameters",   // Number of parameters for this element 
		"75": "vertices.number_of_area_fill_parameters",              // Number of area fill parameters for this element 
		"100": "subclass"                        // subclass marker, AcDbMline		
	},	
	"AcDbPoint": {
		"0": "etype",        // type of entity, POINT
		"6": "line_type",    // line type name
		"8": "layer",        // the layer on which the point is defined
		"10": "x",           // the x coordinate of the point
		"20": "y",           // the y coordinate of the point
		"30": "z",           // the z coordinate of the point
		"48": "line_scale",  // line type scale
		"60": "visibility",  // object visibility
		"62": "color",       // color number, 0 = ByBlock, 256 = ByLayer		
		"100": "subclass"    // subclass marker. AcDbPoint in this case
	},	
	"AcDbPolyline": {
		"0": "etype",                     // type of entity, LWPOLYLINE
		"6": "line_type",                 // line type name		
		"8": "layer",                     // the layer on which the point is defined
		"10": "vertices.x",               // the x coordinate of a vertex
		"20": "vertices.y",               // the y coordinate of a vertex
		"30": "vertices.z",               // the z coordinate of a vertex
		"40": "vertices.start_width",     // bulge
		"41": "vertices.end_width",       // bulge
		"42": "vertices.bulge",           // bulge
		"48": "line_scale",               // line type scale
		"60": "visibility",               // object visibility
		"62": "color",                    // color number, 0 = ByBlock, 256 = ByLayer
		"70": "type",                     // type of the polyline, 'Closed' or 'Plinegen'
		"90": "number_of_vertices",       // number of vertices		
		"100": "subclass"                 // subclass marker, AcDbPolyline
	},
	"AcDb3dPolyline": {
		"0": "etype",                     // type of entity, POLYLINE
		"6": "line_type",                 // line type name		
		"8": "layer",                     // the layer on which the point is defined
		"10": "vertices.x",               // the x coordinate of a vertex
		"20": "vertices.y",               // the y coordinate of a vertex
		"30": "vertices.z",               // the z coordinate of a vertex
		"40": "vertices.start_width",     // bulge
		"41": "vertices.end_width",       // bulge
		"42": "vertices.bulge",           // bulge
		"48": "line_scale",               // line type scale
		"60": "visibility",               // object visibility
		"62": "color",                    // color number, 0 = ByBlock, 256 = ByLayer
		"70": "type",                     // type of the polyline, 'Closed' or 'Plinegen'
		"90": "number_of_vertices",       // number of vertices		
		"100": "subclass"                 // subclass marker, AcDb3dPolyline
	},
	"AcDbRasterImage": {
		"0": "etype",                     // type of entity, IMAGE
		"6": "line_type",                 // line type name
		"8": "layer",                     // the layer on which the point is defined
		"10": "insertion_point.x",        // the x coordinate of the insertion point
		"20": "insertion_point.y",        // the y coordinate of the insertion point
		"30": "insertion_point.z",        // the z coordinate of the insertion point
		"11": "u_vector.x",               // the x coordinate of the U vector
		"12": "v_vector.x",               // the x coordinate of the V vector
		"13": "u_value",                  // the U value
		"14": "clip_vertex.x",            // the x coordinate of a clip boundary vertex
		"21": "u_vector.y",               // the y coordinate of the U vector	
		"31": "u_vector.z",               // the z coordinate of the U vector	
		"22": "v_vector.y",               // the y coordinate of the V vector
		"32": "v_vector.z",               // the z coordinate of the V vector
		"23": "v_value",                  // the V value
		"24": "clip_vertex.y",            // the y coordinate of a clip boundary vertex
		"34": "clip_vertex.z",            // the z coordinate of a clip boundary vertex
		"48": "line_scale",               // line type scale
		"60": "visibility",               // object visibility
		"70": "image_display_properties", // image display properties
		"71": "clip_boundary_type",       // type of clip boundary, Rectangular/Polygonal		
		"100": "subclass",                // subclass marker, AcDbRasterImage
		"290": "clip_mode"                // clip mode flag, Outside/Inside
	},
	"AcDbRay": {
		"0": "etype",               // type of entity, RAY
		"6": "line_type",           // line type name
		"8": "layer",               // the layer on which the point is defined
		"10": "start_x",            // the x coordinate of the starting point
		"20": "start_y",            // the y coordinate of the starting point
		"30": "start_z",            // the z coordinate of the starting point
		"11": "unit_direction_x",   // unit direction	vector, x value (WCS)
		"21": "unit_direction_y",   // unit direction	vector, y value (WCS)
		"31": "unit_direction_z",   // unit direction	vector, z value (WCS)
		"48": "line_scale",         // line type scale
		"60": "visibility",         // object visibility
		"62": "color",              // color number, 0 = ByBlock, 256 = ByLayer		
		"100": "subclass"           // subclass marker, AcDbRay
	},
	"AcDbRevolvedSurface": {
		"0": "etype",               // type of entity, SURFACE
		"1": "proprietary_data",    // proprietary data upto 255 characters (exclusive)
		"3": "proprietary_data",    // proprietary data beyond 255 characters
		"6": "line_type",           // line type name
		"8": "layer",               // the layer on which the point is defined
		"10": "x",                  // the x coordinate of the axis point
		"20": "y",                  // the y coordinate of the axis point
		"30": "z",                  // the z coordinate of the axis point
		"11": "axis_vector.x",      // axis vector, x value
		"21": "axis_vector.y",      // axis vector, y value
		"31": "axis_vector.z",      // axis vector, z value
		"40": "revolve_angle",      // Revolve angle (in radians)
		"41": "start_angle",        // Start angle (in radians)
		"42": "transform_matrix",   // Transform matrix of revolved entity (16 reals; row major format; default = identity matrix)
		"43": "draft_angle",        // Draft angle (in radians)
		"44": "start_draft_distance",    // Start draft distance
		"45": "end_draft_distance", // End draft distance
		"46": "twist_angle",        // Twist angle (in radians)
		"71": "n_u_isolines",       // Number of U isolines
		"72": "n_v_isolines",       // Number of V isolines
		"100": "subclass/specific_type",  // subclass marker, AcDbModelerGeometry/AcDbRevolvedSurface
		"310": "binary_data"        // binary data
	},
	"AcDbShape": {
		"0": "etype",               // type of entity, SHAPE
		"2": "style_name",	        // style name
		"6": "line_type",           // line type name		
		"8": "layer",               // the layer on which the point is defined
		"10": "x",                  // the x coordinate of the insertion point
		"20": "y",                  // the y coordinate of the insertion point
		"30": "z",                  // the z coordinate of the insertion point		
		"40": "size",               // size
		"48": "line_scale",         // line type scale
		"50": "rotation",           // rotation angle
		"60": "visibility",         // object visibility
		"62": "color",              // color number, 0 = ByBlock, 256 = ByLayer
		"100": "subclass"           // subclass marker, AcDbShape
	},
	"AcDbSpline": {
		"0": "etype",                      // type of entity, SPLINE
		"6": "line_type",                  // line type name
		"8": "layer",                      // the layer on which the point is defined
		"10": "control_points.x",          // the x coordinate of a control point
		"20": "control_points.y",          // the y coordinate of a control point
		"11": "fit_points.x",              // the x coordinate of a fit point
		"12": "start_tangent.x",           // the x value of start tangent direction vector
		"13": "end_tangent.x",             // the x value of end tangent direction vector
		"21": "fit_points.y",              // the y coordinate of a fit point
		"22": "start_tangent.y",           // the y value of start tangent direction vector
		"23": "end_tangent.y",             // the y value of end tangent direction vector
		"30": "control_points.z",          // the z coordinate of a control point
		"31": "fit_points.z",              // the z coordinate of a fit point
		"32": "start_tangent.z",           // the z value of start tangent direction vector
		"33": "end_tangent.z",             // the z value of end tangent direction vector
		"40": "knot_values",               // array of knot values
		"41": "weights",                   // array of weights
		"48": "line_scale",                // line type scale
		"60": "visibility",                // object visibility
		"62": "color",                     // color number, 0 = ByBlock, 256 = ByLayer
		"70": "type",                      // type of the polyline, Closed/Periodic/Rational/Planar/Linear
		"71": "degree_of_curve",           // degree of curvature
		"72": "number_of_knots",           // number of knots
		"73": "number_of_control_points",  // number of control points
		"74": "number_of_fit_points",      // number of fit points
		"100": "subclass"                  // subclass marker, AcDbSpline
	},
	"AcDbSweptSurface": {
		"0": "etype",                        // type of entity, SURFACE
		"1": "proprietary_data",             // proprietary data upto 255 characters (exclusive)
		"3": "proprietary_data",             // proprietary data beyond 255 characters
		"6": "line_type",                    // line type name
		"8": "layer",                        // the layer on which the point is defined
		"10": "x",                           // the x coordinate of the sweep vector
		"20": "y",                           // the y coordinate of the sweep vector
		"30": "z",                           // the z coordinate of the sweep vector
		"11": "ref_vector.x",                // Reference vector for controlling twist, x value
		"21": "ref_vector.y",                // Reference vector for controlling twist, y value
		"31": "ref_vector.z",                // Reference vector for controlling twist, z value
		"40": "transform_matrix_sweep2",     // Transform matrix of sweep entity (16 reals; row major format; default = identity matrix)	
		"41": "transform_matrix_path2",      // Transform matrix of path entity (16 reals; row major format; default = identity matrix)	
		"42": "draft_angle",                 // Draft angle (in radians)
		"43": "start_draft_distance",        // Start draft distance
		"44": "end_draft_distance",          // End draft distance
		"45": "twist_angle",                 // Twist angle (in radians)
		"46": "transform_matrix_sweep",      // Transform matrix of sweep entity (16 reals; row major format; default = identity matrix)
		"47": "transform_matrix_path",       // Transform matrix of path entity (16 reals; row major format; default = identity matrix)
		"48": "scale_factor",                // Scale factor
		"49": "align_angle",                 // Align angle (in radians)
		"70": "sweep_alignment_option",      // Sweep alignment option
		"100": "subclass/specific_type",     // subclass marker, AcDbModelerGeometry/AcDbSweptSurface
		"310": "binary_data"                 // binary data
	},
	"AcDbTable": {
		"0": "etype",                               // type of entity, ACAD_TABLE
		"1": "cell_text",                           // text string
		"6": "line_type",                           // line type name
		"7": "style",                               // text style name		
		"8": "layer",                               // the layer on which the point is defined	
		"10": "x",                                  // the x coordinate of the insertion point point
		"20": "y",                                  // the y coordinate of the insertion point point	
		"30": "z",                                  // the z coordinate of the insertion point point	
		"11": "direction.x",                        // the x coordinate of a direction vector
		"21": "direction.y",                        // the y coordinate of a direction vector
		"31": "direction.z",                        // the z coordinate of a direction vector
		"60": "merged_value",                       // cell merged value, one for each cell
		"63": "fill_color",                         // Value for the background (fill) color of cell content, one for each cell
		"64": "cell_color",                         // Value for the color of cell content, one for each cell
		"65": "border_color_right",                 // True color value for the right border of the cell, one for each cell
		"66": "border_color_bottom",                // True color value for the bottom border of the cell, one for each cell
		"68": "border_color_left",                  // True color value for the left border of the cell, one for each cell
		"69": "border_color_top",                   // True color value for the top border of the cell, one for each cell		
		"91": "n_rows",                             // number of rows
		"92": "n_bytes_proxy_graphics/n_columns",   // Number of bytes in the proxy entity graphics/ number of columns
		"140": "text_height",                       // Text height value; override applied at the cell level
		"141": "row_height",                        // row height, one for each row 
		"142": "column_width",                      // column width, one for each column
		"144": "block_scale",                       // Block scale (real). This value applies only to block-type cells and is repeated, 1 value per cell
		"145": "rotation",                          // Rotation value (real; applicable for a block-type cell and a text-type cell)
		"170": "cell_alignment",                    // cell alignment, text/block, one for each cell 
		"171": "cell_type",                         // cell type, text/block, one for each cell 		
		"175": "border_width",                      // cell border width, one for each cell
		"176": "border_height",                     // cell border height, one for each cell
		"275": "line_weight_right",                 // Lineweight for the right border of the cell, one for each cell
		"276": "line_weight_bottom",                // Lineweight for the bottom border of the cell, one for each cell
		"278": "line_weight_left",                  // Lineweight for the left border of the cell, one for each cell
		"279": "line_weight_top",                   // Lineweight for the top border of the cell, one for each cell
		"283": "fill_color_on",                     // Boolean flag for whether the fill color is on, one for each cell
		"289": "top_border_visible",                // Boolean flag for the visibility of the top border of the cell, one for each cell
		"310": "proxy_graphics_data"               // Data for proxy entity graphics 
	},	
	"AcDbText": {
		"0": "etype",               // type of entity, TEXT/ATTRIB/ATTDEF
		"1": "text",                // text string
		"6": "line_type",           // line type name
		"7": "style",               // text style name		
		"8": "layer",               // the layer on which the point is defined	
		"10": "x",                  // the x coordinate of the text alignment point
		"20": "y",                  // the y coordinate of the text alignment point	
		"30": "z",                  // the z coordinate of the text alignment point	
		"40": "height",             // text height
		"41": "width",              // text width
		"42": "character_width",    // character width 
		"48": "line_scale",         // line type scale
		"50": "rotation",           // rotation angle 
		"60": "visibility",         // object visibility
		"62": "color",              // color number, 0 = ByBlock, 256 = ByLayer
		"100": "subclass"           // subclass marker, AcDbText
	},	
	"AcDbTrace": {
		"0": "etype",        // type of entity, TRACE
		"6": "line_type",    // line type name
		"8": "layer",        // the layer on which the point is defined
		"10": "corners.x",   // the x coordinate of the first corner
		"11": "corners.x",   // the x coordinate of the second corner
		"12": "corners.x",   // the x coordinate of the third corner
		"13": "corners.x",   // the x coordinate of the fourth corner
		"20": "corners.y",   // the y coordinate of the first corner
		"21": "corners.y",   // the y coordinate of the second corner
		"22": "corners.y",   // the y coordinate of the third corner
		"23": "corners.y",   // the y coordinate of the fourth corner
		"30": "corners.z",   // the z coordinate of the first corner
		"31": "corners.z",   // the z coordinate of the second corner
		"48": "line_scale",  // line type scale
		"60": "visibility",  // object visibility
		"62": "color",       // color number, 0 = ByBlock, 256 = ByLayer
		"100": "subclass"    // subclass marker, AcDbTrace
	},
	"AcDbVertex": {
		"0": "etype",         // type of entity, VERTEX
		"6": "line_type",     // line type name
		"8": "layer",         // the layer on which the point is defined
		"10": "x",            // the x coordinate of the location corner
		"20": "y",            // the y coordinate of the location corner
		"30": "z",            // the z coordinate of the location corner
		"40": "start_width",  // starting width
		"41": "end_width",    // ending width
		"48": "line_scale",   // line type scale
		"50": "curve_fit_tangent_direction",  // line type scale
		"60": "visibility",   // object visibility
		"62": "color",        // color number, 0 = ByBlock, 256 = ByLayer				
		"70": "type",         // type of the vertex
		"100": "subclass"     // subclass marker, AcDbVertex
	},
	"AcDbXline": {
		"0": "etype",        		      // type of entity, XLINE
		"6": "line_type", 			      // line type name
		"8": "layer",      				  // the layer on which the point is defined
		"10": "first_point.x",            // the x value of the first point
		"20": "first_point.y",            // the y value of the first point
		"30": "first_point.z",            // the z value of the first point
		"11": "unit_direction_vector.x",  // the x value of the uniit direction vector
		"21": "unit_direction_vector.y",  // the y value of the uniit direction vector
		"31": "unit_direction_vector.z",  // the z value of the uniit direction vector
		"48": "line_scale",               // line type scale		
		"60": "visibility",               // object visibility
		"62": "color",                    // color number, 0 = ByBlock, 256 = ByLayer
		"100": "subclass"                 // subclass marker, AcDbXline
	},
	
	"APPID": {
		"2": "name"           // a set of names for all registered applications
	},
	"DIMSTYLE": {
		"2": "name",                        // Dimension style name
		"3" : "dim_prefix",                 // DIMPOST, General dimensioning suffix
		"4" : "dim_suffix",                 // DIMAPOST, Alternate dimensioning suffix
		"6" : "arrow1",                     // DIMBLK1, First arrow block name
		"7" : "arrow2",                     // DIMBLK2, Second arrow block name
		"40" : "dim_scale_overall",         // DIMSCALE, Overall dimensioning scale factor
		"41" : "arrow_size",                // DIMASZ, Dimensioning arrow size
		"42" : "ext_line_offset",           // DIMEXO, Extension line offset
		"43" : "dim_line_increment",        // DIMDLI, Dimension line increment
		"44" : "ext_line_extension",        // DIMEXE, Extension line extension
		"45" : "dim_roundoff",              // DIMRND, Rounding value for dimension distances
		"46" : "dim_line_extension",        // DIMDLE, Dimension line extension
		"47" : "plus_tolerance",            // DIMTP, Plus tolerance
		"140" : "text_height",              // DIMTXT, Dimensioning text height
		"141" : "center_mark_size",         // DIMCEN, Size of center mark/lines
		"142" : "tick_size",                // DIMTSZ, Dimensioning tick size:
		"143" : "alt_scale_factor",         // DIMALTF, Alternate unit scale factor
		"144" : "dim_scale_linear",         // DIMLFAC, Linear measurements scale factor
		"145" : "text_position_vertical",   // DIMTVP, Text vertical position
		"146" : "tolerance_scale_factor",   // DIMTFAC, Dimension tolerance display scale factor
		"147" : "text_offset",              // DIMGAP, Dimension line gap
		"148" : "alt_round",                // DIMALTRND, Determines rounding of alternate units
		"71" : "tolerance_display",         // DIMTOL, Dimension tolerances generated
		"72" : "tolerance_limit",           // DIMLIM, Dimension limits generated if nonzero
		"73" : "text_inside_align",         // DIMTIH, Text inside horizontal 
		"74" : "text_outside_align",        // DIMTOH, Text outside horizontal 
		"75" : "ext_line1",                 // DIMSE1, First extension line suppressed 
		"76" : "ext_line2",                 // DIMSE2, Second extension line suppressed
		"77" : "text_pos_vert",             // DIMTAD, Text above dimension line
		"78" : "suppress_zero_inches/suppress_zero_feet",   // DIMZIN, suppression of zeros for primary unit values
		"79" : "suppress_leading_zeros/suppress_trailing_zeros",   // DIMAZIN, suppression of zeros for angular dimensions:
		"170" : "alt_enabled",              // DIMALT, Alternate unit dimensioning performed if nonzero
		"171" : "alt_precision",            // DIMALTD, Alternate unit decimal places
		"172" : "dim_line_forced",          // DIMTOFL, If text is outside extensions, force line extensions between extensions
		"173" : "separate_arrow_blocks",    // DIMSAH, separate arrow blocks
		"174" : "text_inside",              // DIMTIX, Force text inside extensions
		"175" : "dim_line_inside",          // DIMSOXD, Suppress outside-extensions dimension lines
		"176" : "dim_line_color",           // DIMCLRD, Dimension line color
		"177" : "ext_line_color",           // DIMCLRE, Dimension extension line color
		"178" : "text_color",               // DIMCLRT, Dimension text color
		"179" : "angle_precision",          // DIMADEC, Number of precision places displayed in angular dimensions
		"271" : "precision",                // DIMDEC, Number of decimal places for the tolerance values of a primary units dimension
		"272" : "tolerance_precision",      // DIMTDEC, Number of decimal places to display the tolerance values
		"273" : "alt_format",               // DIMALTU, Units format for alternate units of all dimension style family members except angular:
		"274" : "alt_tolerance_precision",  // DIMALTTD, Number of decimal places for tolerance values of an alternate units dimension
		"275" : "angle_format",             // DIMAUNIT, Angle format for angular dimensions
		"276" : "fraction_type",            // DIMFRAC,
		"277" : "dim_units",                // DIMLUNIT, units for all dimension types except Angular
		"278" : "decimal_separator",        // DIMDSEP, Single-character decimal separator used when creating dimensions whose unit format is decimal
		"279" : "text_movement",            // DIMTMOVE, Dimension text movement rules
		"280" : "text_pos_hor",             // DIMJUST, Horizontal dimension text position
		"281" : "dim_line1",                // DIMSD1, Suppression of first extension line
		"282" : "dim_line2",                // DIMSD2, Suppression of second extension line
		"283" : "tolerance_pos_vert",       // DIMTOLJ, Vertical justification for tolerance values
		"284" : "alt_suppress_leading_zeros/alt_suppress_trailing_zeros",   // DIMTZIN, suppression of zeros for tolerance values
		"285" : "suppress_leading_zeros/suppress_trailing_zeros",   // DIMALTZ, Controls suppression of zeros for alternate unit dimension values
		"286" : "suppress_zero_inches/suppress_zero_feet",   // DIMALTTZ, suppression of zeros for alternate tolerance values
		"289" : "fit",                     // DIMATFIT, dimension text and arrow placement
		"340" : "text_style",              // DIMTXSTY, Dimension text style
		"371" : "dim_line_weight",         // DIMLWD, Dimension line lineweight
		"372" : "ext_line_weight"          // DIMLWE, Extension line lineweight
	},
	"LAYER": {
		"2": "name",                // layer name
		"70": "status",             // status of layer, Thawed/Frozen/Frozen by default/Locked
		"62": "color_number",       // Color number 
		"6": "line_type"            // line type name
	},
	"VIEW": {		
		"2": "name",                // Name of view
		"10": "center.x",           // x value of the View center point (in DCS)
		"20": "center.y",           // y value of the View center point (in DCS)
		"11": "direction.x",        // x value of the View direction from target (in WCS)
		"21": "direction.y",        // y value of the View direction from target (in WCS)
		"31": "direction.z",        // y value of the View direction from target (in WCS)
		"12": "target_point.x",     // x value of Target point (in WCS)
		"22": "target_point.y",     // y value of Target point (in WCS)
		"32": "target_point.z",     // z value of Target point (in WCS)
		"40": "height",             // View height (in DCS)
		"41": "width",              // View width (in DCS)
		"42": "lens_angle",         // Lens length 
		"50": "twist_angle",        // Twist angle
		"70": "type",               // view type
		"72": "hasUCS",             // true if there is a UCS associated to this view; false otherwise
		"79": "orthographic_type",  // Orthographic type of UCS
		"110": "origin.x",          // x value of the UCS origin
		"120": "origin.y",          // y value of the UCS origin
		"130": "origin.z",          // z value of the UCS origin
		"111": "ucs_x.x",           // x value of UCS X-axis 
		"121": "ucs_x.y",           // y value of UCS X-axis
		"131": "ucs_x.z",           // z value of UCS X-axis		
		"112": "ucs_y.x",           // x value of UCS Y-axis 
		"122": "ucs_y.y",           // y value of UCS Y-axis 
		"132": "ucs_y.z",           // z value of UCS Y-axis 
		"146": "elevation"          // UCS elevation
	},
	"VPORT": {
		"2": "name",                    // Viewport name
		"10": "lower_left_corner.x",    // x value of Lower-left corner of viewport
		"20": "lower_left_corner.y",    // y value of Lower-left corner of viewport
		"11": "upper_right_corner.x",   // x value of Upper-right corner of viewport
		"21": "upper_right_corner.y",   // y value of Upper-right corner of viewport
		"12": "center.x",               // x value of View center point (in DCS) 
		"22": "center.y",               // y value of View center point (in DCS) 
		"12": "snap_base_point.x",      // x value of Snap base point (in DCS)
		"22": "snap_base_point.y",      // y value of Snap base point (in DCS)		
		"14": "snap_spacing.x",         // x value of Snap spacing
		"24": "snap_spacing.y",         // y value of Snap spacing		
		"15": "grid_spacing.x",         // x value of Grid spacing
		"25": "grid_spacing.y",         // y value of Grid spacing
		"35": "grid_spacing.z",         // z value of Grid spacing
		"16": "view_direction.x",       // x value of View direction from target point (in WCS)
		"26": "view_direction.y",       // y value of View direction from target point (in WCS)
		"36": "view_direction.z",       // z value of View direction from target point (in WCS)
		"17": "target_point.x",         // x value of View target point (in WCS)
		"27": "target_point.y",         // y value of View target point (in WCS)	
		"37": "target_point.z",         // z value of View target point (in WCS)
		"45": "height",                 // View height
		"42": "lens_length",            // Lens length
		"50": "snap_rotation_angle",    // Snap rotation angle
		"51": "twist_angle",            // View twist angle
		"72": "circle_sides",           // Circle sides
		"79": "orthographic_type",      // Orthographic type of UCS
		"110": "origin.x",              // x value of the UCS origin
		"120": "origin.y",              // y value of the UCS origin
		"130": "origin.z",              // z value of the UCS origin
		"111": "ucs_x.x",               // x value of UCS X-axis 
		"121": "ucs_x.y",               // y value of UCS X-axis 
		"131": "ucs_x.z",               // y value of UCS X-axis 
		"112": "ucs_y.x",               // x value of UCS Y-axis 
		"122": "ucs_y.y",               // y value of UCS Y-axis 
		"132": "ucs_y.z",               // z value of UCS Y-axis 
		"146": "elevation"              // Elevation
	},
	"BLOCK_RECORD": {
		"2": "name"                     // block name
	},
	"LTYPE": {
		"2": "name",                    // Linetype name
		"3": "description",             //Descriptive text for linetype
		"9": "embedded_texts",          // Text string
		"40": "total_pattern_length",   //Total pattern length
		"44": "x_offsets",              // X offset value
		"45": "y_offsets",              // Y offset value
		"46": "scale_value",            // Scale value
		"49": "pattern_lengths",        // Dash, dot or space length (one entry per element)
		"50": "embedded_element_rotations",     // rotation values in radians of embedded shape or text
		"73": "number_of_elements",     // The number of linetype elements
		"74": "embedded_element_type/embedded_element_rotation_type"  // Complex linetype element type (one per element).
	},
	"STYLE": {		
		"2": "name",                    // Style name
		"40": "text_height",            // Fixed text height
		"41": "width_factor",           // Width factor
		"50": "oblique_angle",          // Oblique angle
		"70": "type",                   // text type, Shape/Vertical text
		"71": "text_type",              // text type, Backward (mirrored in X)/Upside down (mirrored in Y)
		"1071": "font_type"             //A long value which contains a truetype font’s pitch and family, charset, and italic and bold flags
	},
	"UCS": {
		"2": "name",                    // UCS name
		"10": "origin.x",               // x value of the origin (WCS)
		"11": "x_axis_direction.x",     // x value of the X-axis direction (in WCS)
		"12": "y_axis_direction.x",     // x value of the Y-axis direction (in WCS)
		"13": "orthographic_origin.x",  // X value of the Origin for this orthographic type relative to this UCS
		"20": "origin.y",               // y value of the origin (WCS)	
		"21": "x_axis_direction.y",     // y value of the X-axis direction (in WCS)
		"22": "y_axis_direction.y",     // y value of the Y-axis direction (in WCS)
		"23": "orthographic_origin.y",  // Y value of the Origin for this orthographic type relative to this UCS
		"30": "origin.z",               // z value of the origin (WCS)	
		"31": "x_axis_direction.z",     // z value of the X-axis direction (in WCS)
		"32": "y_axis_direction.z",     // z value of the Y-axis direction (in WCS)
		"33": "orthographic_origin.z",  // z value of the Origin for this orthographic type relative to this UCS		
		"71": "orthographic_type",      // Orthographic type
		"146": "elevation"              // Elevation
	},
	"blocks": {
		"2": "name",                    // Block name
		"4": "description",             // Block description
		"8": "layer",                   // Layer name
		"10": "base_point.x",           // x value of base point
		"20": "base_point.y",           // y value of base point
		"30": "base_point.z",           // z value of base point
		"100": "entities"               // the entities (drawing elements) in the block
	}
};