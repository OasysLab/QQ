
var Dashboard = function() 
{
    return {
    	initAmChart2: function() 
    	{
            if (typeof(AmCharts) === 'undefined' || $('#dashboard_amchart_2').size() === 0) {
                return;
            }
            var chart = AmCharts.makeChart( "dashboard_amchart_2", {
                "type": "serial",
                "addClassNames": true,
                "theme": "light",
                "autoMargins": false,
                "marginLeft": 30,
                "marginRight": 8,
                "marginTop": 10,
                "marginBottom": 26,
                "balloon": {
                    "adjustBorderColor": false,
                    "horizontalPadding": 10,
                    "verticalPadding": 8,
                    "color": "#ffffff"
                },"dataProvider": [{
		            "date": "2016-06-08",
		            "usage": 0.571654,
		            "duration": "5.75"
		        },
				{
	                "date": "2016-06-08",
	                "usage": 5.263701,
	            },{
		            "date": "2016-06-11",
		            "usage": 0.884147,
		            "duration": "6.77"
		        },{
		            "date": "2016-06-15",
		            "usage": 0.14217,
		            "duration": "4.63"
		        },
				{
	                "date": "2016-06-15",
	                "usage": 1.523576,
	            },{
		            "date": "2016-06-17",
		            "usage": 244.309196,
		            "duration": "262.52"
		        },
				{
	                "date": "2016-06-17",
	                "usage": 330.742133,
	            },{
		            "date": "2016-06-18",
		            "usage": 0.227798,
		            "duration": "1.02"
		        },
				{
	                "date": "2016-06-18",
	                "usage": 1.014345,
	            },
				{
	                "date": "2016-06-18",
	                "usage": 2.832948,
	            },
				{
	                "date": "2016-06-18",
	                "usage": 2.880531,
	            },{
		            "date": "2016-06-19",
		            "usage": 19.601658,
		            "duration": "30.48"
		        },
				{
	                "date": "2016-06-19",
	                "usage": 226.034156,
	            },{
		            "date": "2016-06-20",
		            "usage": 27.909699,
		            "duration": "110"
		        },
				{
	                "date": "2016-06-20",
	                "usage": 31.352564,
	            },
				{
	                "date": "2016-06-20",
	                "usage": 32.551296,
	            },
				{
	                "date": "2016-06-20",
	                "usage": 33.600995,
	            },
				{
		            "date": "2016-06-28",
		            "usage": 0.088646,
		            "duration": "2.4"
		        }],"valueAxes": [{
                    "axisAlpha": 0,
                    "position": "left"
                }],
                "startDuration": 1,
                "graphs": [{
                    "alphaField": "alpha",
                    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                    "fillAlphas": 1,
                    "title": "Usage (Mib)",
                    "type": "column",
                    "valueField": "usage",
                    "dashLengthField": "dashLengthColumn"
                }, {
                    "id": "graph2",
                    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                    "bullet": "round",
                    "lineThickness": 3,
                    "bulletSize": 7,
                    "bulletBorderAlpha": 1,
                    "bulletColor": "#FFFFFF",
                    "useLineColorForBulletBorder": true,
                    "bulletBorderThickness": 3,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Time Duration (Minute)",
                    "valueField": "duration"
                }],
                "categoryField": "date",
                categoryAxis: {
                    parseDates: true,
                    minPeriod: "DD",
                    autoGridCount: false,
                    gridCount: 50,
                    gridAlpha: 0.1,
                    gridColor: "#FFFFFF",
                    axisColor: "#555555",
                    dateFormats: [{
                        period: 'DD',
                        format: 'DD'
                    }, {
                        period: 'WW',
                        format: 'MMM DD'
                    }, {
                        period: 'MM',
                        format: 'MMM'
                    }, {
                        period: 'YYYY',
                        format: 'YYYY'
                    }]
                },
                "export": {
                    "enabled": true
                }
            });
        },
      	initAmChartBar: function() 
      	{
          	if (typeof(AmCharts) === 'undefined') {
                return;
            }
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:52 ,
                    y2:48
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent20");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:62 ,
                    y2:38
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent21");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:41 ,
                    y2:59
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent22");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:50 ,
                    y2:50
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent23");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:67 ,
                    y2:33
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent24");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:91 ,
                    y2:9
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent25");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:72 ,
                    y2:28
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent26");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:48 ,
                    y2:52
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent27");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:62 ,
                    y2:38
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent28");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:73 ,
                    y2:27
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent29");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:25 ,
                    y2:75
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent210");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:88 ,
                    y2:12
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent211");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:95 ,
                    y2:5
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent212");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:83 ,
                    y2:17
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent213");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:72 ,
                    y2:28
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent214");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:77 ,
                    y2:23
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent215");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:65 ,
                    y2:35
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent216");

                
			var chart = new AmCharts.AmSerialChart(AmCharts.themes.none);
                chart.dataProvider = [{
                    x: 1,
                    y1:67 ,
                    y2:33
                }];
                chart.categoryField = "x";
                chart.rotate = true;
                chart.autoMargins = false;
                chart.marginLeft = 0;
                chart.marginRight = 0;
                chart.marginTop = 0;
                chart.marginBottom = 0;

                var graph = new AmCharts.AmGraph();
                graph.valueField = "y1";
                graph.type = "column";
                graph.fillAlphas = 1;
                graph.fillColors = "#000000";
                graph.gradientOrientation = "horizontal";
                graph.lineColor = "#FFFFFF";
                graph.showBalloon = false;
                chart.addGraph(graph);

                var graph2 = new AmCharts.AmGraph();
                graph2.valueField = "y2";
                graph2.type = "column";
                graph2.fillAlphas = 0.2;
                graph2.fillColors = "#000000";
                graph2.lineColor = "#FFFFFF";
                graph2.showBalloon = false;
                chart.addGraph(graph2);

                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.gridAlpha = 0;
                valueAxis.axisAlpha = 0;
                valueAxis.stackType = "100%"; // this is set to achieve that column would occupie 100% of the chart area
                chart.addValueAxis(valueAxis);

                var categoryAxis = chart.categoryAxis;
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                chart.write("percent217");

                
		},
        initEasyPieCharts: function() {
            if (!jQuery().easyPieChart) {
                return;
            }

            $('.easy-pie-chart .number.transactions').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: App.getBrandColor('yellow')
            });

            $('.easy-pie-chart .number.visits').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: App.getBrandColor('green')
            });

            $('.easy-pie-chart .number.bounce').easyPieChart({
                animate: 1000,
                size: 75,
                lineWidth: 3,
                barColor: App.getBrandColor('red')
            });
        },
		init: function() 
		{
            this.initAmChart2();
            this.initAmChartBar();
            this.initEasyPieCharts();
        }
    };
}();
function clickFun() {
    location.reload();
}
if (App.isAngularJsApp() === false) {
    jQuery(document).ready(function() {
        Dashboard.init(); // init metronic core componets
    });
}