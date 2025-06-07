import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMic, FiMicOff, FiSend, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'rw-RW'; // Kinyarwanda

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSend = async (message = input) => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = {
        type: 'ai',
        content: 'I am your offline AI assistant. How can I help you with your learning today?',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);

      // Text to speech for AI response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiMessage.content);
        utterance.lang = 'rw-RW'; // Kinyarwanda
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="position-fixed bottom-4 end-4 btn btn-primary rounded-circle p-3 shadow-lg"
        onClick={() => setIsOpen(true)}
        style={{ zIndex: 1000 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="position-fixed bottom-4 end-4 bg-white rounded-4 shadow-lg"
            style={{ width: 350, height: 500, zIndex: 1001 }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="mb-0">{t('AI Assistant')}</h5>
              <button
                className="btn btn-link text-muted p-0"
                onClick={() => setIsOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="p-3 overflow-auto"
              style={{ height: 'calc(100% - 130px)' }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-3 ${
                    message.type === 'user' ? 'text-end' : 'text-start'
                  }`}
                >
                  <div
                    className={`d-inline-block p-3 rounded-4 ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-light'
                    }`}
                    style={{ maxWidth: '80%' }}
                  >
                    {message.content}
                  </div>
                  <small className="text-muted d-block mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </small>
                </motion.div>
              ))}
              {isProcessing && (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm text-primary" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-top">
              <div className="input-group">
                <textarea
                  className="form-control border-end-0"
                  placeholder={t('Type your message...')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{ resize: 'none', height: 40 }}
                />
                <button
                  className={`btn ${
                    isListening ? 'btn-danger' : 'btn-outline-primary'
                  } border-start-0`}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!('webkitSpeechRecognition' in window)}
                >
                  {isListening ? <FiMicOff /> : <FiMic />}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isProcessing}
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot; 