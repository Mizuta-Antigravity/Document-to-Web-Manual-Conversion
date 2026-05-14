/**
 * Markdownテキスト内の独自タグ（ICON, IMAGE_KEYWORD）やAlert構文をHTMLに変換する共通ロジック
 */

export const formatMarkdownToHtml = (markdown, parseFn) => {
  // 1. まずMarkdownの状態で置換を試みる
  let processed = markdown.replace(/\[IMAGE_KEYWORD:\s*([^\]]+)\]/gi, (match, keyword) => {
    const k = keyword.trim();
    // より安定した新しいUnsplashの検索URL形式
    return `\n\n<div class="manual-image-container"><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80&q=keywords=${encodeURIComponent(k)}" class="manual-image" alt="${k}"></div>\n\n`;
  });

  // ICONタグをLucideアイコンに置換
  processed = processed.replace(/\[ICON:\s*([a-z0-9-]+)\]/gi, (match, iconName) => {
    return `<i data-lucide="${iconName}" class="manual-icon"></i>`;
  });

  // markedでHTMLに変換
  let html = parseFn(processed);

  // 2. 万が一HTML化でエスケープされていた場合の念押し置換
  // [&amp;#91;IMAGE_KEYWORD: ...&amp;#93;] などのパターンをカバー
  const tagRegex = /(?:\[|&#91;|%5B)IMAGE_KEYWORD:\s*([^\]&%]+)(?:\]|&#93;|%5D)/gi;
  html = html.replace(tagRegex, (match, keyword) => {
    const k = keyword.trim();
    return `<div class="manual-image-container"><img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80&q=keywords=${encodeURIComponent(k)}" class="manual-image" alt="${k}"></div>`;
  });

  // GitHubスタイルのアラートを変換
  html = html.replace(/<blockquote>\s*<p>\[!IMPORTANT\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi, 
    '<div class="alert alert-important"><div class="alert-title">🔥 重要</div><div class="alert-content">$1</div></div>');
  html = html.replace(/<blockquote>\s*<p>\[!(?:TIP|NOTE)\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi, 
    '<div class="alert alert-tip"><div class="alert-title">💡 ヒント</div><div class="alert-content">$1</div></div>');
  html = html.replace(/<blockquote>\s*<p>\[!(?:WARNING|CAUTION)\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi, 
    '<div class="alert alert-warning"><div class="alert-title">⚠️ 注意</div><div class="alert-content">$1</div></div>');

  return html;
};
