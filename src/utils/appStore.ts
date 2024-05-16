import { makeAutoObservable, reaction } from 'mobx';
import {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
	OnSelectionChangeParams,
	ReactFlowInstance,
	Viewport,
	applyEdgeChanges,
	applyNodeChanges,
} from 'reactflow';
import uniqid from 'uniqid';
import { nodeType } from './types';
import {
	Clipboard,
	NodeData,
	NodeDataOptional,
	OnSelectionChangeParamsWithData,
	RemoteConnection,
	RemoteUsed,
} from './interfaces';
import { addNodes } from './addNodes';

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
	clipboard: Clipboard = { selected: null, copiedSelected: null, copied: {} };
	nodesData: { [key: string]: NodeData } = JSON.parse(
		localStorage.getItem('nodesData') || '{}'
	);
	edges: Edge[] = JSON.parse(localStorage.getItem('edges') || '[]');
	remoteConnections: {
		used: RemoteUsed;
		[key: number]: RemoteConnection;
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

	setSelected = (items: typeof this.clipboard.selected) => {
		this.clipboard = { ...this.clipboard, selected: items };
	};

	addCopiedItem = (item: OnSelectionChangeParams) => {
		const id = uniqid();

		const nodesWithData = item.nodes.map((node: Node) => ({
			node: node,
			data: this.nodesData[node.id],
		}));

		this.clipboard = {
			...this.clipboard,
			copied: {
				...this.clipboard.copied,
				[id]: { ...item, nodes: nodesWithData },
			},
			copiedSelected: id,
		};
	};

	removeCopiedItem = (id: string) => {
		const { [id]: _, ...items } = this.clipboard.copied;
		this.clipboard = { ...this.clipboard, copied: items };
	};

	clearCopiedItems = () => {
		this.clipboard = { ...this.clipboard, copied: {} };
	};

	setSelectedCopied = (id: string | null) => {
		this.clipboard = { ...this.clipboard, copiedSelected: id };
	};

	pasteCopiedItem = (id: string) => {
		const { [id]: item } = this.clipboard.copied;

		const { nodes, edges } = item;

		const postfix = uniqid();

		const newEdges = edges.map((edge: Edge) => {
			const id = `${edge.id}_${postfix}`;
			const source = `${edge.source}_${postfix}`;
			const target = `${edge.target}_${postfix}`;
			const selected = false;
			edge = { ...edge, id, source, target, selected };
			this.updateEdges([{ item: edge, type: 'add' }]);
			return edge;
		});

		let minX = nodes[0].node.position.x;
		let minY = nodes[0].node.position.y;
		let maxX = nodes[0].node.position.x;
		let maxY = nodes[0].node.position.y;

		nodes.forEach((data: OnSelectionChangeParamsWithData['nodes'][0]) => {
			const { x, y } = data.node.position;

			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
			if (x < minX) minX = x;
			if (y < minY) minY = y;
		});

		const diffX = maxX - minX;
		const diffY = maxY - minY;

		const newNodes = nodes.map(
			(node: OnSelectionChangeParamsWithData['nodes'][0]) => {
				const id = `${node.node.id}_${postfix}`;
				const position = {
					x: node.node.position.x + diffX + 140,
					y: node.node.position.y + diffY + 140,
				};
				const selected = false;
				const prevNodeIds = node.data.prevNodeIds
					.filter((id: string) =>
						edges.some(
							(edge: Edge) => edge.source === id && edge.target === node.node.id
						)
					)
					.map((id: string) => `${id}_${postfix}`);
				return {
					node: { ...node.node, id, position, selected },
					data: { ...node.data, prevNodeIds },
				};
			}
		);

		addNodes(newNodes);

		this.clipboard = {
			...this.clipboard,
			copied: {
				...this.clipboard.copied,
				[id]: { nodes: newNodes, edges: newEdges },
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

	addNewNode = (type: nodeType, parameters?: NodeDataOptional) => {
		const { x, y } = getCoordinates();

		const id = uniqid();

		const node: Node = {
			id: id,
			position: { x, y },
			data: {},
			type: type,
		};
		this.setNodeData(id, { ...defaultNodeData, ...parameters });
		this.updateNodes([{ item: node, type: 'add' }]);
	};

	addExistingNode = (node: Node, data?: NodeData) => {
		this.updateNodes([{ item: node, type: 'add' }]);
		data && this.setNodeData(node.id, data);
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
