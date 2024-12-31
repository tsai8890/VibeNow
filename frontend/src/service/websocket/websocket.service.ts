import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ENV } from '../../environment';
import { PROD_ENV } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket = new WebSocket('');
  private messageSubject: Subject<any> = new Subject<any>();
  private statusSubject: Subject<string> = new Subject<string>();

  constructor() {}

  connect() {
    this.socket = new WebSocket(PROD_ENV.SOCKET_SERVER_URL || ENV.SOCKET_SERVER_URL);
    
    this.socket.onopen = () => {
      this.statusSubject.next('open');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event: CloseEvent) => {
      this.statusSubject.next('closed');
    };
  
    this.socket.onerror = (event: Event) => {
      this.statusSubject.next('error');
    };
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  getStatus(): Observable<any>{
    return this.statusSubject.asObservable();
  }

  closeAndReconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Normal closure');
    }
    this.connect();
  }
}
