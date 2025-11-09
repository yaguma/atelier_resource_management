/**
 * カードAPI関数
 * 注: TASK-0030で詳細なエラーハンドリングを実装予定
 */

import type { Card, CreateCardInput, UpdateCardInput } from '../types/card';
import apiClient from './client';

export const getCards = async (): Promise<Card[]> => {
  const response = await apiClient.get<Card[]>('/cards');
  return response.data;
};

export const getCard = async (id: string): Promise<Card> => {
  const response = await apiClient.get<Card>(`/cards/${id}`);
  return response.data;
};

export const createCard = async (data: CreateCardInput): Promise<Card> => {
  const response = await apiClient.post<Card>('/cards', data);
  return response.data;
};

export const updateCard = async ({
  id,
  ...data
}: UpdateCardInput): Promise<Card> => {
  const response = await apiClient.put<Card>(`/cards/${id}`, data);
  return response.data;
};

export const deleteCard = async (id: string): Promise<void> => {
  await apiClient.delete(`/cards/${id}`);
};
