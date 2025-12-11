
import { supabase } from '../supabaseClient';
import { IconData, IconGroup, IconType, DBIcon, DBGroup } from '../types';

// Helper: Map DB Icon to App Icon
const mapIcon = (dbIcon: DBIcon): IconData => ({
  id: dbIcon.id,
  name: dbIcon.name,
  content: dbIcon.content,
  groupId: dbIcon.group_id,
  createdAt: new Date(dbIcon.created_at).getTime(),
  type: dbIcon.type || 'line',
  designerId: dbIcon.designer_id
});

// Helper: Map DB Group to App Group
const mapGroup = (dbGroup: DBGroup): IconGroup => ({
  id: dbGroup.id,
  name: dbGroup.name
});

export const iconService = {
  // --- Fetch Data ---
  
  // Fetch all groups for a specific designer
  async fetchDesignerGroups(designerId: string): Promise<IconGroup[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('designer_id', designerId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as DBGroup[]).map(mapGroup);
  },

  // Fetch all icons for a specific designer
  async fetchDesignerIcons(designerId: string): Promise<IconData[]> {
    const { data, error } = await supabase
      .from('icons')
      .select('*')
      .eq('designer_id', designerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as DBIcon[]).map(mapIcon);
  },

  // --- Icon Operations ---

  async uploadIcons(icons: Omit<IconData, 'id' | 'createdAt'>[]): Promise<IconData[]> {
    const dbPayload = icons.map(icon => ({
      name: icon.name,
      content: icon.content,
      group_id: icon.groupId,
      designer_id: icon.designerId,
      type: icon.type
    }));

    const { data, error } = await supabase
      .from('icons')
      .insert(dbPayload)
      .select();

    if (error) throw error;
    return (data as DBIcon[]).map(mapIcon);
  },

  async deleteIcons(iconIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('icons')
      .delete()
      .in('id', iconIds);
    
    if (error) throw error;
  },

  async moveIcons(iconIds: string[], targetGroupId: string): Promise<void> {
    const { error } = await supabase
      .from('icons')
      .update({ group_id: targetGroupId })
      .in('id', iconIds);

    if (error) throw error;
  },

  // --- Group Operations ---

  async createGroup(name: string, designerId: string): Promise<IconGroup> {
    const { data, error } = await supabase
      .from('groups')
      .insert([{ name, designer_id: designerId }])
      .select()
      .single();

    if (error) throw error;
    return mapGroup(data as DBGroup);
  },

  async deleteGroup(groupId: string): Promise<void> {
    // Note: Database should optimally be set to CASCADE delete icons, 
    // but we can manually handle it if needed. Assuming CASCADE is set on foreign key.
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);

    if (error) throw error;
  },

  async renameGroup(groupId: string, newName: string): Promise<void> {
    const { error } = await supabase
      .from('groups')
      .update({ name: newName })
      .eq('id', groupId);

    if (error) throw error;
  }
};
