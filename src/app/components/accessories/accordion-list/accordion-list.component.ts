import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss'],
})
export class AccordionListComponent implements OnInit {

  @ViewChild('wrapper', {read: ElementRef}) wrapper;
    @Input('expanded') expanded;
    @Input('height') height;
 
    constructor() {
 
    }
  ngOnInit() {
   
  }
 
    ngAfterViewInit(){
      if(this.height){
        this.wrapper.nativeElement.height = this.height + 'px';
        // this.renderer.setElementStyle(this.wrapper.nativeElement, 'height', );    
      }
    }

}
