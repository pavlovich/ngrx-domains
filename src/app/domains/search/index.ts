import { createDomain } from 'ngrx-registry';
import './state';
import './queries';

import { reducer } from './reducer';

createDomain('search', reducer);

