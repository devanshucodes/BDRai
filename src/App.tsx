import React, { useState } from 'react';
import { Mail, MessageSquare, Frame, Send, Loader2, Zap } from 'lucide-react';
import { generateResponse } from './lib/gemini';

type Mode = 'email' | 'reply' | 'frame' | 'prospect';

function App() {
  const [mode, setMode] = useState<Mode>('email');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    org: '',
    person: '',
    designation: '',
    message: '',
    context: ''
  });
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateResponse(mode, formData);
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while generating the response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modes = [
    { id: 'email', icon: Mail, label: 'Write Email' },
    { id: 'reply', icon: MessageSquare, label: 'Reply to Message' },
    { id: 'frame', icon: Frame, label: 'Frame a Message' },
    { id: 'prospect', icon: Frame, label: 'Do Prospecting' }
  ];

  const inputClasses = "mt-1 block w-full rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 px-4 py-2";

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-30" />

      <div className="relative">
        <header className="bg-transparent py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-blue-400" />
                  <h1 className="text-4xl font-bold">
                    <span className="gradient-text">LambdaTest</span>
                    <span className="ml-2 text-white">BDR Assistant</span>
                  </h1>
                </div>
                <span className="text-sm text-gray-400 ml-10 mt-1">Powered by LambdaTest</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="glass-effect rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            <div className="border-b border-gray-700">
              <nav className="flex space-x-4 px-6 py-4">
                {modes.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setMode(id as Mode);
                      setResponse('');
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      mode === id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'email' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          value={formData.org}
                          onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                          className={inputClasses}
                          placeholder="e.g., PO Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          value={formData.person}
                          onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                          className={inputClasses}
                          placeholder="e.g., Prospect Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={formData.designation}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          className={inputClasses}
                          placeholder="e.g., Director of QA, Engineering Manager"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Context (Optional)
                      </label>
                      <div className="mt-1 text-xs text-gray-400 mb-2">
                        Paste any previous email threads or relevant context that can help generate a better response
                      </div>
                      <textarea
                        value={formData.context}
                        onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                        rows={4}
                        className={inputClasses}
                        placeholder="Previous emails, company research, or any other relevant information..."
                      />
                      
                    </div>
                  </>
                )}

                {(mode === 'reply' || mode === 'frame') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className={inputClasses}
                        placeholder="e.g., Director of QA, Engineering Manager"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        {mode === 'reply' ? 'Message to Reply to' : 'Context for Message'}
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className={inputClasses}
                        placeholder="Copy and Paste previous messages, company research, or any other relevant information..."
                        required
                      />
                    </div>
                  </>
                )}

                {mode === 'prospect' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          value={formData.org}
                          onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                          className={inputClasses}
                          placeholder="e.g., PO Name"
                          required
                        />
                      </div>
                    
                      
                    </div>
                    
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Generate Response
                    </>
                  )}
                </button>
              </form>

              {response && (
                <div className="mt-8 animate-float">
                  <h2 className="text-xl font-medium text-white mb-4">Generated Response:</h2>
                  <div className="card-gradient rounded-lg p-6">
                    <pre className="whitespace-pre-wrap font-sans text-gray-300">{response}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;