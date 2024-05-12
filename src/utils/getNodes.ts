import appStore from './appStore';

const getNodes = () => {
	const { setNodes, addNode, setLoaded } = appStore;

	setLoaded(0);

	const nodes: typeof appStore.nodes = JSON.parse(
		localStorage.getItem('nodes') || '{}'
	);

	setNodes({});

	if (!Object.keys(nodes).length) {
		setLoaded(1);
		return;
	}

	Object.keys(nodes).forEach((id: string, index: number) => {
		setTimeout(() => {
			addNode(nodes[id]);
			setLoaded(++index / Object.keys(nodes).length || 0);
		});
	});
};

export default getNodes;
