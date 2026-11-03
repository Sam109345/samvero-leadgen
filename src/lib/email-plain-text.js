/**
 * Converts rich HTML content (paragraphs, headings, lists, breaks) into clean,
 * formatted plain text for Gmail compose URLs (`mail.google.com`) and `mailto:` links,
 * which do not render HTML tags natively.
 */
function htmlToPlainText(html) {
  if (!html || typeof html !== 'string') return '';

  // If no HTML tags are present, return trimmed text
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html.trim();
  }

  let text = html;

  // Convert line breaks and paragraph ends to newlines
  text = text.replace(/<(?:br\s*\/?>)/gi, '\n');
  text = text.replace(/<\/(?:p|div|section|article|header|footer|h[1-6])>/gi, '\n\n');
  text = text.replace(/<(?:p|div|section|article|header|footer|h[1-6])(?:\s+[^>]*)?>/gi, '');

  // Convert list items to bullet points
  text = text.replace(/<li(?:\s+[^>]*)?>([\s\S]*?)<\/li>/gi, (_, content) => `• ${content.trim()}\n`);
  text = text.replace(/<\/?(?:ul|ol)(?:\s+[^>]*)?>/gi, '\n');

  // Preserve anchor link text + destination URL if informative
  text = text.replace(/<a(?:\s+[^>]*?)href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, anchor) => {
    const cleanAnchor = anchor.replace(/<[^>]+>/g, '').trim();
    if (!cleanAnchor || cleanAnchor === href) return href;
    return `${cleanAnchor} (${href})`;
  });

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode standard HTML entities
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&bull;/gi, '•')
    .replace(/&#10004;/gi, '✓')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–');

  // Normalize excessive blank lines (more than 2 consecutive newlines)
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n\s+\n/g, '\n\n');
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

module.exports = {
  htmlToPlainText,
};
