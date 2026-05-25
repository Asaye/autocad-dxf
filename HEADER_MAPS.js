module.exports = {
	HEADER_KEYS: {
		// === Drawing Setup & Identification ===
		ACADVER: "acad_version", // AutoCAD drawing database version number
		ACADMAINTVER: "acad_maintenance_version", // Maintenance version number
		DWGCODEPAGE: "drawing_code_page", // System code page when drawing was created
		HANDSEED: "next_available_handle", // Next available handle
		HANDLING: "handles_enabled", // 1 if handles are enabled
		REQUIREDVERSIONS: "required_versions", // (AutoCAD 2013+) Required application versions for custom objects
		PROJECTNAME: "project_name", // Project name (often for sheet sets)
		HYPERLINKBASE: "hyperlink_base_url", // Base URL for relative hyperlinks
		STYLESHEET: "stylesheet_filename", // Stylesheet filename associated with the drawing
		VERSIONGUID: "version_guid", // Version GUID, changes with each save
		FINGERPRINTGUID: "fingerprint_guid", // Fingerprint GUID, uniquely identifies a drawing
		EXTNAMES: "use_extended_symbol_names", // (R2000+) If 1, allows longer symbol table names

		// === Units & Precision ===
		MEASUREMENT: "measurement_system", // 0 = English (Imperial), 1 = Metric (for hatch & linetype)
		INSUNITS: "insertion_units", // Default drawing units for block insertion (0-24)
		LUNITS: "linear_units_format", // Units format for coordinates and distances
		LUPREC: "linear_units_precision", // Units precision for coordinates and distances
		ANGBASE: "angle_zero_direction", // Angle 0 direction (in degrees, usually East)
		ANGDIR: "angle_direction", // Angle direction (0 = Counterclockwise, 1 = Clockwise)
		AUNITS: "angle_unit_format", // Units format for angles
		AUPREC: "angle_unit_precision", // Units precision for angles
		UNITMODE: "unit_mode_display", // Controls display of fractional, feet-and-inches, surveyor's angles (0 or 1)

		// === Drawing Limits & Extents ===
		LIMMIN: "drawing_limits_min_xy", // XY drawing limits lower-left corner (WCS)
		LIMMAX: "drawing_limits_max_xy", // XY drawing limits upper-right corner (WCS)
		LIMCHECK: "drawing_limits_checking", // 1 if limits checking is on
		EXTMIN: "drawing_extents_min", // X, Y, Z drawing extents lower-left corner (WCS)
		EXTMAX: "drawing_extents_max", // X, Y, Z drawing extents upper-right corner (WCS)
		// Paper Space Limits & Extents
		PLIMMIN: "ps_limits_min_xy", // Paper space limits lower-left corner
		PLIMMAX: "ps_limits_max_xy", // Paper space limits upper-right corner
		PLIMCHECK: "ps_limits_checking", // 1 if paper space limits checking is on
		PEXTMIN: "ps_extents_min", // Paper space extents lower-left corner
		PEXTMAX: "ps_extents_max", // Paper space extents upper-right corner

		// === Current Environment & Modes ===
		CLAYER: "current_layer_name", // Current layer name
		CECOLOR: "current_entity_color", // Current entity color number (0=BYBLOCK, 256=BYLAYER)
		CELTYPE: "current_entity_linetype", // Current entity linetype name (or BYBLOCK, BYLAYER)
		CELTSCALE: "current_entity_linetype_scale", // Current entity linetype scale
		CELWEIGHT: "current_entity_lineweight", // Lineweight of new objects (-3 to 211)
		CMLSTYLE: "current_multiline_style_name", // Current multiline style name
		CMLJUST: "current_multiline_justification", // 0=Top, 1=Middle, 2=Bottom
		CMLSCALE: "current_multiline_scale", // Current multiline scale
		TEXTSTYLE: "current_text_style_name", // Current text style name
		THICKNESS: "current_thickness", // Current 3D thickness
		FILLMODE: "fill_mode", // 1 if fill mode is on
		ORTHOMODE: "orthographic_mode", // 1 if ortho mode is on
		REGENMODE: "regenauto_mode", // 1 if REGENAUTO is on
		QTEXTMODE: "quick_text_mode", // 1 if quick text mode is on
		MIRRTEXT: "mirror_text_mode", // 1 if text is mirrored by MIRROR command
		OSMODE: "object_snap_mode", // Running object snap modes (bitcoded)
		ATTMODE: "attribute_display_mode", // Attribute visibility: 0=None, 1=Normal, 2=All
		ATTDIA: "attribute_dialog_mode", // 1 for dialog box for attribute entry, 0 for command line
		ATTREQ: "attribute_request_mode", // 1 to prompt for attributes during INSERT, 0 for defaults
		PDMODE: "point_display_mode", // Point display mode (integer)
		PDSIZE: "point_display_size", // Point display size
		PLINEGEN: "polyline_linetype_generation", // For 2D polylines: 0=vertex-to-vertex, 1=continuous
		PLINEWID: "default_polyline_width", // Default polyline width
		PROXYGRAPHICS: "save_proxy_graphics", // 1 to save proxy graphics for custom objects
		PSLTSCALE: "paperspace_linetype_scale", // 1 if linetype scaling in paper space is based on viewport scale
		SKETCHINC: "sketch_record_increment", // Sketch record increment value
		SKPOLY: "sketch_as_polylines", // 0 for lines, 1 for polylines during SKETCH
		SPLFRAME: "spline_frame_display", // 1 to display spline control frame
		TREEDEPTH: "spatial_index_tree_depth", // Max depth for spatial index tree (e.g., for TRIM/EXTEND)
		USERI1: "user_integer_1",
		USERI2: "user_integer_2",
		USERI3: "user_integer_3",
		USERI4: "user_integer_4",
		USERI5: "user_integer_5",
		USERR1: "user_real_1",
		USERR2: "user_real_2",
		USERR3: "user_real_3",
		USERR4: "user_real_4",
		USERR5: "user_real_5",
		USRTIMER: "user_elapsed_timer_on", // 1 if user elapsed timer is active
		VISRETAIN: "xref_layer_visibility_retain", // 1 to retain visibility changes to xref-dependent layers

		// === Coordinate Systems (UCS) ===
		UCSNAME: "ucs_current_name", // Name of current UCS (model space)
		UCSORG: "ucs_current_origin", // Origin of current UCS (model space, WCS coordinates)
		UCSXDIR: "ucs_current_x_axis", // X-axis direction of current UCS (model space, WCS vector)
		UCSYDIR: "ucs_current_y_axis", // Y-axis direction of current UCS (model space, WCS vector)
		UCSORTHOVIEW: "ucs_orthographic_view_type", // Orthographic view type of current UCS
		UCSBASE: "ucs_base_name", // Name of UCS that defines the orthographic UCS settings
		UCSAXISANG: "ucs_axis_angle", // (R2007+) Angle of UCS around its X, Y, or Z axis
		UCSFOLLOW: "ucs_follow_mode", // 1 if UCS changes to match plan view when VIEW changes
		WORLDVIEW: "set_wcs_for_dview_vpoint", // 1 sets UCS to WCS during DVIEW/VPOINT
		// Paper Space UCS
		PUCSNAME: "ps_ucs_current_name", // Name of current UCS (paper space)
		PUCSORG: "ps_ucs_current_origin", // Origin of current UCS (paper space)
		PUCSXDIR: "ps_ucs_current_x_axis", // X-axis direction of current UCS (paper space)
		PUCSYDIR: "ps_ucs_current_y_axis", // Y-axis direction of current UCS (paper space)
		PUCSORTHOVIEW: "ps_ucs_orthographic_view_type",
		PUCSBASE: "ps_ucs_base_name",
		PUCSAXISANG: "ps_ucs_axis_angle",

		// === Elevation & Extrusion ===
		ELEVATION: "current_elevation_z", // Current elevation (Z-axis) for new objects (model space)
		PELEVATION: "ps_current_elevation_z", // Current elevation (Z-axis) for new objects (paper space)

		// === Geometric Properties ===
		CHAMFERA: "chamfer_distance_a", // First chamfer distance
		CHAMFERB: "chamfer_distance_b", // Second chamfer distance
		CHAMFERC: "chamfer_length", // Chamfer length (if using length/angle method)
		CHAMFERD: "chamfer_angle", // Chamfer angle (if using length/angle method)
		FILLETRAD: "fillet_radius", // Fillet radius
		LTSCALE: "global_linetype_scale", // Global linetype scale factor
		TRACEWID: "default_trace_width", // Default trace width
		TEXTSIZE: "default_text_height", // (Older, often superseded by text style) Default text height
		TEXTQLTY: "truetype_text_quality", // (Obsolete) Text quality for TrueType fonts (0-100)

		// === Date & Time ===
		TDCREATE: "drawing_creation_time_julian", // Julian date/time of creation
		TDUPDATE: "drawing_update_time_julian", // Julian date/time of last update
		TDINDWG: "total_editing_time", // Total editing time (days and fractional days)
		TDUSRTIMER: "user_elapsed_timer_value", // User elapsed timer (days and fractional days)
		TDUCREATE: "utc_creation_time", // Universal date/time of creation
		TDUUPDATE: "utc_update_time", // Universal date/time of last update

		// === Plotting & Output ===
		PSTYLEMODE: "plot_style_mode", // 1 for color-dependent, 0 for named plot styles
		CEPSNTYPE: "current_entity_plot_style_type", // Plot style type of new objects
		CEPSNID: "current_entity_plot_style_handle", // Plotstyle handle of new objects (if CEPSNTYPE is 3)
		PAPERUPDATE: "paper_update_setting", // (Obsolete)
		PLOTROTMODE: "plot_rotation_mode", // (Obsolete)

		// === Viewport Variables (often associated with *Active VPORT table entry, but some are global) ===
		VIEWCTR: "active_viewport_center_xy", // View center point (DCS) for current viewport
		VIEWDIR: "active_viewport_view_direction", // View direction (from target to camera in WCS) for current viewport
		VIEWSIZE: "active_viewport_height", // View height (in drawing units) for current viewport
		TARGET: "active_viewport_target_point", // Target point (WCS)
		LENSLENGTH: "active_viewport_lens_length_mm", // Lens length in mm for perspective view
		VIEWTWIST: "active_viewport_twist_angle", // View twist angle
		FRONTZ: "active_viewport_front_clip_z", // Front clip plane Z value (offset from target)
		BACKZ: "active_viewport_back_clip_z", // Back clip plane Z value (offset from target)
		SNAPANG: "snap_grid_rotation_angle", // Snap/grid rotation angle for current viewport
		SNAPBASE: "snap_grid_origin_xy", // Snap/grid origin point for current viewport
		SNAPISOPAIR: "isometric_snap_plane", // Isometric plane (0=left, 1=top, 2=right)
		SNAPMODE: "snap_mode_on", // 1 if snap mode is on
		SNAPSTYLE: "snap_style", // 0=standard, 1=isometric
		SNAPUNIT: "snap_spacing_xy", // Snap spacing (X,Y)
		GRIDDISPLAY: "grid_display_behavior", // (R2008+) Bitcode for grid display
		GRIDMAJOR: "major_grid_line_frequency", // (R2008+) How many minor grid lines per major line
		GRIDUNIT: "grid_spacing_xy", // Grid spacing (X,Y) for current viewport
		MAXACTVP: "max_active_viewports", // Sets maximum number of viewports to be regenerated

		// === 3D & Shading ===
		SHADEDGE: "shade_edge_mode", // Edge shading mode (0-3)
		SHADEDIF: "shade_diffuse_to_ambient_ratio", // Percent ambient to diffuse light (0-100)
		DISPSILH: "display_solid_silhouette_curves", // 1 to display silhouette curves of solid bodies in Wireframe
		CSHADOW: "current_shadow_display_mode", // Shadow mode for 3D objects
		CSHADOWPLANES: "custom_shadow_plane_z", // Z-depth of custom ground plane for shadows
		INTERSECTIONCOLOR: "intersection_polyline_color", // Color for intersection polylines
		INTERSECTIONDISPLAY: "intersection_polyline_display", // 1 to display intersection polylines for solids
		OBSCOLOR: "obscured_line_color_index", // Color index for obscured lines
		OBSLTYPE: "obscured_linetype_index", // Linetype index for obscured lines
		SOLIDHIST: "solid_history_recording", // 0=None, 1=Record history, 2=Record history (create b-rep)
		SHOWHIST: "show_solid_history", // Controls display of composite solid history
		PSOLWIDTH: "default_polysolid_width",
		PSOLHEIGHT: "default_polysolid_height",
		RENDERERTYPE: "current_renderer_type", // 0=Scanline, 1=Rapid RT
		LIGHTGLYPHDISPLAY: "light_glyph_display", // 1 to display light glyphs
		TILEMODELIGHTSYNCH: "tilemode_light_synchronization", // (Obsolete)
		CMATERIAL: "current_material_handle", // Handle of the current material

		// === Underlay Management ===
		DWFFRAME: "dwf_underlay_frame_visibility", // 0=No frame, 1=Display frame, 2=Display and plot frame
		DGNFRAME: "dgn_underlay_frame_visibility", // (Similar to DWFFRAME)
		PDFFRAME: "pdf_underlay_frame_visibility", // (Similar to DWFFRAME)
		XCLIPFRAME: "xclip_frame_visibility", // 0=No frame, 1=Display frame, 2=Display and plot frame

		// === Geographic Location ===
		GEOData: "geographic_data_handle", // Handle to GEODATA object
		LATITUDE: "geographic_location_latitude",
		LONGITUDE: "geographic_location_longitude",
		NORTHDIRECTION: "geographic_north_direction_angle",
		TIMEZONE: "geographic_timezone",

		// === Miscellaneous / Advanced ===
		DRAGVS: "visual_style_while_dragging_handle", // Handle to visual style used while dragging
		SORTENTS: "object_sort_method_flags", // Controls object sorting for various operations (bitcoded)
		INDEXCTL: "layer_spatial_index_control", // Controls creation of layer and spatial indexes (0-3)
		HIDETEXT: "hide_text_objects_during_hide", // 0=Text not hidden, 1=Text hidden (obsolete for TrueType)
		HALOGAP: "halo_gap_percentage", // Gap percentage for halos on objects
		CAMERADISPLAY: "camera_icon_display", // 1 if camera icons are displayed
		CAMERAHEIGHT: "default_camera_height",
		INTERFEREOBJVS: "interference_object_visual_style_handle", // Visual style for interference objects
		INTERFEREVPVS: "interference_viewport_visual_style_handle", // Visual style for viewport during interference check
		DRAWORDERCTL: "draworder_inheritance_control", // (Obsolete)
		MLeaderScale: "multileader_scale",
		MSOleScale: "ole_object_scale_control", // OLE object scaling
		SAVEFIDELITY: "visual_fidelity_on_save", // 1 to maintain visual fidelity for annotative objects
		ANNOALLVISIBLE: "show_all_annotation_scales", // 1 to display annotative objects at all scales
		ANNOTATIVEDWG: "drawing_is_annotative", // 1 if the drawing contains annotative objects
		MSLTSCALE: "modelspace_linetype_scale_for_ps", // 1 if linetype scaling in model space is affected by PSLTSCALE
		LIGHTINGUNITS: "lighting_units", // 0=Generic, 1=Photometric (American), 2=Photometric (International)
		LUPS: "luminance_units_per_square_centimeter", // For photometric lighting
		TILEMODE: "tilemode_status", // (Obsolete, reflects active space: 1 = Model tab, 0 = Layout tab)

		// === Dimensioning Variables ($DIM...) ===
		// Many of these control the current dimension style unless overridden
		DIMADEC: "dim_angular_precision",
		DIMALT: "dim_alternate_units_enabled",
		DIMALTD: "dim_alternate_units_decimal_places",
		DIMALTF: "dim_alternate_units_scale_factor",
		DIMALTRND: "dim_alternate_units_rounding",
		DIMALTTD: "dim_alternate_tolerance_decimal_places",
		DIMALTTZ: "dim_alternate_tolerance_zero_suppression",
		DIMALTU: "dim_alternate_units_format",
		DIMALTZ: "dim_alternate_units_zero_suppression",
		DIMAPOST: "dim_alternate_units_suffix_prefix",
		DIMASO: "dim_associativity_obsolete", // Obsolete, use DIMASSOC
		DIMASSOC: "dim_associativity_control", // Controls associativity of dimension objects
		DIMASZ: "dim_arrow_size",
		DIMATFIT: "dim_text_arrow_placement_rule",
		DIMAUNIT: "dim_angular_unit_format",
		DIMAZIN: "dim_angular_zero_suppression",
		DIMBLK: "dim_arrow_block_name",
		DIMBLK1: "dim_first_arrow_block_name",
		DIMBLK2: "dim_second_arrow_block_name",
		DIMCEN: "dim_center_mark_size",
		DIMCLRD: "dim_dimension_line_color",
		DIMCLRE: "dim_extension_line_color",
		DIMCLRT: "dim_text_color",
		DIMDEC: "dim_primary_units_precision",
		DIMDLE: "dim_dimension_line_extension",
		DIMDLI: "dim_dimension_line_increment_baseline",
		DIMEXE: "dim_extension_line_extension",
		DIMEXO: "dim_extension_line_offset",
		DIMFRAC: "dim_fraction_format", // 0=Horizontal, 1=Diagonal, 2=Not stacked
		DIMFXL: "dim_fixed_length_extension_lines_enabled", // R2007+
		DIMFXLON: "dim_fixed_length_extension_line_length", // R2007+
		DIMGAP: "dim_text_gap_from_dim_line",
		DIMJOGANG: "dim_jogged_radius_dimension_oblique_angle", // Angle of transverse lines in jogged dim
		DIMJUST: "dim_horizontal_text_justification",
		DIMLDRBLK: "dim_leader_arrow_block_name",
		DIMLFAC: "dim_linear_measurement_scale_factor",
		DIMLIM: "dim_generate_limits",
		DIMLUNIT: "dim_linear_units_format_non_angular", // For non-angular dimensions (superseded by LUNITS but exists in DIMSTYLE)
		DIMLWD: "dim_dimension_line_lineweight",
		DIMLWE: "dim_extension_line_lineweight",
		DIMPOST: "dim_primary_units_suffix_prefix",
		DIMRND: "dim_rounding_value_for_distances",
		DIMSAH: "dim_separate_arrow_blocks_enabled",
		DIMSCALE: "dim_overall_scale_factor",
		DIMSD1: "dim_suppress_first_dimension_line",
		DIMSD2: "dim_suppress_second_dimension_line",
		DIMSE1: "dim_suppress_first_extension_line",
		DIMSE2: "dim_suppress_second_extension_line",
		DIMSHO: "dim_recompute_while_dragging_obsolete", // Obsolete
		DIMSOXD: "dim_suppress_outside_extension_dimension_lines",
		DIMSTYLE: "dim_current_style_name",
		DIMTAD: "dim_text_above_dimension_line_vertical_just", // 0=Centered, 1=Above, etc.
		DIMTDEC: "dim_tolerance_decimal_places",
		DIMTFAC: "dim_tolerance_text_height_scale_factor",
		DIMTIH: "dim_text_inside_horizontal", // 1=Inside horizontal, 0=Aligned with dim line
		DIMTIX: "dim_force_text_inside_extensions",
		DIMTM: "dim_minus_tolerance_value",
		DIMTMOVE: "dim_text_movement_rules",
		DIMTOFL: "dim_force_line_between_extensions_if_text_outside",
		DIMTOH: "dim_text_outside_horizontal", // 1=Outside horizontal, 0=Aligned with dim line
		DIMTOL: "dim_generate_tolerances",
		DIMTOLJ: "dim_tolerance_vertical_justification",
		DIMTP: "dim_plus_tolerance_value",
		DIMTSZ: "dim_tick_size", // 0 for arrows, >0 for ticks
		DIMTVP: "dim_text_vertical_position_relative_to_dim_line",
		DIMTXT: "dim_text_height",
		DIMTXTDIRECTION: "dim_text_direction", // (R2007+) 0=Left-to-Right, 1=Right-to-Left
		DIMTZIN: "dim_tolerance_zero_suppression",
		DIMUPT: "dim_user_positioned_text",
		DIMZIN: "dim_primary_units_zero_suppression",
		LASTSAVEDBY: "last_saved_by",
		DIMTXSTY: "dim_text_style_name",
		DIMDSEP: "dim_decimal_separator_char_ascii",
		DIMTFILL: "dim_text_fill_mode",
		DIMTFILLCLR: "dim_text_fill_color_aci",
		DIMARCSYM: "dim_arc_length_symbol_placement",
		DIMLTYPE: "dim_line_linetype_name",
		DIMLTEX1: "dim_extension_line1_linetype_name",
		DIMLTEX2: "dim_extension_line2_linetype_name",
		INSBASE: "insertion_base_point",
		MENU: "menu_filename", // (Likely already in your map, verify)
		SPLINETYPE: "spline_curve_type_pedit", // (Likely already in your map)
		SPLINESEGS: "spline_segments_per_patch", // (Likely already in your map)
		SURFTAB1: "surface_density_m_direction", // (Likely already in your map)
		SURFTAB2: "surface_density_n_direction", // (Likely already in your map)
		SURFTYPE: "surface_type_pedit_smooth", // (Likely already in your map)
		SURFU: "surface_u_density_pedit_smooth", // (Likely already in your map)
		SURFV: "surface_v_density_pedit_smooth", // (Likely already in your map)
		UCSORTHOREF: "ucs_orthographic_reference_name",
		UCSORGTOP: "ucs_origin_top",
		UCSORGBOTTOM: "ucs_origin_bottom",
		UCSORGLEFT: "ucs_origin_left",
		UCSORGRIGHT: "ucs_origin_right",
		UCSORGFRONT: "ucs_origin_front",
		UCSORGBACK: "ucs_origin_back",
		PUCSORTHOREF: "ps_ucs_orthographic_reference_name",
		PUCSORGTOP: "ps_ucs_origin_top",
		PUCSORGBOTTOM: "ps_ucs_origin_bottom",
		PUCSORGLEFT: "ps_ucs_origin_left",
		PUCSORGRIGHT: "ps_ucs_origin_right",
		PUCSORGFRONT: "ps_ucs_origin_front",
		PUCSORGBACK: "ps_ucs_origin_back",
		PINSBASE: "ps_insertion_base_point",
		ENDCAPS: "lineweight_endcap_style",
		JOINSTYLE: "lineweight_join_style",
		XEDIT: "xref_in_place_editing_enabled",
		PSVPSCALE: "ps_viewport_creation_scale_factor", // Paper space viewport scale factor (0.0 means "Scale to fit")
		OLESTARTUP: "ole_object_load_on_open",
		STEPSPERSEC: "animation_steps_per_second_3dorbit",
		STEPSIZE: "animation_step_size_3dorbit",
		"3DDWFPREC": "threed_dwf_precision", // Note: Key starts with number, map to valid JS var name
		LOFTANG1: "loft_draft_angle1", // (Likely already in your map)
		LOFTANG2: "loft_draft_angle2", // (Likely already in your map)
		LOFTMAG1: "loft_draft_magnitude1", // (Likely already in your map)
		LOFTMAG2: "loft_draft_magnitude2", // (Likely already in your map)
		LOFTPARAM: "loft_parameterization", // (Likely already in your map)
		LOFTNORMALS: "loft_normals_setting", // (Likely already in your map)
		REALWORLDSCALE: "real_world_scale_for_linetypes",
		INTERFERECOLOR: "interference_object_color_aci", // (Likely already in your map)
		SHADOWPLANELOCATION: "shadow_plane_z_location", // (Likely already in your map)

		// === AutoCAD Mechanical Specific (if applicable, often prefixed with $AM...) ===
		// These are less common in generic DXF unless coming from ACADM
		// Example: $AMCONTENTPROFILE, $AMCONTENTVARIANT

		// === Variables often found but sometimes undocumented or for specific internal use ===
		// It's harder to provide definitive human-readable names without specific context.
		// Examples: $ACADLSPASDOC, $PICKSTYLE, $SURFTYPE, $SURFU, $SURFV, etc.
	},
	HEADER_VALUES: {
		  AUNITS: {
			"0": "Decimal degrees",
			"1": "Degrees/minutes/seconds",
			"2": "Grads",
			"3": "Radians",
			"4": "Surveyor’s units"
		  },
		  CMLJUST: {
			"0": "Top",
			"1": "Middle",
			"2": "Bottom"
		  },
		  DIMAUNIT: {
			"0": "Decimal degrees",
			"1": "Degrees/minutes/seconds",
			"2": "Grads",
			"3": "Radians",
			"4": "Surveyor’s units"
		  },
		  ANGDIR: {
			"0": "Counterclockwise",
			"1": "Clockwise"
		  },
		  MEASUREMENT: {
			"0": "English (Imperial)",
			"1": "Metric"
		  },
		  ORTHOMODE: {
			"0": "Off",
			"1": "On"
		  },
		  ATTMODE: {
			"0": "Invisible",
			"1": "Normal",
			"2": "All"
		  },
		  COORDS: {
			"0": "Static",
			"1": "Dynamic",
			"2": "Polar"
		  },
		  TILEMODE: {
			"0": "Paper space",
			"1": "Model space"
		  },
		  LIMCHECK: {
			"0": "Off",
			"1": "On"
		  },
		  PLIMCHECK: {
			"0": "Off",
			"1": "On"
		  },
		  PSLTSCALE: {
			"0": "No scaling",
			"1": "Scale by viewport"
		  },
		  USRTIMER: {
			"0": "Off",
			"1": "On"
		  },
		  VISRETAIN: {
			"0": "Off",
			"1": "On"
		  },
		  WORLDVIEW: {
			"0": "Off",
			"1": "On"
		  },
		  LUNITS: {
			"1": "Scientific",
			"2": "Decimal",
			"3": "Engineering",
			"4": "Architectural",
			"5": "Fractional"
		  },
		  INSUNITS: {
			"0": "Unitless",
			"1": "Inches",
			"2": "Feet",
			"3": "Miles",
			"4": "Millimeters",
			"5": "Centimeters",
			"6": "Meters",
			"7": "Kilometers",
			"8": "Microinches",
			"9": "Mils",
			"10": "Yards",
			"11": "Angstroms",
			"12": "Nanometers",
			"13": "Microns",
			"14": "Decimeters",
			"15": "Decameters",
			"16": "Hectometers",
			"17": "Gigameters",
			"18": "Astronomical units",
			"19": "Light years",
			"20": "Parsecs"
		  },
		  DIMDSEP: { // Dimension Decimal Separator Character (ASCII value)
			"46": "Period (.)",
			"44": "Comma (,)",
			"32": "Space ( )"
			// Add others if needed
		},
		DIMTFILL: { // Dimension Text Fill Mode
			"0": "No background fill",
			"1": "Drawing background color fill",
			"2": "Custom background color fill (see DIMTFILLCLR)"
		},
		DIMTFILLCLR: { // Dimension Text Fill Color (ACI - AutoCAD Color Index)
			"0": "ByBlock (if DIMTFILL=2) / Drawing Background (if DIMTFILL=1)",
			"256": "ByLayer"
			// Add other ACI values as needed, e.g., "1": "Red", "2": "Yellow"
		},
		DIMARCSYM: { // Dimension Arc Length Symbol Placement
			"0": "Symbol preceding dimension text",
			"1": "Symbol above dimension text",
			"2": "No arc length symbol"
		},
		SPLINETYPE: { // Spline Curve Type (for PEDIT command)
			"5": "Quadratic B-spline",
			"6": "Cubic B-spline",
			"8": "Bezier curve"
		},
		SURFTYPE: { // Surface Type (for PEDIT SMOOTH command)
			"5": "Quadratic B-spline surface",
			"6": "Cubic B-spline surface",
			"8": "Bezier surface"
		},
		ENDCAPS: { // Lineweight Endcap Style
			"0": "No endcaps",
			"1": "Round endcaps",
			"2": "Angle endcaps", // (Standard: 45 degrees)
			"3": "Square endcaps"
		},
		JOINSTYLE: { // Lineweight Join Style
			"0": "Miter join",
			"1": "Round join",
			"2": "Bevel join"
			// "3": "Diamond join" // (Less common in base DXF, might be app-specific)
		},
		XEDIT: { // Xref In-Place Editing Enabled
			"0": "Disallowed",
			"1": "Allowed"
		},
		OLESTARTUP: { // OLE Object Load on Drawing Open
			"0": "Do not load OLE object",
			"1": "Load OLE object when drawing is opened"
		},
		"3DDWFPREC": { // Precision for 3D DWF Publishing
			// Values can range. These are common interpretations.
			"1": "Low Precision",
			"2": "Medium-Low Precision", // Your output was '2.0'
			"3": "Medium Precision",
			"4": "Medium-High Precision",
			"5": "High Precision",
			"6": "Maximum Precision"
			// Higher values (e.g., 16-20) might refer to specific bit depths.
		},
		LOFTPARAM: { // Loft Parameterization (Controls continuity between lofted sections)
			"0": "Smooth fit (default)",
			"1": "Ruled (linear interpolation)",
			"2": "Normal to Start Cross Section",
			"3": "Normal to End Cross Section",
			"4": "Normal to Start and End Cross Sections",
			"5": "Normal to All Cross Sections",
			"6": "Use Draft Angles (LOFTANG1, LOFTANG2)",
			"7": "Use Draft Angles, Start Magnitude, End Magnitude (LOFTMAG1, LOFTMAG2)" // Your output was '7'
		},
		LOFTNORMALS: { // Loft Normals Setting (Defines how surface normals are calculated)
			"0": "Ruled",
			"1": "Smooth",
			"2": "First Normal (normal to first section)",
			"3": "Last Normal (normal to last section)",
			"4": "Ends Normal (normal to start and end sections)",
			"5": "All Normal (normal to all sections)",
			"6": "Use Draft Angles" // (When LOFTANG1/2 are used)
		},
		REALWORLDSCALE: { // Real World Scale for Linetypes
			"0": "Legacy behavior (scaled by PSLTSCALE/LTSCALE combination)",
			"1": "Scaled to real-world units (annotation scale affects display)"
		},
		INTERFERECOLOR: { // Interference Object Color (ACI)
			"0": "BYBLOCK",
			"256": "BYLAYER"
			// Add other ACI values as needed, e.g., "1": "Red", your output was '1'
		},
		DIMATFIT: { // Dimension Text and Arrow Placement Rule (when not enough space)
			"0": "Place both text and arrows outside extension lines",
			"1": "Move arrows first, then text",
			"2": "Move text first, then arrows",
			"3": "Move either text or arrows, whichever fits best" // Your output was '3'
		},
		DIMTMOVE: { // Dimension Text Movement Rules
			"0": "Moves the dimension line with dimension text",
			"1": "Adds a leader when dimension text is moved",
			"2": "Allows text to be moved freely without a leader" // Your output was '0'
		}
	}
};