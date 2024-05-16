import { Node } from 'reactflow';
import appStore from './appStore';
import { OnSelectionChangeParamsWithData } from './interfaces';

export const loadNodes = () => {
	const { setNodes, addExistingNode, setLoaded } = appStore;

	setLoaded(0);

	const nodes: typeof appStore.nodes = JSON.parse(
		localStorage.getItem('nodes') || '[]'
	);

	setNodes([]);

	if (!Object.keys(nodes || []).length) {
		setLoaded(1);
		return;
	}

	nodes.forEach((node: Node, index: number) => {
		setTimeout(() => {
			addExistingNode(node);
			setLoaded(++index / nodes.length || 0);
		});
	});
};

export const addNodes = (nodes: OnSelectionChangeParamsWithData['nodes']) => {
	const { addExistingNode, setLoaded } = appStore;

	setLoaded(0);

	if (!Object.keys(nodes || []).length) {
		setLoaded(1);
		return;
	}

	nodes.forEach(
		(node: OnSelectionChangeParamsWithData['nodes'][0], index: number) => {
			setTimeout(() => {
				addExistingNode(node.node, node.data);
				setLoaded(++index / nodes.length || 0);
			});
		}
	);
};
