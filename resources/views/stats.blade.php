@extends('layouts.app')
@section('styles')
@endsection

@section('content')
<div class="container text-center">
    <img src="/img/VOSTPT_FuelCrisisPT_JNDPA_Logo_With_VOSTPT_Logo_800pxX800px.png" style="width:20em" />
    <div class="row">
        <iframe frameborder="0" scrolling="no" onload="resizeIframe(this)" id="global_stats" style="width:100%;"
            src="/graphs/stats"></iframe>
    </div>
    <div class="col-md-9" style="margin-top: 0.5em;">
        <p class="btn btn-primary btn-lg">Número de Submissões (Última Hora): <span
                id="entries_last_hour">Loading...</span></p>
    </div>
    <div class="col-md-9" style="margin-top: 0.5em;">
        <p class="btn btn-primary btn-lg">Número de Submissões (Último Dia): <span
                id="entries_last_day">Loading...</span></p>
    </div>
    <div class="col-md-9" style="margin-top: 0.5em;">
        <p class="btn btn-primary btn-lg">Número de Submissões (Total): <span id="entries_total">Loading...</span></p>
    </div>
</div>
@endsection

@section('javascript')
<script src="{{ mix('/js/stats.js') }}" charset="utf-8"></script>
<script>
function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}
</script>
@endsection