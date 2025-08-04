import React, { useState, useEffect } from 'react';
import CardDataStats from '../components/CardDataStats';
import ChartOne from '../components/Charts/ChartOne';
import ChartTwo from '../components/Charts/ChartTwo';
import ChartThree from '../components/Charts/ChartThree';
import ChartFour from '../components/Charts/ChartFour';
import ChartFive from '../components/Charts/ChartFive';
import { rapportActiviteService } from '../services/rapportActivite/rapportActiviteService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TableauBord: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRapports: 0,
        rapportsParStatut: {} as { [key: string]: number },
        totalEffectifs: 0,
        totalEcoles: 0,
        totalClasses: 0,
        totalPersonnel: 0,
        rapportsParAnnee: {} as { [key: string]: number },
        provincesRepresentees: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const telephone = localStorage.getItem('telephone');
        const password = localStorage.getItem('password');

        if (!telephone || !password) {
            navigate('/signin');
        }
    }, [navigate]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const statsData = await rapportActiviteService.getRapportStats();
                setStats(statsData);
            } catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
                toast.error('Erreur lors du chargement des statistiques');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Chargement des statistiques...</div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats 
                    title="Total Rapports" 
                    total={stats.totalRapports.toString()} 
                    rate={`${stats.provincesRepresentees} provinces`}
                    levelUp
                >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                            fill=""
                        />
                        <path
                            d="M8 12H16V14H8V12ZM8 16H12V18H8V16Z"
                            fill=""
                        />
                    </svg>
                </CardDataStats>
                
                <CardDataStats 
                    title="Total Effectifs" 
                    total={stats.totalEffectifs.toLocaleString()} 
                    rate="Élèves inscrits"
                    levelUp
                >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 21H5V3H13V8H19V21ZM7 12H17V14H7V12ZM7 16H13V18H7V16Z"
                            fill=""
                        />
                        <path
                            d="M8 12H16V14H8V12ZM8 16H12V18H8V16Z"
                            fill=""
                        />
                    </svg>
                </CardDataStats>
                
                <CardDataStats 
                    title="Total Écoles" 
                    total={stats.totalEcoles.toLocaleString()} 
                    rate={`${stats.totalClasses} classes`}
                    levelUp
                >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"
                            fill=""
                        />
                        <path
                            d="M12 7L5 11L12 15L19 11L12 7ZM12 9.18L16 11.18L12 13.18L8 11.18L12 9.18Z"
                            fill=""
                        />
                    </svg>
                </CardDataStats>
                
                <CardDataStats 
                    title="Total Personnel" 
                    total={stats.totalPersonnel.toLocaleString()} 
                    rate="Enseignants & Admin"
                    levelUp
                >
                    <svg
                        className="fill-primary dark:fill-white"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16 4C16 5.1 15.1 6 14 6C12.9 6 12 5.1 12 4C12 2.9 12.9 2 14 2C15.1 2 16 2.9 16 4ZM20 7V10H22V7C22 5.9 21.1 5 20 5H18V7H20ZM6 6C7.1 6 8 5.1 8 4C8 2.9 7.1 2 6 2C4.9 2 4 2.9 4 4C4 5.1 4.9 6 6 6ZM6 8C4.9 8 4 8.9 4 10V12H8V10C8 8.9 7.1 8 6 8ZM14 8C12.9 8 12 8.9 12 10V12H16V10C16 8.9 15.1 8 14 8ZM22 12H20V15H22V12ZM2 15V17C2 18.1 2.9 19 4 19H6V17H4V15H2ZM18 15V19H20C21.1 19 22 18.1 22 17V15H20ZM8 17H10V19H8V17ZM12 17H14V19H12V17ZM16 17H18V19H16V17Z"
                            fill=""
                        />
                    </svg>
                </CardDataStats>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne />
                <ChartTwo />
                <ChartThree />
                <ChartFive />
                <ChartFour />
            </div>
        </>
    );
};

export default TableauBord;





