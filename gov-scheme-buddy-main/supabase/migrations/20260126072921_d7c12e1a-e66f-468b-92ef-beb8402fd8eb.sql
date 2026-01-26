-- Enable Row Level Security on chat_history table
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own chat history
CREATE POLICY "Users can view their own chat history"
ON public.chat_history
FOR SELECT
TO authenticated
USING (user_id = auth.uid()::text);

-- Create policy for users to insert their own chat messages
CREATE POLICY "Users can insert their own chat messages"
ON public.chat_history
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid()::text);

-- Create policy for users to delete their own chat history
CREATE POLICY "Users can delete their own chat history"
ON public.chat_history
FOR DELETE
TO authenticated
USING (user_id = auth.uid()::text);