'use client'

import { useState } from 'react'

// Tipos para a estrutura da resposta
interface Improvement {
  issue: string
  why_it_matters: string
  how_eugene_would_fix: string
  rewritten_example: string
  citations: number[]
}

interface NewAngle {
  target_level: number
  headline: string
  rationale: string
  citations: number[]
}

interface ApiResponse {
  output: {
    level_of_awareness: number
    level_justification: string
    lead_framework: string
    framework_justification: string
    improvements: Improvement[]
    new_angles: NewAngle[]
  }
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setMessage('Por favor, insira algum texto antes de enviar.')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')
    setApiResponse(null)

    try {
      const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT
      
      if (!endpoint) {
        throw new Error('Endpoint não configurado. Verifique a variável de ambiente NEXT_PUBLIC_LEAD_ENDPOINT.')
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_text: inputText
        })
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // A resposta é um array, pegamos o primeiro elemento
      const responseData = Array.isArray(data) ? data[0] : data
      
      if (responseData && responseData.output) {
        setApiResponse(responseData)
        setMessage('Análise concluída com sucesso!')
        setMessageType('success')
        setInputText('')
      } else {
        throw new Error('Formato de resposta inválido')
      }

    } catch (error) {
      console.error('Erro ao enviar dados:', error)
      setMessage(error instanceof Error ? error.message : 'Erro desconhecido ao processar a solicitação.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setApiResponse(null)
    setMessage('')
    setInputText('')
  }

  const renderCitations = (citations: number[]) => (
    <div className="flex flex-wrap gap-1 mt-2">
      {citations.map((citation, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        >
          {citation}
        </span>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Gerador de Lead
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Analise e otimize seu conteúdo de marketing
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="lead-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Insira seu texto para análise:
              </label>
              <textarea
                id="lead-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Cole aqui o texto que você deseja analisar..."
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
               <button
                 onClick={handleGenerate}
                 disabled={isLoading}
                 className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {isLoading ? (
                   <>
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                     Analisando...
                   </>
                 ) : (
                   <>
                     ✨ Gerar Análise
                   </>
                 )}
               </button>

               {apiResponse && (
                 <button
                   onClick={clearResults}
                   className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 cursor-pointer"
                 >
                   🗑️ Limpar
                 </button>
               )}
             </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300' 
                  : 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-300'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {apiResponse && (
          <div className="space-y-6">
            {/* Level of Awareness Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Nível de Consciência
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Nível {apiResponse.output.level_of_awareness}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {apiResponse.output.level_justification}
              </p>
            </div>

            {/* Framework Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Framework de Lead
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {apiResponse.output.lead_framework}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {apiResponse.output.framework_justification}
              </p>
            </div>

            {/* Improvements Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                  <span className="text-2xl">🔧</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Melhorias Sugeridas
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {apiResponse.output.improvements.map((improvement, index) => (
                  <div key={index} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-sm uppercase tracking-wide">
                          Problema Identificado
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                          {improvement.issue}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-sm uppercase tracking-wide">
                          Por que Importa
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                          {improvement.why_it_matters}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-sm uppercase tracking-wide">
                          Como Eugene Corrigiria
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                          {improvement.how_eugene_would_fix}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-sm uppercase tracking-wide">
                          Exemplo Reescrito
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 italic">
                          "{improvement.rewritten_example}"
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-sm uppercase tracking-wide mb-2">
                          Citações
                        </h4>
                        {renderCitations(improvement.citations)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Angles Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <span className="text-2xl">💡</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Novos Ângulos
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {apiResponse.output.new_angles.map((angle, index) => (
                  <div key={index} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Nível {angle.target_level}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-purple-800 dark:text-purple-200 text-lg">
                          {angle.headline}
                        </h4>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-purple-700 dark:text-purple-300 text-sm uppercase tracking-wide">
                          Justificativa
                        </h5>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                          {angle.rationale}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-purple-700 dark:text-purple-300 text-sm uppercase tracking-wide mb-2">
                          Citações
                        </h5>
                        {renderCitations(angle.citations)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
