/**
 * Markdownテキスト内の独自タグ（ICON, IMAGE_KEYWORD）やAlert構文をHTMLに変換する共通ロジック
 */

export const formatMarkdownToHtml = (markdown, parseFn) => {
  // 1. Markdownの記号 [] が壊される前に、安全な一時的なプレースホルダーに変換する
  // 例: [IMAGE_KEYWORD: apple] -> __IMG_REQ_START__apple__IMG_REQ_END__
  let step1 = markdown.replace(/\[IMAGE_KEYWORD:\s*([^\]]+)\]/gi, (match, keyword) => {
    return `__IMG_REQ_START__${keyword.trim()}__IMG_REQ_END__`;
  });

  // ICONタグも同様に保護
  step1 = step1.replace(/\[ICON:\s*([a-z0-9-]+)\]/gi, (match, iconName) => {
    return `__ICON_REQ_START__${iconName.trim()}__ICON_REQ_END__`;
  });

  // 2. HTMLに変換（ここでは安全な文字列なので壊されない）
  let html = parseFn(step1);

  // 3. 最後にプレースホルダーを実際のHTML要素に戻す
  // ここで1枚ずつ違う画像（sig付き）を生成する
  html = html.replace(/__IMG_REQ_START__(.*?)__IMG_REQ_END__/g, (match, keyword) => {
    const randomId = Math.random().toString(36).substring(7);
    const imageUrl = `https://source.unsplash.com/featured/1200x600/?${encodeURIComponent(keyword)},business,office&sig=${randomId}`;
    return `\n<div class="manual-image-container"><img src="${imageUrl}" class="manual-image" alt="${keyword}"></div>\n`;
  });

  html = html.replace(/__ICON_REQ_START__(.*?)__ICON_REQ_END__/g, (match, iconName) => {
    return `<i data-lucide="${iconName}" class="manual-icon"></i>`;
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
