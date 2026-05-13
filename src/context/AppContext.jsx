import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

const initialRecipes = [
  { id: "r1", title: "Паста с чесноком и сливками", shortDescription: "Ужин в одной кастрюле за 15 минут.", duration: "15 мин", difficulty: "Легко", calories: "520 ккал", color: "from-orange-300 via-amber-300 to-rose-200",
    youtubeId: "OOQYS7VERMw",
    ingredients: ["200 г спагетти", "3 зубчика чеснока", "200 мл сливок", "30 г пармезана", "Оливковое масло, соль, перец"],
    steps: ["Сварите пасту в подсолённой воде до аль денте.", "Обжарьте чеснок на оливковом масле на слабом огне.", "Добавьте сливки, потомите 2–3 минуты, приправьте.", "Добавьте пасту и пармезан, перемешайте."],
    isPremium: false
  },
  { id: "r2", title: "Будда-боул по-средиземноморски", shortDescription: "Яркий сытный обед с овощами.", duration: "25 мин", difficulty: "Средне", calories: "640 ккал", color: "from-amber-200 via-lime-200 to-emerald-200",
    youtubeId: "jYj-lCtZU8A",
    ingredients: ["120 г киноа", "1 авокадо", "150 г нута", "Помидоры черри, огурец, красный лук", "Тахин, лимон, оливковое масло, чеснок"],
    steps: ["Сварите киноа по инструкции.", "Нут смешайте с маслом, солью и паприкой.", "Сделайте заправку из тахини, лимона и чеснока.", "Соберите боул: киноа, овощи, нут, авокадо, заправка."],
    isPremium: false
  },
  { id: "r3", title: "Овсяный парфе на завтрак", shortDescription: "Завтрак в стакане — быстро и вкусно.", duration: "10 мин", difficulty: "Легко", calories: "380 ккал", color: "from-orange-200 via-pink-200 to-sky-200",
    youtubeId: "_gadU4xI5fs",
    ingredients: ["60 г овсянки", "150 мл молока", "Греческий йогурт", "Ягоды, банан", "Мёд, семена чиа"],
    steps: ["Смешайте овсянку, молоко и чиа, оставьте на 5 минут.", "Выложите слоями с йогуртом в стакан.", "Сверху — банан, ягоды, мёд."],
    isPremium: false
  },
  { id: "r4", title: "Лосось на противне с брокколи", shortDescription: "Простой ужин на одном противне.", duration: "20 мин", difficulty: "Легко", calories: "450 ккал", color: "from-amber-300 via-orange-300 to-red-200",
    youtubeId: "d1wXX9xO_2o",
    ingredients: ["2 стейка лосося", "Соцветия брокколи", "Чили, чесночный порошок", "Соевый соус, мёд, оливковое масло"],
    steps: ["Смешайте соевый соус, мёд, чили и чеснок.", "Выложите лосось и брокколи на противень, полейте маринадом.", "Запекайте при 200°C 12–15 минут."],
    isPremium: false
  },
  { id: "r5", title: "Трюфельное ризотто (Premium)", shortDescription: "Ресторанное блюдо у вас дома.", duration: "40 мин", difficulty: "Сложно", calories: "700 ккал", color: "from-slate-700 via-slate-800 to-slate-900",
    youtubeId: "v1Y3_r4K3w4",
    ingredients: ["300 г риса арборио", "1 л куриного бульона", "50 г трюфельной пасты", "100 мл белого вина", "Пармезан, сливочное масло, лук-шалот"],
    steps: ["Обжарьте лук-шалот на сливочном масле.", "Добавьте рис, обжарьте минуту, влейте вино.", "Постепенно добавляйте бульон, постоянно помешивая.", "В конце добавьте трюфельную пасту, пармезан и масло."],
    isPremium: true
  }
];

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [recipes, setRecipes] = useState(() => {
    if (supabase.isMock) {
      const saved = localStorage.getItem('recipes');
      return saved ? JSON.parse(saved) : initialRecipes;
    }
    return [];
  });
  const [savedIds, setSavedIds] = useState(() => {
    if (supabase.isMock) {
      const saved = localStorage.getItem('savedIds');
      return saved ? JSON.parse(saved) : [initialRecipes[0].id, initialRecipes[1].id];
    }
    return [];
  });
  const [planner, setPlanner] = useState(() => {
    if (supabase.isMock) {
      const saved = localStorage.getItem('planner');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [isPremium, setIsPremium] = useState(() => {
    if (supabase.isMock) {
      const saved = localStorage.getItem('isPremium');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [customShoppingItems, setCustomShoppingItems] = useState(() => {
    const saved = localStorage.getItem('customShoppingItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (supabase.isMock) {
      localStorage.setItem('recipes', JSON.stringify(recipes));
      localStorage.setItem('savedIds', JSON.stringify(savedIds));
      localStorage.setItem('planner', JSON.stringify(planner));
      localStorage.setItem('isPremium', JSON.stringify(isPremium));
    }
    localStorage.setItem('customShoppingItems', JSON.stringify(customShoppingItems));
  }, [recipes, savedIds, planner, isPremium, customShoppingItems]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRecipes = useCallback(async () => {
    if (supabase.isMock) return;
    try {
      const { data } = await supabase.from('recipes').select('*');
      if (data && data.length > 0) setRecipes(data);
      else if (data && data.length === 0) {
          // fallback if table is empty
          setRecipes(initialRecipes);
      }
    } catch {
      setRecipes(initialRecipes);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user || supabase.isMock) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setIsPremium(data.is_premium);
      }
    } catch {
      // Profile is optional in mock or partially configured Supabase projects.
    }
  }, [user]);

  const fetchUserRecipes = useCallback(async () => {
    if (!user || supabase.isMock) return;
    try {
      const { data } = await supabase
        .from('user_recipes')
        .select('recipe_id')
        .eq('user_id', user.id)
        .eq('is_saved', true);

      if (data) setSavedIds(data.map(d => d.recipe_id));
    } catch {
      // Saved recipes are optional for new users.
    }
  }, [user]);

  const fetchWeeklyPlan = useCallback(async () => {
    if (!user || supabase.isMock) return;
    try {
      const { data } = await supabase
        .from('weekly_plans')
        .select('plan_data')
        .eq('user_id', user.id)
        .single();

      if (data) setPlanner(data.plan_data);
    } catch {
      // Weekly plans are optional for new users.
    }
  }, [user]);

  useEffect(() => {
    if (user && !supabase.isMock) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProfile();
      fetchUserRecipes();
      fetchWeeklyPlan();
    }
  }, [user, fetchProfile, fetchUserRecipes, fetchWeeklyPlan]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecipes();
  }, [fetchRecipes]);

  const toggleSave = useCallback(async (recipeId) => {
    const isCurrentlySaved = savedIds.includes(recipeId);

    if (isCurrentlySaved) {
      setSavedIds(prev => prev.filter(id => id !== recipeId));
      if (user && !supabase.isMock) {
        await supabase
          .from('user_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
      }
    } else {
      setSavedIds(prev => [...prev, recipeId]);
      if (user && !supabase.isMock) {
        await supabase
          .from('user_recipes')
          .upsert({ user_id: user.id, recipe_id: recipeId, is_saved: true });
      }
    }
  }, [savedIds, user]);

  const skipAuth = () => {
      // Just mark session as mocked so app loads
      setSession({ mock: true });
      setProfile({ dietary_preferences: [] });
  };

  const logout = async () => {
    if (!supabase.isMock) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setPlanner({});
    setSavedIds([]);
    setIsPremium(false);
  };

  return (
    <AppContext.Provider value={{
      session, user, profile, setProfile,
      recipes, setRecipes,
      savedIds, toggleSave,
      planner, setPlanner,
      isPremium, setIsPremium,
      customShoppingItems, setCustomShoppingItems,
      fetchProfile, fetchWeeklyPlan,
      skipAuth, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
