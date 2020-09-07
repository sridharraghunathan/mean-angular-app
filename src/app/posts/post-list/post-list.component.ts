import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() postsArr :Post[];
  postsArr: Post[] = [];
  postSubscription: Subscription;
  authSubscription: Subscription;
  userId: string;
  isLoading = false;
  totalSize = 10;
  postPerPage = 10;
  currentpage = 1;
  userIsAuthenticated: boolean = false;
  pageSizeOptions = [1, 2, 5, 10, 20];

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postService.getPosts(this.postPerPage, this.currentpage);
    this.postSubscription = this.postService
      .getPostUpdated()
      .subscribe((data: { posts: Post[]; totalposts: number }) => {
        this.isLoading = false;
        this.postsArr = data.posts;
        this.totalSize = data.totalposts;
      });

    this.userIsAuthenticated = this.authService.getAuthState();

    this.authSubscription = this.authService
      .getAuthenticated()
      .subscribe((auth) => {
        this.userId = this.authService.getUserId();
        this.userIsAuthenticated = auth;
      });
  }

  onChangePage(pageEvent: PageEvent) {
    this.isLoading = true;
    this.postPerPage = pageEvent.pageSize;
    this.currentpage = pageEvent.pageIndex + 1;
    this.postService.getPosts(this.postPerPage, this.currentpage);
  }
  onDelete(id: string) {
    this.postService.deletePost(id).subscribe(
      (data) => {
        this.postService.getPosts(this.postPerPage, this.currentpage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
