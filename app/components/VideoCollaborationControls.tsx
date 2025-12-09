'use client';

import { useState } from 'react';
import { MicrophoneIcon, VideoCameraIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { MicrophoneIcon as MicrophoneOffIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline';

interface VideoFeed {
  id: string;
  name: string;
  videoEnabled: boolean;
}

interface VideoCollaborationControlsProps {
  localVideoFeed?: string;
  remoteVideoFeed?: string;
  onToggleMicrophone?: () => void;
  onToggleCamera?: () => void;
  onToggleChat?: () => void;
}

export default function VideoCollaborationControls({
  localVideoFeed,
  remoteVideoFeed,
  onToggleMicrophone,
  onToggleCamera,
  onToggleChat,
}: VideoCollaborationControlsProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
    onToggleMicrophone?.();
  };

  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    onToggleCamera?.();
  };

  return (
    <div className="fixed bottom-6 left-6 flex items-end space-x-4 z-50">
      {/* Video Feeds */}
      <div className="flex items-end space-x-3">
        {/* Local Video */}
        <div className="w-32 h-24 bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-white">
          {localVideoFeed ? (
            <img src={localVideoFeed} alt="You" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-1">
                  <span className="text-white text-xs font-medium">You</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Remote Video */}
        <div className="w-32 h-24 bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700">
          {remoteVideoFeed ? (
            <img src={remoteVideoFeed} alt="Co-parent" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-1">
                  <span className="text-white text-xs font-medium">CP</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-2">
        {/* Microphone */}
        <button
          onClick={handleToggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isMicOn
              ? 'bg-white hover:bg-gray-100 text-gray-700'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isMicOn ? (
            <MicrophoneIcon className="w-5 h-5" />
          ) : (
            <MicrophoneOffIcon className="w-5 h-5" />
          )}
        </button>

        {/* Camera */}
        <button
          onClick={handleToggleCamera}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isCameraOn
              ? 'bg-white hover:bg-gray-100 text-gray-700'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isCameraOn ? (
            <VideoCameraIcon className="w-5 h-5" />
          ) : (
            <VideoCameraSlashIcon className="w-5 h-5" />
          )}
        </button>

        {/* Chat */}
        <button
          onClick={onToggleChat}
          className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center shadow-lg transition-all"
          title="Open chat"
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
