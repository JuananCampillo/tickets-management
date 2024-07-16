import { Component } from '@angular/core';
import { EventService } from '../event-service/event.service';
import { ActivatedRoute } from '@angular/router';
import { LocalstorageService } from '../local-storage/local-storage.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {
  eventInfo: any = {};
  id: string | null | undefined;
  eventsSelected: { id: string, title: string, sessions: { date: string, selected: number }[] }[] = [];
  eventPosition: number = -1;
  constructor(private localStorage: LocalstorageService, private eventService: EventService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!!this.id) {
      this.eventService.getEventInfo(this.id).subscribe((data: any) => {
        this.eventInfo = data;
        this.eventInfo.sessions = data.sessions.sort((a: { date: string; }, b: { date: string; }) => new Date(parseInt(a.date)).getTime() - new Date(parseInt(b.date)).getTime());
        this.eventInfo.sessions = this.eventInfo.sessions.map((session: any) => {
          session.selected = 0;
          return session;
        })
      })
      let data = this.localStorage.getItem("eventsSelected");
      this.eventsSelected = data ? JSON.parse(data) : [];
      this.eventPosition = this.eventsSelected ? this.eventsSelected.findIndex(ev => ev.id == this.eventInfo.event.id) : -1;


    }
  }

  ngOnDestroy() {
    //this.localStorage.clear();
  }

  increment(session: { date: string; selected: number; availability: number; }) {
    if (session.selected < session.availability) {
      session.selected++;
      //Si el evento no esta seleccionado previamente
      if (this.eventPosition < 0) {
        console.log(this.eventInfo)
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
              console.log('==')
              ses.selected++;
            }
            return ses;
          });
          console.log(this.eventsSelected)
        }
      }
      this.localStorage.setItem("eventsSelected", JSON.stringify(this.eventsSelected));
    }
  }

  decrement(session: { date: string; selected: number; }) {
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

  remove(data: { session: { date: string; selected: number; }, eventTitle: string }) {
    //Eliminamos la sesion de los eventos seleccionados. Si el evento no tiene mas sesiones, lo eliminamos.
    let removedEventPosition = this.eventsSelected.findIndex(ev => ev.title == data.eventTitle);
    this.eventsSelected[removedEventPosition].sessions = this.eventsSelected[removedEventPosition].sessions.filter(ses => ses.date != data.session.date)
    if (this.eventsSelected[removedEventPosition].sessions.length == 0) {
      this.eventsSelected.splice(removedEventPosition, 1)
    }
    if (data.eventTitle == this.eventInfo.event.title) {
      this.eventInfo.sessions.map((ses: { date: string; selected: number; }) => {
        if (ses.date == data.session.date) {
          ses.selected = 0;
        }
        return ses;
      })
      data.session.selected = 0;
    }
    this.localStorage.setItem("eventsSelected", JSON.stringify(this.eventsSelected));
    //Recalculamos la posicion del evento actual
    this.eventPosition = this.eventsSelected ? this.eventsSelected.findIndex(ev => ev.id == this.eventInfo.event.id) : -1;

  }
  
  getFormattedDate(date: string): string {
    return new Date(parseInt(date)).toLocaleString();
  }
}
