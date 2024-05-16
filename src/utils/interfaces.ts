import { Edge, Node, OnSelectionChangeParams } from 'reactflow';

export interface NodeData {
	rotation: number;
	output: boolean;
	delay: number;
	plusDelay: number;
	minusDelay: number;
	remote: { type?: 'in' | 'out'; id: number | null };
	mode: 'in' | 'out' | 'all';
	prevNodeIds: string[];
}

export interface NodeDataOptional {
	rotation?: number;
	output?: boolean;
	delay?: number;
	plusDelay?: number;
	minusDelay?: number;
	remote?: { type?: 'in' | 'out'; id: number | null };
	mode?: 'in' | 'out' | 'all';
	prevNodeIds?: string[];
}

export interface RemoteUsed {
	in: number[];
	out: number[];
	receiver: number[];
}

export interface RemoteConnection {
	in: boolean;
	out: boolean;
}

export interface OnSelectionChangeParamsWithData {
	nodes: {
		node: Node;
		data: NodeData;
	}[];
	edges: Edge[];
}

export interface Clipboard {
	selected: OnSelectionChangeParams | null;
	copiedSelected: string | null;
	copied: { [key: string]: OnSelectionChangeParamsWithData };
}
