import { AfterViewInit, Component, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';

import HIndicatorsAll from 'highcharts/indicators/indicators-all';
import HDragPanes from 'highcharts/modules/drag-panes';
import HAnnotationsAdvanced from 'highcharts/modules/annotations-advanced';
import HPriceIndicator from 'highcharts/modules/price-indicator';
import HStockTools from 'highcharts/modules/stock-tools';

import IndicatorsCore from 'highcharts/indicators/indicators';
import IndicatorZigzag from 'highcharts/indicators/zigzag';
import { AppService } from './app.service';
import { MatButtonModule } from '@angular/material/button';

HIndicatorsAll(Highcharts);
HDragPanes(Highcharts);
HAnnotationsAdvanced(Highcharts);
HPriceIndicator(Highcharts);
HStockTools(Highcharts);

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

// Defina o tipo da série Zig Zag
interface SeriesZigzagOptions extends Highcharts.SeriesZigzagOptions {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HighchartsChartModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  service = inject(AppService);
  title = 'variacao-ativo-exam';
  showChart = true;

  ngAfterViewInit() {
    this.service.mySubject.asObservable().subscribe((data) => {
      if (data.length) {
        (this.chartOptions as any).series[0].data = [...data];
        this.updateFlag = true;
        this.showChart = !this.showChart;
      }
    });
  }

  highCharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'stockChart'; // optional string, defaults to 'chart'
  ohlcDataMock = [
    [
      this.getPeriod(4, true),
      35.97999954223633,
      36.4900016784668,
      35.5,
      35.54999923706055,
    ],
    [
      this.getPeriod(3, true),
      35.83000183105469,
      36.91999816894531,
      35.81999969482422,
      36.709999084472656,
    ],
    [
      this.getPeriod(2, true),
      36.77000045776367,
      37.220001220703125,
      36.27000045776367,
      36.7400016784668,
    ],
    [
      this.getPeriod(1, true),
      36.540000915527344,
      36.540000915527344,
      35.90999984741211,
      36.36000061035156,
    ],
  ];

  // série OHLC para a variação em relação à abertura
  zigzagOpeningData: SeriesZigzagOptions = {
    linkedTo: 'base',
    type: 'zigzag',
    showInLegend: true,
    tooltip: {
      pointFormatter: function () {
        return ''.toString();
      },
    },
  };

  chartOptions: Highcharts.Options = {
    title: {
      text: 'Variação Ativo em Percentual (%)',
      style: {
        color: '#544fc5',
      },
    },
    chart: {
      type: 'line',
      margin: [2, 0, 2, 0],
      width: 800,
      height: 400,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return Highcharts.dateFormat('%d', this.value as any);
        },
      },
      min: this.getPeriod(30, true), // Define a data atual como o mínimo do eixo x
    },
    yAxis: {
      title: {
        text: 'Variação de Preço (%)',
      },
    },
    series: [
      {
        type: 'ohlc',
        id: 'base',
        pointInterval: 24 * 3600 * 1000,
        data: this.ohlcDataMock,
        tooltip: {
          pointFormatter: function () {
            // Personalize o texto do tooltip para a série OHLC
            const firstPrice = this.series.data[0].options.open as number;

            const date = new Date(this.x);
            const formattedDate = date.toLocaleDateString();
            const open = this.options.open as number;
            const high = this.options.high as number;
            const low = this.options.low as number;
            const close = this.options.close as number;

            // vão ser iguais no primeiro e no segundo.
            const variationPercentOpeningDay = (open - firstPrice) * 100; // variação referente ao preço do primeiro dia (%).
            // variação referente ao preço do dia anterior (%).
            const variationPreviousDay =
              this.index > 0
                ? ((open -
                    (this.series.data[this.index - 1] as any).options
                      .open) as number) * 100
                : 0;

            return `
              <span style="font-size: 10px">${formattedDate}</span><br>
                Abertura: ${open.toFixed(2)} BRL<br>
                Máxima: ${high.toFixed(2)} BRL<br>
                Mínima: ${low.toFixed(2)} BRL<br>
                Fechamento: ${close.toFixed(2)} BRL <br><br>

              <strong style="font-size: 10px;">
                Variação 1º Dia: ${variationPercentOpeningDay.toFixed(2)}%
              </strong>
              <br>
              <strong style="font-size: 10px;">
                Variação Dia Anterior: ${variationPreviousDay.toFixed(2)}%
              </strong>
            `;
          },
        },
      },
      this.zigzagOpeningData,
    ],
  };

  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  getPeriod(periodNumber: number, hasFirstData: boolean = false) {
    // Obtém a data e hora atuais
    const dataAtual = new Date();

    // Define as horas, minutos e segundos para 12:00:00
    dataAtual.setHours(12, 0, 0, 0);

    // Subtrai 4 dias (em milissegundos) do timestamp atual
    const timestampQuatroDiasAtras =
      dataAtual.getTime() - periodNumber * 24 * 60 * 60 * 1000;

    // Converte o timestamp para segundos
    const timestampQuatroDiasAtrasEmSegundos = Math.floor(
      timestampQuatroDiasAtras / 1000
    );

    return hasFirstData
      ? timestampQuatroDiasAtras
      : timestampQuatroDiasAtrasEmSegundos;
  }
}
