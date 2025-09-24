'use client'

import { useState } from 'react'

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setMessage('Por favor, insira algum texto antes de enviar.')
      setMessageType('error')
      return
    }

    if (!email.trim()) {
      setMessage('Por favor, insira seu email.')
      setMessageType('error')
      return
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage('Por favor, insira um email válido.')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')

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
          lead_text: inputText,
          email: email
        })
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
      }

      // Sucesso - mostrar mensagem de confirmação
      setMessage('✅ Lead enviada com sucesso! Você receberá os resultados no email informado em breve. Não esqueça de verificar sua caixa de spam ou lixo eletrônico.')
      setMessageType('success')
      setInputText('')
      setEmail('')

    } catch (error) {
      console.error('Erro ao enviar dados:', error)
      setMessage(error instanceof Error ? error.message : 'Erro desconhecido ao processar a solicitação.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                disabled={isLoading}
              />
            </div>

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

            <div>
               <button
                 onClick={handleGenerate}
                 disabled={isLoading}
                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {isLoading ? (
                   <>
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                     Processando análise...
                   </>
                 ) : (
                   <>
                     ✨ Enviar para Análise
                   </>
                 )}
               </button>
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
      </div>
    </div>
  )
}
