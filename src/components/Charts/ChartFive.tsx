import React, { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { rapportActiviteService } from '../../services/rapportActivite/rapportActiviteService';

const ChartFive: React.FC = () => {
  const [stats, setStats] = useState({
    totalEffectifs: 0,
    totalEcoles: 0,
    totalClasses: 0,
    totalPersonnel: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('🔍 ChartFive - Début du chargement des statistiques');
        const statsData = await rapportActiviteService.getRapportStats();
        console.log('🔍 ChartFive - Données reçues:', statsData);
        
        setStats({
          totalEffectifs: statsData.totalEffectifs,
          totalEcoles: statsData.totalEcoles,
          totalClasses: statsData.totalClasses,
          totalPersonnel: statsData.totalPersonnel,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
  }, []);

  const options: ApexOptions = {
    colors: ['#1C2434', '#80CAEE', '#10B981', '#FB5454'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
      height: 335,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
        offsetY: 0,
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      fontFamily: 'Satoshi',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#9ca3af',
      },
      markers: {
        width: 6,
        height: 6,
        strokeWidth: 0,
        strokeColor: 'transparent',
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };

  const series = [
    stats.totalEffectifs,
    stats.totalEcoles,
    stats.totalClasses,
    stats.totalPersonnel,
  ];

  console.log('🔍 ChartFive - Rendu avec stats:', stats);
  console.log('🔍 ChartFive - Series:', series);

  return (
    <div className="col-span-12 xl:col-span-6">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-8 pb-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6 min-h-[450px]">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Répartition Éducative
            </h4>
            <p className="text-sm text-bodydark2">
              Répartition des effectifs, écoles, classes et personnel
            </p>
          </div>
        </div>

        <div>
          <div id="chartFive" className="-ml-5">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={350}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-boxdark">
            <h5 className="text-lg font-semibold text-black dark:text-white">
              {stats.totalEffectifs.toLocaleString()}
            </h5>
            <p className="text-sm text-bodydark2">Effectifs</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-boxdark">
            <h5 className="text-lg font-semibold text-black dark:text-white">
              {stats.totalEcoles.toLocaleString()}
            </h5>
            <p className="text-sm text-bodydark2">Écoles</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-boxdark">
            <h5 className="text-lg font-semibold text-black dark:text-white">
              {stats.totalClasses.toLocaleString()}
            </h5>
            <p className="text-sm text-bodydark2">Classes</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-boxdark">
            <h5 className="text-lg font-semibold text-black dark:text-white">
              {stats.totalPersonnel.toLocaleString()}
            </h5>
            <p className="text-sm text-bodydark2">Personnel</p>
          </div>
        </div>

        {series.every(val => val === 0) && (
          <div className="text-center py-8 text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartFive; 