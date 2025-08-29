"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<any>(null);

  const testConnection = async () => {
    try {
      const res = await fetch("/api/test-sybase");
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error testing connection:", error);
    }
  };
  const testConnectionRubix = async () => {
    try {
      const res = await fetch("/api/test-rubix");
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error testing connection:", error);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Test Connexion Sybase</h1>

      <button
        onClick={testConnection}
        className="mt-4 px-4 py-2 bg-blue-600 mr-6 text-white rounded"
      >
        Tester la connexion
      </button>
       <button
        onClick={testConnectionRubix}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Tester la connexion
      </button>

      {result && (
        
        <pre className="mt-4 p-4 bg-blue rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
