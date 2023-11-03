

export type LevelProps = {
    color: string
    dimensions: number[]
    position: number[]
    scale: number
}

export const environmentParamsByLevel = {
    4: {
        sky: {
            position:[0.7, 0.1504999999999995, -8.760353553682876e-17],
        },
        ambientLight: {
            intensity: 0.4
        },
        directionalLight: {
            intensity: 0.4,
            position:[0,0,0]
        },
        fog: {
            color: 'white',
            near: 100,
            far:5000
        }
    },
    5: {
        sky: {
            position:[0.7, 0.1504999999999995, -8.760353553682876e-17],
        },
        ambientLight: {
            intensity: 0.4
        },
        directionalLight: {
            intensity: 0.4,
            position:[0,0,0]
        },
        fog: {
            color: 'white',
            near: 100,
            far:5000
        }
    },
    6: {
        sky: {
            position:[0.7, 0.1504999999999995, -8.760353553682876e-17],
        },
        ambientLight: {
            intensity: 0.99
        },
        directionalLight: {
            intensity: 0.39,
            position:[0,0,0]
        },
        fog: {
            color: '#eeeeee',
            near: 100,
            far:5000
        }
    },
    7: {
        sky: {
            position:[0.7, 0.124999999999995, -8.760353553682876e-17],
        },
        ambientLight: {
            intensity: 0.38
        },
        directionalLight: {
            intensity: 0.38,
            position:[0,0,0]
        },
        fog: {
            color: '#cccccc',
            near: 0,
            far:5000
        }
    },
    8: {
        sky: {
            position:[0.7, 0.044999999999995, -8.760353553682876e-17],
        },
        ambientLight: {
            intensity: 0.27
        },
        directionalLight: {
            intensity: 0.28,
            position:[0,0,0]
        },
        fog: {
            color: '#555555',
            near: -300,
            far:5000
        }
    },
    9: {
        sky: {
            position:[0.7, -0.004999999999995, -8.760353553682876e-17],
        },
        ambientLight: {
            intensity: 0.1
        },
        directionalLight: {
            intensity: 0.2,
            position:[0,0,0]
        },
        fog: {
            color: '#444444',
            near: -600,
            far:9000
        }
    },
    10: {
        sky: {
            position:[0.7, -0.704999999999995, -8.760353553682876e-17],
        },
        ambientLight: {
            intensity: 0.08
        },
        directionalLight: {
            intensity: 0.2,
            position:[0,0,0]
        },
        fog: {
            color: '#000000',
            near: -6000,
            far:9000
        }
    },
    11: {
        sky: {
            position:[0.7, -2.604999999999995, -8.760353553682876e-17],
        },
        ambientLight: {
            intensity: 0.08
        },
        directionalLight: {
            intensity: 0.2,
            position:[0,0,0]
        },
        pointLight: {
            intensity: 5000,
        },
        fog: {
            color: '#000000',
            near: -30000,
            far:9000
        },  
    },
    12: {
        sky: {
            position:[0.7, -4.604999999999995, -8.760353553682876e-17],
        },
        stars: {
            speed:2,  
        },
        ambientLight: {
            intensity: 0.04
        },
        directionalLight: {
            intensity: 0.1,
            position:[0,0,0]
        },
        pointLight: {
            intensity: 5000,
        },
        fog: {
            color: '#000000',
            near: -40000,
            far:9000
        },
        
    }
}