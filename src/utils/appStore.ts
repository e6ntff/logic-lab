import { makeAutoObservable, reaction } from 'mobx';
import {
	Edge,
	Node,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from 'reactflow';
import uniqid from 'uniqid';

// nodes: Node<any, string | undefined>[] = [
// 	{
// 		id: '1',
// 		position: { x: 0, y: 0 },
// 		data: { label: 'Hello' },
// 	},
// 	{
// 		id: '2',
// 		position: { x: 100, y: 100 },
// 		data: { label: 'World' },
// 	},
// 	{
// 		id: '3',
// 		position: { x: 200, y: 200 },
// 		data: { label: 'AND' },
// 		type: 'and',
// 	},
// ];
// edges: Edge<any>[] = [{ id: '1-2', type: 'wire', source: '1', target: '2' }];

class AppStore {
	nodes: Node<any, string | undefined>[] = JSON.parse(
		localStorage.getItem('nodes') || '[]'
	);
	edges: Edge<any>[] = JSON.parse(localStorage.getItem('edges') || '[]');

	updateNodes = (changes: any) => {
		this.nodes = applyNodeChanges(changes, this.nodes);
	};

	updateEdges = (changes: any) => {
		this.edges = applyEdgeChanges(changes, this.edges);
	};

	updateConnections = (changes: any) => {
		this.edges = addEdge(changes, this.edges);
	};

	addNode = () => {
		const node = {
			id: uniqid,
			position: { x: 200, y: 200 },
			data: { label: 'AND' },
			type: 'and',
		};

		this.nodes = [...this.nodes];
	};

	constructor() {
		makeAutoObservable(this);
	}
}

const appStore = new AppStore();

export default appStore;

reaction(
	() => appStore.nodes,
	() => {
		localStorage.setItem('nodes', JSON.stringify(appStore.nodes));
	}
);

reaction(
	() => appStore.edges,
	() => {
		localStorage.setItem('edges', JSON.stringify(appStore.edges));
	}
);
