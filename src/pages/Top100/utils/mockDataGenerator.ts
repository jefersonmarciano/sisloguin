
import { TopUser, Withdrawal } from '../../../types/top100';

// Generate mock data for top 100 users
export const generateTopUsers = (): TopUser[] => {
  const countries = ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP', 'BR', 'MX', 'CN', 'KR', 'IN', 'RU'];
  const cities = {
    'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'CA': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
    'UK': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
    'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'DE': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza'],
    'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo'],
    'JP': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
    'BR': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
    'MX': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
    'CN': ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Chengdu'],
    'KR': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon'],
    'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    'RU': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan']
  };
  
  // Generate registration dates between 1 and 365 days ago
  const getRandomRegistrationDate = () => {
    const daysAgo = Math.floor(Math.random() * 365) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };
  
  // Generate random withdrawals with amounts relative to user earnings
  const generateWithdrawals = (userId: string, earnings: number): Withdrawal[] => {
    const count = Math.max(1, Math.floor(Math.random() * 5)); 
    
    const maxWithdrawalPercent = 0.3;
    const minWithdrawalPercent = 0.05;
    
    return Array.from({ length: count }, (_, i) => {
      const minAmount = Math.max(5, Math.floor(earnings * minWithdrawalPercent));
      const maxAmount = Math.min(500, Math.floor(earnings * maxWithdrawalPercent));
      
      const amount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
      
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      let status: 'completed' | 'pending';
      status = Math.random() < 0.8 ? 'completed' : 'pending';
      
      return {
        id: `w${userId}-${i}`,
        userId,
        amount,
        status: status,
        createdAt: date
      };
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };
  
  return Array.from({ length: 100 }, (_, i) => {
    const id = (i + 1).toString();
    const countryIndex = i % countries.length;
    const country = countries[countryIndex];
    const cityIndex = i % cities[country].length;
    const city = cities[country][cityIndex];
    const level = Math.floor(Math.random() * 10) + 1;
    
    let earnings;
    
    if (i < 3) {
      earnings = Math.floor(Math.random() * (30000 - 20000)) + 20000;
    } else if (i < 10) {
      earnings = Math.floor(Math.random() * (20000 - 15000)) + 15000;
    } else if (i < 20) {
      earnings = Math.floor(Math.random() * (15000 - 10000)) + 10000;
    } else if (i < 50) {
      earnings = Math.floor(Math.random() * (10000 - 5000)) + 5000;
    } else {
      earnings = Math.floor(Math.random() * (5000 - 1000)) + 1000;
    }
    
    return {
      id,
      rank: i + 1,
      name: `User${1000 + i}`,
      avatar: `https://i.pravatar.cc/150?u=${i}`,
      earnings,
      country,
      location: `${city}, ${country}`,
      registrationDate: getRandomRegistrationDate(),
      level,
      withdrawals: generateWithdrawals(id, earnings)
    };
  });
};
