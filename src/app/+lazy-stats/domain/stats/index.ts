import { createDomain } from 'ngrx-registry';

import './state';
import './actions';
import './queries';
// import './model';

import { reducer } from './reducer';

createDomain('stats', reducer);

