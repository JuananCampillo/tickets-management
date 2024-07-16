import { Session } from "./session.model"

export interface Event {
    id: string,
    title: string,
    subtitle: string,
    image: string,
    place: string,
    startDate: string,
    endDate: string,
    description: string
}

export interface EventInfo {
    event: {
        id: string,
        title: string,
        subtitle: string,
        image: string
    },
    sessions: Session[]
}

export interface EventSelected {
    id: string,
    title: string,
    sessions: Session[]
}