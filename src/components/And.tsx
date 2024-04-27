import { observer } from 'mobx-react-lite';
import { Handle, Position } from 'reactflow';
import { andStyle, connectorStyle } from '../utils/blockStyles';
import Title from 'antd/es/typography/Title';
import appStore from '../utils/appStore';
import { Flex } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useCallback } from 'react';

interface Props {
	id: string;
}

const And: React.FC<Props> = observer(({ id }) => {
	const { removeNode } = appStore;

	const handleRemoving = useCallback(() => {
		removeNode(id);
	}, [id, removeNode]);

	return (
		<Flex
			style={andStyle}
			justify='center'
			align='center'
		>
			<Title style={{ color: '#fff', margin: 0 }}>AND</Title>
			<CloseOutlined
				style={{ position: 'absolute', top: 10, right: 10 }}
				onClick={handleRemoving}
			/>
			<Handle
				id='a'
				type='target'
				position={'left' as Position}
				style={{
					top: '33.3%',
					bottom: '66.6%',
					...connectorStyle,
				}}
			/>
			<Handle
				id='b'
				type='target'
				position={'left' as Position}
				style={{
					top: '66.6%',
					bottom: '33.3%',
					...connectorStyle,
				}}
			/>
			<Handle
				id='c'
				type='source'
				position={'right' as Position}
				style={{ top: '50%', ...connectorStyle }}
			/>
		</Flex>
	);
});

export default And;
