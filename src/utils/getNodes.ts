import appStore from './appStore';

const getNodes = () => {
	const { setNodes, addNode, setLoaded } = appStore;

	const delayStep = 50;

	setLoaded(0);

	const nodes: typeof appStore.nodes = JSON.parse(
		localStorage.getItem('nodes') || '[]'
	);

	setNodes([]);

	if (!nodes.length) {
		setLoaded(1);
		return;
	}

	nodes.forEach((node: any, index: number) => {
		setTimeout(() => {
			addNode(node);
			setLoaded(++index / nodes.length || 0);
		}, delayStep * index);
	});
};

export default getNodes;
