import moment from 'moment';
import api from '../api';
import { loginUserFailure } from './auth';
import { push } from 'react-router-redux';

const FETCH_AIRCRAFTS_REQUEST = 'ba/data/FETCH_AIRCRAFTS_REQUEST';
const FETCH_AIRCRAFT_REQUEST = 'ba/data/FETCH_AIRCRAFT_REQUEST';
const SELECT_AIRCRAFT = 'ba/data/SELECT_AIRCRAFT';
const RECEIVE_AIRCRAFTS = 'ba/data/RECEIVE_AIRCRAFTS';
const RECEIVE_AIRCRAFT = 'ba/data/RECEIVE_AIRCRAFT';
const ADD_CYCLE = 'ba/data/ADD_CYCLE';
const CHANGE_CYCLES_DATE = 'ba/data/CHANGE_CYCLES_DATE';
const CHANGE_DEFECTS_DATE = 'ba/data/CHANGE_DEFECTS_DATE';

const initialState = {
    aircrafts: [],
    selectedAircraft: {
        aircraft: null,
        page: 1,
        limit: 0,
        cycles: {
            startDate: moment.utc().subtract(31, 'days').startOf('day').toDate(),
            endDate: moment.utc().endOf('day').toDate()
        },
        defects: {
            startDate: moment().subtract(31, 'days').startOf('day').toDate(),
            endDate: moment().endOf('day').toDate()
        }
    }
};

export default function data(state = initialState, action) {
    let selectedAircraft;
    switch (action.type) {
        case RECEIVE_AIRCRAFTS:
            return {...state, aircrafts: action.payload.data};
        case FETCH_AIRCRAFTS_REQUEST:
        case FETCH_AIRCRAFT_REQUEST:
            return {...state};
        case RECEIVE_AIRCRAFT:
            // const index = state.aircrafts.findIndex(aircraft => aircraft.tailNumber === action.payload.aircraft.tailNumber);
            // const aircrafts = [...state.aircrafts];
            // aircrafts.splice(index, 1, action.payload.aircraft);
            // selectedAircraft = state.selectedAircraft.aircraft && aircrafts.filter(aircraft => aircraft.tailNumber === state.selectedAircraft.aircraft.tailNumber)[0];
            return {...state, selectedAircraft: {...state.selectedAircraft, aircraft: action.payload.aircraft}};
        case SELECT_AIRCRAFT:
            return {...state, selectedAircraft: {...state.selectedAircraft, aircraft: action.payload}};
        case CHANGE_CYCLES_DATE:
            return {...state, selectedAircraft: {...state.selectedAircraft, cycles: {...state.selectedAircraft.cycles, ...action.payload}}};
        case CHANGE_DEFECTS_DATE:
            return {...state, selectedAircraft: {...state.selectedAircraft, defects: {...state.selectedAircraft.defects, ...action.payload}}};
        default:
            return state;
    }
}

export function receiveAircrafts(data) {
    return {
        type: RECEIVE_AIRCRAFTS,
        payload: {
            data: data
        }
    }
}

export function receiveAircraft(aircraft) {
    return {
        type: RECEIVE_AIRCRAFT,
        payload: {
            aircraft
        }
    }
}

export function fetchAircraftsRequest() {
    return {
        type: FETCH_AIRCRAFTS_REQUEST
    }
}

export function fetchAircraftRequest() {
    return {
        type: FETCH_AIRCRAFT_REQUEST
    }
}

export function selectAircraft(aircraft) {
    return dispatch => {
        dispatch({
            type: SELECT_AIRCRAFT,
            payload: aircraft
        });
        dispatch(fetchAircraft(aircraft.tailNumber));
    }
}

export function fetchAircrafts(token, defects=false) {
    return async dispatch => {
        dispatch(fetchAircraftsRequest());
        try {
            const response = await api.getAircrafts(token, defects);
            dispatch(receiveAircrafts(response.data));
        } catch (e) {
            console.log(e);
            if(e.response.status === 401 || e.response.status === 403) {
                dispatch(loginUserFailure(e));
                dispatch(push('/login'));
            }
        }
    }
}

export function fetchAircraft(aircraftId) {
    return async (dispatch, getState) => {
        dispatch(fetchAircraftRequest());
        try {
            const state = getState();
            const { token } = state.auth;
            const { cycles, defects } = state.data.selectedAircraft;
            const response = await api.getAircraft(token, aircraftId, {cycles, defects});
            dispatch(receiveAircraft(response));
        } catch (e) {
            console.error(e);
            if(e.response.status === 401 || e.response.status === 403) {
                dispatch(loginUserFailure(e));
                dispatch(push('/login'));
            }
        }
    }
}

export function addCycle(aircraft, cycle) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.addCycle(token, aircraft.tailNumber, cycle);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}

export function saveCycle(aircraft, cycle) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.saveCycle(token, aircraft.tailNumber, cycle);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}

export function deleteCycle(aircraft, cycle) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.deleteCycle(token, aircraft.tailNumber, cycle);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}

export function changeCyclesDate(data) {
    return async (dispatch, getState) => {
        try {
            const { selectedAircraft } = getState().data;
            dispatch({
                type: CHANGE_CYCLES_DATE,
                payload: data
            });
            dispatch(fetchAircraft(selectedAircraft.aircraft.tailNumber));
        } catch (e) {
            console.log(e);
        }
    }
}

export function addDefect(aircraft, defect) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.addDefect(token, aircraft.tailNumber, defect);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}

export function saveDefect(aircraft, defect) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.saveDefect(token, aircraft.tailNumber, defect);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}

export function deleteDefect(aircraft, defect) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.deleteDefect(token, aircraft.tailNumber, defect);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}

export function changeDefectsDate(data) {
    return async (dispatch, getState) => {
        try {
            const { selectedAircraft } = getState().data;
            dispatch({
                type: CHANGE_DEFECTS_DATE,
                payload: data
            });
            dispatch(fetchAircraft(selectedAircraft.aircraft.tailNumber));
        } catch (e) {
            console.log(e);
        }
    }
}

export function saveMaintenance(aircraft, maintenance) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.saveMaintenance(token, aircraft.tailNumber, maintenance);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}

export function saveInspection(aircraft, inspection) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.saveInspection(token, aircraft.tailNumber, inspection);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}

export function saveAircraft(aircraft, data) {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await api.updateAircraft(token, aircraft.tailNumber, data);
            dispatch(fetchAircraft(aircraft.tailNumber));
        } catch (e) {
            console.error(e);
        }
    }
}