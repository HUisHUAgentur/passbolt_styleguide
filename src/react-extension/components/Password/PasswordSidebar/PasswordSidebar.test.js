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

/**
 * Unit tests on PasswordSidebar in regard of specifications
 */

import React from 'react';
import {
  defaultAppContext, defaultProps
} from "./PasswordSidebar.test.data";
import PasswordSidebarPage from "./PasswordSidebar.test.page";
import {ActionFeedbackContext} from "../../../contexts/ActionFeedbackContext";

jest.mock("./PasswordSidebarInformationSection", () => () => <></>);
jest.mock("./PasswordSidebarActivitySection", () => () => <></>);
jest.mock("./PasswordSidebarPermissionsSection", () => () => <></>);
jest.mock("./PasswordSidebarDescriptionSection", () => () => <></>);
jest.mock("./PasswordSidebarTagSection", () => () => <></>);
jest.mock("./PasswordSidebarCommentSection", () => () => <></>);

beforeEach(() => {
  jest.resetModules();
});

describe("See Resource Sidebar", () => {
  let page; // The page to test against
  const context = defaultAppContext(); // The applicative context
  const props = defaultProps(); // The props to pass
  const mockContextRequest = implementation => jest.spyOn(context.port, 'request').mockImplementation(implementation);
  const copyClipboardMockImpl = jest.fn((message, data) => data);

  describe(' As LU I can see a resource', () => {
    /**
     * Given a selected resource
     * Then I should see the secondary sidebar
     * And I should be able to identify the name
     * And I should be able to see the permalink
     */

    beforeEach(() => {
      page = new PasswordSidebarPage(context, props);
    });

    it('I should see a resource', () => {
      expect(page.exists()).toBeTruthy();
    });

    it('I should be able to identify the name and the permalink', async() => {
      mockContextRequest(copyClipboardMockImpl);
      jest.spyOn(ActionFeedbackContext._currentValue, 'displaySuccess').mockImplementation(() => {});

      expect(page.name).toBe(props.resourceWorkspaceContext.details.resource.name);
      expect(page.subtitle).toBe('resource');
      await page.selectPermalink();
      expect(context.port.request).toHaveBeenCalledWith("passbolt.clipboard.copy", `${context.userSettings.getTrustedDomain()}/app/passwords/view/${props.resourceWorkspaceContext.details.resource.id}`);
      expect(ActionFeedbackContext._currentValue.displaySuccess).toHaveBeenCalledWith("The permalink has been copied to clipboard");
    });

    it('As LU I should be able to close the folder details', async() => {
      await page.closeResourceDetails();
      expect(props.resourceWorkspaceContext.onLockDetail).toHaveBeenCalled();
    });
  });
});
