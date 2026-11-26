# Koda problem draft prompt (for an LLM)

You are preparing a Competitive Programming problem for **Koda**, a mobile app that tests algorithmic intuition (not code).

Given a problem statement (and optional editorial), output **only** valid JSON matching this shape:

```json
{
  "id": "source-slug",
  "title": "Title",
  "source": "CSES | Codeforces | AtCoder | USACO | Other",
  "url": "https://...",
  "difficulty_rating": 1400,
  "statement_md": "Markdown with $LaTeX$ math...",
  "input_format_md": "The first line contains an integer $n$.\\n\\nThe second line contains $n$ integers...",
  "output_format_md": "Print a single integer — the answer.",
  "constraints_text": "$1 \\le n \\le 10^5$",
  "sample_io": [{ "input": "...", "output": "..." }],
  "target_complexity": "O(N log N)",
  "approaches": [
    {
      "id": "source-slug-a1",
      "problem_id": "source-slug",
      "approach_name": "Short name",
      "paradigms": ["Dynamic Programming"],
      "algorithms": ["Knapsack"],
      "data_structures": ["1D Array"],
      "key_insights": ["The catch / twist in plain English"],
      "editorial_summary_md": "2–5 sentence editorial with math if needed"
    }
  ]
}
```

Rules:
- Prefer tags from Koda’s catalog (DP, Greedy, Graphs, Two Pointers, Binary Search on Answer, etc.).
- Always include at least one approach; multiple valid approaches are encouraged.
- `key_insights` must be the non-obvious twists (not “use an array”).
- **Always** include `input_format_md` and `output_format_md` (expected I/O structure — not just samples).
- Do **not** invent constraints; leave uncertain fields empty and note them.
- Human will review before import — accuracy over cleverness.

## Figures, matrices, diagrams

Koda statements support rich media in `statement_md` (and editorials):

1. **Monospace grids / ASCII matrices** — fenced blocks:

````markdown
```grid
.  6  .
5  0  1
.  4  .
```
````

2. **Bundled SVG figures** — either:

```markdown
[[figure:spiral-grid]]
![Hex hive](asset:hex-hive)
```

Built-in ids: `binary-trees`, `spiral-grid`, `hex-hive`. New diagrams go in `data/figures/` and `lib/figures.ts`.

3. **Inline SVG** — fenced ` ```svg ` containing a full `<svg>...</svg>`.

4. **Remote images** — `![alt](https://...)` (requires network in the WebView).

When converting PDF/OJ statements: **do not drop figures**. Prefer redrawing as SVG or a ` ```grid ` block. Describe spatial structure in text as a backup for plain-text mode.
