import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {

  post: Post;
  initPost: Post;
  errors = {title: "", description: "", amount: ""};
  imageLoading: boolean = false;
  loading: boolean = false;

  constructor(private _modalController: ModalController, private storage: AngularFireStorage, private postService: PostService) { }

  ngOnInit() {
    this.initPost = this.post;
    console.log("init", this.initPost)
  }

  dismissModal(status?: string, post?: Post){
    this._modalController.dismiss({
      'dismissed': true,
      status: status,
      data: post
    });
  }

  compareWithFn = (o1, o2) => {
    return o1 == o2;
  };

  updatePost(){
    if(this.validateForm()){
      this.loading = true;
      this.postService.updateDeal(this.post).then(() => {
        this.loading = false;
        this.dismissModal('edit', this.post);
      })
    }
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

  onDrop(files: FileList){
    let profileImage = files[0];
    this.uploadTask(profileImage);
  }

  isDifferent(){
    return JSON.stringify(this.post) != JSON.stringify(this.initPost);
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

}
