function hasNestedValue(obj, path, delimiter="_") {
    const keys = path.split(delimiter);
    let current = obj;
  
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return false;
      }
    }
  
    return true;
}
  