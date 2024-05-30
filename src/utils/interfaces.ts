import { OnSelectionChangeParams } from 'reactflow';

export interface NodeData {
	rotation: number;
	delay: number;
	plusDelay: number;
	minusDelay: number;
	prevNodeIds: string[];
}

export interface NodeDataOptional {
	rotation?: number;
	delay?: number;
	plusDelay?: number;
	minusDelay?: number;
	prevNodeIds?: string[];
}

export interface Clipboard {
	selected: OnSelectionChangeParams | null;
	copiedSelected: string | null;
	copied: { [key: string]: OnSelectionChangeParams };
}

export interface Signal {
	in?: boolean[];
	out?: boolean[];
}
