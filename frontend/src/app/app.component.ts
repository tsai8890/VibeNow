import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { CoreService } from '../service/core/core.service';
import { WebsocketService } from '../service/websocket/websocket.service';

@Component({
    selector: 'app-root',
    template: `
        @if (coreService.isInit()) {
            <app-home [isInQueue]="coreService.inQueue()"></app-home>
        } @else if (coreService.inQueue() || coreService.inRoom() || coreService.isTheOtherLeft()) {
            <app-chatroom></app-chatroom>
        } @else {
            <p>Something went wrong...</p>
        }
    `,
    imports: [HomeComponent, ChatroomComponent]
})
export class AppComponent {
    constructor(
        public coreService: CoreService,
        private webSocketService: WebsocketService
    ) {}

    ngOnInit(): void {
        this.webSocketService.connect();
        this.coreService.init();

        this.webSocketService.getMessages().subscribe((message: string) => {
            if (message.startsWith('[queue] entered')) {
                // message = '[queue] entered UID'
                let [_, __, uid] = message.split(' ');
                this.coreService.setUID(uid);
                this.coreService.enterQueue();
            }
            else if (message.startsWith('[queue] matched')) {
                // message = '[queue] matched RID'
                let [_, __, rid] = message.split(' ');
                this.coreService.setRID(rid);
                this.coreService.enterRoom();
                this.coreService.updateDate();
            }
        });
    }

}