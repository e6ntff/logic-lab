import { useMemo } from 'react';
import { Edge, getConnectedEdges, useStore } from 'reactflow';

const selector = (s: any) => ({
	nodeInternals: s.nodeInternals,
	edges: s.edges,
});

const GetEdges = (
	id: string,
	{ prev, next }: { prev: boolean; next: boolean }
) => {
	const { nodeInternals, edges } = useStore(selector);

	const node = nodeInternals.get(id);

	const connectedEdges = useMemo(
		() => (node ? getConnectedEdges([node], edges) : edges),
		[edges, node]
	);

	const prevEdgeIds: string[] = useMemo(
		() =>
			prev
				? connectedEdges
						.filter((edge: Edge<any>) => edge.target === id)
						?.map((edge: Edge<any>) => edge.id)
				: [],
		[id, connectedEdges, prev]
	);

	const nextEdgeIds: string[] = useMemo(
		() =>
			next
				? connectedEdges
						.filter((edge: Edge<any>) => edge.source === id)
						?.map((edge: Edge<any>) => edge.id)
				: [],
		[id, connectedEdges, next]
	);

	return { prevEdgeIds, nextEdgeIds };
};

export default GetEdges;
