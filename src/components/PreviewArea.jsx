import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { marked } from 'marked';
import { formatMarkdownToHtml } from '../utils/formatter';

const PreviewArea = ({ 
  generatedMarkdown, 
  isLoading, 
  loadingStep, 
  useAI, 
  onReset, 
  onDownload 
}) => {
  return (
    <div className="h-[calc(100vh-180px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">完成プレビュー</h2>
          <p className="text-slate-500 text-sm mt-1">
            {useAI ? 'AIが整理したマニュアルの内容' : '自動整形されたマニュアルの内容'}を確認し、HTMLとして保存できます。
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onReset}
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition shadow-sm"
            disabled={isLoading}
          >
            新しく作る
          </button>
          <button
            onClick={onDownload}
            disabled={isLoading || !generatedMarkdown}
            className={`flex items-center px-6 py-2.5 font-bold rounded-lg transition shadow-md ${
              isLoading || !generatedMarkdown
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
            }`}
          >
            <Download className="w-5 h-5 mr-2" />
            HTMLとして保存
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
        {isLoading ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center max-w-sm w-full text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">生成中...</h3>
              <p className="text-sm font-medium text-slate-500">{loadingStep}</p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="flex-1 overflow-y-auto p-10">
          {generatedMarkdown && (
            <div 
              className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-blue-600 mx-auto"
              dangerouslySetInnerHTML={{ 
                __html: formatMarkdownToHtml(generatedMarkdown, marked.parse)
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;
