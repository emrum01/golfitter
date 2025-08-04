-- Supabase Storageバケットの作成と設定
-- このスクリプトをSupabaseのSQL Editorで実行してください

-- swing-videosバケットを作成（既に存在する場合はスキップ）
INSERT INTO storage.buckets (id, name, public)
VALUES ('swing-videos', 'swing-videos', true)
ON CONFLICT (id) DO NOTHING;

-- バケットのポリシーを設定

-- 認証されたユーザーのアップロードを許可
CREATE POLICY "Allow authenticated users to upload videos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'swing-videos');

-- 認証されたユーザーの読み取りを許可
CREATE POLICY "Allow authenticated users to read videos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'swing-videos');

-- 認証されたユーザーの削除を許可（自分がアップロードしたもののみ）
CREATE POLICY "Allow users to delete their own videos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'swing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- パブリックアクセスを許可（必要に応じて）
CREATE POLICY "Allow public to read videos" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'swing-videos');