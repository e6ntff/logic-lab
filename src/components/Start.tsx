import { observer } from 'mobx-react-lite';
import { blockStyle } from '../utils/blockStyles';
import appStore from '../utils/appStore';
import { Flex, Switch } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Edge, Node, Position, getConnectedEdges } from 'reactflow';
import RotationPanel from './NodeUtils';
import Connector from './Connector';

interface Props {
	id: string;
	data: { rotate: number };
}

const Start: React.FC<Props> = observer(({ id }) => {
	const { edges, setEdgeActive, nodes } = appStore;

	const [active, setActive] = useState<boolean>(true);
	const [rotation, setRotation] = useState<number>(0);

	const node = useMemo(
		() => nodes.find((node: Node<any, string | undefined>) => node.id === id),
		[nodes, id]
	);

	const connectedEdges = useMemo(
		() => (node ? getConnectedEdges([node], edges) : edges),
		[edges, node]
	);

	const nextEdgeIds: string[] = useMemo(
		() =>
			connectedEdges
				.filter((edge: Edge<any>) => edge.source === id)
				?.map((edge: Edge<any>) => edge.id),
		[connectedEdges, id]
	);

	useEffect(() => {
		try {
			nextEdgeIds.forEach((id: string) => {
				setEdgeActive(id, active);
			});
		} catch (error) {}
	}, [setEdgeActive, id, nextEdgeIds, active]);

	return (
		<Flex
			style={blockStyle}
			justify='center'
			align='center'
		>
			<Switch
				onChange={setActive}
				value={active}
			/>
			<RotationPanel
				id={id}
				setRotation={setRotation}
			/>
			<Connector
				id='a'
				type='source'
				position={'right' as Position}
				active={active}
				rotation={rotation}
				nodeId={id}
			/>
		</Flex>
	);
});

export default Start;
