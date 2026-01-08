// Session types for synchronous collaboration

export type SessionType = 'in-person' | 'remote';

export type SessionStatus =
  | 'not-started'
  | 'waiting-for-partner'  // Created but partner hasn't joined
  | 'active'               // Both parents in session
  | 'paused'               // Session paused/disconnected
  | 'completed';           // Session ended

export interface Session {
  id: string;
  type: SessionType;
  status: SessionStatus;
  startedBy: 'you' | 'them';
  startedAt?: Date;
  completedAt?: Date;

  // Progress tracking
  currentSectionId?: string;
  completedSectionIds: string[];
  skippedSectionIds: string[];

  // Participants
  participants: {
    you: boolean;
    them: boolean;
  };

  // Video state (remote sessions only)
  videoState?: {
    yourVideo: boolean;
    yourAudio: boolean;
    theirVideo: boolean;
    theirAudio: boolean;
  };
}
