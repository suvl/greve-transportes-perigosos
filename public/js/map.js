!function(e){var o={};function i(t){if(o[t])return o[t].exports;var a=o[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=e,i.c=o,i.d=function(e,o,t){i.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:t})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,o){if(1&o&&(e=i(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var a in e)i.d(t,a,function(o){return e[o]}.bind(null,a));return t},i.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(o,"a",o),o},i.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},i.p="/",i(i.s=1)}({1:function(e,o,i){e.exports=i("mUkR")},mUkR:function(e,o){var i=[],t=[],a=['Thanks to <a href="https://waze.com/pt" >Waze</a> for providing important data and permission to use their services','This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply'],n={obj:null},r=["gasoline","diesel","lpg","none"],s=["normal","sos","none"];mapboxgl.accessToken="pk.eyJ1IjoiY290ZW1lcm8iLCJhIjoiY2p5NzQyeTdvMDc1MzNlbGNnbzh3NjVuOCJ9.cPrQc61yiHA0kOptuuZsSA";var l=new mapboxgl.Map({container:"map",style:"mapbox://styles/mapbox/streets-v11",center:[-7.8536599,39.557191],zoom:6,attributionControl:!1});function p(){return new Promise(function(e,o){i=[],$.getJSON("/storage/data/cache.json",function(o){o.forEach(function(e){var o=e.sell_gasoline&&e.has_gasoline,t=e.sell_diesel&&e.has_diesel,a=e.sell_lpg&&e.has_lpg,n=!o&&!t&&!a,r="",s="",l=e.brand;if("SOS"==e.repa)e.repa="sos",r="REPA",2,s="#2f86ca",l+=" (REPA - Veículos Prioritários)";else if("Normal"==e.repa)e.repa="normal",r="REPA",1,s="#2f86ca",l+=" (REPA - Todos os Veículos)";else{var p=0;!o&&e.sell_gasoline||p++,!t&&e.sell_diesel||p++,!a&&e.sell_lpg||p++,3==p?(r="ALL",s="#65ac3d"):0==p?(r="NONE",s="#b32e25"):(r="PARTIAL",s="#f3a433")}i.push({type:"Feature",geometry:{type:"Point",coordinates:[e.long,e.lat]},properties:{id:e.id,name:e.name,brand:l,repa:e.repa,with_gasoline:o,with_diesel:t,with_lpg:a,with_none:n,sell_gasoline:e.sell_gasoline,sell_diesel:e.sell_diesel,sell_lpg:e.sell_lpg,has_gasoline:e.has_gasoline,has_diesel:e.has_diesel,has_lpg:e.has_lpg,icon:r,popup_color:s,priority:0}})}),e()})})}function c(e,o){return new Promise(function(i,t){l.loadImage(o,function(o,a){o?(console.log("ERROR:"+o),t(o)):(console.log("IMAGE LOADED"),l.addImage(e,a),i())})})}function u(){var e=new Date,o=e.getSeconds(),i=e.getMinutes(),t=e.getHours(),n=[].concat(a);return n.push("Última Atualização às: "+("0"+t).slice(-2)+"h"+("0"+i).slice(-2)+"m"+("0"+o).slice(-2)+"s"),n}function d(){t.push(p()),Promise.all(t).then(function(){t=[],s.forEach(function(e){r.forEach(function(o){var i="poi-"+e+"-"+o;l.removeLayer(i)})}),l.removeSource("points"),l.addSource("points",{type:"geojson",data:{type:"FeatureCollection",features:i}}),s.forEach(function(e){var o=e;"none"==o&&(o=""),r.forEach(function(i){var t="poi-"+e+"-"+i;l.addLayer({id:t,type:"symbol",source:"points",layout:{"icon-image":"{icon}","symbol-sort-key":["get","priority"]}}),l.setFilter(t,["all",[">","with_"+i,0],["==","repa",o]])})}),l.removeControl(n.obj),delete n.obj,n.obj=new mapboxgl.AttributionControl({compact:!0,customAttribution:u()}),l.addControl(n.obj),f()})}function f(){var e=$("input.type[type=radio]:checked").val(),o=$("input.repa[type=radio]:checked").val();s.forEach(function(i){r.forEach(function(t){var a="poi-"+i+"-"+t,n=(i==o||"all"==o)&&(t==e||"all"==e);l.setLayoutProperty(a,"visibility",n?"visible":"none")})})}String.prototype.capitalize=function(){return this.replace(/(?:^|\s)\S/g,function(e){return e.toUpperCase()})},l.on("load",function(){t.push(c("REPA","/img/map/VOSTPT_JNDPA_REPA_ICON_25x25.png")),t.push(c("NONE","/img/map/VOSTPT_JNDPA_NONE_ICON_25x25.png")),t.push(c("PARTIAL","/img/map/VOSTPT_JNDPA_PARTIAL_ICON_25x25.png")),t.push(c("ALL","/img/map/VOSTPT_JNDPA_ALL_ICON_25x25.png")),t.push(p()),Promise.all(t).then(function(){t=[],l.addSource("points",{type:"geojson",data:{type:"FeatureCollection",features:i}}),s.forEach(function(e){var o=e;"none"==o&&(o=""),r.forEach(function(i){var t="poi-"+e+"-"+i;l.addLayer({id:t,type:"symbol",source:"points",layout:{"icon-image":"{icon}","symbol-sort-key":["get","priority"]}}),l.setFilter(t,["all",[">","with_"+i,0],["==","repa",o]]),function(e){l.on("click",e,function(e){var o=e.features[0].geometry.coordinates.slice(),i=e.features[0].properties.sell_gasoline&&e.features[0].properties.has_gasoline?'<img src="img/map/VOSTPT_GASPUMP_GASOLINA_500pxX500px.png"/>':'<img class="no-gas"src="img/map/VOSTPT_GASPUMP_GASOLINA_500pxX500px.png"/>',t=e.features[0].properties.sell_diesel&&e.features[0].properties.has_diesel?'<img src="img/map/VOSTPT_GASPUMP_GASOLEO_500pxX500px.png"/>':'<img class="no-gas" src="img/map/VOSTPT_GASPUMP_GASOLEO_500pxX500px.png"/>',a=e.features[0].properties.sell_lpg&&e.features[0].properties.has_lpg?'<img width="75px" src="img/map/VOSTPT_GASPUMP_GPL_500pxX500px.png"/>':'<img class="no-gas" src="img/map/VOSTPT_GASPUMP_GPL_500pxX500px.png"/>',n=e.features[0].properties.name?e.features[0].properties.name.toUpperCase():"",r="";for(r=isHelping()?'<div class="v-popup-content"><div class="v-popup-header" style="background-color:#6bd7fc"><h5>'+e.features[0].properties.brand.toUpperCase()+"<br><small>"+n+'</small></h5></div><div class="v-popup-body" style="background-color:#ffffff"><div class="row"><div class="col-md-4 v-fuel-info gasoline"><a href="#" onclick="swapIcon(this)">'+i+'</a><h6>GASOLINA</h6></div><div class="col-md-4 v-fuel-info diesel"><a href="#" onclick="swapIcon(this)">'+t+'</a><h6>GASOLEO</h6></div><div class="col-md-4 v-fuel-info lpg"><a href="#" onclick="swapIcon(this)">'+a+'</a><h6>GPL</h6></div></div><div class="row"><div class="col-md-12">Por favor indica que combústiveis não estão disponiveis na '+n+'.</div></div><div class="row"><div class="col-md-12">Carrega nas imagens deixando as disponiveis mais nitidas.</div></div></div><div class="v-popup-header" style="background-color:#6bd7fc"><a href="#" onclick="submitEntry(this,'+e.features[0].properties.id+')"><h5>VALIDAR</h5></a></div></div>':'<div class="v-popup-content"><div class="v-popup-header" style="background-color:'+e.features[0].properties.popup_color+'"><h5>'+e.features[0].properties.brand.toUpperCase()+"<br><small>"+n+'</small></h5></div><div class="v-popup-body"><div class="row"><div class="col-md-4 v-fuel-info">'+i+'<h6>GASOLINA</h6></div><div class="col-md-4 v-fuel-info">'+t+'<h6>GASOLEO</h6></div><div class="col-md-4 v-fuel-info">'+a+'<h6>GPL</h6></div></div></div><div class="v-popup-header" style="background-color:'+e.features[0].properties.popup_color+'"><h5>OBTER DIREÇÕES</h5></div><div class="v-popup-body directions"><a href="https://www.waze.com/ul?ll='+o[1]+"%2C"+o[0]+'&navigate=yes&zoom=16&download_prompt=false"  target="_blank" rel="noopener noreferrer"><img src="/img/map/map_blur.png"></a></div></div>';Math.abs(e.lngLat.lng-o[0])>180;)o[0]+=e.lngLat.lng>o[0]?360:-360;popup=(new mapboxgl.Popup).setLngLat(o).setHTML(r).addTo(l)}),l.on("mouseenter",e,function(){l.getCanvas().style.cursor="pointer"}),l.on("mouseleave",e,function(){l.getCanvas().style.cursor=""})}(t)})}),"geolocation"in navigator&&navigator.geolocation.getCurrentPosition(function(e){l.flyTo({center:[e.coords.longitude,e.coords.latitude],zoom:14})}),n.obj=new mapboxgl.AttributionControl({compact:!0,customAttribution:u()}),l.addControl(n.obj),f(),setInterval(d,3e4)})}),l.on("error",function(e){console.log("MAP LOAD ERROR"),console.log(e)}),$("input.type[type=radio]").change(function(){f()}),$("input.repa[type=radio]").change(function(){f()})}});