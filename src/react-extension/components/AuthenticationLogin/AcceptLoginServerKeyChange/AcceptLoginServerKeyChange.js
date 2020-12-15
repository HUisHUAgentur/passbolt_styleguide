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
 * @since         3.0.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import {AuthenticationContext} from "../../../contexts/AuthenticationContext";

/**
 * This component notifies the user that the server key change and ask to acccept it
 */
class AcceptLoginServerKeyChange extends Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindEventHandlers();
  }


  /**
   * Returns the default state
   */
  get defaultState() {
    return {
      hasAccepted: false, //  True if the user did explicitely acepte the new ggg key
      hasBeenValidated: false, // true if the form has already validated once
      errors: {
        hasNotAccepted: false // True if the user did not explicitely accepted the new gpg key
      }
    };
  }


  /**
   * Returns true if the passphrase is valid
   */
  get isValid() {
    return Object.values(this.state.errors).every(value => !value);
  }

  /**
   * Returns true if the component must be in a disabled mode
   */
  get mustBeDisabled() {
    return this.state.hasBeenValidated && !this.isValid;
  }

  /**
   * Handle component event handlers
   */
  bindEventHandlers() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAcceptChange = this.handleAcceptChange.bind(this);
  }


  /**
   * Whenever the users
   * @param event Dom event
   */
  async handleSubmit(event) {
    event.preventDefault();
    await this.validate();

    if (this.isValid) {
      await this.accept();
    }
  }


  /**
   * Whenever the user changes the accept new key checkbox
   */
  async handleAcceptChange() {
    await this.toggleAccept();
  }

  /**
   * Accepts the new Gpg key
   */
  async accept() {
    await this.context.onAcceptLoginNewServerKeyRequested();
  }

  /**
   * Toggle the accept checkbox
   */
  async toggleAccept() {
    await this.setState({hasAccepted: !this.state.hasAccepted});
    if (this.state.hasBeenValidated) {
      await this.validate();
    }
  }

  /**
   * Validate the security token data
   */
  async validate() {
    const {hasAccepted} = this.state;
    if (!hasAccepted) {
      await this.setState({hasBeenValidated: true, errors: {hasNotAccepted: true}});
      return;
    }
    await this.setState({hasBeenValidated: true, errors: {}});
  }


  /**
   * Render the component
   */
  render() {
    const disabledClassName = this.mustBeDisabled ? 'disabled' : '';
    return (
      <div>
        <h2>Sorry, the server key has changed </h2>
        <p>For security reasons please check with your administrator that this is a change that they initiated. The new fingerprint: </p>
        <p>{this.props.fingerprint}</p>
        <form
          acceptCharset="utf-8"
          onSubmit={this.handleSubmit}>
          <div className="input checkbox">
            <input
              id="accept-new-key"
              type="checkbox"
              name="accept-new-key"
              value={this.state.hasAccepted}
              onChange={this.handleAcceptChange}/>
            <label htmlFor="accept-new-key">
              Yes I checked and it is all fine.
            </label>
          </div>
          {this.state.hasBeenValidated &&
          <>
            <br/>
            {this.state.errors.hasNotAccepted &&
            <div className="has-not-accepted error message">You must accept the new server key</div>
            }
          </>
          }
          <div className="form-actions">
            <button
              type="submit"
              className={`button primary big ${disabledClassName}`}
              role="button"
              disabled={this.mustBeDisabled}>
              Accept new key
            </button>
          </div>
        </form>
      </div>
    );
  }
}

AcceptLoginServerKeyChange.contextType = AuthenticationContext;
AcceptLoginServerKeyChange.propTypes = {
  fingerprint: PropTypes.any // The server key fingerprint
};
export default AcceptLoginServerKeyChange;
