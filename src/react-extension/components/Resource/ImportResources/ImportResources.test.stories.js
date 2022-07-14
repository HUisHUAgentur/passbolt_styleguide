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
import ImportResources from "./ImportResources";
import {defaultProps} from "./ImportResources.test.data";

export default {
  title: 'Passbolt Component/Resource/ImportResources/ImportResources',
  component: ImportResources
};

const Template = args =>
  <ImportResources {...args}/>;

export const Default = Template.bind({});
Default.args = defaultProps();
