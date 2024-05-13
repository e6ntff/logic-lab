import { Node } from 'reactflow';
import appStore from './appStore';

const getNodes = () => {
	const { setNodes, addNode, setLoaded } = appStore;

	setLoaded(0);

	const nodes: typeof appStore.nodes = JSON.parse(
		localStorage.getItem('nodes') || '[]'
	);

	setNodes([]);

	if (!Object.keys(nodes).length) {
		setLoaded(1);
		return;
	}

	nodes.forEach((node: Node, index: number) => {
		setTimeout(() => {
			addNode(node);
			setLoaded(++index / nodes.length || 0);
		});
	});
};

export default getNodes;
