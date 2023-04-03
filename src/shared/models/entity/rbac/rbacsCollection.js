/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         4.O.0
 */

import RbacEntity from "./rbacEntity";
import EntityCollection from "../abstract/entityCollection";
import EntitySchema from "../abstract/entitySchema";
// import {assertString, assertUuid} from "../../../utils/assertions";

const ENTITY_NAME = 'Rbacs';
const RULE_UNIQUE_ID = 'unique_id';

class RbacsCollection extends EntityCollection {
  /**
   * @inheritDoc
   */
  constructor(collectionDto) {
    super(EntitySchema.validate(
      RbacsCollection.ENTITY_NAME,
      collectionDto,
      RbacsCollection.getSchema()
    ));

    // /*
    //  * Check if resource ids are unique
    //  * Why not this.push? It is faster than adding items one by one
    //  */
    // const ids = this._props.map(resource => resource.id);
    // ids.sort().sort((a, b) => {
    //   if (a === b) {
    //     throw new EntityCollectionError(0, ResourcesCollection.RULE_UNIQUE_ID, `Resource id ${a} already exists.`);
    //   }
    // });

    // Directly push into the private property _items[]
    this._props.forEach(dto => {
      this._items.push(new RbacEntity(dto));
    });

    // We do not keep original props
    this._props = null;
  }

  /**
   * Get the collection schema
   *
   * @returns {Object} schema
   */
  static getSchema() {
    return {
      "type": "array",
      "items": RbacEntity.getSchema(),
    };
  }

  /**
   * Get the array of entity
   * @returns {Array<RbacEntity>}
   */
  get rbacs() {
    return this._items;
  }

  /*
   * ==================================================
   * Serialization
   * ==================================================
   */

  /**
   * Return a DTO used to bulk update the rbacs
   *
   * @returns {array}
   */
  toBulkUpdateDto() {
    return this.items.map(rbac => rbac.toUpdateDto());
  }

  /*
   * ==================================================
   * Setters
   * ==================================================
   */

  /**
   * Push a copy of the item to the collection
   * @param {object} dto A Dto or an entity type managed by the collection
   */
  push(dto) {
    if (!dto || typeof dto !== 'object') {
      throw new TypeError('The function expect an object as parameter');
    }
    if (dto instanceof RbacEntity) {
      dto = dto.toDto(RbacEntity.ALL_CONTAIN_OPTIONS); // deep clone
    }
    const entity = new RbacEntity(dto); // validate

    /*
     * Build rules
     * this.assertUniqueId(entity);
     */

    super.push(entity);
  }

  /**
   * Find the first rbac matching the given role identifier and ui action name.
   * @param {RoleEntity} role The role
   * @param {string} name The ui action name
   * @returns {RbacEntity}
   */
  findRbacByRoleAndUiActionName(role, name) {
    /*
     * assertUuid(roleId, "The role id should be a valid uuid.");
     * assertString(name, "The name should be a valid string.");
     */
    return this.rbacs.find(rbac => rbac.roleId === role.id && rbac.uiAction?.name === name);
  }

  /**
   * Find the first rbac matching the given ui action name.
   * @param {string} name The ui action name
   * @returns {RbacEntity}
   */
  findRbacByActionName(name) {
    /*
     * assertUuid(roleId, "The role id should be a valid uuid.");
     * assertString(name, "The name should be a valid string.");
     */
    return this.rbacs.find(rbac => rbac.uiAction?.name === name);
  }

  /**
   * Add or replace an existing rbac entity.
   * @param {RbacEntity} rbac The rbac entity to add or replace.
   */
  addOrReplace(rbac) {
    const length = this.items.length;
    let i = 0;
    for (; i < length; i++) {
      const existingRbac = this.items[i];
      if (existingRbac.id === rbac.id) {
        this._items[i] = rbac;
        return;
      }
    }

    this.push(rbac);
  }

  /**
   * Remove a rbac
   * @param {RbacEntity} rbac The rbac entity to add or replace.
   */
  remove(rbac) {
    const length = this.items.length;
    let i = 0;
    for (; i < length; i++) {
      const existingRbac = this.items[i];
      if (existingRbac.id === rbac.id) {
        this._items.splice(i, 1);
        return;
      }
    }
  }

  /*
   * ==================================================
   * Static getters
   * ==================================================
   */
  /**
   * RbacsCollection.ENTITY_NAME
   * @returns {string}
   */
  static get ENTITY_NAME() {
    return ENTITY_NAME;
  }

  /**
   * RbacsCollection.RULE_UNIQUE_ID
   * @returns {string}
   */
  static get RULE_UNIQUE_ID() {
    return RULE_UNIQUE_ID;
  }
}

export default RbacsCollection;
