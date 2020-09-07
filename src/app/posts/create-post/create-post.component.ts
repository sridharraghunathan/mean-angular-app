import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  // @Output() postCreated = new EventEmitter<Post>();
  // enteredTitle = '';
  // enteredContent = '';

  authSubscription: Subscription;
  posts: Post;
  mode: string = 'create';
  postId: string = null;
  post: Post;
  form: FormGroup;
  isLoading = false;
  imagePreview: string | ArrayBuffer;

  constructor(
    private postService: PostService,
    public router: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: Validators.required }),
    });

    this.authSubscription = this.authService
      .getAuthenticated()
      .subscribe((auth) => {
        this.isLoading = false;
      });

    this.router.paramMap.subscribe((paramsmap) => {
      if (paramsmap.has('postId')) {
        this.mode = 'edit';
        this.isLoading = true;
        this.postId = paramsmap.get('postId');
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.form.patchValue({
            title: postData['post'].title,
            content: postData['post'].content,
            image: postData['post'].imagePath,
          });

          if (postData['post'].imagePath) {
            this.imagePreview = postData['post'].imagePath;
          }
        });
      }
    });
  }

  onImagePick(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onSavePost() {
    if (this.form.invalid) {
      return '';
    }
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.addPosts(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
 
    // this.posts = {
    //   title: postForm.value.title,
    //   content: postForm.value.content,
    // };
    // this.postCreated.emit(this.posts);
  }
}
