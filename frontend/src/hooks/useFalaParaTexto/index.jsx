import { useState, useRef, useEffect, useCallback } from "react";

const useFalaParaTexto = (options = {}) => {
  const [isEscutando, setIsEscutando] = useState(false)
  const [texto, setTexto] = useState('')
  const reconhecimentoRef = useRef(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API não é suportada neste navegador.')
      return;
    }

    reconhecimentoRef.current = new window.webkitSpeechRecognition()
    const reconhecimento = reconhecimentoRef.current
    reconhecimento.interimResults = options.interimResults ?? true
    reconhecimento.lang = options.lang ?? 'pt-BR'
    reconhecimento.continuous = options.continuous ?? true

    if ("webkitSpeechGrammarList" in window) {
      const grammar = '#JSGF V1.0; grammar commands;';
      const reconhecimentoList = new window.webkitSpeechGrammarList()
      reconhecimentoList.addFromString(grammar, 1)
      reconhecimento.grammars = reconhecimentoList
    }

    reconhecimento.onresult = (event) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      setTexto(transcript)
    }

    reconhecimento.onerror = (event) => {
      console.error("Erro no reconhecimento de fala", event.error)
    }

    reconhecimento.onend = () => {
      setIsEscutando(false)
    }

    return () => {
      reconhecimento.stop()
    }
  }, [options.continuous, options.interimResults, options.lang])

  const startEscutando = useCallback(() => {
    if (reconhecimentoRef.current && !isEscutando) {
      reconhecimentoRef.current.start()
      setIsEscutando(true)
    }
  }, [isEscutando])

  const stopEscutando = useCallback(() => {
    if (reconhecimentoRef.current && isEscutando) {
      reconhecimentoRef.current.stop()
      setIsEscutando(false)
    } 
  }, [isEscutando])


  return {
    isEscutando,
    texto,
    startEscutando,
    stopEscutando,
    setTexto,
  }
};

export default useFalaParaTexto;