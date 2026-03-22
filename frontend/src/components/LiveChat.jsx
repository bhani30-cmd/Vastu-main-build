import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { publicAPI } from '../services/api';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [step, setStep] = useState('welcome'); // welcome, chat, success
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Add initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 1,
          text: "Hi! 👋 Welcome to Vastunirmana Projects. How can we help you today?",
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 500);
    }
  }, [isOpen]);

  const handleStartChat = () => {
    if (!userInfo.name || !userInfo.email) {
      toast.error('Please enter your name and email');
      return;
    }
    setStep('chat');
    setMessages([...messages, {
      id: messages.length + 1,
      text: `Great to meet you, ${userInfo.name}! Feel free to ask any questions about our construction services.`,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: currentMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage('');
    setSubmitting(true);

    try {
      // Save chat message to backend
      await publicAPI.submitContact({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || 'Not provided',
        subject: 'Live Chat Message',
        message: `Chat conversation:\n\n${messages.map(m => `${m.sender === 'user' ? userInfo.name : 'Bot'}: ${m.text}`).join('\n')}\n\n${userInfo.name}: ${currentMessage}`
      });

      // Add bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "Thank you for your message! We're currently offline, but we've received your query and will get back to you via email shortly. 📧",
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);

    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (step === 'chat') {
        handleSendMessage();
      }
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
          aria-label="Open live chat"
        >
          <MessageCircle size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Chat with us
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } flex flex-col`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="text-orange-500" size={20} />
              </div>
              <div>
                <h3 className="font-bold">Vastunirmana Support</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span>Typically replies in a few hours</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Welcome/Form Step */}
              {step === 'welcome' && (
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700">
                        👋 Welcome! Before we start, please tell us a bit about yourself:
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                      <Input
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        placeholder="Your name"
                        onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                      <Input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        placeholder="your.email@example.com"
                        onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone (Optional)</label>
                      <Input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        placeholder="+91-XXXXXXXXXX"
                        onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                      />
                    </div>

                    <Button
                      onClick={handleStartChat}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>
              )}

              {/* Chat Step */}
              {step === 'chat' && (
                <>
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <span className="text-xs opacity-70 mt-1 block">{message.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={submitting}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={submitting || !currentMessage.trim()}
                        className="bg-orange-500 hover:bg-orange-600"
                        size="icon"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      We're currently offline. We'll respond via email soon.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;
