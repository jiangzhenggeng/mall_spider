var getPixelRatio = function (context) {
	var backingStore = context.backingStorePixelRatio ||
		context.webkitBackingStorePixelRatio ||
		context.mozBackingStorePixelRatio ||
		context.msBackingStorePixelRatio ||
		context.oBackingStorePixelRatio ||
		context.backingStorePixelRatio || 1;

	return (window.devicePixelRatio || 1) / backingStore;
};


function download(message) {
	var info = message.info;
	var o_offset = {
		left: info.offsetLeft,
		top: info.offsetTop,
	};
	var o_w_h = {
		h: info.height,
		w: info.width
	};
	var scrollTop = info.scrollTop;
	var scrollLeft = info.scrollLeft;

	chrome.tabs.captureVisibleTab(null, {
		format: "png",
		quality: 100
	}, function (data) {
		var image = new Image();
		image.onload = function () {
			var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");
			var ratio = getPixelRatio(context)
			var scale = 3

			canvas.width = o_w_h.w * scale;
			canvas.height = o_w_h.h * scale;

			context.scale(1 / ratio, 1 / ratio)

			context.drawImage(image,
				-o_offset.left * ratio, 0,
				o_w_h.w * ratio,
				o_w_h.h * ratio,
				0, 0,
				canvas.width * ratio, canvas.height * ratio
			);

			var time = new Date().getTime();

			chrome.downloads.download({
				url: canvas.toDataURL(),
				filename: "spread-" + time + ".png",
				conflictAction: 'uniquify',
				saveAs: false
			});

			chrome.notifications.create(null, {
				type: 'basic',
				iconUrl: 'images/create-success.png',
				title: '消息',
				message: '传播图生成成功!'
			});

		};

		image.src = data;
	});
}


function sendMessageToContentScript(message, callback) {
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
			if (callback) callback(response);
		});
	});
}


//图片生成事件
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

	if (message.type == 'get-bcActiveTab') {
		download(message);
		sendResponse({
			result: 'ok',
		});
		//收录数据
		var item = message.data;
		$.post('http://zdm.jiguo.com/admin/Product/InsertProductDraft', {
			catch_data: {
				'name': item.title,
				'detail': item.detail || '',
				'pic': item.pic || [],
				'cover': item.cover || item.pic[0],
				'url': item.url,
				'mall': item.mall,
				'shop': item.shop,
				'price': item.price,
				'mark_price': item.mark_price,
				'discount': item.discount,
			}
		}, replayDate => {
			var list = store.get('data') || [];
			if (replayDate.status == 0) {
				list.forEach(function (_item, _index) {
					if (_item.id == id) {
						list[_index].included = 1;
					} else if (!list[_index].included) {
						list[_index].included = 0;
					}
				});
				store.set('data', list);

			} else {
				$.alert(replayDate.message || '收录失败');
			}

			sendMessageToContentScript({
				type: message.type + '-replay',
				data: replayDate
			});

		}, 'json');

	} else if (message.type == 'get-check-cps') {

		$.get('http://zdm.jiguo.com/admin/index/setcps', {
			url: message.url
		}, replayDate => {
			sendMessageToContentScript({
				type: message.type + '-replay',
				data: replayDate
			});

		});
	} else if (message.type == 'get-save-card-data') {
		$.post('http://zdm.jiguo.com/admin/index/InsertPic', {
			pic: message.pic,
			discount: message.discount
		}, replayDate => {
			sendMessageToContentScript({
				type: message.type + '-replay',
				data: replayDate
			});
		}, 'json');

	} else if (message.type == 'get-store') {
		sendResponse({
			storeData: store.get('data')
		});
	} else if (message.type == 'upload-cover') {//上传封面

		var imageData = message.data.cover.replace("image/jpeg", 'image/octet-stream'),
			filename = new Date().getDate() + String(Math.random()).replace('0.', '') + '.png';

		var fd = new FormData();

		var xhr = new XMLHttpRequest();
		fd.append('file', dataURItoBlob(imageData), filename);

		xhr.open('POST', 'http://zdm.jiguo.com/admin/ajax/RepairUpload');
		xhr.send(fd);
		xhr.onreadystatechange = function () {
			if (4 == xhr.readyState) {
				if (200 == xhr.status) {
					var replyData = JSON.parse(xhr.responseText);

					var data = store.get('data');
					data = data.map((_item, _index) => {
						if (_item.id == message.data.id) {
							_item.cover = replyData.result.url;
						}
						return _item;
					});
					store.set('data', data);

					sendMessageToContentScript({
						type: message.type + '-replay',
						cover: replyData.result.url
					});
				}
			}
		}

	}

});


function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], {type: mimeString});
}


