import { observer } from 'mobx-react-lite';
import { startStyle, connectorStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

interface Props {
	id: string;
}

const Start: React.FC<Props> = observer(({ id }) => {
	const { removeNode, nodeSignals, setStartSignal } = appStore;

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	const toggleStartSignal = useCallback(() => {
		setStartSignal(!nodeSignals['start']?.output);
		// eslint-disable-next-line
	}, [setStartSignal, nodeSignals['start'].output]);

	return (
		<Flex
			style={startStyle}
			justify='center'
			align='center'
			onClick={toggleStartSignal}
		>
			<Title style={{ color: '#000', margin: 0 }}>
				{nodeSignals['start']?.output ? '+' : '-'}
			</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='source'
				position={'right' as Position}
				style={{ top: '50%', ...connectorStyle }}
			/>
		</Flex>
	);
});

export default Start;
