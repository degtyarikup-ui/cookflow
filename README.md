# CookFlow

Минималистичное приложение: лента рецептов в формате Shorts, сохранённые рецепты и недельный план питания.

- **Лента** — вертикальный скролл, по одному видео (YouTube Shorts о готовке).
- **Рецепты** — сохранённые и созданные через «Рецепт от ИИ».
- **План** — календарь на неделю (завтрак / обед / ужин).

Один файл `index.html`, без сборки. Открывается в браузере или через GitHub Pages.

## Как открыть с телефона по ссылке (GitHub Pages)

1. Создайте репозиторий на GitHub: https://github.com/new  
   - Имя, например: `cookflow`  
   - **Не** ставьте галочку «Add a README»  
   - Create repository  

2. В терминале в папке проекта выполните (подставьте свой логин и имя репозитория):

   ```bash
   cd "/Users/sergei/Documents/Еда 2"
   git remote add origin https://github.com/ВАШ_ЛОГИН/cookflow.git
   git branch -M main
   git push -u origin main
   ```

3. Включите GitHub Pages в репозитории:
   - Откройте репозиторий на GitHub → **Settings** → **Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main` → папка `/ (root)` → Save

4. Через 1–2 минуты сайт будет доступен по адресу:
   - `https://ВАШ_ЛОГИН.github.io/cookflow/`

Эту ссылку можно открыть на телефоне и добавить на главный экран как веб-приложение.
