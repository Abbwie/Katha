'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Direct fetch - no api.ts dependency for now
  const testGetStores = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/stores');
      const data = await res.json();
      setResult({ success: true, data: data, count: data.length });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testRoot = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/');
      const data = await res.json();
      setResult({ success: true, message: 'Backend is reachable!', data: data });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="space-x-4 mb-6">
        <button 
          onClick={testRoot}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test / (Root)
        </button>
        <button 
          onClick={testGetStores}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test /stores
        </button>
      </div>

      {loading && <div className="text-gray-500">Loading...</div>}

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>Make sure your backend is running:</p>
        <code className="block bg-gray-100 p-2 mt-2">cd backend && uvicorn app:app --reload --port 8000</code>
        <p className="mt-2">Backend URL: <strong>http://localhost:8000</strong></p>
      </div>
    </div>
  );
}