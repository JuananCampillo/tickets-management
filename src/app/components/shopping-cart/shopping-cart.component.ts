import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Session } from '../../models/session.model';
import { EventSelected } from '../../models/event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { LocalstorageService } from '../../local-storage/local-storage.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ShoppingCartComponent {
  @Input() events: EventSelected[] | null = [];
  @Output() updateInfoSessions = new EventEmitter();

  constructor(
    private localStorage: LocalstorageService,
    private datePipe: DatePipe
  ) { }

  onRemove(session: Session, eventTitle: string) {
    const eventsSelected = this.events;
    if (!!eventsSelected) {
      const eventPosition = eventsSelected.findIndex(ev => ev.title === eventTitle);
      //Eliminamos la sesion de los eventos seleccionados. 
      eventsSelected[eventPosition].sessions = eventsSelected[eventPosition].sessions.map(ses => {
        if (session.date === ses.date && ses.selected > 0) {
          ses.selected--;
        }
        return ses;
      }).filter(ses => ses.selected > 0);

      //Si el evento no tiene mas sesiones, lo eliminamos.
      if (eventsSelected[eventPosition].sessions.length === 0) {
        eventsSelected.splice(eventPosition, 1);
      }
      this.events = eventsSelected;
      this.localStorage.setItem("eventsSelected", JSON.stringify(eventsSelected));
      
      this.updateInfoSessions.emit();

    }

  }

  getFormattedDate(date: string): string | null {
    return this.datePipe.transform(new Date(parseInt(date)), 'dd/MM/yyyy');
  }
}
