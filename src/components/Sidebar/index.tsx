import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/icon/Logo-gouv_MINED-NC_Blanc.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  const navigate = useNavigate();
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const telephone = localStorage.getItem('telephone');
    const password = localStorage.getItem('password');

    setData(JSON.parse(localStorage.getItem('data') || '{}'));

    if (!telephone || !password) {
      navigate('/signin');
    }
  }, [navigate]);

  // Log pour voir le rôle
  useEffect(() => {
    console.log('🔍 Sidebar - Role de l\'utilisateur:', data.role);
    console.log('🔍 Sidebar - Données complètes:', data);
  }, [data]);

  useEffect(() => {
    const telephone = localStorage.getItem('telephone');
    const password = localStorage.getItem('password');

    if (!telephone || !password) {
      navigate('/signin');
    }

  }, [data]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img className='w-46' src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/' || pathname.includes('dashboard')
                }
              >
                {(_handleClick, _open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/tableaubord"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2  text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/' ||
                          pathname.includes('tableaubord')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          />
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          />
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          />
                        </svg>
                        Dashboard
                      </NavLink>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Utilisateurs --> */}
              <li>
                {
                  (data.role === "admin" || data.role === "Administrateur") ? <NavLink
                    to="/users"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-xs  text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('users') && 'bg-graydark dark:bg-meta-4'
                      }`}
                  >
                    <svg
                      className="fill-primary dark:fill-white"
                      width="22"
                      height="18"
                      viewBox="0 0 22 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                        fill="#fff"
                      />
                      <path
                        d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                        fill="#fff"
                      />
                      <path
                        d="M15.8124 10.9719C17.6687 10.9719 19.1468 12.4156 19.1468 14.2375C19.1468 15.9281 17.6687 17.3719 15.8124 17.3719C13.9905 17.3719 12.478 15.9281 12.478 14.2375C12.478 12.4156 13.9905 10.9719 15.8124 10.9719ZM15.8124 15.9719C16.8093 15.9719 17.5999 15.2156 17.5999 14.2531C17.5999 13.2906 16.8093 12.5344 15.8124 12.5344C14.8155 12.5344 14.0249 13.2906 14.0249 14.2531C14.0249 15.2156 14.8155 15.9719 15.8124 15.9719Z"
                        fill="#fff"
                      />
                      <path
                        d="M7.18418 9.6875C9.31543 9.6875 11.0686 11.3719 11.0686 13.4688C11.0686 15.5656 9.31543 17.25 7.18418 17.25C5.05293 17.25 3.2998 15.5656 3.2998 13.4688C3.2998 11.3719 5.05293 9.6875 7.18418 9.6875ZM7.18418 14.6875C8.45605 14.6875 9.52168 13.6906 9.52168 12.4531C9.52168 11.2156 8.49043 10.2188 7.18418 10.2188C5.87793 10.2188 4.84668 11.2156 4.84668 12.4531C4.84668 13.6906 5.9123 14.6875 7.18418 14.6875Z"
                        fill="#fff"
                      />
                    </svg>
                    Utilisateurs
                  </NavLink> : null
                }
              </li>

              {/* <!-- Menu Item Rapport d'activité --> */}
              <li>
                <NavLink
                  to="/rapport-activite"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-xs  text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('rapport-activite') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.25 0.75H3.75C2.92157 0.75 2.25 1.42157 2.25 2.25V15.75C2.25 16.5784 2.92157 17.25 3.75 17.25H14.25C15.0784 17.25 15.75 16.5784 15.75 15.75V2.25C15.75 1.42157 15.0784 0.75 14.25 0.75ZM14.25 15.75H3.75V2.25H14.25V15.75Z"
                      fill=""
                    />
                    <path
                      d="M5.25 4.5H12.75V6H5.25V4.5Z"
                      fill=""
                    />
                    <path
                      d="M5.25 7.5H12.75V9H5.25V7.5Z"
                      fill=""
                    />
                    <path
                      d="M5.25 10.5H12.75V12H5.25V10.5Z"
                      fill=""
                    />
                    <path
                      d="M5.25 13.5H9.75V15H5.25V13.5Z"
                      fill=""
                    />
                  </svg>
                  Rapport d'activité
                </NavLink>
              </li>

              {/* <!-- Menu Item Fiche Auto-évaluation --> */}
              <li>
                <NavLink
                  to="/fiche-auto-evaluation"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-xs  text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('fiche-auto-evaluation') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0.75C4.17157 0.75 0.25 4.67157 0.25 9.5C0.25 14.3284 4.17157 18.25 9 18.25C13.8284 18.25 17.75 14.3284 17.75 9.5C17.75 4.67157 13.8284 0.75 9 0.75ZM9 16.75C5.13401 16.75 2 13.616 2 9.75C2 5.88401 5.13401 2.75 9 2.75C12.866 2.75 16 5.88401 16 9.75C16 13.616 12.866 16.75 9 16.75Z"
                      fill=""
                    />
                    <path
                      d="M9 4.75C6.51472 4.75 4.5 6.76472 4.5 9.25C4.5 11.7353 6.51472 13.75 9 13.75C11.4853 13.75 13.5 11.7353 13.5 9.25C13.5 6.76472 11.4853 4.75 9 4.75ZM9 11.75C7.61929 11.75 6.5 10.6307 6.5 9.25C6.5 7.86929 7.61929 6.75 9 6.75C10.3807 6.75 11.5 7.86929 11.5 9.25C11.5 10.6307 10.3807 11.75 9 11.75Z"
                      fill=""
                    />
                  </svg>
                  Fiche Auto-évaluation
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
