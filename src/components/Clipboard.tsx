import { Flex, List, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import appStore from '../utils/appStore';
import Item from 'antd/es/list/Item';
import { useCallback, useMemo } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { icons } from '../utils/types';
import { DeleteOutlined } from '@ant-design/icons';
import { OnSelectionChangeParams } from 'reactflow';
import uniqid from 'uniqid';

const Clipboard: React.FC = observer(() => {
	const { clipboard, setSelectedCopied, removeCopiedItem } = appStore;

	const { copied, copiedSelected } = clipboard;

	const getCopiedItems = useCallback(
		(id: string) => {
			const item = copied[id];
			const items: { [key: string]: number } = {};
			item.nodes.forEach((node: OnSelectionChangeParams['nodes'][0]) => {
				const { type } = node;
				if (!type) return;
				if (Object.hasOwn(items, type)) {
					items[type] += 1;
				} else {
					items[type] = 1;
				}
			});
			if (item.edges.length) items.edge = item.edges.length;
			return items;
		},
		[copied]
	);

	const copiedItems = useMemo(
		() =>
			Object.keys(copied).reduce(
				(acc: { [key: string]: { [key: string]: number } }, id: string) => ({
					...acc,
					[id]: getCopiedItems(id),
				}),
				{}
			),
		[copied, getCopiedItems]
	);

	return (
		<Flex
			style={{
				position: 'absolute',
				bottom: 0,
				right: 0,
				background: '#fff',
				overflow: 'hidden',
				inlineSize: '20%',
				maxBlockSize: '75%',
			}}
		>
			<Scrollbars
				universal
				autoHeight
				autoHeightMax={'100%'}
			>
				<List itemLayout='vertical'>
					{Object.keys(copied)
						.reverse()
						.map((id: string) => (
							<Item
								key={id}
								extra={
									<DeleteOutlined
										style={{ fontSize: '1.5em' }}
										onClick={() => removeCopiedItem(id)}
									/>
								}
								style={{
									opacity: copiedSelected === id ? '1' : '0.5',
									cursor: 'pointer',
								}}
								onClick={() => setSelectedCopied(id)}
							>
								<Flex wrap='wrap'>
									{Object.keys(copiedItems[id]).map((type: string) => (
										<Typography.Text key={uniqid()}>
											{icons[type]}
											{`\u00A0x${copiedItems[id][type]}\u00A0\u00A0\u00A0`}
										</Typography.Text>
									))}
								</Flex>
							</Item>
						))}
				</List>
			</Scrollbars>
		</Flex>
	);
});

export default Clipboard;
