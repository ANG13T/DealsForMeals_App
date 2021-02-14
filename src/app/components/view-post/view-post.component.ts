import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
})
export class ViewPostComponent implements OnInit {

  post: Post;
  origin: string;
  postID: string;
  isOwner: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(this.post == null){
        this.postID = params['id']; 
        //get post data
      }
    });
  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

}
