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
	nodeSignals: {
		[id: string]: { input: boolean | [boolean, boolean]; output: boolean };
	} = {
		start: {
			input: false,
			output: localStorage.getItem('startSignal') === 'true',
		},
	};

	addNodeSignal = (
		id: string,
		input: boolean | [boolean, boolean],
		output: boolean
	) => {
		this.nodeSignals = { ...this.nodeSignals, [id]: { input, output } };
	};

	setStartSignal = (signal: (typeof this.nodeSignals)['start']['output']) => {
		this.nodeSignals = {
			...this.nodeSignals,
			start: { input: false, output: signal },
		};
	};

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

	addNode = (type: nodeType) => {
		const id = uniqid();
		const node: Node<any, string | undefined> = {
			id: id,
			position: { x: 0, y: 0 },
			data: { id: id },
			type: type,
		};

		this.nodes = [...this.nodes, node];
	};

	removeNode = (id: string) => {
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
		localStorage.setItem(
			'startSignal',
			JSON.stringify(appStore.nodeSignals.start.output)
		);
	}
);

reaction(
	() => appStore.edges,
	() => {
		localStorage.setItem('nodes', JSON.stringify(appStore.nodes));
		localStorage.setItem('edges', JSON.stringify(appStore.edges));
		localStorage.setItem(
			'startSignal',
			JSON.stringify(appStore.nodeSignals.start.output)
		);
	}
);

reaction(
	() => appStore.nodeSignals['start'],
	() => {
		localStorage.setItem('nodes', JSON.stringify(appStore.nodes));
		localStorage.setItem('edges', JSON.stringify(appStore.edges));
		localStorage.setItem(
			'startSignal',
			JSON.stringify(appStore.nodeSignals.start.output)
		);
	}
);
