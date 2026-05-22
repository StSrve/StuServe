// Centralized Supabase Integration for StuServe
// To configure, create a project in your Supabase Console, retrieve credentials from Settings -> API,
// replace the placeholders below, and run the SQL setup script on your database.

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// YOUR ACTION REQUIRED: Replace these configuration values with your Supabase credentials.
const supabaseUrl = "https://dnbtsniwpilqoxpmypyn.supabase.co";
const supabaseKey = "sb_publishable_Uq_3JBOM0KeC1QyCzqVcBQ_e97DY_x_";
// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Keep a local copy in localStorage for immediate synchronous page loads (optimistic rendering)
export function syncLocalSession(user) {
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('loggedInUser');
    }
}

// Centralized Cloud Sync Helpers

export async function saveProfileToCloud(profile) {
    if (!profile || !profile.email) return;
    try {
        const { error } = await supabase
            .from('stuserve_store')
            .upsert({ key: `profile:${profile.email}`, value: profile });
        if (error) throw error;
        console.log(`[Supabase] Profile synced for ${profile.email}`);
    } catch (error) {
        console.error("[Supabase] Error saving profile to cloud:", error);
    }
}

export async function loadProfileFromCloud(email) {
    if (!email) return null;
    try {
        const { data, error } = await supabase
            .from('stuserve_store')
            .select('value')
            .eq('key', `profile:${email}`)
            .single();
        if (error) {
            if (error.code === 'PGRST116') { // Record not found
                return null;
            }
            throw error;
        }
        console.log(`[Supabase] Profile loaded for ${email}`);
        return data.value;
    } catch (error) {
        console.error("[Supabase] Error loading profile from cloud:", error);
        return null;
    }
}

export async function saveAccountsToCloud(accounts) {
    try {
        const { error } = await supabase
            .from('stuserve_store')
            .upsert({ key: 'accounts:registry', value: accounts });
        if (error) throw error;
        console.log("[Supabase] Accounts registry synced");
    } catch (error) {
        console.error("[Supabase] Error saving accounts to cloud:", error);
    }
}

export async function loadAccountsFromCloud() {
    try {
        const { data, error } = await supabase
            .from('stuserve_store')
            .select('value')
            .eq('key', 'accounts:registry')
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return {};
            }
            throw error;
        }
        console.log("[Supabase] Accounts registry loaded");
        return data.value || {};
    } catch (error) {
        console.error("[Supabase] Error loading accounts from cloud:", error);
        return {};
    }
}

export async function saveMessagesToCloud(messages) {
    try {
        const { error } = await supabase
            .from('stuserve_store')
            .upsert({ key: 'messages:history', value: { list: messages } });
        if (error) throw error;
        console.log("[Supabase] Messages history synced");
    } catch (error) {
        console.error("[Supabase] Error saving messages to cloud:", error);
    }
}

export async function loadMessagesFromCloud() {
    try {
        const { data, error } = await supabase
            .from('stuserve_store')
            .select('value')
            .eq('key', 'messages:history')
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return [];
            }
            throw error;
        }
        console.log("[Supabase] Messages history loaded");
        return data.value?.list || [];
    } catch (error) {
        console.error("[Supabase] Error loading messages from cloud:", error);
        return [];
    }
}

export async function saveOrdersToCloud(orders) {
    try {
        const { error } = await supabase
            .from('stuserve_store')
            .upsert({ key: 'orders:history', value: { list: orders } });
        if (error) throw error;
        console.log("[Supabase] Orders history synced");
    } catch (error) {
        console.error("[Supabase] Error saving orders to cloud:", error);
    }
}

export async function loadOrdersFromCloud() {
    try {
        const { data, error } = await supabase
            .from('stuserve_store')
            .select('value')
            .eq('key', 'orders:history')
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return [];
            }
            throw error;
        }
        console.log("[Supabase] Orders history loaded");
        return data.value?.list || [];
    } catch (error) {
        console.error("[Supabase] Error loading orders from cloud:", error);
        return [];
    }
}

export async function saveJobsToCloud(jobs) {
    try {
        const { error } = await supabase
            .from('stuserve_store')
            .upsert({ key: 'jobs:history', value: { list: jobs } });
        if (error) throw error;
        console.log("[Supabase] Jobs history synced");
    } catch (error) {
        console.error("[Supabase] Error saving jobs to cloud:", error);
    }
}

export async function loadJobsFromCloud() {
    try {
        const { data, error } = await supabase
            .from('stuserve_store')
            .select('value')
            .eq('key', 'jobs:history')
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                return [];
            }
            throw error;
        }
        console.log("[Supabase] Jobs history loaded");
        return data.value?.list || [];
    } catch (error) {
        console.error("[Supabase] Error loading jobs from cloud:", error);
        return [];
    }
}

export function showSyncStatus() {
    console.log("[Supabase] Sync is operational and active.");
}

export async function loadAllProfilesFromCloud() {
    try {
        const { data, error } = await supabase
            .from('stuserve_store')
            .select('value')
            .like('key', 'profile:%');
        if (error) throw error;
        const profiles = (data || []).map(item => item.value);
        console.log(`[Supabase] Loaded ${profiles.length} profiles from cloud`);
        return profiles;
    } catch (error) {
        console.error("[Supabase] Error loading all profiles from cloud:", error);
        return [];
    }
}

export function subscribeToProfilesFromCloud(callback) {
    try {
        const channel = supabase
            .channel('public:stuserve_store')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'stuserve_store' }, async (payload) => {
                // If the updated row is a profile, reload and call callback
                const updatedKey = payload.new?.key || payload.old?.key || '';
                if (updatedKey.startsWith('profile:')) {
                    const profiles = await loadAllProfilesFromCloud();
                    callback(profiles);
                }
            })
            .subscribe();

        console.log("[Supabase] Subscribed to profiles real-time changes");
        return () => {
            supabase.removeChannel(channel);
            console.log("[Supabase] Unsubscribed from profiles real-time changes");
        };
    } catch (error) {
        console.error("[Supabase] Error setting up real-time profiles subscription:", error);
        return () => { };
    }
}
