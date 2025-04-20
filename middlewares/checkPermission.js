const { Role, Permission } = require('../models');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user?.role_id;
      
      if (!roleId) {
        return res.status(401).json({ message: 'Unauthorized - No role assigned' });
      }

      // Get role with its permissions
      const role = await Role.findOne({
        where: { id: roleId },
        include: [{
          model: Permission,
          as: 'permissions',
          attributes: ['permission_title']
        }]
      });

      if (!role) {
        return res.status(401).json({ message: 'Unauthorized - Invalid role' });
      }

      // Check if role has the required permission
      const hasPermission = role.permissions.some(
        permission => permission.permission_title === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = checkPermission; 