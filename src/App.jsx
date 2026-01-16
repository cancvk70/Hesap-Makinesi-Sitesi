import React, { useState, useEffect } from 'react';
import { Calculator, History, Moon, Sun, Trash2, X } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('calculator_theme');
    if (savedTheme) setTheme(savedTheme);

    const savedHistory = localStorage.getItem('calculator_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        setHistory([]);
      }
    }
  }, []);

  const saveHistory = (newHistory) => {
    localStorage.setItem('calculator_history', JSON.stringify(newHistory));
  };

  const saveTheme = (newTheme) => {
    localStorage.setItem('calculator_theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const evaluateExpression = (expr) => {
    try {
      let processedExpr = expr
        .replace(/\s+/g, '')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/\^/g, '**');

      processedExpr = processedExpr
        .replace(/sin\(([^)]+)\)/g, (_, p1) => Math.sin(eval(p1) * Math.PI / 180))
        .replace(/cos\(([^)]+)\)/g, (_, p1) => Math.cos(eval(p1) * Math.PI / 180))
        .replace(/tan\(([^)]+)\)/g, (_, p1) => Math.tan(eval(p1) * Math.PI / 180))
        .replace(/sqrt\(([^)]+)\)/g, (_, p1) => Math.sqrt(eval(p1)))
        .replace(/log\(([^)]+)\)/g, (_, p1) => Math.log10(eval(p1)))
        .replace(/ln\(([^)]+)\)/g, (_, p1) => Math.log(eval(p1)))
        .replace(/(\d+)!/g, (_, n) => {
          let num = parseInt(n);
          let fact = 1;
          for (let i = 2; i <= num; i++) fact *= i;
          return fact;
        });

      const safeEval = new Function('return ' + processedExpr);
      const value = safeEval();
      
      return typeof value === 'number' && !isNaN(value) ? value : null;
    } catch (e) {
      return null;
    }
  };

  const handleCalculate = () => {
    if (!input.trim()) return;

    const value = evaluateExpression(input);
    
    if (value !== null) {
      const formattedResult = Number.isInteger(value) 
        ? value.toString() 
        : value.toFixed(8).replace(/\.?0+$/, '');
      
      setResult(formattedResult);
      
      const newHistory = [...history, { 
        expression: input, 
        result: formattedResult,
        timestamp: new Date().toLocaleString('tr-TR')
      }];
      
      if (newHistory.length > 20) newHistory.shift();
      setHistory(newHistory);
      saveHistory(newHistory);
    } else {
      setResult('Hata');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleCalculate();
    if (e.key === 'Escape') clearInput();
  };

  const addToInput = (value) => {
    setInput(prev => prev + value);
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const deleteLastChar = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculator_history');
  };

  const loadFromHistory = (item) => {
    setInput(item.expression);
    setResult(item.result);
    setShowHistory(false);
  };

  const buttons = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
  ];

  const scientificButtons = ['sin', 'cos', 'tan', 'sqrt', 'π', '^', '!', 'log'];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="max-w-md mx-auto p-4 min-h-screen flex items-center">
        <div className={`w-full rounded-3xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-gray-800/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl shadow-lg ${
                  isDark 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-500'
                }`}>
                  <Calculator className="text-white" size={24} />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Hesap Makinesi
                  </h1>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Made By Can
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl transition-all active:scale-95 ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2.5 rounded-xl transition-all active:scale-95 ${
                    showHistory
                      ? isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                        : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                  }`}
                >
                  <History size={20} />
                </button>
              </div>
            </div>

            <div className={`rounded-2xl p-5 mb-4 shadow-inner ${
              isDark ? 'bg-gray-900/50' : 'bg-gray-50'
            }`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="0"
                className={`w-full bg-transparent text-right text-3xl outline-none font-light ${
                  isDark 
                    ? 'text-white placeholder-gray-600' 
                    : 'text-gray-900 placeholder-gray-400'
                }`}
              />
              {result && (
                <div className={`text-right text-4xl font-bold mt-3 animate-fade-in ${
                  result === 'Hata'
                    ? 'text-red-500'
                    : isDark 
                      ? 'text-blue-400' 
                      : 'text-blue-600'
                }`}>
                  = {result}
                </div>
              )}
            </div>

            {showHistory && (
              <div className={`rounded-2xl p-4 mb-4 shadow-inner ${
                isDark ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Geçmiş
                  </h3>
                  <div className="flex gap-2">
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className={`p-1.5 rounded-lg transition-all active:scale-95 ${
                          isDark 
                            ? 'hover:bg-gray-800 text-red-400' 
                            : 'hover:bg-gray-200 text-red-600'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setShowHistory(false)}
                      className={`p-1.5 rounded-lg transition-all active:scale-95 ${
                        isDark 
                          ? 'hover:bg-gray-800 text-gray-400' 
                          : 'hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className={`text-center py-6 text-sm ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Henüz hesaplama yok
                    </p>
                  ) : (
                    history.slice().reverse().map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadFromHistory(item)}
                        className={`w-full rounded-xl p-3 text-left transition-all active:scale-98 ${
                          isDark 
                            ? 'bg-gray-800 hover:bg-gray-700' 
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        <div className={`text-sm mb-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {item.expression}
                        </div>
                        <div className={`font-semibold text-lg ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          = {item.result}
                        </div>
                        <div className={`text-xs mt-1 ${
                          isDark ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {item.timestamp}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 mb-3">
              {scientificButtons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => addToInput(btn === 'sqrt' ? 'sqrt(' : btn)}
                  className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    isDark 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-blue-300' 
                      : 'bg-gradient-to-br from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 text-blue-700'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {buttons.flat().map((btn, idx) => {
                const isOperator = ['÷', '×', '-', '+'].includes(btn);
                const isEquals = btn === '=';
                const isSpecial = btn === 'C' || btn === '⌫';
                
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (btn === '=') handleCalculate();
                      else if (btn === 'C') clearInput();
                      else if (btn === '⌫') deleteLastChar();
                      else addToInput(btn);
                    }}
                    className={`py-5 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg ${
                      isEquals
                        ? isDark
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                        : isOperator
                        ? isDark
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white'
                          : 'bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white'
                        : isSpecial
                        ? isDark
                          ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'
                          : 'bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white'
                        : isDark
                        ? 'bg-gradient-to-br from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white'
                        : 'bg-gradient-to-br from-gray-200 to-gray-100 hover:from-gray-300 hover:to-gray-200 text-gray-900'
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>

            <div className={`text-center mt-4 text-xs ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Made By Can
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                                            }
