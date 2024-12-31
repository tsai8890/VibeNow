import {MatIconModule} from '@angular/material/icon'
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Message } from '../../models/Message';
import { WebsocketService } from '../../service/websocket/websocket.service';
import { CoreService } from '../../service/core/core.service';

@Component({
  selector: 'app-chatroom',
  imports: [FormsModule, MatIconModule],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent {
	messages = signal<Message[]>([]);
	currentMessageID = signal(0);
	inputMessage = '';
	
	@ViewChild('chatContainer') chatContainer!: ElementRef;

	constructor(
		public coreService: CoreService,
		private webSocketService: WebsocketService
	) {}

	ngAfterViewChecked() {
		this.scrollToBottom();
	}

	scrollToBottom(): void {
		try {
			this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
		} catch (err) {
			console.error('Failed to scroll:', err);
		}
	}

	updateMessage(message: Message): void {
		let currentMessages = this.messages();
		currentMessages.push(message);

		this.messages.set(currentMessages);
		this.currentMessageID.update(currentMID => currentMID + 1);
	}

	onSendMessage() {
		if (this.inputMessage.length === 0) {
			return;
		}

		const sentDate = new Date();

		this.updateMessage({
			text: this.inputMessage,
			messageID: this.currentMessageID(),
			date: sentDate,
			HMDateStr: `${String(sentDate.getHours()).padStart(2, '0')}:`
					 + `${String(sentDate.getMinutes()).padStart(2, '0')}`,
			uidFrom: this.coreService.uid()
		} as Message)

		this.webSocketService.sendMessage(`[message] ${this.inputMessage}`);
		this.inputMessage = '';
	}

	ngOnInit(): void {
		this.webSocketService.getMessages().subscribe((message: string) => {
			if (message.startsWith('[message]')) {
				// message: '[message] [UID] text'
				let parts = message.split(']');
				let uidFrom = parts[1].slice(2);
				let text = parts[2].slice(1);
				
				if (uidFrom !== this.coreService.uid()) {
					const receivedDate = new Date();
					this.updateMessage({
						text: text,
						messageID: this.currentMessageID(),
						date: receivedDate,
						HMDateStr: `${String(receivedDate.getHours()).padStart(2, '0')}:`
								 + `${String(receivedDate.getMinutes()).padStart(2, '0')}`,
						uidFrom: uidFrom
					} as Message);
				}
			}
        });
	}
}