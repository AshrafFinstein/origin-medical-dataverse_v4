export function defineAbilitiesFor(moduleId: string, actionId: string): boolean {
  let permissionDataString = '';

  if (typeof window !== 'undefined') {
    permissionDataString = localStorage.getItem('permission') ?? '';
  }
  
    if (!permissionDataString) {
      return false;
    }
  
    try {
      const permissionData = JSON.parse(permissionDataString) as Array<{
        ModuleId: string;
        ActionId: string[];
      }>;
  
      const module = permissionData.find(item => item.ModuleId === moduleId);
      if (module && module.ActionId.includes(actionId)) {
        return true;
      }
    } catch (error) {
      console.error('Error parsing permission data from localStorage:', error);
    }
  
    return false;
}

