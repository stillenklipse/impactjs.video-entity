/***
	This lets you place a mp4 into an entity and display in in Weltmeister for scalling and placement.
	There is a callback for video ending, such as load the next level and use this as simple level cut scene
	This can be extented to also be a moveable player on the game as well
	This doesn't test for video types or checks for abilty to play, as I was only targeting webkit browsers, so mp4 would be fine.
***/

ig.module(
	'game.entities.video'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityVideo = ig.Entity.extend({
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(255, 100, 0, 0.7)',
		size: {x: 360, y: 360},
		pos:{x:0, y:0},
		videoSrc:'media/video.mp4',
		videoControls:true,
		videoScaling:'aspect-fill',// 'fill','none',
		videoStartFrame:0,
		video: null,
		videoDisplay:'block', // css values, display none to hide
		videoId:'v',// for multiple videos
		init: function( x, y, settings ) {
			var video = document.createElement('video');
			var parent = this;
			video.src = this.videoSrc;
			video.id=this.videoId;
			video.style.display=this.videoDisplay;
			video.addEventListener('canplaythrough', function(){
			    video.scalingMode = this.videoScaling;
			    video.play();
			    video.currentTime=this.videoStartFrame;
			    video.addEventListener('ended', function(){
			    	parent.videoEnded();
				}, false);
			}, false);
			document.body.appendChild(video);
			this.video = video;
			this.parent( x, y, settings );
		},
		videoEnded:function(){
			// loops, could load next level.
			//this.video.play();
			this.kill();
		},
		kill:function(){
			// We should destroy the video object and remove when done as well to clean up resources
			var id = this.videoId;
			var vidDelete= document.getElementById(id);
			vidDelete.parentNode.removeChild(vidDelete);
			this.parent();
		},
		draw: function() {
			var ctx = ig.system.context;
			var s = ig.system.scale;
			var x = this.pos.x * s - ig.game.screen.x * s;
			var y = this.pos.y * s - ig.game.screen.y * s;
			var sizeX = this.size.x * s;
			var sizeY = this.size.y * s;
			ctx.save();
			ctx.drawImage(this.video, x, y, sizeX, sizeY );
			ctx.restore();
			this.parent();
	    },
		update: function(){
			this.parent();
		}
	});
});