import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsService } from 'src/app/core/services/api/comments.service';
import { EventService } from 'src/app/core/services/api/event.service';
import { LikeService } from '../../../core/services/api/like.service';
import { Comment } from 'src/app/interface/comment';
import { formatDistanceToNow } from 'date-fns';
import {
  EventRole,
  EventTypeRoles,
  Participation,
} from 'src/app/interface/participant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ParticipantService } from 'src/app/core/services/api/participant.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  eventId: string = '';
  details: any = null;
  images: string[] = [];
  loading: boolean = true;
  newComment: string = '';

  // Application modal
  isModalVisible = false;
  selectedRole: string = '';
  applicationNote: string = '';

  // New properties for organizer positions
  organizerPositions = [
    {
      name: 'Program Director',
      description: 'Oversee event schedule and activities',
    },
    {
      name: 'Secretary',
      description: 'Handle documentation and communication',
    },
    {
      name: 'Treasurer',
      description: 'Manage event budget and finances',
    },
    {
      name: 'Logistics Coordinator',
      description: 'Coordinate venue and equipment setup',
    },
    {
      name: 'Marketing Lead',
      description: 'Handle event promotion and outreach',
    },
  ];

  selectedPosition: string = '';
  showPositionSelection: boolean = false;
  errorMessage: string = '';

  eventRoles: EventTypeRoles = {
    workshop: [
      {
        name: 'Attendee',
        description:
          'Participate in the workshop activities and learning sessions',
        available: true,
      },
      {
        name: 'Speaker',
        description: 'Lead workshop sessions and share expertise',
        available: true,
      },
      {
        name: 'Organizer',
        description: 'Manage workshop logistics and coordination',
        available: true,
      },
    ],
    seminars: [
      {
        name: 'Attendee',
        description: 'Participate in seminar sessions',
        available: true,
      },
      {
        name: 'Organizer',
        description: 'Handle seminar planning and execution',
        available: true,
      },
    ],
    'networking event': [
      {
        name: 'Attendee',
        description: 'Connect with other professionals',
        available: true,
      },
      {
        name: 'Organizer',
        description: 'Facilitate networking activities',
        available: true,
      },
    ],
    conferences: [
      {
        name: 'Attendee',
        description: 'Access all conference sessions and activities',
        available: true,
      },
      {
        name: 'Speaker',
        description: 'Present at conference sessions',
        available: true,
      },
      {
        name: 'Organizer',
        description: 'Manage conference operations',
        available: true,
      },
    ],
  };

  comments: Comment[] = [];
  likes: number = 0;
  isLiked: boolean = false;
  showEdit: boolean = false;
  userId = localStorage.getItem('userId') || '';
  isExpiredEvent: boolean = false;
  participantStatus: string = '';
  role: string = localStorage.getItem('role') || '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private crd: ChangeDetectorRef,
    private commentService: CommentsService,
    private likeService: LikeService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private participantService: ParticipantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.loadDetails();
    this.loading = false;
    this.checkLikeStatus();
    this.loadComments();
    this.loadForParticipantStatus();
  }

  loadDetails(): void {
    this.eventService.getEventByEventId(this.eventId).subscribe({
      next: (response: any) => {
        console.log('Event details:', response);
        this.details = response;
        this.showEdit = this.userId == response.userId;
        this.isExpiredEvent = new Date(response.applyDueDate) <= new Date();

        if (
          response.eventPictureUrls &&
          Array.isArray(response.eventPictureUrls)
        ) {
          this.images = response.eventPictureUrls;
        }
        this.crd.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching event details:', error);
      },
    });
  }

  editEvent(): void {
    this.router.navigate(['default/events/edit', this.eventId]);
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  }

  toggleLike() {
    const eventIdNumber = parseInt(this.eventId);
    this.likeService.toggleEventLike(this.userId, eventIdNumber).subscribe({
      next: () => {
        this.isLiked = !this.isLiked;
        this.likes += this.isLiked ? 1 : -1;
        this.crd.markForCheck();
      },
      error: (error) => console.error('Error toggling like:', error),
    });
  }

  checkLikeStatus() {
    this.likeService
      .getEventLikeStatus(this.userId, parseInt(this.eventId))
      .subscribe({
        next: (response: { likeByMe: string; count: string }) => {
          this.likes = parseInt(response.count);
          this.isLiked = response.likeByMe === 'true';
          this.crd.markForCheck();
        },
        error: (error) => console.error('Error fetching like status:', error),
      });
  }

  loadComments(): void {
    this.commentService.getCommentWithProfile(this.eventId, 'event').subscribe({
      next: (response: any) => {
        const userProfileData = response.userProfile.reduce(
          (acc: any, curr: any) => {
            if (!acc[curr[0].id]) acc[curr[0].id] = {};
            Object.assign(acc[curr[0].id], ...curr);
            return acc;
          },
          {}
        );

        const commentsWithProfiles = response.comment.map((comment: any) => ({
          ...comment,
          userProfile: userProfileData[comment.id],
        }));

        this.comments = commentsWithProfiles;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching comments:', error),
    });
  }

  submitComment(): void {
    if (!this.newComment.trim()) return;
    const comment = {
      referenceID: this.eventId,
      type: 'event',
      content: this.newComment,
      id: localStorage.getItem('userId'),
    };

    this.commentService.addComment(comment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments();
        this.crd.markForCheck();
      },
      error: (error) => console.error('Error submitting comment:', error),
    });
  }

  showApplyModal(): void {
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.selectedRole = '';
    this.selectedPosition = '';
    this.showPositionSelection = false;
    this.applicationNote = '';
    this.errorMessage = '';
  }

  handleOk(): void {
    if (!this.selectedRole) {
      return;
    }
    if (!this.applicationNote) {
      this.errorMessage = 'Please provide an application note';
      this.cdr.detectChanges();
      return;
    }

    if (this.selectedRole === 'Organizer' && !this.selectedPosition) {
      this.errorMessage = 'Please select an organizer position';
      this.cdr.detectChanges();
      return;
    }

    if (this.selectedRole === 'Organizer') {
      this.selectedRole =
        this.selectedRole + ' (' + this.selectedPosition + ')';
    }

    const participation: Participation = {
      role: this.selectedRole,
      applyReason: this.applicationNote,
      // position:
      //   this.selectedRole === 'Organizer' ? this.selectedPosition : undefined,
    };

    this.participantService
      .addParticipant(
        parseInt(this.userId),
        parseInt(this.eventId),
        participation
      )
      .subscribe({
        next: (response) => {
          console.log('Application submitted:', response);
          this.ngOnInit();

          this.modal.success({
            nzTitle: 'Application Submitted',
            nzContent:
              'Your application has been successfully submitted. We will review it and get back to you soon.',
          });

          this.handleCancel();
        },
        error: (error) => {
          console.error('Error submitting application:', error);
        },
      });
  }

  getAvailableRoles(): EventRole[] {
    return this.eventRoles[this.details?.eventType.toLowerCase()] || [];
  }

  loadForParticipantStatus(): void {
    this.participantService
      .participantsStatus(parseInt(this.eventId), parseInt(this.userId))
      .subscribe({
        next: (response) => {
          console.log('Participant status:', response);
          this.participantStatus = response.status || '';
        },
        error: (error) => {
          console.error('Error fetching participant status:', error);
        },
      });
  }

  redirectToProfile(comment: Comment) {
    this.router.navigate(['default/profile', comment.userProfile?.id]);
  }

  onRoleSelect(roleName: string): void {
    this.selectedRole = roleName;
    this.showPositionSelection = roleName === 'Organizer';
    if (!this.showPositionSelection) {
      this.selectedPosition = '';
    }
    this.errorMessage = '';
  }
}
