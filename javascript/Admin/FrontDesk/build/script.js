'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ButtonGroup = React.createClass({
    displayName: 'ButtonGroup',

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {
            label: 'Action',
            options: [{
                label: 'Action1',
                handleClick: null,
                divider: false
            }]
        };
    },

    render: function render() {
        var options = this.props.options.map(function (value, key) {
            return React.createElement(ButtonGroupOption, {
                key: key,
                label: value.label,
                handleClick: value.handleClick,
                divider: value.divider });
        });

        return React.createElement(
            'div',
            { className: 'btn-group' },
            React.createElement(
                'button',
                {
                    type: 'button',
                    className: 'btn btn-default btn-sm dropdown-toggle',
                    'data-toggle': 'dropdown',
                    'aria-haspopup': 'true',
                    'aria-expanded': 'false' },
                this.props.label,
                React.createElement('span', { className: 'caret' })
            ),
            React.createElement(
                'ul',
                { className: 'dropdown-menu' },
                options
            )
        );
    }
});

var ButtonGroupOption = React.createClass({
    displayName: 'ButtonGroupOption',

    getDefaultProps: function getDefaultProps() {
        return { label: null, handleClick: null, divider: false };
    },

    render: function render() {
        if (this.props.divider) {
            return React.createElement('li', { role: 'separator', className: 'divider' });
        } else {
            return React.createElement(
                'li',
                { onClick: this.props.handleClick },
                React.createElement(
                    'a',
                    { style: {
                            cursor: 'pointer'
                        } },
                    this.props.label
                )
            );
        }
    }
});

var WaitingListStatus = React.createClass({
    displayName: 'WaitingListStatus',


    getDefaultProps: function getDefaultProps() {
        return { visitor: null, visitNumber: 0, reload: null };
    },

    intakeComplete: function intakeComplete() {
        if (confirm('Click OK if student completed their intake form.')) {
            $.post('counseling/Admin/Dashboard/Waiting/', {
                command: 'intakeComplete',
                visitorId: this.props.visitor.id
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this));
        }
    },

    render: function render() {
        if (this.props.visitor.intake_complete === '1') {
            if (this.props.visitNumber > 1) {
                if (this.props.visitor.seen_last_visit === '0') {
                    return React.createElement(
                        'span',
                        { className: 'label label-danger' },
                        'Unseen last visit'
                    );
                } else {
                    return React.createElement(
                        'span',
                        { className: 'label label-primary' },
                        'Previously seen @ ',
                        this.props.visitor.previously_seen
                    );
                }
            } else {
                return React.createElement(
                    'span',
                    { className: 'label label-success' },
                    'Intake complete'
                );
            }
        } else {
            return React.createElement(
                'span',
                {
                    className: 'label label-danger',
                    style: {
                        cursor: 'pointer'
                    },
                    title: 'Click to acknowledge intake completion',
                    onClick: this.intakeComplete },
                'Intake incomplete'
            );
        }
    }
});

var ClipboardInput = React.createClass({
    displayName: 'ClipboardInput',

    /*
    * silences javascript warning on input used for copy and paste
    */
    saveToClipboard: function saveToClipboard() {
        $(this.refs.bannerId).select();
        document.execCommand('copy');
    },

    nada: function nada() {},

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement('input', {
                size: '11',
                ref: 'bannerId',
                value: this.props.bannerId,
                onChange: this.nada }),
            ' ',
            React.createElement(
                'button',
                { title: 'Copy to clipboard', onClick: this.saveToClipboard },
                React.createElement('i', { className: 'glyphicon glyphicon-copy' })
            )
        );
    }
});

var isEmpty = function isEmpty(value) {
    return value === undefined || value === null || value.length === 0;
};

var Modal = React.createClass({
    displayName: 'Modal',

    getInitialState: function getInitialState() {
        return { header: null, body: null, footer: null };
    },

    getDefaultProps: function getDefaultProps() {
        return { header: null, body: null, footer: null, modalId: 'reactModal', onClose: null };
    },

    componentDidMount: function componentDidMount() {
        if (this.props.onClose) {
            $('#' + this.props.modalId).on('hidden.bs.modal', function (e) {
                this.props.onClose();
            }.bind(this));
        }
    },

    render: function render() {
        return React.createElement(
            'div',
            { id: this.props.modalId, className: 'modal fade', tabindex: '-1', role: 'dialog' },
            React.createElement(
                'div',
                { className: 'modal-dialog' },
                React.createElement(
                    'div',
                    { className: 'modal-content' },
                    React.createElement(
                        'div',
                        { className: 'modal-header' },
                        React.createElement(
                            'button',
                            { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
                            React.createElement(
                                'span',
                                { 'aria-hidden': 'true' },
                                '×'
                            )
                        ),
                        React.createElement(
                            'h4',
                            { className: 'modal-title' },
                            this.props.header
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-body' },
                        this.props.body
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-footer' },
                        this.props.footer,
                        React.createElement(
                            'button',
                            { type: 'button', className: 'btn btn-default', 'data-dismiss': 'modal' },
                            'Close'
                        )
                    )
                )
            )
        );
    }
});

var Summary = React.createClass({
    displayName: 'Summary',

    getInitialState: function getInitialState() {
        return { error: null, errorMessage: null };
    },

    getDefaultProps: function getDefaultProps() {
        return { data: null, time: null };
    },

    serverError: function serverError() {
        this.setState({ error: true, errorMessage: 'Could not retrieve server data' });
    },

    render: function render() {
        var currentTally = null;
        var totalTally = null;
        if (this.props.data) {
            currentTally = this.props.data.currentTally;
            totalTally = this.props.data.completeTally;
        } else {
            currentTally = {
                emergencies: 0,
                walkin: 0,
                appointment: 0,
                other: 0
            };
            totalTally = currentTally;
        }
        return React.createElement(
            'div',
            { className: 'summary' },
            this.state.error ? React.createElement(
                'div',
                { className: 'alert alert-danger' },
                this.state.errorMessage
            ) : null,
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-6 left' },
                    React.createElement(
                        'h3',
                        null,
                        'Current'
                    ),
                    React.createElement(
                        'div',
                        { className: 'row' },
                        React.createElement(
                            'div',
                            { className: 'col-sm-4' },
                            React.createElement(SummaryTotalWaiting, this.props.data)
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-4' },
                            React.createElement(SummaryEstimatedWait, this.props.data)
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-4' },
                            React.createElement(SummaryWaitingTally, currentTally)
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-6 right' },
                    React.createElement(
                        'h4',
                        { className: 'pull-right' },
                        this.props.time
                    ),
                    React.createElement(
                        'h3',
                        null,
                        'Today'
                    ),
                    React.createElement(
                        'div',
                        { className: 'row' },
                        React.createElement(
                            'div',
                            { className: 'col-sm-2' },
                            React.createElement(SummaryTotalSeen, this.props.data)
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-3' },
                            React.createElement(SummaryCompleted, this.props.data)
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-3' },
                            React.createElement(SummaryAverageWait, this.props.data)
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-4' },
                            React.createElement(SummaryWaitingTally, _extends({}, totalTally, { showLabels: true }))
                        )
                    )
                )
            )
        );
    }

});

var SummaryCompleted = React.createClass({
    displayName: 'SummaryCompleted',

    getInitialState: function getInitialState() {
        return {
            tooltip: true
        };
    },

    getDefaultProps: function getDefaultProps() {
        return { totalComplete: 0, leaveReasons: null };
    },

    componentDidMount: function componentDidMount() {
        $(window).load(function () {
            this.loadTooltip();
        }.bind(this));
    },

    loadTooltip: function loadTooltip() {
        $('.total-complete div.big-number').popover({
            animation: true,
            placement: 'bottom',
            trigger: 'hover',
            container: '.summary .right',
            title: 'Not seen reasons',
            html: true
        });
        $('.total-complete div.big-number').css('cursor', 'pointer');
        this.setState({ tooltip: false });
    },

    render: function render() {
        var reasons = null;
        if (this.props.leaveReasons !== null) {
            reasons = this.props.leaveReasons.join('<br />');
        }
        return React.createElement(
            'div',
            { className: 'total-complete text-center' },
            React.createElement(
                'div',
                { className: 'big-number', 'data-content': reasons },
                this.props.totalComplete
            ),
            React.createElement(
                'div',
                null,
                'Total',
                React.createElement('br', null),
                'Visits'
            )
        );
    }

});

var SummaryTotalWaiting = React.createClass({
    displayName: 'SummaryTotalWaiting',

    getDefaultProps: function getDefaultProps() {
        return { totalWaiting: 0 };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'total-waiting text-center' },
            React.createElement(
                'div',
                { className: 'big-number' },
                this.props.totalWaiting
            ),
            React.createElement(
                'div',
                null,
                'Waiting'
            )
        );
    }

});

var SummaryEstimatedWait = React.createClass({
    displayName: 'SummaryEstimatedWait',

    getDefaultProps: function getDefaultProps() {
        return { estimatedWait: 0 };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'estimated-wait text-center' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { className: 'big-number' },
                    this.props.estimatedWait
                ),
                React.createElement(
                    'span',
                    null,
                    'min'
                )
            ),
            React.createElement(
                'div',
                null,
                'Est. Wait'
            )
        );
    }

});

var SummaryWaitingTally = React.createClass({
    displayName: 'SummaryWaitingTally',

    getDefaultProps: function getDefaultProps() {
        return { emergency: 0, walkin: 0, appointment: 0, other: 0, showLabels: true };
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'table',
                { className: 'tally' },
                React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { className: 'text-center' },
                            React.createElement('i', { className: 'fa fa-exclamation-triangle' })
                        ),
                        this.props.showLabels ? React.createElement(
                            'td',
                            null,
                            'Emergency'
                        ) : null,
                        React.createElement(
                            'td',
                            null,
                            this.props.emergency
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { className: 'text-center' },
                            React.createElement('i', { className: 'fa fa-male' })
                        ),
                        this.props.showLabels ? React.createElement(
                            'td',
                            null,
                            'Walk-in'
                        ) : null,
                        React.createElement(
                            'td',
                            null,
                            this.props.walkin
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { className: 'text-center' },
                            React.createElement('i', { className: 'fa fa-clock-o' })
                        ),
                        this.props.showLabels ? React.createElement(
                            'td',
                            null,
                            'Appointment'
                        ) : null,
                        React.createElement(
                            'td',
                            null,
                            this.props.appointment
                        )
                    ),
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { className: 'text-center' },
                            React.createElement('i', { className: 'fa fa-question-circle' })
                        ),
                        this.props.showLabels ? React.createElement(
                            'td',
                            null,
                            'Other'
                        ) : null,
                        React.createElement(
                            'td',
                            null,
                            this.props.other
                        )
                    )
                )
            )
        );
    }

});

var SummaryTotalSeen = React.createClass({
    displayName: 'SummaryTotalSeen',


    getDefaultProps: function getDefaultProps() {
        return { totalSeen: 0 };
    },

    render: function render() {

        return React.createElement(
            'div',
            { className: 'total-seen text-center' },
            React.createElement(
                'div',
                { className: 'big-number' },
                this.props.totalSeen
            ),
            React.createElement(
                'div',
                null,
                'Seen'
            )
        );
    }

});

var SummaryAverageWait = React.createClass({
    displayName: 'SummaryAverageWait',

    getDefaultProps: function getDefaultProps() {
        return { averageWait: 0 };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'average-wait text-center' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { className: 'big-number' },
                    this.props.averageWait
                ),
                React.createElement(
                    'span',
                    null,
                    'min'
                )
            ),
            React.createElement(
                'div',
                null,
                'Avg. Wait'
            )
        );
    }

});

var CurrentlySeen = React.createClass({
    displayName: 'CurrentlySeen',

    getDefaultProps: function getDefaultProps() {
        return { seen: null, reload: null };
    },

    getInitialState: function getInitialState() {
        return { dispositions: [], seenId: 0 };
    },

    componentDidMount: function componentDidMount() {
        this.loadDispositions();
    },

    loadDispositions: function loadDispositions() {
        $.getJSON('counseling/Admin/Clinician', { command: 'dispositionList' }).done(function (data) {
            this.setState({ dispositions: data });
        }.bind(this));
    },

    moveBack: function moveBack(id) {
        $.post('./counseling/Admin/Dashboard/Waiting', {
            visitId: id,
            command: 'reset'
        }).done(function (data) {
            this.props.reload();
        }.bind(this), 'json');
    },

    complete: function complete(id) {
        this.setState({ seenId: id });
        $('#reactModal').modal('show');
    },

    handleClick: function handleClick(dispositionId) {
        $.post('counseling/Admin/Clinician', {
            command: 'assignDisposition',
            dispositionId: dispositionId,
            visitId: this.state.seenId
        }, null, 'json').done(function (data) {
            this.closeModal();
        }.bind(this));
    },

    getModal: function getModal() {
        var dispositions = null;
        var buttonClass = null;
        var iconClass = null;

        dispositions = this.state.dispositions.map(function (value, key) {
            buttonClass = 'btn btn-lg btn-block btn-' + value.color;
            iconClass = 'fa fa-' + value.icon;
            return React.createElement(
                'button',
                {
                    key: key,
                    className: buttonClass,
                    onClick: this.handleClick.bind(null, value.id) },
                React.createElement('i', { className: iconClass }),
                value.title
            );
        }.bind(this));
        var modalBody = React.createElement(
            'div',
            null,
            dispositions
        );
        return React.createElement(Modal, { body: modalBody, header: 'Assign disposition', onClose: this.closeModal });
    },

    closeModal: function closeModal() {
        this.setState({ seenId: 0 });
        this.props.reload();
        $('#reactModal').modal('hide');
    },

    render: function render() {
        if (!this.props.seen) {
            return React.createElement(
                'div',
                { className: 'alert alert-info' },
                'No one is being seen'
            );
        }
        var modal = this.getModal();
        var seen = this.props.seen.map(function (value, key) {
            return React.createElement(
                'span',
                {
                    key: value.visitor.id,
                    className: 'dropdown',
                    style: {
                        marginRight: '1em'
                    } },
                React.createElement(
                    'button',
                    { className: 'btn btn-default', 'data-toggle': 'dropdown' },
                    value.visitor.last_name,
                    ' w/  ',
                    value.clinician,
                    ' ',
                    React.createElement('span', { className: 'caret' })
                ),
                React.createElement(
                    'ul',
                    { className: 'dropdown-menu' },
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'a',
                            {
                                style: {
                                    cursor: 'pointer'
                                },
                                onClick: this.moveBack.bind(this, value.id) },
                            React.createElement('i', { className: 'fa fa-reply' }),
                            ' Move ',
                            value.visitor.preferred_name,
                            '  ',
                            value.visitor.last_name,
                            ' back to queue'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'a',
                            {
                                style: {
                                    cursor: 'pointer'
                                },
                                onClick: this.complete.bind(this, value.id) },
                            React.createElement('i', { className: 'fa fa-flag-checkered' }),
                            ' Complete ',
                            value.visitor.preferred_name,
                            ' ',
                            value.visitor.last_name,
                            '\'s consultation'
                        )
                    )
                )
            );
        }.bind(this));
        return React.createElement(
            'div',
            null,
            modal,
            React.createElement(
                'div',
                { className: 'alert alert-info' },
                React.createElement(
                    'strong',
                    null,
                    'Currently seen: '
                ),
                seen
            )
        );
    }
});

var Appointment = React.createClass({
    displayName: 'Appointment',

    getDefaultProps: function getDefaultProps() {
        return { appointments: null, reload: null };
    },

    render: function render() {
        if (this.props.appointments === null) {
            return React.createElement(
                'div',
                null,
                'No appointments waiting'
            );
        }
        var count = 0;

        var listRows = this.props.appointments.map(function (value, key) {
            count++;
            return React.createElement(AppointmentRow, _extends({ key: key }, value, { count: count, reload: this.props.reload }));
        }.bind(this));

        return React.createElement(
            'div',
            { className: 'appointment-list' },
            React.createElement(
                'table',
                { className: 'table' },
                React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            '#'
                        ),
                        React.createElement(
                            'th',
                            null,
                            ' '
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Name'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Banner id'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Visits'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Status'
                        ),
                        React.createElement(
                            'th',
                            null,
                            ' '
                        )
                    ),
                    listRows
                )
            )
        );
    }
});

var AppointmentRow = React.createClass({
    displayName: 'AppointmentRow',

    getDefaultProps: function getDefaultProps() {
        return {
            id: 0,
            category: 0,
            color: 'default',
            reason_title: '',
            total_visits: 0,
            visitor: {},
            visitor_id: 0,
            reload: null
        };
    },

    render: function render() {
        var count = this.props.count;
        var _className = 'bg-' + this.props.color;
        return React.createElement(
            'tr',
            { className: _className },
            React.createElement(
                'td',
                { style: {
                        width: '3%'
                    } },
                count
            ),
            React.createElement(
                'td',
                {
                    style: {
                        width: '3%'
                    },
                    className: 'text-center' },
                React.createElement(CategoryIcon, {
                    category: this.props.category,
                    reasonTitle: this.props.reason_title })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(VisitorName, { visitor: this.props.visitor })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(ClipboardInput, { bannerId: this.props.visitor.banner_id })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(WaitingListVisits, { visitNumber: this.props.total_visits })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(WaitingListStatus, {
                    visitor: this.props.visitor,
                    reload: this.props.reload,
                    visitNumber: this.props.total_visits })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(AppointmentAction, { visitId: this.props.id, reload: this.props.reload })
            )
        );
    }
});

var AppointmentAction = React.createClass({
    displayName: 'AppointmentAction',


    getDefaultProps: function getDefaultProps() {
        return { visitId: 0 };
    },

    completeReason: function completeReason(reason) {
        $.post('counseling/Admin/Dashboard/Waiting', {
            command: 'setCompleteReason',
            reason: reason,
            visitId: this.props.visitId
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    remove: function remove() {
        if (confirm('Are you sure you want to remove this visitor?')) {
            $.post('counseling/Admin/Dashboard/Waiting', {
                command: 'delete',
                visitId: this.props.visitId
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this));
        }
    },

    getOptions: function getOptions() {
        var options = [];
        options.push({
            label: React.createElement(
                'div',
                { className: 'text-success' },
                React.createElement(
                    'strong',
                    null,
                    React.createElement('i', { className: 'fa fa-thumbs-o-up' }),
                    '  Send back'
                )
            ),
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 5)
        }, {
            divider: true
        }, {
            label: React.createElement(
                'div',
                null,
                React.createElement('i', { className: 'fa fa-external-link' }),
                '  Had to leave'
            ),
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 2)
        }, {
            label: React.createElement(
                'div',
                null,
                React.createElement('i', { className: 'fa fa-eye-slash' }),
                '  Missing'
            ),
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 3)
        }, {
            divider: true
        }, {
            label: React.createElement(
                'div',
                { className: 'text-danger' },
                React.createElement('i', { className: 'fa fa-trash-o' }),
                '  Remove'
            ),
            visitId: this.props.visitId,
            handleClick: this.remove
        });
        return options;
    },

    render: function render() {
        var options = this.getOptions();
        return React.createElement(ButtonGroup, { options: options });
    }
});

var Emergency = React.createClass({
    displayName: 'Emergency',

    mixins: ['ButtonGroup'],

    getInitialState: function getInitialState() {
        return {};
    },

    getDefaultProps: function getDefaultProps() {
        return {
            list: null
        };
    },

    render: function render() {
        if (this.props.list === null) {
            return null;
        }
        var rows = this.props.list.map(function (value, key) {
            return React.createElement(EmergencyRow, _extends({ key: key }, value, { reload: this.props.reload }));
        }.bind(this));

        return React.createElement(
            'div',
            { className: 'emergency' },
            rows
        );
    }

});

var EmergencyRow = React.createClass({
    displayName: 'EmergencyRow',

    getDefaultProps: function getDefaultProps() {
        return {
            visit: null,
            reload: null
        };
    },

    render: function render() {
        var intakeComplete = null;

        return React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-1' },
                React.createElement('i', { className: 'fa fa-lg fa-exclamation-triangle' })
            ),
            React.createElement(
                'div',
                { className: 'col-sm-2 visitor-name' },
                React.createElement(VisitorName, { visitor: this.props.visitor })
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                React.createElement(ClipboardInput, { bannerId: this.props.visitor.banner_id })
            ),
            React.createElement(
                'div',
                { className: 'col-sm-2' },
                this.props.wait_time,
                ' min.'
            ),
            React.createElement(
                'div',
                { className: 'col-sm-3' },
                React.createElement(WaitingListStatus, { visitor: this.props.visitor, reload: this.props.reload,
                    visitNumber: this.props.total_visits })
            ),
            React.createElement(
                'div',
                { className: 'col-sm-1' },
                React.createElement(WaitingAction, { visitId: this.props.id, reload: this.props.reload })
            )
        );
    }

});

var Waiting = React.createClass({
    displayName: 'Waiting',

    render: function render() {
        var waitingList = React.createElement(
            'div',
            null,
            'No walk-ins waiting'
        );
        if (!isEmpty(this.props.waiting)) {
            waitingList = React.createElement(
                'div',
                null,
                React.createElement(WaitingList, { list: this.props.waiting, reload: this.props.reload })
            );
        }
        return React.createElement(
            'div',
            null,
            React.createElement(Emergency, { list: this.props.emergency, reload: this.props.reload }),
            React.createElement(
                'h3',
                null,
                'Walk-ins'
            ),
            waitingList
        );
    }
});

var WaitingList = React.createClass({
    displayName: 'WaitingList',

    getDefaultProps: function getDefaultProps() {
        return { list: null, reload: null };
    },

    render: function render() {

        var listRows = null;
        if (this.props.list == null) {
            return React.createElement('div', null);
        }
        listRows = this.props.list.map(function (value, key) {
            return React.createElement(WaitingListRow, _extends({}, value, { count: key, key: key, reload: this.props.reload }));
        }.bind(this));
        return React.createElement(
            'div',
            { className: 'waiting-list' },
            React.createElement(
                'table',
                { className: 'table' },
                React.createElement(
                    'tbody',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'th',
                            null,
                            '#'
                        ),
                        React.createElement(
                            'th',
                            null,
                            ' '
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Name'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Banner id'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Wait time'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Visits'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Status'
                        ),
                        React.createElement(
                            'th',
                            null,
                            ' '
                        )
                    ),
                    listRows
                )
            )
        );
    }
});

var WaitingListRow = React.createClass({
    displayName: 'WaitingListRow',

    getDefaultProps: function getDefaultProps() {
        return { value: {}, count: 0, reload: null, visitor: null };
    },

    render: function render() {
        var count = this.props.count + 1;
        var _className = 'bg-' + this.props.color;
        return React.createElement(
            'tr',
            { className: _className },
            React.createElement(
                'td',
                { style: {
                        width: '3%'
                    } },
                count
            ),
            React.createElement(
                'td',
                {
                    style: {
                        width: '3%'
                    },
                    className: 'text-center' },
                React.createElement(CategoryIcon, {
                    category: this.props.category,
                    reasonTitle: this.props.reason_title })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(VisitorName, { visitor: this.props.visitor })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(ClipboardInput, { bannerId: this.props.visitor.banner_id })
            ),
            React.createElement(
                'td',
                null,
                this.props.wait_time,
                'min.'
            ),
            React.createElement(
                'td',
                null,
                React.createElement(WaitingListVisits, { visitNumber: this.props.total_visits })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(WaitingListStatus, {
                    visitor: this.props.visitor,
                    reload: this.props.reload,
                    visitNumber: this.props.total_visits })
            ),
            React.createElement(
                'td',
                null,
                React.createElement(WaitingAction, { visitId: this.props.id, reload: this.props.reload })
            )
        );
    }
});

var VisitorName = React.createClass({
    displayName: 'VisitorName',

    getInitialState: function getInitialState() {
        return { tooltip: true };
    },

    getDefaultProps: function getDefaultProps() {
        return { visitor: null };
    },

    componentDidMount: function componentDidMount() {
        if (this.state.tooltip) {
            $('span.visitor-name').tooltip({ animation: true, placement: 'right' });
            this.setState({ tooltip: false });
        }
    },

    render: function render() {
        if (this.props.visitor.preferred_name) {
            var fullName = this.props.visitor.first_name + ' "' + this.props.visitor.preferred_name + '" ' + this.props.visitor.last_name;
            return React.createElement(
                'span',
                { className: 'visitor-name', 'data-toggle': 'tooltip', title: fullName },
                this.props.visitor.preferred_name,
                ' ',
                this.props.visitor.last_name
            );
        } else {
            return React.createElement(
                'span',
                null,
                this.props.visitor.first_name,
                ' ',
                this.props.visitor.last_name
            );
        }
    }
});

var CategoryIcon = React.createClass({
    displayName: 'CategoryIcon',

    getInitialState: function getInitialState() {
        return { tooltip: true };
    },
    getDefaultProps: function getDefaultProps() {
        return { category: 0, reasonTitle: null };
    },

    componentDidMount: function componentDidMount() {
        if (this.state.tooltip) {
            $('i.category').tooltip({ animation: true, placement: 'right' });
            this.setState({ tooltip: false });
        }
    },

    render: function render() {
        var icon = null;
        var _className = 'category fa fa-lg ' + categoryIcons[this.props.category];
        icon = React.createElement('i', { className: _className, 'data-toggle': 'tooltip', title: this.props.reasonTitle });
        return React.createElement(
            'div',
            null,
            icon
        );
    }
});

var WaitingListVisits = React.createClass({
    displayName: 'WaitingListVisits',


    getDefaultProps: function getDefaultProps() {
        return { visitNumber: '0' };
    },

    render: function render() {
        switch (this.props.visitNumber) {
            case '0':
                return React.createElement('span', null);

            case '1':
                return React.createElement(
                    'span',
                    { className: 'label label-info' },
                    'First visit'
                );

            case '2':
            case '3':
                return React.createElement(
                    'span',
                    { className: 'label label-primary' },
                    this.props.visitNumber,
                    '  visits'
                );

            case '4':
            case '5':
                return React.createElement(
                    'span',
                    { className: 'label label-warning' },
                    this.props.visitNumber,
                    '  visits'
                );

            default:
                return React.createElement(
                    'span',
                    { className: 'label label-danger' },
                    this.props.visitNumber,
                    '  visits'
                );
        }
    }
});

var WaitingAction = React.createClass({
    displayName: 'WaitingAction',


    getDefaultProps: function getDefaultProps() {
        return { visitId: 0 };
    },

    completeReason: function completeReason(reason) {
        $.post('counseling/Admin/Dashboard/Waiting', {
            command: 'setCompleteReason',
            reason: reason,
            visitId: this.props.visitId
        }, null, 'json').done(function (data) {
            this.props.reload();
        }.bind(this));
    },

    remove: function remove() {
        if (confirm('Are you sure you want to remove this visitor?')) {
            $.post('counseling/Admin/Dashboard/Waiting', {
                command: 'delete',
                visitId: this.props.visitId
            }, null, 'json').done(function (data) {
                this.props.reload();
            }.bind(this));
        }
    },

    getOptions: function getOptions() {
        var options = [];
        options.push({
            label: React.createElement(
                'div',
                null,
                React.createElement('i', { className: 'fa fa-external-link' }),
                '  Had to leave'
            ),
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 2)
        }, {
            label: React.createElement(
                'div',
                null,
                React.createElement('i', { className: 'fa fa-eye-slash' }),
                '  Missing'
            ),
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 3)
        }, {
            label: React.createElement(
                'div',
                null,
                React.createElement('i', { className: 'fa fa-clock-o' }),
                '  Made appointment'
            ),
            visitId: this.props.visitId,
            handleClick: this.completeReason.bind(null, 4)
        }, {
            divider: true
        }, {
            label: React.createElement(
                'div',
                { className: 'text-danger' },
                React.createElement('i', { className: 'fa fa-trash-o' }),
                '  Remove'
            ),
            visitId: this.props.visitId,
            handleClick: this.remove
        });
        return options;
    },

    render: function render() {
        var options = this.getOptions();
        return React.createElement(ButtonGroup, { options: options });
    }
});

var refreshDashboard = null;

var Dashboard = React.createClass({
    displayName: 'Dashboard',

    getInitialState: function getInitialState() {
        return {
            refresh: true,
            emergencyList: null,
            waitingList: null,
            appointmentList: null,
            summary: null,
            currentlySeen: null,
            time: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.loadData();
    },

    refresh: function refresh() {
        if (this.state.refresh) {
            refreshDashboard = setInterval(function () {
                this.loadData();
            }.bind(this), 30000);
        }
    },

    loadData: function loadData() {
        clearInterval(refreshDashboard);
        $.getJSON('counseling/Admin/Dashboard/Waiting', {
            command: 'list'
        }).done(function (data) {
            this.setState({
                emergencyList: data.emergencies,
                waitingList: data.waiting,
                appointmentList: data.appointment,
                summary: data.summary,
                currentlySeen: data.currentlySeen,
                time: data.time
            });
            this.refresh();
        }.bind(this));
    },

    render: function render() {
        var visitors = null;
        if (this.state.emergencyList === null && this.state.waitingList === null && this.appointmentList === null) {
            visitors = React.createElement(
                'div',
                { className: 'text-success text-center' },
                React.createElement('i', { style: { fontSize: '200px' }, className: 'fa fa-smile-o' }),
                React.createElement(
                    'p',
                    { style: { fontSize: '100px' } },
                    'All clear!'
                )
            );
        } else {
            visitors = React.createElement(
                'div',
                null,
                React.createElement(Waiting, { emergency: this.state.emergencyList, waiting: this.state.waitingList,
                    reload: this.loadData }),
                React.createElement(
                    'h3',
                    null,
                    'Appointments'
                ),
                React.createElement(Appointment, { appointments: this.state.appointmentList, reload: this.loadData })
            );
        }
        return React.createElement(
            'div',
            { className: 'dashboard' },
            React.createElement(Summary, { data: this.state.summary, time: this.state.time,
                reload: this.loadData }),
            React.createElement(CurrentlySeen, { seen: this.state.currentlySeen, reload: this.loadData }),
            visitors
        );
    }

});

ReactDOM.render(React.createElement(Dashboard, null), document.getElementById('dashboard'));
//# sourceMappingURL=script.js.map
