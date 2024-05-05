import { useMemo } from 'react';
import appStore from './appStore';

const GetEdges = (
	id: string,
	{ prev, next }: { prev: boolean; next: boolean }
) => {
	const { connections } = appStore;

	const prevEdgeIds: string[] = useMemo(() => {
		if (!prev) return [];
		try {
			return Object.keys(connections[id].prev);
		} catch (error) {
			return [];
		}
	}, [id, connections, prev]);

	const nextEdgeIds: string[] = useMemo(() => {
		if (!next) return [];
		try {
			return Object.keys(connections[id].next);
		} catch (error) {
			return [];
		}
	}, [id, connections, next]);

	return { prevEdgeIds, nextEdgeIds };
};

export default GetEdges;
