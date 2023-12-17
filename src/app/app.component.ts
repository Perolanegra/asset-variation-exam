import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';

import IndicatorsCore from 'highcharts/indicators/indicators';
import IndicatorZigzag from 'highcharts/indicators/zigzag';
import { AppService } from './app.service';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

// Tipo da série Zig Zag
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
  private destroyRef = inject(DestroyRef);
  title = 'asset-variation-exam';
  showChart = true;

  ngAfterViewInit(): void {
    this.service.mySubject
      .asObservable()
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data.length) {
          (this.chartOptions as any).series[0].data = [...data];
          this.chartOptions.title = {
            ...this.chartOptions.title,
            text: `Variação Ativo: <span style="color: red;">${this.title}</span> em Percentual (%)`,
          };
          this.updateFlag = true;
          this.showChart = true;
        }
      });
  }

  selectAssetState = (assetName: string): void => {
    this.showChart = false;
    this.service.getSelectedAsset(assetName);
    this.title = assetName;
  };

  highCharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'stockChart';
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

  // série zigzag para ligar os pontos referente ao dado da serie ohlc
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

            // variação referente ao preço do dia de abertura (%).
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
                Variação 1º Dia: ${variationPercentOpeningDay.toFixed(1)}%
              </strong>
              <br>
              <strong style="font-size: 10px;">
                Variação Dia Anterior: ${variationPreviousDay.toFixed(1)}%
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

  getPeriod(periodNumber: number, hasFirstData: boolean = false): number {
    // Obtém a data e hora atuais
    const now = new Date();

    // Define as horas, minutos e segundos para 12:00:00
    now.setHours(12, 0, 0, 0);

    const pastTimestamp = now.getTime() - periodNumber * 24 * 60 * 60 * 1000;

    // Converte o timestamp para segundos
    const pastTimestampInSeconds = Math.floor(pastTimestamp / 1000);

    return hasFirstData ? pastTimestamp : pastTimestampInSeconds;
  }
}
