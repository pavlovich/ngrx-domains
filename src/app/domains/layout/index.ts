import { createDomain } from 'ngrx-registry';
import './state';
import './actions';
import './queries';

import { reducer } from './reducer';

createDomain('layout', reducer);

