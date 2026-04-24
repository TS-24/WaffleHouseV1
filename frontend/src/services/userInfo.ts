import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';

/**
 * Database schema for users table:
 * - id: uuid string
 * - first_name: text string
 * - last_name: text string
 * - email: text string
 * - Major: text string
 * - Year: bigint number (graduation year)
 */

interface DatabaseUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  Major: string;
  Year: number;
  advisor?: string;
}

/**
 * Maps database user record to UserProfile type
 * Combines first_name and last_name into single name field
 */
function mapDatabaseUserToProfile(dbUser: DatabaseUser): UserProfile {
  return {
    name: `${dbUser.first_name} ${dbUser.last_name}`.trim(),
    major: dbUser.Major || 'Undeclared',
    year: dbUser.Year?.toString() || 'Unknown',
    advisor: dbUser.advisor || 'Not Assigned',
  };
}

/**
 * Fetches the current user's profile
 * @returns UserProfile object with user information
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) {
    throw new Error('User is not authenticated');
  }

  const userId = session.user.id;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('User profile not found');

  return mapDatabaseUserToProfile(data as DatabaseUser);
}

/**
 * Fetches a specific user's profile by ID
 * @param userId - The user's UUID
 * @returns UserProfile object with user information
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('User profile not found');

  return mapDatabaseUserToProfile(data as DatabaseUser);
}

/**
 * Updates user's name (both first and last name)
 * @param userId - The user's UUID
 * @param fullName - The full name to set (will be split into first and last)
 */
export async function updateUserName(userId: string, fullName: string): Promise<void> {
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const { error } = await supabase
    .from('users')
    .update({
      first_name: firstName,
      last_name: lastName,
    })
    .eq('id', userId);

  if (error) throw error;
}

/**
 * Updates user's major
 * @param userId - The user's UUID
 * @param major - The new major to set
 */
export async function updateUserMajor(userId: string, major: string): Promise<void> {
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const { error } = await supabase
    .from('users')
    .update({ Major: major })
    .eq('id', userId);

  if (error) throw error;
}

/**
 * Updates user's graduation year
 * @param userId - The user's UUID
 * @param year - The graduation year (as number or string)
 */
export async function updateUserYear(userId: string, year: string | number): Promise<void> {
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const yearNumber = typeof year === 'string' ? parseInt(year, 10) : year;

  const { error } = await supabase
    .from('users')
    .update({ Year: yearNumber })
    .eq('id', userId);

  if (error) throw error;
}

/**
 * Updates user's advisor
 * @param userId - The user's UUID
 * @param advisor - The new advisor name to set
 */
export async function updateUserAdvisor(userId: string, advisor: string): Promise<void> {
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const { error } = await supabase
    .from('users')
    .update({ advisor })
    .eq('id', userId);

  if (error) throw error;
}

/**
 * Updates multiple user profile fields at once
 * @param userId - The user's UUID
 * @param updates - Partial UserProfile with fields to update
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const dbUpdates: any = {};

  if (updates.name) {
    const nameParts = updates.name.trim().split(' ');
    dbUpdates.first_name = nameParts[0] || '';
    dbUpdates.last_name = nameParts.slice(1).join(' ') || '';
  }

  if (updates.major) {
    dbUpdates.Major = updates.major;
  }

  if (updates.year) {
    dbUpdates.Year = parseInt(updates.year, 10);
  }

  if (updates.advisor) {
    dbUpdates.advisor = updates.advisor;
  }

  const { error } = await supabase
    .from('users')
    .update(dbUpdates)
    .eq('id', userId);

  if (error) throw error;
}
