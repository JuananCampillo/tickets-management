import { Component } from '@angular/core';
import { EventService } from '../event-service/event.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {
  eventInfo: any = {};
  id: string | null | undefined;
  constructor(private eventService: EventService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.id)
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id)
    if (!!this.id) {
      this.eventService.getEventInfo(this.id).subscribe((data: any) => {
        this.eventInfo = data;
        this.eventInfo.sessions = data.sessions.sort((a: { date: string; }, b: { date: string; }) => new Date(parseInt(a.date)).getTime() - new Date(parseInt(b.date)).getTime());
        this.eventInfo.sessions = this.eventInfo.sessions.map((session:any)=>{
          session.selected=0;
          return session;
        })
        console.log(data)
        console.log(this.eventInfo)
      });



    }
  }
  increment(session: { selected: number; availability: number; }) {
    if (session.selected < session.availability) {
      session.selected++;
    }
  }

  decrement(session: { selected: number; }) {
    if (session.selected > 0) {
      session.selected--;
    }
  }
  getFormattedDate(date: string): string {
    return new Date(parseInt(date)).toLocaleString();
  }
}
