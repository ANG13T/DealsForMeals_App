import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {

  post: Post = {title: "", description: "", userProfile: null, images: [], amount: 1};
  errors = {title: "", description: "", amount: ""};
  loading: boolean = false;
  imageLoading: boolean = false;
  complete: boolean = false;

  constructor(private modalController: ModalController, private router: Router, private userService: UserService, private postService: PostService, private storage: AngularFireStorage) { 
    this.userService.user$.subscribe((userProfile) => {
      if(userProfile){
        this.post.userProfile = userProfile;
      }
    })
  }

  ngOnInit() {
    
  }

  dismissModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  goToProfile(){
    //send eveent back with new post data
    this.dismissModal();
  }

  onDrop(files: FileList){
    let profileImage = files[0];
    this.uploadTask(profileImage);
  }

  uploadTask(file: File){
    let task: AngularFireUploadTask;
    let downloadURL;
    this.imageLoading = true;

     // The storage path
    const path = `files/${Date.now()}_${file.name}`;
     // Reference to storage bucket
    const ref = this.storage.ref(path);
    console.log(ref);

     // The main task
    task = this.storage.upload(path, file);


    task.snapshotChanges().pipe(
       // The file's download URL
       finalize(async () =>  {
         downloadURL = await ref.getDownloadURL().toPromise();
         this.post.images.push(downloadURL);
         this.imageLoading = false;
       })
     ).subscribe();

  }

  navigate(route: string){
    this.router.navigate([`/${route}`]);
  }

  validateForm(){
    if(this.post.title.length < 5){
      this.errors.title = "Title must be longer than 5 letters";
      return false;
    }

    if(this.post.title.length >= 80){
      this.errors.title = "Title must be shorter than 80 letters";
      return false;
    }

    if(this.post.description.length >= 200){
      this.errors.description = "Title must be shorter than 200 letters";
      return false;
    }

    if(this.post.userProfile == null){
      alert("Something went wrong.");
      return false;
    }

    if(this.imageLoading){
      alert("Image Uploading...");
      return false;
    }

    if(this.post.description.length < 10){
      this.errors.description = "Title must be longer than 10 letters";
      return false;
    }
    return true;
  }

  compareWithFn = (o1, o2) => {
    return o1 == o2;
  };

  async createPost(){
    this.loading = true;
    if(this.validateForm()){
      await this.postService.createPost(this.post).then((result) => {
        this.loading = false;
        this.complete = true;
      })  
    }
  }

}
