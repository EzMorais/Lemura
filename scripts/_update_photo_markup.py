import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
dimensions = json.loads((root / "assets/catalogo/dimensoes-publicadas.json").read_text(encoding="utf-8"))
for path in list(root.glob("*.html")) + list((root / "lojas").glob("*/index.html")):
    html = path.read_text(encoding="utf-8")
    start = html.find('id="galeria-ambientes"') if path == root / "index.html" else -1
    end = html.find('</div><button class="lm-ambientes__mais"', start) if start >= 0 else -1

    def normalize(match):
        tag = match.group(0)
        found = re.search(r'\bsrc="([^"]+)"', tag)
        if not found or found.group(1) not in dimensions:
            return tag
        src = found.group(1)
        width, height = dimensions[src].split("x")
        stem = src[:-4]
        for attr in ("width", "height", "srcset", "sizes", "data-lightbox-src"):
            tag = re.sub(rf'\s+{attr}="[^"]*"', "", tag)
        additions = (f' srcset="{stem}-480.jpg 480w, {stem}-960.jpg 960w, {src} 1600w"'
                     ' sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"'
                     f' width="{width}" height="{height}"')
        if start >= 0 and start < match.start() < end:
            additions += f' data-lightbox-src="{stem}-visualizador.jpg"'
        pos = tag.find(">")
        return tag[:pos] + additions + tag[pos:]

    html = re.sub(r'<img\b[^>]*>', normalize, html)
    path.write_text(html, encoding="utf-8")
