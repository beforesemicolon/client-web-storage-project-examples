import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { TodoItem } from './components/todo-item/todo-item.component';

@NgModule({
  declarations: [AppComponent, TodoItem],
  imports: [CommonModule, BrowserModule, FormsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
