import Link from "next/link";
import { UserRound , Pencil , Share} from "lucide-react";
import Avatar from "../Avatar/Avatar.jsx"
import {useEffect, useState} from "react"
import Modal from "../Modal/Modal.jsx";
import { toast } from "react-toastify";
export default function NavbarFix({name}) {
  const [currentURL, setCurrentURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copyText, setCopyText] = useState("");
  const handleCopy = () => {
    const text = currentURL;
    navigator.clipboard.writeText(text);
    toast.success("لینک کپی شد!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeButton: false,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };
  useEffect(() => {
    setCurrentURL(location.href);
  }, []);
  return (
    <nav className="fixed top-12 md:top-0 border-b border-gray-700 left-0 right-0 bg-gray-800 mdBetweenLg md:max-w-[82.5%]  sm:max-w-[90%] shadow-md">
      <ul className="flex justify-between items-center p-3">
        <div className="flex justify-between items-center">
          <h1>هوشیار: دیدگاهی برای توسعه!</h1>
        </div>
        <div className="flex justify-between items-center gap-x-2">  
          <div className="flex items-center gap-x-1" title="اشتراک گذاری" onClick={handleCopy}>
            <li className="rounded-lg p-2.5 border-2 border-gray-700 shadow-lg">
              <Share size="20px" color="#dddddd" />
              {showModal && (
                <Modal text={copyText} onClose={() => setShowModal(false)} />
              )}
            </li>
          </div>
          <Link href="/chat" target="_blank" className="flex items-center gap-x-1" title="صفحه جدید">
            <li className="rounded-lg p-2.5 border-2 border-gray-700 shadow-lg">
              <Pencil size="20px" color="#dddddd" />
            </li>
          </Link>
          <div className="rounded-lg p-1 border-2 border-gray-700 shadow-lg flex items-center gap-x-1" title={`${name} بزرگوار، امیدوارم تجربه لذت بخشی در هوشیار داشته باشی :)`} >
          <Avatar name={name} />
          <span className="text-[12px]">{name}</span>
          </div>
        </div>
      </ul>
    </nav>
  )
}