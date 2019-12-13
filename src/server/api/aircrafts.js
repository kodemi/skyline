import moment from 'moment';
import { ObjectId } from 'mongodb';
import { User, Aircraft } from '../models';
import wkhtmltopdf from 'wkhtmltopdf';
import Handlebars from 'handlebars';
import fs from 'fs';

export async function getAircrafts (req, res) {
    const defects = req.query.defects || false;
    try {
        const aircrafts = await Aircraft.getAircrafts(defects); 
        res.json({data: aircrafts});   
    } catch (e) {
        res.status(502).json({message: e.message});
    }
}

export async function getAircraft (req, res) {
    const { tailNumber } = req.params;
    const { cyclesStartDate, cyclesEndDate, defectsStartDate, defectsEndDate } = req.query;
    try {
        const aircraft = await Aircraft.getAircraft(tailNumber, { cyclesStartDate, cyclesEndDate, defectsStartDate, defectsEndDate });
        if (!aircraft) {
            return res.sendStatus(404);
        }
        res.json(aircraft);
    } catch (e) {
        console.error(e);
        res.sendStatus(401);
    }
}

export async function updateAircraft (req, res) {
    const { tailNumber } = req.params;
    const data = req.body;
    try {
        await Aircraft.updateAircraft(tailNumber, data);
        res.json({});
    } catch (e) {
        console.log(e);
        res.status(400).json({message: e.message});
    }
}

export async function getAircraftCycles (req, res) {
    const { tailNumber } = req.params;
    const limit = parseInt(req.query.limit || Number.MAX_SAFE_INTEGER, 10);
    const page = parseInt(req.query.page || 1, 10);
    const dateBegin = req.query.dateBegin && new Date(req.query.dateBegin) || null;
    const dateEnd = req.query.dateEnd && moment(req.query.dateEnd).endOf('day').toDate() || moment().endOf('day').toDate();
    try {
        const cycles = await Aircraft.findCycles(tailNumber, dateBegin, dateEnd, page, limit);
        res.json(cycles);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function addAircraftCycle (req, res) {
    const { tailNumber } = req.params;
    const data = req.body;
    try {
        const aircraft = await Aircraft.findOne({tailNumber});
        const cycle = await aircraft.addCycle(data);
        res.status(201).json(cycle);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function getAircraftCycle (req, res) {
    const { tailNumber, cycleId } = req.params;
    try {
        const cycle = await Aircraft.findCycle(tailNumber, cycleId);
        if (!cycle) {
            return res.sendStatus(404);
        }
        res.json(cycle);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function updateAircraftCycle (req, res) {
    const { tailNumber, cycleId } = req.params;
    const data = req.body;
    // const _set = Object.keys(data).reduce((prev, key) => (prev['cycles.$.' + key] = data[key]) && prev, {});
    try {
        const aircraft = await Aircraft.findOne({tailNumber});
        await aircraft.updateCycle(cycleId, data);
        // await Aircraft.update({tailNumber, 'cycles._id': ObjectId(cycleId)}, {$set: {'cycles.$': data}, $currentDate: {'cycles.$.updatedAt': true}});
        res.json({});
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function deleteAircraftCycle (req, res) {
    const { tailNumber, cycleId } = req.params;
    try {
        const aircraft = await Aircraft.findOne({tailNumber});
        await aircraft.deleteCycle(cycleId, req.user);
        res.json({});
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function addAircraftDefect (req, res) {
    const { tailNumber } = req.params;
    const data = req.body;
    try {
        const aircraft = await Aircraft.findOne({tailNumber});
        const defect = await aircraft.addDefect(data);
        res.status(201).json(defect);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function getAircraftDefect (req, res) {
    const { tailNumber, defectId } = req.params;
    try { 
        const defect = await Aircraft.findDefect(tailNumber, defectId);
        if (!defect) {
            return res.sendStatus(404);
        }
        res.json(defect);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function updateAircraftDefect (req, res) {
    const { tailNumber, defectId } = req.params;
    const data = req.body;
    // const _set = Object.keys(data).reduce((prev, key) => (prev['cycles.$.' + key] = data[key]) && prev, {});
    try {
        const aircraft = await Aircraft.findOne({tailNumber});
        await aircraft.updateDefect(defectId, data);
        // await Aircraft.update({tailNumber, 'cycles._id': ObjectId(cycleId)}, {$set: {'cycles.$': data}, $currentDate: {'cycles.$.updatedAt': true}});
        res.json({});
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function deleteAircraftDefect (req, res) {
    const { tailNumber, defectId } = req.params;
    try {
        const aircraft = await Aircraft.findOne({tailNumber});
        await aircraft.deleteDefect(defectId, req.user);
        res.json({});
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function updateAircraftMaintenance (req, res) {
    const { tailNumber, maintenanceId } = req.params;
    const data = req.body;
    try {
        const aircraft = await Aircraft.findOne({tailNumber});
        await aircraft.updateMaintenance(maintenanceId, data);
        res.json({});
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function updateAircraftInspection (req, res) {
    const { tailNumber, inspectionId } = req.params;
    const data = req.body;
    try {
        const aircraft = await Aircraft.findOne({tailNumber});
        await aircraft.updateInspection(inspectionId, data);
        res.json({});
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

export async function getReport (req, res) {
    const { tailNumber } = req.params;
    try {
        const reportTpl = fs.readFileSync(__dirname + '/report.hbs', 'utf-8');
        const template = Handlebars.compile(reportTpl);
        const aircraft = (await Aircraft.findOne({tailNumber})).toObject();
        const reportDate = moment();
        const dateFormat = 'DD.MM.YYYY';
        aircraft.tsn = aircraft.tsn.toFixed(2);
        aircraft.dos = moment(aircraft.dos).format(dateFormat);
        aircraft.dom = moment(aircraft.dom).format(dateFormat);
        aircraft.inspections = aircraft.inspections.map(inspection => {
            inspection.nextDue.date = inspection.nextDue.date && moment(inspection.nextDue.date).format(dateFormat);
            inspection.remaining.hours = inspection.remaining.hours && inspection.remaining.hours.toFixed(2);
            inspection.lastCompliance.date = inspection.lastCompliance.date && moment(inspection.lastCompliance.date).format(dateFormat);
            return inspection;
        });
        const context = {
            reportDate: reportDate.format(dateFormat),
            aircraft
        };
        const html = template(context);
        // res.send(html).end();
        const filename = `Status_${tailNumber}.pdf`;
        res.setHeader('Content-disposition', `inline; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        wkhtmltopdf(html).pipe(res);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}