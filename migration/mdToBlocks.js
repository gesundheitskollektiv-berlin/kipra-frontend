/**
 * Markdown → Strapi Blocks (subset aligned with kipra-frontend `richTextResolver`).
 * Supports: ###–###### headings, paragraphs, unordered lists (- / *), **bold**, [text](url).
 */

/** @param {string} segment */
export function inlineToChildren(segment) {
	if (!segment) return [{ type: 'text', text: '' }];
	const children = [];

	const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))|([^*\[]+)/g;
	let m;
	while ((m = regex.exec(segment))) {
		const boldish = m[1];
		const linkish = m[2];
		const plain = m[3];
		if (boldish) {
			const inner = boldish.slice(2, -2);
			children.push({ type: 'text', text: inner, bold: true });
		} else if (linkish) {
			const lm = linkish.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
			if (lm) {
				children.push({
					type: 'link',
					url: lm[2].trim(),
					children: [{ type: 'text', text: lm[1] }]
				});
			}
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
					children: [paragraphBlock(m[1])]
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
