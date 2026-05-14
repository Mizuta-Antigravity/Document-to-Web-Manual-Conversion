/**
 * AIを使わずに、単純なルールベースでテキストをMarkdown風にフォーマットする
 * @param {string} text 抽出された生テキスト
 * @returns {string} フォーマットされたMarkdownテキスト
 */
export const restructureTextLocally = (text) => {
  const lines = text.split('\n');
  let markdown = '# マニュアル (自動整形)\n\n';
  
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // "--- ファイル: xxx ---" のような区切り線
    if (trimmed.startsWith('---') && trimmed.endsWith('---')) {
      markdown += `\n## ${trimmed.replace(/---/g, '').trim()}\n\n`;
      return;
    }

    // 見出しっぽい短いテキスト (20文字未満で文末記号で終わっていない)
    if (trimmed.length > 0 && trimmed.length < 20 && !/[。、！？.!?]$/.test(trimmed)) {
      if (inList) {
        markdown += '\n';
        inList = false;
      }
      markdown += `\n### ${trimmed}\n\n`;
    } 
    // Q&AのQ
    else if (trimmed.match(/^[QＱ][.．:]\s*/i) || trimmed.includes('質問:')) {
      if (inList) { markdown += '\n'; inList = false; }
      markdown += `\n#### 💡 ${trimmed}\n`;
    } 
    // Q&AのA
    else if (trimmed.match(/^[AＡ][.．:]\s*/i) || trimmed.includes('回答:')) {
      markdown += `> ${trimmed}\n\n`;
    } 
    // 箇条書き
    else if (trimmed.match(/^[・\-*※]/) || trimmed.match(/^[0-9]+[.)]/)) {
      markdown += `${trimmed}\n`;
      inList = true;
    } 
    // 通常の段落
    else {
      if (inList) {
        markdown += '\n';
        inList = false;
      }
      markdown += `${trimmed}\n\n`;
    }
  });
  
  return markdown;
};
