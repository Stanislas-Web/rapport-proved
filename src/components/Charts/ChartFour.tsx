import React, { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { rapportActiviteService } from '../../services/rapportActivite/rapportActiviteService';

const ChartFour: React.FC = () => {
  const [stats, setStats] = useState({
    rapportsParProved: {} as { [key: string]: number },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('🔍 ChartFour - Début du chargement des statistiques');
        const statsData = await rapportActiviteService.getRapportStats();
        console.log('🔍 ChartFour - Données reçues:', statsData);
        console.log('🔍 ChartFour - Rapports par PROVED:', statsData.rapportsParProved);
        
        setStats({
          rapportsParProved: statsData.rapportsParProved,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
  }, []);

  const options: ApexOptions = {
    colors: ['#1C2434', '#80CAEE', '#10B981', '#FB5454', '#FFA70B', '#259AE6', '#FFBA00', '#0FADCF'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 0,
        columnWidth: '55%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: Object.keys(stats.rapportsParProved),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'PROVED',
        style: {
          fontSize: '14px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' rapport(s)';
        },
      },
    },
  };

  const series = [
    {
      name: 'Rapports',
      data: Object.values(stats.rapportsParProved),
    },
  ];

  console.log('🔍 ChartFour - Rendu avec stats:', stats);
  console.log('🔍 ChartFour - Nombre de PROVED:', Object.keys(stats.rapportsParProved).length);
  console.log('🔍 ChartFour - Options:', options);
  console.log('🔍 ChartFour - Series:', series);

  return (
    <div className="col-span-12">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-8 pb-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12 min-h-[450px]">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Rapports par PROVED
            </h4>
          </div>
        </div>

        <div>
          <div id="chartFour" className="-ml-5">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
            />
          </div>
        </div>

        {Object.keys(stats.rapportsParProved).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune donnée disponible pour les rapports par PROVED
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartFour; 