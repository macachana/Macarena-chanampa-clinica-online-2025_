import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  db = inject(DatabaseService);
  auth = inject(AuthService);

  ngOnInit()
  {
    console.log(this.auth.usuarioActual?.user_metadata["tipo"]);
  }
}
