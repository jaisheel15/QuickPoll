import React, { useState } from 'react';
import { createPoll } from '../apiCalls/poll';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!question.trim()) {
      setMessage('Question is required');
      return;
    }
    
    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      setMessage('At least 2 options are required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await createPoll(question.trim(), validOptions);
      setMessage('Poll created successfully!');
      
      // Reset form
      setQuestion('');
      setOptions(['', '']);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create New Poll</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="question" className="block text-lg font-semibold text-gray-700">
            Question:
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-700">Options:</label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddOption}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 font-medium"
          >
            Add Option
          </button>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 focus:outline-none focus:ring-4 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-300'
            }`}
          >
            {loading ? 'Creating...' : 'Create Poll'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
          message.includes('success')
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default CreatePoll;