import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, User, PhoneCall, Heart, HelpCircle, Loader2 } from "lucide-react";
import { WebsiteSettings } from "../types";

interface HelplineChatProps {
  settings: WebsiteSettings;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export default function HelplineChat({ settings }: HelplineChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pre-seed greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "model",
          text: `আসসালামু আলাইকুম! **${settings.websiteName || "YOUNG Style"}** এআই হেল্পলাইনে আপনাকে স্বাগতম। 

আমি আপনাকে কীভাবে সাহায্য করতে পারি? যেকোনো পোশাকের সাইজ, স্টক, অগ্রিম ডেলিভারি চার্জ বা কুপন কোড সম্পর্কে জানতে প্রশ্ন করুন! 😊`,
          timestamp: new Date()
        }
      ]);
    }
  }, [settings]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query) return;

    if (!textToSend) {
      setInputValue("");
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Map history for Gemini API
      const history = messages.slice(1).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/helpline/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: query,
          history
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: "model",
        text: data.text || "দুঃখিত, আমি ঠিক বুঝতে পারিনি। দয়া করে আবার প্রশ্ন করুন।",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Failed to chat with AI helpline", err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "model",
        text: "দুঃখিত, এই মুহূর্তে সার্ভারে কিছু ত্রুটি দেখা দিয়েছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন বা কাস্টমার সাপোর্টে সরাসরি কল করুন।",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* 1. Floating Round Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3.5 bg-slate-900 hover:bg-[#1877F2] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group relative"
          style={{ backgroundColor: settings.primaryColor }}
          id="ai-helpline-trigger"
        >
          <div className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <Bot className="w-5 h-5 animate-bounce" />
          <span className="text-xs font-black tracking-wider uppercase pr-1">AI Helpline</span>
        </button>
      )}

      {/* 2. Interactive Chat Panel */}
      {isOpen && (
        <div className="bg-white border border-slate-200 w-[350px] sm:w-[380px] h-[520px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up border-b-4" style={{ borderColor: settings.primaryColor }}>
          {/* Header Panel */}
          <div className="px-5 py-4 text-white flex justify-between items-center bg-slate-950" style={{ backgroundColor: settings.primaryColor }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center relative">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-wide uppercase">AI Helpline Chat</h3>
                <p className="text-[10px] text-white/80 font-semibold">Online & ready to guide you</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Profile icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === "user" ? "bg-slate-200 text-slate-700" : "bg-blue-100 text-[#1877F2]"
                }`}>
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble details */}
                <div className={`max-w-[80%] rounded-2xl p-3 text-xs font-medium leading-relaxed shadow-3xs border ${
                  m.role === "user"
                    ? "bg-slate-800 text-white border-slate-700 rounded-tr-none"
                    : "bg-white text-slate-800 border-slate-100 rounded-tl-none"
                }`}>
                  {/* Markdown-like rendering helper for bold strings */}
                  <div className="whitespace-pre-line">
                    {m.text.split("\n").map((line, lIdx) => (
                      <p key={lIdx} className={line ? "mb-1.5 last:mb-0" : "h-2"}>
                        {line.split("**").map((part, pIdx) => {
                          if (pIdx % 2 === 1) {
                            return <strong key={pIdx} className="font-extrabold text-[#1877F2]">{part}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    ))}
                  </div>
                  <span className="block text-[8px] text-slate-400 mt-1.5 text-right">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* AI Typing Loader indicator */}
            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs italic font-bold">
                <Loader2 className="w-4 h-4 animate-spin text-[#1877F2]" />
                <span>AI Agent is finding info...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Prompts Option Grid */}
          {messages.length < 3 && !loading && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => handleSuggest("সচল কুপন কোডগুলো কি?")}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:border-[#1877F2] hover:text-[#1877F2] transition-all"
              >
                🎟️ Discount Coupons
              </button>
              <button
                onClick={() => handleSuggest("রিফান্ড পলিসি কি?")}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:border-[#1877F2] hover:text-[#1877F2] transition-all"
              >
                🔄 Refund Policy
              </button>
              <button
                onClick={() => handleSuggest("পোশাকের সাইজ এবং কালেকশন দেখান")}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:border-[#1877F2] hover:text-[#1877F2] transition-all"
              >
                👕 Products List
              </button>
              <button
                onClick={() => handleSuggest("সাপোর্ট হেল্পলাইন নাম্বার দিন")}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:border-[#1877F2] hover:text-[#1877F2] transition-all"
              >
                📞 Contact Phone
              </button>
            </div>
          )}

          {/* Input Panel */}
          <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Type your question here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-[#1877F2]"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              className="w-10 h-10 flex items-center justify-center text-white rounded-xl hover:scale-105 transition-transform"
              style={{ backgroundColor: settings.primaryColor }}
              disabled={loading}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
