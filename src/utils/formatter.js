/**
 * Markdownテキスト内の独自タグ（ICON, IMAGE_KEYWORD）やAlert構文をHTMLに変換する共通ロジック
 */

export const formatMarkdownToHtml = (markdown, parseFn) => {
  let processed = markdown;

  // 画像キーワードタグをUnsplash画像に置換 (Markdownの状態で置換)
  processed = processed.replace(/\[IMAGE_KEYWORD:\s*([^\]]+)\]/g, (match, keyword) => {
    const k = keyword.trim();
    return `\n<img src="https://source.unsplash.com/featured/1200x600/?${encodeURIComponent(k)},business,manual" class="manual-image" alt="${k}">\n`;
  });

  // ICONタグをLucideアイコンに置換
  processed = processed.replace(/\[ICON:\s*([a-z0-9-]+)\]/g, (match, iconName) => {
    return `<i data-lucide="${iconName}" class="manual-icon"></i>`;
  });

  // markedでHTMLに変換
  let html = parseFn(processed);

  // GitHubスタイルのアラートを変換 (HTMLになった後に置換)
  html = html.replace(/<blockquote>\s*<p>\[!IMPORTANT\]([\s\S]*?)<\/p>\s*<\/blockquote>/g, 
    '<div class="alert alert-important"><div class="alert-title">🔥 重要</div><div class="alert-content">$1</div></div>');
  html = html.replace(/<blockquote>\s*<p>\[!(?:TIP|NOTE)\]([\s\S]*?)<\/p>\s*<\/blockquote>/g, 
    '<div class="alert alert-tip"><div class="alert-title">💡 ヒント</div><div class="alert-content">$1</div></div>');
  html = html.replace(/<blockquote>\s*<p>\[!(?:WARNING|CAUTION)\]([\s\S]*?)<\/p>\s*<\/blockquote>/g, 
    '<div class="alert alert-warning"><div class="alert-title">⚠️ 注意</div><div class="alert-content">$1</div></div>');

  return html;
};
