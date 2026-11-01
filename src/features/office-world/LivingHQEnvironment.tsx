"use client";

/**
 * Exterior campus scenery intentionally disabled.
 *
 * MEX-NEX Living HQ is an interior-only office experience: the camera should
 * frame the connected office rooms, not a surrounding city, street, or campus.
 * Keep this named scene group as a compatibility anchor for existing scene
 * composition while the interior architecture is developed.
 */
export function LivingHQEnvironment() {
  return <group name="mex-nex-interior-only-environment" />;
}
