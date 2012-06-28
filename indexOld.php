<?php include("include/connexion.php");?>																								<!-- Connexion à la base de données -->
<html manifest="cache.manifest"> 																										<!-- Adresse du cache.manifest par rapport au fichier courant -->

<head>

<title>Tr. Associ&eacute;</title>																										<!-- Nom que portera la Webapp -->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />																	<!-- Encodage du contenu en utf-8 -->
<meta name="author" content="Travail Associé ©2012">																					<!-- Auteur de la page -->
<meta name="owner" content="Travail Associé ©2012">																						<!-- Propriétaire de la page -->

<!-- Codes iOS/Android -->
<meta name="apple-mobile-web-app-capable" content="yes" /> 																				<!-- L'app peut se débrouiller sans Safari (supprimer la barre d'url (en haut) et celle de navigation (en bas)) -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /> 																	<!-- La barre contenant l'horloge etc est noire et devient un block qui décale le contenu dessous contrairement à la valeur "black-translucent" -->
<meta name="viewport" content="user-scalable=no, width=device-width, minimum-scale=1.0, maximum-scale=1.0" /> 							<!-- Application (empêche le zoom) -->
<meta name="apple-touch-fullscreen" content="yes"/>																						<!-- en plein écran -->
<link rel="apple-touch-icon" href="image/travailassocie.png"/> 																			<!-- Choisir une icône pour le springboard -->
<link rel="apple-touch-startup-image" 
	media="screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation:portrait)"
	href="image/startup_ipad_portrait.jpg"/>																							<!-- Choisir une image de chargement (768*1004, orientation portrait, pour iPad) -->
<link 
	sizes="1024x748"
	rel="apple-touch-startup-image" 
	media="screen and (min-device-width: 1024px) and (max-device-width: 768px) and (orientation:landscape)" 
	href="image/startup_ipad_paysage.jpg"/> 																							<!-- Choisir une image de chargement (1024*764, orientation paysage, pour iPad) -->

<!-- CSS -->
<link href="stylesheet.css" rel="stylesheet" media="screen" type="text/css">															<!-- Feuille de style global -->
<link rel="stylesheet" type="text/css" href="plugins/photoswipe/photoswipe.css">														<!-- Feuille de style du plugin PhotoSwipe -->
<link rel="stylesheet" type="text/css" href="plugins/ferroslider/jquery.ferro.ferroSlider.css">											<!-- Feuille de style du plugin Ferroslider -->

<!-- Scripts -->
<script type="text/javascript" src="javascript/jquery-1.7.1.min.js" language="javascript" charset="utf-8"></script>						<!-- Utilisation du framework jQuery -->
<script type="text/javascript" src="javascript/iscroll.js" language="javascript" charset="utf-8"></script>								<!-- Utilisation du plugin iScroll -->
<!-- <script type="text/javascript" src="plugins/photoswipe/lib/klass.min.js" language="javascript" charset="utf-8"></script> -->					<!-- Utilisation du plugin Klass nécessaire pour le PhotoSwipe -->
<!-- <script type="text/javascript" src="plugins/photoswipe/code.photoswipe.jquery-3.0.4.js" language="javascript" charset="utf-8"></script> -->	<!-- Utilisation du plugin PhotoSwipe pour jQuery (! non original) -->
<script type="text/javascript" src="javascript/jquery.easing.1.3.js" language="javascript" charset="utf-8"></script>					<!-- Utilisation de la librairie à effet avancé de jQuery -->
<script type="text/javascript" src="plugins/ferroslider/jquery.ferro.ferroSliderDev.js" charset="utf-8"></script>						<!-- Utilisation du plugin FerroSlider pour jQuery (! non original) -->
<script type="text/javascript" src="javascript/jquery.touchSwipe-1.2.5.js"></script>
<script type="text/javascript">

//---------------------------------------------------- Conseils, Remarques -------------------------------------------------------
// ATTENTION : ne pas mettre à jour les scripts "ferroSliderDev.js" et "code.photoswipe.jquery-3.0.4.js" car ils ont été modifiés 
// pour être compatible iPad, tout en ajoutant des fonctionnalités : par exemple l'ajout de la description des photos sur les 
// diaporamas PhotoSwipe.

// A SAVOIR : la fonction "e.preventDefault()" empêche les liens de fonctionner à l'interieur d'un contenu dans le cas où un 
// événement "touchstart" y aurai été associé... C'est pour cette raison que le script "ferroSliderDev.js" a été modifié.
// La webapp est concentrée sur cette seule et unique page (index.php) pour permettre une gestion du cache plus facile.
//--------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------- Déclaration et initialisation des variables ----------------------------------------
var myScroll;
var myPhotoSwipe=new Array();
var ferroSlider=new Object();

var IMG_WIDTH = 695;
var speed=500;

var imgs=new Array();
var maxImages=new Array();
var currentImg=new Array();
var countClient=0;
var isInitialised=0;

	
var swipeOptions=
{
	triggerOnTouchEnd : true,	
	swipeStatus : swipeStatus,
	allowPageScroll:"vertical",
	threshold:20
}
//--------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------- Initialisation de l'application ----------------------------------------------
$(document).ready(function(){
	//iScroll : permet le scroll d'un contenu avec une scrollbar Apple friendly.
	myScroll = new iScroll('scroller',{bounceLock:true});
	var i=0;
	
	//PhotoSwipe : permet l'affichage et le défilement des images en gallerie plein écran, ici on crée et initialise les galleries avec les paramètres souhaités.
	/*$('.gallery').each(function(){
		if($("#Gallery_"+i+" a").length !=0) 
			myPhotoSwipe[i] = $("#Gallery_"+i+" a").photoSwipe({ 
				enableMouseWheel				: false,	//Désactive le slide avec la molette de la souris
				enableKeyboard					: true,		//Active le slide avec les flèches du clavier
				allowUserZoom					: false,	//Désactive la possibilité de zoomer sur les photos
				captionAndToolbarAutoHideDelay	: 0			//Affiche l'interface du diaporama (entête et menu) de manière permanente, mais peut être caché puis réaffiché en touchant une fois sur l'écran
			});
		else
			myPhotoSwipe[i] = null;
		i++;
	});*/
	
	//Fixe le footer en bas de la page si nous sommes sur iPad/iPhone à cause du viewport/page bugs dans le mobile webkit
    if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
    {
         $("#logo_bottom").hide();
		 $("#deco_bottom").hide();
		 $("#deco_back").hide();
    };
	

	countClient=0;
	$('.client').each(function(){
		maxImages[countClient] = $("#client_"+countClient+" .imgs img").length;
		currentImg[countClient]=0;
		imgs[countClient] = $("#client_"+countClient+" .imgs");
		imgs[countClient].swipe( swipeOptions );
		countClient++;
	});
	
});
//--------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------- Les fonctions -------------------------------------------------------
//Affiche une gallerie en plein écran.
function showGallery(num){
		if(myPhotoSwipe[num]!=null) myPhotoSwipe[num].show(0);
	}

//Affiche les clients de la catégorie séléctionné.
function slideCat(num){	
	$('#homepage').hide();
	
	//Par défault Ferroslider supprime le contenu de la div qui lui est associé, ce qui pose un problème pour retouver les données originelles, pour le résoudre on fait une sauvegarde de la div originelles.
	var content = $('#content_'+num).html();

	//Application du Ferroslider qui permet une navigation des clients par navigation vertical dans ce cas précis
	ferroSlider = $('.slidingSpaces_'+num).ferroSlider({
		displace				: 'column', 		//Pour un slide vertical exclusivement
		easing                  : 'easeOutExpo', 	//Pour un effet plus fluide lors de l'animation
		feedbackArrows          : true,				//Possibilité de naviguer avec des flèches
		time : 600									//Temps d'éxecution de la transition
	});

	//On remet les données originelles de la div pour ne pas perdre d'informations.
	$('#content_'+num).html(content);
	

	if(isInitialised==1){
	countClient=0;
	$('.client').each(function(){
		imgs[countClient] = $("#client_"+countClient+" .imgs");
		imgs[countClient].swipe( swipeOptions );
		maxImages[countClient] = $("#client_"+countClient+" .imgs img").length;
		currentImg[countClient]=0;
		countClient++;
	});
	}
	
	isInitialised++;
	if(isInitialised>1) isInitialised=0;
	
}

//Retourne à la page d'accueil
function backToHome(){
	$('.slidingSpacesOuterDiv').remove();
	$('#slidingSpacesNavigationMap').remove();
	$('#slidingSpacesNavigationFeedback').remove();
	$('#homepage').show();
}
//--------------------------------------------------------------------------------------------------------------------------------

	
/**
* Catch each phase of the swipe.
* move : we drag the div.
* cancel : we animate back to where we were
* end : we animate to the next image
*/			
function swipeStatus(event, phase, direction, distance)
{

	countClient=$(this).attr('title');
	//If we are moving before swipe, and we are going Lor R in X mode, or U or D in Y mode then drag.
	if( phase=="move" && (direction=="left" || direction=="right") )
	{
		var duration=0;
		
		if (direction == "left")
			scrollImages((IMG_WIDTH * currentImg[countClient]) + distance, duration);
		
		else if (direction == "right"){
			scrollImages((IMG_WIDTH * currentImg[countClient]) - distance, duration);
			}
		
	}
	
	else if ( phase == "cancel")
	{
		scrollImages(IMG_WIDTH * currentImg[countClient], speed);
	}
	
	else if ( phase =="end" )
	{
		if (direction == "right")
			previousImage()
		else if (direction == "left")			
			nextImage()
	}
}
		


function previousImage()
{
	currentImg[countClient] = Math.max(currentImg[countClient]-1, 0);
	scrollImages( IMG_WIDTH * currentImg[countClient], speed);
}

function nextImage()
{
	currentImg[countClient] = Math.min(currentImg[countClient]+1, maxImages[countClient]-1);
		
	scrollImages( IMG_WIDTH * currentImg[countClient], speed);
}
	
/**
* Manuallt update the position of the imgs on drag
*/
function scrollImages(distance, duration)
{
	
	imgs[countClient].css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
	
	//inverse the number we set in the css
	var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
	imgs[countClient].css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
	
}

</script>

</head>

<body>
<div id="all">
<div id="homepage">
<div id="logo_bottom"></div>
<div id="deco_bottom"></div>
<div id="deco_back"></div>
<div id="logo"></div>
<div name="mon_menu" class="menu">
<div id="wrapper">
		<div id="scroller">
			<ul id="thelist">
				<?php
					//-------------------------- Affichage des items pour le menu (les catégories du book) ---------------------------
					$sql2 = "SELECT Libelle, IDNiv2 FROM niv2 WHERE IDNiv1=2 ORDER BY Ordre";
					$req2 = mysql_query($sql2);
					$i=0;
					
					while($res2 = mysql_fetch_array($req2))
					{
						$sql3 = "SELECT IDNiv3 FROM niv3 WHERE IDNiv2='$res2[IDNiv2]' ORDER BY Ordre";
						$req3 = mysql_query($sql3);	
						$res3 = mysql_fetch_array($req3);
						
						echo "\t\t\t"."<li><a href='#' onclick='slideCat(".$i.")' title='".$req2['Libelle']."'>";
						echo "<div class='bouton_menu'><h1>";
						echo utf8_decode($res2['Libelle']);
						echo "<h2>></h2></div></a></li>"."\n";
						$i++;
					}
					//----------------------------------------------------------------------------------------------------------------
				?>
			</ul>
			<div class="clear"></div>
		</div>
</div>
</div>
<div id="back_menu"><div id="title_menu">Sortez votre communication de la banquise</div></div>
</div>
<?php
	
	//Selection des items du Book
	$req2 = mysql_query($sql2);
	
	//Récupération du fichier cache pour ajouter de nouvelles données.
	$cache=file_get_contents('cache.manifest');
	$i=0;
	$a=0;
	
	//Chemin des images
	$originalImagePath='../image/page/gd/';
	
	//---------------------------------------------------- [Les catégories] -----------------------------------------------------
	while($res2 = mysql_fetch_array($req2))
	{	
		echo '<div id="content_'.$i.'" title="'.utf8_decode($res2['Libelle']).'" class="content">'."\n";
		
		//Selection des clients de la catégorie
		$sqlb = "SELECT * FROM client, niv3 WHERE client.IDNiv2='$res2[IDNiv2]' AND client.id=niv3.IDNiv3 ORDER BY niv3.Ordre";
		$reqb = mysql_query($sqlb);
		$nbClientTot=mysql_num_rows($reqb);
		$c=1;
		$nbTrueClient=0;
		//--------------------------------------------- [Les clients de la catégorie] -------------------------------------------
		//Permet compter uniquement les clients qui disposent d'images.
		while($resb=mysql_fetch_array($reqb))
		{
			//Selection des images du client
			$sqlImage="SELECT * FROM photo WHERE idniv3 ='$resb[id]' ORDER BY ordre DESC";
			$reqcb2=mysql_query($sqlImage);
			$resSqlImage=mysql_fetch_array($reqcb2);
			$nbImagesClient=mysql_num_rows($reqcb2);
			
			if($nbImagesClient!=0) $nbTrueClient++;
		}
		
		$reqb = mysql_query($sqlb);
		while($resb=mysql_fetch_array($reqb))
		{
			//Selection des images du client
			
			$sqlImage="SELECT * FROM photo WHERE idniv3 ='$resb[id]' ORDER BY ordre DESC";
	
			$reqcb2=mysql_query($sqlImage);
			$resSqlImage=mysql_fetch_array($reqcb2);
			$nbImagesClient=mysql_num_rows($reqcb2);
			
			//Si il n'existe pas d'images associées au client on n'affiche pas ce client
			if($nbImagesClient!=0){
				echo "\t".'<div id="client_'.$a.'" class="client slidingSpaces_'.$i.' panels client" title="'.utf8_decode($resb['Libelle']).'">'."\n";
				
				//Bouton de retour à l'accueil
				echo "\t\t".'<div id="menu_slide"><a href="#" class="backToHome" onclick="backToHome();return false;"><div class="bt_back_hor">Accueil <span style="color:#009cd5;">&nbsp;&gt;</span></div><div class="bt_back"><h1>Accueil</h1></div></a><div class="title_cat">'.ucfirst(utf8_decode($res2['Libelle'])).' ('.$c.'/'.$nbTrueClient.')</div></div>'."\n";
				echo "\t\t".'<div class="clear"></div>'."\n";

				//Affichage de la première image du diaporama en aperçu
				/*if(is_file($originalImagePath.utf8_decode($resb[10]))){
					echo "\t\t".'<a href="#" onclick="showGallery('.$a.');return false;"><img alt="'.utf8_decode($rescb2['titre']).'" longdesc="'.strip_tags(utf8_decode($rescb2['description'])).'" src="'.$originalImagePath.utf8_decode($resb[10]).'" alt="'.utf8_decode($rescb2['Libelle']).'" /></a>'."\n";	
				}*/
				
				//------------------------------------------- [Les images des clients] ------------------------------------------
				//echo "\t\t".'<ul id="Gallery_'.$a.'" class="gallery" style="display:none">'."\n";	
				echo "\t\t".'<div id="diaporama">'.'<div class="imgs" title="'.$a.'">'."\n";
				echo "\t\t".'<img alt="'.utf8_decode($rescb2['titre']).'" longdesc="'.strip_tags(utf8_decode($rescb2['description'])).'" src="'.$originalImagePath.utf8_decode($resb[10]).'" alt="'.utf8_decode($rescb2['Libelle']).'" />'."\n";
				$k=0;
				
				while($rescb2=mysql_fetch_array($reqcb2))
				{
				
					//Ajout des images manquantes dans le manifest pour une future bonne gestion du cache
					if(!preg_match("#$originalImagePath" . utf8_decode($rescb2['image'])."#i", $cache)){
						$f = fopen("cache.manifest", "a");
						fputs($f, $originalImagePath . utf8_decode($rescb2['image']) . "\n");
						fclose($f);
					}
					
					if(!preg_match("#$originalImagePath" . utf8_decode($resb[10])."#i", $cache)){
						$f = fopen("cache.manifest", "a");
						fputs($f, $originalImagePath . utf8_decode($resb[10]) . "\n");
						fclose($f);
					}
					
					//Génération des images du diaporama
					/*if($k==0) echo "\t\t\t".'<li><a href="'.$originalImagePath.utf8_decode($resSqlImage['image']).'" ><img alt="'.utf8_decode($rescb2['titre']).'" longdesc="'.strip_tags(utf8_decode($rescb2['description'])).'" src="'.$originalImagePath.utf8_decode($resSqlImage['image']).'" alt="'.$resSqlImage['Libelle'].'" /></a></li>'."\n";
					echo "\t\t\t".'<li><a href="'.$originalImagePath.utf8_decode($rescb2['image']).'" ><img alt="'.utf8_decode($rescb2['titre']).'" longdesc="'.strip_tags(utf8_decode($rescb2['description'])).'" src="'.$originalImagePath.utf8_decode($rescb2['image']).'" alt="'.utf8_decode($rescb2['Libelle']).'" /></a></li>'."\n";*/
					
					if($k==0) echo "\t\t\t".'<img alt="'.utf8_decode($rescb2['titre']).'" longdesc="'.strip_tags(utf8_decode($rescb2['description'])).'" src="'.$originalImagePath.utf8_decode($resSqlImage['image']).'" alt="'.$resSqlImage['Libelle'].'" />'."\n";
					echo "\t\t\t".'<img alt="'.utf8_decode($rescb2['titre']).'" longdesc="'.strip_tags(utf8_decode($rescb2['description'])).'" src="'.$originalImagePath.utf8_decode($rescb2['image']).'" alt="'.utf8_decode($rescb2['Libelle']).'" />'."\n";

					$k++;
				}
				//echo "\t\t".'</ul>'."\n";
				echo "\t\t".'</div></div>'."\n";
				echo "\t\t".'<div class="clear"></div>'."\n";
				//------------------------------------------- [/Les images des clients] -----------------------------------------
				
				//Affiche la description du client
				//echo '<div>'.$resb['description'].'</div>'."\n";
				echo "\t".'</div>'."\n";
				$a++;
				$c++;
			}
		}
		//-------------------------------------------- [/Les clients de la catégorie] -------------------------------------------
		
		echo '</div>'."\n";
		$i++;
	}
	//---------------------------------------------------- [/Les catégories] ----------------------------------------------------
?>

<!-- Adaptation de la largeur du menu de l'accueil en fonction du nombre d'items dans le book -->
<style type="text/css" media="all">
#scroller {
	width:<?php echo ($i*240); ?>px;
}
</style>

</div>
</body>

</html>