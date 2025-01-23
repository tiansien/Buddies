import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/api/message.service';
import { MessageDto } from 'src/app/interface/message';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css'],
})
export class ChatAreaComponent implements OnInit {
  @Input() selectedContact: any;
  @Output() messageSent = new EventEmitter<void>();
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  messages: any[] = [];
  newMessage: string = '';
  userId: string | null = localStorage.getItem('userId');

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.selectedContact?.conversationId) {
      this.getAllMessages();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedContact'] && changes['selectedContact'].currentValue) {
      this.messages = [];
      this.getAllMessages();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim()) {
      const messageContent = this.newMessage;
      this.newMessage = '';

      try {
        const message: MessageDto = {
          fromUserId: this.userId || '',
          userIds: [this.selectedContact.id, this.userId],
          content: messageContent,
          conversationName: 'private',
          isGroup: false,
        };

        // Send message
        await this.messageService.sendFirstMessage(message).toPromise();

        // Refresh messages
        await this.getAllMessages();

        // Emit event to parent to update contact list
        this.messageSent.emit();

        // Scroll to bottom after sending
        this.scrollToBottom();
      } catch (error) {
        console.error('Error sending message:', error);
        // Optionally handle error (e.g., show error message)
      }
    }
  }

  getAllMessages(): void {
    if (!this.selectedContact?.conversationId) {
      console.log('No conversation ID available');
      return;
    }

    this.messageService
      .getAllMessagesByConversationId(this.selectedContact.conversationId)
      .subscribe({
        next: (response: any) => {
          this.messages = response.map((message: any) => ({
            content: message.content,
            sentBy: message.fromUserId === this.userId ? 'me' : 'contact',
            timestamp: message.timestamp,
          }));
          this.cdr.detectChanges();
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error fetching messages:', error);
        },
      });
  }

  redirectToprofile(id: number) {
    console.log('Redirecting to profile:', id);
    // Implement redirect logic
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/default/profile/', id]);
    });
  }
}