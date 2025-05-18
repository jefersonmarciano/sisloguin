import auth from './auth';
import community from './community';
import profile from './profile';
import dashboard from './dashboard';
import notifications from './notifications';
import features from './features';
import support from './support';
import common from './common';

export default {
  ...auth,
  ...community,
  ...profile,
  ...dashboard,
  ...notifications,
  ...features,
  ...support,
  ...common,
}; 