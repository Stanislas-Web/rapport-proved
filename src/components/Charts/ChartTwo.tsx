import React, { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { rapportActiviteService } from '../../services/rapportActivite/rapportActiviteService';

const ChartTwo: React.FC = () => {
  const [stats, setStats] = useState({
    rapportsParAnnee: {} as { [key: string]: number },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await rapportActiviteService.getRapportStats();
        setStats({
          rapportsParAnnee: statsData.rapportsParAnnee,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
  }, []);

  const options: ApexOptions = {
    colors: ['#1C2434', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'area',
      height: 335,
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: Object.keys(stats.rapportsParAnnee).sort((a, b) => parseInt(a) - parseInt(b)),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Nombre de rapports',
        style: {
          fontSize: '14px',
        },
      },
      min: 0,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' rapports';
        },
      },
    },
  };

  const series = [
    {
      name: 'Rapports d\'activité',
      data: Object.keys(stats.rapportsParAnnee)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(year => stats.rapportsParAnnee[year]),
    },
  ];

  return (
    <div className="col-span-12 xl:col-span-4">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-8 pb-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4 min-h-[450px]">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Évolution des Rapports par Année
            </h4>
          </div>
        </div>

        <div>
          <div id="chartTwo" className="-ml-5">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={350}
            />
          </div>
        </div>

        {Object.keys(stats.rapportsParAnnee).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartTwo;
