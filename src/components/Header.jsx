import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

const Header = ({ currentStep, onLogoClick, version, onVersionClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onLogoClick}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Webマニュアルメーカー</h1>
          </div>
          <button 
            onClick={onVersionClick}
            className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-slate-200 transition-colors ml-1"
          >
            v{version}
          </button>
        </div>
        
        <div className="flex items-center space-x-4 text-sm font-medium text-slate-500">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${currentStep >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'}`}>1</span>
            ファイル選択
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${currentStep >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'}`}>2</span>
            生成実行
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${currentStep >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'}`}>3</span>
            確認・保存
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
