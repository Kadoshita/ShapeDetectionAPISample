window.onload = function () {
	var localStream = null;
	var captureTimer = null;
	var fps = 10;

	var video = document.getElementById('my-video');
	var canvas = document.getElementById('capture');
	var ctx = canvas.getContext('2d');

	var startbtn = document.getElementById('start');
	var stopbtn = document.getElementById('stop');
	var frameratevalue = document.getElementById('frameratevalue');
	var framerate = document.getElementById('framerate');

	startbtn.onclick = function () {
		navigator.mediaDevices.getUserMedia({ video: { height: 480, width: 640 }, audio: false })
			.then(function (stream) {
				video.srcObject = stream;
				localStream = stream;

				if (window.FaceDetector) {
					var detector = new FaceDetector();
					captureTimer = setInterval(function () {
						ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
						var scale = 300/640;
						detector.detect(video).then(function (faces) {
							ctx.lineWidth = 2;
							ctx.strokeStyle = 'red';
							for (var face of faces) {
								ctx.beginPath();
								ctx.rect(face.boundingBox.x * scale, (face.boundingBox.y - face.boundingBox.height) * scale, face.boundingBox.width * scale, face.boundingBox.height * scale);
								ctx.stroke();
								console.log(face);
							}
						}).catch(function (err) {
							console.error(err);
						});
					}, 1000/fps);
				} else {
					console.error('FaceDetector is not enable!');
				}
			}).catch(function (err) {
				console.error(err);
			});
	};

	stopbtn.onclick = function () {
		clearInterval(captureTimer);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		localStream.getTracks().forEach(function (track) {
			track.stop();
		});
		localStream = null;
		video.srcObject = null;
	};

	framerate.addEventListener('input', function () {
		frameratevalue.textContent = framerate.value;
		fps = parseInt(framerate.value, 10);
	});
}