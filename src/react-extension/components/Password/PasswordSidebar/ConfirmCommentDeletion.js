/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         2.14.0
 */
import React, {Component} from "react";
import AppContext from "../../../contexts/AppContext";
import FormSubmitButton from "../../Common/Inputs/FormSubmitButton/FormSubmitButton";
import FormCancelButton from "../../Common/Inputs/FormSubmitButton/FormCancelButton";
import DialogWrapper from "../../Common/Dialog/DialogWrapper/DialogWrapper";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import PropTypes from "prop-types";

class ConfirmDeleteDialog extends Component {
    /**
     * Constructor
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
        this.bindEventHandlers();
    }


    /**
     * Return default state
     * @returns {Object} default state
     */
    get defaultState() {
        return {
            actions: { // The ongoing action
                processing: false, // An action is processing
            },
        };
    }

    /**
     * Bind callbacks methods
     */
    bindEventHandlers() {
        this.handleClose = this.handleClose.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }



    /**
     * Handle the confirm event
     * @params {ReactEvent} The react event
     * @return {Promise}
     */
    async handleConfirm(event) {
        event.preventDefault();

        try {
            await this.setState({actions: {processing: true}});

            // Persist
            await this.context.port.request("passbolt.comments.delete", this.context.resourceCommentId);

            // Asks for a success  message
            await this.props.actionFeedbackContext.displaySuccess("The comment has been deleted successfully");

            // Stop processing
            await this.setState({actions: {processing: false}});

            // Hides the dialog
            this.context.setContext({resourceCommentId: null, showDeleteCommentDialog: false, mustRefreshComments: true});

        } catch (error) {
            await this.setState({actions: {processing: false}});

            // Show the error
            await this.props.actionFeedbackContext.displayError(error);

            // Hides the dialog
            this.context.setContext({resourceCommentId: null, showDeleteCommentDialog: false});
        }
    }


    /**
     * Handle close button click.
     */
    handleClose() {
        this.context.setContext({resourceCommentId: null, showDeleteCommentDialog: false});
    }

    render() {
        return (
            <div>
                <DialogWrapper
                    className='comment-delete-dialog'
                    title="Do you really want to delete?"
                    onClose={this.handleClose}
                    disabled={this.state.actions.processing}>
                    <form
                        className="comment-delete-form"
                        onSubmit={this.handleConfirm}
                        noValidate>
                        <div className="form-content">
                            <p>
                                Please confirm you really want to delete the comment. After clicking ok,
                                the comment will be <strong>deleted permanently</strong>
                            </p>
                        </div>
                        <div className="submit-wrapper clearfix">
                            <FormSubmitButton
                                disabled={this.state.actions.processing}
                                processing={this.state.processing}
                                value="Delete"
                                warning={true}/>
                            <FormCancelButton
                                disabled={this.state.actions.processing}
                                onClick={this.handleClose} />
                        </div>
                    </form>
                </DialogWrapper>
            </div>
        );
    }
}

ConfirmDeleteDialog.contextType = AppContext;

ConfirmDeleteDialog.propTypes = {
    actionFeedbackContext: PropTypes.object,

};


export default withActionFeedback(ConfirmDeleteDialog);
