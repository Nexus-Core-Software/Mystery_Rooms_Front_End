import { Component } from '@angular/core';

interface RoomFormData {
  name: string;
  maxPlayers: number;
  difficulty: 'facil' | 'medio' | 'dificil';
  timeLimit: number;
}

interface FormErrors {
  name?: string;
  maxPlayers?: string;
}

// @Component({
//   selector: 'app-crear-sala',
//   templateUrl: './crear-sala.component.html',
//   styleUrls: ['./crear-sala.component.scss']
// })
export class CrearSalaComponent {
  formData: RoomFormData = {
    name: '',
    maxPlayers: 4,
    difficulty: 'medio',
    timeLimit: 30
  };

  errors: FormErrors = {};
  showConfirmModal = false;
  isSubmitting = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';

  difficultyLabels = {
    facil: 'Fácil',
    medio: 'Medio',
    dificil: 'Difícil'
  };

  validate(): boolean {
    const newErrors: FormErrors = {};

    if (!this.formData.name.trim()) {
      newErrors.name = 'El nombre de la sala es requerido';
    } else if (this.formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (this.formData.name.length > 50) {
      newErrors.name = 'El nombre no puede exceder 50 caracteres';
    }

    if (this.formData.maxPlayers < 2) {
      newErrors.maxPlayers = 'Mínimo 2 jugadores';
    } else if (this.formData.maxPlayers > 10) {
      newErrors.maxPlayers = 'Máximo 10 jugadores';
    }

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  handleSubmit() {
    if (this.validate()) {
      this.showConfirmModal = true;
    }
  }

  async handleConfirm() {
    this.isSubmitting = true;
    this.showConfirmModal = false;

    await new Promise(resolve => setTimeout(resolve, 1500));

    this.isSubmitting = false;
    this.submitStatus = 'success';

    setTimeout(() => {
      this.formData = {
        name: '',
        maxPlayers: 4,
        difficulty: 'medio',
        timeLimit: 30
      };
      this.submitStatus = 'idle';
    }, 3000);
  }
}
