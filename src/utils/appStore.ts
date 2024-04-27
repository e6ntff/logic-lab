import { makeAutoObservable } from 'mobx';

class AppStore {
	blocks = {};

	constructor() {
		makeAutoObservable(this);
	}
}

const appStore = new AppStore();

export default appStore;
