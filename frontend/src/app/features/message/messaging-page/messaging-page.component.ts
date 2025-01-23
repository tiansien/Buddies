import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/core/services/api/message.service';
import { ProfileService } from 'src/app/core/services/api/profile.service';
import { MessageDto } from 'src/app/interface/message';

@Component({
  selector: 'app-messaging-page',
  templateUrl: './messaging-page.component.html',
  styleUrls: ['./messaging-page.component.css'],
})
export class MessagingPageComponent implements OnInit {
  
  // contacts = [
  //   { name: 'Testing Name 1', faculty: 'Faculty SKTM', year: 'Year 3 Semester 1', lastMessage: 'Last message', avatarUrl: 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg', id:'2'  },
  //   { name: 'Testing Name 2', faculty: 'Faculty SKTM', year: 'Year 3 Semester 1', lastMessage: 'Last message', avatarUrl: 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg', id:'2'  },
  //   { name: 'Testing Name 3', faculty: 'Faculty SKTM', year: 'Year 3 Semester 1', lastMessage: 'Last message', avatarUrl: 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg', id:'2'  },
  //   { name: 'Testing Name 4', faculty: 'Faculty SKTM', year: 'Year 3 Semester 1', lastMessage: 'Last message', avatarUrl: 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg', id:'2' },
  //   // more contacts here
  // ];
  contacts: any[] = [];
  selectedContact: any;
  userId: string | null = localStorage.getItem('userId');

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  private async initializeComponent(): Promise<void> {
    await this.getContactListWithLastMessage();
    
    this.route.params.subscribe(params => {
      const contactId = params['contactId'];
      if (contactId && this.contacts.length > 0) {
        this.selectedContact = this.contacts.find(
          contact => contact.id === Number(contactId) || contact.id === contactId
        );
      }
      this.cdr.detectChanges();
    });
  }

  onSelectContact(contact: any) {
    this.selectedContact = contact;
    this.cdr.detectChanges();
  }

  // This method will be called when a message is sent
  onMessageSent() {
    console.log('Message sent, updating contact list');
    this.getContactListWithLastMessage();
  }

  async getContactListWithLastMessage(): Promise<void> {
    if (!this.userId) return;

    try {
      const response = await this.messageService.getLastMessagesWithFollowContacts(this.userId).toPromise();
      if (response) {
        this.contacts = Array.isArray(response) ? response.map((item: any) => ({
          ...item.user,
          lastMessage: item.lastmessage?.content || 'No message',
          lastMessageTimestamp: item.lastmessage?.timestamp,
          avatarUrl: 'http://localhost:8080/download/user/' + item.user.profilePhoto,
          conversationId: item.lastmessage?.conversationID,
          faculty: item.profile?.fac,
          program: item.profile?.program,
          year: item.profile?.yearOfStudy
        })) : [];

        // Sort contacts by latest message
        this.contacts.sort((a, b) => {
          const dateA = new Date(a.lastMessageTimestamp || 0);
          const dateB = new Date(b.lastMessageTimestamp || 0);
          return dateB.getTime() - dateA.getTime();
        });

        // Update selected contact with new data
        if (this.selectedContact) {
          const updatedSelectedContact = this.contacts.find(c => c.id === this.selectedContact.id);
          if (updatedSelectedContact) {
            this.selectedContact = updatedSelectedContact;
          }
        }

        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error fetching contact list:', error);
    }
  }
}
