-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    dietary_preferences TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_description TEXT,
    duration TEXT,
    difficulty TEXT,
    calories TEXT,
    color TEXT,
    youtube_id TEXT,
    ingredients TEXT[] NOT NULL,
    steps TEXT[] NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Recipes (Saved/Liked)
CREATE TABLE IF NOT EXISTS public.user_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    is_saved BOOLEAN DEFAULT false,
    is_liked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, recipe_id)
);

-- Weekly Plans
CREATE TABLE IF NOT EXISTS public.weekly_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Recipes Policies
CREATE POLICY "Recipes are viewable by everyone." ON public.recipes FOR SELECT USING (true);

-- User Recipes Policies
CREATE POLICY "Users can view own saved recipes." ON public.user_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved recipes." ON public.user_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved recipes." ON public.user_recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved recipes." ON public.user_recipes FOR DELETE USING (auth.uid() = user_id);

-- Weekly Plans Policies
CREATE POLICY "Users can view own plans." ON public.weekly_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans." ON public.weekly_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans." ON public.weekly_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans." ON public.weekly_plans FOR DELETE USING (auth.uid() = user_id);

-- Insert Mock Data
INSERT INTO public.recipes (title, short_description, duration, difficulty, calories, color, youtube_id, ingredients, steps, is_premium)
VALUES
('Паста с чесноком и сливками', 'Ужин в одной кастрюле за 15 минут.', '15 мин', 'Легко', '520 ккал', 'from-orange-300 via-amber-300 to-rose-200', 'OOQYS7VERMw', ARRAY['200 г спагетти', '3 зубчика чеснока', '200 мл сливок', '30 г пармезана', 'Оливковое масло, соль, перец'], ARRAY['Сварите пасту в подсолённой воде до аль денте.', 'Обжарьте чеснок на оливковом масле на слабом огне.', 'Добавьте сливки, потомите 2–3 минуты, приправьте.', 'Добавьте пасту и пармезан, перемешайте.'], false),
('Будда-боул по-средиземноморски', 'Яркий сытный обед с овощами.', '25 мин', 'Средне', '640 ккал', 'from-amber-200 via-lime-200 to-emerald-200', 'jYj-lCtZU8A', ARRAY['120 г киноа', '1 авокадо', '150 г нута', 'Помидоры черри, огурец, красный лук', 'Тахин, лимон, оливковое масло, чеснок'], ARRAY['Сварите киноа по инструкции.', 'Нут смешайте с маслом, солью и паприкой.', 'Сделайте заправку из тахини, лимона и чеснока.', 'Соберите боул: киноа, овощи, нут, авокадо, заправка.'], false),
('Овсяный парфе на завтрак', 'Завтрак в стакане — быстро и вкусно.', '10 мин', 'Легко', '380 ккал', 'from-orange-200 via-pink-200 to-sky-200', '_gadU4xI5fs', ARRAY['60 г овсянки', '150 мл молока', 'Греческий йогурт', 'Ягоды, банан', 'Мёд, семена чиа'], ARRAY['Смешайте овсянку, молоко и чиа, оставьте на 5 минут.', 'Выложите слоями с йогуртом в стакан.', 'Сверху — банан, ягоды, мёд.'], false),
('Лосось на противне с брокколи', 'Простой ужин на одном противне.', '20 мин', 'Легко', '450 ккал', 'from-amber-300 via-orange-300 to-red-200', 'd1wXX9xO_2o', ARRAY['2 стейка лосося', 'Соцветия брокколи', 'Чили, чесночный порошок', 'Соевый соус, мёд, оливковое масло'], ARRAY['Смешайте соевый соус, мёд, чили и чеснок.', 'Выложите лосось и брокколи на противень, полейте маринадом.', 'Запекайте при 200°C 12–15 минут.'], false),
('Трюфельное ризотто (Premium)', 'Ресторанное блюдо у вас дома.', '40 мин', 'Сложно', '700 ккал', 'from-slate-700 via-slate-800 to-slate-900', 'v1Y3_r4K3w4', ARRAY['300 г риса арборио', '1 л куриного бульона', '50 г трюфельной пасты', '100 мл белого вина', 'Пармезан, сливочное масло, лук-шалот'], ARRAY['Обжарьте лук-шалот на сливочном масле.', 'Добавьте рис, обжарьте минуту, влейте вино.', 'Постепенно добавляйте бульон, постоянно помешивая.', 'В конце добавьте трюфельную пасту, пармезан и масло.'], true)
ON CONFLICT DO NOTHING;