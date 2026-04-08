// Generic runner: takes a target HTML file and a stories map, replaces story content
const fs = require('fs');
const path = require('path');

function rewriteStories(targetFilename, stories, slug) {
	const f = path.join(__dirname, '..', targetFilename);
	let s = fs.readFileSync(f, 'utf8');
	let updated = 0;
	const errors = [];

	for (const [id, newParas] of Object.entries(stories)) {
		const year = id.split('-')[0];
		const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		// Try img-anchored pattern first (most events have an img)
		const imgPattern = new RegExp(
			`(<img src="assets/images/story_${slug}_${year}\\.svg"[^>]*>\\r?\\n)([\\s\\S]*?)(\\r?\\n[ \\t]*</div>\\s*\\r?\\n[ \\t]*<div class="event-detail__notes">)`
		);
		// Fallback: scope to template id (for events with no svg)
		const templatePattern = new RegExp(
			`(<template id="event-${escaped}">[\\s\\S]*?<div class="event-detail__story">\\r?\\n)([\\s\\S]*?)(\\r?\\n[ \\t]*</div>\\s*\\r?\\n[ \\t]*<div class="event-detail__notes">)`
		);

		// Verify the img pattern is actually inside this template (uniqueness)
		const tplMatch = s.match(templatePattern);
		if (!tplMatch) {
			errors.push(`${id} (template not found)`);
			continue;
		}

		// Use img pattern only if the matched img is inside this specific template
		let pattern = templatePattern;
		const imgInTpl = tplMatch[0].match(
			new RegExp(`<img src="assets/images/story_${slug}_${year}\\.svg"[^>]*>`)
		);
		if (imgInTpl) {
			// Build a pattern that anchors to the template id + img
			pattern = new RegExp(
				`(<template id="event-${escaped}">[\\s\\S]*?<img src="assets/images/story_${slug}_${year}\\.svg"[^>]*>\\r?\\n)([\\s\\S]*?)(\\r?\\n[ \\t]*</div>\\s*\\r?\\n[ \\t]*<div class="event-detail__notes">)`
			);
		}

		const match = s.match(pattern);
		if (!match) {
			errors.push(id);
			continue;
		}

		const closingIndent = match[3].match(/\n([ \t]*)<\/div>/)[1];
		const contentIndent = closingIndent + '\t';

		const lines = newParas.trim().split('\n').map(l => contentIndent + l.trim()).join('\n');
		const replacement = match[1] + lines + match[3];

		const idx = s.indexOf(match[0]);
		s = s.substring(0, idx) + replacement + s.substring(idx + match[0].length);

		updated++;
	}

	if (errors.length) console.error(`MISSED: ${errors.join(', ')}`);
	fs.writeFileSync(f, s);
	console.log(`${targetFilename}: ${updated}/${Object.keys(stories).length} updated`);
	return { updated, total: Object.keys(stories).length, errors };
}

module.exports = { rewriteStories };
