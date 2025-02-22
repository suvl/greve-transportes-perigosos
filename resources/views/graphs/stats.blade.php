<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Já Não Dá Para Abastecer - Estastísticas</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css">
    <style>
        canvas {
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
        }

        .flex-container {
            display: flex;
            flex-wrap: wrap;
        }

        @media screen and (min-width: 768px) {
            .graph {
                width: 50%;
            }
        }

        @media screen and (max-width: 768px) {
            .graph {
                width: 100%;
            }
        }

        .graph {
            min-width: 400px;
        }
    </style>

</head>

<body>
    <div class="flex-container">
        <div class="graph">
            <canvas id="stations-chart-area"></canvas>
        </div>
        <div class="graph">
            <canvas id="types-chart-area"></canvas>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min.js" charset="utf-8"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels" charset="utf-8"></script>
    <script src="{{ mix('/js/graph_stats.js') }}" charset="utf-8"></script>
</body>

</html>