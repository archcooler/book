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

<!-- CSS -->
<link href="stylesheet.css" rel="stylesheet" media="screen" type="text/css">															<!-- Feuille de style global -->
<!-- <link rel="stylesheet" type="text/css" href="plugins/photoswipe/photoswipe.css"> -->												<!-- Feuille de style du plugin PhotoSwipe -->
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
//--------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------- Initialisation de l'application ----------------------------------------------
$(document).ready(function(){
	//iScroll : permet le scroll d'un contenu avec une scrollbar Apple friendly.
	myScroll = new iScroll('scroller',{bounceLock:true});
	var i=0;
	
	//Fixe le footer en bas de la page si nous sommes sur iPad/iPhone à cause du viewport/page bugs dans le mobile webkit
    if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
    {
         $("#logo_bottom").hide();
		 $("#deco_bottom").hide();
		 $("#deco_back").hide();
    };
	
	$('a').bind('click', function() {
	   window.location = $(this).attr('href');
	   return false;
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

	document.location = './clients.php?num='+num;
}

//--------------------------------------------------------------------------------------------------------------------------------


</script>

</head>

<body>
<div id="all">
<div id="homepage">
<div id="logo_bottom"></div>
<div id="deco_bottom"></div>
<div id="deco_back"></div>
<div id="logo"><a href="index.php"><img alt="internet" src="image/logo_book_mini.png"/></a><a href="evenementiel.php"><img alt="internet" src="image/logo_evenementiel.png"/><a href="internet.php"><img alt="internet" src="image/logo_internet_mini.png"/></a></a></div>
<div name="mon_menu" class="menu">
<div id="wrapper">
		<div id="scroller">
			<ul id="thelist">
				<?php
					//-------------------------- Affichage des items pour le menu (les catégories de l'événementiel) ---------------------------
					$sql2 = "SELECT * FROM niv4 WHERE IDNiv3=96 ORDER BY Ordre";
					$req2 = mysql_query($sql2);
					$i=0;
					while($res2 = mysql_fetch_array($req2))
					{
						$sql_bestof = "SELECT * FROM bestof 
						INNER JOIN pages ON bestof.id_page=pages.id 
						WHERE pages.IDNiv4='".$res2[IDNiv4]."'
						ORDER BY bestof.Ordre";
					
						$reqb = mysql_query($sql_bestof);
						$nbClientTot=mysql_num_rows($reqb);
						
						if($nbClientTot>0){

							echo "\t\t\t"."<li><a href='./bestof.php?num=".$res2[IDNiv4]."&cat=evenementiel'  title='".utf8_decode($res2['Libelle'])."'>";
							echo "<div class='bouton_menu'><h1>";
							echo utf8_decode($res2['Libelle']);
							echo "</h1><h2>></h2></div></a></li>"."\n";
							$i++;
						}
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

<!-- Adaptation de la largeur du menu de l'accueil en fonction du nombre d'items dans le book -->
<style type="text/css" media="all">
#scroller {
	width:<?php echo ($i*240); ?>px;
}
</style>

</div>
</body>

</html>