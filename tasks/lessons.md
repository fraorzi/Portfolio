# Lessons

- **Verify what is on screen, not the render buffer.** Reading WebGL pixels proved the shader math, but the canvas was displayed at buffer size on dpr > 1 screens, so the user saw a 1.5× scaled scene. For anything visual, check the composited page (screenshot at the user's dpr, or the element's CSS box against the viewport) before calling it fixed.
- **"Avoid text" means avoid heavy overlap, not zero overlap.** The user prioritises the art direction: shapes may brush small text and headings; only large text blocks (paragraphs, lists) should stay clear. Prefer fixing the cause of big overlaps (unbounded spin, shapes not moving with their section) over shrinking or relocating shapes.
