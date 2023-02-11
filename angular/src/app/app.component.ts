import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { UnSubscriber, StoreState } from 'client-web-storage';
import {
  withClientStore,
  DefaultStoreState,
} from 'client-web-storage/helpers/with-client-store';
import { Todo, TodoStatus } from './service/todo.service';
import { todoStore } from './stores/todo.store';
import { promptInput } from './utils';

interface TodoItems {
  active: Todo[],
  inactive: Todo[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  $todo: StoreState<Todo> = DefaultStoreState;
  todoItems: TodoItems = {active: [], inactive: []};
  searchTerm = '';
  $unsubscribeFromTodoStore: UnSubscriber = () => {};

  constructor(private cd: ChangeDetectorRef) {
    console.log(this.cd);
  }

  get hasTodos() {
    return this.todoItems.active.length > 0 || this.todoItems.inactive.length > 0;
  }
  ngOnInit() {
    this.$unsubscribeFromTodoStore = withClientStore<Todo>(
      todoStore,
      (data) => {
        this.$todo = data;
        this.filterAndGroupItems();
      }
    );
  }

  ngOnDestroy() {
    this.$unsubscribeFromTodoStore();
  }

  updateSearchTerm(value = this.searchTerm) {
    this.searchTerm = value;
    this.filterAndGroupItems();
  }

  filterAndGroupItems = () => {
    const searchPattern = new RegExp(this.searchTerm, 'i');

    this.todoItems = this.$todo.items
      .reduce((acc, todo) => {
        if (
          !this.searchTerm.trim().length ||
          (todo.name.search(searchPattern) > 0 || todo.description.search(searchPattern) > 0)
        ) {
          if(todo.status === TodoStatus.Deleted) {
            // @ts-ignore
            acc.inactive.push(todo)
          } else {
            // @ts-ignore
            acc.active.push(todo);
            acc.active = acc.active.sort((a, b) => {
              if (a.status === TodoStatus.Completed) {
                  return 1
              }

              return -1;
            })
          }
        }

        return acc;
      }, {active: [], inactive: []} as TodoItems);

    this.cd.detectChanges()
  }

  createTodo = async () => {
    const name = promptInput('Enter Todo Name:');

    if (name && name.trim().length) {
      todoStore.createItem({
        name,
      });
    }
  };
}
