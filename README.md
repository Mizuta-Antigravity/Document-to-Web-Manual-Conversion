# Web Manual Maker

WordやExcelのマニュアルファイルを、AI（Gemini）を活用してプロフェッショナルな3カラム形式のWebマニュアルに変換するツールです。

## 特徴

- **AIによる自動構成**: バラバラなドキュメントを、検索しやすく構造化されたマニュアルへAIが整理します。
- **高機能3カラムレイアウト**: 検索バー、サイドナビゲーション、ページ内目次を備えた本格的なHTMLを出力します。
- **デザイナーズアイコン**: Lucide Iconsを自動挿入し、視覚的に分かりやすいデザインを実現。
- **完全オフライン対応（出力後）**: 書き出されたHTMLは単一ファイルで動作し、社内ポータルやオフライン環境でも利用可能です。
- **プライバシー配慮**: APIキーは利用者のブラウザ（localStorage）にのみ保存され、サーバーには送信されません。

## 開発・実行方法

このプロジェクトは Vite + React で構築されています。

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

### ビルド（デプロイ用）

```bash
npm run build
```

## デプロイ方法

### Vercel / Netlify
GitHubリポジトリを連携するだけで、自動的にデプロイされます。特別な設定は不要です。

## 技術スタック

- React
- Tailwind CSS (v4)
- Gemini API (Google Generative AI)
- Marked (Markdown parsing)
- Lucide React / Lucide Icons
- Mammoth.js (Word extraction)
- SheetJS (Excel extraction)

## ライセンス

MIT License
