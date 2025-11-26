import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  botName?: string;
  avatarColor?: string;
}

const getBgColor = (color: string) => {
  const map: Record<string, string> = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600',
    amber: 'bg-amber-600',
    sky: 'bg-sky-600',
    violet: 'bg-violet-600'
  };
  return map[color] || 'bg-indigo-600';
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, botName = 'Bot', avatarColor = 'indigo' }) => {
  const isBot = message.role === 'model';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-medium">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {isBot && (
        <div className={`w-8 h-8 rounded-full ${getBgColor(avatarColor)} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <Bot size={18} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] sm:max-w-[70%] ${isBot ? 'order-1' : 'order-2'}`}>
        {isBot && (
          <div className="text-xs text-slate-500 font-medium mb-1 ml-1">
            {botName}
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${isBot
              ? 'bg-white border border-slate-200 text-slate-800'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
            } ${message.isError ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
        >
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          ) : (
            <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${isBot
                ? 'prose-slate prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-700 prose-p:my-2 prose-ul:my-2 prose-li:text-slate-700 prose-strong:text-slate-900 prose-strong:font-semibold'
                : 'prose-invert prose-headings:text-white prose-p:text-white prose-ul:text-white prose-li:text-white prose-strong:text-white'
              }`}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="my-1 first:mt-0 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="my-2 space-y-1">{children}</ul>,
                  li: ({ children }) => <li className="ml-4">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0 shadow-md order-1">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
};