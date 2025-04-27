'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronUp, Blocks, UsersRound, MessageSquareText , Headset , History, UserRound} from "lucide-react";
import ChatInput from "./components/ChatInput/ChatInput";
import { chat, get_conversations, get_messages, signup , signin } from '../backend/api.js';
import { encryption } from '../backend/encryption.js';
import { useRouter } from "next/navigation"; 
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [messages, setMessages] = useState([]);
  const [showDiv, setShowDiv] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [token, setToken] = useState(null);
  const [name, setName] = useState(null);
  // const [text , setText] = useState([])
  const [chats, setChats] = useState([]);
  const router = useRouter();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    if (!storedToken) {
      router.push("/login");
    }else{
      setToken(storedToken);
      setName(storedName);
      encryption.token = storedToken;
    }
  }, [chats , router]); // هر بار پیام جدید اومد، اسکرول کن پایین


  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 ${isOpen ? 'right-0' : '-right-64'} sidebar h-full overflow-y-auto w-64 bg-gray-800 text-white transition-all duration-300 z-50 md:left-0 md:right-auto md:translate-x-0`}
      >
        <div className="p-4 font-bold border-b border-gray-700 flex items-center justify-between">
          <div className="flex flex-col gap-y-2 items-start">
            <span className="text-lg">گفتگو با هوش مصنوعی</span>
            <div className="flex items-center gap-x-1">
              <UserRound className="bg-gray-200 rounded-full" size="30px" color="#000000" />
              <span>{name}</span>
            </div>
          </div>
          <div>
          <button className="md:hidden text-white text-lg" onClick={toggleSidebar}>
            <X size={24} />
          </button>
          </div>
        </div>
        <ul className="p-4 space-y-4">
          <li
            className="relative cursor-pointer flex justify-between items-center hover:text-gray-300"
            onClick={toggleDropdown}
          >
            <span>انتخاب هوش مصنوعی</span>
            {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </li>
          {dropdownOpen && (
            <ul className="mt-1 ml-4 space-y-2 bg-gray-500 rounded-md p-2 z-50">
              <li className="p-1 cursor-pointer hover:bg-[var(--primary-color)] flex gap-x-1 items-center rounded">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                  <path d="M45.403,25.562c-0.506-1.89-1.518-3.553-2.906-4.862c1.134-2.665,0.963-5.724-0.487-8.237	c-1.391-2.408-3.636-4.131-6.322-4.851c-1.891-0.506-3.839-0.462-5.669,0.088C28.276,5.382,25.562,4,22.647,4	c-4.906,0-9.021,3.416-10.116,7.991c-0.01,0.001-0.019-0.003-0.029-0.002c-2.902,0.36-5.404,2.019-6.865,4.549	c-1.391,2.408-1.76,5.214-1.04,7.9c0.507,1.891,1.519,3.556,2.909,4.865c-1.134,2.666-0.97,5.714,0.484,8.234	c1.391,2.408,3.636,4.131,6.322,4.851c0.896,0.24,1.807,0.359,2.711,0.359c1.003,0,1.995-0.161,2.957-0.45	C21.722,44.619,24.425,46,27.353,46c4.911,0,9.028-3.422,10.12-8.003c2.88-0.35,5.431-2.006,6.891-4.535	C45.754,31.054,46.123,28.248,45.403,25.562z M35.17,9.543c2.171,0.581,3.984,1.974,5.107,3.919c1.049,1.817,1.243,4,0.569,5.967	c-0.099-0.062-0.193-0.131-0.294-0.19l-9.169-5.294c-0.312-0.179-0.698-0.177-1.01,0.006l-10.198,6.041l-0.052-4.607l8.663-5.001	C30.733,9.26,33,8.963,35.17,9.543z M29.737,22.195l0.062,5.504l-4.736,2.805l-4.799-2.699l-0.062-5.504l4.736-2.805L29.737,22.195z M14.235,14.412C14.235,9.773,18.009,6,22.647,6c2.109,0,4.092,0.916,5.458,2.488C28,8.544,27.891,8.591,27.787,8.651l-9.17,5.294	c-0.312,0.181-0.504,0.517-0.5,0.877l0.133,11.851l-4.015-2.258V14.412z M6.528,23.921c-0.581-2.17-0.282-4.438,0.841-6.383	c1.06-1.836,2.823-3.074,4.884-3.474c-0.004,0.116-0.018,0.23-0.018,0.348V25c0,0.361,0.195,0.694,0.51,0.872l10.329,5.81	L19.11,34.03l-8.662-5.002C8.502,27.905,7.11,26.092,6.528,23.921z M14.83,40.457c-2.171-0.581-3.984-1.974-5.107-3.919	c-1.053-1.824-1.249-4.001-0.573-5.97c0.101,0.063,0.196,0.133,0.299,0.193l9.169,5.294c0.154,0.089,0.327,0.134,0.5,0.134	c0.177,0,0.353-0.047,0.51-0.14l10.198-6.041l0.052,4.607l-8.663,5.001C19.269,40.741,17.001,41.04,14.83,40.457z M35.765,35.588	c0,4.639-3.773,8.412-8.412,8.412c-2.119,0-4.094-0.919-5.459-2.494c0.105-0.056,0.216-0.098,0.32-0.158l9.17-5.294	c0.312-0.181,0.504-0.517,0.5-0.877L31.75,23.327l4.015,2.258V35.588z M42.631,32.462c-1.056,1.83-2.84,3.086-4.884,3.483	c0.004-0.12,0.018-0.237,0.018-0.357V25c0-0.361-0.195-0.694-0.51-0.872l-10.329-5.81l3.964-2.348l8.662,5.002	c1.946,1.123,3.338,2.937,3.92,5.107C44.053,28.249,43.754,30.517,42.631,32.462z"></path>
                  </svg>
                </span>
              chatGPT
              </li>
              <li className="p-1 cursor-pointer hover:bg-[var(--primary-color)] flex gap-x-1 items-center rounded">
              <span><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
              <path d="M 10 4 C 13.148438 4.960938 16.300781 5.921875 19.445313 6.890625 C 19.441406 14.664063 19.453125 22.4375 19.441406 30.210938 C 16.382813 32.917969 13.339844 35.644531 10.289063 38.363281 C 17.746094 34.445313 25.199219 30.519531 32.65625 26.59375 C 30.585938 25.652344 28.515625 24.726563 26.445313 23.78125 C 25.054688 20.746094 23.652344 17.71875 22.257813 14.683594 C 29.171875 16.796875 36.085938 18.917969 43 21.039063 C 43 24.417969 43 27.796875 43 31.175781 C 35.132813 35.867188 27.257813 40.550781 19.390625 45.242188 C 16.261719 43.050781 13.132813 40.855469 10 38.664063 C 10 27.109375 10 15.554688 10 4 M 10 2 C 9.574219 2 9.15625 2.136719 8.808594 2.394531 C 8.300781 2.769531 8 3.367188 8 4 L 8 38.660156 C 8 39.316406 8.316406 39.925781 8.851563 40.300781 C 10.980469 41.789063 13.109375 43.28125 15.234375 44.773438 L 18.242188 46.882813 C 18.585938 47.121094 18.984375 47.242188 19.390625 47.242188 C 19.742188 47.242188 20.097656 47.148438 20.414063 46.960938 C 24.761719 44.367188 29.109375 41.777344 33.460938 39.1875 L 44.023438 32.894531 C 44.628906 32.535156 45 31.882813 45 31.175781 L 45 26.109375 L 44.996094 21.039063 C 44.996094 20.160156 44.425781 19.386719 43.585938 19.128906 L 39.003906 17.722656 C 33.617188 16.070313 28.226563 14.417969 22.839844 12.773438 C 22.644531 12.714844 22.449219 12.6875 22.253906 12.6875 C 21.972656 12.6875 21.699219 12.746094 21.445313 12.855469 C 21.445313 10.867188 21.445313 8.882813 21.445313 6.894531 C 21.445313 6.015625 20.875 5.242188 20.035156 4.980469 C 16.886719 4.011719 13.734375 3.046875 10.582031 2.089844 C 10.390625 2.027344 10.195313 2 10 2 Z M 21.441406 30.238281 C 21.441406 30.230469 21.441406 30.222656 21.441406 30.210938 C 21.445313 26.046875 21.445313 21.878906 21.445313 17.710938 C 21.695313 18.246094 21.941406 18.785156 22.191406 19.320313 C 23.003906 21.085938 23.816406 22.851563 24.628906 24.617188 C 24.828125 25.054688 25.179688 25.40625 25.617188 25.605469 C 26.445313 25.980469 27.273438 26.355469 28.101563 26.730469 L 26.457031 27.597656 C 24.785156 28.476563 23.113281 29.359375 21.441406 30.238281 Z"></path>
              </svg></span>
                bing
                </li>
              <li className="p-1 cursor-pointer hover:bg-[var(--primary-color)] flex gap-x-1 items-center rounded">
                <span>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                  <path d="M45.403,25.562c-0.506-1.89-1.518-3.553-2.906-4.862c1.134-2.665,0.963-5.724-0.487-8.237	c-1.391-2.408-3.636-4.131-6.322-4.851c-1.891-0.506-3.839-0.462-5.669,0.088C28.276,5.382,25.562,4,22.647,4	c-4.906,0-9.021,3.416-10.116,7.991c-0.01,0.001-0.019-0.003-0.029-0.002c-2.902,0.36-5.404,2.019-6.865,4.549	c-1.391,2.408-1.76,5.214-1.04,7.9c0.507,1.891,1.519,3.556,2.909,4.865c-1.134,2.666-0.97,5.714,0.484,8.234	c1.391,2.408,3.636,4.131,6.322,4.851c0.896,0.24,1.807,0.359,2.711,0.359c1.003,0,1.995-0.161,2.957-0.45	C21.722,44.619,24.425,46,27.353,46c4.911,0,9.028-3.422,10.12-8.003c2.88-0.35,5.431-2.006,6.891-4.535	C45.754,31.054,46.123,28.248,45.403,25.562z M35.17,9.543c2.171,0.581,3.984,1.974,5.107,3.919c1.049,1.817,1.243,4,0.569,5.967	c-0.099-0.062-0.193-0.131-0.294-0.19l-9.169-5.294c-0.312-0.179-0.698-0.177-1.01,0.006l-10.198,6.041l-0.052-4.607l8.663-5.001	C30.733,9.26,33,8.963,35.17,9.543z M29.737,22.195l0.062,5.504l-4.736,2.805l-4.799-2.699l-0.062-5.504l4.736-2.805L29.737,22.195z M14.235,14.412C14.235,9.773,18.009,6,22.647,6c2.109,0,4.092,0.916,5.458,2.488C28,8.544,27.891,8.591,27.787,8.651l-9.17,5.294	c-0.312,0.181-0.504,0.517-0.5,0.877l0.133,11.851l-4.015-2.258V14.412z M6.528,23.921c-0.581-2.17-0.282-4.438,0.841-6.383	c1.06-1.836,2.823-3.074,4.884-3.474c-0.004,0.116-0.018,0.23-0.018,0.348V25c0,0.361,0.195,0.694,0.51,0.872l10.329,5.81	L19.11,34.03l-8.662-5.002C8.502,27.905,7.11,26.092,6.528,23.921z M14.83,40.457c-2.171-0.581-3.984-1.974-5.107-3.919	c-1.053-1.824-1.249-4.001-0.573-5.97c0.101,0.063,0.196,0.133,0.299,0.193l9.169,5.294c0.154,0.089,0.327,0.134,0.5,0.134	c0.177,0,0.353-0.047,0.51-0.14l10.198-6.041l0.052,4.607l-8.663,5.001C19.269,40.741,17.001,41.04,14.83,40.457z M35.765,35.588	c0,4.639-3.773,8.412-8.412,8.412c-2.119,0-4.094-0.919-5.459-2.494c0.105-0.056,0.216-0.098,0.32-0.158l9.17-5.294	c0.312-0.181,0.504-0.517,0.5-0.877L31.75,23.327l4.015,2.258V35.588z M42.631,32.462c-1.056,1.83-2.84,3.086-4.884,3.483	c0.004-0.12,0.018-0.237,0.018-0.357V25c0-0.361-0.195-0.694-0.51-0.872l-10.329-5.81l3.964-2.348l8.662,5.002	c1.946,1.123,3.338,2.937,3.92,5.107C44.053,28.249,43.754,30.517,42.631,32.462z"></path>
                  </svg>
                </span>
                gemini
                </li>
            </ul>
          )}
          <li className="hover:bg-[var(--primary-color)] p-1 flex gap-x-1 items-center rounded cursor-pointer">
          <span><UsersRound /></span>
          درباره ما
          </li>
          <li className="hover:bg-[var(--primary-color)] p-1 flex gap-x-1 items-center rounded cursor-pointer">
            <span><Headset /></span>
            تماس با ما
          </li>
          <li className="hover:bg-[var(--primary-color)] p-1 flex gap-x-1 items-center rounded cursor-pointer">
            <span><Blocks /></span>
            شرایط استفاده
          </li>
          <Link href="/login">
            <li className="hover:bg-[var(--primary-color)] p-1 flex gap-x-1 items-center rounded cursor-pointer">
              <button className="flex cursor-pointer items-center gap-x-1" onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('name');
              }}>
                <span><UserRound /></span>
                {token == "" ? "حساب کاربری" : "خروج"}
              </button>
            </li>
          </Link>
        </ul>
        <div className="border-t p-4 text-lg flex gap-x-1 items-center border-gray-700 font-bold">
          <span><History /></span>
          تاریخچه
        </div>
        {[
          "یه عکس سگ برام بساز",
          "آموزشی",
          "نحوه زندگی کردن درست",
          "چرا باید غذا بخوریم",
          "آموزش جاوا اسکریپت",
          "حقوق برنامه نویسی",
          "هوش مصنوعی چیست",
          "کتاب به زمانبندی خدا اعتماد کن",
        ].map((text, i) => (
          <div key={i} className="px-4 my-2 py-2 cursor-pointer rounded hover:bg-[var(--primary-color)] mx-3">
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1200px] m-auto text-center min-h-screen flex flex-col justify-between">
        <div>
          <div className="md:hidden p-4 shadow flex justify-between items-center">
            <button onClick={toggleSidebar}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="mt-[100px] md:mt-[250px] px-4">
            <h1 className="text-2xl font-bold mb-4">
              در چه <span className="text-[var(--primary-color)]">زمینه</span> ای می توانم{" "}
              <span className="text-[var(--primary-color)]">کمک</span> کنم؟
            </h1>
            <div className="chat-container">
              {chats.map((chat, index) => (
                <div key={index} className={`message ${chat.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                  {chat.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-y-auto pb-24">
        <ChatInput onButtonClick={() => setShowDiv(true)} chats={chats} setChats={setChats}  input={input} setInput={setInput}/>
        </div>
      </div>
    </div>
  );
}
