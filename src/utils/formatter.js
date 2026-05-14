/**
 * Markdownテキスト内の独自タグ（ICON）やAlert構文をHTMLに変換する共通ロジック
 * ※ IMAGE_KEYWORD タグは画像表示を無効化し、静かに除去します
 */

export const formatMarkdownToHtml = (markdown, parseFn) => {
  // 1. IMAGE_KEYWORD タグを完全に除去（画像表示なし）
  let step1 = markdown.replace(/\[IMAGE_KEYWORD:\s*([^\]]+)\]/gi, '');

  // 2. ICONタグをプレースホルダーに保護してからHTML変換する
  step1 = step1.replace(/\[ICON:\s*([a-z0-9-]+)\]/gi, (match, iconName) => {
    return `__ICON_REQ_START__${iconName.trim()}__ICON_REQ_END__`;
  });

  // 3. HTMLに変換
  let html = parseFn(step1);

  // 4. プレースホルダーをLucideアイコンに変換
  html = html.replace(/__ICON_REQ_START__(.*?)__ICON_REQ_END__/g, (match, iconName) => {
    return `<i data-lucide="${iconName}" class="manual-icon"></i>`;
  });

  // 5. GitHubスタイルのアラートを変換
  html = html.replace(/<blockquote>\s*<p>\[!IMPORTANT\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    '<div class="alert alert-important"><div class="alert-title">🔥 重要</div><div class="alert-content">$1</div></div>');
  html = html.replace(/<blockquote>\s*<p>\[!(?:TIP|NOTE)\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    '<div class="alert alert-tip"><div class="alert-title">💡 ヒント</div><div class="alert-content">$1</div></div>');
  html = html.replace(/<blockquote>\s*<p>\[!(?:WARNING|CAUTION)\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    '<div class="alert alert-warning"><div class="alert-title">⚠️ 注意</div><div class="alert-content">$1</div></div>');

  return html;
};
