import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Deal } from 'src/app/shared/models/deal.model';
import { DealService } from 'src/app/shared/services/deal.service';


@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {

  post: Deal;
  initPost: Deal;
  errors = {title: "", description: "", amount: ""};
  imageLoading: boolean = false;
  loading: boolean = false;

  constructor(private _modalController: ModalController, private storage: AngularFireStorage, private dealService: DealService) { 
    
  }

  ngOnInit() {
    this.initPost = JSON.parse(JSON.stringify(this.post));
  }

  dismissModal(status?: string, post?: Deal){
    if(status == "" || post == null){
      this._modalController.dismiss({
        'dismissed': true,
        data: this.initPost
      })
    }else{
      this._modalController.dismiss({
        'dismissed': true,
        status: status,
        data: post
      });
    }
  }

  compareWithFn = (o1, o2) => {
    return o1 == o2;
  };

  updatePost(){
    if(this.validateForm()){
      this.loading = true;
      this.dealService.updateDeal(this.post).then(() => {
        this.loading = false;
        this.dismissModal('edit', this.post);
      })
    }
  }

  removeImage(image: string){
    this.post.images = this.post.images.filter((url) => url != image);
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
    if(this.initPost.title != this.post.title){
      return true;
    }
    if(this.initPost.description != this.post.description){
      return true;
    }
    
    if(JSON.stringify(this.initPost.images) !==JSON.stringify(this.post.images)){
      return true;
    }
    return false;
  }


  uploadTask(file: File){
    let task: AngularFireUploadTask;
    let downloadURL;
    this.imageLoading = true;

     // The storage path
    const path = `files/${Date.now()}_${file.name}`;
     // Reference to storage bucket
    const ref = this.storage.ref(path);

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
