import { Component } from '@angular/core';
import { EventService } from '../../event-service/event.service';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from '../../local-storage/local-storage.service';
import { EventInfo, EventSelected } from '../../models/event.model';
import { Session } from '../../models/session.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {
  eventInfo: EventInfo = {
    event: {
      id: '',
      title: '',
      subtitle: '',
      image: ''
    },
    sessions: []
  };
  id: string | null | undefined;
  eventsSelected: EventSelected[] = [];
  eventPosition: number = -1;
  dataNotFound: boolean = false;
  constructor(private localStorage: LocalstorageService, private eventService: EventService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!!this.id) {
      //Cargamos evento seleccionado
      this.eventService.getEventInfo(this.id).subscribe((data: EventInfo | string) => {
        //Cargamos eventos con elementos en el carrito
        let localData = this.localStorage.getItem("eventsSelected");
        this.eventsSelected = localData ? JSON.parse(localData) : [];
        //Controlamos el caso en el que no haya datos del evento seleccionado
        if (typeof data == 'string') {
          this.dataNotFound = true;
          return;
        }
        this.dataNotFound == false;
        this.eventInfo = data;
        this.eventInfo.sessions = data.sessions.sort((a: { date: string; }, b: { date: string; }) => new Date(parseInt(a.date)).getTime() - new Date(parseInt(b.date)).getTime());
        this.eventInfo.sessions = this.eventInfo.sessions.map((session: Session) => {
          session.selected = 0;
          return session;
        })

        //Calculamos la posicion del evento actual entre los eventos seleccionados
        this.eventPosition = this.eventsSelected ? this.eventsSelected.findIndex(ev => ev.id == this.eventInfo.event.id) : -1;

        //Cargamos en el elemento seleccionado si previamente tenia elementos en el carrito
        if (!!this.eventInfo.sessions) {
          this.eventInfo.sessions.map((ses: Session) => {
            let sessionFound = this.eventsSelected[this.eventPosition] ? this.eventsSelected[this.eventPosition].sessions.find(ses2 => ses.date == ses2.date) : null;
            ses.selected = sessionFound ? sessionFound.selected : 0;
            return ses;
          });
        }
      })

    }
  }

  ngOnDestroy() {
    //this.localStorage.clear();
  }

  increment(session: Session) {
    if (session.availability && session.selected < session.availability) {
      session.selected++;
      //Si el evento no esta seleccionado previamente
      if (this.eventPosition < 0) {
        this.eventPosition = 0;
        this.eventsSelected.push({ id: this.eventInfo.event.id, title: this.eventInfo.event.title, sessions: [{ date: session.date.toLocaleString(), selected: 1 }] });
        this.eventPosition = this.eventsSelected.length - 1;
      }
      //Si el evento no esta seleccionado previamente
      else {
        let sessionPosition = this.eventsSelected ? this.eventsSelected[this.eventPosition].sessions.findIndex(ses => ses.date == session.date) : -1;
        //Si la sesion esta seleccionada previamente
        if (sessionPosition < 0) {
          this.eventsSelected[this.eventPosition].sessions.push({ date: session.date.toLocaleString(), selected: 1 })
        }
        //Si la sesion esta seleccionada previamente
        else {
          this.eventsSelected[this.eventPosition].sessions = this.eventsSelected[this.eventPosition].sessions.map(ses => {
            if (session.date == ses.date) {
              ses.selected++;
            }
            return ses;
          });
        }
      }
      this.localStorage.setItem("eventsSelected", JSON.stringify(this.eventsSelected));
    }
  }

  decrement(session: Session) {
    if (session.selected > 0) {
      session.selected--;
      //Disminuye el numero de entradas seleccionadas. Si el número de entradas es 0, la sesion deja de estar seleccionada
      this.eventsSelected[this.eventPosition].sessions = this.eventsSelected[this.eventPosition].sessions.map(ses => {
        if (session.date == ses.date && ses.selected > 0) {
          ses.selected--;
        }
        return ses;
      }).filter(ses => ses.selected > 0);
      //Si el número de sesiones es 0, el evento deja de estar seleccionado
      if (this.eventsSelected[this.eventPosition].sessions.length == 0) {
        this.eventsSelected.splice(this.eventPosition, 1)
        this.eventPosition = -1;
      }
      this.localStorage.setItem("eventsSelected", JSON.stringify(this.eventsSelected));
    }
  }

  remove(data: { session: Session, eventTitle: string }) {
    //Eliminamos la sesion de los eventos seleccionados. Si el evento no tiene mas sesiones, lo eliminamos.
    let removedEventPosition = this.eventsSelected.findIndex(ev => ev.title == data.eventTitle);
    this.eventsSelected[removedEventPosition].sessions = this.eventsSelected[removedEventPosition].sessions.map(ses => {
      if (data.session.date == ses.date && ses.selected > 0) {
        ses.selected--;
      }
      return ses;
    }).filter(ses => ses.selected > 0);
    if (this.eventsSelected[removedEventPosition].sessions.length == 0) {
      this.eventsSelected.splice(removedEventPosition, 1)
    }
    if (data.eventTitle == this.eventInfo.event.title) {
      this.eventInfo.sessions.map((ses: Session) => {
        if (ses.date == data.session.date && ses.selected > 0) {
          ses.selected--;
        }
        return ses;
      })
      //data.session.selected = 0;
    }
    this.localStorage.setItem("eventsSelected", JSON.stringify(this.eventsSelected));
    //Recalculamos la posicion del evento actual
    this.eventPosition = this.eventsSelected ? this.eventsSelected.findIndex(ev => ev.id == this.eventInfo.event.id) : -1;

  }

  getFormattedDate(date: string): string {
    return new Date(parseInt(date)).toLocaleString();
  }
}
