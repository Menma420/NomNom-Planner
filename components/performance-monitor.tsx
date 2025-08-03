"use client";

import { useState, useEffect } from 'react';

interface CacheStats {
  keys: number;
  memory: string;
}

interface PerformanceData {
  responseTime: number;
  cacheHit: boolean;
  cached: boolean;
}

export default function PerformanceMonitor() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/cache');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch cache stats:', error);
    }
  };

  const clearCache = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cache', {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Cache Performance</h3>
      
      {stats && (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Cached Keys:</span>
            <span className="font-medium">{stats.keys}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Memory Usage:</span>
            <span className="font-medium">{stats.memory}</span>
          </div>
        </div>
      )}

      {performanceData && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between text-sm">
            <span>Response Time:</span>
            <span className={performanceData.responseTime < 200 ? 'text-green-600' : 'text-orange-600'}>
              {performanceData.responseTime}ms
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cache Hit:</span>
            <span className={performanceData.cacheHit ? 'text-green-600' : 'text-red-600'}>
              {performanceData.cacheHit ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Refresh Stats
        </button>
        <button
          onClick={clearCache}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? 'Clearing...' : 'Clear Cache'}
        </button>
      </div>
    </div>
  );
} 