import { Edge } from 'reactflow';

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
