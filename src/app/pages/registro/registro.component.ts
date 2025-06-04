import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-registro',
  imports: [RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  db = inject(DatabaseService);
}
