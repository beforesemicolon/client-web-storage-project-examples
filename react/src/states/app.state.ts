import {AppState} from "client-web-storage";
import {AppStateNames} from "./app-state-names";

export interface AppStateType {
	searchTerm: string;
}

export const appState = new AppState<AppStateType>(AppStateNames.App, {
	searchTerm: String
})
