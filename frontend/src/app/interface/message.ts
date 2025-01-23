export interface MessageDto {
    fromUserId: string;
    userIds: number[];
    content: string;
    conversationName: string;
    isGroup: boolean;
}