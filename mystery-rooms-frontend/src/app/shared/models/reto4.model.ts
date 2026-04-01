// Datos que Angular envía al backend
export interface Reto4Request {
  partidaId: number;
  puntajeObtenido: number;
  intentosFallidos: number;
  completado: boolean;
  tiempoSegundos: number;
}

// Datos que el backend devuelve
export interface Reto4Response {
  id: number;
  partidaId: number;
  userId: number;
  userName: string;
  userEmail: string;
  puntajeObtenido: number;
  intentosFallidos: number;
  completado: boolean;
  tiempoSegundos: number;
  createdAt: string;
  mensaje: string;
}

// Escenario del puzzle
export interface Escenario {
  id: number;
  label: string;
  pregunta: string;
  opciones: Opcion[];
  vossMsg: VossMsg;
}

export interface Opcion {
  texto: string;
  correcta: boolean;
  feedback: string;
}

export interface VossMsg {
  idle: string;
  correct: string;
  wrong: string;
}
