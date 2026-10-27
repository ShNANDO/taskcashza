import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, HelpCircle, MessageSquare, Mail, ChevronDown, ChevronUp,
  FileText, ShieldAlert, Sparkles, Send, User, Bot, AlertCircle
} from 'lucide-react';
import { FAQ_ITEMS } from '../constants';
import Input from '../components/Input';
import Modal from '../components/Modal';
import PrimaryButton from '../components/PrimaryButton';
import SectionTitle from '../components/SectionTitle';

interface HelpScreenProps {
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  userName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function HelpScreen({ addToast, userName = 'Member' }: HelpScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'trust' | 'withdrawal' | 'regional' | 'companies' | 'general'>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq_01'); // Default open first

  // Interactive Live Chat simulation states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => [
    {
      id: 'msg_01',
      sender: 'bot',
      text: `Hello ${userName}! Welcome to NETFLIXPAYHUB Support. How can I assist you with your movie screenings or Box Office withdrawals today?`,
      time: 'Just now',
    },
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Filtered FAQs based on Search & Category
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleSendLiveMessage = () => {
    if (!chatMessageInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: chatMessageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    const prompt = chatMessageInput;
    setChatMessageInput('');

    // Trigger automated bot replies with realistic response timers
    setIsBotTyping(true);
    setTimeout(() => {
      let botResponse = '';
      const lowercasePrompt = prompt.toLowerCase();

      if (lowercasePrompt.includes('withdrawal') || lowercasePrompt.includes('payout') || lowercasePrompt.includes('liquidate')) {
        botResponse = 'Withdrawals are completed via localized research clearing houses. Standard transfers take 2-5 business days. If you are in a hurry, you can click the "⚡ ACCELERATE WITHDRAWAL" booster bar inside the Withdrawal history list to approve the payout immediately!';
      } else if (lowercasePrompt.includes('score') || lowercasePrompt.includes('trust') || lowercasePrompt.includes('quality')) {
        botResponse = 'Your Quality Score is currently building. You can improve it by completing surveys consistently and avoiding rapid question-skipping. Higher scores unlock bigger surveys!';
      } else if (lowercasePrompt.includes('error') || lowercasePrompt.includes('fail') || lowercasePrompt.includes('broken')) {
        botResponse = 'We apologize for any technical delays. If you encounter an issue, resetting your in-app local data via Profile > Reset Demo Data can resolve caching synchronization errors instantly.';
      } else {
        botResponse = 'Thank you for your inquiry. Our regional clearing bridges are operating at 100% capacity. If you need immediate assistance with an account hold, please specify "withdrawal" or "quality score".';
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 1200);
  };

  return (
    <div id="help_screen_scroll_area" className="flex-1 overflow-y-auto px-4 pb-32 pt-2 text-zinc-100">
      <div id="help_page_header" className="text-center mb-5 mt-1">
        <h2 className="text-base font-extrabold text-white tracking-tight uppercase">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-zinc-400 font-medium">
          Find answers to common questions
        </p>
      </div>

      {/* Modern category submenus */}
      <div id="help_tabs" className="flex gap-2.5 mb-5 border-b border-zinc-800/80 pb-3 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'all', label: '❓ FAQ' },
          { id: 'trust', label: '🛡️ Critic Score' },
          { id: 'withdrawal', label: '💳 Payouts' },
          { id: 'regional', label: '🌍 Regional' },
          { id: 'companies', label: '🏢 Studios' },
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              id={`category_tab_${tab.id}`}
              onClick={() => {
                setActiveCategory(tab.id as any);
                setExpandedFaqId(null);
              }}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all
                ${
                  isActive
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input bar */}
      <div id="faq_search_wrapper" className="relative mb-5">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
          <Search size={16} />
        </div>
        <input
          id="faq_search_input"
          type="text"
          placeholder="Search topics, questions or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-semibold text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-red-500 transition-colors"
        />
      </div>

      {/* Expandable Accordion List */}
      <div id="faq_accordion_list" className="flex flex-col gap-3">
        {filteredFaqs.length === 0 ? (
          <div id="no_faqs_panel" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center text-zinc-400 text-xs font-semibold">
            No FAQ articles match your search parameters.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                id={`faq_accordion_${faq.id}`}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden transition-all duration-200"
              >
                <button
                  id={`btn_faq_toggle_${faq.id}`}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-zinc-850"
                >
                  <span className="text-xs font-bold text-zinc-100 tracking-wide leading-relaxed">
                    {faq.question}
                  </span>
                  <span className="text-zinc-400 shrink-0 ml-4">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`faq_answer_container_${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-zinc-800/80 bg-zinc-950/50"
                    >
                      <p className="p-5 text-xs text-zinc-300 font-normal leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Support and contact options */}
      <SectionTitle>Still Have Questions?</SectionTitle>

      <div id="support_channels" className="grid grid-cols-1 gap-4">
        {/* Live Support Channel card */}
        <div
          id="support_live_chat_card"
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-red-950/40 text-red-400 border border-red-900/40 flex items-center justify-center shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Interactive Live Chat
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Connect with our simulated regional support agent for instant, high-speed assistance.
              </p>
            </div>
          </div>

          <PrimaryButton
            id="btn_open_live_chat"
            className="mt-4 bg-red-600 hover:bg-red-700 cursor-pointer"
            onClick={() => setIsChatOpen(true)}
            icon={<Sparkles size={14} />}
          >
            Contact Support
          </PrimaryButton>
        </div>

        {/* Email support card */}
        <div
          id="support_email_card"
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Email Ticketing</h4>
              <span className="text-[10px] font-mono font-semibold text-zinc-400 block mt-0.5">
                support@netflixpayhub.com
              </span>
            </div>
          </div>
          <button
            id="btn_copy_support_email"
            onClick={() => {
              addToast('Support email address copied to clipboard!', 'success');
            }}
            className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-900/40 px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Policy footer */}
      <div id="help_legal_footer" className="mt-8 text-center flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-200">
            Privacy Policy
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-200">
            Terms of Service
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-zinc-200">
            About Us
          </span>
        </div>
        <p className="text-[10px] font-medium text-zinc-500">
          © 2026 NETFLIXPAYHUB Guild. All rights reserved.
        </p>
      </div>

      {/* MOCK LIVE SUPPORT CHAT MODAL */}
      <Modal
        id="live_support_chat_modal"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title="Live Support Chat"
        size="md"
      >
        <div id="chat_modal_container" className="flex flex-col h-[50vh]">
          {/* Chat scrolling history window */}
          <div id="chat_messages_window" className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 mb-4">
            {chatHistory.map((msg) => {
              const isMe = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  id={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isMe ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {isMe ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div
                    className={`
                      p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs
                      ${
                        isMe
                          ? 'bg-red-600 text-white rounded-tr-none'
                          : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                      }
                    `}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[8px] font-bold block mt-1 text-right ${isMe ? 'text-red-100' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {isBotTyping && (
              <div id="bot_typing_indicator" className="flex gap-2.5 mr-auto items-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Bot size={13} />
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick replies prompts */}
          <div id="quick_prompts_row" className="flex gap-2 mb-3 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none shrink-0">
            {[
              'When will my withdrawal arrive?',
              'How can I increase my quality score?',
              'My app is lagging, can I reset?',
            ].map((prompt, index) => (
              <button
                key={index}
                id={`quick_prompt_${index}`}
                onClick={() => {
                  setChatMessageInput(prompt);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 rounded-full text-[10px] font-bold cursor-pointer transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input line */}
          <div id="chat_input_row" className="flex gap-2.5 items-center mt-auto shrink-0">
            <input
              id="chat_text_input"
              type="text"
              placeholder="Type your question..."
              value={chatMessageInput}
              onChange={(e) => setChatMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendLiveMessage();
              }}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-red-500 transition-all"
            />
            <button
              id="btn_chat_send"
              onClick={handleSendLiveMessage}
              disabled={!chatMessageInput.trim()}
              className="w-10 h-10 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
