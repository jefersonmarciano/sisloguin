import { nanoid } from 'nanoid';

// Types
export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  user: ChatUser;
  text: string;
  timestamp: Date;
  likes: number;
  isHighlighted?: boolean;
  language: 'en' | 'es';
}

// Random user pool with English names and avatars
const userPool: ChatUser[] = [
  { id: 'u1', name: 'John_Smith', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 'u2', name: 'Emily_Johnson', avatar: 'https://i.pravatar.cc/100?img=2' },
  { id: 'u3', name: 'Michael_Williams', avatar: 'https://i.pravatar.cc/100?img=3' },
  { id: 'u4', name: 'Sarah_Brown', avatar: 'https://i.pravatar.cc/100?img=4' },
  { id: 'u5', name: 'David_Jones', avatar: 'https://i.pravatar.cc/100?img=5' },
  { id: 'u6', name: 'Jessica_Garcia', avatar: 'https://i.pravatar.cc/100?img=6' },
  { id: 'u7', name: 'Christopher_Miller', avatar: 'https://i.pravatar.cc/100?img=7' },
  { id: 'u8', name: 'Amanda_Davis', avatar: 'https://i.pravatar.cc/100?img=8' },
  { id: 'u9', name: 'Matthew_Rodriguez', avatar: 'https://i.pravatar.cc/100?img=9' },
  { id: 'u10', name: 'Jennifer_Martinez', avatar: 'https://i.pravatar.cc/100?img=10' },
  { id: 'u11', name: 'Daniel_Hernandez', avatar: 'https://i.pravatar.cc/100?img=11' },
  { id: 'u12', name: 'Ashley_Lopez', avatar: 'https://i.pravatar.cc/100?img=12' },
  { id: 'u13', name: 'Robert_Wilson', avatar: 'https://i.pravatar.cc/100?img=13' },
  { id: 'u14', name: 'Laura_Anderson', avatar: 'https://i.pravatar.cc/100?img=14' },
  { id: 'u15', name: 'Kevin_Taylor', avatar: 'https://i.pravatar.cc/100?img=15' },
  { id: 'u16', name: 'Maria_Thomas', avatar: 'https://i.pravatar.cc/100?img=16' },
  { id: 'u17', name: 'James_White', avatar: 'https://i.pravatar.cc/100?img=17' },
  { id: 'u18', name: 'Sophia_Clark', avatar: 'https://i.pravatar.cc/100?img=18' },
  { id: 'u19', name: 'William_Lee', avatar: 'https://i.pravatar.cc/100?img=19' },
  { id: 'u20', name: 'Olivia_Walker', avatar: 'https://i.pravatar.cc/100?img=20' },
];

// Comments about the app in English
const commentTemplatesEN = [
  "I just won $2 in the Lucky Wheel! Anyone luckier?",
  "The app is so easy to use, I'm earning $10 daily now.",
  "Just made my first $50 withdrawal today! Super fast.",
  "Does anyone know how long it takes for payouts to hit your account?",
  "Started yesterday and already earned $15. Much better than other apps.",
  "How are you all investing the money you earn here?",
  "Just completed 30 product inspections. The reward is worth it.",
  "Product Inspector is my favorite task. Quick and pays well.",
  "Tip: Complete all daily tasks to maximize earnings.",
  "Just referred 5 friends and got bonuses for all of them!",
  "I'm saving up for a new phone just with what I earn here.",
  "Is anyone else having issues with the Lucky Wheel today?",
  "Best app of 2024 for earning extra income in your free time.",
  "Did 20 evaluations today and earned $8. Not bad for 30 minutes of work.",
  "How do you prefer to receive money? PayPal or direct deposit?",
  "I can now pay for my internet just with what I earn here monthly!",
  "Support responds super fast when I needed help.",
  "Who else is trying to meet the $15 daily goal?",
  "Just got a surprise bonus of $5!",
  "I can complete all tasks under an hour every day. Easy $15!",
  "Anyone else love competing in the Top 100 rankings?",
  "This app is actually legit. I was skeptical at first but now I'm convinced.",
  "Just hit my $100 milestone for the month!",
  "I'm buying my mom a birthday gift with my earnings this week.",
  "The product reviews are actually fun to do. I like learning about new items.",
  "Has anyone reached the VIP level yet? What are the benefits?",
  "My friend didn't believe I make money on here until I showed them my balance.",
  "The app works great even on my older phone, no lag!",
  "I'm earning about $300 a month just using this app during my commute.",
  "The Like For Money feature is so quick and satisfying to use.",
  "Just discovered you can earn bonus points on weekends!",
  "I'm amazed at how many different ways there are to earn in this app.",
  "I've tried 5 different money apps and this is the most reliable one.",
  "Made enough to pay for my dinner tonight. Thanks app!",
  "The interface is so intuitive, everything is where it should be.",
  "Love how fast the app loads compared to other earning platforms.",
  "Just upgraded to Gold tier. The extra daily tasks are worth it!",
  "The customer service helped me recover my account in just 10 minutes.",
  "Anyone else saving their earnings for Black Friday shopping?",
  "I recommend doing the product inspector tasks first thing in the morning.",
  "My wife thought this was a scam until I showed her my PayPal deposit!",
  "The app is available in so many countries. I got friends from abroad using it too.",
  "I love how you can cash out even small amounts instantly.",
  "Been using this app for 3 months and already earned enough for a new laptop!",
  "Does anyone know if there's a limit to how many tasks we can do per week?",
  "The referral program is so generous. $5 for each new user!",
  "Just reached level 10! The rewards keep getting better.",
  "I'm going to use this app to fund my vacation next summer.",
  "The community here is so helpful and supportive.",
  "Love seeing my earnings grow day by day in the stats dashboard.",
];

// Comments about the app in Spanish
const commentTemplatesES = [
  "¡Acabo de ganar $2 en la Rueda de la Suerte! ¿Alguien tuvo más suerte?",
  "La aplicación es muy fácil de usar, estoy ganando $10 diarios ahora.",
  "¡Acabo de hacer mi primer retiro de $50 hoy! Super rápido.",
  "¿Alguien sabe cuánto tiempo tarda en llegar el dinero a tu cuenta?",
  "Empecé ayer y ya gané $15. Mucho mejor que otras aplicaciones.",
  "¿Cómo están invirtiendo todos el dinero que ganan aquí?",
  "Acabo de completar 30 inspecciones de productos. La recompensa vale la pena.",
  "El Inspector de Productos es mi tarea favorita. Rápida y paga bien.",
  "Consejo: Completa todas las tareas diarias para maximizar ganancias.",
  "¡Acabo de referir a 5 amigos y obtuve bonos por todos ellos!",
  "Estoy ahorrando para un nuevo teléfono solo con lo que gano aquí.",
  "¿Alguien más tiene problemas con la Rueda de la Suerte hoy?",
  "La mejor aplicación de 2024 para ganar ingresos extra en tu tiempo libre.",
  "Hice 20 evaluaciones hoy y gané $8. No está mal por 30 minutos de trabajo.",
  "¿Cómo prefieren recibir el dinero? ¿PayPal o depósito directo?",
  "¡Ahora puedo pagar mi internet solo con lo que gano aquí mensualmente!",
  "El soporte responde súper rápido cuando necesité ayuda.",
  "¿Quién más está tratando de alcanzar la meta diaria de $15?",
  "¡Acabo de recibir un bono sorpresa de $5!",
  "Puedo completar todas las tareas en menos de una hora cada día. ¡Fácil $15!",
  "¿A alguien más le gusta competir en el ranking Top 100?",
  "Esta aplicación es realmente legítima. Estaba escéptico al principio pero ahora estoy convencido.",
  "¡Acabo de alcanzar mi meta de $100 para el mes!",
  "Le estoy comprando un regalo de cumpleaños a mi madre con mis ganancias de esta semana.",
  "Las reseñas de productos son realmente divertidas de hacer. Me gusta aprender sobre nuevos artículos.",
  "¿Alguien ha alcanzado el nivel VIP? ¿Cuáles son los beneficios?",
  "Mi amigo no creía que ganara dinero aquí hasta que le mostré mi balance.",
  "¡La aplicación funciona muy bien incluso en mi teléfono antiguo, sin retrasos!",
  "Estoy ganando alrededor de $300 al mes solo usando esta aplicación durante mi viaje diario.",
  "La función Me Gusta por Dinero es muy rápida y satisfactoria de usar.",
  "¡Acabo de descubrir que puedes ganar puntos extra los fines de semana!",
  "Me sorprende cuántas formas diferentes hay de ganar en esta aplicación.",
  "He probado 5 aplicaciones diferentes para ganar dinero y esta es la más confiable.",
  "Gané lo suficiente para pagar mi cena esta noche. ¡Gracias aplicación!",
  "La interfaz es muy intuitiva, todo está donde debería estar.",
  "Me encanta lo rápido que carga la aplicación en comparación con otras plataformas de ganancias.",
  "¡Acabo de actualizar al nivel Oro. Las tareas diarias extra valen la pena!",
  "El servicio al cliente me ayudó a recuperar mi cuenta en solo 10 minutos.",
  "¿Alguien más está guardando sus ganancias para las compras del Black Friday?",
  "Recomiendo hacer las tareas del inspector de productos a primera hora de la mañana.",
  "¡Mi esposa pensó que esto era una estafa hasta que le mostré mi depósito de PayPal!",
  "La aplicación está disponible en muchos países. Tengo amigos del extranjero usándola también.",
  "Me encanta cómo puedes retirar incluso pequeñas cantidades al instante.",
  "¡He estado usando esta aplicación durante 3 meses y ya gané lo suficiente para una nueva laptop!",
  "¿Alguien sabe si hay un límite de cuántas tareas podemos hacer por semana?",
  "El programa de referidos es muy generoso. ¡$5 por cada nuevo usuario!",
  "¡Acabo de alcanzar el nivel 10! Las recompensas siguen mejorando.",
  "Voy a usar esta aplicación para financiar mis vacaciones el próximo verano.",
  "La comunidad aquí es muy útil y solidaria.",
  "Me encanta ver cómo crecen mis ganancias día a día en el panel de estadísticas.",
];

// Keep track of which comments have been used
let usedCommentsEN: Set<number> = new Set();
let usedCommentsES: Set<number> = new Set();

// Function to get a random user from the pool
export const getRandomUser = (): ChatUser => {
  return userPool[Math.floor(Math.random() * userPool.length)];
};

// Function to get a unique comment from the templates
const getUniqueComment = (language: 'en' | 'es'): string => {
  const templates = language === 'en' ? commentTemplatesEN : commentTemplatesES;
  const usedComments = language === 'en' ? usedCommentsEN : usedCommentsES;
  
  // If all comments have been used, reset the tracking
  if (usedComments.size >= templates.length) {
    usedComments.clear();
  }
  
  // Find an unused index
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * templates.length);
  } while (usedComments.has(randomIndex));
  
  // Mark this index as used
  usedComments.add(randomIndex);
  
  // Store the updated set back to the appropriate variable
  if (language === 'en') {
    usedCommentsEN = usedComments;
  } else {
    usedCommentsES = usedComments;
  }
  
  return templates[randomIndex];
};

// Function to generate a random comment in either English or Spanish
export const generateRandomComment = (highlightChance = 0.3): ChatMessage => {
  const randomUser = getRandomUser();
  
  // Randomly select language
  const language = Math.random() > 0.5 ? 'en' : 'es';
  
  // Get a unique comment based on language
  const randomComment = getUniqueComment(language);
  
  const isHighlighted = Math.random() < highlightChance;
  
  return {
    id: nanoid(),
    user: randomUser,
    text: randomComment,
    timestamp: new Date(),
    likes: Math.floor(Math.random() * 20),
    isHighlighted,
    language
  };
};

// Function to generate multiple random comments with time spacing
export const generateMultipleComments = (count: number): ChatMessage[] => {
  const comments: ChatMessage[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomMinutesAgo = Math.floor(Math.random() * 60) + 1;
    const timestamp = new Date(Date.now() - randomMinutesAgo * 60 * 1000);
    
    comments.push({
      ...generateRandomComment(),
      timestamp
    });
  }
  
  // Sort by timestamp, newest first
  return comments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Function to get the total number of unique comments available
export const getTotalCommentCount = (): number => {
  return commentTemplatesEN.length + commentTemplatesES.length;
};
