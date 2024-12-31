import { Component, Input } from '@angular/core';
import { CoreService } from '../../service/core/core.service';
import { WebsocketService } from '../../service/websocket/websocket.service';

@Component({
	selector: 'app-home',
	imports: [],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss'
})
export class HomeComponent {
	constructor(
		public coreService: CoreService,
		private webSocketService: WebsocketService
	) {}

	@Input() isInQueue!: boolean;

    ngOnInit(): void {
		
	}

	onJoinQueue() {
		this.coreService.enterQueue();
		this.webSocketService.sendMessage('[queue] join');
	}

	onLeaveQueue() {
		this.coreService.init();
		this.webSocketService.closeAndReconnect();
	}
}
