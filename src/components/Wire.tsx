import { CloseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import appStore from '../utils/appStore';

const Wire: React.FC = observer(
	({ id, sourceX, sourceY, targetX, targetY }: any) => {
		const { removeEdge } = appStore;

		const [edgePath, labelX, labelY] = getSmoothStepPath({
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
						stroke='#000'
						fill='#0000'
						strokeWidth={3}
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
