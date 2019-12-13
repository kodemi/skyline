import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import { requireAuthentication } from '../utils';
import { App, AircraftsView, AircraftView, LoginView, DashboardView } from '../containers';

export default(
    <Route path='/' component={App}>
        <IndexRedirect to="aircrafts" />      
        <Route path='aircrafts' component={requireAuthentication(AircraftsView)} />
        <Route path='aircrafts/:aircraftId' component={AircraftView} />
        <Route path='dashboard' component={DashboardView} />
        <Route path='login' component={LoginView} />
    </Route>
);