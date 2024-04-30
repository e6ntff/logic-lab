import { makeAutoObservable, reaction } from 'mobx';
import {
	Edge,
	Node,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from 'reactflow';
import uniqid from 'uniqid';
import { nodeType } from './types';

class AppStore {
	nodes: Node<any, string | undefined>[] = JSON.parse(
		localStorage.getItem('nodes') || '[]'
	);
	edges: Edge<any>[] = JSON.parse(localStorage.getItem('edges') || '[]');
	activeEdges: { [key: string]: boolean } = {};

	setEdgeActive = (id: string, active: boolean) => {
		this.activeEdges = { ...this.activeEdges, [id]: active };
	};

	updateNodes = (changes: any) => {
		this.nodes = applyNodeChanges(changes, this.nodes);
	};

	updateEdges = (changes: any) => {
		this.edges = applyEdgeChanges(changes, this.edges);
	};

	updateConnections = (changes: any) => {
		changes = { ...changes, type: 'wire' };
		this.edges = addEdge(changes, this.edges);
	};
	addNode = (type: nodeType, delay?: number) => {
		const node: Node<any, string | undefined> = {
			id: uniqid(),
			position: { x: 0, y: 0 },
			data: {
				delay: delay,
				rotate: 0,
			},
			type: type,
		};
		this.nodes = [...this.nodes, node];
	};

	changeDelay = (id: string, delay: number) => {
		const node = this.nodes.find(
			(node: Node<any, string | undefined>) => node.id === id
		);
		if (node?.data) node.data.delay = delay;
		this.updateNodes([node]);
	};

	rotateNode = (id: string, deg: number) => {
		const node = this.nodes.find(
			(node: Node<any, string | undefined>) => node.id === id
		);
		if (node?.data) node.data.rotate = deg;
		this.updateNodes([node]);
	};

	removeNode = (id: string) => {
		this.edges
			.filter((edge: Edge<any>) => edge.source === id || edge.target === id)
			.forEach((edge: Edge<any>) => {
				this.removeEdge(edge.id);
			});
		this.nodes = this.nodes.filter((node) => node.id !== id);
	};

	removeEdge = (id: string) => {
		this.edges = this.edges.filter((edge) => edge.id !== id);
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
		localStorage.setItem('edges', JSON.stringify(appStore.edges));
	}
);

reaction(
	() => appStore.edges,
	() => {
		localStorage.setItem('nodes', JSON.stringify(appStore.nodes));
		localStorage.setItem('edges', JSON.stringify(appStore.edges));
	}
);
