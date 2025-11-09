# Phase 4: 顧客管理画面と錬金スタイル管理

## フェーズ概要

### 要件名
resource-management-webapp

### 期間・目標
- **期間**: 8営業日（Week 5-6、Day 21-28）
- **総工数**: 64時間
- **タスク数**: 13タスク
- **目標**: 顧客管理画面と錬金スタイル管理機能（API + UI）を実装する

### 成果物
- 顧客管理画面（一覧・作成・編集・詳細・削除）
- N:Mリレーション UI（報酬カード選択）
- 錬金スタイル管理API（GET一覧・詳細、POST、PUT、DELETE）
- 錬金スタイル管理画面（一覧・作成・編集・詳細・削除）
- N:Mリレーション UI（初期デッキカード選択）

---

## 週次計画

### Week 5（Day 21-25）: 顧客管理画面実装
**目標**: 顧客管理の全画面（一覧・作成・編集・詳細・削除）を実装する

**成果物**:
- 顧客一覧画面（ページネーション、検索、フィルタリング）
- 顧客作成画面（フォーム、N:Mリレーション、バリデーション）
- 顧客編集画面（既存データ取得、N:Mリレーション更新）
- 顧客詳細画面（読み取り専用表示、報酬カード表示）
- 顧客削除機能（モーダル確認、削除実行）

### Week 6（Day 26-28）: 錬金スタイル管理実装
**目標**: 錬金スタイル管理API・画面を実装する

**成果物**:
- 錬金スタイル管理API（GET、POST、PUT、DELETE）
- 錬金スタイル一覧画面（検索、フィルタリング）
- 錬金スタイル作成画面（フォーム、初期デッキ選択、バリデーション）
- 錬金スタイル編集画面（既存データ取得、初期デッキ更新）
- 錬金スタイル詳細画面（読み取り専用表示、初期デッキ表示）
- 錬金スタイル削除機能（モーダル確認、削除実行）

---

## 日次タスク

### Day 21（8時間）: 顧客一覧画面

#### ☑ TASK-0043: 顧客一覧画面実装
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-025
- **依存タスク**: TASK-0029, TASK-0030, TASK-0035, TASK-0036, TASK-0037

**実装詳細**:
1. `src/pages/customers/CustomerListPage.tsx`作成
   ```typescript
   import { FC, useState } from 'react';
   import { Link } from 'react-router-dom';
   import { useCustomers } from '../../hooks/useCustomers';
   import Button from '../../components/common/Button';

   const CustomerListPage: FC = () => {
     const [page, setPage] = useState(1);
     const [search, setSearch] = useState('');
     const [difficulty, setDifficulty] = useState<number | undefined>();
     const { data, isLoading, error } = useCustomers({ page, limit: 20, search, difficulty });

     if (isLoading) return <div>読み込み中...</div>;
     if (error) return <div>エラーが発生しました</div>;

     return (
       <div>
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold">顧客一覧</h1>
           <Link to="/customers/new">
             <Button variant="primary">新規作成</Button>
           </Link>
         </div>

         <div className="mb-4 flex gap-4">
           <input
             type="text"
             placeholder="顧客名で検索..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
           />
           <select
             value={difficulty || ''}
             onChange={(e) => setDifficulty(e.target.value ? Number(e.target.value) : undefined)}
             className="px-4 py-2 border border-gray-300 rounded-lg"
           >
             <option value="">全難易度</option>
             <option value="1">難易度1</option>
             <option value="2">難易度2</option>
             <option value="3">難易度3</option>
             <option value="4">難易度4</option>
             <option value="5">難易度5</option>
           </select>
         </div>

         <div className="bg-white shadow rounded-lg overflow-hidden">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名前</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイプ</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">難易度</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">報酬</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {data?.items.map((customer) => (
                 <tr key={customer.id}>
                   <td className="px-6 py-4">{customer.name}</td>
                   <td className="px-6 py-4">{customer.customerType}</td>
                   <td className="px-6 py-4">{'★'.repeat(customer.difficulty)}</td>
                   <td className="px-6 py-4">
                     名声: {customer.rewardFame} / 知識: {customer.rewardKnowledge}
                   </td>
                   <td className="px-6 py-4 space-x-2">
                     <Link to={`/customers/${customer.id}`}>
                       <Button variant="ghost" size="sm">詳細</Button>
                     </Link>
                     <Link to={`/customers/${customer.id}/edit`}>
                       <Button variant="secondary" size="sm">編集</Button>
                     </Link>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

         <div className="mt-4 flex justify-between items-center">
           <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>前へ</Button>
           <span>ページ {page} / {data?.totalPages || 1}</span>
           <Button onClick={() => setPage((p) => p + 1)} disabled={page >= (data?.totalPages || 1)}>次へ</Button>
         </div>
       </div>
     );
   };

   export default CustomerListPage;
   ```

2. `src/hooks/useCustomers.ts`作成
   ```typescript
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../api/customers';

   export const useCustomers = (params?: { page?: number; limit?: number; search?: string; difficulty?: number }) => {
     return useQuery({
       queryKey: ['customers', params],
       queryFn: () => getCustomers(params),
     });
   };

   export const useCustomer = (id: string) => {
     return useQuery({
       queryKey: ['customers', id],
       queryFn: () => getCustomer(id),
       enabled: !!id,
     });
   };

   export const useCreateCustomer = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: createCustomer,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['customers'] });
       },
     });
   };

   export const useUpdateCustomer = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: ({ id, data }: { id: string; data: any }) => updateCustomer(id, data),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['customers'] });
       },
     });
   };

   export const useDeleteCustomer = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: deleteCustomer,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['customers'] });
       },
     });
   };
   ```

3. `src/api/customers.ts`作成
   ```typescript
   import apiClient from './client';
   import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../types/customer';

   export const getCustomers = async (params?: { page?: number; limit?: number; search?: string; difficulty?: number }) => {
     const response = await apiClient.get<{ data: { items: Customer[]; total: number } }>('/customers', { params });
     return response.data.data;
   };

   export const getCustomer = async (id: string) => {
     const response = await apiClient.get<{ data: Customer }>(`/customers/${id}`);
     return response.data.data;
   };

   export const createCustomer = async (data: CreateCustomerInput) => {
     const response = await apiClient.post<{ data: Customer }>('/customers', data);
     return response.data.data;
   };

   export const updateCustomer = async (id: string, data: UpdateCustomerInput) => {
     const response = await apiClient.put<{ data: Customer }>(`/customers/${id}`, data);
     return response.data.data;
   };

   export const deleteCustomer = async (id: string) => {
     await apiClient.delete(`/customers/${id}`);
   };
   ```

4. `src/types/customer.ts`作成
   ```typescript
   import { z } from 'zod';

   export const createCustomerSchema = z.object({
     name: z.string().min(1, '顧客名を入力してください').max(100, '顧客名は100文字以内で入力してください'),
     description: z.string().min(1, '説明を入力してください').max(1000, '説明は1000文字以内で入力してください'),
     customerType: z.string().min(1, '顧客タイプを入力してください').max(50, '顧客タイプは50文字以内で入力してください'),
     difficulty: z.number().min(1, '難易度は1以上で入力してください').max(5, '難易度は5以下で入力してください'),
     requiredAttribute: z.record(z.number()),
     qualityCondition: z.number().min(0).max(100),
     stabilityCondition: z.number().min(0).max(100),
     rewardFame: z.number().min(0).max(1000),
     rewardKnowledge: z.number().min(0).max(1000),
     portraitUrl: z.string().url().optional().or(z.literal('')),
     rewardCardIds: z.array(z.string()).optional(),
   });

   export const updateCustomerSchema = createCustomerSchema.partial();

   export type Customer = z.infer<typeof createCustomerSchema> & {
     id: string;
     createdAt: string;
     updatedAt: string;
     rewardCards?: { id: string; name: string }[];
   };
   export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
   export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
   ```

**完了条件**:
- [ ] 顧客一覧が表示される
- [ ] ページネーションが動作する
- [ ] 検索機能（名前）が動作する
- [ ] 難易度フィルタリングが動作する
- [ ] 新規作成ボタンが動作する
- [ ] 詳細・編集リンクが動作する

**テスト要件**:
- [ ] データ取得時に顧客が表示される
- [ ] 検索入力でフィルタリングされる
- [ ] 難易度選択でフィルタリングされる
- [ ] ページネーションボタンでページが切り替わる

---

### Day 22（8時間）: 顧客作成画面

#### ☑ TASK-0044: 顧客作成画面実装（N:Mリレーション対応）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-023, WRREQ-024, WRREQ-026
- **依存タスク**: TASK-0043

**実装詳細**:
1. `src/pages/customers/CustomerCreatePage.tsx`作成
   ```typescript
   import { FC, useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { createCustomerSchema, CreateCustomerInput } from '../../types/customer';
   import { useCreateCustomer } from '../../hooks/useCustomers';
   import { useCards } from '../../hooks/useCards';
   import { useToast } from '../../contexts/ToastContext';
   import Button from '../../components/common/Button';

   const CustomerCreatePage: FC = () => {
     const navigate = useNavigate();
     const { mutate: createCustomer, isLoading } = useCreateCustomer();
     const { data: cardsData } = useCards({ page: 1, limit: 100 });
     const { addToast } = useToast();
     const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateCustomerInput>({
       resolver: zodResolver(createCustomerSchema),
       defaultValues: {
         difficulty: 1,
         qualityCondition: 50,
         stabilityCondition: 50,
         rewardFame: 100,
         rewardKnowledge: 50,
         requiredAttribute: {},
       },
     });

     const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

     const onSubmit = (data: CreateCustomerInput) => {
       createCustomer({ ...data, rewardCardIds: selectedCardIds }, {
         onSuccess: () => {
           addToast('success', '顧客を作成しました');
           navigate('/customers');
         },
         onError: () => {
           addToast('error', '顧客の作成に失敗しました');
         },
       });
     };

     const toggleCardSelection = (cardId: string) => {
       setSelectedCardIds(prev =>
         prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
       );
     };

     return (
       <div>
         <h1 className="text-2xl font-bold mb-6">顧客新規作成</h1>
         <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">顧客名</label>
             <input {...register('name')} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
             {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
             <textarea {...register('description')} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
             {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">顧客タイプ</label>
             <input {...register('customerType')} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
             {errors.customerType && <p className="text-red-500 text-sm mt-1">{errors.customerType.message}</p>}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">難易度（1〜5）</label>
             <input type="number" {...register('difficulty', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
             {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>}
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">品質条件（0〜100）</label>
               <input type="number" {...register('qualityCondition', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
               {errors.qualityCondition && <p className="text-red-500 text-sm mt-1">{errors.qualityCondition.message}</p>}
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">安定性条件（0〜100）</label>
               <input type="number" {...register('stabilityCondition', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
               {errors.stabilityCondition && <p className="text-red-500 text-sm mt-1">{errors.stabilityCondition.message}</p>}
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">報酬名声（0〜1000）</label>
               <input type="number" {...register('rewardFame', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
               {errors.rewardFame && <p className="text-red-500 text-sm mt-1">{errors.rewardFame.message}</p>}
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">報酬知識（0〜1000）</label>
               <input type="number" {...register('rewardKnowledge', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
               {errors.rewardKnowledge && <p className="text-red-500 text-sm mt-1">{errors.rewardKnowledge.message}</p>}
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">報酬カード選択</label>
             <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
               {cardsData?.items.map((card) => (
                 <label key={card.id} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50">
                   <input
                     type="checkbox"
                     checked={selectedCardIds.includes(card.id)}
                     onChange={() => toggleCardSelection(card.id)}
                     className="w-4 h-4"
                   />
                   <span>{card.name} ({card.cardType})</span>
                 </label>
               ))}
             </div>
             <p className="text-sm text-gray-600 mt-1">選択済み: {selectedCardIds.length}枚</p>
           </div>

           <div className="flex gap-4">
             <Button type="submit" variant="primary" isLoading={isLoading}>作成</Button>
             <Button type="button" variant="secondary" onClick={() => navigate('/customers')}>キャンセル</Button>
           </div>
         </form>
       </div>
     );
   };

   export default CustomerCreatePage;
   ```

**完了条件**:
- [ ] 顧客作成フォームが表示される
- [ ] バリデーションが動作する
- [ ] 報酬カード選択UI（チェックボックス）が動作する
- [ ] 顧客作成が成功する
- [ ] Toast通知が表示される
- [ ] 作成後に一覧画面に遷移する

**テスト要件**:
- [ ] フォーム送信でAPIが呼ばれる
- [ ] バリデーションエラーが表示される
- [ ] 報酬カード選択でN:M関連付けができる
- [ ] 作成成功でToast通知が表示される

---

### Day 23（8時間）: 顧客編集画面

#### ☑ TASK-0045: 顧客編集画面実装（N:Mリレーション対応）
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-024, WRREQ-026
- **依存タスク**: TASK-0044

**実装詳細**:
1. `src/pages/customers/CustomerEditPage.tsx`作成（CustomerCreatePageと類似、既存データ取得・更新処理が追加）
   ```typescript
   import { FC, useEffect, useState } from 'react';
   import { useNavigate, useParams } from 'react-router-dom';
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { updateCustomerSchema, UpdateCustomerInput } from '../../types/customer';
   import { useCustomer, useUpdateCustomer } from '../../hooks/useCustomers';
   import { useCards } from '../../hooks/useCards';
   import { useToast } from '../../contexts/ToastContext';
   import Button from '../../components/common/Button';

   const CustomerEditPage: FC = () => {
     const { id } = useParams<{ id: string }>();
     const navigate = useNavigate();
     const { data: customer, isLoading: isLoadingCustomer } = useCustomer(id!);
     const { data: cardsData } = useCards({ page: 1, limit: 100 });
     const { mutate: updateCustomer, isLoading } = useUpdateCustomer();
     const { addToast } = useToast();
     const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateCustomerInput>({
       resolver: zodResolver(updateCustomerSchema),
     });

     const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

     useEffect(() => {
       if (customer) {
         reset(customer);
         setSelectedCardIds(customer.rewardCards?.map(c => c.id) || []);
       }
     }, [customer, reset]);

     const onSubmit = (data: UpdateCustomerInput) => {
       updateCustomer({ id: id!, data: { ...data, rewardCardIds: selectedCardIds } }, {
         onSuccess: () => {
           addToast('success', '顧客を更新しました');
           navigate('/customers');
         },
         onError: () => {
           addToast('error', '顧客の更新に失敗しました');
         },
       });
     };

     const toggleCardSelection = (cardId: string) => {
       setSelectedCardIds(prev =>
         prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
       );
     };

     if (isLoadingCustomer) return <div>読み込み中...</div>;

     return (
       <div>
         <h1 className="text-2xl font-bold mb-6">顧客編集</h1>
         {/* フォーム実装（CustomerCreatePageと同様） */}
       </div>
     );
   };

   export default CustomerEditPage;
   ```

**完了条件**:
- [ ] 既存顧客データが取得される
- [ ] フォームに既存データが表示される
- [ ] 既存の報酬カード選択状態が復元される
- [ ] 顧客更新が成功する
- [ ] Toast通知が表示される
- [ ] 更新後に一覧画面に遷移する

**テスト要件**:
- [ ] 既存データでフォームが初期化される
- [ ] フォーム送信で更新APIが呼ばれる
- [ ] 報酬カード選択の変更が反映される
- [ ] 更新成功でToast通知が表示される

---

### Day 24（8時間）: 顧客詳細画面

#### ☑ TASK-0046: 顧客詳細画面実装
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-021, WRREQ-022, WRREQ-023, WRREQ-024, WRREQ-025
- **依存タスク**: TASK-0043, TASK-0044

**実装詳細**:
1. `src/pages/customers/CustomerDetailPage.tsx`作成
   ```typescript
   import { FC } from 'react';
   import { Link, useParams } from 'react-router-dom';
   import { useCustomer } from '../../hooks/useCustomers';
   import Button from '../../components/common/Button';

   const CustomerDetailPage: FC = () => {
     const { id } = useParams<{ id: string }>();
     const { data: customer, isLoading, error } = useCustomer(id!);

     if (isLoading) return <div>読み込み中...</div>;
     if (error) return <div>エラーが発生しました</div>;
     if (!customer) return <div>顧客が見つかりません</div>;

     return (
       <div>
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold">顧客詳細</h1>
           <div className="flex gap-2">
             <Link to={`/customers/${id}/edit`}>
               <Button variant="primary">編集</Button>
             </Link>
             <Link to="/customers">
               <Button variant="secondary">一覧に戻る</Button>
             </Link>
           </div>
         </div>

         <div className="bg-white shadow rounded-lg p-6 space-y-4">
           <div>
             <h2 className="text-sm font-medium text-gray-500">顧客名</h2>
             <p className="text-lg">{customer.name}</p>
           </div>
           <div>
             <h2 className="text-sm font-medium text-gray-500">説明</h2>
             <p className="text-lg">{customer.description}</p>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <h2 className="text-sm font-medium text-gray-500">顧客タイプ</h2>
               <p className="text-lg">{customer.customerType}</p>
             </div>
             <div>
               <h2 className="text-sm font-medium text-gray-500">難易度</h2>
               <p className="text-lg">{'★'.repeat(customer.difficulty)}</p>
             </div>
             <div>
               <h2 className="text-sm font-medium text-gray-500">品質条件</h2>
               <p className="text-lg">{customer.qualityCondition}</p>
             </div>
             <div>
               <h2 className="text-sm font-medium text-gray-500">安定性条件</h2>
               <p className="text-lg">{customer.stabilityCondition}</p>
             </div>
             <div>
               <h2 className="text-sm font-medium text-gray-500">報酬名声</h2>
               <p className="text-lg">{customer.rewardFame}</p>
             </div>
             <div>
               <h2 className="text-sm font-medium text-gray-500">報酬知識</h2>
               <p className="text-lg">{customer.rewardKnowledge}</p>
             </div>
           </div>
           <div>
             <h2 className="text-sm font-medium text-gray-500 mb-2">報酬カード</h2>
             {customer.rewardCards && customer.rewardCards.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {customer.rewardCards.map((card) => (
                   <Link key={card.id} to={`/cards/${card.id}`}>
                     <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">
                       {card.name}
                     </span>
                   </Link>
                 ))}
               </div>
             ) : (
               <p className="text-gray-500">報酬カードなし</p>
             )}
           </div>
         </div>
       </div>
     );
   };

   export default CustomerDetailPage;
   ```

**完了条件**:
- [ ] 顧客詳細が表示される
- [ ] 全フィールドが正しく表示される
- [ ] 報酬カード一覧が表示される
- [ ] 報酬カードからカード詳細へのリンクが動作する
- [ ] 編集ボタンが動作する
- [ ] 一覧に戻るボタンが動作する

**テスト要件**:
- [ ] データ取得時に顧客詳細が表示される
- [ ] 存在しないIDでエラーメッセージが表示される
- [ ] 報酬カードが正しく表示される

---

### Day 25（8時間）: 顧客削除機能

#### ☑ TASK-0047: 顧客削除機能実装
- **推定工数**: 8時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-026
- **依存タスク**: TASK-0046

**実装詳細**:
1. `src/pages/customers/CustomerDetailPage.tsx`に削除ボタン追加
   ```typescript
   import { useState } from 'react';
   import Modal from '../../components/common/Modal';
   import { useDeleteCustomer } from '../../hooks/useCustomers';
   import { useToast } from '../../contexts/ToastContext';
   import { useNavigate } from 'react-router-dom';

   const CustomerDetailPage: FC = () => {
     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
     const { mutate: deleteCustomer, isLoading: isDeleting } = useDeleteCustomer();
     const { addToast } = useToast();
     const navigate = useNavigate();

     const handleDelete = () => {
       deleteCustomer(id!, {
         onSuccess: () => {
           addToast('success', '顧客を削除しました');
           navigate('/customers');
         },
         onError: () => {
           addToast('error', '顧客の削除に失敗しました');
         },
       });
     };

     return (
       <div>
         {/* ... 既存コード ... */}
         <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>削除</Button>

         <Modal
           isOpen={isDeleteModalOpen}
           onClose={() => setIsDeleteModalOpen(false)}
           title="顧客の削除"
           footer={
             <>
               <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>キャンセル</Button>
               <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>削除</Button>
             </>
           }
         >
           <p>本当にこの顧客を削除しますか？この操作は取り消せません。</p>
         </Modal>
       </div>
     );
   };
   ```

**完了条件**:
- [ ] 削除ボタンが表示される
- [ ] 削除確認モーダルが表示される
- [ ] 顧客削除が成功する
- [ ] Toast通知が表示される
- [ ] 削除後に一覧画面に遷移する

**テスト要件**:
- [ ] 削除ボタンクリックでモーダルが表示される
- [ ] モーダル内の削除ボタンで削除APIが呼ばれる
- [ ] 削除成功でToast通知が表示される
- [ ] キャンセルボタンでモーダルが閉じる

---

### Day 26（8時間）: 錬金スタイルAPI実装（一覧・詳細・作成）

#### ☑ TASK-0048: 錬金スタイル一覧・詳細取得API実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0005, TASK-0007, TASK-0009, TASK-0012, TASK-0013

**実装詳細**:
1. `src/routes/alchemyStyles.ts`作成
   ```typescript
   import { Hono } from 'hono';
   import { listAlchemyStyles, getAlchemyStyleById, createAlchemyStyle, updateAlchemyStyle, deleteAlchemyStyle } from '../controllers/alchemyStyleController';
   import { validateUUID } from '../middlewares/validateUUID';

   const alchemyStyleRoutes = new Hono();

   alchemyStyleRoutes.get('/', listAlchemyStyles);
   alchemyStyleRoutes.get('/:id', validateUUID, getAlchemyStyleById);

   export default alchemyStyleRoutes;
   ```

2. `src/controllers/alchemyStyleController.ts`作成
   ```typescript
   import { Context } from 'hono';
   import prisma from '../lib/prisma';
   import { successResponse, errorResponse } from '../utils/response';

   export const listAlchemyStyles = async (c: Context) => {
     try {
       const alchemyStyles = await prisma.alchemyStyle.findMany({
         where: { deletedAt: null },
         include: {
           initialDeckCards: {
             select: { id: true, name: true },
           },
         },
         orderBy: { createdAt: 'desc' },
       });

       return successResponse(c, alchemyStyles);
     } catch (error) {
       return errorResponse(c, 'DATABASE_ERROR', 'データベースエラーが発生しました', 500);
     }
   };

   export const getAlchemyStyleById = async (c: Context) => {
     try {
       const { id } = c.req.param();

       const alchemyStyle = await prisma.alchemyStyle.findUnique({
         where: { id, deletedAt: null },
         include: {
           initialDeckCards: {
             select: { id: true, name: true, cardType: true },
           },
         },
       });

       if (!alchemyStyle) {
         return errorResponse(c, 'NOT_FOUND', '錬金スタイルが見つかりません', 404);
       }

       return successResponse(c, alchemyStyle);
     } catch (error) {
       return errorResponse(c, 'DATABASE_ERROR', 'データベースエラーが発生しました', 500);
     }
   };
   ```

3. `src/types/alchemyStyle.ts`作成
   ```typescript
   import { z } from 'zod';

   export const createAlchemyStyleSchema = z.object({
     name: z.string().min(1, '錬金スタイル名を入力してください').max(100, '錬金スタイル名は100文字以内で入力してください'),
     description: z.string().min(1, '説明を入力してください').max(1000, '説明は1000文字以内で入力してください'),
     characteristics: z.string().min(1, '特徴を入力してください').max(500, '特徴は500文字以内で入力してください'),
     iconUrl: z.string().url().optional().or(z.literal('')),
     initialDeckCardIds: z.array(z.string()).min(1, '初期デッキカードを最低1枚選択してください'),
   });

   export const updateAlchemyStyleSchema = createAlchemyStyleSchema.partial();

   export type AlchemyStyle = z.infer<typeof createAlchemyStyleSchema> & {
     id: string;
     createdAt: string;
     updatedAt: string;
     initialDeckCards?: { id: string; name: string; cardType?: string }[];
   };
   export type CreateAlchemyStyleInput = z.infer<typeof createAlchemyStyleSchema>;
   export type UpdateAlchemyStyleInput = z.infer<typeof updateAlchemyStyleSchema>;
   ```

**完了条件**:
- [ ] GET /api/alchemy-styles が動作する
- [ ] GET /api/alchemy-styles/:id が動作する
- [ ] 初期デッキカードのリレーションデータが含まれる
- [ ] 存在しないIDで404エラーが返る

**テスト要件**:
- [ ] 一覧取得で全錬金スタイルが取得できる
- [ ] 詳細取得で初期デッキカードが含まれる
- [ ] 存在しないUUIDで404エラーが返る

---

#### ☑ TASK-0049: 錬金スタイル作成API実装
- **推定工数**: 4時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0048

**実装詳細**:
1. `src/controllers/alchemyStyleController.ts`に追加
   ```typescript
   export const createAlchemyStyle = async (c: Context) => {
     try {
       const body = await c.req.json();
       const validatedData = createAlchemyStyleSchema.parse(body);

       // initialDeckCardIdsの存在チェック
       const cardCount = await prisma.card.count({
         where: {
           id: { in: validatedData.initialDeckCardIds },
           deletedAt: null,
         },
       });

       if (cardCount !== validatedData.initialDeckCardIds.length) {
         return errorResponse(c, 'VALIDATION_ERROR', '存在しないカードが選択されています', 400);
       }

       const alchemyStyle = await prisma.alchemyStyle.create({
         data: {
           name: validatedData.name,
           description: validatedData.description,
           characteristics: validatedData.characteristics,
           iconUrl: validatedData.iconUrl || null,
           initialDeckCards: {
             connect: validatedData.initialDeckCardIds.map(id => ({ id })),
           },
         },
         include: {
           initialDeckCards: {
             select: { id: true, name: true },
           },
         },
       });

       return successResponse(c, alchemyStyle, '錬金スタイルを作成しました', 201);
     } catch (error) {
       if (error instanceof z.ZodError) {
         return errorResponse(c, 'VALIDATION_ERROR', '入力データが不正です', 400, error.errors);
       }
       return errorResponse(c, 'DATABASE_ERROR', 'データベースエラーが発生しました', 500);
     }
   };
   ```

2. ルート追加
   ```typescript
   alchemyStyleRoutes.post('/', createAlchemyStyle);
   ```

**完了条件**:
- [ ] POST /api/alchemy-styles が動作する
- [ ] 正常なデータで錬金スタイル作成できる
- [ ] initialDeckCardIds指定でN:M関連付けできる
- [ ] バリデーションエラー時に400エラーが返る
- [ ] 存在しないinitialDeckCardIdで400エラーが返る

**テスト要件**:
- [ ] 必須フィールドで錬金スタイル作成できる
- [ ] initialDeckCardIds指定で初期デッキ関連付けできる
- [ ] 存在しないinitialDeckCardIdで400エラーが返る
- [ ] 作成後、GET /api/alchemy-styles/:idでinitialDeckCardsが取得できる

---

### Day 27（8時間）: 錬金スタイルAPI更新・削除 & 一覧画面

#### ☑ TASK-0050: 錬金スタイル更新API実装
- **推定工数**: 3時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0049

**実装詳細**:
1. `src/controllers/alchemyStyleController.ts`に追加
   ```typescript
   export const updateAlchemyStyle = async (c: Context) => {
     try {
       const { id } = c.req.param();
       const body = await c.req.json();
       const validatedData = updateAlchemyStyleSchema.parse(body);

       const existing = await prisma.alchemyStyle.findUnique({
         where: { id, deletedAt: null },
       });

       if (!existing) {
         return errorResponse(c, 'NOT_FOUND', '錬金スタイルが見つかりません', 404);
       }

       // initialDeckCardIdsの存在チェック
       if (validatedData.initialDeckCardIds) {
         const cardCount = await prisma.card.count({
           where: {
             id: { in: validatedData.initialDeckCardIds },
             deletedAt: null,
           },
         });

         if (cardCount !== validatedData.initialDeckCardIds.length) {
           return errorResponse(c, 'VALIDATION_ERROR', '存在しないカードが選択されています', 400);
         }
       }

       const alchemyStyle = await prisma.alchemyStyle.update({
         where: { id },
         data: {
           ...(validatedData.name && { name: validatedData.name }),
           ...(validatedData.description && { description: validatedData.description }),
           ...(validatedData.characteristics && { characteristics: validatedData.characteristics }),
           ...(validatedData.iconUrl !== undefined && { iconUrl: validatedData.iconUrl || null }),
           ...(validatedData.initialDeckCardIds && {
             initialDeckCards: {
               set: validatedData.initialDeckCardIds.map(id => ({ id })),
             },
           }),
         },
         include: {
           initialDeckCards: {
             select: { id: true, name: true },
           },
         },
       });

       return successResponse(c, alchemyStyle, '錬金スタイルを更新しました');
     } catch (error) {
       if (error instanceof z.ZodError) {
         return errorResponse(c, 'VALIDATION_ERROR', '入力データが不正です', 400, error.errors);
       }
       return errorResponse(c, 'DATABASE_ERROR', 'データベースエラーが発生しました', 500);
     }
   };
   ```

2. ルート追加
   ```typescript
   alchemyStyleRoutes.put('/:id', validateUUID, updateAlchemyStyle);
   ```

**完了条件**:
- [ ] PUT /api/alchemy-styles/:id が動作する
- [ ] 部分更新（一部フィールドのみ）が動作する
- [ ] initialDeckCardIds更新が動作する
- [ ] 存在しないIDで404エラーが返る

**テスト要件**:
- [ ] 1フィールドのみ更新できる
- [ ] initialDeckCardIds更新で関連が正しく置換される
- [ ] 存在しないIDで404エラーが返る

---

#### ☑ TASK-0051: 錬金スタイル削除API実装
- **推定工数**: 2時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-031
- **依存タスク**: TASK-0050

**実装詳細**:
1. `src/controllers/alchemyStyleController.ts`に追加
   ```typescript
   export const deleteAlchemyStyle = async (c: Context) => {
     try {
       const { id } = c.req.param();

       const existing = await prisma.alchemyStyle.findUnique({
         where: { id, deletedAt: null },
       });

       if (!existing) {
         return errorResponse(c, 'NOT_FOUND', '錬金スタイルが見つかりません', 404);
       }

       await prisma.alchemyStyle.update({
         where: { id },
         data: { deletedAt: new Date() },
       });

       return c.body(null, 204);
     } catch (error) {
       return errorResponse(c, 'DATABASE_ERROR', 'データベースエラーが発生しました', 500);
     }
   };
   ```

2. ルート追加
   ```typescript
   alchemyStyleRoutes.delete('/:id', validateUUID, deleteAlchemyStyle);
   ```

3. `src/routes/index.ts`にルート統合
   ```typescript
   import alchemyStyleRoutes from './alchemyStyles';
   app.route('/api/alchemy-styles', alchemyStyleRoutes);
   ```

**完了条件**:
- [ ] DELETE /api/alchemy-styles/:id が動作する
- [ ] 削除成功時に204ステータスが返る
- [ ] ソフトデリート（deletedAt設定）が動作する
- [ ] 存在しないIDで404エラーが返る

**テスト要件**:
- [ ] 錬金スタイルを削除できる
- [ ] 削除後、GET /api/alchemy-stylesで取得できない
- [ ] 削除後、GET /api/alchemy-styles/:idで404エラーが返る

---

#### ☑ TASK-0052: 錬金スタイル一覧画面実装
- **推定工数**: 3時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0048, TASK-0049, TASK-0050, TASK-0051

**実装詳細**:
1. `src/pages/alchemy-styles/AlchemyStyleListPage.tsx`作成
   ```typescript
   import { FC } from 'react';
   import { Link } from 'react-router-dom';
   import { useAlchemyStyles } from '../../hooks/useAlchemyStyles';
   import Button from '../../components/common/Button';

   const AlchemyStyleListPage: FC = () => {
     const { data: alchemyStyles, isLoading, error } = useAlchemyStyles();

     if (isLoading) return <div>読み込み中...</div>;
     if (error) return <div>エラーが発生しました</div>;

     return (
       <div>
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold">錬金スタイル一覧</h1>
           <Link to="/alchemy-styles/new">
             <Button variant="primary">新規作成</Button>
           </Link>
         </div>

         <div className="bg-white shadow rounded-lg overflow-hidden">
           <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名前</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">特徴</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">初期デッキ</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {alchemyStyles?.map((style) => (
                 <tr key={style.id}>
                   <td className="px-6 py-4">{style.name}</td>
                   <td className="px-6 py-4">{style.characteristics}</td>
                   <td className="px-6 py-4">{style.initialDeckCards?.length || 0}枚</td>
                   <td className="px-6 py-4 space-x-2">
                     <Link to={`/alchemy-styles/${style.id}`}>
                       <Button variant="ghost" size="sm">詳細</Button>
                     </Link>
                     <Link to={`/alchemy-styles/${style.id}/edit`}>
                       <Button variant="secondary" size="sm">編集</Button>
                     </Link>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     );
   };

   export default AlchemyStyleListPage;
   ```

2. `src/hooks/useAlchemyStyles.ts`作成
   ```typescript
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { getAlchemyStyles, getAlchemyStyle, createAlchemyStyle, updateAlchemyStyle, deleteAlchemyStyle } from '../api/alchemyStyles';

   export const useAlchemyStyles = () => {
     return useQuery({
       queryKey: ['alchemyStyles'],
       queryFn: getAlchemyStyles,
     });
   };

   export const useAlchemyStyle = (id: string) => {
     return useQuery({
       queryKey: ['alchemyStyles', id],
       queryFn: () => getAlchemyStyle(id),
       enabled: !!id,
     });
   };

   export const useCreateAlchemyStyle = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: createAlchemyStyle,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['alchemyStyles'] });
       },
     });
   };

   export const useUpdateAlchemyStyle = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: ({ id, data }: { id: string; data: any }) => updateAlchemyStyle(id, data),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['alchemyStyles'] });
       },
     });
   };

   export const useDeleteAlchemyStyle = () => {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: deleteAlchemyStyle,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['alchemyStyles'] });
       },
     });
   };
   ```

3. `src/api/alchemyStyles.ts`作成
   ```typescript
   import apiClient from './client';
   import { AlchemyStyle, CreateAlchemyStyleInput, UpdateAlchemyStyleInput } from '../types/alchemyStyle';

   export const getAlchemyStyles = async () => {
     const response = await apiClient.get<{ data: AlchemyStyle[] }>('/alchemy-styles');
     return response.data.data;
   };

   export const getAlchemyStyle = async (id: string) => {
     const response = await apiClient.get<{ data: AlchemyStyle }>(`/alchemy-styles/${id}`);
     return response.data.data;
   };

   export const createAlchemyStyle = async (data: CreateAlchemyStyleInput) => {
     const response = await apiClient.post<{ data: AlchemyStyle }>('/alchemy-styles', data);
     return response.data.data;
   };

   export const updateAlchemyStyle = async (id: string, data: UpdateAlchemyStyleInput) => {
     const response = await apiClient.put<{ data: AlchemyStyle }>(`/alchemy-styles/${id}`, data);
     return response.data.data;
   };

   export const deleteAlchemyStyle = async (id: string) => {
     await apiClient.delete(`/alchemy-styles/${id}`);
   };
   ```

4. `src/router/index.tsx`にルート追加
   ```typescript
   import AlchemyStyleListPage from '../pages/alchemy-styles/AlchemyStyleListPage';
   import AlchemyStyleCreatePage from '../pages/alchemy-styles/AlchemyStyleCreatePage';
   import AlchemyStyleEditPage from '../pages/alchemy-styles/AlchemyStyleEditPage';
   import AlchemyStyleDetailPage from '../pages/alchemy-styles/AlchemyStyleDetailPage';

   // ...
   { path: '/alchemy-styles', element: <AlchemyStyleListPage /> },
   { path: '/alchemy-styles/new', element: <AlchemyStyleCreatePage /> },
   { path: '/alchemy-styles/:id', element: <AlchemyStyleDetailPage /> },
   { path: '/alchemy-styles/:id/edit', element: <AlchemyStyleEditPage /> },
   ```

**完了条件**:
- [ ] 錬金スタイル一覧が表示される
- [ ] 新規作成ボタンが動作する
- [ ] 詳細・編集リンクが動作する

**テスト要件**:
- [ ] データ取得時に錬金スタイルが表示される
- [ ] 初期デッキカード数が正しく表示される

---

### Day 28（8時間）: 錬金スタイル作成・編集・詳細・削除画面

#### ☑ TASK-0053: 錬金スタイル作成画面実装
- **推定工数**: 3時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0052

**実装詳細**:
1. `src/pages/alchemy-styles/AlchemyStyleCreatePage.tsx`作成（顧客作成画面と類似、初期デッキカード選択UIを含む）

**完了条件**:
- [ ] 錬金スタイル作成フォームが表示される
- [ ] バリデーションが動作する
- [ ] 初期デッキカード選択UI（チェックボックス）が動作する
- [ ] 錬金スタイル作成が成功する
- [ ] Toast通知が表示される
- [ ] 作成後に一覧画面に遷移する

**テスト要件**:
- [ ] フォーム送信でAPIが呼ばれる
- [ ] バリデーションエラーが表示される
- [ ] 初期デッキカード選択でN:M関連付けができる
- [ ] 作成成功でToast通知が表示される

---

#### ☑ TASK-0054: 錬金スタイル編集画面実装
- **推定工数**: 2時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0053

**実装詳細**:
1. `src/pages/alchemy-styles/AlchemyStyleEditPage.tsx`作成（AlchemyStyleCreatePageと類似、既存データ取得・更新処理が追加）

**完了条件**:
- [ ] 既存錬金スタイルデータが取得される
- [ ] フォームに既存データが表示される
- [ ] 既存の初期デッキカード選択状態が復元される
- [ ] 錬金スタイル更新が成功する
- [ ] Toast通知が表示される
- [ ] 更新後に一覧画面に遷移する

**テスト要件**:
- [ ] 既存データでフォームが初期化される
- [ ] フォーム送信で更新APIが呼ばれる
- [ ] 初期デッキカード選択の変更が反映される
- [ ] 更新成功でToast通知が表示される

---

#### ☑ TASK-0055: 錬金スタイル詳細・削除機能実装
- **推定工数**: 3時間
- **タスクタイプ**: TDD
- **要件へのリンク**: WRREQ-029, WRREQ-030, WRREQ-031
- **依存タスク**: TASK-0054

**実装詳細**:
1. `src/pages/alchemy-styles/AlchemyStyleDetailPage.tsx`作成
   ```typescript
   import { FC, useState } from 'react';
   import { Link, useParams, useNavigate } from 'react-router-dom';
   import { useAlchemyStyle, useDeleteAlchemyStyle } from '../../hooks/useAlchemyStyles';
   import { useToast } from '../../contexts/ToastContext';
   import Button from '../../components/common/Button';
   import Modal from '../../components/common/Modal';

   const AlchemyStyleDetailPage: FC = () => {
     const { id } = useParams<{ id: string }>();
     const navigate = useNavigate();
     const { data: alchemyStyle, isLoading, error } = useAlchemyStyle(id!);
     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
     const { mutate: deleteAlchemyStyle, isLoading: isDeleting } = useDeleteAlchemyStyle();
     const { addToast } = useToast();

     const handleDelete = () => {
       deleteAlchemyStyle(id!, {
         onSuccess: () => {
           addToast('success', '錬金スタイルを削除しました');
           navigate('/alchemy-styles');
         },
         onError: () => {
           addToast('error', '錬金スタイルの削除に失敗しました');
         },
       });
     };

     if (isLoading) return <div>読み込み中...</div>;
     if (error) return <div>エラーが発生しました</div>;
     if (!alchemyStyle) return <div>錬金スタイルが見つかりません</div>;

     return (
       <div>
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold">錬金スタイル詳細</h1>
           <div className="flex gap-2">
             <Link to={`/alchemy-styles/${id}/edit`}>
               <Button variant="primary">編集</Button>
             </Link>
             <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>削除</Button>
             <Link to="/alchemy-styles">
               <Button variant="secondary">一覧に戻る</Button>
             </Link>
           </div>
         </div>

         <div className="bg-white shadow rounded-lg p-6 space-y-4">
           <div>
             <h2 className="text-sm font-medium text-gray-500">錬金スタイル名</h2>
             <p className="text-lg">{alchemyStyle.name}</p>
           </div>
           <div>
             <h2 className="text-sm font-medium text-gray-500">説明</h2>
             <p className="text-lg">{alchemyStyle.description}</p>
           </div>
           <div>
             <h2 className="text-sm font-medium text-gray-500">特徴</h2>
             <p className="text-lg">{alchemyStyle.characteristics}</p>
           </div>
           <div>
             <h2 className="text-sm font-medium text-gray-500 mb-2">初期デッキカード</h2>
             {alchemyStyle.initialDeckCards && alchemyStyle.initialDeckCards.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {alchemyStyle.initialDeckCards.map((card) => (
                   <Link key={card.id} to={`/cards/${card.id}`}>
                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200">
                       {card.name} {card.cardType && `(${card.cardType})`}
                     </span>
                   </Link>
                 ))}
               </div>
             ) : (
               <p className="text-gray-500">初期デッキカードなし</p>
             )}
           </div>
         </div>

         <Modal
           isOpen={isDeleteModalOpen}
           onClose={() => setIsDeleteModalOpen(false)}
           title="錬金スタイルの削除"
           footer={
             <>
               <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>キャンセル</Button>
               <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>削除</Button>
             </>
           }
         >
           <p>本当にこの錬金スタイルを削除しますか？この操作は取り消せません。</p>
         </Modal>
       </div>
     );
   };

   export default AlchemyStyleDetailPage;
   ```

**完了条件**:
- [ ] 錬金スタイル詳細が表示される
- [ ] 全フィールドが正しく表示される
- [ ] 初期デッキカード一覧が表示される
- [ ] 初期デッキカードからカード詳細へのリンクが動作する
- [ ] 編集ボタンが動作する
- [ ] 削除ボタンが動作する
- [ ] 削除確認モーダルが表示される
- [ ] 錬金スタイル削除が成功する
- [ ] 一覧に戻るボタンが動作する

**テスト要件**:
- [ ] データ取得時に錬金スタイル詳細が表示される
- [ ] 存在しないIDでエラーメッセージが表示される
- [ ] 初期デッキカードが正しく表示される
- [ ] 削除ボタンクリックでモーダルが表示される
- [ ] 削除成功でToast通知が表示される

---

## Phase 4 完了条件

### 必須条件
- [ ] 顧客管理画面（一覧・作成・編集・詳細・削除）が動作する
- [ ] 顧客作成・編集時にN:M関連（報酬カード）が正しく動作する
- [ ] 錬金スタイル管理API（GET一覧・詳細、POST、PUT、DELETE）が動作する
- [ ] 錬金スタイル管理画面（一覧・作成・編集・詳細・削除）が動作する
- [ ] 錬金スタイル作成・編集時にN:M関連（初期デッキカード）が正しく動作する
- [ ] フォームバリデーション（Zod）が正しく動作する
- [ ] Toast通知が正しく表示される

### 品質基準
- [ ] ESLint・Prettierでコード整形されている
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 全テストが通る
- [ ] TanStack Query Devtoolsで状態確認できる
- [ ] N:Mリレーション（報酬カード、初期デッキカード）が正しく動作する

### マイルストーン
- [x] **M4: 顧客・錬金スタイル管理完成** - Phase 4完了時点で達成

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2025-11-09 | 1.0 | 初版作成。13タスク、64時間 |
