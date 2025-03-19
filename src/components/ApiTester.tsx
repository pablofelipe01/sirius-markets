// src/components/ApiTester.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface ApiTesterProps {
  onClose: () => void;
}

const ApiTester: React.FC<ApiTesterProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY || '');
  const [testResult, setTestResult] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const testApi = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      // Prueba simple de la API con AAPL
      const response = await axios.get(
        `https://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=AAPL&limit=1`
      );
      
      setTestResult(response.data);
    } catch (error) {
      console.error('API test error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        setError(JSON.stringify(error.response.data, null, 2));
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">MarketStack API Tester</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">API Key:</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter your MarketStack API key here"
          />
        </div>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={testApi}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded overflow-auto">
            <h3 className="font-bold mb-2">Error:</h3>
            <pre className="text-red-300 text-sm">{error}</pre>
          </div>
        )}
        
        {testResult && (
          <div className="p-4 bg-gray-800 border border-gray-700 rounded overflow-auto">
            <h3 className="font-bold mb-2">Success! API Response:</h3>
            <pre className="text-green-300 text-sm">{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Troubleshooting tips:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Make sure you copy the exact API key from your MarketStack dashboard</li>
            <li>Check that your subscription is active and payments are up to date</li>
            <li>Verify that you haven`t exceeded your plan`s API request limits</li>
            <li>Try generating a new API key in your MarketStack dashboard if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;