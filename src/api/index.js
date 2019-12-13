import { checkHttpStatus, parseJSON } from '../utils';
import jwtDecode from 'jwt-decode';
import config from '../../config';
import moment from 'moment';
import queryString from 'query-string';

const API_ROOT = config.API_ROOT;

export const authenticate = (creds) => {
    return fetch(`${API_ROOT}/api/authenticate/`, {
        method: 'post',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: creds.username,
            password: creds.password
        })
    })
        .then(checkHttpStatus)
        .then(parseJSON)
        .then((response) => {
            const decoded = jwtDecode(response.token);
            return response;
        });
};

export function getAircrafts(token, defects = false) {
    // return new Promise(resolve => resolve(TEST_DATA));
    const q = defects ? '?defects=1' : '';
    return fetch(`${API_ROOT}/api/aircrafts${q}`, {
        credentials: 'include',
        headers: {
            'x-access-token': token
        }
    })
        .then(checkHttpStatus)
        .then(parseJSON);
}

export function getAircraft(token, tailNumber, options) {
    const cyclesStartDate =
        options.cycles.startDate && moment(options.cycles.startDate).format();
    const cyclesEndDate =
        options.cycles.endDate && moment(options.cycles.endDate).format();
    const defectsStartDate =
        options.defects.startDate && moment(options.defects.startDate).format();
    const defectsEndDate =
        options.defects.endDate && moment(options.defects.endDate).format();
    const q = queryString.stringify(
        { cyclesStartDate, cyclesEndDate, defectsStartDate, defectsEndDate },
        { encode: false }
    );
    return fetch(`${API_ROOT}/api/aircrafts/${tailNumber}?${q}`, {
        credentials: 'include',
        headers: {
            'x-access-token': token
        }
    })
        .then(checkHttpStatus)
        .then(parseJSON);
}

function updateAircraft(token, tailNumber, data) {
    return fetch(`${API_ROOT}/api/aircrafts/${tailNumber}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(checkHttpStatus)
        .then(parseJSON);
}

export async function addCycle(token, tailNumber, cycle) {
    const takeoffDate = moment.utc(cycle.takeoffDate);
    const takeoffTime = moment.utc(cycle.takeoffTime);
    const data = {
        takeoff: takeoffDate
            .set('hour', takeoffTime.hour())
            .set('minute', takeoffTime.minute())
            .toDate(),
        flightTime: (cycle.hours || 0) * 3600 + (cycle.minutes || 0) * 60,
        departureAirport: cycle.departureAirport,
        arrivalAirport: cycle.arrivalAirport
    };
    return fetch(`${API_ROOT}/api/aircrafts/${tailNumber}/cycles`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(checkHttpStatus)
        .then(parseJSON);
}

export async function saveCycle(token, tailNumber, cycle) {
    const takeoffDate = moment.utc(cycle.takeoffDate);
    const takeoffTime = moment.utc(cycle.takeoffTime);
    const data = {
        takeoff: takeoffDate
            .set('hour', takeoffTime.hour())
            .set('minute', takeoffTime.minute())
            .toDate(),
        flightTime: (cycle.hours || 0) * 3600 + (cycle.minutes || 0) * 60,
        arrivalAirport: cycle.arrivalAirport,
        departureAirport: cycle.departureAirport
    };
    return fetch(`${API_ROOT}/api/aircrafts/${tailNumber}/cycles/${cycle.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(checkHttpStatus)
        .then(parseJSON);
}

export async function deleteCycle(token, tailNumber, cycle) {
    return fetch(`${API_ROOT}/api/aircrafts/${tailNumber}/cycles/${cycle.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        }
    })
        .then(checkHttpStatus)
        .then(parseJSON);
}

export async function addDefect(token, tailNumber, defect) {
    const defectDate = moment.utc(defect.defectDate);
    const defectTime = moment.utc(defect.defectTime);
    const resolveBeforeDate = moment.utc(defect.resolveBefore);
    const resolveBeforeTime = moment.utc(defect.resolveBeforeTime);
    const resolveDate = moment.utc(defect.resolveDate);
    const resolveTime = moment.utc(defect.resolveTime);
    const data = {
        ...defect,
        defectDate: defectDate
            .set('hour', defectTime.hour())
            .set('minute', defectTime.minute())
            .toDate(),
        resolveBefore: resolveBeforeDate
            .set('hour', resolveBeforeTime.hour())
            .set('minute', resolveBeforeTime.minute())
            .toDate(),
        resolveDate: resolveDate
            .set('hour', resolveTime.hour())
            .set('minute', resolveTime.minute())
            .toDate()
    };
    return fetch(`${API_ROOT}/api/aircrafts/${tailNumber}/defects`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(checkHttpStatus)
        .then(parseJSON);
}

export async function saveDefect(token, tailNumber, defect) {
    const defectDate = moment.utc(defect.defectDate);
    const defectTime = moment.utc(defect.defectTime);
    const resolveBeforeDate = moment.utc(defect.resolveBefore);
    const resolveBeforeTime = moment.utc(defect.resolveBeforeTime);
    const resolveDate = moment.utc(defect.resolveDate);
    const resolveTime = moment.utc(defect.resolveTime);
    const data = {
        ...defect,
        defectDate: defectDate
            .set('hour', defectTime.hour())
            .set('minute', defectTime.minute())
            .toDate(),
        resolveBefore: resolveBeforeDate
            .set('hour', resolveBeforeTime.hour())
            .set('minute', resolveBeforeTime.minute())
            .toDate(),
        resolveDate: resolveDate
            .set('hour', resolveTime.hour())
            .set('minute', resolveTime.minute())
            .toDate()
    };
    return fetch(
        `${API_ROOT}/api/aircrafts/${tailNumber}/defects/${defect.id}`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    )
        .then(checkHttpStatus)
        .then(parseJSON);
}

export async function deleteDefect(token, tailNumber, defect) {
    return fetch(
        `${API_ROOT}/api/aircrafts/${tailNumber}/defects/${defect.id}`,
        {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        }
    )
        .then(checkHttpStatus)
        .then(parseJSON);
}

export async function saveMaintenance(token, tailNumber, maintenance) {
    return fetch(
        `${API_ROOT}/api/aircrafts/${tailNumber}/maintenances/${
            maintenance._id
        }`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(maintenance)
        }
    )
        .then(checkHttpStatus)
        .then(parseJSON);
}

export async function saveInspection(token, tailNumber, inspection) {
    return fetch(
        `${API_ROOT}/api/aircrafts/${tailNumber}/inspections/${inspection._id}`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inspection)
        }
    )
        .then(checkHttpStatus)
        .then(parseJSON);
}

const api = {
    authenticate,
    getAircrafts,
    getAircraft,
    updateAircraft,
    addCycle,
    saveCycle,
    deleteCycle,
    addDefect,
    saveDefect,
    deleteDefect,
    saveMaintenance,
    saveInspection
};

export default api;
