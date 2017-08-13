angular.module('app')
    .factory('Conciliacion', [function ConciliacionFactory() {
        var data = [
                {
                    name: 'Juan Paco Pedro',
                    state: 'En progreso',
                    days: 8,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'En progreso',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
                {
                    name: 'Jesus Marin',
                    state: 'Programado',
                    days: 19,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Programado para el 20 de Julio a las 2pm',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
                {
                    name: 'Isabela Melendez',
                    state: 'Por programar',
                    days: 30,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Por programar 2 dias habiles',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
                {
                    name: 'Rita Geronimo',
                    state: 'Por programar',
                    days: 45,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Por programar 3 dias habiles',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]             
                },
                {
                    name: 'Ramon Alzate',
                    state: 'Programado',
                    days: 60,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Programado para el 23 de Julio a las 8am',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
                {
                    name: 'Juan Dias',
                    state: 'Por Programar',
                    days: 80,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Por programar 1 dia habil',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
            ];
            var archive = [
                {
                    name: 'Juan Paco Pedro__________',
                    state: 'En progreso',
                    days: 8,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'En progreso',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
                {
                    name: 'Jesus Marin',
                    state: 'Programado',
                    days: 19,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                   documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Programado para el 20 de Julio a las 2pm',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
                {
                    name: 'Isabela Melendez_____________________',
                    state: 'Por programar',
                    days: 30,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Por programar 2 dias habiles',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
                {
                    name: 'Rita Geronimo__________________________',
                    state: 'Por programar',
                    days: 45,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Por programar 3 dias habiles',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]             
                },
                {
                    name: 'Ramon Alzate______________________________',
                    state: 'Programado',
                    days: 60,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Programado para el 23 de Julio a las 8am',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
                {
                    name: 'Juan Dias',
                    state: 'Por Programar',
                    days: 80,
                    id: "3456789987654",
                    cuantia: '350.000.000',
                    documentos:[
                        {title: 'Notificaciones',
                            info: [
                                {nombre: 'Notificacion_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Notificacion_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Actas',
                            info: [
                                {nombre: 'Acta_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Acta_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'Constancias',
                            info: [
                                {nombre: 'Constancia_1', documento: 'Esta es la ref del documento'},
                                {nombre: 'Constancia_2', documento: 'Esta es la ref del documento'}
                            ]
                        },
                        {title: 'docs',
                            info: [
                                {tipo: 'CC', nombre: 'Cedula Juan Dias', comuento: 'Esta es la ref del documento'}
                            ]
                        }
                    ],
                    full_state: 'Por programar 1 dia habil',
                    hechos:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                        evidencias: [{
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        },
                        {
                            titulo: 'La casa es familiar',
                            cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'
                        }]
                    }],
                    pretensiones:[ {
                        titulo: 'Titulo 1',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    },
                    {
                        titulo: 'Titulo 2',
                        cuerpo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
                    }]
                },
            ];
        var state = true;
        var index = true;    
            
        return{
            index: function(){
                if (state){
                    return data;
                }else{
                    return archive;
                }
            },
            show: function(id){
                if(state){
                    return data[id];
                }else{
                    return archive[id];
                }
            },
            state: function(){
                return  state;
            },
            setState: function(val){
                state = val;
            },
            getIndex: function(){
                return index;
            },
            setIndex: function(info){
                index = info;
            }
    }
}]);