
import { MultiLanguageProduct } from './types';

export const mockProducts: MultiLanguageProduct[] = [
  {
    id: '1',
    price: 24.99,
    issues: [],
    en: {
      name: 'Flameless Lamp for Living Room Decor - 3D Night Light',
      description: 'Modern 3D illusion night light with multiple color options and remote control for bedroom or living room decoration',
      question: 'Does this product have any sharp edges or hot surfaces that could cause burns?',
      image: 'https://i.ibb.co/PZ2dzPV5/Flameless-Lamp-for-Living-Room-Decor-3-D-Night-Light.png',
    },
    es: {
      name: 'Lámpara sin llama para decoración de sala de estar - Luz nocturna 3D',
      description: 'Luz nocturna de ilusión 3D moderna con múltiples opciones de color y control remoto para decoración de dormitorio o sala de estar',
      question: '¿Este producto tiene bordes afilados o superficies calientes que puedan causar quemaduras?',
      image: 'https://i.ibb.co/PZ2dzPV5/Flameless-Lamp-for-Living-Room-Decor-3-D-Night-Light.png',
    }
  },
  {
    id: '2',
    price: 19.99,
    issues: [],
    en: {
      name: '3D LED Lamp CSGO Gaming Room Decoration',
      description: 'LED gaming-themed night light with 16 colors and touch control for gaming setup decoration',
      question: 'Is this product suitable for children under 12 years old?',
      image: 'https://i.ibb.co/0yNcP34q/3D-LED-Lamp-CSGO-Gaming-Room-Decoration.png',
    },
    es: {
      name: 'Lámpara LED 3D CSGO Decoración para sala de juegos',
      description: 'Luz nocturna LED temática de juegos con 16 colores y control táctil para decoración de configuración de juegos',
      question: '¿Este producto es adecuado para niños menores de 12 años?',
      image: 'https://i.ibb.co/0yNcP34q/3D-LED-Lamp-CSGO-Gaming-Room-Decoration.png',
    }
  },
  {
    id: '3',
    price: 5.99,
    issues: [],
    en: {
      name: 'Kitchen Accessories: Banana, Fruit and Vegetable Cutter',
      description: 'Handy kitchen tool for slicing bananas, fruits and vegetables quickly and evenly',
      question: 'Does this product contain any parts that could pose a choking hazard?',
      image: 'https://i.ibb.co/G4r0j1V4/Kitchen-Accessories-Banana-Fruit-and-Vegetable-Cutter.png',
    },
    es: {
      name: 'Accesorios de Cocina: Cortador de Plátanos, Frutas y Verduras',
      description: 'Útil herramienta de cocina para cortar plátanos, frutas y verduras de manera rápida y uniforme',
      question: '¿Este producto contiene alguna pieza que pueda representar un riesgo de asfixia?',
      image: 'https://i.ibb.co/G4r0j1V4/Kitchen-Accessories-Banana-Fruit-and-Vegetable-Cutter.png',
    }
  },
  {
    id: '4',
    price: 29.99,
    issues: ['Sharp blades pose cutting hazard'],
    en: {
      name: 'Men\'s Hair Clipper Zero Gap DLC T-Blade',
      description: 'Professional hair trimmer with precision T-blade for clean cuts and detailed styling',
      question: 'Are there any safety concerns with the sharp blades on this product?',
      image: 'https://i.ibb.co/MDSLwXNj/Men-s-Hair-Clipper-Zero-Gap-DLC-T-Blade.png',
    },
    es: {
      name: 'Cortadora de Pelo para Hombres Cuchilla en T DLC Gap Cero',
      description: 'Recortadora de pelo profesional con cuchilla en T de precisión para cortes limpios y peinados detallados',
      question: '¿Hay algún problema de seguridad con las cuchillas afiladas de este producto?',
      image: 'https://i.ibb.co/MDSLwXNj/Men-s-Hair-Clipper-Zero-Gap-DLC-T-Blade.png',
    }
  },
  {
    id: '5',
    price: 12.99,
    issues: [],
    en: {
      name: 'Ski Balaclava - Winter Face Mask',
      description: 'Full face protection mask for winter sports and outdoor activities with breathable material',
      question: 'Is there any risk of suffocation or breathing restriction with this face covering?',
      image: 'https://i.ibb.co/BHjm70FS/Ski-Balaclava-Winter-Face-Mask.png',
    },
    es: {
      name: 'Pasamontañas para Esquí - Máscara Facial de Invierno',
      description: 'Máscara de protección facial completa para deportes de invierno y actividades al aire libre con material transpirable',
      question: '¿Existe algún riesgo de asfixia o restricción respiratoria con esta cubierta facial?',
      image: 'https://i.ibb.co/BHjm70FS/Ski-Balaclava-Winter-Face-Mask.png',
    }
  },
  {
    id: '6',
    price: 34.99,
    issues: ['Small parts pose choking hazard for children under 3'],
    en: {
      name: 'Strong Battery with Watchtower - Military Scene',
      description: 'Detailed military base construction set with watchtower and mini figurines for collectors',
      question: 'Are there any small parts that could be hazardous for young children?',
      image: 'https://i.ibb.co/7NCXZfnw/Strong-Battery-with-Watchtower-Military-Scene.png',
    },
    es: {
      name: 'Batería Fuerte con Torre de Vigilancia - Escena Militar',
      description: 'Set de construcción de base militar detallado con torre de vigilancia y mini figuritas para coleccionistas',
      question: '¿Hay piezas pequeñas que podrían ser peligrosas para niños pequeños?',
      image: 'https://i.ibb.co/7NCXZfnw/Strong-Battery-with-Watchtower-Military-Scene.png',
    }
  },
  {
    id: '7',
    price: 45.99,
    issues: ['Small parts pose choking hazard for young children'],
    en: {
      name: 'High-Tech Car Building Blocks MOULD KING for Kids',
      description: 'Advanced technical building blocks set for constructing model cars with functioning parts',
      question: 'Is this product age-appropriate for a 4-year-old child?',
      image: 'https://i.ibb.co/7dzkjyLd/High-Tech-Car-Building-Blocks-MOULD-KING-for-Kids.png',
    },
    es: {
      name: 'Bloques de Construcción de Autos Técnicos MOULD KING para Niños',
      description: 'Set avanzado de bloques de construcción técnicos para construir modelos de autos con partes funcionales',
      question: '¿Este producto es apropiado para la edad de un niño de 4 años?',
      image: 'https://i.ibb.co/7dzkjyLd/High-Tech-Car-Building-Blocks-MOULD-KING-for-Kids.png',
    }
  },
  {
    id: '8',
    price: 39.99,
    issues: [],
    en: {
      name: 'Imperial Military Carriage - Medieval Model',
      description: 'Historical medieval building block set featuring imperial carriage with detailed components',
      question: 'Are the edges of the building blocks smoothed to prevent injury?',
      image: 'https://i.ibb.co/RTS59jxg/Imperial-Military-Carriage-Medieval-Model.png',
    },
    es: {
      name: 'Carruaje Militar Imperial - Modelo Medieval',
      description: 'Set de bloques de construcción medieval histórico con carruaje imperial y componentes detallados',
      question: '¿Los bordes de los bloques de construcción están suavizados para prevenir lesiones?',
      image: 'https://i.ibb.co/RTS59jxg/Imperial-Military-Carriage-Medieval-Model.png',
    }
  },
  {
    id: '9',
    price: 8.99,
    issues: ['Extremely sharp blade poses cutting hazard'],
    en: {
      name: 'Utility Knife SK5 Carbon Steel with Retractable Case',
      description: 'Professional utility knife with SK5 carbon steel blade and safety retractable mechanism',
      question: 'Does this knife have adequate safety features to prevent accidental cutting?',
      image: 'https://i.ibb.co/BHF64j2y/Utility-Knife-SK5-Carbon-Steel-with-Retractable-Case.png',
    },
    es: {
      name: 'Cuchillo Utilitario SK5 de Acero al Carbono con Estuche Retráctil',
      description: 'Cuchillo utilitario profesional con hoja de acero al carbono SK5 y mecanismo retráctil de seguridad',
      question: '¿Este cuchillo tiene características de seguridad adecuadas para prevenir cortes accidentales?',
      image: 'https://i.ibb.co/BHF64j2y/Utility-Knife-SK5-Carbon-Steel-with-Retractable-Case.png',
    }
  },
  {
    id: '10',
    price: 4.99,
    issues: ['Sharp blade poses cutting hazard'],
    en: {
      name: 'Everyday Cutting Knife',
      description: 'General purpose cutter with replaceable blades for everyday household use',
      question: 'Is there a child safety lock on this cutting tool?',
      image: 'https://i.ibb.co/YF3Pn8hK/Everyday-Cutting-Knife.png',
    },
    es: {
      name: 'Cuchillo de Corte para Uso Diario',
      description: 'Cortador de propósito general con cuchillas reemplazables para uso doméstico cotidiano',
      question: '¿Hay un seguro para niños en esta herramienta de corte?',
      image: 'https://i.ibb.co/YF3Pn8hK/Everyday-Cutting-Knife.png',
    }
  },
  {
    id: '11',
    price: 69.99,
    issues: ['Extremely sharp edge poses severe cutting hazard'],
    en: {
      name: 'Damascus Steel Kitchen Knife - Ultra Sharp Blade',
      description: 'Premium kitchen knife with Damascus patterned steel and ergonomic handle for professional cooking',
      question: 'Does this knife come with a protective sheath or storage solution?',
      image: 'https://i.ibb.co/cc0pw5hk/Damascus-Steel-Kitchen-Knife-Ultra-Sharp-Blade.png',
    },
    es: {
      name: 'Cuchillo de Cocina de Acero Damasco - Hoja Ultra Afilada',
      description: 'Cuchillo de cocina premium con acero con patrón de Damasco y mango ergonómico para cocina profesional',
      question: '¿Este cuchillo viene con una funda protectora o solución de almacenamiento?',
      image: 'https://i.ibb.co/cc0pw5hk/Damascus-Steel-Kitchen-Knife-Ultra-Sharp-Blade.png',
    }
  },
  {
    id: '12',
    price: 89.99,
    issues: ['Extremely sharp edge poses severe cutting hazard'],
    en: {
      name: 'Damascus Steel Kitchen Knife',
      description: 'High-end kitchen knife with Damascus steel pattern and hardwood handle for superior cutting performance',
      question: 'What safety precautions should be taken when handling this knife?',
      image: 'https://i.ibb.co/xqjjKk1k/Damascus-Steel-Kitchen-Knife.png',
    },
    es: {
      name: 'Cuchillo de Cocina de Acero Damasco',
      description: 'Cuchillo de cocina de alta gama con patrón de acero Damasco y mango de madera dura para un rendimiento de corte superior',
      question: '¿Qué precauciones de seguridad deben tomarse al manipular este cuchillo?',
      image: 'https://i.ibb.co/xqjjKk1k/Damascus-Steel-Kitchen-Knife.png',
    }
  },
  {
    id: '13',
    price: 7.99,
    issues: [],
    en: {
      name: '3-in-1 Avocado Slicer',
      description: 'Multi-function avocado tool for pit removal, slicing and scooping in one convenient tool',
      question: 'Are any parts of this tool sharp enough to cause injury?',
      image: 'https://i.ibb.co/4nTZ0gQk/3-in-1-Avocado-Slicer.png',
    },
    es: {
      name: 'Cortador de Aguacate 3 en 1',
      description: 'Herramienta multifunción para aguacate para remover el hueso, cortar y extraer la pulpa en una herramienta conveniente',
      question: '¿Alguna parte de esta herramienta es lo suficientemente afilada para causar lesiones?',
      image: 'https://i.ibb.co/4nTZ0gQk/3-in-1-Avocado-Slicer.png',
    }
  },
  {
    id: '14',
    price: 24.99,
    issues: ['Sharp blade edges pose cutting hazard'],
    en: {
      name: 'Multifunctional Domestic Table Slicer',
      description: 'Adjustable kitchen mandoline slicer with multiple thickness settings for vegetables and fruits',
      question: 'Does this slicer include finger protection or safety guards?',
      image: 'https://i.ibb.co/BVhtCqMq/Multifunctional-Domestic-Table-Slicer.png',
    },
    es: {
      name: 'Cortador de Mesa Doméstico Multifuncional',
      description: 'Cortadora mandolina de cocina ajustable con múltiples configuraciones de grosor para verduras y frutas',
      question: '¿Este cortador incluye protección para los dedos o protectores de seguridad?',
      image: 'https://i.ibb.co/BVhtCqMq/Multifunctional-Domestic-Table-Slicer.png',
    }
  },
  {
    id: '15',
    price: 42.99,
    issues: ['Small parts pose choking hazard for young children'],
    en: {
      name: 'Airbus H175 Rescue Helicopter - Educational Model for Kids',
      description: 'Detailed rescue helicopter building set with functioning rotor and rescue accessories',
      question: 'Is this helicopter model appropriate for children under 5 years?',
      image: 'https://i.ibb.co/23gpR88q/Airbus-H175-Rescue-Helicopter-Educational-Model-for-Kids.png',
    },
    es: {
      name: 'Helicóptero de Rescate Airbus H175 - Modelo Educativo para Niños',
      description: 'Set de construcción de helicóptero de rescate detallado con rotor funcional y accesorios de rescate',
      question: '¿Este modelo de helicóptero es apropiado para niños menores de 5 años?',
      image: 'https://i.ibb.co/23gpR88q/Airbus-H175-Rescue-Helicopter-Educational-Model-for-Kids.png',
    }
  }
];
