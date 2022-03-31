/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */

import React from "react";
import PropTypes from "prop-types";
import {Trans, withTranslation} from "react-i18next";
import DialogWrapper from "../../Common/Dialog/DialogWrapper/DialogWrapper";
import Icon from "../../Common/Icons/Icon";
import FormSubmitButton from "../../Common/Inputs/FormSubmitButton/FormSubmitButton";
import FormCancelButton from "../../Common/Inputs/FormSubmitButton/FormCancelButton";
import {withAppContext} from "../../../contexts/AppContext";

/** Resource password max length */
const RESOURCE_PASSWORD_MAX_LENGTH = 4096;

/**
 * This component allows to display the provide organization key for the administration
 */
class ProvideAccountRecoveryOrganizationKey extends React.Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindCallbacks();
    this.createInputRef();
  }

  /**
   * Get default state
   * @returns {*}
   */
  get defaultState() {
    return {
      processing: false, // component is processing or not
      key: "", // The organization private armored key
      keyError: "", // The error organization recovery key
      password: "", // The organization private key password
      passwordError: "",
      passwordWarning: "",
      passphraseStyle: {
        background: "",
        color: ""
      },
      securityTokenStyle: {
        background: this.props.context.userSettings.getSecurityTokenBackgroundColor(),
        color: this.props.context.userSettings.getSecurityTokenTextColor(),
      },
      viewPassword: false,
      hasAlreadyBeenValidated: false, // True if the form has already been submitted onc
      selectedFile: null
    };
  }

  /**
   * Bind callbacks methods
   */
  bindCallbacks() {
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyInputKeyUp = this.handleKeyInputKeyUp.bind(this);
    this.handlePasswordInputFocus = this.handlePasswordInputFocus.bind(this);
    this.handlePasswordInputBlur = this.handlePasswordInputBlur.bind(this);
    this.handlePasswordInputKeyUp = this.handlePasswordInputKeyUp.bind(this);
    this.handleViewPasswordButtonClick = this.handleViewPasswordButtonClick.bind(this);
    this.handleSelectFile = this.handleSelectFile.bind(this);
    this.handleSelectOrganizationKeyFile = this.handleSelectOrganizationKeyFile.bind(this);
  }

  /**
   * Create DOM nodes or React elements references in order to be able to access them programmatically.
   */
  createInputRef() {
    this.keyInputRef = React.createRef();
    this.fileUploaderRef = React.createRef();
    this.passwordInputRef = React.createRef();
  }

  /**
   * Handle key input keyUp event.
   */
  handleKeyInputKeyUp() {
    if (this.state.hasAlreadyBeenValidated) {
      const state = this.validateKeyInput();
      this.setState(state);
    }
  }

  /**
   * Whenever the user select a organization key file
   * @param event The file dom event
   */
  async handleSelectOrganizationKeyFile(event) {
    const [organizationFile] = event.target.files;
    const organizationKey = await this.readOrganizationKeyFile(organizationFile);
    await this.fillOrganizationKey(organizationKey);
    this.setState({selectedFile: organizationFile});
    if (this.state.hasAlreadyBeenValidated) {
      await this.validate();
    }
  }

  /**
   * Read the selected subscription key file and returns its content in a base 64
   * @param organizationFile A subscription key file
   */
  readOrganizationKeyFile(organizationFile) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        try {
          resolve(reader.result);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsText(organizationFile);
    });
  }

  /**
   * Fill the organization key
   * @param organizationKey A subscription key
   */
  async fillOrganizationKey(organizationKey) {
    await this.setState({key: organizationKey});
  }

  /**
   * Validate the key input.
   * @return {Promise}
   */
  validateKeyInput() {
    const key = this.state.key.trim();
    let keyError = "";
    if (!key.length) {
      keyError = this.translate("An organization key is required.");
    }

    return new Promise(resolve => {
      this.setState({keyError}, resolve);
    });
  }

  /**
   * Focus the first field of the form which is in error state.
   */
  focusFirstFieldError() {
    if (this.state.keyError) {
      this.keyInputRef.current.focus();
    } else if (this.state.passwordError) {
      this.passwordInputRef.current.focus();
    }
  }

  /**
   * Handle password input keyUp event.
   */
  handlePasswordInputKeyUp() {
    if (this.state.hasAlreadyBeenValidated) {
      const state = this.validatePasswordInput();
      this.setState(state);
    } else {
      const hasResourcePasswordMaxLength = this.state.password.length >= RESOURCE_PASSWORD_MAX_LENGTH;
      const warningMessage = this.translate("Warning: this is the maximum size for this field, make sure your data was not truncated");
      const passwordWarning = hasResourcePasswordMaxLength ? warningMessage : '';
      this.setState({passwordWarning});
    }
  }

  /**
   * Handle view password button click.
   */
  handleViewPasswordButtonClick() {
    if (this.state.processing) {
      return;
    }
    this.setState({viewPassword: !this.state.viewPassword});
  }

  /**
   * Validate the password input.
   * @return {Promise}
   */
  validatePasswordInput() {
    const password = this.state.password;
    let passwordError = "";
    if (!password.length) {
      passwordError = this.translate("A password is required.");
    }

    return new Promise(resolve => {
      this.setState({passwordError: passwordError}, resolve);
    });
  }

  /**
   * Handle form input change.
   * @params {ReactEvent} The react event.
   */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  /**
   * Handle password input focus.
   */
  handlePasswordInputFocus() {
    this.setState({
      passphraseStyle: {
        background: this.props.context.userSettings.getSecurityTokenBackgroundColor(),
        color: this.props.context.userSettings.getSecurityTokenTextColor(),
      },
      securityTokenStyle: {
        background: this.props.context.userSettings.getSecurityTokenTextColor(),
        color: this.props.context.userSettings.getSecurityTokenBackgroundColor(),
      }
    });
  }

  /**
   * Handle password input blur.
   */
  handlePasswordInputBlur() {
    this.setState({
      passphraseStyle: {
        background: "",
        color: ""
      },
      securityTokenStyle: {
        background: this.props.context.userSettings.getSecurityTokenBackgroundColor(),
        color: this.props.context.userSettings.getSecurityTokenTextColor(),
      }
    });
  }

  /**
   * Handle the selection of a file by file explorer
   */
  handleSelectFile() {
    this.fileUploaderRef.current.click();
  }

  /**
   * Handle form submit event.
   * @params {ReactEvent} The react event
   * @return {Promise}
   */
  async handleFormSubmit(event) {
    event.preventDefault();

    if (!this.state.processing) {
      await this.save();
    }
  }

  /**
   * Save the changes.
   */
  async save() {
    this.setState({hasAlreadyBeenValidated: true});
    await this.toggleProcessing();

    if (!await this.validate()) {
      this.handleValidateError();
      await this.toggleProcessing();
      return;
    }

    const privateGpgKeyDto = {
      armored_key: this.state.key,
      passphrase: this.state.password
    };
    try {
      await this.props.context.port.request('passbolt.account-recovery.validate-organization-private-key', privateGpgKeyDto);
      await this.props.onSubmit(privateGpgKeyDto);
      await this.toggleProcessing();
      this.props.onClose();
    } catch (error) {
      await this.handleSubmitError(error);
      await this.toggleProcessing();
    }
  }

  /**
   * Handle save operation error.
   * @param {object} error The returned error
   */
  async handleSubmitError(error) {
    if (error.name === "UserAbortsOperationError") {
      // It can happen when the user has closed the passphrase entry dialog by instance.
      return;
    } else if (error.name === "WrongOrganizationRecoveryKeyError") {
      this.setState({expectedFingerprintError: error.expectedFingerprint});
    } else if (error.name === "InvalidMasterPasswordError") {
      this.setState({passwordError: this.translate("This is not a valid passphrase.")});
    } else if (error.name === "BadSignatureMessageGpgKeyError") {
      this.setState({keyError: error.message});
    } else if (error.name === "GpgKeyError") {
      this.setState({keyError: error.message});
    } else {
      // The component passing the onSubmit prop should take care of any unexpected errors, this code should not run.
      console.error('Uncaught uncontrolled error');
      if (typeof this.props.onError === 'undefined') {
        throw error;
      }
      this.props.onError(error);
    }
  }

  /**
   * Handle validation error.
   */
  handleValidateError() {
    this.focusFirstFieldError();
  }

  /**
   * Validate the form.
   * @return {Promise<boolean>}
   */
  async validate() {
    // Reset the form errors.
    this.setState({
      keyError: "",
      passwordError: "",
      expectedFingerprintError: ""
    });

    // Validate the form inputs.
    await Promise.all([
      this.validateKeyInput(),
      this.validatePasswordInput()
    ]);

    return this.state.keyError === "" && this.state.passwordError === "";
  }

  /**
   * Toggle the processing mode
   */
  async toggleProcessing() {
    await this.setState({processing: !this.state.processing});
  }

  /**
   * Should input be disabled? True if state is processing
   * @returns {boolean}
   */
  hasAllInputDisabled() {
    return this.state.processing;
  }

  /**
   * Handle close button click.
   */
  handleCloseClick() {
    this.props.onClose();
  }

  /**
   * format fingerprint
   * @param fingerprint
   * @returns {JSX.Element}
   */
  formatFingerprint(fingerprint) {
    if (!fingerprint) {
      return <></>;
    }
    const result = fingerprint.toUpperCase().replace(/.{4}/g, '$& ');
    return <>{result.substr(0, 24)}<br/>{result.substr(25)}</>;
  }

  /**
   * Returns the selected file's name
   */
  get selectedFilename() {
    return this.state.selectedFile ? this.state.selectedFile.name : "";
  }

  /**
   * Get the translate function
   * @returns {function(...[*]=)}
   */
  get translate() {
    return this.props.t;
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    /*
     * The parser can't find the translation for passwordStrength.label
     * To fix that we can use it in comment
     * this.translate("n/a")
     * this.translate("very weak")
     * this.translate("weak")
     * this.translate("fair")
     * this.translate("strong")
     * this.translate("very strong")
     */
    return (
      <DialogWrapper
        title={this.translate("Organization Recovery Key")}
        onClose={this.handleCloseClick}
        disabled={this.state.processing}
        className="provide-organization-recover-key-dialog">
        <form onSubmit={this.handleFormSubmit} noValidate>
          <div className="form-content provide-organization-key">
            <div className={`input textarea required ${this.state.keyError || this.state.expectedFingerprintError ? "error" : ""}`}>
              <label htmlFor="organization-recover-form-key"><Trans>Enter the private key used by your organization for account recovery</Trans></label>
              <textarea id="organization-recover-form-key" name="key" value={this.state.key}
                onKeyUp={this.handleKeyInputKeyUp} onChange={this.handleInputChange}
                disabled={this.hasAllInputDisabled()} ref={this.keyInputRef} className="required"
                placeholder='Paste the OpenPGP Private key here' required="required" autoComplete="off" autoFocus={true}/>
            </div>
            <div className="input-file-chooser-wrapper">
              <input
                type="file"
                ref={this.fileUploaderRef}
                disabled={this.hasAllInputDisabled()}
                onChange={this.handleSelectOrganizationKeyFile} />
              <div className="input text">
                <label htmlFor="dialog-import-private-key">
                  <Trans>Select a file to import</Trans>
                </label>
                <div className="input-file-inline">
                  <input
                    type="text"
                    disabled={true}
                    placeholder={this.translate("No file selected")}
                    defaultValue={this.selectedFilename} />
                  <a
                    className={`button primary ${this.hasAllInputDisabled() ? "disabled" : ""}`}
                    onClick={this.handleSelectFile}>
                    <Icon name="upload-a" />
                    <span><Trans>Choose a file</Trans></span>
                  </a>
                </div>
                {this.state.keyError &&
                  <div className="key error-message">{this.state.keyError}</div>
                }
                {this.state.expectedFingerprintError &&
                  <div className="key error-message">
                    <Trans>Error, this is not the current organization recovery key.</Trans><br/>
                    <Trans>Expected fingerprint:</Trans><br/>
                    <br/>
                    <span className="fingerprint">
                      {this.formatFingerprint(this.state.expectedFingerprintError)}
                    </span>
                  </div>
                }
              </div>
            </div>
            <div className={`input-password-wrapper input required ${this.state.passwordError ? "error" : ""}`}>
              <label htmlFor="generate-organization-key-form-password"><Trans>Organization key passphrase</Trans></label>
              <div className="input text password">
                <input id="generate-organization-key-form-password" name="password" className="required" maxLength="4096"
                  placeholder={this.translate("Passphrase")} required="required" type={this.state.viewPassword ? "text" : "password"}
                  onKeyUp={this.handlePasswordInputKeyUp} value={this.state.password}
                  onFocus={this.handlePasswordInputFocus} onBlur={this.handlePasswordInputBlur}
                  onChange={this.handleInputChange} disabled={this.hasAllInputDisabled()}
                  autoComplete="new-password"
                  ref={this.passwordInputRef}/>
                <a onClick={this.handleViewPasswordButtonClick}
                  className={`password-view button button-icon toggle ${this.state.viewPassword ? "selected" : ""}`}>
                  <Icon name='eye-open' big={true}/>
                  <span className="visually-hidden">view</span>
                </a>
                <span className="security-token" style={this.state.securityTokenStyle}>{this.props.context.userSettings.getSecurityTokenCode()}</span>
              </div>
              {this.state.passwordError &&
              <div className="input text">
                <div className="password error-message">{this.state.passwordError}</div>
              </div>
              }
              {this.state.passwordWarning &&
              <div className="input text">
                <div className="password warning message">{this.state.passwordWarning}</div>
              </div>
              }
            </div>
          </div>
          <div className="submit-wrapper clearfix">
            <FormSubmitButton disabled={this.hasAllInputDisabled()} processing={this.state.processing} value={this.translate("Submit")}/>
            <FormCancelButton disabled={this.hasAllInputDisabled()} onClick={this.handleCloseClick} />
          </div>
        </form>
      </DialogWrapper>
    );
  }
}

ProvideAccountRecoveryOrganizationKey.propTypes = {
  context: PropTypes.any.isRequired, // The application context provider
  onClose: PropTypes.func, // Callback when the dialog must be closed
  onSubmit: PropTypes.func, // Callback when the dialog must be submitted
  onError: PropTypes.func, // Callback when an error occurs
  actionFeedbackContext: PropTypes.any, // The action feedback context
  t: PropTypes.func, // The translation function
};

export default withAppContext(withTranslation('common')(ProvideAccountRecoveryOrganizationKey));
