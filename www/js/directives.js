angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])

// Directive for pie charts, pass in title and data only    
.directive('hcPieChart', function () {
return {
    restrict: 'E',
    template: '<div style="width:90%;"></div>',
    scope: {
        title: '@',
        data: '='
    },
    link: function (scope, element) {
        Highcharts.chart(element[0], {
            chart: {
            type: 'column'
	        },
	        title: {
	            text: 'Stacked column chart'
	        },
	        xAxis: {
	            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas', 'Mangoes', 'Water-Melons', 'Kiwi']
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Total fruit consumption'
	            },
	            stackLabels: {
	                enabled: true,
	                style: {
	                    fontWeight: 'bold',
	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	                }
	            }
	        },
	        legend: {
	            align: 'right',
	            x: -30,
	            verticalAlign: 'top',
	            y: 25,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	            borderColor: '#CCC',
	            borderWidth: 1,
	            shadow: false
	        },
	        tooltip: {
	            headerFormat: '<b>{point.x}</b><br/>',
	            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: 'John',
	            data: [5, 3, 4, 7, 2, 8, 9, 8]
	        }, {
	            name: 'Jane',
	            data: [2, 2, 3, 2, 1, 4, 5, 2]
	        }, {
	            name: 'Joe',
	            data: [3, 4, 4, 2, 5, 9, 3, 9]
	        }, {
	            name: 'Roy',
	            data: [3, 4, 4, 2, 5, 3, 1, 4]
	        },{
	            name: 'Abe',
	            data: [5, 3, 4, 7, 2, 8, 9, 3]
	        }]
        });
    }
}
});

