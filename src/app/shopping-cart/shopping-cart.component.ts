import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Session {
  date: string;
  availability: number;
  selected: number;
}

interface Event {
  title: string;
  sessions: Session[];
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  @Input() events: Event[] = [];
  @Output() remove = new EventEmitter<Session>();

  onRemove(session: Session) {
    this.remove.emit(session);
  }
}
