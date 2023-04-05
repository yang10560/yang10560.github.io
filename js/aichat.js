body {
	background-color: #f7f9ff;
	font-family: Arial, sans-serif;
}

.modal {
	display: none;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
	background-color: gray;
	margin: 15% auto;
	padding: 20px;
	border: 1px solid #888;
	width: 30%;
	text-align: center;
	position: relative;
}

.spinner {
	border: 4px solid rgba(0, 0, 0, 0.1);
	border-top-color: #7983ff;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	animation: spin 1s linear infinite;
	margin: 0 auto 10px auto;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

#chat-container {
	width: 80%;
	/* 在移动设备上，聊天框应该填满屏幕 */
	margin: 50px auto;
	background-color: #ffffff;
	border-radius: 10px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

#chat-header {
	padding: 20px;
	text-align: center;
	font-size: 24px;
	font-weight: bold;
	border-bottom: 1px solid #e6e6e6;
}

#chat-messages {
	height: 300px;
	overflow-y: scroll;
	padding: 20px;
}

#chat-messages::-webkit-scrollbar {
	width: 8px;
}

#chat-messages::-webkit-scrollbar-track {
	background-color: #f1f1f1;
}

#chat-messages::-webkit-scrollbar-thumb {
	background-color: #888;
	border-radius: 5px;
}

#chat-messages::-webkit-scrollbar-thumb:hover {
	background-color: #555;
}

textarea::-webkit-scrollbar {
	width: 8px;
}

textarea::-webkit-scrollbar-track {
	background-color: #f1f1f1;
}

textarea::-webkit-scrollbar-thumb {
	background-color: #888;
	border-radius: 5px;
}

textarea::-webkit-scrollbar-thumb:hover {
	background-color: #555;
}

.message {
	margin-bottom: 20px;
}

.message.from-user {
	text-align: right;
}

.message.from-bot {
	text-align: left;
}

.message-content {
	display: inline-block;
	max-width: 80%;
	padding: 10px;
	border-radius: 5px;
	color: #ffffff;
	font-size: 14px;
	line-height: 1.5;
}

.from-user .message-content {
	background-color: #283f57;
}

.from-bot .message-content {
	background-color: #1a1a1a;
}


.message-avatar {
	display: inline-block;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 10px;
	background-size: cover;
}

.from-user .message-avatar {

	background-image: url("./user.jpg");
}

.from-bot .message-avatar {
	background-image: url("./bot.jpg");
}

.from-user .message-content {
	background-color: #283f57;
}

.from-bot .message-content {
	background-color: #1a1a1a;
}


#input-container {
	padding: 20px;
	border-top: 1px solid #e6e6e6;

}

input[type="text"] {
	width: 98%;
	padding: 10px;
	border: 1px solid gray;
	border-radius: 5px;
	font-size: 14px;

}

textarea {
	width: 98%;
	padding: 10px;
	border: 1px solid gray;
	border-radius: 5px;
	font-size: 14px;

}


button {
	width: 18%;
	padding: 10px;
	margin-left: 2%;
	background-color: #007aff;
	color: #ffffff;
	border: none;
	border-radius: 5px;
	font-size: 14px;
	cursor: pointer;
	margin-bottom: 5px;
	/* 设置下方距离为 10px */
}

/* 媒体查询：在600像素以下的屏幕上，聊天框和输入框将占据100%宽度，并删除边距 */
@media only screen and (max-width: 600px) {
	#chat-container {
		width: 100%;
		margin: 0;
		border-radius: 0;
	}

	#chat-header,
	#input-container {
		padding: 10px;
	}

	input[type="text"] {
		width: 70%;
	}

	textarea {
		width: 70%;
	}

	button {
		width: 28%;
		margin-left: 2%;
		margin-bottom: 5px;
		/* 设置下方距离为 10px */
	}
}

/* 定义全局变量 */
:root {
	--bg-color: #363636;
	--text-color: #f2f2f2;
}

/* 设置背景颜色和文本颜色 */
body,
div,
input,
textarea {
	background-color: var(--bg-color);
	color: var(--text-color);
}


/* 修改链接文本颜色 */
a {
	color: #ddd;
}

/* 修改按钮背景颜色 */
button {
	background-color: #444;
	color: #fff;
}