@extends('layouts.app')
@section('styles')
<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css' rel='stylesheet' />
<link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.4.1/mapbox-gl-geocoder.css' type='text/css' />
<link rel="stylesheet" href="{{ mix('/css/map.css') }}">
@endsection

@section('content')
<div id="selector_view" style="visibility: hidden;">
    <div class="container text-center">
        <img src="/img/VOSTPT_FuelCrisisPT_JNDPA_Logo_With_VOSTPT_Logo_800pxX800px.png" style="width:20em" />
        <div class="row text-center">
            <div class="col-md" style="margin-top: 0.5em;">
                <button type="button" class="btn btn-primary btn-lg" onclick="consult()">Consultar</button>
            </div>
            <div class="col-md" style="margin-top: 0.5em;">
                <button type="button" class="btn btn-primary btn-lg" onclick="help()">Ajudar</button>
            </div>
            <div class="col-md d-block d-lg-none" style="margin-top: 0.5em;">
                <a href="{{ route('stats') }}" class="btn btn-primary btn-lg">Estatísticas</a>
            </div>
            <div class="col-md d-block d-lg-none" style="margin-top: 0.5em;">
                <a href="{{ route('about') }}" class="btn btn-primary btn-lg">Sobre</a>
            </div>
        </div>
    </div>
</div>
<div id="map_view" style="visibility: hidden;">
    <div id="map"></div>
    <div class='map-overlay' id="features-icon">
        <a href="#" onclick="toggleFeatures()"><i class="fas fa-cog"></i></a>
    </div>
    <div class='map-overlay' id='features'>
        <h2>Opções</h2>
        <div id='pd'>
            <h4>Filtros de visualização</h4>
            <div class="form-check">
                <input class="form-check-input type" type="radio" id="fuel_of_stations_all" checked
                    name="fuel_stations_type" value="all" autocomplete="off">
                <label class="form-check-label" for="fuel_of_stations_all">
                    Todos os Postos
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input type" type="radio" id="fuel_of_stations_gasoline"
                    name="fuel_stations_type" value="gasoline" autocomplete="off">
                <label class="form-check-label" for="fuel_of_stations_gasoline">
                    Com Gasolina
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input type" type="radio" id="fuel_of_stations_diesel" name="fuel_stations_type"
                    value="diesel" autocomplete="off">
                <label class="form-check-label" for="fuel_of_stations_diesel">
                    Com Gasóleo
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input type" type="radio" id="fuel_of_stations_lpg" name="fuel_stations_type"
                    value="lpg" autocomplete="off">
                <label class="form-check-label" for="fuel_of_stations_lpg">
                    Com GPL
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input type" type="radio" id="fuel_of_stations_gasoline"
                    name="fuel_stations_type" value="without_gasoline" autocomplete="off">
                <label class="form-check-label" for="fuel_of_stations_gasoline">
                    Sem Gasolina
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input type" type="radio" id="fuel_of_stations_diesel" name="fuel_stations_type"
                    value="without_diesel" autocomplete="off">
                <label class="form-check-label" for="fuel_of_stations_diesel">
                    Sem Gasóleo
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input type" type="radio" id="fuel_of_stations_lpg" name="fuel_stations_type"
                    value="without_lpg" autocomplete="off">
                <label class="form-check-label" for="fuel_of_stations_lpg">
                    Sem GPL
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input type" type="radio" id="fuel_of_stations_none" name="fuel_stations_type"
                    value="none" autocomplete="off">
                <label class="form-check-label" for="fuel_of_stations_none">
                    Sem Nenhum
                </label>
            </div>
            <hr />
            <h4>Postos REPA</h4>
            <fieldset id="fuel_stations_repa">
                <div class="form-check">
                    <input class="form-check-input repa" name="fuel_stations_repa[]" type="checkbox" value="none"
                        id="fuel_stations_repa_no" checked>
                    <label class="form-check-label" for="fuel_stations_repa_no">
                        Postos Não REPA
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input repa" name="fuel_stations_repa[]" type="checkbox" value="normal"
                        id="fuel_stations_repa_normal" checked>
                    <label class="form-check-label" for="fuel_stations_repa_normal">
                        Postos REPA - Geral
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input repa" name="fuel_stations_repa[]" type="checkbox" value="sos"
                        id="fuel_stations_repa_sos" checked>
                    <label class="form-check-label" for="fuel_stations_repa_sos">
                        Postos REPA - Prioritários
                    </label>
                </div>
            </fieldset>
            <div class="iframe-remove">
                <hr />
                <label><a href="#" onclick="selector()">Voltar ao Menu</a></label>
            </div>
        </div>
    </div>
    <div class='map-overlay' id="legend-icon">
        <a href="#" onclick="toggleLegends()"><i class="fas fa-question"></i></a>
    </div>
    <div class='map-overlay' id='legend'>
        <h2>Legenda</h2>
        <div>
            <img src="/img/map/VOSTPT_JNDPA_ALL_ICON_25x25.png" /><label>- Todos os Combustíveis
                Disponíveis</label><br />
        </div>
        <div>
            <img src="/img/map/VOSTPT_JNDPA_PARTIAL_ICON_25x25.png" /><label>- Alguns Combustíveis Não
                Disponíveis</label><br />
        </div>
        <div>
            <img src="/img/map/VOSTPT_JNDPA_NONE_ICON_25x25.png" /><label>- Nenhum Combustível Está
                Disponível</label><br />
        </div>
        <div>
            <img src="/img/map/VOSTPT_JNDPA_REPA_ICON_25x25.png" /><label>- Posto de Combustível REPA </label><br />
        </div>
        <div>
            <img src="/img/map/VOSTPT_FUELCRISIS_GASOLINA_500pxX500px.png" style="width:25px;height:25px" /><label>- Gasolina </label><br />
        </div>
        <div>
            <img src="/img/map/VOSTPT_FUELCRISIS_GASOLEO_500pxX500px.png" style="width:25px;height:25px" /><label>- Gasóleo </label><br />
        </div>
        <div>
            <img src="/img/map/VOSTPT_FUELCRISIS_GPL_500pxX500px.png" style="width:25px;height:25px" /><label>- GPL </label><br />
        </div>
        <div>
            <img src="/img/map/VOSTPT_FUELCRISIS_REPORT_500pxX500px.png" style="width:25px;height:25px" /><label>- Reportar Erro </label><br />
        </div>
    </div>
</div>
@endsection

@section('javascript')
<script src="{{ mix('/js/map_load.js') }}" charset="utf-8"></script>
<script src="https://www.google.com/recaptcha/api.js?render=6LcD9rAUAAAAAIn4-wNkOpAmr49ItnAZnBtroGCX"></script>
<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.js'></script>
<script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.4.1/mapbox-gl-geocoder.min.js'></script>
<script src="{{ mix('/js/map_direct.js') }}" charset="utf-8"></script>
<script src="{{ mix('/js/map.js') }}" charset="utf-8"></script>
@endsection