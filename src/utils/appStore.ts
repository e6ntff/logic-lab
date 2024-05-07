import { makeAutoObservable, reaction } from 'mobx';
import {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
	Viewport,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from 'reactflow';
import uniqid from 'uniqid';
import { nodeType } from './types';

class AppStore {
	loading: number = 0;
	viewport: Viewport = JSON.parse(
		sessionStorage.getItem('viewport') || '{"x":0,"y":0,"zoom":1}'
	);
	nodes: Node<any, string | undefined>[] = [];
	connections: {
		[key: string]: {
			prev: { [key: string]: Edge<any> };
			next: { [key: string]: Edge<any> };
		};
	} = JSON.parse(localStorage.getItem('connections') || '{}');
	nodesData: {
		[key: string]: {
			rotation?: number;
			active?: boolean;
			delay?: number;
			plusDelay?: number;
			minusDelay?: number;
			remote?: { type?: 'in' | 'out'; id: number | null };
		};
	} = JSON.parse(localStorage.getItem('nodesData') || '{}');
	edges: Edge<any>[] = JSON.parse(localStorage.getItem('edges') || '[]');
	activeEdges: { [key: string]: boolean } = {};
	remoteConnections: {
		used: { in: number[]; out: number[]; receiver: number[] };
		[key: number]: {
			in: boolean;
			out: boolean;
		};
	} = JSON.parse(
		localStorage.getItem('remoteConnections') ||
			'{ "used": { "in": [], "out": [] } }'
	);

	setViewport = (viewport: Viewport) => {
		this.viewport = viewport;
	};

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

	setRemoteConnectionUsed = (values: typeof this.remoteConnections.used) => {
		this.remoteConnections = {
			...this.remoteConnections,
			used: values,
		};
	};

	setEdgeActive = (id: string, active: boolean) => {
		this.activeEdges = { ...this.activeEdges, [id]: active };
	};

	updateNodes = (changes: NodeChange[]) => {
		this.nodes = applyNodeChanges(changes, this.nodes);
	};

	updateEdges = (changes: EdgeChange[]) => {
		this.edges = applyEdgeChanges(changes, this.edges);
	};

	updateConnections = (changes: Edge | Connection) => {
		const id = uniqid();
		changes = { ...changes, type: 'wire', id: id };
		this.edges = addEdge(changes, this.edges);
		const { source, target } = changes;
		try {
			this.connections = {
				...this.connections,
				[source as string]: {
					...this.connections[source as string],
					next: {
						...this.connections[source as string]?.next,
						[id]: changes as Edge,
					},
				},
				[target as string]: {
					...this.connections[target as string],
					prev: {
						...this.connections[target as string]?.prev,
						[id]: changes as Edge,
					},
				},
			};
		} catch (error) {
			this.connections = {
				...this.connections,
				[source as string]: { prev: { [id]: changes as Edge }, next: {} },
				[target as string]: {
					prev: {},
					next: { [id]: changes as Edge },
				},
			};
		}
	};

	addNode = (
		existing?: Node<any, string | undefined> | null,
		type?: nodeType,
		parameters?: (typeof this.nodesData)[0]
	) => {
		let { x, y, zoom } = this.viewport;
		[x, y] = [-(x - 100) / zoom, -(y - 100) / zoom];

		if (x > 0) {
			x = x + (x % 30);
		} else {
			x = x - (x % 30);
		}

		if (y > 0) {
			y = x + (y % 30);
		} else {
			y = y - (y % 30);
		}

		const id = existing ? existing.id : uniqid();
		const node: Node<any, string | undefined> = existing || {
			id: id,
			position: { x, y },
			data: {},
			type: type,
		};
		this.nodes = [...this.nodes, node];
		if (!existing)
			this.nodesData = {
				...this.nodesData,
				[id]: parameters || {},
			};
	};

	setNodeParameters = (id: string, parameters: (typeof this.nodesData)[0]) => {
		try {
			this.nodesData = {
				...this.nodesData,
				[id]: { ...this.nodesData[id], ...parameters },
			};
		} catch (error) {}
	};

	removeNode = (id: string) => {
		this.edges
			.filter((edge: Edge<any>) => edge.source === id || edge.target === id)
			.forEach((edge: Edge<any>) => {
				this.removeEdge(edge.id);
			});
		this.nodes = this.nodes.filter((node) => node.id !== id);
		const nodesData = this.nodesData;
		delete nodesData[id];
		this.nodesData = { ...nodesData };
		const connections = this.connections;
		delete connections[id];
		this.connections = { ...connections };
	};

	removeEdge = (id: string) => {
		this.edges = this.edges.filter((edge) => edge.id !== id);
		for (const key in this.connections) {
			const connection = this.connections[key];
			if (Object.hasOwn(connection, 'prev')) {
				delete connection.prev[id];
			}
			if (Object.hasOwn(connection, 'next')) {
				delete connection.next[id];
			}
			this.connections = { ...this.connections, [key]: connection };
		}
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

reaction(
	() => appStore.nodesData,
	() => {
		localStorage.setItem('nodesData', JSON.stringify(appStore.nodesData));
	}
);

reaction(
	() => appStore.connections,
	() => {
		localStorage.setItem('connections', JSON.stringify(appStore.connections));
	}
);

reaction(
	() => appStore.remoteConnections,
	() => {
		localStorage.setItem(
			'remoteConnections',
			JSON.stringify(appStore.remoteConnections)
		);
	}
);
