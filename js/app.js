$(document).ready(function(){
	initPlayer();
	getSongs();
	setHalfVolume();
});

//Establecemos todas las variables las cuales el analyser_render usara
var audio;
var music;
var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

audio = document.getElementById('player');

window.addEventListener("load", initMp3Player, false);

function initPlayer(){
	context = new webkitAudioContext(); // AudioContext object instance
	analyser = context.createAnalyser(); // AnalyserNode method
	canvas = document.getElementById('analyser_render');
	ctx = canvas.getContext('2d');
	ctx.shadowColor = 'black';
	ctx.shadowBlur = 10;
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;
	// Re-route audio playback into the processing graph of the AudioContext
	source = context.createMediaElementSource(audio); 
	source.connect(analyser);
	analyser.connect(context.destination);
	frameLooper();
}

//Se carga la cancion seleccionada en el listado de canciones
function playSong(id){
	$('#player').attr('src',music.songs[id].song);
	audio.play();
}

//Funcion la cual regula el volumen de las canciones
function setHalfVolume() { 
		audio = document.getElementById('player');
    	audio.volume = 0.04;
}

//Aqui se llama el objeto json, el cual tiene el listado de las canciones con su id, nombre , artista y demas
function getSongs(){
	$.getJSON("./js/app.json",function(mjson){
		music = mjson;
		console.log(music);
		genList(music);
	});
}

//Aqui por medio de un foreach se cargan las canciones y se dan dos parametros i y song , los cuales 
//se cargan en la lista, i = id de la cancion y dentro del li se especifica el nombre de la cancion
//como lo es song.name 
function genList(music){
	$.each(music.songs,function(i,song){
		$('#playlist').append('<li style="display: table-row" class="list-group-item" id="'+i+'">'+song.name+'</li>');
	});
	$('#playlist li').click(function(){
		var selectedsong = $(this).attr('id'); //la variable cancion seleccionada o selectedsong se agrega a cada li de la playlist
		console.log(selectedsong);
		playSong(selectedsong);
	});
}

//Esta funcion es la encargada de mostrar las barras de frecuencia en el canvas
function frameLooper(){
	window.webkitRequestAnimationFrame(frameLooper); //pedimos que nos dibuje los frames en el canvas
	fbc_array = new Uint8Array(analyser.frequencyBinCount); 
	analyser.getByteFrequencyData(fbc_array); 
	ctx.clearRect(0, 0, canvas.width, canvas.height); // limpia el canvas
	ctx.fillStyle = '#84FFFF'; // se escoge el color de las barras
	bars = 100;
	for (var i = 0; i < bars; i++) { 
		bar_x = i * 3;
		bar_width = 2;
		bar_height = -(fbc_array[i] / 2);
		//  fillRect( x, y, width, height )
		ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
	}
}

//por ultimo se definen dos funciones las cuales se encargan de mostrar y ocultar la lista de canciones
function mostrar_lista_canciones(){
		  document.getElementById('playlist').style.visibility = 'visible';
}
		function ocultar_lista_canciones(){
			 setTimeout(function(){
			 document.getElementById('playlist').style.visibility = 'hidden'; 
		  },3500); //aqui tarda en ocultarse alrededor de 3 a 4 segundos
			 
}