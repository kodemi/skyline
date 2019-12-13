import { rootReducer } from '../ducks/reducer';
import thunk from 'redux-thunk';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';


export default function configureStore(baseHistory, initialState) {
    const routingMiddleware = routerMiddleware(baseHistory);
    const middlewares = [routingMiddleware, thunk];
    if (process.env.NODE_ENV === 'development') {
        const logger = require('redux-logger')();
        middlewares.push(logger);
    }

    const middleware = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        initialState,
        middleware
    );
    const history = syncHistoryWithStore(baseHistory, store);

    if (module.hot) {
        module.hot.accept('../ducks/reducer', () => {
			store.replaceReducer(rootReducer);
		});
    }

    return { store, history };
}