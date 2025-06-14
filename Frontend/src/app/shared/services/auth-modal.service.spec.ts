import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthModalService } from './auth-modal.service';
import { AuthModalComponent } from '../components/auth-modal/auth-modal.component';

describe('AuthModalService', () => {
  let service: AuthModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthModalComponent],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
