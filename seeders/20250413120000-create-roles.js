'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First check if roles exist
    const existingRoles = await queryInterface.sequelize.query(
      'SELECT role_title FROM roles',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const existingRoleTitles = existingRoles.map(role => role.role_title);

    // Only insert roles that don't exist
    const rolesToCreate = [
      { role_title: 'Admin', created_at: new Date(), updated_at: new Date() },
      { role_title: 'User', created_at: new Date(), updated_at: new Date() },
      { role_title: 'Guest', created_at: new Date(), updated_at: new Date() }
    ].filter(role => !existingRoleTitles.includes(role.role_title));

    if (rolesToCreate.length > 0) {
      await queryInterface.bulkInsert('roles', rolesToCreate);
    }

    // Get all roles (both existing and newly created)
    const [allRoles] = await queryInterface.sequelize.query(
      'SELECT id, role_title FROM roles'
    );

    // First check if permissions exist
    const existingPermissions = await queryInterface.sequelize.query(
      'SELECT permission_title FROM permissions',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const existingPermissionTitles = existingPermissions.map(perm => perm.permission_title);

    // Define the final set of permissions we want
    const permissionsToCreate = [
      { permission_title: 'create_note' },
      { permission_title: 'view_note' },
      { permission_title: 'update_note' },
      { permission_title: 'delete_note' },
      { permission_title: 'manage_users' },
      { permission_title: 'manage_roles' }
    ].filter(perm => !existingPermissionTitles.includes(perm.permission_title));

    if (permissionsToCreate.length > 0) {
      await queryInterface.bulkInsert('permissions', permissionsToCreate);
    }

    // Delete any duplicate or unnecessary permissions
    await queryInterface.sequelize.query(
      `DELETE FROM permissions WHERE permission_title IN ('read_note', 'edit_note')`
    );

    // Update any existing edit_note permissions to update_note
    const [allPermissions] = await queryInterface.sequelize.query(
      'SELECT id, permission_title FROM permissions'
    );

    // Check existing role-permission associations
    const existingRolePermissions = await queryInterface.sequelize.query(
      'SELECT role_id, permission_id FROM role_permissions',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create role-permission associations that don't exist
    const rolePermissions = [];
    
    // Admin gets all permissions
    const adminRole = allRoles.find(role => role.role_title === 'Admin');
    allPermissions.forEach(permission => {
      if (!existingRolePermissions.some(rp => 
        rp.role_id === adminRole.id && rp.permission_id === permission.id
      )) {
        rolePermissions.push({
          role_id: adminRole.id,
          permission_id: permission.id
        });
      }
    });

    // User gets note-related permissions only
    const userRole = allRoles.find(role => role.role_title === 'User');
    allPermissions
      .filter(p => p.permission_title.includes('note'))
      .forEach(permission => {
        if (!existingRolePermissions.some(rp => 
          rp.role_id === userRole.id && rp.permission_id === permission.id
        )) {
          rolePermissions.push({
            role_id: userRole.id,
            permission_id: permission.id
          });
        }
      });

    // Guest gets only view_note permission
    const guestRole = allRoles.find(role => role.role_title === 'Guest');
    const viewPermission = allPermissions.find(p => p.permission_title === 'view_note');
    if (viewPermission && !existingRolePermissions.some(rp => 
      rp.role_id === guestRole.id && rp.permission_id === viewPermission.id
    )) {
      rolePermissions.push({
        role_id: guestRole.id,
        permission_id: viewPermission.id
      });
    }

    if (rolePermissions.length > 0) {
      return queryInterface.bulkInsert('role_permissions', rolePermissions);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
}; 