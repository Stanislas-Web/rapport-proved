import React, { useState, useRef, useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import UsersService from '../../services/users/usersservice';
import Webcam from "react-webcam";
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';

function DropFile({ title }: { title: string }) {
  const { user } = useSelector((state: RootState) => state.users);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploadMode, setIsUploadMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCapturedImage(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setCapturedImage(null);
  };

  const handleImageUpload = async () => {
    setLoading(true);
    try {
      let fileToUpload: File;
      if (capturedImage) {
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        fileToUpload = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
      } else if (selectedFile) {
        fileToUpload = selectedFile;
      } else {
        throw new Error("No image to upload");
      }

      const imageUploadResult = await UsersService.uploadImage(`users/${user.id}/upload-photo`, fileToUpload);
      console.log('Image upload successful!', imageUploadResult);
      // return imageUploadResult.photoUrl;
      navigate('/users');
    } catch (err) {
      console.error('Erreur lors de l\'upload de l\'image:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setSelectedFile(null);
    }
  }, [webcamRef]);

  return (
    <div>
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setIsUploadMode(true)}
          className={`px-4 py-2 rounded ${isUploadMode ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Upload
        </button>
        <button
          onClick={() => setIsUploadMode(false)}
          className={`px-4 py-2 rounded ${!isUploadMode ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Capture
        </button>
      </div>

      {isUploadMode ? (

        <>
          <div className="min-h-[30vh] border-2 border-dashed text-black dark:text-white rounded-md flex flex-col justify-center items-center bg-gray py-4 px-4 dark:bg-meta-4 p-4 cursor-pointer">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                {/* Original Upload Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                    fill="#3C50E0"
                  />
                </svg>
                {/* SVG upload icon */}
              </span>
            </button>
            <p className="font-normal md:text-xs text-xs text-center">{title}</p>
            {selectedFile && (
              <div className="flex gap-2 mt-2">
                <p className="text-xs md:text-lg">
                  Fichier sélectionné :{' '}
                  <span className="font-bold text-xs">{selectedFile.name}</span>
                </p>
                <div onClick={handleClear}>
                  <MdDelete size={25} />
                </div>
              </div>
            )}
          </div>
          <div className='w-full mt-5'>
            <button
              onClick={handleImageUpload}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-all"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                'Enregistrer la photo'
              )}
            </button>

          </div>


        </>





      ) : (
        <div className="container">
          {capturedImage ? (
            <div className="flex flex-col items-center">
              <img src={capturedImage} alt="Captured" width={600} height={600} className="rounded-md shadow-md" />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setCapturedImage(null)}
                  className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-all"
                >
                  Reessayer
                </button>
                <button
                  onClick={handleImageUpload}
                  className="px-6 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    'Enregistrer la photo'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <Webcam height={600} width={600} ref={webcamRef} />
          )}
          {!capturedImage && (
            <button
              onClick={capture}
              className="mt-5 px-6 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-all"
            >
              Capture photo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DropFile;
