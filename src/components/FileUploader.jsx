import React from 'react';
import { FileUp } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onDrop, isDragActive }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
    }
  });

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">元になるマニュアルをアップロード</h2>
        <p className="text-slate-500">WordやExcelのファイルをアップロードするだけで、美しいWebマニュアルに変換します。</p>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`bg-white border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileUp className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">ファイルをドラッグ＆ドロップ</h3>
        <p className="text-slate-500 mb-6">または、クリックしてPCから選択</p>
        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-400 bg-slate-50 py-2 px-4 rounded-full inline-flex">
          <span>対応形式:</span>
          <span className="text-slate-600">.docx (Word)</span>
          <span>/</span>
          <span className="text-slate-600">.xlsx (Excel)</span>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
