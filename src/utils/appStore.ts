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
	loading: number = 0;
	nodes: Node<any, string | undefined>[] = [];
	edges: Edge<any>[] = JSON.parse(localStorage.getItem('edges') || '[]');
	activeEdges: { [key: string]: boolean } = {};
	remoteConnections: {
		[key: number]: {
			in: boolean;
			out: boolean;
		};
	} = {};

	setLoaded = (value: number) => {
		this.loading = value;
	};

	setNodes = (nodes: typeof this.nodes) => {
		this.nodes = nodes;
	};

	setRemoteConnectionValues = (
		id: number,
		type: 'in' | 'out',
		value: boolean
	) => {
		this.remoteConnections = {
			...this.remoteConnections,
			[id]: {
				...this.remoteConnections[id],
				[type]: value,
			},
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

	addNode = (
		existing?: Node<any, string | undefined> | null,
		type?: nodeType,
		props?: {
			remoteId?: number;
			active?: boolean;
			delay?: number;
			plusDelay?: number;
			minusDelay?: number;
		}
	) => {
		const node: Node<any, string | undefined> = existing || {
			id: uniqid(),
			position: { x: 0, y: 0 },
			data: {
				...props,
				rotation: 0,
			},
			type: type,
		};
		this.nodes = [...this.nodes, node];
	};

	setNodeParameters = (
		id: string,
		parameters: {
			rotation?: number;
			active?: boolean;
			delay?: number;
			plusDelay?: number;
			minusDelay?: number;
			remoteId?: number;
		}
	) => {
		const node = this.nodes.find(
			(node: Node<any, string | undefined>) => node.id === id
		);
		if (node) {
			node.data = { ...node.data, ...parameters };
			this.updateNodes([node]);
		}
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
