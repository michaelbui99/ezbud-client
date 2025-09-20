import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, ViewRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutService } from '../../services/layout.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class Toolbar implements AfterViewInit {

  @ViewChild('toolbar', { read: ElementRef })
  toolbar!: ElementRef;


  constructor(private readonly layoutService: LayoutService) {
  }

  ngAfterViewInit(): void {
    this.layoutService.setToolbarHeight(this.toolbar.nativeElement.offsetHeight);
  }
}
