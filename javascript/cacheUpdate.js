var webappCache = window.applicationCache;function updateCache(){webappCache.swapCache();alert("Une nouvelle version est disponible.\nVeuillez recharger l'application pour l'actualiser.");}if(navigator.onLine == true){webappCache.update();	webappCache.addEventListener("updateready", updateCache, true);}