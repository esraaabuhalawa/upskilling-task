import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../core/models/user/user.interface';
import { RouterModule } from '@angular/router';
import { AppImgFallback } from '../../../../shared/directives/app-img-fallback';

@Component({
  selector: 'app-user-card',
  imports: [RouterModule, AppImgFallback],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Input() user!: User;

  @Output() deleteUser = new EventEmitter<User>();

  confirmDelete() {
    this.deleteUser.emit(this.user);
  }
}
