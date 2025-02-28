function canJump(nums) {
  let maxReach = 0; // Farthest index we can reach
  const lastIndex = nums.length - 1;

  for (let i = 0; i < nums.length; i++) {
    // If the current index is beyond the farthest we can reach, return false
    if (i > maxReach) {
      return false;
    }

    // Update the farthest index we can reach
    maxReach = Math.max(maxReach, i + nums[i]);

    // If we can reach or surpass the last index, return true
    if (maxReach >= lastIndex) {
      return true;
    }
  }

  return false;
}
