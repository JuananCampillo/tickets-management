import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { EventService } from '../../event-service/event.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocalstorageService } from '../../local-storage/local-storage.service';
import { EventInfo, EventSelected } from '../../models/event.model';
import { Session } from '../../models/session.model';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { DatePipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit, OnDestroy {

  eventInfo$: BehaviorSubject<EventInfo> = new BehaviorSubject<EventInfo>(this.initializeEventInfo());
  eventsSelected$: BehaviorSubject<EventSelected[]> = new BehaviorSubject<EventSelected[]>([]);
  eventPosition$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  dataNotFound$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private localStorage: LocalstorageService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => window.scrollTo(0, 0));
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEventInfo(id);
    }
    this.eventsSelected$.subscribe(eventsSelected => {
      this.updateEventPosition();
      this.updateSessionSelection();
    })
  }

  ngOnDestroy() {
    this.eventsSelected$.unsubscribe()
  }

  private initializeEventInfo(): EventInfo {
    return {
      event: { id: '', title: '', subtitle: '', image: '' },
      sessions: []
    };
  }

  private loadEventInfo(id: string): void {
    this.eventService.getEventInfo(id).subscribe((data: EventInfo | string) => {
      this.eventsSelected$.next(this.loadEventsFromLocalStorage());

      if (typeof data === 'string') {
        this.dataNotFound$.next(true);
        return;
      }

      this.dataNotFound$.next(false);
      const eventInfo = this.processEventInfo(data);
      this.eventInfo$.next(eventInfo);
      this.updateEventPosition();
      this.updateSessionSelection();
    });
  }

  private loadEventsFromLocalStorage(): EventSelected[] {
    const localData = this.localStorage.getItem("eventsSelected");
    return localData ? JSON.parse(localData) : [];
  }

  private processEventInfo(data: EventInfo): EventInfo {
    data.sessions = data.sessions.sort((a, b) => new Date(parseInt(a.date)).getTime() - new Date(parseInt(b.date)).getTime());
    data.sessions = data.sessions.map(session => ({ ...session, selected: 0 }));
    return data;
  }

  private updateEventPosition(): void {
    const eventPosition = this.eventsSelected$.value.findIndex(ev => ev.id === this.eventInfo$.value.event.id);
    this.eventPosition$.next(eventPosition);
  }

  //Cargamos en el elemento seleccionado si previamente tenia elementos en el carrito
  private updateSessionSelection(): void {
    if (this.eventInfo$.value.sessions) {
      this.eventInfo$.value.sessions.forEach(session => {
        const sessionFound = this.eventsSelected$.value[this.eventPosition$.value]?.sessions.find(ses => ses.date === session.date);
        session.selected = sessionFound ? sessionFound.selected : 0;
      });
    }
  }

  increment(session: Session): void {
    if (session.availability && session.selected < session.availability) {
      session.selected++;
      this.updateEventsSelected(session, 1);
    }
  }

  decrement(session: Session): void {
    if (session.selected > 0) {
      session.selected--;
      this.updateEventsSelected(session, -1);
    }
  }

  private updateEventsSelected(session: Session, change: number): void {
    const eventsSelected = this.eventsSelected$.value;
    let eventPosition = this.eventPosition$.value;
    //Si el evento no esta seleccionado previamente, lo añadimos
    if (eventPosition < 0) {
      eventPosition = eventsSelected.length;
      eventsSelected.push({ id: this.eventInfo$.value.event.id, title: this.eventInfo$.value.event.title, sessions: [{ date: session.date.toLocaleString(), selected: 1 }] });
    }
    //Si el evento no esta seleccionado previamente
    else {
      const sessionPosition = eventsSelected[eventPosition].sessions.findIndex(ses => ses.date === session.date);
      //Si la sesion no esta seleccionada previamente, añadimos la sesion
      if (sessionPosition < 0) {
        eventsSelected[eventPosition].sessions.push({ date: session.date.toLocaleString(), selected: 1 });
      }
      //Si la sesion esta seleccionada previamente, añadimos/restamos un asiento
      else {
        eventsSelected[eventPosition].sessions[sessionPosition].selected += change;
        if (eventsSelected[eventPosition].sessions[sessionPosition].selected <= 0) {
          eventsSelected[eventPosition].sessions.splice(sessionPosition, 1);
        }
      }
    }
    //Si el número de sesiones es 0, el evento deja de estar seleccionado
    if (eventsSelected[eventPosition].sessions.length === 0) {
      eventsSelected.splice(eventPosition, 1);
      this.eventPosition$.next(-1);
    } else {
      this.eventPosition$.next(eventPosition);
    }

    this.localStorage.setItem("eventsSelected", JSON.stringify(eventsSelected));
    this.eventsSelected$.next(eventsSelected);
  }

  updateInfoSessions(): void {
    this.eventsSelected$.next(this.loadEventsFromLocalStorage());
  }

  getFormattedDate(date: string): string | null {
    return this.datePipe.transform(new Date(parseInt(date)), 'dd/MM/yyyy');
  }
}
