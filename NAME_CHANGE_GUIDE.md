# Project Name Change Guide: temu → sisloguin

This document guides you through the changes needed after renaming the project from "temu" to "sisloguin".

## Key Changes Made

1. **Configuration Files**:
   - Updated Supabase authentication token storage key from `temu-auth-token` to `sisloguin-auth-token`
   - Updated localStorage keys from `temuUser` to `sisloguinUser`
   - Updated package.json name to "sisloguin"

2. **Styling**:
   - Changed CSS class prefix in Tailwind config from `temu-` to `sisloguin-`
   - Updated all CSS classes in component files (57 files updated)
   - Modified Tailwind component definitions in index.css

3. **Metadata**:
   - Updated website title and meta descriptions in index.html
   - Changed social media handles from @temu_rewards to @sisloguin_rewards

## What You Need to Do

If you're migrating an existing installation or working with this codebase, ensure that:

1. Your database credentials are correctly updated in `src/lib/supabase.ts`
2. Any locally stored tokens are cleared and users are logged out/in again to update their stored tokens
3. Any custom styling or components that reference the old `temu-` classes are updated

## Potential Issues

- Users may need to log out and log back in to refresh their authentication tokens
- Any third-party integrations that referenced the old project name will need to be updated
- Custom styles or components might need adjustment if they were using the `temu-` prefix

## Important Files Modified

- `src/lib/supabase.ts`: Updated authentication token storage key
- `src/utils/auth/updateUserProfile.ts`: Updated localStorage references
- `tailwind.config.ts`: Updated theme name
- `src/index.css`: Updated CSS component definitions
- `index.html`: Updated website title and metadata
- Various component files: Updated CSS class references from `temu-` to `sisloguin-`

If you encounter any issues with the name change, please contact the project maintainers. 