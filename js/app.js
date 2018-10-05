$(document).ready(function(){
    animacionTitulo(); 
  
});
function animacionTitulo(){ 
    $( ".main-titulo" ).animate({
        color: "yelow",
      }, 1500)
      .animate({
        color: "white",
      }, 1500,
    animacionTitulo)
}

function mostrarDulces(){ 
    var columnas = $(".colu img");
    $('*[class^="col-"]').css("display", "none").fadeIn(1800)
    for (var i =0; i<columnas.length; i++){
        min = Math.ceil(1);
        max = Math.floor(5);
        imagen = "image/" + (Math.floor(Math.random() * (max - min)) + min) + ".png";
        $(columnas[i]).attr("src",imagen)
    }   
}

var click = 0
var columnas = $('*[class^="col-"]'); 
var puntos = 0; 
var movimientos = 0; 

var busquedaHorizontal,busquedaVertical,buscarNuevosDulces,lencolum,lenrest,maximo,matriz,intervalo,eliminar,nuevosDulces,tiempo,i,contadorTotal,espera,score,mov,min,seg;


busquedaHorizontal = 0;busquedaVertical = 0;buscarNuevosDulces = 0;lencolum = ["","","","","","",""];lenrest = ["","","","","","",""];maximo = 0;matriz = 0;intervalo = 0;eliminar = 0;nuevosDulces = 0;tiempo = 0;i = 0;contadorTotal = 0;espera = 0;score = 0;mov = 0;min = 2;seg = 0;
$(".btn-reinicio").click(function(){
	$(".panel-score").css("width","25%");
	$(".panel-tablero").show();
	$(".time").show();
	$("#score-text").html("0");
	$("#movimientos-text").html("0");
	$(this).html('<a href="" class="reinicio">Reiniciar</a>');
	intervalo=setInterval(function(){
		desplazamiento()
	},600);
	tiempo=setInterval(function(){
		timer()
	},1000);
});

function desplazamiento(){
	i=i+1
	var numero=0;
	var imagen=0;
	$(".elemento").draggable({disabled:true});
	if(i<8){
		for(var j=1;j<8;j++){
			if($(".col-"+j).children("img:nth-child("+i+")").html()==null){
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
			}}}
	if(i==8){
		clearInterval(intervalo);
		eliminar=setInterval(function(){
			eliminarhorver()
		},150);
	}
};

function timer(){
	var cero = '';
	if(seg < 10){
		cero = '0';
	} else {
		cero = '';
	}
	$("#timer").html("0"+min+" : "+cero+seg);
	if(seg!=0){
		seg=seg-1;}
	if(seg==0){
		if(min===seg){
			clearInterval(eliminar);
			clearInterval(nuevosDulces);
			clearInterval(intervalo);
			clearInterval(tiempo);
			$(".panel-tablero").hide("drop","slow",gameOver);
			$(".time").hide();
		}
		seg=59;
		min=min-1;
	}
};

function eliminarhorver(){
	matriz=0;
	busquedaHorizontal=horizontal();
	busquedaVertical=vertical();
	for(var j=1;j<8;j++){
		matriz=matriz+$(".col-"+j).children().length;
	}
	if(busquedaHorizontal==0 && busquedaVertical==0 && matriz!=49){
		clearInterval(eliminar);
		buscarNuevosDulces=0;
		nuevosDulces=setInterval(function(){
			nuevosdulces()
		},600);
	}
	if(busquedaHorizontal==1||busquedaVertical==1){
		$(".elemento").draggable({disabled:true});
		$("div[class^='col']").css("justify-content","flex-end");
		$(".activo").hide("pulsate",1000,function(){
			var scoretmp=$(".activo").length;
			$(".activo").remove("img");
			score=score+scoretmp*10;
			$("#score-text").html(score);
		});
	}
	if(busquedaHorizontal==0 && busquedaVertical==0 && matriz==49){
		$(".elemento").draggable({
			disabled:false,
			containment:".panel-tablero",
			revert:true,
			revertDuration:0,
			snap:".elemento",
			snapMode:"inner",
			snapTolerance:40,
			start:function(event,ui){
				mov=mov+1;
				$("#movimientos-text").html(mov);}
		});
	}
	$(".elemento").droppable({
		drop:function (event,ui){
			var dropped=ui.draggable;
			var droppedOn=this;
			espera=0;
			do{
				espera=dropped.swap($(droppedOn));}
			while(espera==0);
			busquedaHorizontal=horizontal();
			busquedaVertical=vertical();
			if(busquedaHorizontal==0 && busquedaVertical==0){
				dropped.swap($(droppedOn));}
			if(busquedaHorizontal==1 || busquedaVertical==1){
				clearInterval(nuevosDulces);
				clearInterval(eliminar);
				eliminar=setInterval(function(){
					eliminarhorver()
				},150);}},
	});
};

jQuery.fn.swap=function(b){
	b=jQuery(b)[0];
	var a=this[0];
	var t=a.parentNode.insertBefore(document.createTextNode(''),a);
	b.parentNode.insertBefore(a,b);
	t.parentNode.insertBefore(b,t);
	t.parentNode.removeChild(t);
	return this;
};

function nuevosdulces(){
	$(".elemento").draggable({disabled:true});
	$("div[class^='col']").css("justify-content","flex-start")
	for(var j=1;j<8;j++){
		lencolum[j-1]=$(".col-"+j).children().length;
	}
	if(buscarNuevosDulces==0){
		for(var j=0;j<7;j++){
			lenrest[j]=(7-lencolum[j]);}
		maximo=Math.max.apply(null,lenrest);
		contadorTotal=maximo;
	}
	if(maximo!=0){
		if(buscarNuevosDulces==1){
			for(var j=1;j<8;j++){
				if(contadorTotal>(maximo-lenrest[j-1])){
					$(".col-"+j).children("img:nth-child("+(lenrest[j-1])+")").remove("img");}}
		}
		if(buscarNuevosDulces==0){
			buscarNuevosDulces=1;
			for(var k=1;k<8;k++){
				for(var j=0;j<(lenrest[k-1]-1);j++){
					$(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>");
				}
			}
		}
		for(var j=1;j<8;j++){
			if(contadorTotal>(maximo-lenrest[j-1])){
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>");
			}
		}
	}
	if(contadorTotal==1){
		clearInterval(nuevosDulces);
		eliminar=setInterval(function(){
			eliminarhorver()
		},150);
	}
	contadorTotal=contadorTotal-1;
};

function horizontal(){
	var busHori=0;
	for(var j=1;j<8;j++){
		for(var k=1;k<6;k++){
			var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src");
			var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src");
			var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src");
			if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
				$(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				$(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				$(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				busHori=1;
			}
		}
	}
	return busHori;
};

function vertical(){
	var busVerti=0;
	for(var l=1;l<6;l++){
		for(var k=1;k<8;k++){
			var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src");
			var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src");
			var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src");
			if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
				$(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo");
				busVerti=1;
			}
		}
	}
	return busVerti;
};

function gameOver(){
	$(".panel-score").animate({width:'100%'},3000);
	$(".termino").css({"display":"block","text-align":"center"});
};