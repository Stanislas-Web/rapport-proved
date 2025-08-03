import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableThree from '../components/Tables/TableThree';

const Directions = () => {
    return (
        <>
            <div className="mx-auto max-w-270">
                <Breadcrumb pageName="Directions" />
                <div className='flex  md:justify-end  mb-10'>

                    <Link
                        to="#"
                        className="inline-flex items-center justify-center gap-2.5 bg-black py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
                                d="M9 0C7.344 0 6 1.344 6 3C6 4.656 7.344 6 9 6C10.656 6 12 4.656 12 3C12 1.344 10.656 0 9 0ZM3 3C1.344 3 0 4.344 0 6C0 7.656 1.344 9 3 9C4.656 9 6 7.656 6 6C6 4.344 4.656 3 3 3ZM15 3C13.344 3 12 4.344 12 6C12 7.656 13.344 9 15 9C16.656 9 18 7.656 18 6C18 4.344 16.656 3 15 3ZM3 10.5C1.344 10.5 0 11.844 0 13.5V15C0 15.828 0.672 16.5 1.5 16.5H6.5C7.328 16.5 8 15.828 8 15V13.5C8 11.844 6.656 10.5 5 10.5H3ZM13 10.5C12.172 10.5 11.5 11.172 11.5 12C11.5 12.828 12.172 13.5 13 13.5H15C15.828 13.5 16.5 12.828 16.5 12C16.5 11.172 15.828 10.5 15 10.5H13ZM9.707 9.293L7.707 11.293C7.316 11.684 6.684 11.684 6.293 11.293L5.293 10.293C4.902 9.902 4.902 9.27 5.293 8.879C5.684 8.488 6.316 8.488 6.707 8.879L7.293 9.465L8.707 8.051C9.098 7.66 9.73 7.66 10.121 8.051C10.512 8.441 10.512 9.074 10.121 9.465L9.707 9.293Z"
                                fill=""
                            />
                        </svg>
                        Créer une direction
                    </Link>
                </div>
                <TableThree />
            </div>
        </>
    );
};

export default Directions;
