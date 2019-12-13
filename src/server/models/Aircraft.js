import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import moment from 'moment';
import { ObjectId } from 'mongodb';

const cycleSchema = new mongoose.Schema({
    takeoff: Date,
    flightTime: Number,
    departureAirport: String,
    arrivalAirport: String
}, {timestamps: true});

cycleSchema.plugin(mongooseDelete, {deletedAt: true, deletedBy: true, indexFields: ['deleted']});

const defectSchema = new mongoose.Schema({
    defectDate: Date,
    defectType: {
        type: String,
        enum: ['mechanic', 'cabin']
    },
    description: String,
    resolveBefore: Date,
    resolveDate: Date,
    status: {
        type: String,
        enum: ['new', 'work', 'resolved']
    }
}, {timestamps: true});

defectSchema.plugin(mongooseDelete, {deletedAt: true, deletedBy: true, indexFields: ['deleted']});

const maintenanceSchema = new mongoose.Schema({
    name: String,
    fh: Number,
    cycles: Number,
    calendar: Date,
    order: {
        type: Number,
        default: 100
    }
});

const inspectionSchema = new mongoose.Schema({
    name: String,
    requiredEvery: {
        hours: Number,
        ldgs: Number,
        mos: Number
    },
    lastCompliance: {
        hours: Number,
        ldgs: Number,
        date: Date
    }
}, {
    toObject: {
        virtuals: true,
        minimize: false
    }
});

inspectionSchema.virtual('nextDue').get(function() {
    const { requiredEvery, lastCompliance } = this;
    return {
        hours: requiredEvery.hours && (requiredEvery.hours + lastCompliance.hours),
        ldgs: requiredEvery.ldgs && (requiredEvery.ldgs + lastCompliance.ldgs),
        date: requiredEvery.mos && lastCompliance.date && nextDueDate(requiredEvery.mos, lastCompliance.date).toDate()
    };
});

inspectionSchema.virtual('remaining').get(function() {
    const { requiredEvery, lastCompliance, nextDue } = this;
    const ndd = requiredEvery.mos && nextDueDate(requiredEvery.mos, lastCompliance.date);
    const reportDate = moment();
    const aircraft = this.parent();
    return {
        hours: requiredEvery.hours && nextDue.hours - aircraft.tsn,
        ldgs: requiredEvery.ldgs && nextDue.ldgs - aircraft.csn,
        mos: ndd && (ndd.month() - reportDate.month() >= 0
                ? ndd.month() - reportDate.month() + 12 * (ndd.year() - reportDate.year())
                : 12 * (ndd.year() - reportDate.year()) - (reportDate.month() - ndd.month()))
    }
});

const aircraftSchema = new mongoose.Schema({
    tailNumber: String,
    acType: String,
    dos: Date,
    dom: Date,
    serialNumber: Number,
    csn: Number,
    tsn: Number, 
    initial: {
        date: {
            type: Date,
            default: new Date(1900, 0, 1)
        },
        tsn: {
            type: Number,
            default: 0
        },
        csn: {
            type: Number,
            default: 0
        }
    },
    cycles: [cycleSchema],
    defects: [defectSchema],
    maintenances: [maintenanceSchema],
    inspections: [inspectionSchema]
}, {
    toObject: {
        minimize: false,
        virtuals: true
    }
});

aircraftSchema.statics.findCycles = function (tailNumber, dateBegin=null, dateEnd=null, page=1, limit=0) {
    return this
        .aggregate()
        .match({tailNumber})
        .project({cycles: 1})
        .unwind('cycles')
        .match({'cycles.deleted': {$in: [false, null]}})
        .match(dateBegin && {'cycles.takeoff': {$gte: dateBegin, $lte: dateEnd}} || {})
        .group({_id: '$_id', cycles: {$push: '$cycles'}, total: {$sum: 1}})
        .unwind('cycles')
        .skip((page - 1) * limit)
        .limit(limit || Number.MAX_SAFE_INTEGER)
        .sort({'cycles.takeoff': -1})
        .group({_id: {_id: '$_id', total: '$total'}, cycles: {$push: '$cycles'}})
        .project({_id: 0, cycles: 1, total: '$_id.total', page: {$literal: page}, limit: {$literal: limit}})
        .then(aggregation => {
            if (!aggregation[0]) {
                return this.aggregate()
                    .match({tailNumber})
                    .project({cycles: 1})
                    .unwind('cycles')
                    .match({'cycles.deleted': {$in: [false, null]}})
                    .match(dateBegin && {'cycles.takeoff': {$gte: dateBegin, $lte: dateEnd}} || {})
                    .group({_id: '$_id', cycles: {$push: '$cycles'}, total: {$sum: 1}})
                    .project({_id: 0, cycles: [], total: 1, page: {$literal: page}, limit: {$literal: limit}})
                    .then(aggregation => aggregation[0])
            }
            return aggregation[0]
        }).then(aggregation => aggregation || {cycles: [], total: 0});
}

aircraftSchema.statics.findDefects = function (tailNumber, dateBegin=null, dateEnd=null, page=1, limit=0) {
    return this
        .aggregate()
        .match({tailNumber})
        .project({defects: 1})
        .unwind('defects')
        .match({'defects.deleted': {$in: [false, null]}})
        .match(dateBegin && {'defects.defectDate': {$gte: dateBegin, $lte: dateEnd}} || {})
        .group({_id: '$_id', defects: {$push: '$defects'}, total: {$sum: 1}})
        .unwind('defects')
        .skip((page - 1) * limit)
        .limit(limit || Number.MAX_SAFE_INTEGER)
        .sort({'defects.defectDate': -1})
        .group({_id: {_id: '$_id', total: '$total'}, defects: {$push: '$defects'}})
        .project({_id: 0, defects: 1, total: '$_id.total', page: {$literal: page}, limit: {$literal: limit}})
        .then(aggregation => {
            if (!aggregation[0]) {
                return this.aggregate()
                    .match({tailNumber})
                    .project({defects: 1})
                    .unwind('defects')
                    .match({'defects.deleted': {$in: [false, null]}})
                    .match(dateBegin && {'defects.defectDate': {$gte: dateBegin, $lte: dateEnd}} || {})
                    .group({_id: '$_id', defects: {$push: '$defects'}, total: {$sum: 1}})
                    .project({_id: 0, defects: [], total: 1, page: {$literal: page}, limit: {$literal: limit}})
                    .then(aggregation => aggregation[0])
            }
            return aggregation[0]
        }).then(aggregation => aggregation || {defects: [], total: 0});
}

aircraftSchema.statics.getAircrafts = function (defects=false) {
    if (defects) {
        return this.aggregate([
            {$project: {
                tailNumber: 1,
                acType: 1,
                csn: 1,
                tsn: 1,
                maintenances: 1,
                defects: {$filter: {
                    input: '$defects',
                    as: 'defect',
                    cond: {$and: [{$ne: ['$$defect.status', 'resolved']}, {$ne: ['$$defect.deleted', true]}]}
                }}
            }}
        ]).then(aircrafts => aircrafts.map(aircraft => ({...aircraft, defects: aircraft.defects && aircraft.defects.sort((a, b) => b.defectDate.getTime() - a.defectDate.getTime()) || []})));
    } else {
        return this.find({}, {cycles: false, defects: false, inspections: false}).sort({tailNumber: 1});
    }
}

aircraftSchema.statics.getAircraft = async function (tailNumber, options) {
    const { cyclesStartDate, cyclesEndDate, defectsStartDate, defectsEndDate } = options;
    const aircraft = (await this.findOne({tailNumber}, {cycles: false})).toObject();
    if (!aircraft) {
        return null;
    }
    const cycles = await this.findCycles(tailNumber, cyclesStartDate && moment(cyclesStartDate).toDate(), cyclesEndDate && moment(cyclesEndDate).toDate());
    aircraft.cycles = cycles.cycles;
    const defects = await this.findDefects(tailNumber, defectsStartDate && moment(defectsStartDate).toDate(), defectsEndDate && moment(defectsEndDate).toDate());
    aircraft.defects = defects.defects;
    return aircraft;
}

aircraftSchema.statics.getTSN = async function (tailNumber, startDate) {
    return this.aggregate()
        .match({tailNumber})
        .project({cycles: 1})
        .unwind('cycles')
        .match({'cycles.deleted': {$in: [false, null]}})
        .match({'cycles.takeoff': {$gt: startDate}})
        .group({_id: '$_id', cycles: {$push: '$cycles'}, tsn: {$sum: '$cycles.flightTime'}})
        .project({_id: 0, tsn: 1})
        .then(aggregation => aggregation[0] && aggregation[0].tsn / 3600 || 0);
}

aircraftSchema.statics.getCSN = async function (tailNumber, startDate) {
    return this.aggregate()
        .match({tailNumber})
        .project({cycles: 1})
        .unwind('cycles')
        .match({'cycles.deleted': {$in: [false, null]}})
        .match({'cycles.takeoff': {$gt: startDate}})
        .group({_id: '$_id', cycles: {$push: '$cycles'}, csn: {$sum: 1}})
        .project({_id: 0, csn: 1})
        .then(aggregation => aggregation[0] && aggregation[0].csn || 0);
}

aircraftSchema.statics.updateAircraft = async function (tailNumber, data) {
    const aircraft = await this.findOne({tailNumber});
    if (data.initial) {
        const tsn = await this.getTSN(tailNumber, new Date(data.initial.date));
        data.tsn = tsn + data.initial.tsn;
        const csn = await this.getCSN(tailNumber, new Date(data.initial.date));
        data.csn = csn + data.initial.csn;
    }
    return this.update({tailNumber}, {$set: data});
}

aircraftSchema.statics.findCycle = function (tailNumber, cycleId) {
    return this.findOne({tailNumber, 'cycles._id': ObjectId(cycleId)}, {'cycles.$': true}).then(aircraft => aircraft && aircraft.cycles[0]);
}

aircraftSchema.methods.updateCycle = async function (cycleId, data) {
    const cycle = this.cycles.id(ObjectId(cycleId));
    const updateTsnCsn = data.takeoff !== cycle.takeoff.toISOString() || data.flightTime !== cycle.flightTime;
    cycle.flightTime = data.flightTime;
    cycle.takeoff = data.takeoff;
    cycle.departureAirport = data.departureAirport;
    cycle.arrivalAirport = data.arrivalAirport;
    return this.save().then(result => {
        if (updateTsnCsn) {
            return Aircraft.getTSN(this.tailNumber, this.initial.date).then(tsn => {
                this.tsn = tsn + this.initial.tsn;
                return Aircraft.getCSN(this.tailNumber, this.initial.date).then(csn => {
                    this.csn = csn + this.initial.csn;
                    return this.save();
                });
            });
        }
        return result;
    });
}

aircraftSchema.methods.deleteCycle = async function (cycleId, user) {
    const cycle = this.cycles.id(ObjectId(cycleId));
    const updateTsnCsn = cycle.takeoff > this.initial.date;
    await cycle.delete(user._id, null);
    return this.save().then(result => {
        if (updateTsnCsn) {
            return Aircraft.getTSN(this.tailNumber, this.initial.date).then(tsn => {
                this.tsn = tsn + this.initial.tsn;
                return Aircraft.getCSN(this.tailNumber, this.initial.date).then(csn => {
                    this.csn = csn + this.initial.csn;
                    return this.save();
                });
            });
        }
    });
}

aircraftSchema.methods.addCycle = function (data) {
    this.cycles.push(data);
    const cycle = this.cycles.slice(-1)[0];
    if (cycle.takeoff > this.initial.date) {
        this.tsn += cycle.flightTime / 3600;
        this.csn++;
    }
    return this.save().then(() => cycle);
}

aircraftSchema.methods.addDefect = function (data) {
    this.defects.push(data);
    const defect = this.defects.slice(-1)[0];
    return this.save().then(() => defect);
}

aircraftSchema.statics.findDefect = function (tailNumber, defectId) {
    return this.findOne({tailNumber, 'defects._id': ObjectId(defectId)}, {'defects.$': true}).then(aircraft => aircraft && aircraft.defects[0]);
}

aircraftSchema.methods.updateDefect = function (defectId, data) {
    const defect = this.defects.id(ObjectId(defectId));
    Object.assign(defect, data);
    return this.save();
}

aircraftSchema.methods.deleteDefect = async function (defectId, user) {
    const defect = this.defects.id(ObjectId(defectId));
    await defect.delete(user._id, null);
    return this.save();
}

aircraftSchema.methods.updateMaintenance = async function (maintenanceId, data) {
    const maintenance = this.maintenances.id(ObjectId(maintenanceId));
    Object.assign(maintenance, data);
    return this.save();
}

aircraftSchema.methods.updateInspection = async function (inspectionId, data) {
    const inspection = this.inspections.id(ObjectId(inspectionId));
    Object.assign(inspection, data);
    return this.save();
}

const nextDueDate = (requiredEveryMOS, lastComplianceDate) => {
    const lastComplianceDateM = moment(lastComplianceDate);
    return moment.utc([
        lastComplianceDateM.year() + Math.trunc((requiredEveryMOS + lastComplianceDateM.month() + 1) / 12),
        requiredEveryMOS + lastComplianceDateM.month() + 1 <= 12 
            ? requiredEveryMOS + lastComplianceDateM.month() 
            : (requiredEveryMOS + lastComplianceDateM.month() + 1) % 12 - 1,
        lastComplianceDateM.date()
    ]);
}

const Aircraft = mongoose.model('Aircraft', aircraftSchema);

export default Aircraft;