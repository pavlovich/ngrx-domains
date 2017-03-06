import { createDomain } from 'ngrx-registry';
import './state';
import './actions';
import './queries';

import { reducer } from './reducer';

createDomain('collection', reducer);

export { CollectionEffects } from './effects';
