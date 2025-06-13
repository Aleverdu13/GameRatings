import { Component } from '@angular/core';
import { PollService } from '../../core/services/poll.service';

@Component({
  selector: 'app-polls',
  standalone: false,
  templateUrl: './polls.component.html',
  styleUrl: './polls.component.css'
})
export class PollsComponent {
  polls: any[] = [];
  votedPolls: Set<number> = new Set();

  snackbarVisible: boolean = false;
  snackbarMessage: string = '';

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {
    this.pollService.getPolls().subscribe(data => {
      this.polls = data;
    });
  }

  vote(pollId: number, optionId: number): void {
    this.pollService.vote(pollId, optionId).subscribe({
      next: () => {
        this.votedPolls.add(pollId);
        this.loadPolls();
        this.showSnackbar('¡Voto registrado!');
      },
      error: err => {
        alert(err.error.message || 'Error al votar');
      }
    });
  }

  showSnackbar(message: string): void {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
    setTimeout(() => {
      this.snackbarVisible = false;
    }, 3000);
  }
}
