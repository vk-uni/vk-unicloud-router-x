"""Generate the login icon font from the adjacent SVG sources.

Requires fonttools: python -m pip install fonttools
Run from any directory: python scripts/auth-icons/generate.py
"""

from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import SVGPath
from fontTools.ttLib import TTFont


SOURCE_DIR = Path(__file__).resolve().parent
OUTPUT = SOURCE_DIR.parents[1] / "pages/login/static/fonts/vk-auth-icons-v2.ttf"
ICONS = {
    0xE001: "brand",
    0xE002: "back",
    0xE003: "eye",
    0xE004: "eye-off",
    0xE005: "wechat",
    0xE006: "circle",
    0xE007: "check-circle",
}


def build():
    glyphs = {".notdef": TTGlyphPen(None).glyph()}
    for name in ICONS.values():
        pen = TTGlyphPen(None)
        quadratic_pen = Cu2QuPen(pen, max_err=0.5, reverse_direction=True)
        svg_pen = TransformPen(quadratic_pen, (1000 / 24, 0, 0, -1000 / 24, 0, 900))
        SVGPath(str(SOURCE_DIR / f"{name}.svg")).draw(svg_pen)
        glyphs[name] = pen.glyph()

    font = FontBuilder(1000, isTTF=True)
    font.setupGlyphOrder(list(glyphs))
    font.setupCharacterMap(ICONS)
    font.setupGlyf(glyphs)
    # Match the SVG's left margin: FreeType positions the outline at the LSB,
    # so a zero LSB would pull every nonempty icon toward the left edge.
    font.setupHorizontalMetrics({
        name: (1000, glyph.xMin if glyph.numberOfContours > 0 else 0)
        for name, glyph in glyphs.items()
    })
    font.setupHorizontalHeader(ascent=900, descent=-100)
    font.setupNameTable({
        "familyName": "VkAuthIconsV2",
        "styleName": "Regular",
        "uniqueFontIdentifier": "VkAuthIconsV2-Regular-2.0",
        "fullName": "VkAuthIconsV2 Regular",
        "psName": "VkAuthIconsV2-Regular",
        "version": "Version 2.000",
        "copyright": "Copyright VK. Original login interface icons.",
    })
    font.setupOS2(sTypoAscender=900, sTypoDescender=-100, sTypoLineGap=0,
                 usWinAscent=900, usWinDescent=100)
    font.setupPost()
    font.setupMaxp()
    # Fixed timestamps keep regeneration deterministic.
    font.font["head"].created = 3786912000
    font.font["head"].modified = 3786912000
    font.font.recalcTimestamp = False
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    font.save(str(OUTPUT))

    generated = TTFont(str(OUTPUT))
    assert generated.getBestCmap() == ICONS
    assert generated["hmtx"][".notdef"] == (1000, 0)
    back_glyph = generated["glyf"]["back"]
    assert back_glyph.xMin + back_glyph.xMax == 1000, "back: outline must be centered in its advance box"
    for name in ICONS.values():
        glyph = generated["glyf"][name]
        advance, left_bearing = generated["hmtx"][name]
        assert glyph.numberOfContours > 0, name
        assert glyph.xMin >= 0 and glyph.xMax <= 1000, name
        assert glyph.yMin >= -100 and glyph.yMax <= 900, name
        assert advance == 1000, f"{name}: icon advance must preserve the SVG viewBox"
        assert left_bearing == glyph.xMin, f"{name}: left bearing shifts the SVG outline"
        right_bearing = advance - left_bearing - (glyph.xMax - glyph.xMin)
        assert right_bearing == 1000 - glyph.xMax, f"{name}: right margin differs from SVG"
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes, {len(ICONS)} icons)")


if __name__ == "__main__":
    build()
