import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[]; totalposts: number }>();
  totalposts: number;
  BACKEND_URL = environment.apiUrl + '/posts';

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentpage: number) {
    const queryParams = `?currentpage=${currentpage}&pagesize=${postPerPage}`;

    this.http
      .get<{ status: string; posts: any; totalposts: number }>(
        this.BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            totalposts: postData.totalposts,
          };
        })
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.totalposts = postData.totalposts;
        // we are just taking copy of the array by using ES6 destructuring
        this.postUpdated.next({
          posts: [...this.posts],
          totalposts: this.totalposts,
        });
      });
    // return [...this.posts];
    // return this.posts;
  }

  getPostUpdated() {
    return this.postUpdated.asObservable();
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let post;
    if (typeof image === 'object') {
      post = new FormData();
      post.append('title', title);
      post.append('content', content);
      post.append('image', image, title);
    } else {
      post = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http.patch(this.BACKEND_URL + '/' + id, post).subscribe((res) => {
      this.router.navigate(['/']);
    });
  }

  getPost(postId: string) {
    return this.http.get(this.BACKEND_URL + '/' + postId);

    // return { ...this.posts.find((p) => p.id === postId) };
  }
  addPosts(title: string, content: string, image: File) {
    //  const post: Post = { id: null, title, content };
    //  For sending the Image to Backend we cannot send the data as Json Format
    //  Instead we need to send as FormData

    const post = new FormData();
    post.append('title', title);
    post.append('content', content);
    post.append('image', image, title);
    this.http
      .post<{ status: string; post: Post }>(this.BACKEND_URL, post)
      .subscribe((response) => {
        // const postData = {
        //   id: response.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: response.post.imagePath,
        // };
        // this.posts.push(postData);
        // //After updating the post taking the copy of the posts
        // this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete<{ status: string }>(this.BACKEND_URL + '/' + id);
    // .subscribe((res) => {
    //   const updated = this.posts.filter((p) => p.id !== id);
    //   this.posts = updated;
    //    this.postUpdated.next([...this.posts]);
    // });
  }
}
