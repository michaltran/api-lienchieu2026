/**
 * sanitize.js — Làm sạch HTML input để chống XSS
 * Dùng regex đơn giản (không cần cài thêm gói)
 * Cho phép các tag HTML chuẩn của rich text editor
 */

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'section', 'article',
  'figure', 'figcaption',
  'hr',
];

const ALLOWED_ATTRS = ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'width', 'height', 'style'];

/**
 * Xoá các script tag, event handlers (onXxx=), và javascript: links
 * Nhẹ và không cần dependency bên ngoài
 */
function sanitizeHtml(input) {
  if (!input || typeof input !== 'string') return input;

  return input
    // Xoá toàn bộ <script> block
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Xoá <iframe>, <object>, <embed>, <form>
    .replace(/<(iframe|object|embed|form|input|button)[^>]*>.*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|form|input|button)[^>]*\/?>/gi, '')
    // Xoá event handlers (onclick=, onload=, onerror=, ...)
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '')
    // Xoá javascript: trong href/src
    .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href="#"')
    .replace(/src\s*=\s*["']\s*javascript:[^"']*["']/gi, 'src=""')
    // Xoá data: URI trong src (có thể dùng để XSS)
    .replace(/src\s*=\s*["']\s*data:[^"']*["']/gi, 'src=""')
    // Xoá expression() trong style
    .replace(/style\s*=\s*["'][^"']*expression\s*\([^"']*["']/gi, '');
}

/**
 * Sanitize object — làm sạch tất cả trường string có thể chứa HTML
 */
function sanitizeBody(fields, req) {
  const result = {};
  for (const key of fields) {
    if (req.body[key] !== undefined) {
      result[key] = typeof req.body[key] === 'string'
        ? sanitizeHtml(req.body[key])
        : req.body[key];
    }
  }
  return result;
}

module.exports = { sanitizeHtml, sanitizeBody };
