import { CloseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { EdgeLabelRenderer, getSimpleBezierPath } from 'reactflow';
import appStore from '../utils/appStore';

const Wire: React.FC = observer(
	({ id, sourceX, sourceY, targetX, targetY }: any) => {
		const { removeEdge, activeEdges } = appStore;

		const active = useMemo(() => activeEdges[id], [activeEdges, id]);

		const [edgePath, labelX, labelY] = getSimpleBezierPath({
			sourceX,
			sourceY,
			targetX,
			targetY,
		});

		const handleRemoving = useCallback(() => {
			removeEdge(id);
		}, [id, removeEdge]);

		return (
			<>
				<g>
					<path
						d={edgePath}
						stroke={active ? '#f00' : '#555'}
						fill='#0000'
						strokeWidth={active ? 5 : 3}
						className='animated'
					/>
				</g>
				<EdgeLabelRenderer>
					<CloseOutlined
						onClick={handleRemoving}
						style={{
							position: 'absolute',
							transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
							pointerEvents: 'all',
						}}
					/>
				</EdgeLabelRenderer>
			</>
		);
	}
);

export default Wire;
