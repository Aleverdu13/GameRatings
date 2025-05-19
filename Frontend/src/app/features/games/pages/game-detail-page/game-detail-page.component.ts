import { Component, OnInit } from '@angular/core';
import { Game } from '../../../../interfaces/game.interface';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../../../core/services/game.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ReviewVoteService } from '../../../../core/services/review-vote.service';
import { ReviewVoteSummary } from '../../../../interfaces/review-vote.interface';
import { CommentService } from '../../../../core/services/comment.service';
import { Comment} from '../../../../interfaces/comment.interface';
import { CommentVoteService } from '../../../../core/services/comment-vote.service';


@Component({
  selector: 'app-game-detail-page',
  standalone: false,
  templateUrl: './game-detail-page.component.html',
  styleUrl: './game-detail-page.component.css'
})
export class GameDetailPageComponent implements OnInit {
  game: Game | null = null;
  loading: boolean = true;
  error: string = '';

  score: number = 10;
  comment: string = '';
  submitError: string = '';
  isSubmitting: boolean = false;

  alreadyReviewed: boolean = false;

  // Mapa para almacenar los votos de cada review
  votesMap: { [reviewId: number]: ReviewVoteSummary } = {};

  // Información de los comentarios (visibilidad, mapa de comentarios, página actual, nuevo comentario, y última página)
  isCommentBoxVisible: { [reviewId: number]: boolean } = {};
  commentsMap: { [reviewId: number]: Comment[] } = {};
  commentsPage: { [reviewId: number]: number } = {};
  newComment: { [reviewId: number]: string } = {};
  commentsLastPage: { [reviewId: number]: number } = {};

  // Mapa para almacenar los votos de cada comentario
  commentVotesMap: { [commentId: number]: {
    upvotes: number;
    downvotes: number;
    total: number;
    userVote: number | null;
  } } = {};

  // Información de los comentarios (visibilidad y contenido)
  isReplyBoxVisible: { [commentId: number]: boolean } = {};
  replyContent: { [commentId: number]: string } = {};

  // Información de las respuestas (visibilidad)
  repliesVisible: { [commentId: number]: boolean } = {};



  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private authService: AuthService,
    private voteService: ReviewVoteService,
    private commentService: CommentService,
    private commentVoteService: CommentVoteService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
  
    this.gameService.getGameById(id).subscribe({
      next: (data: Game) => {
        this.game = data;
        this.loading = false;
  
        // Detectar si el usuario ya ha hecho una review
        const currentUserId = this.authService.getUserId();
        this.alreadyReviewed = !!this.game.reviews?.some(r => r.user?.id === currentUserId);

        // Inicializar votos por defecto para evitar errores
        this.game?.reviews.forEach(review => {
          this.votesMap[review.id] = {
            upvotes: 0,
            downvotes: 0,
            total: 0,
            userVote: null
          };

          // Y ahora actualizo con los reales
          this.voteService.getVotes(review.id).subscribe(realVotes => {
            this.votesMap[review.id] = realVotes;
          });
        });
      },
      error: () => {
        this.error = 'Juego no encontrado';
        this.loading = false;
      }
    });
  }
  

  // Cambia entre imágenes y videos de un juego para rellenar el carrusel
  mediaType: 'images' | 'videos' = 'images';
  activeIndex: number = 0;

  toggleMedia(): void {
    this.mediaType = this.mediaType === 'images' ? 'videos' : 'images';
    this.activeIndex = 0; // reset al cambiar
  }

  // Método para obtener la lista actual
  get currentMedia(): string[] {
    if (!this.game) return [];
    return this.mediaType === 'images' ? this.game.screenshot : this.game.videos;
  }

  // Método para comprobar si el juego tiene reviews
  hasReviews(): boolean {
    return Array.isArray(this.game?.reviews) && this.game!.reviews.length > 0;
  }
  
  // Método para comprobar si estás logueado
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  // Método para enviar la review
  submitReview(): void {
    if (!this.comment.trim()) {
      this.submitError = 'El comentario no puede estar vacío.';
      return;
    }
  
    this.isSubmitting = true;
    this.submitError = '';
  
    const gameId = this.game?.id;
    if (!gameId) return;
  
    this.gameService.addReview(gameId, {
      score: this.score,
      comment: this.comment
    }).subscribe({
      next: () => {
        // Volver a cargar el juego completo con las reviews
        this.gameService.getGameById(gameId).subscribe(updatedGame => {
          this.game = updatedGame;
  
          // Resetear formulario
          this.score = 10;
          this.comment = '';
          this.isSubmitting = false;
        });
      },
      error: (error) => {
        this.submitError = 'Ya has hecho una review para este juego anteriormente.';
        this.isSubmitting = false;
      }
    });
  }

  // Método para votar una review
  vote(reviewId: number, value: 1 | -1): void {
    this.voteService.vote(reviewId, value).subscribe({
      next: () => {
        // volver a cargar los votos actualizados
        this.voteService.getVotes(reviewId).subscribe(v => {
          this.votesMap[reviewId] = v;
        });
      },
      error: err => {
        console.error('Error al votar', err);
      }
    });
  }

  // Método para mostrar/ocultar el cuadro de comentarios
  toggleComments(reviewId: number): void {
    if (!this.isCommentBoxVisible[reviewId]) {
      this.isCommentBoxVisible[reviewId] = true;
      this.loadComments(reviewId);
    } else {
      this.isCommentBoxVisible[reviewId] = false;
    }
  }

  // Método para cargar los comentarios de una review
  loadComments(reviewId: number, page: number = 1): void {
    this.commentService.getComments(reviewId, page).subscribe({
      next: (res: any) => {
        const flatComments: Comment[] = res.data;

        // Paso 1: eliminar `replies` si viene del backend vacío
        flatComments.forEach(c => {
          delete (c as any).replies;
        });

        // Paso 2: inicializar con array vacío
        flatComments.forEach(c => c.replies = []);

        // Paso 3: mapa para construir árbol
        const commentMap: { [id: number]: Comment } = {};
        flatComments.forEach(c => commentMap[c.id] = c);

        // Paso 4: construir árbol
        if (!this.commentsMap[reviewId]) {
          this.commentsMap[reviewId] = [];
        }

        flatComments.forEach(c => {
          const parentId = c.parent_id;
          if (parentId && commentMap[parentId]) {
            commentMap[parentId].replies!.push(c);
          } else {
            this.commentsMap[reviewId].push(c);
          }
        });

        this.commentsPage[reviewId] = res.current_page;
        this.commentsLastPage[reviewId] = res.last_page;

        // Votos
        flatComments.forEach((c: Comment) => {
          this.commentVoteService.getVotes(c.id).subscribe(votes => {
            this.commentVotesMap[c.id] = {
              ...votes,
              userVote: null
            };
          });
        });

        console.log('Árbol construido:', this.commentsMap[reviewId]);
      },
      error: err => {
        console.error('Error al cargar comentarios', err);
      }
    });
  }

  // Método para enviar un nuevo comentario
  submitComment(reviewId: number): void {
    const content = this.newComment[reviewId]?.trim();
    if (!content) return;

    this.commentService.postComment(reviewId, content).subscribe({
      next: () => {
        this.newComment[reviewId] = '';
        this.loadComments(reviewId); // recarga los comentarios
      },
      error: (err) => {
        console.error('Error al enviar comentario', err);
      }
    });
  }

  // Método para votar un comentario
  voteComment(commentId: number, vote: number): void {
    this.commentVoteService.vote(commentId, vote).subscribe({
      next: () => {
        // Volver a cargar los votos
        this.commentVoteService.getVotes(commentId).subscribe(updated => {
          this.commentVotesMap[commentId] = {
            ...updated,
            userVote: vote
          };
        });
      },
      error: (err) => {
        console.error('Error al votar comentario', err);
      }
    });
  }

  // Método para mostrar/ocultar el cuadro de respuesta de los comentarios
  toggleReplyBox(commentId: number): void {
    this.isReplyBoxVisible[commentId] = !this.isReplyBoxVisible[commentId];
  }

  // Método para enviar una respuesta a un comentario
  submitReply(reviewId: number, parentId: number): void {
    const content = this.replyContent[parentId]?.trim();
    if (!content) return;

    this.commentService.addComment(reviewId, {
      content,
      parent_id: parentId
    }).subscribe({
      next: (res) => {
        const newReply = res.comment;
        const currentUser = this.authService.getCurrentUser();

        const parent = this.commentsMap[reviewId].find(c => c.id === parentId)
                    ?? this.commentsMap[reviewId].flatMap(c => c.replies || []).find(r => r.id === parentId);

        if (parent) {
          if (!parent.replies) parent.replies = [];

          console.log('Usuario actual:', this.authService.getCurrentUser());

          parent.replies.push({
            ...newReply,
            user: currentUser,
            vote_count: 0,
            created_at: new Date().toISOString(),
          });
          console.log('Respuesta añadida:', parent.replies);

        }

        this.replyContent[parentId] = '';
        this.isReplyBoxVisible[parentId] = false;
      },
      error: (err) => console.error('Error al responder', err)
    });
  }

  // Método para mostrar las respuestas de un comentario
  toggleReplies(commentId: number): void {
  this.repliesVisible[commentId] = !this.repliesVisible[commentId];
}


}