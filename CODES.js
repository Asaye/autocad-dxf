module.exports = {
	"AcDbPoint": {
		"6": "line_type",    // line type name
		"8": "layer",        // the layer on which the point is defined
		"100": "etype",      // the type of the entity. AcDbPoint in this case
		"10": "x",           // the x coordinate of the point
		"20": "y",           // the y coordinate of the point
		"48": "line_scale",  // line type scale
		"60": "visibility",  // object visibility
		"62": "color"        // color number, 0 = ByBlock, 256 = ByLayer
	},
	"AcDbLine": {
		"6": "line_type",    // line type name
		"8": "layer",        // the layer on which the point is defined
		"10": "start_x",     // the x coordinate of the starting point
		"11": "end_x",       // the x coordinate of the end point
		"20": "start_y",     // the y coordinate of the starting point
		"21": "end_y",       // the y coordinate of the end point
		"48": "line_scale",  // line type scale
		"60": "visibility",  // object visibility
		"62": "color"        // color number, 0 = ByBlock, 256 = ByLayer
	},
	"AcDbDimension": {
		"6": "line_type",                    // line type name
		"8": "layer",                        // the layer on which the point is defined
		"3": "dimension_style",              // the name of the dimension style
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
		"40": "leader_length",               // length of the leader
		"42": "actual_measurement",          // actual measurement of the dimension
		"48": "line_scale",                  // line type scale
		"50": "rotation",                    // rotation angle of the dimension line
		"52": "ext_line_rotation",           // rotation angle of the extension lines
		"60": "visibility",                  // object visibility
		"62": "color",                       // color number, 0 = ByBlock, 256 = ByLayer
		"70": "type",                        // type of the dimension line
		"71": "attachement_point",           // attachment point
		"100": "specific_type"               // the specific type of the dimension (AcDbAlignedDimension/AcDb3PointAngularDimension/AcDbDiametricDimension/AcDbRadialDimension)		
	},
	"AcDbCircle": {
		"6": "line_type",      // line type name
		"8": "layer",          // the layer on which the point is defined
		"10": "x",             // x coordinate of the center
		"20": "y",             // y coordinate of the center 		
		"40": "radius",        // radius of the circle
		"48": "line_scale",    // line type scale
		"60": "visibility",    // object visibility
		"62": "color"          // color number, 0 = ByBlock, 256 = ByLayer
	},
	"AcDbArc": {
		"6": "line_type",      // line type name
		"10": "x",             // the x coordinate of the center
		"20": "y",             // the y coordinate of the center
		"8": "layer",          // the layer on which the point is defined
		"40": "radius",        // radius of the arc
		"50": "start_angle",   // start angle 
		"51": "end_angle",     // end angle 
		"48": "line_scale",    // line type scale
		"60": "visibility",    // object visibility
		"62": "color"          // color number, 0 = ByBlock, 256 = ByLayer
	},
	"AcDbEllipse": {
		"6": "line_type",      // line type name
		"10": "x",             // the x coordinate of the center
		"20": "y",             // the y coordinate of the center
		"8": "layer",          // the layer on which the point is defined
		"11": "major_end_dx",  // the delta X of the end point of the major axis w.r.t the center 
		"21": "major_end_dy",  // the delta Y of the end point of the major axis w.r.t the center 
		"40": "minorToMajor",  // the length ratio of the minor axis to the major axis
		"41": "start_angle",   // the start angle of the ellipse, 0 for full ellipse
		"42": "end_angle",     // the end angle of the ellipse, 2*PI for full ellipse
		"48": "line_scale",    // line type scale
		"60": "visibility",    // object visibility
		"62": "color"          // color number, 0 = ByBlock, 256 = ByLayer
	},
	"AcDbPolyline": {
		"6": "line_type",           // line type name		
		"8": "layer",               // the layer on which the point is defined
		"10": "vertices.x",         // the x coordinate of a vertex
		"20": "vertices.y",         // the y coordinate of a vertex
		"48": "line_scale",         // line type scale
		"60": "visibility",         // object visibility
		"62": "color",              // color number, 0 = ByBlock, 256 = ByLayer
		"70": "type",               // type of the polyline, 'Closed' or 'Plinegen'
		"90": "number_of_vertices"  // number of vertices
		
	},
	"AcDbText": {
		"1": "text",                // text string
		"7": "style",               // text style name
		"6": "line_type",           // line type name
		"10": "x",                  // the x coordinate of the text alignment point
		"20": "y",                  // the y coordinate of the text alignment point
		"8": "layer",               // the layer on which the point is defined		
		"40": "height",             // text height
		"41": "width",              // text width
		"42": "character_width",    // character width 
		"48": "line_scale",         // line type scale
		"50": "rotation",           // rotation angle 
		"60": "visibility",         // object visibility
		"62": "color"               // color number, 0 = ByBlock, 256 = ByLayer
	},
	"AcDbMtext": {
		"6": "line_type",           // line type name
		"10": "x",                  // the x coordinate of the text insertion point
		"20": "y",                  // the y coordinate of the text insertion point
		"8": "layer",               // the layer on which the point is defined
		"1": "text",                // text value
		"7": "style",               // text style name
		"40": "height",             // text height
		"48": "line_scale",         // line type scale
		"50": "rotation",           // rotation angle 
		"60": "visibility",         // object visibility
		"62": "color",              // color number, 0 = ByBlock, 256 = ByLayer
		"72": "drawing_direction"   // the drawing direction of the text
	},
	"AcDbMline": {
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
		"40": "scale_factor",                    // scale factor
		"48": "line_scale",                      // line type scale
		"60": "visibility",                      // object visibility
		"62": "color",                           // color number, 0 = ByBlock, 256 = ByLayer
		"70": "justification",                   // justification, Top/Middle/Bottom
		"71": "type",                            // multiline type
		"72": "number_of_vertices"               // number of vertices
		
		
	},
	"AcDbHatch": {
		"2": "style_name",	               // style name
		"6": "line_type",                  // line type name
		"10": "x",                         // the x coordinate of the elevation point
		"20": "y",                         // the y coordinate of the elevation point
		"8": "layer",                      // the layer on which the point is defined
		"10": "seed_points.x",             // the x coordinate of a seed point
		"20": "seed_points.y",             // the y coordinate of a seed point
		"41": "pattern_scale",             // pattern scale
		"48": "line_scale",                // line type scale
		"52": "pattern_angle",             // angle of rotation of the pattern
		"60": "visibility",                // object visibility
		"62": "color",                     // color number, 0 = ByBlock, 256 = ByLayer
		"70": "fill_type",                 // fill type, Pattern/Solid
		"71": "associative",               // associativity flag
		"75": "pattern",                   // the hatch style
		"76": "pattern",                   // the type of hatch pattern, User-defined/Predefined/Custom
		"78": "number_of_lines",           // total number of lines
		"91": "number_of_boundary_paths",  // number of boundary paths
		"98": "number_of_seed_points",     // number of seed points
		"450": "gradient"                  // true if the hatch is of gradient color or false otherwise
	},
	"AcDbSpline": {
		"6": "line_type",                  // line type name
		"8": "layer",                      // the layer on which the point is defined
		"10": "control_points.x",          // the x coordinate of a control point
		"20": "control_points.y",          // the y coordinate of a control point
		"11": "fit_points.x",              // the x coordinate of a fit point
		"21": "fit_points.y",              // the y coordinate of a fit point
		"40": "knot_values",               // array of knot values
		"48": "line_scale",                // line type scale
		"60": "visibility",                // object visibility
		"62": "color",                     // color number, 0 = ByBlock, 256 = ByLayer
		"70": "type",                      // type of the polyline, Closed/Periodic/Rational/Planar/Linear
		"71": "degree_of_curve",           // degree of curvature
		"72": "number_of_knots",           // number of knots
		"73": "number_of_control_points",  // number of control points
		"74": "number_of_fit_points"       // number of fit points
	},
	"AcDbShape": {
		"2": "style_name",	
		"6": "line_type",           // line type name		
		"10": "x",                  // the x coordinate of the insertion point
		"20": "y",                  // the y coordinate of the insertion point
		"8": "layer",               // the layer on which the point is defined
		"40": "size",               // size
		"48": "line_scale",         // line type scale
		"50": "rotation",           // rotation angle
		"60": "visibility",         // object visibility
		"62": "color"               // color number, 0 = ByBlock, 256 = ByLayer
	},
	"AcDbRay": {
		"6": "line_type",           // line type name
		"8": "layer",               // the layer on which the point is defined
		"10": "start_x",            // the x coordinate of the starting point
		"20": "start_y",            // the y coordinate of the starting point
		"11": "unit_direction_x",   // unit direction	vector, x value (WCS)
		"21": "unit_direction_y",   // unit direction	vector, y value (WCS)
		"48": "line_scale",         // line type scale
		"60": "visibility",         // object visibility
		"62": "color"               // color number, 0 = ByBlock, 256 = ByLayer		
		
	},
	"AcDbTrace": {
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
		"48": "line_scale",  // line type scale
		"60": "visibility",  // object visibility
		"62": "color"        // color number, 0 = ByBlock, 256 = ByLayer
	},
	"AcDbVertex": {
		"6": "line_type",     // line type name
		"8": "layer",         // the layer on which the point is defined
		"10": "x",            // the x coordinate of the location corner
		"20": "y",            // the y coordinate of the location corner
		"40": "start_width",  // starting width
		"41": "end_width",    // ending width
		"48": "line_scale",   // line type scale
		"50": "curve_fit_tangent_direction",  // line type scale
		"60": "visibility",   // object visibility
		"62": "color",        // color number, 0 = ByBlock, 256 = ByLayer				
		"70": "type"          // type of the vertex
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
		"12": "target_point.x",     // x value of Target point (in WCS)
		"22": "target_point.y",     // y value of Target point (in WCS)
		"40": "height",             // View height (in DCS)
		"41": "width",              // View width (in DCS)
		"42": "lens_angle",         // Lens length 
		"50": "twist_angle",        // Twist angle
		"70": "type",               // view type
		"72": "hasUCS",             // true if there is a UCS associated to this view; false otherwise
		"79": "orthographic_type",  // Orthographic type of UCS
		"110": "origin.x",          // x value of the UCS origin
		"120": "origin.y",          // y value of the UCS origin
		"111": "ucs_x.x",           // x value of UCS X-axis 
		"121": "ucs_x.x",           // y value of UCS X-axis 
		"112": "ucs_y.x",           // x value of UCS Y-axis 
		"122": "ucs_y.y",           // y value of UCS Y-axis 
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
		"22": "snap_base_point.x",      // y value of Snap base point (in DCS)
		"14": "snap_spacing.x",         // x value of Snap spacing
		"24": "snap_spacing.y",         // y value of Snap spacing
		"15": "grid_spacing.x",         // x value of Grid spacing
		"25": "grid_spacing.y",         // y value of Grid spacing
		"16": "view_direction.x",       // x value of View direction from target point (in WCS)
		"26": "view_direction.y",       // y value of View direction from target point (in WCS)
		"17": "target_point.x",         // x value of View target point (in WCS)
		"27": "target_point.y",         // y value of View target point (in WCS)		
		"45": "height",                 // View height
		"42": "lens_length",            // Lens length
		"50": "snap_rotation_angle",    // Snap rotation angle
		"51": "twist_angle",            // View twist angle
		"72": "circle_sides",           // Circle sides
		"79": "orthographic_type",      // Orthographic type of UCS
		"110": "origin.x",              // x value of the UCS origin
		"120": "origin.y",              // y value of the UCS origin
		"111": "ucs_x.x",               // x value of UCS X-axis 
		"121": "ucs_x.x",               // y value of UCS X-axis 
		"112": "ucs_y.x",               // x value of UCS Y-axis 
		"122": "ucs_y.y",               // y value of UCS Y-axis 
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
		"22": "y_axis_direction.x",     // y value of the Y-axis direction (in WCS)
		"23": "orthographic_origin.y",  // Y value of the Origin for this orthographic type relative to this UCS		
		"71": "orthographic_type",      // Orthographic type
		"146": "elevation"              // Elevation
	},
	"blocks": {
		"2": "name",                    // Block name
		"4": "description",             // Block description
		"8": "layer",                   // Layer name
		"10": "base_point.x",           // x value of base point
		"20": "base_point.y",           // y value of base point
		"100": "entities"               // the entities (drawing elements) in the block
	}
};