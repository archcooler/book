/*
  Ferro Slider
  Requires jQuery (tested on 1.6.1, but no new features used).
  Requires (optional) jQuery easing (tested on 1.3, but no new features used).

  Copyright 2011 Ferro
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
  http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

(function( $ ){
    var methods = {
        //desktop or laptop
    		ferroSliderDesktop : function(options) { 
            	
            	var defaults = {
            			ajaxLoading				: false,
            			ajaxScript				: '',
    					axis					: '',
    					backGroundImageClass	: '',
    					container 				: 'none',
    					createLinks				: false,
    					createMap				: false,
    					displace 				: 'row',
    					easing 					: 'linear',
    					feedbackArrows 			: false,
    					fullScreenBackground 	: false,
    					linkClass 				: '',
    					mapPosition				: 'bottom_right',
    					preloadBackgroundImages	: false,
    					time 					: 300
    				};
    			
    			var opts = $.extend({},defaults, options);
    			var matrix = new Array();
    			var matrixOrder = new Array();
    			var displayWidth = 0;
    			var displayHeight = 0;
    			var offsetX = 0;
    			var offsetY = 0;
    			var initialPositionX = 0;
    			var initialPositionY = 0;
    			var actualCol = 0;
    			var actualRow = 0;
    			var elementToScroll = "html,body";
    			var zIndex = -1000;
    			var zIndexDecrement = 0;
    			var matrixRows = 0;
    			var matrixColumns = 0;
    			var actualOffsetX = 0;
    			var actualOffsetY = 0;
    			var scrollStartX= null;
    			var scrollStartY= null;
    			var min_move_x = 20;
    			var min_move_y = 20;
    			var isMoving = false;
    			var initialMobileHeight = 0;
    			var initialMobileWidth = 0;
    			var previousOrientation = 0;
    			var isMobile = isMobile();
    			
    			if(isMobile){
    				$("head").append('<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale='+(1/window.devicePixelRatio)+', minimum-scale = '+(Math.round((1/window.devicePixelRatio)*100)/100)+', maximum-scale = '+(Math.round((1/window.devicePixelRatio)*100)/100)+';"/>');
    				if(screen.width > 780 || screen.height > 1030){
    						window.location.reload();
    				}
    			}
    			
    			initializeWorkspace(this);
    			
    			if(isMobile){
    				$(elementToScroll).css("overflow","auto");
              	}
    			
    			actualOffsetY = initialPositionY;
				actualOffsetX = initialPositionX;
				
				window.scrollTo(0,0);
				window.scrollTo(initialPositionX,initialPositionY);
    		 	
    		 	$(document.body).append("<div id='slidingSpacesNavigationFeedback'></div>");
    		 	$("#slidingSpacesNavigationFeedback").hide();
    		 	$("#slidingSpacesNavigationFeedback").width(displayWidth);
    		 	$("#slidingSpacesNavigationFeedback").height(displayHeight);
    		 	$("#slidingSpacesNavigationFeedback").css({
    		 		marginLeft:offsetX,
    		 		marginTop:offsetY
    		 	});
    		 	
    		 	var anchor = window.location.hash;
    	 		
    	 		if ($.trim(anchor) != "") {
    	 			var actualEl = findElementById(anchor.replace("#",""));
    	 			actualCol = actualEl.column;
    	 			actualRow = actualEl.row;
    	 		}
    		 	
    		 	if(opts.createLinks){
    		 		$(".slidingSpacesOuterDiv").each(function(index) {
    		 			var $el = $(this);
    		 			$el.append("<div id='slidingSpacesNavigation_"+$el.attr("id")+"' class='slidingSpacesNavigation'><ul></ul></div>");
    					for(var i=0;i<matrixOrder.length;i++){
    						if(index != i){
    							if($("#"+matrixOrder[i].id).attr("title") != "" && $("#"+matrixOrder[i].id).attr("title") != null){
    								var linkTitle = $("#"+matrixOrder[i].id).attr("title");
    							}else{
    								var linkTitle = "Page "+i;
    							}
    							$("#slidingSpacesNavigation_"+$el.attr("id")+" ul").append("<li><a href='#"+matrixOrder[i].id+"' class='slidingSpacesNavigationLink' >"+linkTitle+"</a></li>");
    						}
    					}
    				});
    			}
    		 	
    		 	if(opts.createMap){
    		 		createMap();
    		 	}
    		 	
    		 	$(document).keydown(function(e){
    		 		var keyCode = e.keyCode || e.which;
    		 	    var arrow = {left: 37, up: 38, right: 39, down: 40 };
    		 		var go = false;
    		 		var direction = null;
    		 		var iCol = actualCol;
    		 		var iRow = actualRow;
    		 		
    			 	switch (keyCode) {
    			 		case arrow.left:
    			 			e.preventDefault();
    			 			if(actualCol > 0){
    			 				var toMove = findElementByPosition(actualRow,(actualCol-1));
    			 				if(toMove.id != null){
    			 					actualCol--;
    			 					go = true;
    			 				}
    			 			}
    			 		
    			 			break;
    			 	    case arrow.up:
    			 	    	e.preventDefault();
    			 	    	if(actualRow > 0){
    			 	    		var toMove = findElementByPosition((actualRow-1),actualCol);
    		 					if(toMove.id != null){
    		 						actualRow--;
    		 						go = true;
    		 					}
    			 			}
    			 	    	
    			 	    	break;
    			 	    case arrow.right:
    			 	    	e.preventDefault();
    			 	    	if(actualCol < matrixColumns){
    			 				var toMove = findElementByPosition(actualRow,(actualCol+1));
    			 				if(toMove.id != null){
    			 					actualCol++;
    			 					go = true;
    		 					}
    			 			}
    			 	    	break;
    			 	    case arrow.down:
    			 	    	e.preventDefault();
    			 	    	if(actualRow < matrixRows){
    			 	    		var toMove = findElementByPosition((actualRow+1),actualCol);
    			 	    		if(toMove.id != null){
    			 	    			actualRow++;
    			 	    			go = true;
    		 					}
    			 			}
    			 	    	break;
    			 	}
    			 	
    			 	if(go){
    			 		var leftShift = toMove.column*(displayWidth);
    					var topShift = toMove.row*(displayHeight);
    					
    			 		fireNavigationFeedback(iCol,iRow,actualCol,actualRow);
    			 		$(elementToScroll).stop();
    			 		$(elementToScroll).animate({
    						scrollTop: topShift,
    						scrollLeft: leftShift
    					},opts.time,opts.easing,function(){
    						$(elementToScroll).stop();
    						actualOffsetY = topShift;
    						actualOffsetX = leftShift;
    						loadContent(toMove);
    						$(elementToScroll).animate({
        						scrollTop: topShift,
        						scrollLeft: leftShift
        					},0);
    					});
    					if(opts.createMap){
    						refreshMap(toMove.id);
    					}
    			 		
    			 	}
    		 	});
    		 	
    		 	var sClasses = ".slidingSpacesNavigationLink, .slidingSpacesNavigationDot";
    		 	
    		 	if($.trim(opts.linkClass) != ""){
    		 		var linksClasses = linksClasses+", ."+opts.linkClass;
    		 	}
    		 	
    		 	$(linksClasses).each(function(index){
    		 		var $el = $(this);	
    		 		
    		 		$el.bind("click",function(event){
    		 			clickEvent(event,$el);
       				});
    		 		
    		 		$el.bind("touchstart",function(event){
    		 			clickEvent(event,$el);
       				});
    		 	});
    		 	
    		 	revMob = function(){
    		 		var oldWidth = displayWidth;
    		 		var oldHeight = displayHeight;
    		 		setMagicNumbers();
    		 		refreshPositionMobile(oldWidth,oldHeight);
    		 		if(opts.createMap){
    		 			positionMap();
    		 		}
    		 		
    		 	};
    		 	
    		 	if(!isMobile){
    		 		$(window).resize(function(){
    		 			revalidate();
	    		 	});
    		 	}
	    		 	
    		 		
    		 	if("onorientationchange" in window){
    		 		window.addEventListener("orientationchange", function() {
    		 			if(window.orientation !== previousOrientation){
    	    	 	        previousOrientation = window.orientation;
    	    	 	        setTimeout(revMob,100);
    	    	 	    }
        			}, false);
    		 	}
    
    			
    		 	
    		 	function cancelTouch() {
    				this.removeEventListener('touchmove', onTouchMove);
	              	scrollStartX = null;
	              	scrollStartY = null;
	              	isMoving = false;
	            }
    			
    			function clickEvent(event,$el){
    				event.preventDefault();
    				$(elementToScroll).stop();
    					
    					var toMove = findElementById($el.attr("href").replace("#",""));
    					var direction = null;
    					var directionX = null;
    					var directionY = null;
    					var iRow = actualRow;
    					var iColumn = actualCol;
    					var axis = findElementByOffset(displayWidth,displayHeight).axis;
    					
    					var leftShift = toMove.column*(displayWidth);
    					var topShift = toMove.row*(displayHeight);
    					
    					if(axis == 'xy'){
    						fireNavigationFeedback(actualCol,null,toMove.column,null);
    						$(elementToScroll).animate({
    							scrollLeft: leftShift
    						},opts.time,opts.easing,function(){
    							fireNavigationFeedback(null,iRow,null,toMove.row);
    							$(elementToScroll).animate({
    								scrollTop: topShift
    							},opts.time,opts.easing,function(){
    								initialPositionY = topShift;
    								initialPositionX = leftShift;
    								loadContent(toMove);
    							});
    						});
    					}else if(axis == 'yx'){
    						fireNavigationFeedback(null,iRow,null,toMove.row);
    						$(elementToScroll).animate({
    							scrollTop: topShift
    						},opts.time,opts.easing,function(){
    							fireNavigationFeedback(iColumn,null,toMove.column,null);
    							$(elementToScroll).animate({
    								scrollLeft: leftShift
    							},opts.time,opts.easing,function(){
    								initialPositionY = topShift;
    								initialPositionX = leftShift;
    								loadContent(toMove);
    							});
    						});
    					}else{
    						
    						fireNavigationFeedback(iColumn,iRow,toMove.column,toMove.row);
    						$(elementToScroll).animate({
    							scrollTop: topShift,
    							scrollLeft: leftShift
    						},opts.time,opts.easing,function(){
    							initialPositionY = topShift;
    							initialPositionX = leftShift;
    							loadContent(toMove);
    						});
    					}
    					
    					actualCol = toMove.column;
    					actualRow = toMove.row;
    					actualOffsetX = leftShift;
    					actualOffsetY = topShift;
    					
    					if(opts.createMap){
    						refreshMap($el.attr("href").replace("#",""));
    					}

    			}
    		 	
    		 	function createMap(){
    		 		$(elementToScroll).append("<div id='slidingSpacesNavigationMap'></div>");
    		 		var actualElementId = findElementByOffset(displayWidth,displayHeight).id;
    		 		    		 		
    		 		for(var r=0;r<matrix.length;r++){
						for(var c=0;c<matrix[r].length;c++){
							var href = "";
							var id = "";
							var title = "";
							var rightClass = "slidingSpacesNavigationDot";
							
							if(matrix[r][c].full != 1){
								rightClass = "slidingSpacesNavigationDotEmpty";
							}else{
								if(matrix[r][c].id == actualElementId){
									var rightClass = "slidingSpacesNavigationDotActual";
								}else{
									if(!isMobile){
										var href= "href='#"+matrix[r][c].id+"'";
									}
								}
							}
							
							if(typeof(matrix[r][c].id) != "undefined"){
								id = "id='slidingSpacesNavigationDot_"+matrix[r][c].id+"'";
							}
							if(typeof($("#"+matrix[r][c].id).attr("title")) != "undefined"){
								title = "title='"+$("#"+matrix[r][c].id).attr("title")+"'";
							}
							$("#slidingSpacesNavigationMap").append("<a "+id+" class='"+rightClass+"' "+href+" "+title+"></a>");
						}
						
						$("#slidingSpacesNavigationMap").append("<br clear='all'/>");
					}
    		 		
    				$("#slidingSpacesNavigationMap").bind("mouseover",function(event){
    						$("#slidingSpacesNavigationMap").stop();
    						$("#slidingSpacesNavigationMap").animate({
        		 				opacity:1
        		 			},200);
        		 		});
					$("#slidingSpacesNavigationMap").bind("mouseleave",function(event){
						$("#slidingSpacesNavigationMap").stop();
						$("#slidingSpacesNavigationMap").animate({
    		 				opacity:0.5
    		 			},0);
    		 		});
    		 		
    		 		positionMap();
    		 	}
    		 	
    		 	function findElementById(clicked){
    				var found = false;
    				var toReturn = {id:null,column:-1,row:-1};
    				$.each(matrixOrder,function(index){
    					if(!found){
    						if(matrixOrder[index].id == clicked){
    							toReturn = matrixOrder[index];
    							found = true;
    						}
    					}
    				});
    				return toReturn;
    			}
    			
    			function findElementByOffset(oldWidth,oldHeight){
    		 		var found = false;
    				var toReturn = {id:null,row:-1,column:-1};
    				
    				$.each(matrixOrder,function(index){
    					if(!found){
    						var topShift = matrixOrder[index].row*oldHeight;
    						var leftShift = matrixOrder[index].column*oldWidth;
    						
    						if(topShift == actualOffsetY && leftShift == actualOffsetX){
    							toReturn = matrixOrder[index];						
    							found = true;
    						}
    					}
    				});
    				
    				return toReturn;
    		 	}
    		 	
    		 	function findElementByPosition(row,column){
    		 		var found = false;
    				var toReturn = {id:null,column:-1,row:-1};
    				$.each(matrixOrder,function(index){
    					if(!found){
    						if(matrixOrder[index].column == column && matrixOrder[index].row == row){
    							toReturn = matrixOrder[index];
    							found = true;
    						}
    					}
    				});
    				
    				return toReturn
    		 	}
    			
    			function fireNavigationFeedback(sColumn,sRow,eColumn,eRow){
    				if(opts.feedbackArrows){
    					var direction = null;
    					var directionX = null;
    					var directionY = null;

    					if(sColumn > eColumn){
    						directionX = "left";
    						
    					}else if(sColumn < eColumn){
    						directionX = "right";
    					}
    					
    					if(sRow > eRow){
    						directionY = "up";
    						
    					}else if(sRow < eRow){
    						directionY = "down";
    					}
    					
    					if(directionY != null){
    						direction = directionY;
    					}
    					if(directionX != null){
    						if(direction != null){
    							direction += "_"+directionX;
    						}else{
    							direction = directionX;
    						}
    					}
    					
    					if(direction != null){
    						
    				 		var iconName = "plugins/ferroslider/img/"+direction+"_arrow.png";
    				 		
    				 		$("#slidingSpacesNavigationFeedback").stop();
    				 		$("#slidingSpacesNavigationFeedback").css({
    				 				backgroundImage: "url("+iconName+")",
    				 				backgroundRepeat: "no-repeat",
    				 				backgroundPosition: "center center",
    					 			opacity : "1",
    					 			"z-index" : 1000
    				 		});
    				 		
    				 		$("#slidingSpacesNavigationFeedback").show();
    				 		
    				 		$("#slidingSpacesNavigationFeedback").animate({ 
    				 				opacity: "0",
    				 				"z-index" : "-100"
    				 			},1000,function(){
    				 				$("#slidingSpacesNavigationFeedback").hide();
    				 			}
    				 		);
    					}
    				}
    		 	}
    			
    			function initializeWorkspace(els){
    				
    				if(opts.container == "none"){
    					if(!isMobile){
    						initialMobileHeight = document.documentElement.clientHeight;
    						initialMobileWidth = document.documentElement.clientWidth;
    					}else{
    						var real_height = window.outerHeight; // the real, "physical" height of the device
    						var real_width = window.outerWidth;
    						var pixel_ratio = window.devicePixelRatio; // the pixel ratio
    						initialMobileHeight = (real_height * pixel_ratio ); // the total height of a fullscreen page without adress
    						initialMobileWidth = (real_width * pixel_ratio ); // the total width of a fullscreen page without adress
    					}
    				}
    				
    		 		setMagicNumbers();
    		 				 		    		 		
    		 		var firstFound = false;
    		 		var fi = false;
    		 		
    		 		if(typeof(opts.displace) == "object"){
    		 			//display a mappa
    		 			//primo giro per prendere il primo elemento
    		 			matrix = opts.displace;
    		 			var orderIndex = 0;
    		 			for(var r=0 ; r<opts.displace.length ; r++){
    						for(var c=0 ; c<opts.displace[r].length ; c++){
    							if(opts.displace[r][c].full == 1 && typeof(opts.displace[r][c].first) != "undefined"){
    								var ajax = false;
    								var loadC = true;
    								var direction = opts.axis;
    								
    								if(typeof(opts.displace[r][c].ajaxLoading) != "undefined"){
    									if(opts.displace[r][c].ajaxLoading){
    										ajax = true;
    										loadC = false;
    									}
    								}else{
    									if(opts.ajaxLoading){
    										ajax = true;
    										loadC = false;
    									}
    								}
    								
    								if($.trim(opts.displace[r][c].moveDirection) != ""){
    									direction = opts.displace[r][c].moveDirection;
    								}
    								
    								if(!firstFound){
        								fi = true;
        								firstFound = true;
        							}else{
        								fi = false;
        							}
    								
    								matrixOrder.push({
    									id : els[orderIndex].id,
    									first : fi,
    									row : r,
    									column : c,
    									ajaxLoading : ajax,
    									loadedContent : loadC,
    									axis : direction
    								});
    								
    								
    								
    								matrix[r][c].id = els[orderIndex].id;
    								initialPositionX = c*(displayWidth);
    								initialPositionY = r*(displayHeight);
    								actualCol = c;
    								actualRow = r;
    								orderIndex++;
    								if(matrixRows < r){
    									matrixRows = r;
    								}
    								if(matrixColumns < c){
    									matrixColumns = c;
    								}
    							}
    						}
    					}
    		 			
    					for(var r=0 ; r<opts.displace.length ; r++){
    						for(var c=0 ; c<opts.displace[r].length ; c++){
    							if(opts.displace[r][c].full == 1 && typeof(opts.displace[r][c].first) == "undefined"){
    								if(orderIndex < els.length){
    									var ajax = false;
    									var loadC = true;
    									var direction = opts.axis;
        								
        								if(typeof(opts.displace[r][c].ajaxLoading) != "undefined"){
        									if(opts.displace[r][c].ajaxLoading){
        										ajax = true;
        										loadC = false;
        									}
        								}else{
        									if(opts.ajaxLoading){
        										ajax = true;
        										loadC = false;
        									}
        								}
        								
        								if($.trim(opts.displace[r][c].moveDirection) != ""){
        									direction = opts.displace[r][c].moveDirection;
        								}
        								
        								if(!firstFound){
        									fi = true;
        									firstFound = true;
        								}else{
        									fi = false;
        								}
    									
	    								matrixOrder.push({
	    									id : els[orderIndex].id,
	    									first : fi,
	    									row : r,
	    									column : c,
	    									ajaxLoading : ajax,
	    									loadedContent : loadC,
	    									axis : direction
	    								});
	    								if(matrixRows < r){
	    									matrixRows = r;
	    								}
	    								if(matrixColumns < c){
	    									matrixColumns = c;
	    								}
	    								matrix[r][c].id = els[orderIndex].id;
	    								orderIndex++;
    								}
    							}
    						}
    					}
    			 	}else{
						if(opts.displace == 'row'){
    			 			//display a riga
    			 			matrix[0] = new Array();
    			 			for(f=0;f<els.length;f++){
    			 				var ajax = false;
    			 				var loadC = true;
    			 				
								if(opts.ajaxLoading){
									ajax = true;
									loadC = false;
								}
								
								if(!firstFound){
									fi = true;
									firstFound = true;
								}else{
									fi = false;
								}
								
    			 				matrixOrder.push({
    								id : els[f].id,
    								first : fi,
    								row : 0,
    								column : f,
    								ajaxLoading : ajax,
									loadedContent : loadC,
									axis : opts.axis
    							});
    			 				
    			 				matrix[0].push({
    			 					id		: els[f].id,
    								full 	: 1
    							});
    			 				matrixColumns++;
    			 			}
    			 		}else if(opts.displace == 'column'){
    			 			//display a colonna
    			 			matrix = new Array();
    			 			for(var f=0;f<els.length;f++){
    			 				var ajax = false;
    			 				var loadC = true;
    			 				
								if(opts.ajaxLoading){
									ajax = true;
									loadC = false;
								}
								
								if(!firstFound){
									fi = true;
									firstFound = true;
								}else{
									fi = false;
								}
								
    			 				matrixOrder.push({
    								id : els[f].id,
    								first : fi,
    								row : f,
    								column : 0,
    								ajaxLoading : ajax,
									loadedContent : loadC,
									axis : opts.axis
    							});
    			 				matrix[matrixRows] = new Array();
    			 				matrix[matrixRows][0] = {
    			 					id		: els[f].id,
    								full : 1
    							};
    			 				matrixRows++;
    			 			}
    			 		}
    			 	}
    		 		
    		 		//swipe
  	              	if ('ontouchstart' in document.documentElement) {
  	              		if(elementToScroll == "html,body"){
  	              			document.addEventListener('touchstart', onTouchStart, false);
  	              		}else{
  	              			document.getElementById(elementToScroll.replace("#","")).addEventListener('touchstart', onTouchStart, false);
  	              		}
  	              	}
  	              	
  	              	placeElements();
    		 	}
    			
    			function isMobile(){
    				if(( navigator.userAgent.toLowerCase().indexOf("android") >-1)
    						|| ( navigator.userAgent.toLowerCase().indexOf("blackberry9500")>-1) || ( navigator.userAgent.toLowerCase().indexOf("blackberry9530")>-1) || ( navigator.userAgent.toLowerCase().indexOf("cupcake") >-1) || ( navigator.userAgent.toLowerCase().indexOf("dream") >-1) || ( navigator.userAgent.toLowerCase().indexOf("incognito") >-1) || ( navigator.userAgent.toLowerCase().indexOf("iphone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ipod")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("ipad")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("mini")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("webos") >-1) || ( navigator.userAgent.toLowerCase().indexOf("webmate")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("2.0 mmp") >-1) || ( navigator.userAgent.toLowerCase().indexOf("240×320") >-1) || ( navigator.userAgent.toLowerCase().indexOf("asus") >-1) || ( navigator.userAgent.toLowerCase().indexOf("au-mic")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("alcatel") >-1) || ( navigator.userAgent.toLowerCase().indexOf("amoi") >-1) || ( navigator.userAgent.toLowerCase().indexOf("audiovox") >-1) || ( navigator.userAgent.toLowerCase().indexOf("avantgo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("benq") >-1) || ( navigator.userAgent.toLowerCase().indexOf("bird") >-1) || ( navigator.userAgent.toLowerCase().indexOf("blackberry") >-1) || ( navigator.userAgent.toLowerCase().indexOf("blazer") >-1) || ( navigator.userAgent.toLowerCase().indexOf("cdm") >-1) || ( navigator.userAgent.toLowerCase().indexOf("cellphone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ddipocket") >-1) || ( navigator.userAgent.toLowerCase().indexOf("danger") >-1) || ( navigator.userAgent.toLowerCase().indexOf("docomo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("elaine/3.0") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ericsson") >-1) || ( navigator.userAgent.toLowerCase().indexOf("eudoraweb") >-1) || ( navigator.userAgent.toLowerCase().indexOf("fly") >-1) || ( navigator.userAgent.toLowerCase().indexOf("hp.ipaq")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("haier") >-1) || ( navigator.userAgent.toLowerCase().indexOf("huawei") >-1) || ( navigator.userAgent.toLowerCase().indexOf("iemobile") >-1) || ( navigator.userAgent.toLowerCase().indexOf("j-phone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("kddi") >-1) || ( navigator.userAgent.toLowerCase().indexOf("konka") >-1) || ( navigator.userAgent.toLowerCase().indexOf("kwc") >-1) || ( navigator.userAgent.toLowerCase().indexOf("kyocera/wx310k") >-1) || ( navigator.userAgent.toLowerCase().indexOf("lg") >-1) || ( navigator.userAgent.toLowerCase().indexOf("lg/u990") >-1) || ( navigator.userAgent.toLowerCase().indexOf("lenovo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("midp-2.0") >-1) || ( navigator.userAgent.toLowerCase().indexOf("mmef20") >-1) || ( navigator.userAgent.toLowerCase().indexOf("mot-v") >-1) || ( navigator.userAgent.toLowerCase().indexOf("mobilephone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("motorola") >-1) || ( navigator.userAgent.toLowerCase().indexOf("newgen") >-1) || ( navigator.userAgent.toLowerCase().indexOf("netfront") >-1) || ( navigator.userAgent.toLowerCase().indexOf("newt") >-1) || ( navigator.userAgent.toLowerCase().indexOf("nintendo wii") >-1) || ( navigator.userAgent.toLowerCase().indexOf("nitro") >-1) || ( navigator.userAgent.toLowerCase().indexOf("nokia") >-1) || ( navigator.userAgent.toLowerCase().indexOf("novarra") >-1) || ( navigator.userAgent.toLowerCase().indexOf("o2") >-1) || ( navigator.userAgent.toLowerCase().indexOf("opera mini") >-1) || ( navigator.userAgent.toLowerCase().indexOf("opera.mobi") >-1) || ( navigator.userAgent.toLowerCase().indexOf("pantech") >-1) || ( navigator.userAgent.toLowerCase().indexOf("pdxgw") >-1) || ( navigator.userAgent.toLowerCase().indexOf("pg") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ppc") >-1) || ( navigator.userAgent.toLowerCase().indexOf("pt") >-1) || ( navigator.userAgent.toLowerCase().indexOf("palm") >-1) || ( navigator.userAgent.toLowerCase().indexOf("panasonic") >-1) || ( navigator.userAgent.toLowerCase().indexOf("philips") >-1) || ( navigator.userAgent.toLowerCase().indexOf("playstation portable") >-1) || ( navigator.userAgent.toLowerCase().indexOf("proxinet") >-1) || ( navigator.userAgent.toLowerCase().indexOf("proxinet") >-1) || ( navigator.userAgent.toLowerCase().indexOf("qtek") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sch") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sec") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sgh") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sharp-tq-gx10") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sie") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sph") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sagem") >-1) || ( navigator.userAgent.toLowerCase().indexOf("samsung") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sanyo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sendo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sharp")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("small") >-1) || ( navigator.userAgent.toLowerCase().indexOf("smartphone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("softbank") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sonyericsson") >-1) || ( navigator.userAgent.toLowerCase().indexOf("symbian") >-1) || ( navigator.userAgent.toLowerCase().indexOf("symbian os") >-1) || ( navigator.userAgent.toLowerCase().indexOf("symbianos") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ts21i-10") >-1) || ( navigator.userAgent.toLowerCase().indexOf("toshiba") >-1) || ( navigator.userAgent.toLowerCase().indexOf("treo")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("up.browser") >-1) || ( navigator.userAgent.toLowerCase().indexOf("up.link") >-1) || ( navigator.userAgent.toLowerCase().indexOf("uts") >-1) || ( navigator.userAgent.toLowerCase().indexOf("vertu") >-1) || ( navigator.userAgent.toLowerCase().indexOf("willcome") >-1) || ( navigator.userAgent.toLowerCase().indexOf("winwap") >-1) || ( navigator.userAgent.toLowerCase().indexOf("windows ce") >-1) || ( navigator.userAgent.toLowerCase().indexOf("windows.ce") >-1) || ( navigator.userAgent.toLowerCase().indexOf("xda") >-1) || ( navigator.userAgent.toLowerCase().indexOf("zte") >-1) || ( navigator.userAgent.toLowerCase().indexOf("dopod") >-1) || ( navigator.userAgent.toLowerCase().indexOf("hiptop")	>-1) || ( navigator.userAgent.toLowerCase().indexOf("htc") >-1) || ( navigator.userAgent.toLowerCase().indexOf("i-mobile") >-1) || ( navigator.userAgent.toLowerCase().indexOf("nokia") >-1) || ( navigator.userAgent.toLowerCase().indexOf("portalmmm") >-1)){
    					
    					if(navigator.platform.toLowerCase().indexOf("win32") == -1 && navigator.platform.toLowerCase().indexOf("win64") == -1){
    						return true;
    					}else{
    						return false;
    					}
    				}else{
    					return false;
    				}
    			}
    			
    			function loadContent(element){
    				if(element.ajaxLoading && !element.loadedContent){
    					$("#slidingSpacesNavigationFeedback").stop();
				 		$("#slidingSpacesNavigationFeedback").css({
				 				backgroundColor: "#000000",
				 				backgroundImage: "url(plugins/ferroslider/img/throbber.gif)",
				 				backgroundRepeat: "no-repeat",
				 				backgroundPosition: "center center",
					 			opacity : "0.7",
					 			"z-index" : 1000
				 		});
				 		
				 		$("#slidingSpacesNavigationFeedback").show();
    					$.ajax({
    						url: opts.ajaxScript,
    						data: "id="+element.id,
    						success: function(data){
    							element.loadedContent = true;
    							$("#"+element.id).html("");
    						    $("#"+element.id).append(data);
    						    $("#slidingSpacesNavigationFeedback").css({ 
    				 				opacity: "0",
    				 				backgroundColor: 'transparent',
    				 				"z-index" : "-100"
    				 			});
    						},
    						error: function(err) {
    							alert(err);
    						}
    					});
    				}
    			}
    		 	
    		 	function onTouchMove(e) {
    		 		e.preventDefault();
					e.stopPropagation();
	              
	              	if (isMoving) {
	              		var x = e.touches[0].pageX,
	              		dx = scrollStartX - x,
	              		y = e.touches[0].pageY,
	              		up = scrollStartY - y;
	              
	              		var direction = null;
	              		var swipeOk = false;
	              		var distance = null;
	              
	              		if(Math.abs(dx) > Math.abs(up) && (Math.abs(dx) >= min_move_x)){
	              			if(dx>=0){
	              				direction = "right";
	              			}else{
	              				direction = "left";
	              			}
	              			swipeOk = true;
	              		}else if(Math.abs(dx) <= Math.abs(up) && (Math.abs(up) >= min_move_y)){
	              			if(up>=0){
	              				direction = "down";
	              			}else{
	              				direction = "up";
	              			}
	              			swipeOk = true;
	              		}
	              		
	              		if(swipeOk) {
	              			cancelTouch();
	              			$(elementToScroll).stop();

	        		 		var p = findElementByOffset(displayWidth,displayHeight);
	        		 		var toFindColumn = p.column;
	        		 		var toFindRow = p.row;
	        		 		if(direction == "right"){
	        		 			toFindColumn++;
	        		 		}else if(direction == "left"){
	        		 			toFindColumn--;
	        		 		}else if(direction == "up"){
	        		 			toFindRow--;
	        		 		}else if(direction == "down"){
	        		 			toFindRow++;
	        		 		}
	        		 		
	        		 		var toMove = findElementByPosition(toFindRow,toFindColumn);
	        		 		
	        		 		var leftShift = toMove.column*(displayWidth);
	    					var topShift = toMove.row*(displayHeight);
	    					
	    					if(toMove.id != null){
	    						loadContent(toMove);
	    						
	    						if(direction == "left" || direction == "right"){
	    							$(elementToScroll).animate({
		    							scrollLeft: leftShift
		    						},opts.time,opts.easing,function(){
		    							if(( navigator.userAgent.toLowerCase().indexOf("iphone") >-1) || 
	        								( navigator.userAgent.toLowerCase().indexOf("ipod")	>-1) || 
	        								( navigator.userAgent.toLowerCase().indexOf("ipad")	>-1)){
		    								window.scrollTo(leftShift,topShift);
		    							}
		    							e.preventDefault();
		    							e.stopPropagation();
		    							return false;
		    						});
	    						}else{
	    							$(elementToScroll).animate({
		    							scrollTop: topShift
		    						},opts.time,opts.easing,function(){
		    							if(( navigator.userAgent.toLowerCase().indexOf("iphone") >-1) || 
	        								( navigator.userAgent.toLowerCase().indexOf("ipod")	>-1)|| 
	        								( navigator.userAgent.toLowerCase().indexOf("ipad")	>-1)){
		    								window.scrollTo(leftShift,topShift);
		    							}
		    							e.preventDefault();
		    							e.stopPropagation();
		    							return false;
		    						});
	    						}
	    						refreshMap(toMove.id);
	    						
	    						actualCol = toMove.column;
	    						actualRow = toMove.row;
	    						actualOffsetX = leftShift;
	    						actualOffsetY = topShift;
	    					}
	              		}
	              	}
	            }
	            
	            function onTouchStart(e) {
	            	//e.preventDefault();
	            	e.stopPropagation();
	            	if (e.touches.length == 1) {
	            		scrollStartX = e.touches[0].pageX;
	            		scrollStartY = e.touches[0].pageY;
	            		isMoving = true;
	            		
	            		document.addEventListener('touchmove', onTouchMove, false);
	            	}
	            }
    			
    			function placeElements(){
    				if(elementToScroll == "html,body"){
    					var elementToPlace = "body";
    				}else{
    					var elementToPlace = elementToScroll;
    				}
    				
    				for(var m=0;m<matrixOrder.length;m++){
    					elId = matrixOrder[m].id;
    					var outerDivId = "slidingSpacesOuterDiv_"+elId;
    					$(elementToPlace).append("<div id='"+outerDivId+"' class='slidingSpacesOuterDiv' data-role='content'></div>");
    					
    					$("#"+outerDivId).css("position","absolute");
    					$("#"+outerDivId).css("overflow","hidden");
    					$("#"+outerDivId).width(displayWidth);
    					$("#"+outerDivId).height(displayHeight);
    					$("#"+elId).appendTo("#"+outerDivId);
    					
    					$("#"+outerDivId).offset({
    						top:(matrixOrder[m].row)*displayHeight+offsetY,
    						left:(matrixOrder[m].column)*displayWidth+offsetX
    					});
    					
    					if(opts.fullScreenBackground){
    						if(opts.preloadBackgroundImages){
    							preloadBackgroundImages();
    						}
    						setFullScreenBackground(matrixOrder[m]);
    					}
    					    					
    					//eventually load content via ajax if first element
    					if(m == 0 && matrixOrder[m].ajaxLoading){
    						loadContent(matrixOrder[m]);
    					}
    				}
    			}
    			
    			function preloadBackgroundImages(){
    				var cache = [];
    				$(" ."+opts.backGroundImageClass).each(function(){
    					var $img = $(this);
    					var cacheImage = document.createElement('img');
  				      	cacheImage.src = $img.attr("src");
  				      	cache.push(cacheImage);	
    				});
    			}
    			
    			function positionMap(){
    		 		//position the map
					var mapWidth = $("#slidingSpacesNavigationMap").outerWidth(true);
					var mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
					var mapInnerX = mapWidth-$("#slidingSpacesNavigationMap").width();
					var mapInnerY = mapHeight-$("#slidingSpacesNavigationMap").height();
					var elementToScrollTop = 0;
					var elementToScrollLeft = 0;
					
					if(opts.container != "none"){
						var elementToScrollTop = $(elementToScroll).offset().top;
						var elementToScrollLeft = $(elementToScroll).offset().left;
					}
												
					if(opts.mapPosition.toLowerCase() == "top_left"){
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop,
							left	: elementToScrollLeft
						});
					}else if(opts.mapPosition.toLowerCase() == "top_center"){
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop,
							left	: elementToScrollLeft + ((displayWidth/2) - (mapWidth/2))
						});

					}else if(opts.mapPosition.toLowerCase() == "top_right"){
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop,
							left	: elementToScrollLeft + (displayWidth - mapWidth)
						});
					}else if(opts.mapPosition.toLowerCase() == "center_right"){
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop + ((displayHeight/2) - (mapHeight/2)),
							left	: elementToScrollLeft + (displayWidth - mapWidth)
						});
					}else if(opts.mapPosition.toLowerCase() == "bottom_center"){
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop + displayHeight - mapHeight,
							left	: elementToScrollLeft + ((displayWidth/2) - (mapWidth/2))
						});
					}else if(opts.mapPosition.toLowerCase() == "bottom_left"){
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop + displayHeight - mapHeight,
							left	: elementToScrollLeft
						});
					}else if(opts.mapPosition.toLowerCase() == "center_left"){
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop + ((displayHeight/2) - (mapHeight/2)),
							left	: elementToScrollLeft
						});
					}else if(opts.mapPosition.toLowerCase() == "center_center"){
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop + ((displayHeight/2) - (mapHeight/2)),
							left	: elementToScrollLeft + ((displayWidth/2) - (mapWidth/2))
						});
					}else{
						$("#slidingSpacesNavigationMap").css({
							top		: elementToScrollTop + displayHeight - mapHeight,
							left	: elementToScrollLeft + displayWidth-mapWidth
						});
					}
					$("#slidingSpacesNavigationMap").width(mapWidth-mapInnerX);
					$("#slidingSpacesNavigationMap").height(mapHeight-mapInnerY);
    		 	}
    			
    			function refreshMap(actualElementId){
    		 		$("#slidingSpacesNavigationMap a").each(function(index) {
    		 			$dot = $(this); 
    		 			var id = ""; 
    		 			if(typeof($dot.attr("id")) != "undefined"){
    		 				id = $dot.attr("id").split("_");
    		 			}
		 				if(id.length == 2){
	    		 			if(id[1] == actualElementId){
			 					$dot.attr("class","slidingSpacesNavigationDotActual");
			 					$dot.attr("href","");
			 				}else{
			 					$dot.attr("class","slidingSpacesNavigationDot");
			 					$dot.attr("href","#"+id[1]);
			 				}
		 				}
    		 		});
    		 		
    		 		$(".slidingSpacesNavigationDot").each(function(index){
    		 			var $el2 = $(this);	
    		 			$el2.unbind("click");
    		 			$el2.unbind("touchstart");
    		 			$el2.bind("touchstart",function(event){
        		 			clickEvent(event,$el);
           				});
    		 			if(!isMobile){
	    		 			$el2.bind("click",function(event){
	    		 				clickEvent(event,$el2);
	    		 			});
    		 			}else{
    		 				$el2.removeAttr("href");
    		 			}
    		 		});
    		 		
    		 		$(".slidingSpacesNavigationDotActual").each(function(index){
    		 			var $el2 = $(this);	
    		 			$el2.unbind("click");
    		 			$el2.unbind("touchstart");
    		 			$el2.removeAttr("href");
    		 		});
    		 		
    		 	}
    			
    			function refreshPosition(oldWidth,oldHeight){
    				zIndex = -1000;
    				var actualElement = findElementByOffset(oldWidth,oldHeight);
    				
    				for(i=0;i<matrixOrder.length;i++){
    					var shiftX = matrixOrder[i].column*(displayWidth);
    					var shiftY = matrixOrder[i].row*(displayHeight);
    					var actualId = matrixOrder[i].id;
    					var outerDivId = "slidingSpacesOuterDiv_"+actualId;
    					
    					$("#"+outerDivId).width(displayWidth);
    					$("#"+outerDivId).height(displayHeight);
    					
    					if(shiftY > 0){
    						var topS = shiftY+((displayHeight-oldHeight))*(matrixOrder[i].row);
    						if(elementToScroll != "html,body"){
    							topS += $(elementToScroll).offset().top;
    						}
    						$("#"+outerDivId).offset({
    							top:topS
    						});
    					}
    					
    					if(shiftX > 0){
    						var leftS = shiftX+((displayWidth-oldWidth))*(matrixOrder[i].column);
    						if(elementToScroll != "html,body"){
    							leftS += $(elementToScroll).offset().left;
    						}
    						$("#"+outerDivId).offset({
    							left:leftS
    						});
    					}
    					if(opts.fullScreenBackground){
    						scaleBackground($("#"+matrixOrder[i].id+" ."+opts.backGroundImageClass));
    					}
    		 		}
    				
    				$("#slidingSpacesNavigationFeedback").width(displayWidth);
    				$("#slidingSpacesNavigationFeedback").height(displayHeight);
    				
    				if(actualElement.id != null){
    					var reActualElement = findElementById(actualElement.id);
    					
    					$(elementToScroll).animate({
    						scrollTop: reActualElement.row*displayHeight,
    						scrollLeft: reActualElement.column*displayWidth
    					},0);
    					actualOffsetX = reActualElement.column*displayWidth;
    					actualOffsetY = reActualElement.row*displayHeight;
    				}
    			}
    			
    			function refreshPositionMobile(oldWidth,oldHeight){
    				zIndex = -1000;
    				var actualElement = findElementByPosition(actualRow,actualCol);
    				
    				for(i=0;i<matrixOrder.length;i++){
    					var shiftX = matrixOrder[i].column*(displayWidth);
    					var shiftY = matrixOrder[i].row*(displayHeight);
    					var actualId = matrixOrder[i].id;
    					var outerDivId = "slidingSpacesOuterDiv_"+actualId;
    					
    					$("#"+outerDivId).width(displayWidth);
    					$("#"+outerDivId).height(displayHeight);
    					
    					if(shiftY > 0){
    						var topS = shiftY;
    						if(elementToScroll != "html,body"){
    							topS += $(elementToScroll).offset().top;
    						}
    						$("#"+outerDivId).offset({
    							top:topS
    						});
    					}
    					
    					if(shiftX > 0){
    						var leftS = shiftX;
    						if(elementToScroll != "html,body"){
    							leftS += $(elementToScroll).offset().left;
    						}
    						$("#"+outerDivId).offset({
    							left:leftS
    						});
    					}
    					if(opts.fullScreenBackground){
    						scaleBackground($("#"+matrixOrder[i].id+" ."+opts.backGroundImageClass));
    					}
    		 		}
    				
    				$("#slidingSpacesNavigationFeedback").width(displayWidth);
    				$("#slidingSpacesNavigationFeedback").height(displayHeight);
    				
    				if(actualElement.id != null){
    					var reActualElement = findElementById(actualElement.id);
    					
    					window.scrollTo(reActualElement.column*displayWidth,reActualElement.row*displayHeight);
    					
    					actualOffsetX = reActualElement.column*displayWidth;
    					actualOffsetY = reActualElement.row*displayHeight;
    				}
    			}
    			
    			function revalidate(){
    		 		var oldWidth = displayWidth;
    		 		var oldHeight = displayHeight;
    		 		setMagicNumbers();
    		 		refreshPosition(oldWidth,oldHeight);
    		 		if(opts.createMap){
    		 			positionMap();
    		 		}
    		 	}
    			
    			
    		     			
    			function scaleBackground(element){
    				w = element.width();
    				h = element.height();
    				var ratio = h / w;    				
    				
    				if ((displayHeight/displayWidth) > ratio){
    					element.height(displayHeight);
    					element.width(displayHeight / ratio);
    				} else {
    					element.width(displayWidth);
    					element.height(displayWidth * ratio);
    				}
    			
    				// Center the image
    				zIndex += zIndexDecrement;
    				zIndexDecrement--;
    				element.css('position','absolute');
    				element.css('float','left');
    				element.css('z-index',zIndex);
    				element.css('left', (displayWidth - element.width())/2);
    				element.css('top', (displayHeight - element.height())/2);
    			}
    			
    			function setFullScreenBackground(element){
    				var backgroundImage = $("#"+element.id+" ."+opts.backGroundImageClass);
    				var w = 0;
    				var h = 0;
    				
    				$(backgroundImage).load(function(){
    						scaleBackground($(this));
    					}).error(function (){
    					   $(this).remove();
    				});
    			}	
    			
    			function setMagicNumbers(){
    				if(opts.container == "none"){
    					if(isMobile){
    						if(( navigator.userAgent.toLowerCase().indexOf("iphone") >-1) || 
    								( navigator.userAgent.toLowerCase().indexOf("ipod")	>-1)){
    								if(window.orientation == 0 || window.orientation == 180){
    									var real_width = (screen.width*window.devicePixelRatio);
        								var real_height =  (screen.height-64)*window.devicePixelRatio;
    								}else{
    									//542
    									var real_height = ((screen.width-49)*window.devicePixelRatio);
        								var real_width =  (screen.height*window.devicePixelRatio);
    								}
    								
    						}else{
    							if(window.orientation == 0 || window.orientation == 180){
    								if(window.devicePixelRatio >1){
    									var real_height = window.innerHeight; // the real, "physical" height of the device
        								var real_width = window.innerWidth;
    								}else{
    									
    									var real_height = window.innerHeight; // the real, "physical" height of the device
        								var real_width = window.innerWidth;
    								}
    								
    							}else{
    								if(window.devicePixelRatio >1){
    									var real_height = window.innerHeight; // the real, "physical" height of the device
    									var real_width = (window.innerWidth+24);
    								}else{
    									var real_height = window.innerHeight; // the real, "physical" height of the device
    									var real_width = (window.innerWidth+24);
    								}
    							}
    						}
    						
    						displayHeight = Math.round((real_height)); // the total height of a fullscreen page without adress
    						displayWidth = Math.round((real_width)); // the total width of a fullscreen page without adress 
    					}else{
    						displayWidth = $(window).width();
    						displayHeight = $(window).height();
    					}
    					
    					offsetX = 0;
    					offsetY = 0;
    					elementToScroll = "html,body";
    				}else{
    					if(isMobile){
    						var real_height = $(opts.container).outerHeight(true); // the real, "physical" height of the device
    						var real_width = $(opts.container).outerWidth(true);
    						var pixel_ratio = window.devicePixelRatio; // the pixel ratio
    						
    						displayHeight = Math.round((real_height)); // the total height of a fullscreen page without adress
    						displayWidth = Math.round((real_width)); // the total width of a fullscreen page without adress
    						offsetX = $(opts.container).offset().left;
        					offsetY = $(opts.container).offset().top;
        					elementToScroll = opts.container;
    					}else{
    						displayWidth = $(opts.container).outerWidth(true);
        					displayHeight = $(opts.container).outerHeight(true);
        					offsetX = $(opts.container).offset().left;
        					offsetY = $(opts.container).offset().top;
        					elementToScroll = opts.container;
    					}
    				}
    			}
    			
    			function shiftAllButFirst(xShift,yShift){
    				for(i=1;i<matrixOrder.length;i++){
    					var outerDivId = "slidingSpacesOuterDiv_"+matrixOrder[i].id;
    					if(yShift != null){
    						$("#"+outerDivId).offset({
    							top:yShift+(displayHeight)*(matrixOrder[i].row)
    						});
    					}
    					if(opts.fullScreenBackground){
    						scaleBackground($("#"+matrixOrder[i].id+" ."+opts.backGroundImageClass));
    					}
    		 		}
    			}
            }
    };
	
    $.fn.ferroSlider = function(arguments) {
    	methods.ferroSliderDesktop.call(this, arguments);
		return methods;
    };
	
})( jQuery );