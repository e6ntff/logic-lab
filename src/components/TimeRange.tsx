import {
	DoubleLeftOutlined,
	DoubleRightOutlined,
	LeftOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { observer } from 'mobx-react-lite';

interface Props {
	value: number;
	id: string;
	onChange: (value: number) => void;
}

const TimeRange: React.FC<Props> = observer(({ value, id, onChange }) => {
	return (
		<Flex
			gap={8}
			align='center'
			justify='center'
		>
			<Flex>
				<DoubleLeftOutlined onClick={() => onChange(-1000)} />
				<LeftOutlined onClick={() => onChange(-100)} />
				<Typography.Text>{(value / 1000).toFixed(1)}</Typography.Text>
				<RightOutlined onClick={() => onChange(100)} />
				<DoubleRightOutlined onClick={() => onChange(1000)} />
			</Flex>
		</Flex>
	);
});

export default TimeRange;
