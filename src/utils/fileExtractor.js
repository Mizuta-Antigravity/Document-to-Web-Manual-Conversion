import mammoth from 'mammoth';
import * as xlsx from 'xlsx';

/**
 * Wordファイル(.docx)からテキストを抽出する
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const extractTextFromWord = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Excelファイル(.xlsx)からテキストを抽出する
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const extractTextFromExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = xlsx.read(data, { type: 'array' });
        
        let allText = '';
        
        // 全シートのデータをテキスト化する
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (json.length > 0) {
            allText += `\n--- シート: ${sheetName} ---\n`;
            json.forEach(row => {
              if (row && row.length > 0) {
                // 空でないセルをタブ区切りで結合
                const rowText = row.filter(cell => cell !== undefined && cell !== null && cell !== '').join('\t');
                if (rowText.trim()) {
                  allText += rowText + '\n';
                }
              }
            });
          }
        });
        
        resolve(allText);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * ファイルの拡張子に基づいてテキストを抽出する
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const extractTextFromFile = async (file) => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.docx')) {
    return extractTextFromWord(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return extractTextFromExcel(file);
  } else if (fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
    return file.text();
  } else {
    throw new Error(`サポートされていないファイル形式です: ${fileName}`);
  }
};

/**
 * 複数のファイルからテキストを抽出して結合する
 * @param {File[]} files 
 * @returns {Promise<string>}
 */
export const extractTextFromFiles = async (files) => {
  let combinedText = '';
  for (const file of files) {
    const text = await extractTextFromFile(file);
    combinedText += `\n\n=== ファイル: ${file.name} ===\n\n${text}`;
  }
  return combinedText;
};
