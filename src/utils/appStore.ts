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
import { Clipboard, NodeData, NodeDataOptional } from './interfaces';
import { addNodes } from './addNodes';

export const defaultNodeData: NodeData = {
	rotation: 0,
	delay: 1000,
	plusDelay: 1000,
	minusDelay: 1000,
	prevNodeIds: [],
};

class AppStore {
	flow: ReactFlowInstance<NodeData> | null = null;
	loading: number = 0;
	viewport: Viewport = JSON.parse(
		sessionStorage.getItem('viewport') || '{"x":0,"y":0,"zoom":1}'
	);
	signals: { [id: string]: boolean } = {};
	nodes: Node<NodeData>[] = [];
	edges: Edge[] = JSON.parse(localStorage.getItem('edges') || '[]');
	clipboard: Clipboard = { selected: null, copiedSelected: null, copied: {} };

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

	setSelected = (items: typeof this.clipboard.selected) => {
		this.clipboard = { ...this.clipboard, selected: items };
	};

	addCopiedItem = (item: OnSelectionChangeParams) => {
		const id = uniqid();

		this.clipboard = {
			...this.clipboard,
			copied: {
				...this.clipboard.copied,
				[id]: item,
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

	updateNodes = (changes: NodeChange[]) => {
		this.nodes = applyNodeChanges(changes, this.nodes);
	};

	updateEdges = (changes: EdgeChange[]) => {
		this.edges = applyEdgeChanges(changes, this.edges);
	};

	setSignal = (id: string, signal: boolean) => {
		this.signals = {
			...this.signals,
			[id]: signal,
		};
	};

	addConnection = (id: string, prev: string) => {
		this.setNodes(
			this.nodes.map((node: Node<NodeData>) => {
				if (node.id === id) {
					if (prev) node.data.prevNodeIds = [...node.data.prevNodeIds, prev];
				}
				return node;
			})
		);
	};

	removeConnection = (id: string, prev: string | null, next: string | null) => {
		this.setNodes(
			this.nodes.map((node: Node<NodeData>) => {
				if (node.id === id) {
					if (prev)
						node.data.prevNodeIds = node.data.prevNodeIds.filter(
							(id: string) => id !== prev
						);
				}
				return node;
			})
		);
	};

	updateConnections = (changes: Edge | Connection) => {
		changes = {
			...changes,
			type: 'wire',
			id: uniqid(),
		};
		const newEdge = changes as Edge;
		this.updateEdges([{ item: newEdge, type: 'add' }]);
		const { source, target } = newEdge;
		this.addConnection(target, source);
	};

	addNewNode = (type: nodeType) => {
		const { x, y } = getCoordinates();

		const id = uniqid();

		const node: Node = {
			id: id,
			position: { x, y },
			data: defaultNodeData,
			type: type,
		};
		this.updateNodes([{ item: node, type: 'add' }]);
	};

	addExistingNode = (node: Node<NodeData>) => {
		this.updateNodes([{ item: node, type: 'add' }]);
	};

	setNodeData = (id: string, data: NodeDataOptional) => {
		const nodes = this.nodes.map((node: Node<NodeData>) => {
			if (node.id === id) {
				node.data = { ...node.data, ...data };
			}
			return node;
		});
		this.setNodes(nodes);
	};

	removeNode = (id: string) => {
		this.removeEdges(id, true, true);
		this.updateNodes([{ id, type: 'remove' }]);
	};

	removeEdges = (id: string, prev: boolean, next: boolean) => {
		this.edges.forEach((edge: Edge) => {
			if (edge.target === id && prev) this.removeEdge(edge);
			if (edge.source === id && next) this.removeEdge(edge);
		});
	};

	removeEdge = ({ id, target, source }: Edge) => {
		this.updateEdges([{ id, type: 'remove' }]);
		this.removeConnection(source, null, target);
		this.removeConnection(target, source, null);
	};

	pasteCopiedItem = (id: string) => {
		const { [id]: item } = this.clipboard.copied;

		const { nodes, edges } = item;

		const postfix = uniqid();

		const isBothNodesCopied: (source: string, target: string) => boolean = (
			source,
			target
		) => {
			let sourceCopied = false;
			let targetCopied = false;
			for (const node of nodes) {
				const { id } = node;
				if (id === source) sourceCopied = true;
				if (id === target) targetCopied = true;
				if (sourceCopied && targetCopied) return true;
			}
			return false;
		};

		const newEdges = edges
			.filter(({ source, target }: Edge) => isBothNodesCopied(source, target))
			.map((edge: Edge) => {
				const id = `${edge.id}_${postfix}`;
				const source = `${edge.source}_${postfix}`;
				const target = `${edge.target}_${postfix}`;
				const selected = false;
				edge = { ...edge, id, source, target, selected };
				this.updateEdges([{ item: edge, type: 'add' }]);
				return edge;
			});

		let minX = nodes[0].position.x;
		let minY = nodes[0].position.y;
		let maxX = nodes[0].position.x;
		let maxY = nodes[0].position.y;

		nodes.forEach((node: OnSelectionChangeParams['nodes'][0]) => {
			const { x, y } = node.position;

			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
			if (x < minX) minX = x;
			if (y < minY) minY = y;
		});

		const diffX = maxX - minX;
		const diffY = maxY - minY;

		const newNodes = nodes.map((node: Node<NodeData>) => {
			const id = `${node.id}_${postfix}`;
			const position = {
				x: node.position.x + diffX + 140,
				y: node.position.y + diffY + 140,
			};
			const selected = false;
			console.log(node, edges);
			const prevNodeIds = node.data.prevNodeIds
				.filter((id: string) => isBothNodesCopied(id, node.id))
				.map((id: string) => `${id}_${postfix}`);

			return {
				...node,
				id,
				position,
				selected,
				data: {
					...node.data,
					prevNodeIds,
				},
			};
		});

		addNodes(newNodes);

		this.clipboard = {
			...this.clipboard,
			copied: {
				...this.clipboard.copied,
				[id]: { nodes: newNodes, edges: newEdges },
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
