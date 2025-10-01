import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserTemplate, ReportCategory } from '../types/daily-report';

export const useUserTemplates = (user: User | null, category?: ReportCategory) => {
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('user_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setTemplates(data || []);
    } catch (err) {
      console.error('テンプレート取得エラー:', err);
      setError(err instanceof Error ? err.message : 'テンプレートの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [user, category]);

  const createTemplate = useCallback(
    async (
      templateCategory: ReportCategory,
      name: string,
      content: string
    ): Promise<boolean> => {
      if (!user) {
        setError('認証が必要です');
        return false;
      }

      try {
        const maxOrderResult = await supabase
          .from('user_templates')
          .select('display_order')
          .eq('user_id', user.id)
          .eq('category', templateCategory)
          .order('display_order', { ascending: false })
          .limit(1)
          .maybeSingle();

        const nextOrder = maxOrderResult.data
          ? maxOrderResult.data.display_order + 1
          : 0;

        const { error: insertError } = await supabase
          .from('user_templates')
          .insert({
            user_id: user.id,
            category: templateCategory,
            template_name: name,
            template_content: content,
            display_order: nextOrder,
          });

        if (insertError) throw insertError;

        await fetchTemplates();
        return true;
      } catch (err) {
        console.error('テンプレート作成エラー:', err);
        setError(err instanceof Error ? err.message : 'テンプレートの作成に失敗しました');
        return false;
      }
    },
    [user, fetchTemplates]
  );

  const updateTemplate = useCallback(
    async (
      templateId: string,
      updates: Partial<Pick<UserTemplate, 'template_name' | 'template_content' | 'display_order'>>
    ): Promise<boolean> => {
      if (!user) {
        setError('認証が必要です');
        return false;
      }

      try {
        const { error: updateError } = await supabase
          .from('user_templates')
          .update(updates)
          .eq('id', templateId)
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        await fetchTemplates();
        return true;
      } catch (err) {
        console.error('テンプレート更新エラー:', err);
        setError(err instanceof Error ? err.message : 'テンプレートの更新に失敗しました');
        return false;
      }
    },
    [user, fetchTemplates]
  );

  const deleteTemplate = useCallback(
    async (templateId: string): Promise<boolean> => {
      if (!user) {
        setError('認証が必要です');
        return false;
      }

      try {
        const { error: deleteError } = await supabase
          .from('user_templates')
          .delete()
          .eq('id', templateId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        await fetchTemplates();
        return true;
      } catch (err) {
        console.error('テンプレート削除エラー:', err);
        setError(err instanceof Error ? err.message : 'テンプレートの削除に失敗しました');
        return false;
      }
    },
    [user, fetchTemplates]
  );

  const reorderTemplates = useCallback(
    async (templateIds: string[]): Promise<boolean> => {
      if (!user) {
        setError('認証が必要です');
        return false;
      }

      try {
        const updates = templateIds.map((id, index) => ({
          id,
          display_order: index,
        }));

        for (const update of updates) {
          const { error: updateError } = await supabase
            .from('user_templates')
            .update({ display_order: update.display_order })
            .eq('id', update.id)
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        }

        await fetchTemplates();
        return true;
      } catch (err) {
        console.error('テンプレート並び替えエラー:', err);
        setError(
          err instanceof Error ? err.message : 'テンプレートの並び替えに失敗しました'
        );
        return false;
      }
    },
    [user, fetchTemplates]
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    reorderTemplates,
  };
};
