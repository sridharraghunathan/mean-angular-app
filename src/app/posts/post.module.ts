import { NgModule } from '@angular/core';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostListComponent } from './post-list/post-list.component';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from 'src/angular.material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CreatePostComponent, PostListComponent],
  imports: [
    AngularMaterialModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class PostModule {}
