(function () {
    'use strict';

    angular.module('app')
        .controller('DashboardCtrl', ['$scope', DashboardCtrl])

    function DashboardCtrl($scope) {
        var textColor = '#989898' // label, legend etc.
          , splitLineColor = 'rgba(0,0,0,.05)'
          , splitAreaColor = ['rgba(250,250,250,0.035)','rgba(200,200,200,0.1)']


        $scope.line1 = {};
        $scope.line2 = {};
        $scope.radar1 = {}; // not used for now
        $scope.radar3 = {};

        $scope.line1.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Industry Leader','Our Company'],
                textStyle: {
                    color: textColor
                }
            },
            toolbox: {
                show : false
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Jan.','Feb.','Mar.','Apr.','May.','Jun.','Jul.'],
                    axisLabel : {
                        textStyle: {
                            color: textColor
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: splitLineColor
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        textStyle: {
                            color: textColor
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: splitLineColor
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: splitAreaColor
                        }
                    }
                }
            ],
            series : [
                {
                    name:'Industry Leader',
                    type:'line',
                    data:[66, 68, 84, 78, 70, 80, 65],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    },
                    itemStyle: {
                        normal: {
                            color: $scope.color.success
                        }
                    },
                    symbol: 'diamond'
                },
                {
                    name:'Our Company',
                    type:'line',
                    data:[51, 42, 52, 63, 57, 49, 53],
                    markPoint : {
                        data : [
                            {name : 'Our Company', value : -2, xAxis: 1, yAxis: -1.5}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : 'Average'}
                        ]
                    },
                    itemStyle: {
                        normal: {
                            color: $scope.color.info
                        }
                    },
                    symbol: 'diamond'
                }
            ]
        };

        $scope.line2.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Revenue','Retention','Activation','Acquisition'],
                textStyle: {
                    color: textColor
                }
            },
            toolbox: {
                show : false
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.'],
                    axisLabel : {
                        textStyle: {
                            color: textColor
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: splitLineColor
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        textStyle: {
                            color: textColor
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: splitLineColor
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: splitAreaColor
                        }
                    }
                }
            ],
            series : [
                {
                    name:'Revenue',
                    type:'line',
                    stack: 'Sum',
                    data:[220, 182, 191, 234, 290, 330, 310],
                    itemStyle: {
                        normal: {
                            color: $scope.color.warning
                        }
                    },
                    symbol: 'diamond'
                },
                {
                    name:'Retention',
                    type:'line',
                    stack: 'Sum',
                    data:[150, 232, 201, 154, 190, 330, 410],
                    itemStyle: {
                        normal: {
                            color: $scope.color.danger
                        }
                    },
                    symbol: 'diamond'
                },
                {
                    name:'Activation',
                    type:'line',
                    stack: 'Sum',
                    data:[320, 332, 301, 334, 390, 330, 320],
                    itemStyle: {
                        normal: {
                            color: $scope.color.success
                        }
                    },
                    symbol: 'diamond'
                },
                {
                    name:'Acquisition',
                    type:'line',
                    stack: 'Sum',
                    data:[820, 932, 901, 934, 1290, 1330, 1320],
                    itemStyle: {
                        normal: {
                            color: $scope.color.info
                        }
                    },
                    symbol: 'diamond'
                }
            ]
        };

        $scope.radar1.options = {
            tooltip : {},
            legend: {
                orient : 'vertical',
                x : 'right',
                y : 'bottom',
                data:['Our Company','Industry Average'],
                textStyle: {
                    color: textColor
                }
            },
            toolbox: {
                show : false
            },
            radar : [
                 {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            // for both indicator and axisLine, bad, better seperate them
                            color: '#b1b1b1'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(0,0,0,.1)'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: splitAreaColor
                        }
                    },
                    indicator : [
                        { name: 'Sales', max: 6000},
                        { name: 'Administration', max: 16000},
                        { name: 'Information Techology', max: 30000},
                        { name: 'Customer Support', max: 38000},
                        { name: 'Development', max: 52000},
                        { name: 'Marketing', max: 25000}
                    ]
                }
            ],
            calculable : true,
            series : [
                {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data : [
                        {
                            value : [4300, 10000, 28000, 35000, 50000, 19000],
                            name : 'Our Company'
                        },
                         {
                            value : [5000, 14000, 28000, 31000, 42000, 21000],
                            name : 'Industry Average'
                        }
                    ]
                }
            ]
        };

        $scope.radar3.options = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 'center',
                data:['Product','Industry Average','Our Company','Industry Performance','Our Performance'],
                textStyle: {
                    color: textColor
                }
            },
            radar: [
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            // for both indicator and axisLine, bad, better seperate them
                            color: '#b1b1b1'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(0,0,0,.1)'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: splitAreaColor
                        }
                    },
                    indicator: [
                        {text: 'Design', max: 100},
                        {text: 'Code', max: 100},
                        {text: 'Usability', max: 100},
                        {text: 'Content', max: 100}
                    ],
                    center: ['25%','40%'],
                    radius: 80
                },
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            // for both indicator and axisLine, bad, better seperate them
                            color: '#b1b1b1'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(0,0,0,.1)'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: splitAreaColor
                        }
                    },
                    indicator: [
                        {text: 'Sales', max: 100},
                        {text: 'Marketing', max: 100},
                        {text: 'Development', max: 100},
                        {text: 'Support', max: 100},
                        {text: 'Administration', max: 100}
                    ],
                    radius: 80,
                    center: ['50%','60%'],
                },
                {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            // for both indicator and axisLine, bad, better seperate them
                            color: '#b1b1b1'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(0,0,0,.1)'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: splitAreaColor
                        }
                    },
                    indicator: (function (){
                        var res = [];
                        for (var i = 1; i <= 12; i++) {
                            res.push({text:'Mon. '+i,max:100});
                        }
                        return res;
                    })(),
                    center: ['75%','40%'],
                    radius: 80
                }
            ],
            series: [
                {
                    type: 'radar',
                     tooltip: {
                        trigger: 'item'
                    },
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: [
                        {
                            value: [60,73,85,40],
                            name: 'Product',
                            itemStyle: {
                                normal: {
                                    color: $scope.color.danger
                                }
                            }
                        }
                    ]
                },
                {
                    type: 'radar',
                    radarIndex: 1,
                    data: [
                        {
                            value: [85, 90, 90, 95, 95],
                            name: 'Industry Average',
                            itemStyle: {
                                normal: {
                                    color: $scope.color.warning
                                }
                            }
                        },
                        {
                            value: [95, 80, 95, 90, 93],
                            name: 'Our Company',
                            itemStyle: {
                                normal: {
                                    color: $scope.color.primary
                                }
                            }
                        }
                    ]
                },
                {
                    type: 'radar',
                    radarIndex: 2,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: [
                        {
                            name: 'Industry Performance',
                            value: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 75.6, 82.2, 48.7, 18.8, 6.0, 2.3],
                            itemStyle: {
                                normal: {
                                    color: $scope.color.info
                                }
                            }
                        },
                        {
                            name:'Our Performance',
                            value:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 35.6, 62.2, 32.6, 20.0, 6.4, 3.3],
                            itemStyle: {
                                normal: {
                                    color: $scope.color.success
                                }
                            }
                        }
                    ]
                }
            ]
        }


        // Small line charts
        $scope.smline1 = {};
        $scope.smline2 = {};
        $scope.smline3 = {};
        $scope.smline4 = {};
        $scope.smline1.options = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            }, 
            grid: {
                x: 1,
                y: 1,
                x2: 1,
                y2: 1,
                borderWidth: 0
            },            
            xAxis : [
                {
                    type : 'category',
                    show: false,
                    boundaryGap : false,
                    data : [1,2,3,4,5,6,7]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'*',
                    type:'line',
                    symbol: 'none',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    itemStyle: {
                        normal: {
                            color: $scope.color.warning
                        }
                    }                    
                }
            ]
        };
        $scope.smline2.options = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            }, 
            grid: {
                x: 1,
                y: 1,
                x2: 1,
                y2: 1,
                borderWidth: 0
            },            
            xAxis : [
                {
                    type : 'category',
                    show: false,
                    boundaryGap : false,
                    data : [1,2,3,4,5,6,7]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'*',
                    type:'line',
                    symbol: 'none',
                    data:[11, 10, 14, 12, 13, 11, 12],
                    itemStyle: {
                        normal: {
                            color: $scope.color.info
                        }
                    }                     
                }
            ]
        };
        $scope.smline3.options = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            }, 
            grid: {
                x: 1,
                y: 1,
                x2: 1,
                y2: 1,
                borderWidth: 0
            },            
            xAxis : [
                {
                    type : 'category',
                    show: false,
                    boundaryGap : false,
                    data : [1,2,3,4,5,6,7]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'*',
                    type:'line',
                    symbol: 'none',
                    data:[11, 10, 15, 13, 12, 13, 10],
                    itemStyle: {
                        normal: {
                            color: $scope.color.danger
                        }
                    }                 
                }
            ]
        };
        $scope.smline4.options = {
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: $scope.color.gray
                    }
                }
            }, 
            grid: {
                x: 1,
                y: 1,
                x2: 1,
                y2: 1,
                borderWidth: 0
            },            
            xAxis : [
                {
                    type : 'category',
                    show: false,
                    boundaryGap : false,
                    data : [1,2,3,4,5,6,7]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show: false,
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'*',
                    type:'line',
                    symbol: 'none',
                    data:[11, 12, 8, 10, 15, 12, 10],
                    itemStyle: {
                        normal: {
                            color: $scope.color.success
                        }
                    }                      
                }
            ]
        };


    }


})(); 
