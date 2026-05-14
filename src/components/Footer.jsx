import React, { useState } from 'react';
import { History, X, ChevronRight } from 'lucide-react';
import { VERSION, VERSION_HISTORY } from '../constants/version';

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-200 mt-12">
      <div className="flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
        <div className="mb-4 md:mb-0">
          © 2026 Web Manual Maker <span className="mx-2">|</span> Version {VERSION}
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center hover:text-blue-600 transition-colors font-medium"
        >
          <History className="w-4 h-4 mr-2" />
          バージョン履歴を確認
        </button>
      </div>

      {/* Version History Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <History className="w-5 h-5 mr-3 text-blue-600" />
                アップデート履歴
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {VERSION_HISTORY.map((item, idx) => (
                <div key={item.version} className="relative pl-6">
                  {/* Timeline line */}
                  {idx !== VERSION_HISTORY.length - 1 && (
                    <div className="absolute left-[7px] top-6 bottom-[-32px] w-0.5 bg-slate-100"></div>
                  )}
                  
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-slate-800">v{item.version}</span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">{item.date}</span>
                  </div>
                  
                  <ul className="space-y-2">
                    {item.changes.map((change, cIdx) => (
                      <li key={cIdx} className="text-sm text-slate-600 flex items-start">
                        <ChevronRight className="w-4 h-4 text-blue-400 mr-1 mt-0.5 flex-shrink-0" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
