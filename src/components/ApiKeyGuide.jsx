import React from 'react';
import { ExternalLink, Key, HelpCircle } from 'lucide-react';

const ApiKeyGuide = () => {
  return (
    <div className="mt-4 bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center text-blue-700 font-bold mb-3">
        <HelpCircle className="w-5 h-5 mr-2" />
        APIキーの取得方法（無料）
      </div>
      
      <ol className="space-y-3 text-sm text-slate-600 mb-5">
        <li className="flex items-start">
          <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 font-bold">1</span>
          <span><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center">Google AI Studio <ExternalLink className="w-3 h-3 ml-1" /></a> にログインします。</span>
        </li>
        <li className="flex items-start">
          <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 font-bold">2</span>
          <span><strong>「Create API key」</strong> ボタンをクリックして、新しいキーを作成します。</span>
        </li>
        <li className="flex items-start">
          <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 font-bold">3</span>
          <span>生成された文字列をコピーして、上の入力欄に貼り付けてください。</span>
        </li>
      </ol>
      
      <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
        ※ 入力されたキーはあなたのブラウザにのみ保存され、外部に送信されることはありませんのでご安心ください。
      </div>
    </div>
  );
};

export default ApiKeyGuide;
