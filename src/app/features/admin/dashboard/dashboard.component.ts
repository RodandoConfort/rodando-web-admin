import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIcon],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
