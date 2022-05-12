/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2021 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2021 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.3.0
 *
 */
import React from "react";
import SimpleBar from "../SimpleBar/SimpleBar";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {Trans, withTranslation} from "react-i18next";
import {withAppContext} from "../../contexts/AppContext";
import Icon from "../../../react-extension/components/Common/Icons/Icon";
import Password from "../../../shared/components/Password/Password";
import {SecretGenerator} from "../../../shared/lib/SecretGenerator/SecretGenerator";
import PasswordComplexity from "../../../shared/components/PasswordComplexity/PasswordComplexity";

class SaveResource extends React.Component {
  constructor(props) {
    super(props);
    this.initEventHandlers();
    this.state = this.getDefaultState();
  }

  componentDidMount() {
    this.loadPasswordMetaFromTabForm();
  }

  initEventHandlers() {
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  getDefaultState() {
    return {
      loaded: false,
      error: "",
      name: "",
      nameError: "",
      username: "",
      usernameError: "",
      uri: "",
      uriError: "",
      password: "",
      passwordError: "",
      passwordEntropy: 0,
    };
  }

  /**
   * Get the translate function
   * @returns {function(...[*]=)}
   */
  get translate() {
    return this.props.t;
  }

  async loadPasswordMetaFromTabForm() {
    const {name, uri, username, secret_clear} = await this.props.context.port.request("passbolt.quickaccess.prepare-autosave");
    this.setState({name, uri, username, password: secret_clear});
    this.loadPassword(secret_clear);
    this.setState({loaded: true});
  }

  handleClose() {
    window.close();
  }

  validateFields() {
    const state = {
      nameError: "",
      passwordError: ""
    };
    let isValid = true;

    if (this.state.name === "") {
      state.nameError = this.translate("A name is required.");
      isValid = false;
    }

    if (this.state.password === "") {
      state.passwordError = this.translate("A password is required.");
      isValid = false;
    }

    this.setState(state);
    return isValid;
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    this.setState({
      processing: true,
      error: "",
      nameError: "",
      usernameError: "",
      uriError: "",
    });

    if (!this.validateFields()) {
      this.setState({processing: false});
      return;
    }

    const resourceDto = {
      name: this.state.name,
      username: this.state.username,
      uri: this.state.uri
    };
    const secretDto = this.state.password;

    try {
      await this.props.context.port.request("passbolt.resources.create", resourceDto, secretDto);
      this.handleClose();
    } catch (error) {
      this.handleSubmitError(error);
    }
  }

  handleSubmitError(error) {
    if (error.name === "PassboltApiFetchError"
      && error.data.code === 400 && error.data.body
      && (error.data.body.name || error.data.body.username || error.data.body.uri)) {
      // Could not validate resource data.
      this.setState({
        nameError: this.formatValidationFieldError(error.data.body.name),
        usernameError: this.formatValidationFieldError(error.data.body.username),
        uriError: this.formatValidationFieldError(error.data.body.uri),
        processing: false
      });
    } else {
      // An unexpected error occured.
      this.setState({
        error: error.message,
        processing: false
      });
    }
  }

  formatValidationFieldError(fieldErrors) {
    if (!fieldErrors) {
      return "";
    }
    return Object.values(fieldErrors).join(', ');
  }

  handlePasswordChange(event) {
    this.loadPassword(event.target.value);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  loadPassword(password) {
    const passwordEntropy = SecretGenerator.entropy(this.state.password);
    this.setState({password, passwordEntropy});
  }

  render() {
    return (
      <div className="resource-auto-save">
        <h1 className="title"><Trans>Would you like to save this credential ?</Trans></h1>
        <form onSubmit={this.handleFormSubmit}>
          <SimpleBar className="resource-auto-save-form">
            <div className="form-container">
              <div className={`input text required ${this.state.nameError ? "error" : ""}`}>
                <label htmlFor="name"><Trans>Name</Trans></label>
                <input name="name" value={this.state.name} onChange={this.handleInputChange} disabled={this.state.processing}
                  className="required fluid" maxLength="255" type="text" id="name" autoComplete="off" />
                {this.state.nameError &&
                <div className="error-message">{this.state.nameError}</div>
                }
              </div>
              <div className={`input text ${this.state.uriError ? "error" : ""}`}>
                <label htmlFor="uri"><Trans>URL</Trans></label>
                <input name="uri" value={this.state.uri} onChange={this.handleInputChange} disabled={this.state.processing}
                  className="fluid" maxLength="1024" type="text" id="uri" autoComplete="off" />
                {this.state.uriError &&
                <div className="error-message">{this.state.uriError}</div>
                }
              </div>
              <div className="input text">
                <label htmlFor="username"><Trans>Username</Trans></label>
                <input name="username" value={this.state.username} onChange={this.handleInputChange} disabled={this.state.processing}
                  className="fluid" maxLength="255" type="text" id="username" autoComplete="off" />
                {this.state.usernameError &&
                <div className="error-message">{this.state.usernameError}</div>
                }
              </div>
              <div className={`input-password-wrapper input required ${this.state.passwordError ? "error" : ""}`}>
                <label htmlFor="password"><Trans>Password</Trans></label>
                <div className="password-button-inline">
                  <Password name="password" value={this.state.password} preview={true} onChange={this.handlePasswordChange} disabled={this.state.processing}
                    placeholder={this.translate('Password')} id="password" autoComplete="new-password"/>
                </div>
                <PasswordComplexity entropy={this.state.passwordEntropy} error={Boolean(this.state.passwordError)}/>
                {this.state.passwordError &&
                  <div className="error-message">{this.state.passwordError}</div>
                }
              </div>
            </div>
          </SimpleBar>
          <div className="submit-wrapper input flex-row-end">
            <a className="cancel" role="button" onClick={this.handleClose}>{this.translate("no, thanks")}</a>
            <button type="submit" className={`button primary big ${this.state.processing ? "processing" : ""}`} role="button"
              disabled={this.state.processing}>
              <Trans>save</Trans>
              {this.state.processing &&
                <Icon name="spinner"/>
              }
            </button>
            {this.state.error &&
            <div className="error-message">{this.state.error}</div>
            }
          </div>
        </form>
      </div>
    );
  }
}

SaveResource.propTypes = {
  context: PropTypes.any, // The application context
  history: PropTypes.object,
  t: PropTypes.func, // The translation function
};

export default withAppContext(withRouter(withTranslation('common')(SaveResource)));
