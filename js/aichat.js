const messagesContainer = document.getElementById("chat-messages");
const sendButton = document.getElementById("send-button");
const sendButton2 = document.getElementById("send-button2");
//const inputField = document.querySelector("#input-container input[type='text']");
const inputField = document.querySelector("#input-container textarea");

hljs.configure({
	ignoreUnescapedHTML: true
});


function saveHistory(humanMsg, botMsg) {
	var chatList = localStorage.getItem("chatList")
	if (chatList) {
		chatList = JSON.parse(chatList)
		chatList.push({
			human: humanMsg,
			bot: botMsg
		})
		localStorage.setItem("chatList", JSON.stringify(chatList))
	} else {
		chatList = []
		chatList.push({
			human: humanMsg,
			bot: botMsg
		})
		localStorage.setItem("chatList", JSON.stringify(chatList))
	}
}

function loadHistory(data) {
	var chatList = data ? data : localStorage.getItem("chatList")
	if (chatList) {
		chatList = JSON.parse(chatList)
		chatList.forEach(function(item) {
			//human
			const newMessage = document.createElement("div");
			const messageContent = document.createElement("div");
			const useravatar = document.createElement("div");
			useravatar.classList.add("message-avatar");
			newMessage.classList.add("message", "from-user");
			messageContent.classList.add("message-content");
			messageContent.textContent = item.human;
			newMessage.appendChild(useravatar)
			newMessage.appendChild(messageContent);
			messagesContainer.appendChild(newMessage);

			//bot
			simulateBotResponse(item.bot)
		})
	}

}

function updateAigcfunKey() {
	let useKeyTime = localStorage.getItem("useKeyTime") ? localStorage.getItem("useKeyTime") : 0;
	console.log(useKeyTime)

	if (useKeyTime > 8 || !localStorage.getItem("useKeyTime") || !localStorage.getItem("aigcfunkey")) {
		console.log("update aigcfunkey")
		localStorage.setItem("useKeyTime", 0)

		$.ajax({
			method: "GET",
			url: "https://api.aigcfun.com/fc/key",
			headers: {
				"Content-Type": "application/json"
			},
			success: function(response) {
				console.log(response);
				let resp = response.data;
				let aigcfunkey = resp;
				if (!aigcfunkey) {
					alert("更新key失败")
					return
				}

				localStorage.setItem("aigcfunkey", aigcfunkey)

			}
		});

	}
}


function handleBot(question, type) {
	let q = question;
	$("#chat-header").html("思考中，请稍后...")

	if (type == 1) {
		//安卓接口 start
		window.AndroidAPI.showToast("hello toast")
		alert(window.AndroidAPI.aigcfun(question))
		hideWait()
		//Save History
		/* try {
			saveHistory(question, res.text)
		} catch (e) {
			//TODO handle the exception
		}
		simulateBotResponse(res.text)
		$("#chat-header").html("AI Chat")
		hideWait() */
		//安卓接口 end
		return
		
		$.ajax({
			method: "GET",
			url: "https://wenxin110.top/api/chat_gpt?text=" + encodeURI(q),
			headers: {},
			success: function(res) {
				//Save History
				try {
					saveHistory(question, res.text)
				} catch (e) {
					//TODO handle the exception
				}
				simulateBotResponse(res.text)
				$("#chat-header").html("AI Chat")
				hideWait()
			},
			error: function(res) {
				simulateBotResponse("未知错误...")
				hideWait()
			},
			timeout: (res) => {
				hideWait()
				simulateBotResponse("超时...")
			}
		});
	} else if (type == 2) {
		updateAigcfunKey();
		let useKeyTime = localStorage.getItem("useKeyTime") ? localStorage.getItem("useKeyTime") : 0;

		$.ajax({
			method: "POST",
			url: "https://api.aigcfun.com/api/v1/text?key=" + localStorage.getItem("aigcfunkey"),
			headers: {
				"Content-Type": "application/json"
			},
			data: JSON.stringify({
				messages: [{
						role: "system",
						content: "请以markdown的形式返回答案"
					},
					{
						role: "user",
						content: q
					}
				],
				tokensLength: q.length + 10,
				model: "gpt-3.5-turbo"

			}),
			success: (data) => {
				console.log(data.choices[0].text)
				localStorage.setItem("useKeyTime", useKeyTime > 8 ? 0 : Number(useKeyTime) + 1)
				//Save History
				let ans = data.choices[0].text;
				try {
					saveHistory(question, ans)
				} catch (e) {
					//TODO handle the exception
				}
				simulateBotResponse(ans)

				$("#chat-header").html("AI Chat")
				hideWait()
				if (ans.indexOf("已达上限") != -1 || ans.indexOf("有效的key") != -1) {
					localStorage.removeItem("useKeyTime")
					updateAigcfunKey()
					alert("已为你更新key,如果还提示,则用插件手动更新key")
				}
			},
			error: function(res) {
				hideWait()
				simulateBotResponse("未知错误...")
			}
		});


		//end if
	}


}


function katexTohtml(rawHtml){
	let renderedHtml = rawHtml.replace(/<em>/g,"").replace(/<\/em>/g,"").replace(/\$\$(.*?)\$\$/g, (_, tex) => {
		 //debugger
	  return katex.renderToString(tex, { displayMode: false,throwOnError: false });
	});
	renderedHtml = renderedHtml.replace(/\$(.*?)\$/g, (_, tex) => {
		 //debugger
	  return katex.renderToString(tex, { displayMode: false,throwOnError: false });
	});			
	return renderedHtml;
}

// 模拟机器人回复
function simulateBotResponse(restMessage) {
	if (!restMessage) return
	const newMessage = document.createElement("div");
	const messageContent = document.createElement("article");
	const botavatar = document.createElement("div");
	botavatar.classList.add("message-avatar");
	//  console.log(restMessage)
	newMessage.classList.add("message", "from-bot");
	messageContent.classList.add("message-content");
	messageContent.classList.add("markdown-body");
	messageContent.innerHTML = `${katexTohtml(mdConverter(restMessage.replace(/\\n+/g,"\n")))}`;
	newMessage.appendChild(botavatar);
	newMessage.appendChild(messageContent);
	messagesContainer.appendChild(newMessage);

	// 初始化highlight.js
	// hljs.initHighlightingOnLoad();
	for (let i = 0; i <= document.getElementsByTagName("code").length - 1; i++) {
		//document.getElementsByTagName("code")[i].setAttribute("class",
		//	"language-javascript hljs");
		document.getElementsByTagName("code")[i].classList.add("hljs");
		hljs.highlightAll()
	}


	// 将消息框滚动到底部，以便用户看到最新的回复
	messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 处理用户输入的消息
function handleUserInput(type) {
	const messageText = inputField.value.trim();
	if (messageText) {
		const newMessage = document.createElement("div");
		const messageContent = document.createElement("div");
		const useravatar = document.createElement("div");
		useravatar.classList.add("message-avatar");
		newMessage.classList.add("message", "from-user");
		messageContent.classList.add("message-content");
		messageContent.textContent = messageText;
		newMessage.appendChild(useravatar)
		newMessage.appendChild(messageContent);
		messagesContainer.appendChild(newMessage);

		//simulateBotResponse(messageText);
		handleBot(messageText, type);

		// 清空输入框，准备下一次输入
		inputField.value = "";

		// 将消息框滚动到底部，以便用户看到最新的回复
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}
}

// 当用户按下回车键时，模拟点击发送按钮
inputField.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		// let defaultbtn = document.getElementById("chatX")
		// if (defaultbtn) {
		// 	defaultbtn.click()
		// 	return
		// }
		let _thatBtn =!1;
		if (!_thatBtn) {
			console.log("sendButton2")
			sendButton2.click();
			return
		}
		console.log(_thatBtn)
		_thatBtn.click();
	};

});

function showWait() {
	const modal = document.getElementById('myModal');
	modal.style.display = 'block';
}

function hideWait() {
	document.getElementById('myModal').style.display = 'none';
}

// 当用户点击发送按钮时，处理用户输入的消息
sendButton.addEventListener("click", () => {
	showWait()
	handleUserInput(1)
});

sendButton2.addEventListener("click", () => {
	showWait()
	handleUserInput(2)
});

document.getElementById("clearBtn").addEventListener("click", () => {
	localStorage.removeItem("chatList")
	location.reload()
})

document.getElementById("saveBtn").addEventListener("click", () => {
	console.log("----sava-----")
	const data = JSON.stringify(JSON.parse(localStorage.getItem("chatList")));
	const blob = new Blob([data], {
		type: 'application/json'
	});
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = 'chatList.json';
	link.click();
	setTimeout(() => {
		console.log("revoke")
		window.URL.revokeObjectURL(url);
	}, 10000);

})

document.getElementById("importBtn").addEventListener("click", () => {
	document.getElementById("importFile").click()
})

//md start
function Uint8ArrayToString(fileData) {
	var dataString = "";
	for (var i = 0; i < fileData.length; i++) {
		dataString += String.fromCharCode(fileData[i]);
	}

	return dataString
}

function decodeUnicode(str) {
	str = str.replace(/\\/g, "%");
	//转换中文
	str = unescape(str);
	//将其他受影响的转换回原来
	str = str.replace(/%/g, "\\");
	//对网址的链接进行处理
	str = str.replace(/\\/g, "");
	return str;
}

function mdConverter(rawData) {
	var converter = new showdown.Converter(); //增加拓展table
	converter.setOption('tables',
		true); //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
	var view = converter.makeHtml(rawData);
	return view;
}
//md end

simulateBotResponse(`[油猴搜索插件](https://greasyfork.org/zh-CN/scripts/459997)`)
simulateBotResponse(`[加群:177193765](https://jq.qq.com/?_wv=1027&k=ATOfebCv)`)
//simulateBotResponse(`[切换GPT版本](./chatgpt.html)`)



const importFile = document.getElementById('importFile');

importFile.addEventListener('change', (event) => {
	const file = event.target.files[0];

	const reader = new FileReader();

	reader.onload = (event) => {
		const data = event.target.result;
		let newChatList = JSON.parse(data)

		// 在这里处理解析后的数据

		console.log(data);
		loadHistory(data)
		//合并
		let oldChatList = JSON.parse(localStorage.getItem("chatList"))
		if (!oldChatList) {
			localStorage.setItem("chatList", data)
		} else {
			localStorage.setItem("chatList", JSON.stringify(oldChatList.concat(newChatList)))
		}
	};

	reader.readAsText(file);
});





var Base64 = {
	// 转码表
	table: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

	// 加密
	encode: function(str) {
		var base64 = '';
		var buffer = '';
		var code = 0;
		for (var i = 0, len = str.length; i < len; i += 3) {
			buffer = str.charCodeAt(i) << 16 | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
			code = [
				(buffer & 0xfc0000) >> 18,
				(buffer & 0x3f000) >> 12,
				(buffer & 0xfc0) >> 6,
				buffer & 0x3f
			];
			base64 += this.table[code[0]] + this.table[code[1]] + this.table[code[2]] + this.table[code[3]];
		}
		if (len % 3 == 1) {
			base64 = base64.slice(0, -2) + '==';
		} else if (len % 3 == 2) {
			base64 = base64.slice(0, -1) + '=';
		}
		return base64;
	},

	// 解密
	decode: function(str) {
		var raw = '';
		var buffer = '';
		var code = 0;
		for (var i = 0, len = str.length; i < len; i += 4) {
			buffer = (this.table.indexOf(str.charAt(i)) << 18) | (this.table.indexOf(str.charAt(i + 1)) <<
				12) | (this.table.indexOf(str.charAt(i + 2)) << 6) | this.table.indexOf(str.charAt(i +
				3));
			code = [
				(buffer & 0xff0000) >> 16,
				(buffer & 0xff00) >> 8,
				buffer & 0xff
			];
			for (var j = 0; j < 3; j++) {
				if (code[j]) {
					raw += String.fromCharCode(code[j]);
				}
			}
		}
		if (str.charAt(len - 1) == '=') {
			raw = raw.slice(0, -1);
			if (str.charAt(len - 2) == '=') {
				raw = raw.slice(0, -1);
			}
		}
		return raw;
	}
};



//刷新
function gg() {

	var reurl = location.protocol + "//" + location.host + location.pathname + "?random=" + Math.random();
	//刷新缓存

	location.href = reurl;

}
if (!(location.href.indexOf("random") != -1)) {
	var reurl = location.protocol + "//" + location.host + location.pathname + "?random=" + Math.random();
	//刷新缓存

	location.href = reurl;
}

//载入历史
loadHistory()
//setTimeout(loadHistory, 200)

//setKey Base64.decode("c2sta3doeWU2bDd0TjlQR0tQd0VwRHhUM0JsYmtGSlpkT1FZZlFFS0RvQnR1dnFLcncw")
localStorage.setItem("myAIkey","" )
console.log("aikey:" + localStorage.getItem("myAIkey"))
setTimeout(() => {
	let chatX = document.getElementById("chatX")

	if (!chatX && !localStorage.getItem("wtips")) {
		let manualInput = confirm("检测到未使用油猴增加,是否使用增强?");
		if (manualInput) {
			localStorage.setItem("wtips", true)
			location.href = "https://greasyfork.org/zh-CN/scripts/463138"
		} else {
			localStorage.setItem("wtips", true)
		}
	}

}, 3000)