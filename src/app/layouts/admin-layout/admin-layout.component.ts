import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

// Router
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { AdminLayoutStore } from '../../core/store/ui/admin-layout.store';
import { AdminSidebarComponent } from "../../shared/ui/admin-sidebar/admin-sidebar.component";
import { AdminNavbarComponent } from "../../shared/ui/admin-navbar/admin-navbar.component";
import { AdminFooterComponent } from "../../shared/ui/admin-footer/admin-footer.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    // Angular Material
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    // Angular
    RouterOutlet,
    RouterModule,
    NgFor,
    AdminSidebarComponent,
    AdminNavbarComponent,
    AdminFooterComponent
],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  protected  uiStore = inject(AdminLayoutStore);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Detectamos mobile / desktop y actualizamos el store global de UI
    this.breakpointObserver.observe('(max-width: 768px)').pipe(
      map(result => result.matches),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
    ).subscribe((isHandset) => {
        this.uiStore.setIsHandset(isHandset);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

