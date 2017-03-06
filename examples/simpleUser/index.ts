import { createDomain } from 'ngrx-registry';
import './Model';
import './State';
import './Actions';
import './Queries';

import { reducer } from './reducer';

// publish the reducer
createDomain('simpleUser', reducer);
