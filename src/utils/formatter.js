/**
 * Markdownテキスト内の独自タグ（ICON, IMAGE_KEYWORD）やAlert構文をHTMLに変換する共通ロジック
 * 画像はLorem Picsum (picsum.photos) を使用。seedにキーワードを使うことでキーワードごとに異なる画像を安定表示。
 */

// キーワード文字列を数値のseedに変換するヘルパー関数
const keywordToSeed = (keyword) => {
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = keyword.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash) % 1000;
};

export const formatMarkdownToHtml = (markdown, parseFn) => {
  // 1. Markdownの記号 [] が壊される前に、安全なプレースホルダーに変換する
  let step1 = markdown.replace(/\[IMAGE_KEYWORD:\s*([^\]]+)\]/gi, (match, keyword) => {
    return `__IMG_REQ_START__${keyword.trim()}__IMG_REQ_END__`;
  });

  // ICONタグも同様に保護
  step1 = step1.replace(/\[ICON:\s*([a-z0-9-]+)\]/gi, (match, iconName) => {
    return `__ICON_REQ_START__${iconName.trim()}__ICON_REQ_END__`;
  });

  // 2. HTMLに変換（安全な文字列なのでパーサーに壊されない）
  let html = parseFn(step1);

  // 3. プレースホルダーを実際のHTML要素に置き換える
  // Lorem Picsumのseed方式: 同じキーワード→同じ画像、違うキーワード→違う画像
  html = html.replace(/__IMG_REQ_START__(.*?)__IMG_REQ_END__/g, (match, keyword) => {
    const seed = keywordToSeed(keyword);
    const imageUrl = `https://picsum.photos/seed/${seed}/1200/600`;
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
