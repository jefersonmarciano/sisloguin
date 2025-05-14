
import { FAQItem } from '../types';

// FAQ data with translations
const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: {
      en: 'How do I start earning money on this platform?',
      es: '¿Cómo puedo empezar a ganar dinero en esta plataforma?'
    },
    answer: {
      en: 'Getting started is easy! You can earn money through three main activities: (1) "Like for Money" - review products and earn $3.75-$5.50 per review, (2) "Product Inspector" - inspect products for safety issues and earn $3.25-$6.50 per inspection, and (3) "Lucky Wheel" - spin the wheel daily for chances to win up to $100 per spin. Simply click on any of these activities from the home page to begin earning immediately!',
      es: '¡Comenzar es fácil! Puedes ganar dinero a través de tres actividades principales: (1) "Me gusta por dinero" - revisa productos y gana $3.75-$5.50 por revisión, (2) "Inspector de productos" - inspecciona productos por problemas de seguridad y gana $3.25-$6.50 por inspección, y (3) "Rueda de la suerte" - gira la rueda diariamente para tener la oportunidad de ganar hasta $100 por giro. ¡Simplemente haz clic en cualquiera de estas actividades desde la página de inicio para comenzar a ganar inmediatamente!'
    }
  },
  {
    id: 'faq-2',
    question: {
      en: 'How and when can I withdraw my earnings?',
      es: '¿Cómo y cuándo puedo retirar mis ganancias?'
    },
    answer: {
      en: 'You can withdraw your earnings once you reach the minimum threshold of $10. To withdraw, go to the "Rewards" section in the app and choose your preferred payment method (PayPal, bank transfer, or gift cards). Processing typically takes 1-3 business days. There\'s no maximum limit on withdrawals, and you can track all your withdrawal history in the "Rewards" section.',
      es: 'Puedes retirar tus ganancias una vez que alcances el umbral mínimo de $10. Para retirar, ve a la sección "Recompensas" en la aplicación y elige tu método de pago preferido (PayPal, transferencia bancaria o tarjetas de regalo). El procesamiento generalmente toma de 1 a 3 días hábiles. No hay límite máximo en los retiros, y puedes seguir todo tu historial de retiros en la sección "Recompensas".'
    }
  },
  {
    id: 'faq-3',
    question: {
      en: 'Are there daily limits on earning activities?',
      es: '¿Hay límites diarios en las actividades de ganancia?'
    },
    answer: {
      en: 'Yes, there are daily limits to ensure platform sustainability: (1) Like for Money: 20 product reviews per day, (2) Product Inspector: 15 inspections per day, (3) Lucky Wheel: 3 spins per day. These limits reset at midnight UTC. The app shows countdowns when you reach your daily limits and notifies you when new tasks become available. This structure ensures consistent earning opportunities for all users.',
      es: 'Sí, hay límites diarios para garantizar la sostenibilidad de la plataforma: (1) Me gusta por dinero: 20 revisiones de productos por día, (2) Inspector de productos: 15 inspecciones por día, (3) Rueda de la suerte: 3 giros por día. Estos límites se restablecen a medianoche UTC. La aplicación muestra cuentas regresivas cuando alcanzas tus límites diarios y te notifica cuando nuevas tareas están disponibles. Esta estructura garantiza oportunidades de ganancia consistentes para todos los usuarios.'
    }
  },
  {
    id: 'faq-4',
    question: {
      en: 'What makes a good product review or inspection?',
      es: '¿Qué hace una buena revisión o inspección de producto?'
    },
    answer: {
      en: 'For effective product reviews and inspections: (1) Be honest and detailed in your assessment, (2) For safety inspections, look for actual concerns like sharp edges, small parts, or toxic materials, (3) Write at least 50 characters in your feedback, (4) Focus on the product\'s quality, functionality, and safety rather than just price, (5) Complete each review within the allotted time (usually 30 seconds). Higher quality reviews improve your accuracy rating and maximize your earnings.',
      es: 'Para revisiones e inspecciones efectivas de productos: (1) Sé honesto y detallado en tu evaluación, (2) Para inspecciones de seguridad, busca preocupaciones reales como bordes afilados, piezas pequeñas o materiales tóxicos, (3) Escribe al menos 50 caracteres en tus comentarios, (4) Concéntrate en la calidad, funcionalidad y seguridad del producto en lugar de solo en el precio, (5) Completa cada revisión dentro del tiempo asignado (generalmente 30 segundos). Las revisiones de mayor calidad mejoran tu calificación de precisión y maximizan tus ganancias.'
    }
  },
  {
    id: 'faq-5',
    question: {
      en: 'How does the earnings tracking system work?',
      es: '¿Cómo funciona el sistema de seguimiento de ganancias?'
    },
    answer: {
      en: 'Your earnings are tracked automatically and updated in real-time. Every completed activity (product review, inspection, or lucky wheel spin) immediately adds to your balance. Visit the "Earnings" section to see detailed breakdowns by day, week, or month, complete with charts showing your earning patterns. You can also see transaction history with timestamps for every payment received. The system stores your complete earning history for transparency and record-keeping.',
      es: 'Tus ganancias se rastrean automáticamente y se actualizan en tiempo real. Cada actividad completada (revisión de producto, inspección o giro de rueda de la suerte) se agrega inmediatamente a tu saldo. Visita la sección "Ganancias" para ver desgloses detallados por día, semana o mes, completos con gráficos que muestran tus patrones de ganancia. También puedes ver el historial de transacciones con marcas de tiempo para cada pago recibido. El sistema almacena tu historial completo de ganancias para transparencia y mantenimiento de registros.'
    }
  },
  {
    id: 'faq-6',
    question: {
      en: 'How is my payment security ensured?',
      es: '¿Cómo se garantiza la seguridad de mis pagos?'
    },
    answer: {
      en: 'We prioritize the security of your earnings and personal information through multiple measures: (1) All financial transactions use bank-level encryption and security protocols, (2) We never store your complete payment details on our servers, (3) We partner with trusted payment processors like PayPal and Stripe for secure withdrawals, (4) Our system has automated fraud detection to protect your account from unauthorized access, (5) We conduct regular security audits to identify and fix any vulnerabilities. If you notice any suspicious activity, please contact our support team immediately.',
      es: 'Priorizamos la seguridad de tus ganancias e información personal a través de múltiples medidas: (1) Todas las transacciones financieras utilizan encriptación de nivel bancario y protocolos de seguridad, (2) Nunca almacenamos tus datos completos de pago en nuestros servidores, (3) Nos asociamos con procesadores de pago confiables como PayPal y Stripe para retiros seguros, (4) Nuestro sistema tiene detección automatizada de fraude para proteger tu cuenta de accesos no autorizados, (5) Realizamos auditorías de seguridad regulares para identificar y corregir cualquier vulnerabilidad. Si notas alguna actividad sospechosa, por favor contacta a nuestro equipo de soporte inmediatamente.'
    }
  },
];

export default faqs;

