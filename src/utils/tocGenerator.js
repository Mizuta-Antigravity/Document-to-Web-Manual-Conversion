import { gfmHeadingId } from 'marked-gfm-heading-id';

/**
 * marked 用のプラグイン設定をエクスポート
 */
export const headingIdPlugin = gfmHeadingId();

/**
 * Markdownから見出しを抽出して目次（TOC）を生成し、Markdownの先頭（または最初のh1の直後）に挿入する
 * @param {string} markdown 
 * @returns {string} 目次が挿入されたMarkdown
 */
export const insertTableOfContents = (markdown) => {
  // marked-gfm-heading-id と同じロジックでIDを生成する簡易関数
  const generateId = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/<[!\/a-z].*?>/ig, '') // HTMLタグを除去
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '') // 記号を除去
      .replace(/\s/g, '-');
  };

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  const tocLinks = [];
  
  // 見出しをすべて抽出
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const titleText = match[2].trim();
    // "# 目次" 自身は見出しに含めない
    if (titleText === '目次') continue;

    const id = generateId(titleText);
    const indent = level === 3 ? '  - ' : '- ';
    tocLinks.push(`${indent}[${titleText}](#${id})`);
  }
  
  if (tocLinks.length === 0) return markdown;
  
  const tocMarkdown = `## 目次\n${tocLinks.join('\n')}\n\n---\n\n`;
  
  // 最初のh1があればその後ろに、なければ先頭に挿入
  const h1Regex = /^#\s+(.+)$/m;
  const h1Match = markdown.match(h1Regex);
  
  if (h1Match) {
    const insertIndex = h1Match.index + h1Match[0].length;
    return markdown.slice(0, insertIndex) + '\n\n' + tocMarkdown + markdown.slice(insertIndex);
  }
  
  return tocMarkdown + markdown;
};
