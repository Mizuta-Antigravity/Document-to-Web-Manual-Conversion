import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * 抽出したテキストをGemini APIを用いてマニュアル構造（Markdown）に再構成する
 * @param {string} text 抽出された生テキスト
 * @param {string} apiKey ユーザーが入力したGemini APIキー
 * @returns {Promise<string>} 再構成されたMarkdownテキスト
 */
export const restructureTextToManual = async (text, apiKey) => {
  if (!apiKey) {
    throw new Error('APIキーが設定されていません。');
  }

  // 動的に利用可能なモデルを取得する
  let targetModelName = 'gemini-1.5-flash';
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    if (data && data.models) {
      // generateContentをサポートしている最新のモデルを探す
      const validModels = data.models.filter(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent') &&
        (m.name.includes('flash') || m.name.includes('pro'))
      );
      if (validModels.length > 0) {
        // 'models/' プレフィックスを削除
        targetModelName = validModels[0].name.replace('models/', '');
      }
    }
  } catch (err) {
    console.warn('モデル一覧の取得に失敗しましたが、デフォルトモデルで続行します', err);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: targetModelName });

  const prompt = `
以下のテキストは、WordまたはExcelから抽出されたマニュアル（手順書）の生データです。
これを元に、システムとして使いやすい「理想的なWebマニュアル」のコンテンツとしてMarkdown形式で再構成してください。

【厳守するルール】
1. **元の内容の保持**: 元の文章や情報は勝手に省略せず、可能な限りすべて利用してください。ただし、表現をわかりやすく整えたり、長すぎる文章を要約・箇条書きにすることは推奨します。
2. **階層構造とアイコンの明確化**: 
   - H1 (\`#\`), H2 (\`##\`), H3 (\`###\`) のすべての見出しの冒頭には、その内容に最も適した**デザイナーズアイコン名**を必ず1つ含めてください。形式は \`[ICON: icon-name]\` としてください。(例: ## [ICON: settings] 初期設定)
   - アイコン名は Lucide Icons (https://lucide.dev/icons) に準拠したもの（例: user, file-text, shield, check-circle, activity 等）を選んでください。
   - H2見出しの直後に、画像生成用のキーワード \`[IMAGE_KEYWORD: keyword]\` を含めるルールは継続してください。
3. **視覚的なアラートの使用**: 以下の意味に合わせてGitHub風のブロッククォートを使用してください。
   - 重要な内容・必須事項: \`> [!IMPORTANT]\` (文中に [ICON: alert-circle] などのタグを適宜使用)
   - ヒント・推奨事項: \`> [!TIP]\` または \`> [!NOTE]\` (文中に [ICON: lightbulb] などのタグを適宜使用)
   - 禁止事項・注意・警告: \`> [!WARNING]\` (文中に [ICON: alert-triangle] などのタグを適宜使用)
4. **補足説明のアコーディオン化**:
   - 任意で読むべき補足情報や、長すぎる背景説明などは、HTMLの \`<details><summary>[ICON: book-open] 補足説明（クリックで展開）</summary>内容</details>\` を使って折りたたみ式にしてください。
5. **手順とリストの装飾**:
   - 操作の手順やプロセスは必ず「番号付きリスト (1. 2. 3.)」を使用してください。
   - 通常の箇条書き (\`- \`) を使用する場合、各項目の冒頭には内容に合わせたアイコンタグ \`[ICON: icon-name]\` を添えてください。 (例: - [ICON: mail] メールで送信する)
6. **純粋なMarkdown出力**: \`\`\`markdown のようなコードブロックのバッククォートは絶対に出力に含めず、純粋なMarkdownテキストのみを出力してください。

【抽出されたテキスト】
${text.substring(0, 80000)}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let markdownText = response.text();
    
    // もし ```markdown ... ``` で囲まれていたら取り除く
    markdownText = markdownText.replace(/^```markdown\s*/i, '').replace(/```\s*$/i, '');
    
    return markdownText;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`AI処理中にエラーが発生しました: ${error.message}`);
  }
};
