"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");

  const handleGenerate = () => {
    if (inputText.trim()) {
      alert(`Lead gerado com o texto: "${inputText}"`);
    } else {
      alert("Por favor, insira algum texto antes de gerar o lead.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Gerador de Lead
        </h1>
        
        <div className="space-y-6">
          <div>
            <label 
              htmlFor="leadText" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Digite seu texto:
            </label>
            <textarea
              id="leadText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Insira o texto para gerar a lead..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={4}
            />
          </div>
          
          <button
            onClick={handleGenerate}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Gerar Lead
          </button>
        </div>
      </div>
    </div>
  );
}
