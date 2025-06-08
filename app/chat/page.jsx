'use client';
import { useState, useEffect, useRef } from 'react';
import "../globals.css"
import {
  Menu,
  X,
  History,
} from 'lucide-react';
import ChatInput from '@/components/ChatInput/ChatInput';
import { chat, get_conversations, get_messages } from '../../backend/api.js';
import { encryption } from '../../backend/encryption.js';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import Image from 'next/image';
import logo from '../../public/images/logo.png';
import FixedSidebar from '@/components/Fixed-Sidebar/FixedSidebar';
import NavbarFix from '@/components/NavbarFix/NavbarFix';
import modelIcons from '@/components/modelIcons';
import getTimeAgo from '@/utils/getTimeAgo';
import Notification from '../components/Notification';
import convertTime from '@/utils/ConverTime';
import handleCopy from "@/utils/handleCopy"
import modelNames from '@/utils/modelNames';
import modelBackgrounds from '@/utils/modelBackgrounds';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([]);
  const [token, setToken] = useState(null);
  const [name, setName] = useState(null);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(1);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const get_history = async () => {
    try {
      setIsLoading(true);
      const response = await get_conversations(20, 1);
      console.log('Raw History response:', response);

      if (response) {
        let conversations = [];
        if (Array.isArray(response)) {
          conversations = response;
        } else if (response.data && Array.isArray(response.data)) {
          conversations = response.data;
        } else {
          console.warn('Unexpected response format, treating as empty array:', response);
          conversations = [];
        }

        const validConversations = conversations.filter(
          (chat) => chat && (chat.id || chat.title || chat.time)
        );

        setHistory(validConversations);
      } else {
        throw new Error('هیچ پاسخی از API دریافت نشد');
      }
    } catch (error) {
      console.error('خطا در دریافت تاریخچه:', error);
      addNotification(`خطا در بارگذاری تاریخچه: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const get_messagess = async () => {
    if (selectedHistoryId) {
      const response = await get_messages(selectedHistoryId, 20, 1);
      return response;
    }
    return null;
  };
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedHistoryId) {
        try {
          setIsLoading(true);
          const response = await get_messagess();
          console.log('Messages response:', response);

          if (response && Array.isArray(response)) {
            const formattedMessages = response.map((msg) => ({
              sender: msg.sender === 'me' ? 'user' : 'ai',
              text: msg.text || 'پیام خالی',
              image: msg.image,
              model: msg.model || selectedModel,
              time: convertTime(msg.time)
            }));
            setChats(formattedMessages);

            // به‌روزرسانی selectedModel بر اساس مدل اولین پیام AI (یا اولین پیام اگر هیچ پیام AI وجود نداشت)
            const firstAIMessage = formattedMessages.find((msg) => msg.sender === 'ai');
            const firstMessageWithModel = formattedMessages.find((msg) => msg.model);
            if (firstAIMessage && firstAIMessage.model) {
              setSelectedModel(firstAIMessage.model);
            } else if (firstMessageWithModel && firstMessageWithModel.model) {
              setSelectedModel(firstMessageWithModel.model);
            } else {
              setSelectedModel(1); // مدل پیش‌فرض در صورتی که مدل مشخص نشده باشد
            }

            // به‌روزرسانی conversationId
            setConversationId(selectedHistoryId);
          } else {
            throw new Error('فرمت داده‌های دریافتی نامعتبر است');
          }
        } catch (error) {
          console.error('خطا در لود پیام‌ها:', error);
          addNotification(`خطا در بارگذاری پیام‌ها: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMessages();
  }, [selectedHistoryId]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const addNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 10000);
  };
  <handleCopy/>
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
      setName(storedName);
      encryption.token = storedToken;
      get_history();
    }
  }, [router]);
  useEffect(() => {
    scrollToBottom();
  }, [chats]);
  const typeWriter = (text, onComplete) => {
    let index = 0;
    setIsTyping(true);
    setTypingText('');
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypingText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete(text);
      }
    }, 12);
  };
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
  const handleModelSelect = async (model) => {
    setSelectedModel(model);
    setChats([]); // پاک کردن چت‌های قبلی
    setSelectedHistoryId(null);
    setConversationId(null); // ریست کردن conversationId برای ایجاد چت جدید
    addNotification(`مدل به ${modelNames[model]} تغییر کرد`);

    // ایجاد چت جدید با مدل انتخاب‌شده و ارسال پیام پیش‌فرض
    try {
      const defaultMessage = `شروع چت جدید با مدل ${modelNames[model]}`; // پیام پیش‌فرض
      const response = await chat(model, defaultMessage, null); // فراخوانی API با پیام پیش‌فرض
      const newConversationId = response?.message?.conversation_id;
      if (newConversationId) {
        setConversationId(newConversationId);
        await get_history(); // به‌روزرسانی تاریخچه
      } else {
        throw new Error('شناسه چت جدید دریافت نشد');
      }
    } catch (error) {
      console.error('خطا در ایجاد چت جدید:', error);
      addNotification(`خطا در ایجاد چت جدید: ${error.message}`);
    }
  };
  return (
    <div className="flex">
      <NavbarFix name={name} />
      <FixedSidebar/>
      <div
        className={`fixed top-0 ${isOpen ? 'right-0' : '-right-64'} border-r border-gray-700 sidebar h-full overflow-y-auto md:w-[30%] lg:w-[30%] xl:!w-[17.5%] w-64 bg-gray-800 text-white !lgBetweenXl_sidebar transition-all duration-300 z-50 md:left-0 md:right-auto md:translate-x-0`}
      >
        <div className="font-bold flex items-center justify-between p-4">
          <div className="flex flex-col items-center gap-x-2">
            <button className="flex text-white text-lg" onClick={toggleSidebar}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
              <Image src={logo} alt="logo" />
            </button>
          </div>
        </div>
        <ul className="p-2 space-y-4">
          <li className="relative cursor-pointer flex justify-between items-center hover:text-gray-300">
          </li>
            <ul className="mt-1 space-y-2 rounded-md p-2 z-50">
              <li
                className="p-3 cursor-pointer border-x-4 border-gray-300 bg-[var(--primary-color)] flex gap-x-1 justify-start items-center rounded"
                onClick={() => handleModelSelect(1)}
              >
                <div className="bg-gray-300 ml-1 rounded-full p-2">
                  {modelIcons[1]}
                </div>
                هوشیار (عمومی)
              </li>
              <li
                className="p-3 cursor-pointer border-x-4 border-gray-300 bg-[var(--primary-color)] flex gap-x-1 items-center rounded"
                onClick={() => handleModelSelect(2)}
              >
                <div className="bg-gray-300 ml-1 rounded-full p-2">
                  {modelIcons[2]}
                </div>
                هوشیار (برنامه نویسی)
              </li>
              <li
                className="p-3 cursor-pointer border-x-4 border-gray-300 bg-[var(--primary-color)] flex gap-x-1 items-center rounded"
                onClick={() => handleModelSelect(3)}
              >
                <div className="bg-gray-300 ml-1 rounded-full p-2">
                  {modelIcons[3]}
                </div>
                هوشیار (تصویر سازی)
              </li>
            </ul>
        </ul>
        <div className="pb-[100px]">
          <div className="border-t px-4 py-3 text-lg flex gap-x-2 items-center border-gray-700 font-bold">
            <History color='#007bff' />
            تاریخچه
          </div>
          {history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 border-b-2 hover:border-b-0 border-b-gray-700 mr-4 ml-5 mb-2 hover:border-x-4 border-gray-300 cursor-pointer hover:rounded hover:bg-[var(--primary-color)]"
                onClick={() => setSelectedHistoryId(item.id)}
              >
                <span>{item.title || 'بدون عنوان'}</span>
                <div className="text-xs text-gray-400 mt-2">{getTimeAgo(convertTime(item.time))}</div>
              </div>
            ))
          ) : (
            <div className="px-4 my-2 py-2 text-gray-400">هیچ تاریخچه‌ای یافت نشد</div>
          )}
        </div>
      </div>
      <div className="flex-1 max-w-[1200px] m-auto text-center min-h-screen flex flex-col justify-between">
        <div>
          <div className="md:hidden p-4 shadow flex justify-end items-center">
            <button onClick={toggleSidebar}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="mt-[100px] md:mt-[70px] px-4">
            <h1 className="text-2xl font-bold mt-[100px]">
              در چه <span className="text-[var(--primary-color)]">زمینه</span> ای می‌توانم{' '}
              <span className="text-[var(--primary-color)]">کمک</span> کنم؟
            </h1>
            <div className="chat-container overflow-y-auto p-10">
              {chats
                .concat(
                  isTyping && selectedModel !== 3
                    ? [{ sender: 'ai-typing', text: typingText + (isTyping ? '|' : ''), model: selectedModel, time: new Date().toISOString() }]
                    : []
                )
                .filter((chat) => chat && (chat.text || chat.image) && (chat.text?.trim() !== '' || chat.image))
                .map((chat, index) => (
                  <div
                    key={index}
                    className={`message m-[10px] border-2 border-indigo-900 p-[10px] max-w-[70%] rounded-lg flex items-start gap-x-2 ${
                      chat.sender === 'user'
                        ? 'user-message bg-[#007bff] text-white ml-auto text-right'
                        : `ai-message ${modelBackgrounds[chat.model || selectedModel]} my-5 text-base/8 px-4 text-right text-white`
                    }`}
                    style={{ display: 'block', width: 'fit-content' }}
                  >
                    {chat.sender !== 'user' && (
                      <span className="mt-1">{modelIcons[chat.model || selectedModel]}</span>
                    )}
                    <div>
                      {chat.image && (
                        <Image
                          src={chat.image}
                          alt="Generated by هوشیار (تصویرسازی)"
                          width={500}
                          height={500}
                          className="max-w-full h-auto rounded-lg mb-2"
                        />
                      )}
                      {chat.text && chat.text.trim() !== '' && (
                        <ReactMarkdown
                          rehypePlugins={[rehypeRaw, rehypeHighlight]}
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              return inline ? (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              ) : (
                                <pre
                                  className="text-white p-4 rounded-lg my-5 overflow-x-auto"
                                  style={{ backgroundColor: '#202020', color: 'white', textAlign: 'left', maxWidth: '100%' }}
                                >
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              );
                            },
                          }}
                        >
                          {chat.text}
                        </ReactMarkdown>
                      )}
                      <div className="text-xs text-gray-400 mt-1">{getTimeAgo(convertTime(chat.time))}</div>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <div className="overflow-y-auto pb-24">
          <ChatInput
            chats={chats}
            setChats={setChats}
            input={input}
            setInput={setInput}
            typeWriter={typeWriter}
            isTyping={isTyping}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            selectedModel={selectedModel}
            conversationId={conversationId}
            setConversationId={setConversationId}
          />
        </div>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            onClose={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
          />
        ))}
        <style jsx>{`
          .ai-message::after {
            content: '|';
            animation: blink 0.7s step-end infinite;
            display: ${isTyping && selectedModel !== 3 ? 'inline' : 'none'};
          }
          @keyframes blink {
            50% {
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}