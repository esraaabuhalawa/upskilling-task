import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterItem } from "./shared/components/footer-item/footer-item";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterItem],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-angular-app');
}
