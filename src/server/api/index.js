import express from 'express';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { getAircrafts, getAircraft, updateAircraft, 
    getAircraftCycles, addAircraftCycle, getAircraftCycle,
    updateAircraftCycle, deleteAircraftCycle, getAircraftDefect, 
    addAircraftDefect, deleteAircraftDefect, updateAircraftDefect, 
    updateAircraftMaintenance, updateAircraftInspection, getReport } from './aircrafts';

const router = express.Router();

router.post('/authenticate', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    const isAuthenticated = user && await user.authenticate(req.body.password);
    if (isAuthenticated) {
        const token = jwt.sign({username: user.username, role: user.role}, req.app.settings.secret, {expiresIn: '1d'});
        res.json({token});
    } else {
        res.sendStatus(401);
    }
});

router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, req.app.settings.secret, (err, decoded) => {
            if (err) {
                return res.sendStatus(401);
            } else {
                req.decoded = decoded;
                User.findOne({username: decoded.username}, 'username, role').exec()
                    .then(user => {
                        req.user = user;
                        next();
                    }) 
            }
        });
    } else {
        return res.status(403).send({success: false, message: 'No token provided'});
    }
});

router.route('/aircrafts').get(getAircrafts);

router.route('/aircrafts/:tailNumber')
    .get(getAircraft)
    .patch(updateAircraft);

router.route('/aircrafts/:tailNumber/cycles')
    .get(getAircraftCycles)
    .post(addAircraftCycle)

router.route('/aircrafts/:tailNumber/cycles/:cycleId')
    .get(getAircraftCycle)
    .put(updateAircraftCycle)
    .delete(deleteAircraftCycle)

router.route('/aircrafts/:tailNumber/defects')
    // .get(getAircraftDefects)
    .post(addAircraftDefect)

router.route('/aircrafts/:tailNumber/defects/:defectId')
    .get(getAircraftDefect)
    .put(updateAircraftDefect)
    .delete(deleteAircraftDefect)

router.route('/aircrafts/:tailNumber/maintenances/:maintenanceId')
    .put(updateAircraftMaintenance)

router.route('/aircrafts/:tailNumber/inspections/:inspectionId')
    .put(updateAircraftInspection)

router.route('/aircrafts/:tailNumber/status.pdf')
    .get(getReport)

export default router;