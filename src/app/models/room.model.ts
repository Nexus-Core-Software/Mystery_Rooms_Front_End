export interface Room {
  id: number;
  name: string;
  difficulty: string;
  duration: number;
  description: string;
}

export interface Player {
  id: number;
  name: string;
  email: string;
  score: number;
}

export interface GameSession {
  id: number;
  roomId: number;
  playerId: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  score: number;
}
