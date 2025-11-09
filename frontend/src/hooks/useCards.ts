/**
 * カード管理用カスタムフック
 * TanStack Query v5を使用したデータフェッチングとミューテーション
 */

import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createCard,
  deleteCard,
  getCard,
  getCards,
  updateCard,
} from '../api/cards';
import type { Card, CreateCardInput, UpdateCardInput } from '../types/card';

// Query Keys
export const cardKeys = {
  all: ['cards'] as const,
  lists: () => [...cardKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...cardKeys.lists(), { filters }] as const,
  details: () => [...cardKeys.all, 'detail'] as const,
  detail: (id: string) => [...cardKeys.details(), id] as const,
};

/**
 * カード一覧を取得するフック
 */
export const useCards = (): UseQueryResult<Card[], Error> => {
  return useQuery({
    queryKey: cardKeys.lists(),
    queryFn: getCards,
  });
};

/**
 * 単一カードを取得するフック
 */
export const useCard = (id: string): UseQueryResult<Card, Error> => {
  return useQuery({
    queryKey: cardKeys.detail(id),
    queryFn: () => getCard(id),
    enabled: !!id, // idが存在する場合のみクエリを実行
  });
};

/**
 * カードを作成するフック
 */
export const useCreateCard = (): UseMutationResult<
  Card,
  Error,
  CreateCardInput,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      // カード一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
    },
  });
};

/**
 * カードを更新するフック
 */
export const useUpdateCard = (): UseMutationResult<
  Card,
  Error,
  UpdateCardInput,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCard,
    onSuccess: (data) => {
      // 更新されたカードの詳細キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: cardKeys.detail(data.id) });
      // カード一覧のキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
    },
  });
};

/**
 * カードを削除するフック
 */
export const useDeleteCard = (): UseMutationResult<
  void,
  Error,
  string,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      // カード一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
    },
  });
};
