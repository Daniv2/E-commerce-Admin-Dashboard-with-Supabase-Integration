import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DailyStat {
    date: string;
    total_sales: number;
    total_orders: number;
    new_customers: number;
    page_views: number;
  }
  interface CustomerSegment {
    segment_name: string;
    customer_count: number;
  }
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];


  const Analytics = () => {
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
    const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        fetchAnalytics();
      }, []);

      const fetchAnalytics = async () => {
        try {
          // Fetch daily stats for the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const { data: stats, error: statsError } = await supabase
        .from('daily_stats')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString())
        .order('date');

        
      if (statsError) throw statsError;

        // Fetch customer segments
        const { data: segments, error: segmentsError } = await supabase
        .from('customer_segments')
        .select('*');

        if (segmentsError) throw segmentsError;

        
      setDailyStats(stats || []);
      setCustomerSegments(segments || []);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
);
};

export default Analytics;