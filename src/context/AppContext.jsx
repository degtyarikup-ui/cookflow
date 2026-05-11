import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
    youtubeId: "v1Y3_r4K3w4", // Note: Fake ID or random cooking video for demo
    ingredients: ["300 г риса арборио", "1 л куриного бульона", "50 г трюфельной пасты", "100 мл белого вина", "Пармезан, сливочное масло, лук-шалот"],
    steps: ["Обжарьте лук-шалот на сливочном масле.", "Добавьте рис, обжарьте минуту, влейте вино.", "Постепенно добавляйте бульон, постоянно помешивая.", "В конце добавьте трюфельную пасту, пармезан и масло."],
    isPremium: true
  }
];

export const AppProvider = ({ children }) => {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : initialRecipes;
  });

  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem('savedIds');
    return saved ? JSON.parse(saved) : [initialRecipes[0].id, initialRecipes[1].id];
  });

  const [planner, setPlanner] = useState(() => {
    const saved = localStorage.getItem('planner');
    return saved ? JSON.parse(saved) : {};
  });

  const [isPremium, setIsPremium] = useState(() => {
    const saved = localStorage.getItem('isPremium');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('savedIds', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('planner', JSON.stringify(planner));
  }, [planner]);

  useEffect(() => {
    localStorage.setItem('isPremium', JSON.stringify(isPremium));
  }, [isPremium]);

  const toggleSave = useCallback((id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]);
  }, []);

  const addRecipe = (newRecipe) => {
    setRecipes(prev => [...prev, newRecipe]);
    setSavedIds(prev => [...prev, newRecipe.id]);
  };

  return (
    <AppContext.Provider value={{
      recipes, setRecipes,
      savedIds, toggleSave,
      planner, setPlanner,
      isPremium, setIsPremium,
      addRecipe
    }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);