import { SendOutlined } from '@ant-design/icons';
import { FloatButton, Form, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import telegram from '../utils/telegram';

interface Data {
	name: string;
	text: string;
	ip: string;
}

const MessageButton: React.FC = observer(() => {
	const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
	const [data, setData] = useState<Data>({ name: '', text: '', ip: '' });

	useEffect(() => {
		axios
			.get('https://api.ipify.org/?format=json')
			.then((data) =>
				setData((prevData: Data) => ({ ...prevData, ip: data.data.ip }))
			);
	}, [setData]);

	const handleNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) =>
			setData((prevData: Data) => ({ ...prevData, name: event.target.value })),
		[setData]
	);

	const handleTextChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) =>
			setData((prevData: Data) => ({ ...prevData, text: event.target.value })),
		[setData]
	);

	const openModal = useCallback(
		() => setIsModalOpened(true),
		[setIsModalOpened]
	);

	const closeModal = useCallback(() => {
		setIsModalOpened(false);
		setData({ name: '', text: '', ip: data.ip });
	}, [setIsModalOpened, data.ip]);

	const sendMessage = useCallback(() => {
		axios.post(`https://api.telegram.org/bot${telegram.botToken}/sendMessage`, {
			chat_id: telegram.chatId,
			text: `${data.name} (${data.ip}): ${data.text}`,
		});
		closeModal();
	}, [closeModal, data]);

	return (
		<>
			<FloatButton
				onClick={openModal}
				icon={<SendOutlined />}
			/>
			<Modal
				open={isModalOpened}
				onCancel={closeModal}
				onOk={sendMessage}
			>
				<Form layout='vertical'>
					<Form.Item
						label='Name or contact'
						style={{ inlineSize: '50%' }}
					>
						<Input
							onChange={handleNameChange}
							value={data.name}
						/>
					</Form.Item>
					<Form.Item label='Your message'>
						<TextArea
							onChange={handleTextChange}
							value={data.text}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
});

export default MessageButton;
