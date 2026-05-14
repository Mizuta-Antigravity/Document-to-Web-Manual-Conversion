import React, { useState, useEffect } from 'react';
import { Key, AlertCircle } from 'lucide-react';
import { extractTextFromFiles } from './utils/fileExtractor';
import { restructureTextToManual } from './utils/geminiApi';
import { restructureTextLocally } from './utils/localFormatter';
import { downloadAsHtml } from './utils/exportHtml';

// 分割したコンポーネントのインポート
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import PreviewArea from './components/PreviewArea';
import ApiKeyGuide from './components/ApiKeyGuide';
import Footer from './components/Footer';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [useAI, setUseAI] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (generatedMarkdown && window.lucide) {
      window.lucide.createIcons();
    }
  }, [generatedMarkdown]);

  const handleApiKeyChange = (e) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setCurrentStep(2);
  };

  const handleGenerate = async () => {
    if (useAI && !apiKey) {
      setError('AIを使用するにはAPIキーが必要です。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentStep(3);

    try {
      setLoadingStep('ファイルを解析中...');
      const combinedText = await extractTextFromFiles(files);
      
      let markdown = '';
      if (useAI) {
        setLoadingStep('AIがマニュアルを構成中 (1分ほどかかる場合があります)...');
        markdown = await restructureTextToManual(combinedText, apiKey);
      } else {
        setLoadingStep('テキストを自動整形中...');
        markdown = restructureTextLocally(combinedText);
      }
      
      setGeneratedMarkdown(markdown);
    } catch (err) {
      setError(err.message || '処理中にエラーが発生しました。');
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const title = files.length > 0 ? files[0].name.split('.')[0] : 'Webマニュアル';
    downloadAsHtml(generatedMarkdown, title);
  };

  const reset = () => {
    setFiles([]);
    setGeneratedMarkdown('');
    setCurrentStep(1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header currentStep={currentStep} onLogoClick={reset} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start animate-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {currentStep === 1 && (
          <FileUploader onDrop={onDrop} />
        )}

        {currentStep === 2 && (
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                生成オプション
              </h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                    <Key className="w-4 h-4 mr-1.5" />
                    生成モード
                  </h3>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={useAI} onChange={() => setUseAI(!useAI)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${useAI ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useAI ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-slate-700">AIを使用する</span>
                  </label>
                </div>
                
                {useAI ? (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                    <p className="text-sm text-slate-600 mb-4">Gemini APIキーを入力してください（ブラウザにのみ保存されます）</p>
                    <input 
                      type="password"
                      value={apiKey}
                      onChange={handleApiKeyChange}
                      placeholder="AIzaSy..."
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-mono shadow-sm"
                    />
                  </div>
                  <ApiKeyGuide />
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-sm text-slate-600">AIを使用せず、簡易的なルールで自動整形して出力します。</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-lg active:scale-[0.98]"
              >
                マニュアルを生成する
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <PreviewArea 
            generatedMarkdown={generatedMarkdown}
            isLoading={isLoading}
            loadingStep={loadingStep}
            useAI={useAI}
            onReset={reset}
            onDownload={handleDownload}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
