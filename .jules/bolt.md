## 2024-05-12 - Avoid O(N²) array lookups in React renders

**Learning:** When components render nested loops (e.g., Planner days/meals or ShoppingList day/meal/recipe) and perform `.find()` on an array of resources (e.g., `recipes`) within the innermost loop, it creates a hidden O(N * M) or O(N²) performance bottleneck. This becomes worse if the render occurs frequently.
**Action:** Always pre-compute a hash map (object or Map) of the resources indexed by their unique ID using `useMemo` before entering rendering loops to achieve O(1) lookups.
