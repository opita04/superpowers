---
name: slack-gif-creator
description: Knowledge and utilities for creating animated GIFs optimized for Slack. Provides constraints, validation tools, and animation concepts. Use when users request animated GIFs for Slack like "make me a GIF of X doing Y for Slack."
license: Complete terms in LICENSE.txt
---

# Slack GIF Creator

A toolkit providing utilities and knowledge for creating animated GIFs optimized for Slack.

## Slack Requirements

**Dimensions:**
- Emoji GIFs: 128x128 (recommended)
- Message GIFs: 480x480

**Parameters:**
- FPS: 10-30 (lower is smaller file size)
- Colors: 48-128 (fewer = smaller file size)
- Duration: Keep under 3 seconds for emoji GIFs

## Core Workflow

```python
from core.gif_builder import GIFBuilder
from PIL import Image, ImageDraw

# 1. Create builder
builder = GIFBuilder(width=128, height=128, fps=10)

# 2. Generate frames
for i in range(12):
    frame = Image.new('RGB', (128, 128), (240, 248, 255))
    draw = ImageDraw.Draw(frame)

    # Draw your animation using PIL primitives
    # (circles, polygons, lines, etc.)

    builder.add_frame(frame)

# 3. Save with optimization
builder.save('output.gif', num_colors=48, optimize_for_emoji=True)
```

## Drawing Graphics

### Working with User-Uploaded Images
If a user uploads an image, consider whether they want to:
- **Use it directly** (e.g., "animate this", "split this into frames")
- **Use it as inspiration** (e.g., "make something like this")

Load and work with images using PIL:
```python
from PIL import Image

uploaded = Image.open('file.png')
# Use directly, or just as reference for colors/style
```

### Drawing from Scratch
When drawing graphics from scratch, use PIL ImageDraw primitives:

```python
from PIL import ImageDraw

draw = ImageDraw.Draw(frame)

# Circles/ovals
draw.ellipse([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)

# Stars, triangles, any polygon
points = [(x1, y1), (x2, y2), (x3, y3), ...]
draw.polygon(points, fill=(r, g, b), outline=(r, g, b), width=3)

# Lines
draw.line([(x1, y1), (x2, y2)], fill=(r, g, b), width=5)

# Rectangles
draw.rectangle([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)
```

**Don't use:** Emoji fonts (unreliable across platforms) or assume pre-packaged graphics exist in this skill.

### Making Graphics Look Good

Graphics should look polished and creative, not basic. Here's how:

**Use thicker lines** - Always set `width=2` or higher for outlines and lines. Thin lines (width=1) look choppy and amateurish.

**Add visual depth**:
- Use gradients for backgrounds (`create_gradient_background`)
- Layer multiple shapes for complexity (e.g., a star with a smaller star inside)

**Make shapes more interesting**:
- Don't just draw a plain circle - add highlights, rings, or patterns
- Stars can have glows (draw larger, semi-transparent versions behind)
- Combine multiple shapes (stars + sparkles, circles + rings)

**Pay attention to colors**:
- Use vibrant, complementary colors
- Add contrast (dark outlines on light shapes, light outlines on dark shapes)
- Consider the overall composition

**For complex shapes** (hearts, snowflakes, etc.):
- Use combinations of polygons and ellipses
- Calculate points carefully for symmetry
- Add details (a heart can have a highlight curve, snowflakes have intricate branches)

Be creative and detailed! A good Slack GIF should look polished, not like placeholder graphics.

## Available Utilities

### GIFBuilder (`core.gif_builder`)
Assembles frames and optimizes for Slack:
```python
builder = GIFBuilder(width=128, height=128, fps=10)
builder.add_frame(frame)  # Add PIL Image
builder.add_frames(frames)  # Add list of frames
builder.save('out.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)
```

### Validators (`core.validators`)
Check if GIF meets Slack requirements:
```python
from core.validators import validate_gif, is_slack_ready

# Detailed validation
passes, info = validate_gif('my.gif', is_emoji=True, verbose=True)

# Quick check
if is_slack_ready('my.gif'):
    print("Ready!")
```

### Easing Functions (`core.easing`)
Smooth motion instead of linear:
```python
from core.easing import interpolate

# Progress from 0.0 to 1.0
t = i / (num_frames - 1)

# Apply easing
y = interpolate(start=0, end=400, t=t, easing='ease_out')

# Available: linear, ease_in, ease_out, ease_in_out,
#           bounce_out, elastic_out, back_out
```

### Frame Helpers (`core.frame_composer`)
Convenience functions for common needs:
```python
from core.frame_composer import (
    create_blank_frame,         # Solid color background
    create_gradient_background,  # Vertical gradient
    draw_circle,                # Helper for circles
    draw_text,                  # Simple text rendering
    draw_star                   # 5-pointed star
)
```

## Animation Concepts

### Shake/Vibrate
Offset object position with oscillation:
- Use `math.sin()` or `math.cos()` with frame index
- Add small random variations for natural feel
- Apply to x and/or y position

### Pulse/Heartbeat
Scale object size rhythmically:
- Use `math.sin(t * frequency * 2 * math.pi)` for smooth pulse
- For heartbeat: two quick pulses then pause (adjust sine wave)
- Scale between 0.8 and 1.2 of base size

### Bounce
Object falls and bounces:
- Use `interpolate()` with `easing='bounce_out'` for landing
- Use `easing='ease_in'` for falling (accelerating)
- Apply gravity by increasing y velocity each frame

### Spin/Rotate
Rotate object around center:
- PIL: `image.rotate(angle, resample=Image.BICUBIC)`
- For wobble: use sine wave for angle instead of linear

### Fade In/Out
Gradually appear or disappear:
- Create RGBA image, adjust alpha channel
- Or use `Image.blend(image1, image2, alpha)`
- Fade in: alpha from 0 to 1
- Fade out: alpha from 1 to 0

### Slide
Move object from off-screen to position:
- Start position: outside frame bounds
- End position: target location
- Use `interpolate()` with `easing='ease_out'` for smooth stop
- For overshoot: use `easing='back_out'`

### Zoom
Scale and position for zoom effect:
- Zoom in: scale from 0.1 to 2.0, crop center
- Zoom out: scale from 2.0 to 1.0
- Can add motion blur for drama (PIL filter)

### Explode/Particle Burst
Create particles radiating outward:
- Generate particles with random angles and velocities
- Update each particle: `x += vx`, `y += vy`
- Add gravity: `vy += gravity_constant`
- Fade out particles over time (reduce alpha)

## Optimization Strategies

Only when asked to make the file size smaller, implement a few of the following methods:

1. **Fewer frames** - Lower FPS (10 instead of 20) or shorter duration
2. **Fewer colors** - `num_colors=48` instead of 128
3. **Smaller dimensions** - 128x128 instead of 480x480
4. **Remove duplicates** - `remove_duplicates=True` in save()
5. **Emoji mode** - `optimize_for_emoji=True` auto-optimizes

```python
# Maximum optimization for emoji
builder.save(
    'emoji.gif',
    num_colors=48,
    optimize_for_emoji=True,
    remove_duplicates=True
)
```

## Philosophy

This skill provides:
- **Knowledge**: Slack's requirements and animation concepts
- **Utilities**: GIFBuilder, validators, easing functions
- **Flexibility**: Create the animation logic using PIL primitives

It does NOT provide:
- Rigid animation templates or pre-made functions
- Emoji font rendering (unreliable across platforms)
- A library of pre-packaged graphics built into the skill

**Note on user uploads**: This skill doesn't include pre-built graphics, but if a user uploads an image, use PIL to load and work with it - interpret based on their request whether they want it used directly or just as inspiration.

Be creative! Combine concepts (bouncing + rotating, pulsing + sliding, etc.) and use PIL's full capabilities.

## Dependencies

```bash
pip install pillow imageio numpy
```


# Referenced Files

## File: core/easing.py

```py
#!/usr/bin/env python3
"""
Easing Functions - Timing functions for smooth animations.

Provides various easing functions for natural motion and timing.
All functions take a value t (0.0 to 1.0) and return eased value (0.0 to 1.0).
"""

import math


def linear(t: float) -> float:
    """Linear interpolation (no easing)."""
    return t


def ease_in_quad(t: float) -> float:
    """Quadratic ease-in (slow start, accelerating)."""
    return t * t


def ease_out_quad(t: float) -> float:
    """Quadratic ease-out (fast start, decelerating)."""
    return t * (2 - t)


def ease_in_out_quad(t: float) -> float:
    """Quadratic ease-in-out (slow start and end)."""
    if t < 0.5:
        return 2 * t * t
    return -1 + (4 - 2 * t) * t


def ease_in_cubic(t: float) -> float:
    """Cubic ease-in (slow start)."""
    return t * t * t


def ease_out_cubic(t: float) -> float:
    """Cubic ease-out (fast start)."""
    return (t - 1) * (t - 1) * (t - 1) + 1


def ease_in_out_cubic(t: float) -> float:
    """Cubic ease-in-out."""
    if t < 0.5:
        return 4 * t * t * t
    return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1


def ease_in_bounce(t: float) -> float:
    """Bounce ease-in (bouncy start)."""
    return 1 - ease_out_bounce(1 - t)


def ease_out_bounce(t: float) -> float:
    """Bounce ease-out (bouncy end)."""
    if t < 1 / 2.75:
        return 7.5625 * t * t
    elif t < 2 / 2.75:
        t -= 1.5 / 2.75
        return 7.5625 * t * t + 0.75
    elif t < 2.5 / 2.75:
        t -= 2.25 / 2.75
        return 7.5625 * t * t + 0.9375
    else:
        t -= 2.625 / 2.75
        return 7.5625 * t * t + 0.984375


def ease_in_out_bounce(t: float) -> float:
    """Bounce ease-in-out."""
    if t < 0.5:
        return ease_in_bounce(t * 2) * 0.5
    return ease_out_bounce(t * 2 - 1) * 0.5 + 0.5


def ease_in_elastic(t: float) -> float:
    """Elastic ease-in (spring effect)."""
    if t == 0 or t == 1:
        return t
    return -math.pow(2, 10 * (t - 1)) * math.sin((t - 1.1) * 5 * math.pi)


def ease_out_elastic(t: float) -> float:
    """Elastic ease-out (spring effect)."""
    if t == 0 or t == 1:
        return t
    return math.pow(2, -10 * t) * math.sin((t - 0.1) * 5 * math.pi) + 1


def ease_in_out_elastic(t: float) -> float:
    """Elastic ease-in-out."""
    if t == 0 or t == 1:
        return t
    t = t * 2 - 1
    if t < 0:
        return -0.5 * math.pow(2, 10 * t) * math.sin((t - 0.1) * 5 * math.pi)
    return math.pow(2, -10 * t) * math.sin((t - 0.1) * 5 * math.pi) * 0.5 + 1


# Convenience mapping
EASING_FUNCTIONS = {
    "linear": linear,
    "ease_in": ease_in_quad,
    "ease_out": ease_out_quad,
    "ease_in_out": ease_in_out_quad,
    "bounce_in": ease_in_bounce,
    "bounce_out": ease_out_bounce,
    "bounce": ease_in_out_bounce,
    "elastic_in": ease_in_elastic,
    "elastic_out": ease_out_elastic,
    "elastic": ease_in_out_elastic,
}


def get_easing(name: str = "linear"):
    """Get easing function by name."""
    return EASING_FUNCTIONS.get(name, linear)


def interpolate(start: float, end: float, t: float, easing: str = "linear") -> float:
    """
    Interpolate between two values with easing.

    Args:
        start: Start value
        end: End value
        t: Progress from 0.0 to 1.0
        easing: Name of easing function

    Returns:
        Interpolated value
    """
    ease_func = get_easing(easing)
    eased_t = ease_func(t)
    return start + (end - start) * eased_t


def ease_back_in(t: float) -> float:
    """Back ease-in (slight overshoot backward before forward motion)."""
    c1 = 1.70158
    c3 = c1 + 1
    return c3 * t * t * t - c1 * t * t


def ease_back_out(t: float) -> float:
    """Back ease-out (overshoot forward then settle back)."""
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2)


def ease_back_in_out(t: float) -> float:
    """Back ease-in-out (overshoot at both ends)."""
    c1 = 1.70158
    c2 = c1 * 1.525
    if t < 0.5:
        return (pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    return (pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2


def apply_squash_stretch(
    base_scale: tuple[float, float], intensity: float, direction: str = "vertical"
) -> tuple[float, float]:
    """
    Calculate squash and stretch scales for more dynamic animation.

    Args:
        base_scale: (width_scale, height_scale) base scales
        intensity: Squash/stretch intensity (0.0-1.0)
        direction: 'vertical', 'horizontal', or 'both'

    Returns:
        (width_scale, height_scale) with squash/stretch applied
    """
    width_scale, height_scale = base_scale

    if direction == "vertical":
        # Compress vertically, expand horizontally (preserve volume)
        height_scale *= 1 - intensity * 0.5
        width_scale *= 1 + intensity * 0.5
    elif direction == "horizontal":
        # Compress horizontally, expand vertically
        width_scale *= 1 - intensity * 0.5
        height_scale *= 1 + intensity * 0.5
    elif direction == "both":
        # General squash (both dimensions)
        width_scale *= 1 - intensity * 0.3
        height_scale *= 1 - intensity * 0.3

    return (width_scale, height_scale)


def calculate_arc_motion(
    start: tuple[float, float], end: tuple[float, float], height: float, t: float
) -> tuple[float, float]:
    """
    Calculate position along a parabolic arc (natural motion path).

    Args:
        start: (x, y) starting position
        end: (x, y) ending position
        height: Arc height at midpoint (positive = upward)
        t: Progress (0.0-1.0)

    Returns:
        (x, y) position along arc
    """
    x1, y1 = start
    x2, y2 = end

    # Linear interpolation for x
    x = x1 + (x2 - x1) * t

    # Parabolic interpolation for y
    # y = start + progress * (end - start) + arc_offset
    # Arc offset peaks at t=0.5
    arc_offset = 4 * height * t * (1 - t)
    y = y1 + (y2 - y1) * t - arc_offset

    return (x, y)


# Add new easing functions to the convenience mapping
EASING_FUNCTIONS.update(
    {
        "back_in": ease_back_in,
        "back_out": ease_back_out,
        "back_in_out": ease_back_in_out,
        "anticipate": ease_back_in,  # Alias
        "overshoot": ease_back_out,  # Alias
    }
)

```

## File: core/frame_composer.py

```py
#!/usr/bin/env python3
"""
Frame Composer - Utilities for composing visual elements into frames.

Provides functions for drawing shapes, text, emojis, and compositing elements
together to create animation frames.
"""

from typing import Optional

import numpy as np
from PIL import Image, ImageDraw, ImageFont


def create_blank_frame(
    width: int, height: int, color: tuple[int, int, int] = (255, 255, 255)
) -> Image.Image:
    """
    Create a blank frame with solid color background.

    Args:
        width: Frame width
        height: Frame height
        color: RGB color tuple (default: white)

    Returns:
        PIL Image
    """
    return Image.new("RGB", (width, height), color)


def draw_circle(
    frame: Image.Image,
    center: tuple[int, int],
    radius: int,
    fill_color: Optional[tuple[int, int, int]] = None,
    outline_color: Optional[tuple[int, int, int]] = None,
    outline_width: int = 1,
) -> Image.Image:
    """
    Draw a circle on a frame.

    Args:
        frame: PIL Image to draw on
        center: (x, y) center position
        radius: Circle radius
        fill_color: RGB fill color (None for no fill)
        outline_color: RGB outline color (None for no outline)
        outline_width: Outline width in pixels

    Returns:
        Modified frame
    """
    draw = ImageDraw.Draw(frame)
    x, y = center
    bbox = [x - radius, y - radius, x + radius, y + radius]
    draw.ellipse(bbox, fill=fill_color, outline=outline_color, width=outline_width)
    return frame


def draw_text(
    frame: Image.Image,
    text: str,
    position: tuple[int, int],
    color: tuple[int, int, int] = (0, 0, 0),
    centered: bool = False,
) -> Image.Image:
    """
    Draw text on a frame.

    Args:
        frame: PIL Image to draw on
        text: Text to draw
        position: (x, y) position (top-left unless centered=True)
        color: RGB text color
        centered: If True, center text at position

    Returns:
        Modified frame
    """
    draw = ImageDraw.Draw(frame)

    # Uses Pillow's default font.
    # If the font should be changed for the emoji, add additional logic here.
    font = ImageFont.load_default()

    if centered:
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = position[0] - text_width // 2
        y = position[1] - text_height // 2
        position = (x, y)

    draw.text(position, text, fill=color, font=font)
    return frame


def create_gradient_background(
    width: int,
    height: int,
    top_color: tuple[int, int, int],
    bottom_color: tuple[int, int, int],
) -> Image.Image:
    """
    Create a vertical gradient background.

    Args:
        width: Frame width
        height: Frame height
        top_color: RGB color at top
        bottom_color: RGB color at bottom

    Returns:
        PIL Image with gradient
    """
    frame = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(frame)

    # Calculate color step for each row
    r1, g1, b1 = top_color
    r2, g2, b2 = bottom_color

    for y in range(height):
        # Interpolate color
        ratio = y / height
        r = int(r1 * (1 - ratio) + r2 * ratio)
        g = int(g1 * (1 - ratio) + g2 * ratio)
        b = int(b1 * (1 - ratio) + b2 * ratio)

        # Draw horizontal line
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return frame


def draw_star(
    frame: Image.Image,
    center: tuple[int, int],
    size: int,
    fill_color: tuple[int, int, int],
    outline_color: Optional[tuple[int, int, int]] = None,
    outline_width: int = 1,
) -> Image.Image:
    """
    Draw a 5-pointed star.

    Args:
        frame: PIL Image to draw on
        center: (x, y) center position
        size: Star size (outer radius)
        fill_color: RGB fill color
        outline_color: RGB outline color (None for no outline)
        outline_width: Outline width

    Returns:
        Modified frame
    """
    import math

    draw = ImageDraw.Draw(frame)
    x, y = center

    # Calculate star points
    points = []
    for i in range(10):
        angle = (i * 36 - 90) * math.pi / 180  # 36 degrees per point, start at top
        radius = size if i % 2 == 0 else size * 0.4  # Alternate between outer and inner
        px = x + radius * math.cos(angle)
        py = y + radius * math.sin(angle)
        points.append((px, py))

    # Draw star
    draw.polygon(points, fill=fill_color, outline=outline_color, width=outline_width)

    return frame

```

## File: core/gif_builder.py

```py
#!/usr/bin/env python3
"""
GIF Builder - Core module for assembling frames into GIFs optimized for Slack.

This module provides the main interface for creating GIFs from programmatically
generated frames, with automatic optimization for Slack's requirements.
"""

from pathlib import Path
from typing import Optional

import imageio.v3 as imageio
import numpy as np
from PIL import Image


class GIFBuilder:
    """Builder for creating optimized GIFs from frames."""

    def __init__(self, width: int = 480, height: int = 480, fps: int = 15):
        """
        Initialize GIF builder.

        Args:
            width: Frame width in pixels
            height: Frame height in pixels
            fps: Frames per second
        """
        self.width = width
        self.height = height
        self.fps = fps
        self.frames: list[np.ndarray] = []

    def add_frame(self, frame: np.ndarray | Image.Image):
        """
        Add a frame to the GIF.

        Args:
            frame: Frame as numpy array or PIL Image (will be converted to RGB)
        """
        if isinstance(frame, Image.Image):
            frame = np.array(frame.convert("RGB"))

        # Ensure frame is correct size
        if frame.shape[:2] != (self.height, self.width):
            pil_frame = Image.fromarray(frame)
            pil_frame = pil_frame.resize(
                (self.width, self.height), Image.Resampling.LANCZOS
            )
            frame = np.array(pil_frame)

        self.frames.append(frame)

    def add_frames(self, frames: list[np.ndarray | Image.Image]):
        """Add multiple frames at once."""
        for frame in frames:
            self.add_frame(frame)

    def optimize_colors(
        self, num_colors: int = 128, use_global_palette: bool = True
    ) -> list[np.ndarray]:
        """
        Reduce colors in all frames using quantization.

        Args:
            num_colors: Target number of colors (8-256)
            use_global_palette: Use a single palette for all frames (better compression)

        Returns:
            List of color-optimized frames
        """
        optimized = []

        if use_global_palette and len(self.frames) > 1:
            # Create a global palette from all frames
            # Sample frames to build palette
            sample_size = min(5, len(self.frames))
            sample_indices = [
                int(i * len(self.frames) / sample_size) for i in range(sample_size)
            ]
            sample_frames = [self.frames[i] for i in sample_indices]

            # Combine sample frames into a single image for palette generation
            # Flatten each frame to get all pixels, then stack them
            all_pixels = np.vstack(
                [f.reshape(-1, 3) for f in sample_frames]
            )  # (total_pixels, 3)

            # Create a properly-shaped RGB image from the pixel data
            # We'll make a roughly square image from all the pixels
            total_pixels = len(all_pixels)
            width = min(512, int(np.sqrt(total_pixels)))  # Reasonable width, max 512
            height = (total_pixels + width - 1) // width  # Ceiling division

            # Pad if necessary to fill the rectangle
            pixels_needed = width * height
            if pixels_needed > total_pixels:
                padding = np.zeros((pixels_needed - total_pixels, 3), dtype=np.uint8)
                all_pixels = np.vstack([all_pixels, padding])

            # Reshape to proper RGB image format (H, W, 3)
            img_array = (
                all_pixels[:pixels_needed].reshape(height, width, 3).astype(np.uint8)
            )
            combined_img = Image.fromarray(img_array, mode="RGB")

            # Generate global palette
            global_palette = combined_img.quantize(colors=num_colors, method=2)

            # Apply global palette to all frames
            for frame in self.frames:
                pil_frame = Image.fromarray(frame)
                quantized = pil_frame.quantize(palette=global_palette, dither=1)
                optimized.append(np.array(quantized.convert("RGB")))
        else:
            # Use per-frame quantization
            for frame in self.frames:
                pil_frame = Image.fromarray(frame)
                quantized = pil_frame.quantize(colors=num_colors, method=2, dither=1)
                optimized.append(np.array(quantized.convert("RGB")))

        return optimized

    def deduplicate_frames(self, threshold: float = 0.9995) -> int:
        """
        Remove duplicate or near-duplicate consecutive frames.

        Args:
            threshold: Similarity threshold (0.0-1.0). Higher = more strict (0.9995 = nearly identical).
                      Use 0.9995+ to preserve subtle animations, 0.98 for aggressive removal.

        Returns:
            Number of frames removed
        """
        if len(self.frames) < 2:
            return 0

        deduplicated = [self.frames[0]]
        removed_count = 0

        for i in range(1, len(self.frames)):
            # Compare with previous frame
            prev_frame = np.array(deduplicated[-1], dtype=np.float32)
            curr_frame = np.array(self.frames[i], dtype=np.float32)

            # Calculate similarity (normalized)
            diff = np.abs(prev_frame - curr_frame)
            similarity = 1.0 - (np.mean(diff) / 255.0)

            # Keep frame if sufficiently different
            # High threshold (0.9995+) means only remove nearly identical frames
            if similarity < threshold:
                deduplicated.append(self.frames[i])
            else:
                removed_count += 1

        self.frames = deduplicated
        return removed_count

    def save(
        self,
        output_path: str | Path,
        num_colors: int = 128,
        optimize_for_emoji: bool = False,
        remove_duplicates: bool = False,
    ) -> dict:
        """
        Save frames as optimized GIF for Slack.

        Args:
            output_path: Where to save the GIF
            num_colors: Number of colors to use (fewer = smaller file)
            optimize_for_emoji: If True, optimize for emoji size (128x128, fewer colors)
            remove_duplicates: If True, remove duplicate consecutive frames (opt-in)

        Returns:
            Dictionary with file info (path, size, dimensions, frame_count)
        """
        if not self.frames:
            raise ValueError("No frames to save. Add frames with add_frame() first.")

        output_path = Path(output_path)

        # Remove duplicate frames to reduce file size
        if remove_duplicates:
            removed = self.deduplicate_frames(threshold=0.9995)
            if removed > 0:
                print(
                    f"  Removed {removed} nearly identical frames (preserved subtle animations)"
                )

        # Optimize for emoji if requested
        if optimize_for_emoji:
            if self.width > 128 or self.height > 128:
                print(
                    f"  Resizing from {self.width}x{self.height} to 128x128 for emoji"
                )
                self.width = 128
                self.height = 128
                # Resize all frames
                resized_frames = []
                for frame in self.frames:
                    pil_frame = Image.fromarray(frame)
                    pil_frame = pil_frame.resize((128, 128), Image.Resampling.LANCZOS)
                    resized_frames.append(np.array(pil_frame))
                self.frames = resized_frames
            num_colors = min(num_colors, 48)  # More aggressive color limit for emoji

            # More aggressive FPS reduction for emoji
            if len(self.frames) > 12:
                print(
                    f"  Reducing frames from {len(self.frames)} to ~12 for emoji size"
                )
                # Keep every nth frame to get close to 12 frames
                keep_every = max(1, len(self.frames) // 12)
                self.frames = [
                    self.frames[i] for i in range(0, len(self.frames), keep_every)
                ]

        # Optimize colors with global palette
        optimized_frames = self.optimize_colors(num_colors, use_global_palette=True)

        # Calculate frame duration in milliseconds
        frame_duration = 1000 / self.fps

        # Save GIF
        imageio.imwrite(
            output_path,
            optimized_frames,
            duration=frame_duration,
            loop=0,  # Infinite loop
        )

        # Get file info
        file_size_kb = output_path.stat().st_size / 1024
        file_size_mb = file_size_kb / 1024

        info = {
            "path": str(output_path),
            "size_kb": file_size_kb,
            "size_mb": file_size_mb,
            "dimensions": f"{self.width}x{self.height}",
            "frame_count": len(optimized_frames),
            "fps": self.fps,
            "duration_seconds": len(optimized_frames) / self.fps,
            "colors": num_colors,
        }

        # Print info
        print(f"\n✓ GIF created successfully!")
        print(f"  Path: {output_path}")
        print(f"  Size: {file_size_kb:.1f} KB ({file_size_mb:.2f} MB)")
        print(f"  Dimensions: {self.width}x{self.height}")
        print(f"  Frames: {len(optimized_frames)} @ {self.fps} fps")
        print(f"  Duration: {info['duration_seconds']:.1f}s")
        print(f"  Colors: {num_colors}")

        # Size info
        if optimize_for_emoji:
            print(f"  Optimized for emoji (128x128, reduced colors)")
        if file_size_mb > 1.0:
            print(f"\n  Note: Large file size ({file_size_kb:.1f} KB)")
            print("  Consider: fewer frames, smaller dimensions, or fewer colors")

        return info

    def clear(self):
        """Clear all frames (useful for creating multiple GIFs)."""
        self.frames = []

```

## File: core/validators.py

```py
#!/usr/bin/env python3
"""
Validators - Check if GIFs meet Slack's requirements.

These validators help ensure your GIFs meet Slack's size and dimension constraints.
"""

from pathlib import Path


def validate_gif(
    gif_path: str | Path, is_emoji: bool = True, verbose: bool = True
) -> tuple[bool, dict]:
    """
    Validate GIF for Slack (dimensions, size, frame count).

    Args:
        gif_path: Path to GIF file
        is_emoji: True for emoji (128x128 recommended), False for message GIF
        verbose: Print validation details

    Returns:
        Tuple of (passes: bool, results: dict with all details)
    """
    from PIL import Image

    gif_path = Path(gif_path)

    if not gif_path.exists():
        return False, {"error": f"File not found: {gif_path}"}

    # Get file size
    size_bytes = gif_path.stat().st_size
    size_kb = size_bytes / 1024
    size_mb = size_kb / 1024

    # Get dimensions and frame info
    try:
        with Image.open(gif_path) as img:
            width, height = img.size

            # Count frames
            frame_count = 0
            try:
                while True:
                    img.seek(frame_count)
                    frame_count += 1
            except EOFError:
                pass

            # Get duration
            try:
                duration_ms = img.info.get("duration", 100)
                total_duration = (duration_ms * frame_count) / 1000
                fps = frame_count / total_duration if total_duration > 0 else 0
            except:
                total_duration = None
                fps = None

    except Exception as e:
        return False, {"error": f"Failed to read GIF: {e}"}

    # Validate dimensions
    if is_emoji:
        optimal = width == height == 128
        acceptable = width == height and 64 <= width <= 128
        dim_pass = acceptable
    else:
        aspect_ratio = (
            max(width, height) / min(width, height)
            if min(width, height) > 0
            else float("inf")
        )
        dim_pass = aspect_ratio <= 2.0 and 320 <= min(width, height) <= 640

    results = {
        "file": str(gif_path),
        "passes": dim_pass,
        "width": width,
        "height": height,
        "size_kb": size_kb,
        "size_mb": size_mb,
        "frame_count": frame_count,
        "duration_seconds": total_duration,
        "fps": fps,
        "is_emoji": is_emoji,
        "optimal": optimal if is_emoji else None,
    }

    # Print if verbose
    if verbose:
        print(f"\nValidating {gif_path.name}:")
        print(
            f"  Dimensions: {width}x{height}"
            + (
                f" ({'optimal' if optimal else 'acceptable'})"
                if is_emoji and acceptable
                else ""
            )
        )
        print(
            f"  Size: {size_kb:.1f} KB"
            + (f" ({size_mb:.2f} MB)" if size_mb >= 1.0 else "")
        )
        print(
            f"  Frames: {frame_count}"
            + (f" @ {fps:.1f} fps ({total_duration:.1f}s)" if fps else "")
        )

        if not dim_pass:
            print(
                f"  Note: {'Emoji should be 128x128' if is_emoji else 'Unusual dimensions for Slack'}"
            )

        if size_mb > 5.0:
            print(f"  Note: Large file size - consider fewer frames/colors")

    return dim_pass, results


def is_slack_ready(
    gif_path: str | Path, is_emoji: bool = True, verbose: bool = True
) -> bool:
    """
    Quick check if GIF is ready for Slack.

    Args:
        gif_path: Path to GIF file
        is_emoji: True for emoji GIF, False for message GIF
        verbose: Print feedback

    Returns:
        True if dimensions are acceptable
    """
    passes, _ = validate_gif(gif_path, is_emoji, verbose)
    return passes

```

## File: requirements.txt

```txt
pillow>=10.0.0
imageio>=2.31.0
imageio-ffmpeg>=0.4.9
numpy>=1.24.0
```
