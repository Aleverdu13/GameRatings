import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarUrl',
  standalone: false
})
export class AvatarUrlPipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    return path ? `http://localhost:8000/storage/${path}` : 'assets/images/default-avatar.webp';
  }
}
