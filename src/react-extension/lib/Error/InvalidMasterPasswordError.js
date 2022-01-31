/**
 * Invalid master password error
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */

class InvalidMasterPasswordError extends Error {
  constructor(message) {
    message = message || 'This is not a valid passphrase';
    super(message);
    this.name = 'InvalidMasterPasswordError';
  }
}

export default InvalidMasterPasswordError;
