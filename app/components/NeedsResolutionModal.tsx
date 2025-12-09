'use client';

import { XMarkIcon, ChatBubbleLeftRightIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Section } from '@/app/types/section';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'you' | 'them';
  text: string;
  timestamp: Date;
}

interface NeedsResolutionModalProps {
  section: Section | null;
  coParentName: string;
  onClose: () => void;
  onResolve: (section: Section, resolution: any) => void;
}

export default function NeedsResolutionModal({
  section,
  coParentName,
  onClose,
  onResolve,
}: NeedsResolutionModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedResolutions, setSelectedResolutions] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!section) return null;

  const conflicts = section.stateData?.conflicts || [];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'you',
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleSelectValue = (field: string, value: any, source: 'yours' | 'theirs' | 'custom') => {
    setSelectedResolutions({
      ...selectedResolutions,
      [field]: { value, source },
    });
  };

  const handleResolve = () => {
    onResolve(section, selectedResolutions);
  };

  const allResolved = conflicts.every(c => selectedResolutions[c.field]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Resolve Differences</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Section Title */}
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
          <p className="text-sm text-gray-600">
            {conflicts.length} {conflicts.length === 1 ? 'difference' : 'differences'} to resolve
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Conflicts & Resolution */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground">Select Your Agreement</h4>

              {conflicts.map((conflict, idx) => (
                <div key={idx} className="border border-border rounded-xl p-4">
                  <div className="font-medium text-gray-900 mb-3">{conflict.field}</div>

                  {/* Your answer option */}
                  <button
                    onClick={() => handleSelectValue(conflict.field, conflict.yourValue, 'yours')}
                    className={`w-full p-3 rounded-lg border-2 text-left mb-2 transition-colors ${
                      selectedResolutions[conflict.field]?.source === 'yours'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Your answer:</div>
                        <div className="text-sm font-medium text-gray-900">{String(conflict.yourValue)}</div>
                      </div>
                      {selectedResolutions[conflict.field]?.source === 'yours' && (
                        <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Their answer option */}
                  <button
                    onClick={() => handleSelectValue(conflict.field, conflict.theirValue, 'theirs')}
                    className={`w-full p-3 rounded-lg border-2 text-left mb-2 transition-colors ${
                      selectedResolutions[conflict.field]?.source === 'theirs'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{coParentName}'s answer:</div>
                        <div className="text-sm font-medium text-gray-900">{String(conflict.theirValue)}</div>
                      </div>
                      {selectedResolutions[conflict.field]?.source === 'theirs' && (
                        <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* AI Suggestion */}
                  {conflict.aiSuggestion && (
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <SparklesIcon className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-purple-700 mb-1">AI Suggestion</div>
                          <div className="text-sm text-gray-700">{conflict.aiSuggestion}</div>
                          <button
                            onClick={() => handleSelectValue(conflict.field, conflict.aiSuggestion, 'custom')}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium mt-1"
                          >
                            Use this suggestion
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Chat */}
            <div className="flex flex-col h-full">
              <h4 className="font-semibold text-foreground mb-3">Discussion</h4>

              <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-4 overflow-y-auto min-h-[300px] max-h-[400px]">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>Start a conversation to discuss these differences</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.sender === 'you'
                              ? 'bg-primary text-white'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="text-sm">{message.text}</div>
                          <div className={`text-xs mt-1 ${
                            message.sender === 'you' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {allResolved ? (
              <span className="text-success font-medium">✓ All differences resolved</span>
            ) : (
              <span>{conflicts.length - Object.keys(selectedResolutions).length} remaining</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              disabled={!allResolved}
              className="px-6 py-2 bg-success text-white font-semibold rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              We've Agreed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
