import { Link } from 'react-router-dom';
import { Chat } from '../../types/chat';
import UserOne from '../../images/icon/bg-user1.jpg';

const chatData: Chat[] = [
  {
    avatar: UserOne,
    name: 'Ministre de l’Éducation Nationale',
    text: 'Réunion avec les conseillers prévue demain à 10h pour la révision des programmes scolaires.',
    time: 12,
    textCount: 5,
    color: '#10B981',
  },
  {
    avatar: UserOne,
    name: 'Secrétaire Général',
    text: 'Envoi des rapports trimestriels avant la fin de la semaine.',
    time: 20,
    textCount: 3,
    color: '#DC3545',
  },
  {
    avatar: UserOne,
    name: 'Conseiller Principal',
    text: 'Projet de réforme à soumettre pour discussion en réunion.',
    time: 30,
    textCount: 2,
    color: '#FFBA00',
  },
  {
    avatar: UserOne,
    name: 'Chef du Service Informatique',
    text: 'Mise à jour des systèmes prévue ce weekend. Veuillez sauvegarder vos données.',
    time: 45,
    textCount: 0,
    color: '#10B981',
  },
  {
    avatar: UserOne,
    name: 'Inspecteur Général de l’Enseignement',
    text: 'Inspection des écoles dans la région ouest prévue la semaine prochaine.',
    time: 60,
    textCount: 4,
    color: '#10B981',
  },
  {
    avatar: UserOne,
    name: 'Chef du Service Pédagogique',
    text: 'Les nouveaux manuels scolaires sont disponibles. Distribution commencera demain.',
    time: 78,
    textCount: 2,
    color: '#FFBA00',
  },
  {
    avatar: UserOne,
    name: 'Conseiller en Digitalisation',
    text: 'Préparation du rapport sur la transformation numérique en cours.',
    time: 90,
    textCount: 1,
    color: '#10B981',
  },
  {
    avatar: UserOne,
    name: 'Chef du Service RH',
    text: 'Rappel : Envoyez vos évaluations annuelles avant vendredi.',
    time: 105,
    textCount: 1,
    color: '#FFBA00',
  },
  {
    avatar: UserOne,
    name: 'Chef du Service Communication',
    text: 'Nouvelle campagne de communication interne à valider pour le mois prochain.',
    time: 120,
    textCount: 2,
    color: '#DC3545',
  },
];



const ChatCard = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark ">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Annonces
      </h4>

      <div>
        {chatData.map((chat, key) => (
          <Link
            to="/"
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <img className='rounded-full' src={chat.avatar} alt="User" />
              <span
                className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white"
                style={{backgroundColor: chat.color}}
              ></span>
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {chat.text}
                  </span>
                  <span className="text-xs"> . {chat.time} min</span>
                </p>
              </div>
              {chat.textCount !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {' '}
                    {chat.textCount}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
