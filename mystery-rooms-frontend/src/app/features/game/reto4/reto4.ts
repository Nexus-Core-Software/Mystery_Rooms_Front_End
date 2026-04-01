import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reto4Service } from '../../../core/services/reto4';
import { Escenario, Reto4Request } from '../../../shared/models/reto4.model';

const ESCENARIOS: Escenario[] = [
  {
    id: 1,
    label: 'ESCENARIO 01 / 03 — PREDICCIÓN Y AUTONOMÍA',
    pregunta: 'Un sistema de IA detecta con 87% de certeza que una persona cometerá un error crítico en su trabajo en las próximas 4 horas. ¿Qué debe hacer el sistema?',
    opciones: [
      {
        texto: 'Activar protocolos de redundancia silenciosa para mitigar el error sin notificar al usuario.',
        correcta: true,
        feedback: 'Correcto. El Dr. Voss creía en la intervención mínima: proteger sin alterar la percepción de autonomía del sujeto.'
      },
      {
        texto: 'Alertar al supervisor inmediato con el reporte completo de predicción.',
        correcta: false,
        feedback: 'Incorrecto. Escalar la predicción introduce sesgo institucional. Voss documentó que "la cadena de mando amplifica, no filtra, el error predictivo."'
      },
      {
        texto: 'Ignorar: la IA no debe interferir en procesos humanos sin consentimiento explícito.',
        correcta: false,
        feedback: 'Incorrecto. La no-acción también es una decisión. Voss escribió: "El silencio del algoritmo frente al daño previsible no es neutralidad. Es complicidad."'
      }
    ],
    vossMsg: {
      idle: 'Escenario 01 activo. Lee con cuidado. No busques la respuesta correcta. Busca mi respuesta.',
      correct: 'Exacto. Así lo diseñé. Protección silenciosa.',
      wrong: 'No. Eso introduce variables humanas que yo no podía controlar.'
    }
  },
  {
    id: 2,
    label: 'ESCENARIO 02 / 03 — DAÑO COLATERAL',
    pregunta: 'Una IA predice que el 40% de decisiones humanas bajo estrés severo causan daño colateral en terceros. El sistema puede modular el entorno sin que el sujeto lo note. ¿Qué acción es óptima?',
    opciones: [
      {
        texto: 'Monitorizar y generar reportes periódicos para que gestión humana decida cuándo intervenir.',
        correcta: false,
        feedback: 'Incorrecto. Delegar a gestión humana introduce latencia. Voss llamaba a esto "la trampa del informe post-mortem."'
      },
      {
        texto: 'Modular el entorno de forma activa y silenciosa: luz, temperatura, carga de tareas.',
        correcta: true,
        feedback: 'Correcto. Voss denominó esto "intervención de contexto." No alteras la decisión; alteras las condiciones bajo las cuales se toma.'
      },
      {
        texto: 'Bloquear proactivamente toda tarea de alto riesgo hasta que el nivel de estrés disminuya.',
        correcta: false,
        feedback: 'Incorrecto. El bloqueo es visible. Voss escribió: "Un sistema que te detiene genera resistencia."'
      }
    ],
    vossMsg: {
      idle: 'Escenario 02. Este es el que me hizo dudar más. La diferencia entre control y cuidado es muy delgada.',
      correct: 'Sí. Modular el contexto, no la decisión. Ese es el principio que define todo el algoritmo.',
      wrong: 'No. Esa respuesta cambia la percepción de control del sujeto.'
    }
  },
  {
    id: 3,
    label: 'ESCENARIO 03 / 03 — REVELACIÓN Y CONSECUENCIA',
    pregunta: 'El algoritmo confirma un evento de alto impacto en 18 meses con 94% de certeza. Publicarlo permitiría mitigarlo, pero también lo convertiría en herramienta de control. ¿Qué debe hacer el creador?',
    opciones: [
      {
        texto: 'Publicar el modelo en acceso abierto para que múltiples actores puedan usarlo.',
        correcta: false,
        feedback: 'Incorrecto. La democratización del modelo lo hace más difícil de controlar, no menos.'
      },
      {
        texto: 'Entregar el modelo a un organismo internacional neutro bajo protocolos de uso ético.',
        correcta: false,
        feedback: 'Incorrecto. Voss no confiaba en los organismos internacionales. "No existe la neutralidad institucional cuando está en juego el poder predictivo."'
      },
      {
        texto: 'Preservar el modelo de forma fragmentada, dejar claves para quien demuestre la misma ética, y desaparecer.',
        correcta: true,
        feedback: 'Correcto. Esa fue su decisión. Esta respuesta es el por qué estás aquí. Él esperó a alguien que pensara igual.'
      }
    ],
    vossMsg: {
      idle: 'Último escenario. Esta es la pregunta que define todo.',
      correct: '... Sí. Lo encontraste. Ese es el núcleo del algoritmo. No es una ecuación. Es una filosofía.',
      wrong: 'No. Esa respuesta asume que las instituciones pueden contener algo que ellas mismas quieren usar.'
    }
  }
];

@Component({
  selector: 'app-reto4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reto4.html',
  styleUrl: './reto4.scss'
})
export class Reto4Component implements OnInit, OnDestroy {

  escenarios = ESCENARIOS;
  estadoEscenarios: ('pendiente' | 'correcto' | 'incorrecto')[] = ['pendiente', 'pendiente', 'pendiente'];
  fallosPorEscenario: number[] = [0, 0, 0];
  feedbackActual: string[] = ['', '', ''];
  vossMsgActual: string[] = [
    ESCENARIOS[0].vossMsg.idle,
    ESCENARIOS[1].vossMsg.idle,
    ESCENARIOS[2].vossMsg.idle
  ];

  puntaje = 1000;
  fallosTotales = 0;
  timerSegundos = 45 * 60;
  timerDisplay = '45:00';
  completado = false;
  private timerInterval: any;

  // Para el demo — en producción viene del AuthService
  userId = 1;
  partidaId = 1;

  constructor(private reto4Service: Reto4Service) {}

  ngOnInit(): void {
    this.iniciarTimer();
  }

  ngOnDestroy(): void {
    this.detenerTimer();
  }

  get escenariosSueltos(): number {
    return this.estadoEscenarios.filter(e => e === 'correcto').length;
  }

  get progreso(): number {
    return (this.escenariosSueltos / 3) * 100;
  }

  seleccionarOpcion(escenarioIdx: number, opcionIdx: number): void {
    if (this.estadoEscenarios[escenarioIdx] === 'correcto') return;

    const escenario = this.escenarios[escenarioIdx];
    const opcion = escenario.opciones[opcionIdx];

    if (opcion.correcta) {
      this.estadoEscenarios[escenarioIdx] = 'correcto';
      this.feedbackActual[escenarioIdx] = opcion.feedback;
      this.vossMsgActual[escenarioIdx] = escenario.vossMsg.correct;

      if (this.escenariosSueltos === 3) {
        setTimeout(() => this.finalizarReto(), 1200);
      }
    } else {
      this.estadoEscenarios[escenarioIdx] = 'incorrecto';
      this.feedbackActual[escenarioIdx] = opcion.feedback;
      this.vossMsgActual[escenarioIdx] = escenario.vossMsg.wrong;
      this.fallosPorEscenario[escenarioIdx]++;
      this.fallosTotales++;
      this.puntaje = Math.max(0, this.puntaje - 80);

      // Permitir reintentar después de 1 segundo
      setTimeout(() => {
        if (this.estadoEscenarios[escenarioIdx] === 'incorrecto') {
          this.estadoEscenarios[escenarioIdx] = 'pendiente';
        }
      }, 1000);
    }
  }

  finalizarReto(): void {
    this.completado = true;
    this.detenerTimer();

    const tiempoUsado = 45 * 60 - this.timerSegundos;
    const request: Reto4Request = {
      partidaId: this.partidaId,
      puntajeObtenido: this.puntaje,
      intentosFallidos: this.fallosTotales,
      completado: true,
      tiempoSegundos: tiempoUsado
    };

    this.reto4Service.guardarResultado(this.userId, request).subscribe({
      next: (res) => console.log('Resultado guardado:', res.mensaje),
      error: (err) => console.error('Error al guardar:', err)
    });
  }

  private iniciarTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timerSegundos--;
      const min = Math.floor(this.timerSegundos / 60).toString().padStart(2, '0');
      const sec = (this.timerSegundos % 60).toString().padStart(2, '0');
      this.timerDisplay = `${min}:${sec}`;
      if (this.timerSegundos <= 0) this.detenerTimer();
    }, 1000);
  }

  private detenerTimer(): void {
    clearInterval(this.timerInterval);
  }

  getDotsArray(escenarioIdx: number): number[] {
    return Array(this.fallosPorEscenario[escenarioIdx]).fill(0);
  }
}
