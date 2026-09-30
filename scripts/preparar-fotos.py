#!/usr/bin/env python3
"""Prepara as fotos selecionadas da Galeria Lemura para o site.

Uso: python scripts/preparar-fotos.py [pasta-dos-originais]
Requer Pillow. Os arquivos de origem nunca são alterados.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SOURCE = Path.home() / "OneDrive" / "Desktop" / "awd"
SIZES = (480, 960, 1600)
VIEWER_MAX = 1920
QUALITY = 80

# Cada original corresponde a uma foto real já revisada. Destinos antigos são
# mantidos para preservar URLs públicas; outros usos compartilham o mesmo JPG.
PHOTOS = {
    "IMG_7357": ("fachada", "Fachada diagonal", "Letreiro, entrada e número do imóvel", 0.00,
                 ["assets/galeria-fachada.jpg", "assets/og-image.jpg", "assets/galeria/fachada-diagonal.jpg"]),
    "IMG_7271": ("ambientes", "Varanda", "Varanda do piso superior e vista", 0.02,
                 ["assets/galeria/varanda-vista.jpg"]),
    "IMG_7293": ("ambientes", "Área comum", "Mesas e área de convivência no térreo", 0.02,
                 ["assets/galeria-area-comum.jpg"]),
    "IMG_7296": ("ambientes", "Corredor térreo", "Circulação e vitrines de vidro", 0.10,
                 ["assets/galeria-corredor.jpg", "assets/galeria/corredor-terreo.jpg"]),
    "IMG_7259": ("ambientes", "Área de convivência", "Mesas e circulação no piso superior", 0.03,
                 ["assets/galeria/convivencia.jpg"]),
    "IMG_7264": ("ambientes", "Fachada e arquitetura", "Perspectiva vertical da fachada", 0.03,
                 ["assets/galeria/arquitetura.jpg"]),
    "IMG_7366": ("ambientes", "Detalhe do letreiro", "Letreiro Lemura em detalhe", 0.00,
                 ["assets/galeria/fachada-angulo.jpg"]),
    "IMG_7268": ("ambientes", "Circulação interna", "Vista do corredor e das vitrines", 0.04,
                 ["assets/galeria-cowork.jpg"]),
    "IMG_7242": ("ambientes", "Banheiro", "Banheiro de uso comum", 0.02,
                 ["assets/galeria/banheiro-comum.jpg"]),
    "IMG_7348": ("ambientes", "Painel do hall", "Placas de identificação das salas", 0.04,
                 ["assets/galeria/painel-hall.jpg"]),
    "IMG_7361": ("ambientes", "Entrada e escada", "Acesso interno ao piso superior", 0.02,
                 ["assets/galeria/entrada-escada.jpg", "assets/galeria-entrada.jpg"]),
    "IMG_7363": ("fachada", "Fachada em perspectiva", "Fachada da galeria vista de baixo", 0.00,
                 ["assets/galeria/fachada-perspectiva.jpg"]),
    "IMG_7292": ("salas", "Espaço A", "Sala disponível com vitrine para o corredor", 0.04,
                 ["assets/salas/vaga-a/principal.jpg"]),
    "IMG_7299": ("salas", "Espaço A", "Vista interna do Espaço A", 0.04,
                 ["assets/salas/vaga-a/interior.jpg"]),
    "IMG_7295": ("salas", "Espaço B", "Sala disponível junto à área de convivência", 0.04,
                 ["assets/salas/vaga-b/principal.jpg"]),
    "IMG_7300": ("salas", "Espaço B", "Vista interna do Espaço B", 0.04,
                 ["assets/salas/vaga-b/interior.jpg"]),
    "IMG_7288": ("salas", "Espaço C", "Sala disponível no piso superior", 0.04,
                 ["assets/salas/vaga-c/principal.jpg"]),
    "IMG_7287": ("salas", "Espaço C", "Banheiro privativo do Espaço C", 0.02,
                 ["assets/salas/vaga-c/banheiro.jpg"]),
    "IMG_7339": ("lojistas", "Doces de Elisa", "Ambiente interno da confeitaria", 0.02,
                 ["assets/lojas/doces-de-elisa/capa.jpg"]),
    "IMG_7341": ("lojistas", "Doces de Elisa", "Vitrine refrigerada com doces e sobremesas", 0.02,
                 ["assets/lojas/doces-de-elisa/vitrine.jpg"]),
    "IMG_7285": ("lojistas", "Yandê Saúde & Bem Estar", "Recepção da clínica", 0.02,
                 ["assets/lojas/yande/capa.jpg"]),
    "IMG_7179": ("lojistas", "Yandê Saúde & Bem Estar", "Maca preparada para atendimento", 0.02,
                 ["assets/lojas/yande/massoterapia.jpg"]),
    "IMG_7205": ("lojistas", "Yandê Saúde & Bem Estar", "Sala de atendimento individual", 0.02,
                 ["assets/lojas/yande/atendimento.jpg"]),
    "IMG_7217": ("lojistas", "Yandê Saúde & Bem Estar", "Espaço interno de atendimento", 0.02,
                 ["assets/lojas/yande/grupo.jpg"]),
    "IMG_7236": ("lojistas", "Espaço ZOE", "Ateliê e espaço de atividades", 0.02,
                 ["assets/lojas/espaco-zoe/capa.jpg"]),
    "IMG_7230": ("lojistas", "Espaço ZOE", "Mesa preparada para uma oficina", 0.02,
                 ["assets/lojas/espaco-zoe/oficina.jpg"]),
    "IMG_7232": ("lojistas", "Espaço ZOE", "Materiais organizados no ateliê", 0.02,
                 ["assets/lojas/espaco-zoe/materiais.jpg"]),
    "IMG_7158": ("lojistas", "Elias & Krepski Advogados", "Entrada do escritório", 0.03,
                 ["assets/lojas/elias-krepski/capa.jpg"]),
    "IMG_7165": ("lojistas", "Elias & Krepski Advogados", "Sala de reunião", 0.02,
                 ["assets/lojas/elias-krepski/reuniao.jpg"]),
}


def sized(image: Image.Image, max_edge: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return result


def sized_width(image: Image.Image, width: int) -> Image.Image:
    result = image.copy()
    target_height = round(image.height * min(1.0, width / image.width))
    if result.size != (min(image.width, width), target_height):
        result = result.resize((min(image.width, width), target_height), Image.Resampling.LANCZOS)
    return result


def enhance(image: Image.Image, exposure_ev: float) -> Image.Image:
    """Apply modest exposure; preserve color balance and bright highlights."""
    if exposure_ev:
        factor = 2**exposure_ev
        histogram = image.convert("RGB").convert("L").histogram()
        bright_fraction = sum(histogram[246:]) / max(1, image.width * image.height)
        if exposure_ev > 0 and bright_fraction > 0.06:
            factor = min(factor, 1.02)
        image = ImageEnhance.Brightness(image).enhance(factor)
    # A shallow shadow lift improves detail in passages without whitening walls.
    shadow_lut = [round(value + 0.025 * 255 * ((255 - value) / 255) ** 2) for value in range(256)]
    image = image.point(shadow_lut * 3)
    image = ImageEnhance.Contrast(image).enhance(1.025)
    return image


def save_jpeg(image: Image.Image, path: Path, quality: int = QUALITY) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=1)


def variant_path(canonical: str, suffix: str) -> str:
    path = Path(canonical)
    return (path.parent / f"{path.stem}-{suffix}.jpg").as_posix()


def published_dimensions(width: int, height: int) -> tuple[int, int]:
    scale = min(1.0, 1600 / width)
    return round(width * scale), round(height * scale)


def build_comparison(source_dir: Path, prepared: dict[str, Path]) -> Path:
    columns, card_w, card_h = 3, 500, 310
    rows = (len(PHOTOS) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * card_w, rows * card_h), "#f4f1ec")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arial.ttf", 24)
        small = ImageFont.truetype("arial.ttf", 17)
    except OSError:
        font = small = ImageFont.load_default()

    for index, (photo_id, entry) in enumerate(PHOTOS.items()):
        x, y = (index % columns) * card_w, (index // columns) * card_h
        original = ImageOps.exif_transpose(Image.open(source_dir / f"{photo_id}.JPG")).convert("RGB")
        after = Image.open(prepared[photo_id]).convert("RGB")
        draw.text((x + 10, y + 5), f"{photo_id} — {entry[1]}", fill="#1d2430", font=font)
        for col, (label, image) in enumerate((("Original", original), ("Tratada", after))):
            preview = sized(image, 238)
            px = x + 6 + col * 246 + (238 - preview.width) // 2
            py = y + 42 + (238 - preview.height) // 2
            sheet.paste(preview, (px, py))
            draw.text((x + 12 + col * 246, y + 282), label, fill="#2e3f5b", font=small)
        original.close()
        after.close()

    output = ROOT / "assets/catalogo/selecao-antes-depois.jpg"
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, "JPEG", quality=88, optimize=True, progressive=True)
    sheet.close()
    return output


def main() -> int:
    source_dir = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else DEFAULT_SOURCE
    if not source_dir.is_dir():
        print(f"Pasta de originais não encontrada: {source_dir}", file=sys.stderr)
        return 2

    prepared: dict[str, Path] = {}
    dimensions: dict[str, list[int]] = {}
    for photo_id, entry in PHOTOS.items():
        category, title, detail, exposure_ev, destinations = entry
        source_path = source_dir / f"{photo_id}.JPG"
        if not source_path.is_file():
            print(f"Foto selecionada não encontrada: {source_path}", file=sys.stderr)
            return 2

        with Image.open(source_path) as original_file:
            base = ImageOps.exif_transpose(original_file).convert("RGB")
        dimensions[photo_id] = [base.width, base.height]
        base = enhance(base, exposure_ev)
        # Sem recorte, deformação, limpeza, colorização ou ampliação do original.
        for destination in destinations:
            destination_path = ROOT / destination
            canonical = sized_width(base, 1600)
            canonical = ImageEnhance.Sharpness(canonical).enhance(1.14)
            save_jpeg(canonical, destination_path)
            prepared.setdefault(photo_id, destination_path)

            for size in SIZES[:2]:
                variant = sized_width(base, size)
                variant = ImageEnhance.Sharpness(variant).enhance(1.14)
                save_jpeg(variant, ROOT / variant_path(destination, str(size)))
                variant.close()

            viewer = sized(base, VIEWER_MAX)
            viewer = ImageEnhance.Sharpness(viewer).enhance(1.14)
            save_jpeg(viewer, ROOT / variant_path(destination, "visualizador"), quality=72)
            print(f"{photo_id}: {title} — {canonical.width}x{canonical.height}; exposição {exposure_ev:+.2f} EV")
            canonical.close()
            viewer.close()
        base.close()

    catalog = []
    asset_dimensions: dict[str, str] = {}
    for photo_id, (category, title, detail, exposure_ev, destinations) in PHOTOS.items():
        main_asset = destinations[0]
        published_dim = "{}x{}".format(*published_dimensions(*dimensions[photo_id]))
        asset_dimensions.update({destination: published_dim for destination in destinations})
        catalog.append({
            "chave": photo_id,
            "arquivo": f"{photo_id}.JPG",
            "categoria": category,
            "titulo": title,
            "detalhe": detail,
            "dimensao_original": f"{dimensions[photo_id][0]}x{dimensions[photo_id][1]}",
            "dimensao_publicada": published_dim,
            "originais_preservados": True,
            "tratamento": {"exposicao_ev": exposure_ev, "lift_sombras": 0.025, "contraste": 1.025, "nitidez": 1.14, "recorte": False},
            "publicada": main_asset,
            "destinos": destinations,
            "responsivas": [variant_path(main_asset, str(size)) for size in (480, 960)],
            "visualizador": variant_path(main_asset, "visualizador"),
        })
    catalog_path = ROOT / "assets/catalogo/selecao-publicada.json"
    catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ROOT / "assets/catalogo/dimensoes-publicadas.json").write_text(
        json.dumps(asset_dimensions, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    comparison = build_comparison(source_dir, prepared)
    print(f"\n{len(PHOTOS)} fotos preparadas. Comparação: {comparison.relative_to(ROOT)}")
    print("Os arquivos de origem não foram alterados.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
