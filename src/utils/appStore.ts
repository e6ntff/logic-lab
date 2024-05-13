import { makeAutoObservable, reaction } from 'mobx';
import {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
	ReactFlowInstance,
	Viewport,
	applyEdgeChanges,
	applyNodeChanges,
} from 'reactflow';
import uniqid from 'uniqid';
import { nodeType } from './types';
import { NodeData, NodeDataOptional } from './interfaces';

const defaultNodeData: NodeData = {
	rotation: 0,
	output: false,
	delay: 0,
	plusDelay: 0,
	minusDelay: 0,
	remote: { id: null },
	mode: 'all',
	prevNodeIds: [],
};

class AppStore {
	flow: ReactFlowInstance | null = null;
	loading: number = 0;
	viewport: Viewport = JSON.parse(
		sessionStorage.getItem('viewport') || '{"x":0,"y":0,"zoom":1}'
	);
	nodes: Node[] = [];
	nodesData: { [key: string]: NodeData } = {};
	edges: Edge[] = JSON.parse(localStorage.getItem('edges') || '[]');
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

	setFlow = (flow: typeof this.flow) => {
		this.flow = flow;
	};

	setViewport = (viewport: Viewport) => {
		this.viewport = viewport;
	};

	setLoaded = (value: number) => {
		this.loading = value;
	};

	setNodes = (nodes: typeof this.nodes) => {
		this.nodes = nodes;
	};

	setEdges = (edges: typeof this.edges) => {
		this.edges = edges;
	};

	setRemoteConnectionValues = (
		id: number,
		type: 'in' | 'out',
		value: boolean
	) => {
		if (id)
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

	updateNodes = (changes: NodeChange[]) => {
		this.nodes = applyNodeChanges(changes, this.nodes);
	};

	updateEdges = (changes: EdgeChange[]) => {
		this.edges = applyEdgeChanges(changes, this.edges);
	};

	updateConnections = (changes: Edge | Connection) => {
		changes = {
			...changes,
			type: 'wire',
			id: uniqid(),
		};
		const newEdge = changes as Edge;
		const { source, target } = newEdge;
		this.setNodeData(target, {
			prevNodeIds: [...this.nodesData[target].prevNodeIds, source],
		});
		this.updateEdges([{ item: newEdge, type: 'add' }]);
	};

	addNode = (
		existing?: Node<NodeData> | null,
		type?: nodeType,
		parameters?: NodeDataOptional
	) => {
		const { x, y } = getCoordinates();

		const id = existing ? existing.id : uniqid();
		const node: Node = existing || {
			id: id,
			position: { x, y },
			data: {},
			type: type,
		};
		this.setNodeData(id, { ...defaultNodeData, ...parameters });
		this.updateNodes([{ item: node, type: 'add' }]);
	};

	setNodeData = (id: string, data: NodeDataOptional) => {
		this.nodesData = {
			...this.nodesData,
			[id]: { ...this.nodesData[id], ...data },
		};
	};

	removeNode = (id: string) => {
		this.removeEdges(id, true, true);
		this.updateNodes([{ id, type: 'remove' }]);
		setTimeout(() => {
			const { [id]: _, ...data } = this.nodesData;
			this.nodesData = data;
		});
	};

	removeEdges = (id: string, prev: boolean, next: boolean) => {
		this.edges.forEach((edge: Edge) => {
			if (edge.target === id && prev) this.removeEdge(edge);
			if (edge.source === id && next) this.removeEdge(edge);
		});
	};

	removeEdge = ({ id, target, source }: Edge) => {
		this.updateEdges([{ id, type: 'remove' }]);
		this.nodesData = {
			...this.nodesData,
			[target]: {
				...this.nodesData[target],
				prevNodeIds: this.nodesData[target].prevNodeIds.filter(
					(edgeId: string) => edgeId !== source
				),
			},
		};
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
	() => appStore.remoteConnections,
	() => {
		localStorage.setItem(
			'remoteConnections',
			JSON.stringify(appStore.remoteConnections)
		);
	}
);

reaction(
	() => appStore.viewport,
	() => {
		sessionStorage.setItem('viewport', JSON.stringify(appStore.viewport));
	}
);

const getCoordinates = () => {
	let { x, y, zoom } = appStore.viewport;

	[x, y] = [-(x - 100) / zoom, -(y - 100) / zoom];

	if (x > 0) {
		x = x + (x % 35);
	} else {
		x = x - (x % 35);
	}

	if (y > 0) {
		y = x + (y % 35);
	} else {
		y = y - (y % 35);
	}

	return { x, y };
};
