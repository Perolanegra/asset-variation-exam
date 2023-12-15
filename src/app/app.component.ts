import { Component } from '@angular/core';
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

HIndicatorsAll(Highcharts);
HDragPanes(Highcharts);
HAnnotationsAdvanced(Highcharts);
HPriceIndicator(Highcharts);
HStockTools(Highcharts);

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HighchartsChartModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'variacao-ativo-exam';

  highCharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'stockChart'; // optional string, defaults to 'chart'
  data = [
    [this.getPeriod(2), 100, 150.2, 115, 40],
    [this.getPeriod(1), 100, 150.2, 115, 40],
  ];

  chartOptions: Highcharts.Options = {
    title: {
      text: 'Variação Ativo em Percentual',
      style: {
        color: 'orange',
      },
    },
    chart: {
      type: 'line',
      margin: [2, 0, 2, 0],
      width: 650,
      height: 300,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return Highcharts.dateFormat('%d', this.value as any);
        },
      },
      min: this.getPeriod(22), // Define a data atual como o mínimo do eixo x
      title: {
        // text: 'Dias',
      },
    },
    series: [
      {
        type: 'ohlc',
        id: 'base',
        pointInterval: 24 * 3600 * 1000,
        data: this.data,
        name: 'Ativo (D-1)',
      },
      {
        type: 'zigzag',
        showInLegend: true,
        linkedTo: 'base',
      },
    ],
  };

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
