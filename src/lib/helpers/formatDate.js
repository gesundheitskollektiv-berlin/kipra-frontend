export function formatDate(dateString, locale = 'de', options = {}) {
	if (!dateString) return '';

	const date = new Date(dateString);

	const defaultOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	const formatOptions = { ...defaultOptions, ...options };

	return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

export function formatDateTime(dateString, locale = 'de') {
	if (!dateString) return '';

	const date = new Date(dateString);

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};

	return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDateShort(dateString, locale = 'de') {
	if (!dateString) return '';

	const date = new Date(dateString);

	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	};

	return new Intl.DateTimeFormat(locale, options).format(date);
}
