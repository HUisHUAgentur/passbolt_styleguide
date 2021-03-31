
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
 * @since         2.11.0
 */

import {fireEvent, render, waitFor} from "@testing-library/react";
import AppContext from "../../../contexts/AppContext";
import React from "react";
import PropTypes from "prop-types";
import ManageDialogs from "../../Common/Dialog/ManageDialogs/ManageDialogs";
import DialogContextProvider from "../../../contexts/DialogContext";
import PasswordWorkspaceMainMenu from "./PasswordWorkspaceMainMenu";
import MockTranslationProvider from "../../../test/mock/components/Internationalisation/MockTranslationProvider";

/**
 * The PasswordSidebarCommentSection component represented as a page
 */
export default class PasswordWorkspaceMainMenuPage {
  /**
   * Default constructor
   * @param appContext An app context
   * @param props Props to attach
   */
  constructor(appContext, props) {
    this._page = render(
      <MockTranslationProvider>
        <AppContextProvider context={appContext}>
          <DialogContextProvider>
            <ManageDialogs/>
            <PasswordWorkspaceMainMenu {...props}/>
          </DialogContextProvider>
        </AppContextProvider>
      </MockTranslationProvider>
    );
    this.setupPageObjects();
  }

  /**
   * Set up the objects of the page
   */
  setupPageObjects() {
    this._displayMenu = new DisplayMainMenuPageObject(this._page.container);
  }

  /**
   * Returns the page object of display comments
   */
  get displayMenu() {
    return this._displayMenu;
  }
}

/**
 * Page object for the main menu element
 */
class DisplayMainMenuPageObject {
  /**
   * Default constructor
   * @param container The container which includes the AddComment Component
   */
  constructor(container) {
    this._container = container;
  }

  /**
   * Returns the menu elements of password workspace menu
   */
  get menu() {
    return this._container.querySelector('.dropdown');
  }

  /**
   * Returns the create menu elements of password workspace menu
   */
  get createMenu() {
    return this._container.querySelector('.dropdown .button.create.primary.ready');
  }

  /**
   * Returns the create menu disabled elements of password workspace menu
   */
  get createMenuDisabled() {
    return this._container.querySelector('.dropdown .button.create.primary.ready.disabled');
  }

  /**
   * Returns the new password menu elements of password workspace menu
   */
  get newPasswordMenu() {
    return this._container.querySelector('#password_action');
  }

  /**
   * Returns the new folder menu elements of password workspace menu
   */
  get newFolderMenu() {
    return this._container.querySelector('#folder_action');
  }

  /**
   * Returns true if the page object exists in the container
   */
  exists() {
    return this.menu !== null;
  }

  /** Click on the action menu */
  async clickOnMenu(element)  {
    const leftClick = {button: 0};
    fireEvent.click(element, leftClick);
    await waitFor(() => {});
  }
}

/**
 * Custom application provider (used to force the re-rendering when context changes )
 */
class AppContextProvider extends React.Component {
  /**
   * Default constructor
   * @param props Props component
   */
  constructor(props) {
    super(props);
    this.state = props.context;
  }

  componentDidMount() {
    this.setState({setContext: this.setState.bind(this)});
  }

  /**
   * Render the component
   */
  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

AppContextProvider.propTypes = {
  context: PropTypes.object,
  children: PropTypes.any
};
