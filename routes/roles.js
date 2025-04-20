const express = require('express');
const router = express.Router();
const { Role, Permission, RolePermission } = require('../models');

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'role_title'],
      order: [['id', 'ASC']]
    });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Error fetching roles', error: error.message });
  }
});

// Get all permissions
router.get('/permissions', async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ['id', 'permission_title'],
      order: [['permission_title', 'ASC']]
    });
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Error fetching permissions', error: error.message });
  }
});

// Get permissions for a specific role
router.get('/:id/permissions', async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] }
      }]
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role.permissions);
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({ message: 'Error fetching role permissions', error: error.message });
  }
});

// Update permissions for a role
router.put('/:id/permissions', async (req, res) => {
  const { permissions } = req.body;
  const roleId = req.params.id;

  try {
    console.log('Received update request:', {
      roleId,
      permissions,
      body: req.body
    });

    // Validate input
    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ 
        message: 'Invalid permissions format',
        received: permissions
      });
    }

    // Check if role exists
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ 
        message: 'Role not found',
        roleId 
      });
    }

    // Verify all permissions exist
    const existingPermissions = await Permission.findAll({
      where: {
        id: permissions
      }
    });

    if (existingPermissions.length !== permissions.length) {
      const foundIds = existingPermissions.map(p => p.id);
      const invalidIds = permissions.filter(id => !foundIds.includes(id));
      return res.status(400).json({
        message: 'Some permission IDs are invalid',
        invalidIds
      });
    }

    // Start a transaction
    const transaction = await Role.sequelize.transaction();

    try {
      // Remove existing permissions
      await RolePermission.destroy({
        where: { role_id: roleId },
        transaction
      });

      if (permissions.length > 0) {
        // Create new role-permission associations
        const rolePermissions = permissions.map(permissionId => ({
          role_id: parseInt(roleId),
          permission_id: parseInt(permissionId)
        }));

        await RolePermission.bulkCreate(rolePermissions, {
          transaction,
          fields: ['role_id', 'permission_id']
        });
      }

      // Commit the transaction
      await transaction.commit();

      // Fetch updated permissions to return in response
      const updatedRole = await Role.findByPk(roleId, {
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }]
      });

      console.log('Successfully updated permissions:', {
        roleId,
        permissions: updatedRole.permissions.map(p => p.id)
      });

      res.json({
        message: 'Permissions updated successfully',
        role: {
          id: updatedRole.id,
          role_title: updatedRole.role_title,
          permissions: updatedRole.permissions
        }
      });
    } catch (error) {
      // If there's an error, rollback the transaction
      await transaction.rollback();
      console.error('Transaction error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating permissions:', {
      error: error.message,
      stack: error.stack,
      roleId,
      permissions
    });

    res.status(500).json({ 
      message: 'Error updating permissions',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        roleId,
        permissions
      } : undefined
    });
  }
});

module.exports = router; 