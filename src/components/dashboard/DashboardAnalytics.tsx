import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { CV } from '../../types';
import { TrendingUp, History, Briefcase } from 'lucide-react';

interface DashboardAnalyticsProps {
  cvs: CV[];
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ cvs }) => {
  // Generate plausible mock data for score evolution
  const getScoreEvolutionData = () => {
    if (cvs.length === 0) return { dates: [], scores: [] };

    const sortedCvs = [...cvs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const firstDate = new Date(sortedCvs[0].createdAt);
    const dates: string[] = [];
    const scores: (number | null)[] = [];

    for (let i = 0; i < 5; i++) {
        const date = new Date(firstDate);
        date.setDate(date.getDate() + i * 7);
        dates.push(date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }));
    }

    const baseScore = sortedCvs[0].score || 60;
    scores.push(baseScore);
    scores.push(baseScore + 5);
    scores.push(baseScore + 2);
    scores.push(baseScore + 8);
    scores.push(cvs[cvs.length-1].score || baseScore + 12);
    
    return { dates, scores };
  };
  
  const { dates, scores } = getScoreEvolutionData();

  const chartOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
    },
    yAxis: {
      type: 'value',
      name: 'Score ATS (%)',
      min: 50,
      max: 100,
    },
    series: [
      {
        name: 'Score ATS',
        type: 'line',
        smooth: true,
        data: scores,
        itemStyle: {
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{
                offset: 0, color: 'rgba(59, 130, 246, 0.5)'
            }, {
                offset: 1, color: 'rgba(59, 130, 246, 0)'
            }]
          }
        }
      },
    ],
  };

  const applicationHistory = cvs
    .filter(cv => cv.targetJob)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-8"
    >
      {/* Score Evolution Chart */}
      <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <span>Évolution du Score ATS</span>
        </h3>
        {cvs.length > 0 ? (
            <ReactECharts option={chartOption} style={{ height: '300px' }} />
        ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
                Aucune donnée de score disponible.
            </div>
        )}
      </div>

      {/* Application History */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <History className="w-5 h-5 text-orange-500" />
          <span>Historique des Candidatures</span>
        </h3>
        <div className="space-y-4">
          {applicationHistory.length > 0 ? (
            applicationHistory.map(cv => (
              <div key={cv.id} className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{cv.targetJob}</p>
                  <p className="text-sm text-gray-600">{cv.targetCompany}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(cv.updatedAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-center">
              Aucune candidature ciblée pour le moment.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardAnalytics;
