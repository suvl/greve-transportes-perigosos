let points = [];
let promises = [];
const customAttributions = [
    'Thanks to <a href="https://www.facebook.com/WazePortugal/">Waze Portugal</a> for providing important data and permission to use their services',
    'This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply',
];
let attributionControl = {
    "obj": null
};
let nagivationControl = {
    "obj": null
};
const fuel_layers = ['gasoline', 'diesel', 'lpg', 'none', 'without_gasoline', 'without_diesel', 'without_lpg'];
const repa_layers = ['normal', 'sos', 'none'];

mapboxgl.accessToken = 'pk.eyJ1Ijoidm9zdHB0IiwiYSI6ImNqeXR3aHQxdTAyYjgzY21wbDMwaHJoaDQifQ.ql-IskzjOdAtEFvbltquaw';
var map = new mapboxgl.Map({
    container: 'map', // container id,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-7.8536599, 39.557191],
    zoom: 6,
    attributionControl: false
});

String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};

function loadPoints() {
    return new Promise(function (resolve, reject) {
        points = [];
        $.getJSON("/storage/data/cache.json", (data) => {
            data.forEach(fuelStation => {
                let with_gasoline = 0;
                let with_diesel = 0;
                let with_lpg = 0;
                let with_none = 0;
                let without_gasoline = 0;
                let without_diesel = 0;
                let without_lpg = 0;
                let icon = '';
                let popup_color = '';
                let background_color = '';
                let priority = 0;
                let brand = fuelStation.brand;
                let tooltip = '';
                let count = 0;
                let max_count = 0;
                if (fuelStation.sell_gasoline) {
                    max_count++;
                    if(fuelStation.has_gasoline){
                        with_gasoline = 1;
                        count++;
                    }
                    else {
                        without_gasoline = 1;
                    }
                }
                if (fuelStation.sell_diesel) {
                    max_count++;
                    if(fuelStation.has_diesel){
                        with_diesel = 1;
                        count++;
                    }
                    else {
                        without_diesel = 1;
                    }
                }
                if (fuelStation.sell_lpg) {
                    max_count++;
                    if(fuelStation.has_lpg){
                        with_lpg = 1;
                        count++;
                    }
                    else {
                        without_lpg = 1;
                    }
                }
                if (fuelStation.repa == "SOS") {
                    fuelStation.repa = "sos";
                    icon = 'REPA';
                    priority = 2;
                    popup_color = '0070bb';
                    background_color = "e6e6e6";
                    brand = brand + " (REPA - Veículos Prioritários)";
                    priority = 2;
                    tooltip = '<strong>Posto REPA - Prioritários</strong>';
                } else if (fuelStation.repa == "Normal") {
                    fuelStation.repa = "normal";
                    icon = 'REPA';
                    priority = 1;
                    popup_color = '0070bb';
                    background_color = "e6e6e6";
                    brand = brand + " (REPA - Todos os Veículos)";
                    priority = 1;
                    tooltip = '<strong>Posto REPA - Geral</strong>';
                } else {
                    tooltip = '<strong>Posto Não REPA</strong>';
                    if (count == max_count) {
                        icon = 'ALL';
                        popup_color = '006837';
                        background_color = "e6e6e6";
                    } else if (count == 0) {
                        icon = 'NONE';
                        popup_color = 'c1272c';
                        background_color = "e6e6e6";
                    } else {
                        icon = 'PARTIAL';
                        popup_color = 'f7921e';
                        background_color = "e6e6e6";
                    }
                }
                if (count == max_count) {
                    tooltip += '<p>Disponível</p>'
                } else if (count == 0) {
                    tooltip += '<p>Não Disponível</p>';
                    with_none = 1;
                } else {
                    tooltip += '<p>Parcialmente Disponível</p>';
                }
                points.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [fuelStation.long, fuelStation.lat]
                    },
                    "properties": {
                        "id": fuelStation.id,
                        "name": fuelStation.name,
                        "brand": brand,
                        "repa": fuelStation.repa,
                        "with_gasoline": with_gasoline,
                        "with_diesel": with_diesel,
                        "with_lpg": with_lpg,
                        "without_gasoline": without_gasoline,
                        "without_diesel": without_diesel,
                        "without_lpg": without_lpg,
                        "with_none": with_none,
                        "sell_gasoline": fuelStation.sell_gasoline,
                        "sell_diesel": fuelStation.sell_diesel,
                        "sell_lpg": fuelStation.sell_lpg,
                        "has_gasoline": fuelStation.has_gasoline,
                        "has_diesel": fuelStation.has_diesel,
                        "has_lpg": fuelStation.has_lpg,
                        "icon": icon,
                        "popup_color": popup_color,
                        "background_color": background_color,
                        "priority": priority,
                        "tooltip": tooltip
                    }
                });
            });
            resolve();
        });
    });

}

function loadBrandImage(brand, url) {
    return new Promise(function (resolve, reject) {
        map.loadImage(url, function (error, image) {
            if (error) {
                console.log("ERROR:" + error);
                reject(error);
            } else {
                console.log("IMAGE LOADED");
                map.addImage(brand, image);
                resolve();
            }
        });
    });
}

function getAttributions() {
    var date = new Date;
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    let attributions = [...customAttributions];
    attributions.push('Última Atualização às: ' + ("0" + hour).slice(-2) + 'h' + ("0" + minutes).slice(-2) + 'm' + ("0" + seconds).slice(-2) + 's');
    return attributions;
}

function updatePoints(initial = false) {
    promises.push(loadPoints());
    Promise.all(promises).then(function () {
        promises = [];
        if(!initial) {
            repa_layers.forEach(repa_element => {
                let repa_value = repa_element;
                if (repa_value == "none") {
                    repa_value = '';
                }
                fuel_layers.forEach(fuel_element => {
                    let layerID = 'poi-' + repa_element + '-' + fuel_element;
                    map.removeLayer(layerID);
                });
            });
            map.removeSource("points");
        }
        map.addSource("points", {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": points
            }
        });
        repa_layers.forEach(repa_element => {
            let repa_value = repa_element;
            if (repa_value == "none") {
                repa_value = '';
            }
            fuel_layers.forEach(fuel_element => {
                let layerID = 'poi-' + repa_element + '-' + fuel_element;
                map.addLayer({
                    "id": layerID,
                    "type": "symbol",
                    "source": "points",
                    "layout": {
                        "icon-image": "{icon}",
                        "symbol-sort-key": ["get", "priority"],
                    }
                });
                if(fuel_element.indexOf("without") == -1) {
                    map.setFilter(layerID, [
                        "all",
                        ["==", "with_" + fuel_element, 1],
                        ['==', 'repa', repa_value]
                    ]);
                }
                else {
                    map.setFilter(layerID, [
                        "all",
                        ["==", fuel_element, 1],
                        ['==', 'repa', repa_value]
                    ]);
                }
                if(initial) {
                    addLayersFunctionality(layerID);
                }
            });
        });
        map.removeControl(nagivationControl.obj);
        map.removeControl(attributionControl.obj);
        delete attributionControl.obj;
        attributionControl.obj = new mapboxgl.AttributionControl({
            compact: true,
            customAttribution: getAttributions()
        });
        map.addControl(attributionControl.obj);
        map.addControl(nagivationControl.obj, "bottom-right");
        updateLayersOptions();
    });
}

function addLayersFunctionality(layerID) {
    map.on('click', layerID, function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        let gasolineIcon = e.features[0].properties.sell_gasoline && e.features[0].properties.has_gasoline ?
            '<img src="/img/map/VOSTPT_FUELCRISIS_GASOLINA_500pxX500px.png"/>' :
            '<img class="no-gas"src="/img/map/VOSTPT_FUELCRISIS_GASOLINA_500pxX500px.png"/>';
        let dieselIcon = e.features[0].properties.sell_diesel && e.features[0].properties.has_diesel ?
            '<img src="/img/map/VOSTPT_FUELCRISIS_GASOLEO_500pxX500px.png"/>' :
            '<img class="no-gas" src="/img/map/VOSTPT_FUELCRISIS_GASOLEO_500pxX500px.png"/>';
        let lpgIcon = e.features[0].properties.sell_lpg && e.features[0].properties.has_lpg ?
            '<img width="75px" src="/img/map/VOSTPT_FUELCRISIS_GPL_500pxX500px.png"/>' :
            '<img class="no-gas" src="/img/map/VOSTPT_FUELCRISIS_GPL_500pxX500px.png"/>';
        let fuelStationName = e.features[0].properties.name ? e.features[0].properties.name.toUpperCase() : '';
        let description = "";
        let fuelIcons = "";
        if (isHelping()) {
            fuelIcons = "";
            if (e.features[0].properties.sell_gasoline) {
                fuelIcons += '<div class="col-md v-fuel-info gasoline"><a href="#" onclick="swapIcon(this)">' + gasolineIcon + '</a><h6>GASOLINA</h6></div>';
            }
            if (e.features[0].properties.sell_diesel) {
                fuelIcons += '<div class="col-md v-fuel-info diesel"><a href="#" onclick="swapIcon(this)">' + dieselIcon + '</a><h6>GASÓLEO</h6></div>';
            }
            if (e.features[0].properties.sell_lpg) {
                fuelIcons += '<div class="col-md v-fuel-info lpg"><a href="#" onclick="swapIcon(this)">' + lpgIcon + '</a><h6>GPL</h6></div>';
            }
        } else {
            fuelIcons = "";
            if (e.features[0].properties.sell_gasoline) {
                fuelIcons += '<div class="col-md v-fuel-info">' + gasolineIcon + '<h6>GASOLINA</h6></div>';
            }
            if (e.features[0].properties.sell_diesel) {
                fuelIcons += '<div class="col-md v-fuel-info">' + dieselIcon + '<h6>GASÓLEO</h6></div>';
            }
            if (e.features[0].properties.sell_lpg) {
                fuelIcons += '<div class="col-md v-fuel-info">' + lpgIcon + '<h6>GPL</h6></div>';
            }
        }
        if (isHelping()) {
            description = '<div class="v-popup-content">' +
                '<div class="v-popup-header" style="background-color:#85d5f8; text-align: center;"><h5>ADICIONAR INFORMAÇÃO</h5></div>' +
                '<div class="v-popup-body" style="background-color:#b8e1f8">' +
                '<div class="row">' +
                fuelIcons +
                '</div>' +
                '<img src="/img/map/separation.png" style="width: calc(100% + 1.6em); margin-left:-0.8em;" />' +
                '<div class="row"><div class="col-md"><b>POR FAVOR INDICA QUE COMBUSTÍVEIS NÃO ESTÃO</b></div></div>' +
                '<div class="row"><div class="col-md"><b>DISPONÍVEIS NA ' + fuelStationName + '.</b></div></div>' +
                '<div class="row"><div class="col-md"><b>CARREGA NAS IMAGENS.</b></div></div>' +
                '</div>' +
                '<div class="v-popup-header" style="padding:0;background-color:#85d5f8">' +
                '<div class="row" style="margin:0;">' +
                '<div class="col-3"><a href="/error/edit?id=' + e.features[0].properties.id + '"><img src="/img/map/VOSTPT_FUELCRISIS_REPORT_500pxX500px.png" style="height:2.5em;margin-top: 1.5vh;" /></a></div>' +
                '<div class="col-9"><a href="#" onclick="submitEntry(this,' + e.features[0].properties.id + ')"  style="margin:1.5vh"><h5  style="margin-right: 1.5vh;" class="popup_submit_text">VALIDAR</h5></a></div>' +
                '</div>' +
                '</div>' +
                '</div>';
        } else {
            description = '<div class="v-popup-content">' +
                '<div class="v-popup-header" style="background-color: #' + e.features[0].properties.popup_color + '"><h5>' + e.features[0].properties.brand.toUpperCase() + '<br><small>' + fuelStationName + '</small></h5></div>' +
                '<div class="v-popup-body" style="background-color: #' + e.features[0].properties.background_color + '">' +
                '<div class="row">' +
                fuelIcons +
                '</div>' +
                '</div>' +
                '<div class="v-popup-body directions"><a href="https://www.waze.com/ul?ll=' + coordinates[1] + '%2C' + coordinates[0] + '&navigate=yes&zoom=16&download_prompt=false"  target="_blank" rel="noopener noreferrer">' +
                '<img src="/img/map/map_separation_' + e.features[0].properties.background_color + '.png" style="width: 100%;" />' +
                '</a></div>' +
                '<div class="v-popup-header" style="padding:0;background-color: #' + e.features[0].properties.popup_color + '">' +
                '<div class="row" style="margin:0;">' +
                '<div class="col-3"><a href="/error/edit?id=' + e.features[0].properties.id + '"><img src="/img/map/VOSTPT_FUELCRISIS_REPORT_500pxX500px.png" style="height:2.5em;margin-top: 1.5vh;" /></a></div>' +
                '<div class="col-9"><a href="https://www.waze.com/ul?ll=' + coordinates[1] + '%2C' + coordinates[0] + '&navigate=yes&zoom=16&download_prompt=false" style="margin:1.5vh"><h5 style="margin-right: 1.5vh;">OBTER DIREÇÕES</h5></a></div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        map.flyTo({
            center: [coordinates[0], coordinates[1] + 0.0080],
            zoom: 13
        });

        popup = new mapboxgl.Popup({className: 'mapboxgl-popup-info'})
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });
    var tooltip_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'mapboxgl-popup-tooltip'
    });

    map.on('mouseenter', layerID, function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
    
        var coordinates = e.features[0].geometry.coordinates.slice();
        var tooltip = e.features[0].properties.tooltip;
    
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
    
        // Populate the popup and set its coordinates
        // based on the feature found.
        tooltip_popup.setLngLat(coordinates)
            .setHTML(tooltip)
            .addTo(map);
    });
    
    map.on('mouseleave', layerID, function () {
        map.getCanvas().style.cursor = '';
        tooltip_popup.remove();
    });
}

map.on('load', function () {
    $(".mapboxgl-ctrl-logo").css("float", "left");
    $(".mapboxgl-ctrl-bottom-left .mapboxgl-ctrl").append("<a style=\"cursor: pointer;\" target=\"_blank\" rel=\"noopener nofollow\"  href=\"https://twitter.com/vostpt\"><img src=\"/img/VOSTPT_LETTERING_COLOR.png\" style=\"height: 42px; margin-top: -15px; margin-left: 10px;\"/></a>");
    map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        language: 'pt-PT',
        mapboxgl: mapboxgl,
        marker: false,
        filter: function (item) {
            // returns true if item contains New South Wales region
            return item.context.map(function (i) {
                return (i.id.split('.').shift() === 'country' && i.text === 'Portugal');
            }).reduce(function (acc, cur) {
                return acc || cur;
            });
        },
    }));
    promises.push(loadBrandImage('REPA', '/img/map/VOSTPT_JNDPA_REPA_ICON_25x25.png'));
    promises.push(loadBrandImage('NONE', '/img/map/VOSTPT_JNDPA_NONE_ICON_25x25.png'));
    promises.push(loadBrandImage('PARTIAL', '/img/map/VOSTPT_JNDPA_PARTIAL_ICON_25x25.png'));
    promises.push(loadBrandImage('ALL', '/img/map/VOSTPT_JNDPA_ALL_ICON_25x25.png'));
    Promise.all(promises).then(function () {
        promises = [];
        updatePoints(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                map.flyTo({
                    center: [position.coords.longitude, position.coords.latitude],
                    zoom: 13
                });
            });
        }
        attributionControl.obj = new mapboxgl.AttributionControl({
            compact: true,
            customAttribution: getAttributions()
        });
        map.addControl(attributionControl.obj);
        nagivationControl.obj = new mapboxgl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true
        });
        map.addControl(nagivationControl.obj, 'bottom-right');
        setInterval(updatePoints, 30000);
    });
});
map.on('error', function (error) {
    console.log('MAP LOAD ERROR');
    console.log(error);
});

function updateLayersOptions() {
    let type = $("input.type[type=radio]:checked").val();
    let repa = [];
    let repa_objects = $('input[name="fuel_stations_repa[]"]:checked');
    Object.values(repa_objects).forEach(repa_object => {
        let value = repa_object.value;
        if (value) {
            repa.push(value);
        }
    });
    repa_layers.forEach(repa_element => {
        fuel_layers.forEach(fuel_element => {
            let layerID = 'poi-' + repa_element + '-' + fuel_element;
            let repa_condition = repa.includes(repa_element);
            let fuel_condition = ((fuel_element == type) || (type == "all"));
            let condition = repa_condition && fuel_condition;
            map.setLayoutProperty(layerID, 'visibility', (condition) ? 'visible' : 'none');
        });
    });
}

$('input.type[type=radio]').change(function () {
    updateLayersOptions();
});

$('input.repa[type=checkbox]').change(function () {
    updateLayersOptions();
});
