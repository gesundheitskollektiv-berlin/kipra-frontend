export function resolveRichText(nodes) {
	if (!nodes) return '';
	if (typeof nodes === 'string') return nodes;
	if (!Array.isArray(nodes)) return '';
	return nodes.map((c) => resolveRichTextNode(c)).join('');
}

function resolveRichTextNode(node) {
	if (typeof node === 'string') return node;
	let html = '';
	const children = node.children ? node.children.map((c) => resolveRichTextNode(c)).join('') : '';

	switch (node.type) {
		case 'heading':
			html = `<h${node.level}>${children}</h${node.level}>`;
			break;
		case 'text':
			if (node.text) {
				let tmp = node.text.replaceAll('\n', '<br />');

				if (node.bold) tmp = `<span class="fw-bold">${tmp}</span>`;
				if (node.code) tmp = `<code>${tmp}</code>`;
				if (node.italic) tmp = `<i>${tmp}</i>`;
				if (node.strikethrough) tmp = `<s>${tmp}</s>`;
				if (node.underline) tmp = `<u>${tmp}</u>`;

				html = tmp;
			}
			break;
		case 'paragraph':
			html = `<p>${children}</p>`;
			break;
		case 'link':
			html = `<a href="${node.url}">${children}</a>`;
			break;
		case 'list':
			switch (node.format) {
				case 'ordered':
					html = `<ol>${children}</ol>`;
					break;
				case 'unordered':
					html = `<ul>${children}</ul>`;
					break;
			}
			break;
		case 'list-item':
			html = `<li>${children}</li>`;
			break;
		case 'quote':
			html = `<blockquote>${children}</blockquote>`;
			break;
		case 'code':
			html = `<pre>${children}</pre>`;
			break;
		case 'image':
			if (node.image) {
				html = `<img src="${node.image.url}" height="${node.image.height}" width="${node.image.width}" alt="${node.image.alternativeText}" />`;
			}
			break;
	}

	return html;
}
