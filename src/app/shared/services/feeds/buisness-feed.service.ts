import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QueryDocumentSnapshot }
  from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/internal/operators/take';
import { User } from '../../models/user.model';

export interface Item {
  id: string;
  ref: DocumentReference;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class BuisnessFeedService {
  private itemsSubject: BehaviorSubject<Item[] | undefined> =
    new BehaviorSubject(undefined);
  private lastPageReached: BehaviorSubject<boolean> =
    new BehaviorSubject(false);

  private nextQueryAfter: QueryDocumentSnapshot<User>;

  private paginationSub: Subscription;
  private findSub: Subscription;

  constructor(private fireStore: AngularFirestore) {
  }
  destroy() {
    this.unsubscribe();
  }

  find() {
    try {
      console.log("finding")
      const collection: AngularFirestoreCollection<User> = 
                        this.getCollectionQuery();
  
      this.unsubscribe();
  
      this.paginationSub = collection.get()
                           .subscribe(async (first) => {
        this.nextQueryAfter = first.docs[first.docs.length - 1] as          
                              QueryDocumentSnapshot<User>;
  
        await this.query(collection);
      });
    } catch (err) {
      throw err;
    }
  }
  

  // TODO: use closeset to you instead of created at to order by
  private getCollectionQuery(): AngularFirestoreCollection<User> {
    console.log("getting collection query")
    if (this.nextQueryAfter) {
      return this.fireStore.collection<User>('/users/', ref =>
             ref.orderBy('name', 'desc')
               .startAfter(this.nextQueryAfter)
               .limit(10));
    } else {
      return this.fireStore.collection<User>('/users/', ref =>
             ref.orderBy('name', 'desc')
               .limit(10));
    }
  }

  private unsubscribe() {
    console.log("unsubscribing")
    if (this.paginationSub) {
      this.paginationSub.unsubscribe();
    }

    if (this.findSub) {
      this.findSub.unsubscribe();
    }
  }

  private query(collection: AngularFirestoreCollection<User>): Promise<void> {
    console.log("querying")
    return new Promise<void>((resolve, reject) => {
      try {
        this.findSub = collection.snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data: User = 
                          a.payload.doc.data() as User;
              const id = a.payload.doc.id;
              const ref = a.payload.doc.ref;
  
              return {
                id,
                ref,
                data
              };
            });
          })
        ).subscribe(async (items: Item[]) => {
          await this.addItems(items);
  
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  
  private addItems(items: Item[]): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!items || items.length <= 0) {
        console.log("no items here")
        this.lastPageReached.next(true);
  
        resolve();
        return;
      }
      console.log("some items here")
      this.itemsSubject.asObservable().pipe(take(1))
                       .subscribe((currentItems: Item[]) => {
        this.itemsSubject.next(currentItems !== undefined ? 
              [...currentItems, ...items] : [...items]);
  
        resolve();
      });
    });
  }

  watchItems(): Observable<Item[]> {
    console.log("watching items")
    return this.itemsSubject.asObservable();
  }

  watchLastPageReached(): Observable<boolean> {
    console.log("watching items last page")
    return this.lastPageReached.asObservable();
  }
}
