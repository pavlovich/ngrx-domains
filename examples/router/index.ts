import { routerReducer } from '@ngrx/router-store';
import { createDomain } from 'ngrx-registry';
import './State';
import './Actions';


createDomain('router', routerReducer);


