
import { RewardOption } from '../types';

export const rewardOptions: RewardOption[] = [
  {
    id: 'paypal',
    type: 'PayPal',
    minAmount: 5.00,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9iP3ucVciWoBcmMNY3u6riXzYCn0kEWEZuA&s',
    processingTime: '1-3 business days',
    description: 'Withdraw directly to your PayPal account'
  },
  {
    id: 'amazon',
    type: 'Amazon Gift Card',
    minAmount: 10.00,
    image: 'https://m.media-amazon.com/images/G/31/gc/designs/livepreview/a_for_amazon_default_child_noto_email_in-main._CB485944111_.png',
    processingTime: 'Instant delivery',
    description: 'Redeem for Amazon gift cards to shop online'
  },
  {
    id: 'temu',
    type: 'App Profit Gift Card',
    minAmount: 2.00,
    image: 'https://m.media-amazon.com/images/I/31ijebr0sWL.png',
    processingTime: 'Instant delivery',
    description: 'Use your earnings to shop on App Profit with bonus value'
  }
];
