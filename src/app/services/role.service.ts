import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IRole } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService<IRole> {
  protected override source: string = 'role';
  private roleListSignal = signal<IRole[]>([]);

  get roles$() {
    return this.roleListSignal;
  }

  public search: ISearch = { 
    page: 1,
    size: 10
  }
  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.roleListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }
}
