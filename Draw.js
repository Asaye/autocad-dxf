//const Triangulate = require("./Triangulate");
//const BSpline = require("./BSpline");
const COLOR_CODES = require("./COLOR_CODES");
const ErrorMessages = require("./ErrorMessages.json");
const mappings = {
    '%%c': '⌀',   // Diameter
    '%%d': '°',   // Degree
    '%%p': '±',   // Plus-Minus

    // Common Unicode \U+ codes seen in AutoCAD MText
    '\\U+00B0': '°',    // Degree sign
    '\\U+00B1': '±',    // Plus-minus sign
    '\\U+2205': '∅',    // Diameter (alternative to phi)
    '\\U+03C6': 'φ',    // Greek small letter phi
    '\\U+03A6': 'Φ',    // Greek capital letter Phi
    '\\U+2220': '∠',    // Angle
    '\\U+2260': '≠',    // Not equal
    '\\U+2264': '≤',    // Less than or equal
    '\\U+2265': '≥',    // Greater than or equal
    '\\U+00D8': 'Ø',    // Uppercase O with stroke (alternative diameter)
    '\\U+00F8': 'ø',    // Lowercase o with stroke
    '\\U+03B1': 'α',    // Greek small letter alpha
    '\\U+03B2': 'β',    // Greek small letter beta
    '\\U+03B3': 'γ',    // Greek small letter gamma
    '\\U+03C0': 'π',    // Greek small letter pi
    '\\U+03C9': 'ω',    // Greek small letter omega
    '\\U+222B': '∫',    // Integral
    '\\U+2211': '∑',    // Summation
    '\\U+221A': '√',    // Square root
    '\\U+00A9': '©',    // Copyright
    '\\U+2122': '™',    // Trademark
    '\\U+00AE': '®',    // Registered trademark
    '\\U+03A9': 'Ω',    // Greek capital omega
    '\\U+03BC': 'μ',    // Greek small mu (used for micro)
};

const textFormatter = (text) => {
	for (const [key, value] of Object.entries(mappings)) {				
		const regex = new RegExp(key, 'gi'); // case-insensitive
		text = text.replace(regex, value);
	}
	return text.replace(/[&<>"']/g, (match) => {
        switch (match) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&apos;';
            default:
                return match;
        }
    })
};

function parseAutoCADText(mtext) {
    // Main regex that works with or without font specification
    const mainRegex = /^{(?:\\f([^|;]+)(?:\|b(\d))?(?:\|i(\d))?(?:\|c(\d+))?(?:\|p(\d+))?;?)?(.*?)}/;
    
    const match = mtext.match(mainRegex);
    
    if (!match) {
        return { error: "No valid AutoCAD text found" };
    }

    const formatText = match[6] || '';
    let visibleText = '';
    let textHeight = null;
    let underline = false;
    let autocadColor = match[4] ? parseInt(match[4], 10) : null;
    let hasLineBreak = false;

    // Format codes regex
    const formatRegex = /(\\H([\d.]+)x;)|(\\L;)|(\\L)|(\\l)|(\\C(\d+);)|(\\P)/g;
    
    let lastIndex = 0;
    let formatMatch;
    while ((formatMatch = formatRegex.exec(formatText)) !== null) {
        // Add text before this format code
        visibleText += formatText.substring(lastIndex, formatMatch.index);
		lastIndex = formatRegex.lastIndex;

        // Handle each format code
        if (formatMatch[1]) { // \Hx.xx;
            textHeight = parseFloat(formatMatch[2]);
        } else if (formatMatch[3]) { // \L
            underline = true;
        } else if (formatMatch[4]) { // \l
            underline = false;
        } else if (formatMatch[6]) { // \Cx;
            autocadColor = parseInt(formatMatch[6].replace(/\D/g, ''), 10);
        } else if (formatMatch[7]) { // \P
            hasLineBreak = true;
            visibleText += '\n';
        }
    }
    // Add remaining text after last format code
    visibleText += formatText.substring(lastIndex);

    return {
        font: match[1] || null,
        bold: match[2] === "1" || false,
        italic: match[3] === "1" || false,
        charset: match[4] ? parseInt(match[4], 10) : null,
        pitch: match[5] ? parseInt(match[5], 10) : null,
        textHeight,
        underline,
        autocadColor,
        hasLineBreak,
        visibleText: visibleText.trim()
    };
}

const dimensionDetails = (id, dimstyle, blocks, styles) => {
	//console.log(id, blocks.filter((b) => b.block_refs && b.block_refs.indexOf(id) != -1));
	
	if (dimstyle.arrow1) console.log(id, blocks.filter((b) => b.id == "418C1E")[0]);
	if (dimstyle.arrow1) console.log(id, blocks.filter((b) => b.id == "418C1E")[0].entities);
	//if (dimstyle.arrow1 && dimstyle.arrow1 != 31) console.log(id, dimstyle);
	// dimension line
	    // arrow
		// extension
		// color
		// suppressed
	// extension line
		// offset
		// extension
		// color
		// suppressed
	// text
		// inside align
		// outside align
		// position vertical
		// height
		// offset
		// color
};

module.exports = (entities, options, getAxes) => {
	let viewBox, viewport, folderLocation, plane, styles, dimstyles, width, height;
	if (options) {
		viewBox = options.viewBox;
		viewport = options.viewport;
		folderLocation = options.folderLocation;
		plane = options.plane;
		blocks = options.blocks;
		styles = options.styles;
		dimstyles = options.dimstyles;
		width = options.width;
		height = options.height;
	}
	if (!Array.isArray(entities)) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let [ax1, ax2] = getAxes(plane);
	if (plane && ax1 === undefined && ax2 === undefined) {
		throw new Error(ErrorMessages.INCORRECT_PARAMS);
		return;
	}
	let svg = '<svg xmlns="http://www.w3.org/2000/svg"';
	if (width) {
		svg = svg + ` width="${width}"`;
	} 
	if (height) {
		svg = svg + ` height="${height}"`;
	} 
	if (viewBox) {
		svg = svg + ` viewBox="${viewBox}"`;
	} else if (viewport) {
		svg = svg + ` viewport="${viewport}"`;
	}
	svg = svg + ">";
	
	const delta_y = 35000 + 2*428988;
	
	entities.forEach((entity) => {
		if (entity.subclass == "AcDbDimension") {
			//console.log(entity);
		}
		let color = COLOR_CODES[entity.color];
		if (!color) color = "#000000";
		if (entity.subclass == "AcDbLine") {
			const start_x = entity['start_' + ax1];
			const start_y = delta_y - entity['start_' + ax2];
			const end_x = entity['end_' + ax1];
			const end_y = delta_y - entity['end_' + ax2];
			svg = svg + `<line x1="${start_x}" y1="${start_y}" x2="${end_x}" y2="${end_y}" stroke="${color}" stroke-width="2"/>`;
		} else if (entity.subclass == "AcDbCircle" && entity.etype == "CIRCLE") {
			const x = entity[ax1];
			const y = delta_y - entity[ax2];
			const r = entity.radius;
			svg = svg + `<circle cx="${x}" cy="${y}" r="${r}" stroke="${color}" fill="transparent"/>`;
		} else if (entity.subclass == "AcDbCircle") {
			const r = entity.radius;
			const start_x = entity[ax1] + r*Math.cos(entity.start_angle*Math.PI/180);
			const start_y = delta_y - (entity[ax2] + r*Math.sin(entity.start_angle*Math.PI/180));
			const end_x = entity[ax1] + r*Math.cos(entity.end_angle*Math.PI/180);
			const end_y = delta_y - (entity[ax2] + r*Math.sin(entity.end_angle*Math.PI/180));
			const large_arc_flag = Math.abs(entity.start_angle - entity.end_angle) > 180 ? 1 : 0;
			const sweep_flag = entity.start_angle < entity.end_angle ? 0 : 1;
			
			svg = svg + `<path d="M ${start_x} ${start_y} A ${r} ${r} 0 ${large_arc_flag} ${sweep_flag} ${end_x} ${end_y}" stroke="${color}" fill="transparent"/>`;
		} else if (entity.subclass == "AcDbEllipse") {
			const dx = entity[`major_end_d${ax1}`];
			const dy = entity[`major_end_d${ax2}`];
			const theta = Math.atan2(dy, dx);	
			const ratio = entity.minorToMajor;
			const a = Math.sqrt(dx*dx + dy*dy);
			const b = ratio*a;	
			const xc = entity[ax1];
			const yc = delta_y - entity[ax2];
			if (entity[`start_${ax1}`] === undefined && entity[`start_${ax2}`] === undefined) {
				svg = svg + `<ellipse cx="${xc}" cy="${yc}" rx="${a}" ry="${b}" stroke="${color}" fill="transparent" transform="rotate(${theta} ${xc} ${yc})"/>`;
			} else {
				const start_x = entity[`start_${ax1}`];
				const start_y = delta_y - entity[`start_${ax2}`];
				const end_x = entity[`end_${ax1}`];
				const end_y = delta_y - entity[`end_${ax2}`];
				const large_arc_flag = Math.abs(entity.start_angle2 - entity.end_angle2) > 180 ? 1 : 0;
				const sweep_flag = entity.start_angle2 < entity.end_angle2 ? 0 : 1;
				svg = svg + `<path d="M ${start_x} ${start_y} A ${a} ${b} ${theta} ${large_arc_flag} ${sweep_flag} ${end_x} ${end_y}" stroke="${color}" fill="transparent"/>`;
			}
		} else if (entity.subclass == "AcDbPolyline") {
			const vertices = entity.vertices;
			let coordinates = "";
			vertices.forEach((v) => {
				coordinates = coordinates + `${v[ax1]},${delta_y - v[ax2]} `;
			});
			if (entity.type == "Closed") {
				coordinates = coordinates + `${vertices[0][ax1]},${delta_y - vertices[0][ax2]}`;
			}
			svg = svg + `<polyline points="${coordinates}" stroke="${color}" fill="none" stroke-width="1" />`;
		} else if (entity.subclass == "AcDbText" || entity.subclass == "AcDbMText") {
			const x = entity[ax1] - entity.height/4;
			const y = delta_y - entity[ax2] + entity.height/4;
			const stylename = entity.style;
			const style = styles ? styles.filter((s) => stylename && s.name == stylename)[0] : {};
			const fontstyle = style ? style.font_name : "Arial";
			let textContent = entity.raw_text;
			textContent = textContent.replace(/%%u/gi, '');

			
			let fontname = fontstyle, fontWeight = "normal", fontStyle = "normal", fontcolor = color, height = entity.height, textColor;
			const textData = parseAutoCADText(textContent);
			if (textData) {				
				if (textData.font) fontname = textData.font;   // Font name (e.g., "Times New Roman")
				if (textData.bold) fontWeight = "bold";   // Bold: true if b1, false if b0
				if (textData.italic) fontStyle = "italic";   // Italic: true if i1, false if i0
				if (textData.textHeight) height = textData.textHeight;   // Text height				
				if (textData.autocadColor) fontcolor = COLOR_CODES[textData.autocadColor];  // Color index for the second part of the text
				if (textData.visibleText) textContent = textData.visibleText;   // Actual text (e.g., "First-Third Floor Slab Reinforcement, Sc. 1:50")
			}
			
			svg = svg + `<text x="${x}" y="${y}" font-family="${fontname}" font-size="${height}" font-weight="${fontWeight}" font-style="${fontStyle}" fill="${fontcolor}">${textFormatter(textContent)}</text>`;
		} else if (entity.subclass == "AcDbDimension" && (entity.specific_type == 'AcDbRotatedDimension' || entity.specific_type == 'AcDbAlignedDimension')) {
			// get dimension properties and text height from the dimstyle
			const x = entity[ax1];
			const y = delta_y - entity[ax2];
			const x_end = entity[ax1 + '_end'];
			const y_end = delta_y - entity[ax2 + '_end'];
			const x_text = entity[ax1 + "_text"];
			const y_text = delta_y - entity[ax2 + "_text"];
			const rot = entity.rotation ? entity.rotation : 0;
			const text = entity.text_override ? textFormatter(entity.text_override) : Math.round(entity.actual_measurement);
			
			const stylename = entity.dimension_style;
			
			const dimstyle = dimstyles ? dimstyles.filter((s) => s.name == stylename)[0] : {};
			const textstylename = dimstyle.text_style;
			const textstyle = styles ? styles.filter((s) => s.font_style_handle == textstylename)[0] : {};
			const dim1 = (dimstyle.dim_line1 || entity.dim_line1);
			const dim2 = (dimstyle.dim_line2 || entity.dim_line2);
			const ext1 = (dimstyle.ext_line1 || entity.ext_line1);
			const ext2 = (dimstyle.ext_line2 || entity.ext_line2);
			const text_color = COLOR_CODES[(dimstyle.text_color || entity.text_color)] || color;
			const dim_color = COLOR_CODES[(dimstyle.dim_line_color || entity.dim_line_color)] || color;
			const ext_color = COLOR_CODES[(dimstyle.ext_line_color || entity.ext_line_color)] || color;
			const font = textstyle ? textstyle.font_name : "Arial";
			dimensionDetails(entity.id, dimstyle, blocks, styles);
			if (dim1 != "Suppressed" || dim2 != "Suppressed") {
				svg = svg + `<line x1="${x}" y1="${y}" x2="${x_end}" y2="${y_end}" stroke="${color}" stroke-width="2"/>`;
			}
			if (ext1 != "Suppressed") {
				svg = svg + `<line x1="${x_end}" y1="${y_end}" x2="${entity["ext_line1_" + ax1]}" y2="${delta_y - entity["ext_line1_" + ax2]}" stroke="${dim_color}" stroke-width="2"/>`;
			}
			if (ext2!= "Suppressed") {
				svg = svg + `<line x1="${x}" y1="${y}" x2="${entity["ext_line2_" + ax1]}" y2="${delta_y - entity["ext_line2_" + ax2]}" stroke="${ext_color}" stroke-width="2"/>`;
			}
			svg = svg + `<text x="${x_text}" y="${y_text}" font-family="Arial" font-size="${50}" fill="${text_color}" transform="rotate(${rot},${x_text},${y_text})" style="font-family: ${font}">${text}</text>`;
		}
	});
	svg = svg + '</svg>';
	//console.log(svg);
	if (folderLocation) {
		// save svg in folderLocation
		return "";
	} else {
		return svg;
	}
};
	
/*
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <!-- Background -->
  <rect width="500" height="500" fill="#f0f0f0"/>

  <!-- Circle -->
  <circle cx="250" cy="250" r="100" fill="blue"/>

  <!-- Rectangle -->
  <rect x="100" y="100" width="300" height="200" fill="green"/>

  <!-- Line -->
  <line x1="50" y1="50" x2="450" y2="450" stroke="red" stroke-width="2"/>

  <!-- Text -->
  <text x="50%" y="50%" font-family="Arial" font-size="20" fill="black" text-anchor="middle" alignment-baseline="middle">
    Hello, SVG!
  </text>
</svg>
SVG (Scalable Vector Graphics) offers a variety of elements that can be used to create vector-based graphics. Here's a list of the most commonly used SVG elements:

1. Basic Shape Elements:
<rect>: Defines a rectangle.
<circle>: Defines a circle.
<ellipse>: Defines an ellipse.
<line>: Defines a straight line between two points.
<polygon>: Defines a closed shape with any number of sides.
<polyline>: Defines a shape consisting of a series of connected lines (but not a closed shape).
<path>: Defines a complex shape using a series of commands to create curves, lines, and arcs.
2. Text Elements:
<text>: Displays text at a specified position.
<tspan>: Allows text within a <text> element to be styled or positioned independently.
3. Grouping Elements:
<g>: Groups multiple elements together, which can then be manipulated as a single unit.
<defs>: Used to define reusable elements (like gradients, patterns, or symbols).
<use>: References and reuses defined elements from <defs>.
4. Container Elements:
<svg>: Defines the container for the SVG graphic itself. It includes attributes like width, height, viewBox, etc.
<symbol>: Defines reusable graphic objects, similar to <defs>, but it doesn't render until it is used.
<mask>: Used for masking parts of the graphic (creates transparency effects).
<clipPath>: Used for clipping regions of the graphic to create transparent areas.
5. Gradient and Pattern Elements:
<linearGradient>: Defines a linear gradient for filling or stroke.
<radialGradient>: Defines a radial gradient for filling or stroke.
<stop>: Defines a stop within a gradient.
<pattern>: Defines a pattern for filling an area with a repetitive image or shape.
6. Style Elements:
<style>: Defines internal CSS to style the SVG elements.
7. Filter Elements:
<filter>: Defines a filter that can be applied to an element to create effects like blur, brightness, contrast, etc.
<feGaussianBlur>, <feColorMatrix>, <feOffset>, etc.: Different filter primitives used within a <filter>.
8. Animation Elements:
<animate>: Defines simple animations for attributes.
<animateTransform>: Defines animations for transforming attributes (like rotate, scale, etc.).
<set>: Sets the value of an attribute for a certain duration.
<animateMotion>: Animates an object along a motion path.
9. Event Handling Elements:
<a>: Links the SVG content to external resources (like a webpage).
<foreignObject>: Embeds non-SVG content like HTML or images.
10. Graphics Elements:
<image>: Embeds raster images (like PNG, JPEG) into the SVG.
<view>: Defines different views of the same SVG content for responsive design.
<switch>: Groups SVG content and displays one of the elements based on conditional logic (like media queries).
11. Gradient and Pattern Elements:
<linearGradient>: Creates a linear gradient.
<radialGradient>: Creates a radial gradient.
<stop>: Defines a stop for a gradient or pattern.
12. Marker Elements:
<marker>: Defines a marker that can be applied to paths, lines, or shapes, often used for arrows or other symbols at the start or end of a line.
13. Filter Primitives (used within <filter>):
<feGaussianBlur>
<feOffset>
<feComponentTransfer>
<feComposite>
<feColorMatrix>
<feBlend>
<feFlood>
<feMerge>
<feTile>
<feConvolveMatrix>
<feTurbulence>
*/