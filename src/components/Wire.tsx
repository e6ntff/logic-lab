import { CloseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { Edge, EdgeLabelRenderer, getSimpleBezierPath } from 'reactflow';
import appStore from '../utils/appStore';

const Wire: React.FC = observer(
	({ id, target, source, sourceX, sourceY, targetX, targetY }: any) => {
		const { removeEdge, signals } = appStore;

		const sourceSignal = signals[source];

		const output = useMemo(() => sourceSignal, [sourceSignal]);

		const [edgePath, labelX, labelY] = getSimpleBezierPath({
			sourceX,
			sourceY,
			targetX,
			targetY,
		});

		const handleRemoving = useCallback(() => {
			removeEdge({ id, target, source } as Edge);
		}, [id, removeEdge, target, source]);

		return (
			<>
				<g>
					<path
						d={edgePath}
						stroke={output ? '#f00' : '#555'}
						fill='#0000'
						strokeWidth={output ? 7 : 5}
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
