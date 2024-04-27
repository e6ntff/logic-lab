import { observer } from 'mobx-react-lite';
import { Handle, Position } from 'reactflow';
import { AndStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';

interface Props {
	data: any;
}

const And: React.FC<Props> = observer(({ data }) => {
	return (
		<div style={AndStyle}>
			<Title style={{ color: '#fff' }}>{data.label}</Title>
			<Handle
				id='a'
				type='source'
				position={'left' as Position}
				style={{ background: '#555', top: '33.3%', bottom: '33.3%' }}
			/>
			<Handle
				id='b'
				type='source'
				position={'left' as Position}
				style={{ background: '#555', top: '75%', bottom: '25%' }}
			/>
			<Handle
				id='c'
				type='target'
				position={'right' as Position}
				style={{ background: '#555', top: '50%' }}
			/>
		</div>
	);
});

export default And;
