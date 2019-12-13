import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import DatePicker from 'react-toolbox/lib/date_picker';
import TimePicker from 'react-toolbox/lib/time_picker';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import { IconButton } from 'react-toolbox/lib/button';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './AircraftDefectDialog.scss';
import classNames from 'classnames/bind';
import moment from 'moment';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { asUTCDate, asUTCISOString } from '../../utils';

const cx = classNames.bind(styles);
const defectStatuses = [
    { value: 'new', label: 'New' },
    { value: 'work', label: 'Work' },
    { value: 'resolved', label: 'Resolved' }
];
const dateFormat = 'DD.MM.YYYY';

export default class AircraftDefectDialog extends Component {
    static propTypes = {
        defect: PropTypes.object,
        active: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        hideDialog: PropTypes.func.isRequired,
        addDefect: PropTypes.func.isRequired,
        saveDefect: PropTypes.func.isRequired,
        deleteDefect: PropTypes.func.isRequired
    };

    static defaultProps = {
        active: false,
        defect: null
    };

    state = {
        defect:
            (this.props.defect && {
                ...this.props.defect,
                defectDate: asUTCDate(this.props.defect.defectDate),
                defectTime: asUTCDate(this.props.defect.defectTime),
                resolveBefore: asUTCDate(this.props.defect.resolveBefore),
                resolveBeforeTime: asUTCDate(
                    this.props.defect.resolveBeforeTime
                ),
                resolveDate: asUTCDate(this.props.defect.resolveDate),
                resolveTime: asUTCDate(this.props.defect.resolveTime)
            }) ||
            null,
        showConfirmDeleteDialog: false,
        showDefectDescription: false
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.active !== nextProps.active && nextProps.active) {
            this.setState({
                defect:
                    (nextProps.defect && {
                        ...nextProps.defect,
                        defectDate: asUTCDate(nextProps.defect.defectDate),
                        defectTime: asUTCDate(nextProps.defect.defectTime),
                        resolveBefore: asUTCDate(
                            nextProps.defect.resolveBefore
                        ),
                        resolveBeforeTime: asUTCDate(
                            nextProps.defect.resolveBeforeTime
                        ),
                        resolveDate: asUTCDate(nextProps.defect.resolveDate),
                        resolveTime: asUTCDate(nextProps.defect.resolveTime)
                    }) ||
                    null
            });
        }
    }

    hideDialog = () => {
        this.props.hideDialog();
    };

    addDefect = () => {
        this.props.addDefect({
            ...this.state.defect,
            defectDate: asUTCISOString(this.state.defect.defectDate),
            defectTime: asUTCISOString(this.state.defect.defectTime),
            resolveDate: asUTCISOString(this.state.defect.resolveDate),
            resolveTime: asUTCISOString(this.state.defect.resolveTime),
            resolveBefore: asUTCISOString(this.state.defect.resolveBefore),
            resolveBeforeTime: asUTCISOString(
                this.state.defect.resolveBeforeTime
            )
        });
        this.hideDialog();
    };

    saveDefect = () => {
        this.props.saveDefect({
            ...this.state.defect,
            defectDate: asUTCISOString(this.state.defect.defectDate),
            defectTime: asUTCISOString(this.state.defect.defectTime),
            resolveDate: asUTCISOString(this.state.defect.resolveDate),
            resolveTime: asUTCISOString(this.state.defect.resolveTime),
            resolveBefore: asUTCISOString(this.state.defect.resolveBefore),
            resolveBeforeTime: asUTCISOString(
                this.state.defect.resolveBeforeTime
            )
        });
        this.hideDialog();
    };

    deleteDefect = () => {
        this.props.deleteDefect(this.state.defect);
        this.setState({
            showConfirmDeleteDialog: false
        });
        this.hideDialog();
    };

    onDescriptionChange = (value) => {
        this.onValueChange('description', value);
    };

    onDateChange = (value) => {
        this.onValueChange(
            'defectDate',
            moment(value)
                .startOf('day')
                .toDate()
        );
    };

    onTimeChange = (value) => {
        this.onValueChange('defectTime', value);
    };

    onResolveBeforeChange = (value) => {
        this.onValueChange(
            'resolveBefore',
            moment(value)
                .startOf('day')
                .toDate()
        );
    };

    onResolveBeforeTimeChange = (value) => {
        this.onValueChange('resolveBeforeTime', value);
    };

    onResolveDateChange = (value) => {
        console.log(value);
        this.onValueChange(
            'resolveDate',
            moment(value)
                .startOf('day')
                .toDate()
        );
    };

    onResolveTimeChange = (value) => {
        console.log(value);
        this.onValueChange('resolveTime', value);
    };

    clearResolveDate = () => {
        this.onValueChange('resolveDate', null);
    };

    clearResolveTime = () => {
        this.onValueChange('resolveTime', null);
    };

    onDescriptionClick = () => {
        this.setState({
            showDefectDescription: true
        });
    };

    closeDefectDescription = () => {
        this.setState({
            showDefectDescription: false
        });
    };

    onDefectTypeChange = (value) => {
        this.onValueChange('defectType', value);
    };

    onStatusChange = (value) => {
        const newState = { status: value };
        if (value === 'resolved') {
            newState.resolveDate = moment()
                .startOf('day')
                .toDate();
        } else {
            newState.resolveDate = null;
        }
        this.setState({ defect: { ...this.state.defect, ...newState } });
    };

    onValueChange = (field, value) => {
        this.setState({ defect: { ...this.state.defect, [field]: value } });
    };

    render() {
        const { active, title } = this.props;
        const {
            defect,
            showDefectDescription,
            showConfirmDeleteDialog
        } = this.state;
        let actions = [];
        if (showDefectDescription) {
            actions = [
                {
                    label: 'Close',
                    primary: true,
                    onClick: this.closeDefectDescription
                }
            ];
        } else {
            actions = defect
                ? !defect.id
                    ? [
                          {
                              label: 'Add defect',
                              icon: 'add',
                              primary: true,
                              onClick: this.addDefect
                          },
                          { label: 'Cancel', onClick: this.hideDialog }
                      ]
                    : [
                          {
                              label: 'Save defect',
                              primary: true,
                              onClick: this.saveDefect
                          },
                          {
                              label: 'Delete defect',
                              onClick: () =>
                                  this.setState({
                                      showConfirmDeleteDialog: true
                                  })
                          },
                          { label: 'Cancel', onClick: this.hideDialog }
                      ]
                : [];
        }

        return (
            <div>
                <Dialog
                    active={active}
                    onEscKeyDown={this.hideDialog}
                    onOverlayClick={this.hideDialog}
                    title={title}
                    actions={actions}
                    className={cx('dialog')}
                >
                    {!defect ? null : showDefectDescription ? (
                        <Input
                            type="text"
                            label="Description"
                            value={defect.description}
                            onChange={this.onDescriptionChange}
                            multiline
                            rows={5}
                        />
                    ) : (
                        <div>
                            <DatePicker
                                label="Defect Date"
                                autoOk
                                value={defect.defectDate}
                                onChange={this.onDateChange}
                                inputFormat={(value) =>
                                    moment(value).format(dateFormat)
                                }
                            />
                            <TimePicker
                                label="Defect Time (UTC)"
                                value={defect.defectTime}
                                onChange={this.onTimeChange}
                            />

                            <DatePicker
                                label="Resolve before Date"
                                autoOk
                                value={defect.resolveBefore}
                                onChange={this.onResolveBeforeChange}
                                inputFormat={(value) =>
                                    moment(value).format(dateFormat)
                                }
                            />
                            <TimePicker
                                label="Resolve before Time (UTC)"
                                value={defect.resolveBeforeTime}
                                onChange={this.onResolveBeforeTimeChange}
                            />

                            <div className={cx('datePickerWithAction')}>
                                <div className={cx('datePickerWrapper')}>
                                    <DatePicker
                                        label="Resolve Date"
                                        autoOk
                                        value={defect.resolveDate}
                                        onChange={this.onResolveDateChange}
                                        inputFormat={(value) =>
                                            moment(value).format(dateFormat)
                                        }
                                    />
                                </div>
                                <IconButton
                                    icon="clear"
                                    onClick={this.clearResolveDate}
                                />
                            </div>
                            <TimePicker
                                label="Resolve Time (UTC)"
                                value={defect.resolveTime}
                                onChange={this.onResolveTimeChange}
                            />
                            <RadioGroup
                                name="defectType"
                                value={defect.defectType}
                                onChange={this.onDefectTypeChange}
                                className={cx('defectTypeGroup')}
                            >
                                <p className={cx('defectTypeTitle')}>
                                    Defect Type:
                                </p>
                                <RadioButton
                                    className={cx('defectTypeRadio')}
                                    label="Mechanic"
                                    value="mechanic"
                                />
                                <RadioButton
                                    className={cx('defectTypeRadio')}
                                    label="Cabin"
                                    value="cabin"
                                />
                            </RadioGroup>

                            {defect.description ? (
                                <div>
                                    <label className={cx('label')}>
                                        Description
                                    </label>
                                    <Scrollbars
                                        style={{ height: '8rem' }}
                                        onClick={this.onDescriptionClick}
                                    >
                                        <div>{defect.description}</div>
                                    </Scrollbars>
                                </div>
                            ) : (
                                <Input
                                    type="text"
                                    label="Description"
                                    value=""
                                    onFocus={this.onDescriptionClick}
                                />
                            )}

                            <Dropdown
                                auto
                                label="Current status of defect"
                                onChange={this.onStatusChange}
                                source={defectStatuses}
                                value={defect.status}
                            />
                        </div>
                    )}
                </Dialog>

                <ConfirmDeleteDialog
                    title="Delete Defect"
                    active={showConfirmDeleteDialog}
                    onYes={this.deleteDefect}
                    onNo={() =>
                        this.setState({ showConfirmDeleteDialog: false })
                    }
                />
            </div>
        );
    }
}
