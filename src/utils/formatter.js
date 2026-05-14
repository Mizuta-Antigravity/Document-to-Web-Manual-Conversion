/**
 * Markdownテキスト内の独自タグ（ICON, IMAGE_KEYWORD）やAlert構文をHTMLに変換する共通ロジック
 */

export const formatMarkdownToHtml = (html) => {
  let formatted = html;

  // GitHubスタイルのアラートを変換
  formatted = formatted.replace(/<blockquote>\s*<p>\[!IMPORTANT\]([\s\S]*?)<\/p>\s*<\/blockquote>/g, 
    '<div class="alert alert-important"><div class="alert-title">🔥 重要</div><div class="alert-content">$1</div></div>');
  formatted = formatted.replace(/<blockquote>\s*<p>\[!(?:TIP|NOTE)\]([\s\S]*?)<\/p>\s*<\/blockquote>/g, 
    '<div class="alert alert-tip"><div class="alert-title">💡 ヒント</div><div class="alert-content">$1</div></div>');
  formatted = formatted.replace(/<blockquote>\s*<p>\[!(?:WARNING|CAUTION)\]([\s\S]*?)<\/p>\s*<\/blockquote>/g, 
    '<div class="alert alert-warning"><div class="alert-title">⚠️ 注意</div><div class="alert-content">$1</div></div>');

  // 画像キーワードタグをUnsplash画像に置換
  formatted = formatted.replace(/\[IMAGE_KEYWORD:\s*([a-zA-Z0-9,\s]+)\]/g, (match, keyword) => {
    return `<img src="https://source.unsplash.com/featured/1200x600/?${encodeURIComponent(keyword.trim())},business,manual" class="manual-image" alt="${keyword.trim()}">`;
  });

  // ICONタグをLucideアイコンに置換
  formatted = formatted.replace(/\[ICON:\s*([a-z0-9-]+)\]/g, (match, iconName) => {
    return `<i data-lucide="${iconName}" class="manual-icon"></i>`;
  });

  return formatted;
};
