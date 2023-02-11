import {ClientStore, EventType, SchemaId, StorageType,} from 'client-web-storage';
import {Todo, todoService, TodoStatus} from '../service/todo.service';

export const todoStore = new ClientStore<Todo>(
  'todo',
  {
    // schema
    id: SchemaId,
    $name: String,
    description: 'No Description',
    status: TodoStatus.InProgress,
  },
  {
    // config
    appName: 'Angular Todo App',
    type: StorageType.INDEXEDDB,
    idKeyName: 'id',
    createdDateKeyName: 'createdDate',
    updatedDateKeyName: 'updatedDate',
    version: 1,
  }
);

/**
 * here you can connect to the Server via service or calling the API directly
 *
 * Use the "intercept" method to intercept actions and perform API calls
 * returning or not the data after
 *
 * the data returned will be used to update the store
 *
 * this setup here allows you to create UI without any Server/API logic including
 * - data manipulation - things like mapping or formatting the data before acting on it
 * - data validation - validate the data before acting on it. You can abort the action or throw errors
 * - perform side effects - maybe there are actions that needs to be performed before or after the store/API gets updated
 *
 * you don't need for try...catch blocks unless you really have to.
 * Any error thrown inside these "intercept" handlers will be caught
 * and used to trigger a store ERROR event which your UI can consume
 */

todoStore.on(EventType.ERROR, ({error, data, action}) => {
  // perfect place to handle every error that happened with your store
  // you may also want to push these logs to a server for history, alarms, and tracking in general
  console.error(error);
  console.log(`Above error happened for action "${action}" with data ${JSON.stringify(data, null, 2)}`);
})

todoStore.intercept(EventType.LOADED, async ({data}) => {
  // if no data length it means the "loadItems" action was called with nothing
  // in that case we just fetch data from the server
  // otherwise we let that data fallthrough and be handled by the store
  // the "loadItems" can be also used to perform batch update or create actions
  if (!data.length) {
    return await todoService.getTodoList();
  }
});

todoStore.intercept(EventType.CREATED, async ({data}) => {
  return await todoService.createTodo(data);
});

todoStore.intercept(EventType.UPDATED, async ({data, id}) => {
  // you can optionally return the data from the store (map it to match the store data if not already)
  // and the store will use this data to further update the object you call the action with
  // in this case I want the store to consume the id and updatedDate field data returned from the server
  return await todoService.updateTodo(id, data);
});

todoStore.intercept(EventType.REMOVED, async ({data}) => {
  await todoService.deleteTodo(data);
});

let clearAllCount = 1; // set to zero if calling todoStore.clear() before calling todoStore.loadItems()

todoStore.intercept(EventType.CLEARED, async ({data}) => {
  // just want to make sure there were actual items cleared
  // and that this is not an initial request to clear the store
  if (data.length && clearAllCount) {
    await todoService.deleteList();
  }

  clearAllCount += 1;
});

// you may consider clearing the store before loading new items to make sure the data is always the latest
// or don't clear it if your app should work with existing browser data for offline apps, etc
// todoStore.clear()

// load data from the server by triggering the "LOADED" event
todoStore.loadItems();
