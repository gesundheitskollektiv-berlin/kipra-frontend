/**
 * Markdown → Strapi Blocks (subset aligned with kipra-frontend `richTextResolver`).
 * Supports: ###–###### headings, paragraphs, unordered lists (- / *), **bold**, [text](url).
 *
 * Strapi list-item `children` must be inline nodes only (text / link), not nested paragraphs.
 */

/** @param {string} segment */
export function inlineToChildren(segment) {
	if (!segment) return [{ type: 'text', text: '' }];
	const children = [];

	// Order: bold-wrapped link, plain link, bold, then remainder (avoids ** swallowing [ … ]( … ) **).
	const regex =
		/(\*\*\[[^\]]+\]\([^)]+\)\*\*)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|([^[*]+)/g;
	let m;
	while ((m = regex.exec(segment))) {
		const boldLink = m[1];
		const linkish = m[2];
		const boldish = m[3];
		const plain = m[4];
		if (boldLink) {
			const inner = boldLink.slice(2, -2);
			const lm = inner.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
			if (lm) {
				children.push({
					type: 'link',
					url: lm[2].trim(),
					children: [{ type: 'text', text: lm[1], bold: true }]
				});
			} else {
				children.push({ type: 'text', text: boldLink });
			}
		} else if (linkish) {
			const lm = linkish.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
			if (lm) {
				children.push({
					type: 'link',
					url: lm[2].trim(),
					children: [{ type: 'text', text: lm[1] }]
				});
			}
		} else if (boldish) {
			const inner = boldish.slice(2, -2);
			children.push({ type: 'text', text: inner, bold: true });
		} else if (plain) {
			children.push({ type: 'text', text: plain });
		}
	}

	return children.length ? children : [{ type: 'text', text: segment }];
}

/** @param {string} line */
function paragraphBlock(line) {
	return { type: 'paragraph', children: inlineToChildren(line.trim()) };
}

/** @param {string} line */
function listItemChildren(line) {
	return inlineToChildren(line.trim());
}

/** @param {string} md */
export function simpleMarkdownToBlocks(md) {
	const text = md.replace(/\r\n/g, '\n').trim();
	if (!text) return [];

	const blocks = [];
	const lines = text.split('\n');
	let i = 0;
	while (i < lines.length) {
		const raw = lines[i];
		const trimmed = raw.trim();

		if (!trimmed) {
			i += 1;
			continue;
		}

		const hm = trimmed.match(/^(#{2,6})\s+(.+)$/);
		if (hm) {
			blocks.push({
				type: 'heading',
				level: hm[1].length,
				children: inlineToChildren(hm[2].trim())
			});
			i += 1;
			continue;
		}

		if (/^[-*]\s/.test(trimmed)) {
			const items = [];
			while (i < lines.length) {
				const m = lines[i].trim().match(/^[-*]\s+(.+)$/);
				if (!m) break;
				items.push({
					type: 'list-item',
					children: listItemChildren(m[1])
				});
				i += 1;
			}
			blocks.push({
				type: 'list',
				format: 'unordered',
				children: items
			});
			continue;
		}

		const buf = [];
		while (i < lines.length) {
			const t = lines[i].trim();
			if (!t) break;
			if (/^#{2,6}\s/.test(t) || /^[-*]\s/.test(t)) break;
			buf.push(lines[i]);
			i += 1;
		}
		const para = buf.join('\n').trim();
		if (para) blocks.push(paragraphBlock(para));
	}

	return blocks;
}
