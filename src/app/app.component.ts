import { Component, inject } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, RouterOutlet, HighchartsChartModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  service = inject(AppService);
  title = 'variacao-ativo-exam';

  ngOnInit() {
    this.service.mySubject.asObservable()
    .subscribe(data => {
      if(data.length) {
        console.log('dado: ', data);

        this.chartOptions = {
          title: {
            text: 'Variação Ativo em Percentual',
            style: {
              color: 'orange',
            },
          },
          chart: {
            type: 'line',
            margin: [2, 0, 2, 0],
            width: 800,
            height: 320,
          },
          xAxis: {
            type: 'datetime',
            labels: {
              formatter: function () {
                return Highcharts.dateFormat('%d', this.value as any);
              },
            },
            min: this.getPeriod(30), // Define a data atual como o mínimo do eixo x
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
              data,
              name: 'okdas',
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
                    Abertura: ${open} BRL<br>
                    Máxima: ${high} BRL<br>
                    Mínima: ${low} BRL<br>
                    Fechamento: ${close} BRL <br><br>

                    <strong style="font-size: 10px;">Variação 1º Dia: ${variationPercentOpeningDay.toFixed(
                      2
                    )}%</strong><br>
                    <strong style="font-size: 10px;">Variação Dia Anterior: ${variationPreviousDay.toFixed(
                      2
                    )}%</strong>
                    `;
                },
              },
            },
            // this.zigzagData,
            this.zigzagOpeningData,
            // {
            //   type: 'zigzag',
            //   showInLegend: true,
            //   linkedTo: 'base',
            //   params: {
            //     deviation: 2, // Valor padrão para o Zig Zag (1%)
            //   },
            //   tooltip: {
            //     pointFormatter: function () {
            //       // Personalize o texto da tooltip Zig Zag aqui
            //       return 'Valor Zig Zag Personalizado: ' + this.y;
            //     },
            //   },
            // },
          ],
        };
      }
    })
  }

  highCharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'stockChart'; // optional string, defaults to 'chart'
  ohlcData = [
    [this.getPeriod(4), 1.0, 150.2, 115, 150],
    [this.getPeriod(3), 1.1, 148, 23, 39],
    [this.getPeriod(2), 1.05, 125, 41, 38],
    [this.getPeriod(1), 1.9, 125, 41, 38],
  ];

  // série Zig Zag vinculada à série OHLC
  zigzagData: SeriesZigzagOptions = {
    linkedTo: 'base',
    type: 'zigzag',
    showInLegend: true,
    tooltip: {
      pointFormatter: function () {
        return ''.toString();
      },
    },
  };

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

  chartOptions: Highcharts.Options = {}

  chartCallback: Highcharts.ChartCallbackFunction = this.myCallbackChartFunc; // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  myCallbackChartFunc(chart: any) {
    console.log('my callBack chart: ', chart);
  }

  getPeriod(periodNumber: number) {
    const currentDate = new Date();
    const trintaDiasAtras = new Date(currentDate);
    trintaDiasAtras.setDate(currentDate.getDate() - periodNumber);
    return trintaDiasAtras.getTime();
  }

  ngAfterContentInit() {}

  // ngOnChanges(change: SimpleChanges) {
  //   this.chartOptions.series = [
  //     {
  //       name: change.name ? change.name.currentValue : null,
  //       type: 'area',
  //       data: change.data.currentValue
  //     }
  //   ];
  //   this.updateFlag = true;
  // }

  addSeries() {
    // this.chart.addSeries({
    //   name: 'Line ' + Math.floor(Math.random() * 10),
    //   data: [
    //     10,20,30,40,50,50
    //   ]
    // });
    // this.highCharts.
  }
}
