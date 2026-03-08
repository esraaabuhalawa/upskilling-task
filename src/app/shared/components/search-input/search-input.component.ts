import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  @Input() placeholder: string = 'Search By Name , email ...';
  @Input() debounce: number = 300; // milliseconds

  @Output() searchChange = new EventEmitter<string>();

  searchValue: string = '';
  private searchSubject = new Subject<string>();
  private subscription!: Subscription;

  ngOnInit() {
    this.subscription = this.searchSubject
      .pipe(debounceTime(this.debounce))
      .subscribe(value => this.searchChange.emit(value));
  }

  onInput() {
    this.searchSubject.next(this.searchValue);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
