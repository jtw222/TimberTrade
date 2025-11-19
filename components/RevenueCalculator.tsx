import React, { useState, useEffect, useMemo } from 'react';
import { ManufacturingInputs, ProjectionResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { DollarSign, Users, Clock, Package, AlertCircle, Lightbulb } from 'lucide-react';
import { generateBusinessAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const RevenueCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<ManufacturingInputs>({
    workers: 2,
    hoursPerWeek: 40,
    hourlyWage: 25,
    minutesPerUnit: 45,
    materialCost: 12,
    salesPrice: 65,
    monthlyOverhead: 500
  });
  
  const [advice, setAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  // Real-time calculation
  const results: ProjectionResult = useMemo(() => {
    const totalHoursPerMonth = inputs.workers * inputs.hoursPerWeek * 4.33; // 4.33 weeks in a month
    const maxUnits = Math.floor((totalHoursPerMonth * 60) / inputs.minutesPerUnit);
    
    const laborCost = totalHoursPerMonth * inputs.hourlyWage;
    const materialTotal = maxUnits * inputs.materialCost;
    const totalCost = laborCost + materialTotal + inputs.monthlyOverhead;
    
    const revenue = maxUnits * inputs.salesPrice;
    const profit = revenue - totalCost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      maxUnitsMonthly: maxUnits,
      monthlyRevenue: revenue,
      monthlyCost: totalCost,
      monthlyProfit: profit,
      marginPercent: margin
    };
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const getAiAdvice = async () => {
    setLoadingAdvice(true);
    const metricsSummary = `
      Workers: ${inputs.workers}, 
      Unit Time: ${inputs.minutesPerUnit} mins, 
      Material Cost: $${inputs.materialCost}, 
      Sales Price: $${inputs.salesPrice}, 
      Monthly Profit: $${results.monthlyProfit.toFixed(2)}, 
      Margin: ${results.marginPercent.toFixed(1)}%
    `;
    const tip = await generateBusinessAdvice(metricsSummary);
    setAdvice(tip);
    setLoadingAdvice(false);
  };

  const chartData = [
    { name: 'Revenue', amount: results.monthlyRevenue },
    { name: 'Costs', amount: results.monthlyCost },
    { name: 'Profit', amount: results.monthlyProfit },
  ];

  const pieData = [
    { name: 'Materials', value: results.maxUnitsMonthly * inputs.materialCost },
    { name: 'Labor', value: inputs.workers * inputs.hoursPerWeek * 4.33 * inputs.hourlyWage },
    { name: 'Overhead', value: inputs.monthlyOverhead },
  ];

  const COLORS = ['#d97706', '#ef4444', '#22c55e']; // Amber, Red, Green
  const PIE_COLORS = ['#78350f', '#b45309', '#d6d3d1']; // Wood tones

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Inputs Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-stone-800">
            <Users className="mr-2 h-5 w-5 text-amber-600" /> Production Setup
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase">Workers</label>
              <input 
                type="number" name="workers" value={inputs.workers} onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase">Hours/Week per Worker</label>
              <input 
                type="number" name="hoursPerWeek" value={inputs.hoursPerWeek} onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase">Hourly Wage ($)</label>
              <input 
                type="number" name="hourlyWage" value={inputs.hourlyWage} onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase">Minutes to make 1 Frame</label>
              <input 
                type="number" name="minutesPerUnit" value={inputs.minutesPerUnit} onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-stone-800">
            <DollarSign className="mr-2 h-5 w-5 text-green-600" /> Financials per Unit
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase">Material Cost ($)</label>
              <input 
                type="number" name="materialCost" value={inputs.materialCost} onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase">Sales Price ($)</label>
              <input 
                type="number" name="salesPrice" value={inputs.salesPrice} onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase">Monthly Overhead ($)</label>
              <input 
                type="number" name="monthlyOverhead" value={inputs.monthlyOverhead} onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-8 space-y-6">
        {/* Top Level KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div className="text-amber-800 text-xs font-bold uppercase">Max Capacity</div>
            <div className="text-2xl font-bold text-amber-900 mt-1">{results.maxUnitsMonthly}</div>
            <div className="text-xs text-amber-700 mt-1">Units / Month</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-green-800 text-xs font-bold uppercase">Revenue</div>
            <div className="text-2xl font-bold text-green-900 mt-1">${results.monthlyRevenue.toLocaleString()}</div>
            <div className="text-xs text-green-700 mt-1">Per Month</div>
          </div>
          <div className="bg-stone-100 p-4 rounded-lg border border-stone-200">
            <div className="text-stone-800 text-xs font-bold uppercase">Est. Profit</div>
            <div className={`text-2xl font-bold mt-1 ${results.monthlyProfit > 0 ? 'text-stone-900' : 'text-red-600'}`}>
              ${results.monthlyProfit.toLocaleString()}
            </div>
            <div className="text-xs text-stone-600 mt-1">Net Profit</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-blue-800 text-xs font-bold uppercase">Margin</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">{results.marginPercent.toFixed(1)}%</div>
            <div className="text-xs text-blue-700 mt-1">Profit Margin</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 h-80">
            <h4 className="text-sm font-semibold text-stone-500 mb-4 text-center">Monthly Financial Breakdown</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78716c'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f5f5f4'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 h-80">
            <h4 className="text-sm font-semibold text-stone-500 mb-4 text-center">Cost Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-stone-600 mt-2">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: PIE_COLORS[idx]}}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-indigo-900 font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
              AI Profit Consultant
            </h3>
            {!advice && (
              <button 
                onClick={getAiAdvice} 
                disabled={loadingAdvice}
                className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full hover:bg-indigo-700 disabled:opacity-50"
              >
                {loadingAdvice ? 'Thinking...' : 'Analyze My Numbers'}
              </button>
            )}
          </div>
          {advice ? (
            <div className="prose prose-sm prose-indigo max-w-none mt-2">
               <ReactMarkdown>{advice}</ReactMarkdown>
               <button onClick={() => setAdvice("")} className="text-xs text-indigo-500 underline mt-2">Clear</button>
            </div>
          ) : (
            <p className="text-sm text-indigo-700/70">
              Click analyze to get specific recommendations on how to improve your manufacturing efficiency based on these current inputs.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default RevenueCalculator;