import { observer } from "mobx-react-lite";

const Wire: React.FC = observer(
	({ id, sourceX, sourceY, targetX, targetY }: any) => {
		return (
			<g>
				<path
					id={id}
					d={`M${sourceX},${sourceY}L${targetX},${targetY}`}
					stroke='#555'
					strokeWidth={2}
					markerEnd='url(#marker-circle)'
				/>
			</g>
		);
	}
);

export default Wire