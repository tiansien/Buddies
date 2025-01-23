import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageDto } from 'src/app/interface/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8080/api/messaging';

  constructor(private http: HttpClient) { }

  getLastMessagesWithFollowContacts(userId: string) {
    return this.http.get(`${this.apiUrl}/lastMessagesWithFollowContacts/${userId}`);
  }

  getAllMessagesByConversationId(conversationId: string) {
    return this.http.get(`${this.apiUrl}/allMessagesByConversationId/${conversationId}`);
  }

  sendFirstMessage(messageDto: MessageDto) {
    return this.http.post(`${this.apiUrl}/send`, messageDto);
  }

  setMessageRead(messageId: number) {
    return this.http.post(`${this.apiUrl}/setMessageRead/${messageId}`, {});
  }

}
