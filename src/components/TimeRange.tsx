import { Flex, Slider } from 'antd';
import { observer } from 'mobx-react-lite';

interface Props {
	value: number;
	onChange: (value: number) => void;
}

const TimeRange: React.FC<Props> = observer(({ value, onChange }) => {
	return (
		<Flex
			gap={8}
			align='center'
			justify='center'
			style={{ inlineSize: '100%' }}
		>
			<Slider
				min={100}
				max={5000}
				step={100}
				value={value}
				tooltip={{
					formatter: (value?: number) => (
						<>{((value || 0) / 1000).toFixed(1)}</>
					),
				}}
				onChange={onChange}
				style={{ inlineSize: '100%' }}
				className='noDrag'
			/>
		</Flex>
	);
});

export default TimeRange;
