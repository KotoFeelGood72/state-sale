const videoPlayer = Array.from(document.querySelectorAll('.video_block')).map(p => new Plyr(p, {
	iconUrl: 'i/sprite/sprite.svg',
	invertTime: false,
	hideControls: false
}));

videoPlayer.map(item => item.on('play', () => {
	item.toggleControls(true);

	videoPlayer.map((itemA) => {
		if (itemA !== item) {
			itemA.stop();
		}
	})
}));

videoPlayer.map(item => item.on('pause ready', () => {
	item.toggleControls(false);
}));

const spriteUrl = "i/sprite/sprite.svg";

const heroVideo = new Plyr(document.querySelector('#video'), {
	invertTime: false,
	controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions','pip','airplay', 'fullscreen' ],
	iconUrl: spriteUrl,
	hideControls: true,
	muted: true,
}
);