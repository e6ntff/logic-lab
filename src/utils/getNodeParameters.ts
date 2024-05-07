import appStore from './appStore';

const GetNodeParameters = (id: string) => {
	const { nodesData } = appStore;

	return {
		rotation: nodesData[id]?.rotation ?? 0,
		active: nodesData[id]?.active ?? false,
		delay: nodesData[id]?.delay ?? 0,
		plusDelay: nodesData[id]?.plusDelay ?? 0,
		minusDelay: nodesData[id]?.minusDelay ?? 0,
		remote: nodesData[id]?.remote ?? { id: null },
	};
};

export default GetNodeParameters;
