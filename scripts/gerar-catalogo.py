#!/usr/bin/env python3
"""Gera miniaturas e o catálogo visual interativo de todas as 184 fotos originais da Galeria Lemura."""

import io
import json
import os
import sys
import zipfile
from PIL import Image, ImageOps

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEM_PADRAO = r"D:\dowload\wetransfer_img_7151-jpg_2026-08-21_1937.zip"
THUMBS_DIR = os.path.join(RAIZ, "assets", "catalogo", "thumbs")
CATALOGO_HTML = os.path.join(RAIZ, "catalogo-fotos.html")

# Conhecimento atual de identificação das fotos da sessão de 16/12/2025
MAPA_CONHECIDO = {
    # Institucional / Fachada / Ambientes
    "IMG_7367": {"categoria": "fachada", "titulo": "Fachada frontal", "detalhe": "Letreiro Lemura e entrada de vidro (dia)"},
    "IMG_7365": {"categoria": "fachada", "titulo": "Letreiro contra-plongée", "detalhe": "Ângulo inferior do letreiro metálico"},
    "IMG_7357": {"categoria": "fachada", "titulo": "Fachada diagonal", "detalhe": "Entrada principal com escadaria de acesso"},
    "IMG_7363": {"categoria": "fachada", "titulo": "Fachada perspectiva", "detalhe": "Ângulo em perspectiva vertical"},
    "IMG_7361": {"categoria": "fachada", "titulo": "Acesso pela escada", "detalhe": "Escada externa e entrada da galeria"},
    "IMG_7271": {"categoria": "ambientes", "titulo": "Varanda", "detalhe": "Varanda da galeria"},
    "IMG_7366": {"categoria": "ambientes", "titulo": "Marca na arquitetura", "detalhe": "Detalhe da identificação Lemura"},
    "IMG_7296": {"categoria": "ambientes", "titulo": "Corredor térreo", "detalhe": "Corredor principal com vitrines de vidro"},
    "IMG_7268": {"categoria": "ambientes", "titulo": "Circulação", "detalhe": "Área de circulação interna"},
    "IMG_7242": {"categoria": "ambientes", "titulo": "Banheiro comum", "detalhe": "Banheiro de uso comum"},
    "IMG_7293": {"categoria": "ambientes", "titulo": "Área comum térreo", "detalhe": "Mesas altas e circulação do térreo"},
    "IMG_7294": {"categoria": "ambientes", "titulo": "Entrada e escada", "detalhe": "Hall de entrada e acesso ao piso superior"},
    "IMG_7303": {"categoria": "ambientes", "titulo": "Cowork / Corredor", "detalhe": "Mesas de trabalho e convivência compartilhada"},
    "IMG_7259": {"categoria": "ambientes", "titulo": "Convivência", "detalhe": "Mesas de madeira e acabamento"},
    "IMG_7264": {"categoria": "ambientes", "titulo": "Arquitetura", "detalhe": "Detalhes arquitetônicos da galeria"},
    "IMG_7269": {"categoria": "ambientes", "titulo": "Varanda piso superior", "detalhe": "Toldo azul, guarda-corpo e vista verde"},
    "IMG_7270": {"categoria": "ambientes", "titulo": "Varanda piso superior (aberta)", "detalhe": "Espaço aberto da varanda no piso superior"},
    "IMG_7315": {"categoria": "ambientes", "titulo": "Banheiro comum", "detalhe": "Instalações sanitárias de apoio"},
    "IMG_7348": {"categoria": "ambientes", "titulo": "Placas do hall (geral)", "detalhe": "Painel com identificação das salas"},
    "IMG_7349": {"categoria": "ambientes", "titulo": "Placas do hall (detalhe)", "detalhe": "Identificação dos negócios instalados"},
    "IMG_7350": {"categoria": "ambientes", "titulo": "Placas do hall (inferior)", "detalhe": "Painel de salas"},
    "IMG_7351": {"categoria": "ambientes", "titulo": "Placas do hall (superior)", "detalhe": "Painel de salas"},

    # Doces de Elisa (Sala 01)
    "IMG_7336": {"categoria": "lojistas", "lojista": "doces-de-elisa", "titulo": "Doces de Elisa - Fachada/Vitrine", "detalhe": "Vitrine para a rua e calçada"},
    "IMG_7339": {"categoria": "lojistas", "lojista": "doces-de-elisa", "titulo": "Doces de Elisa - Interior", "detalhe": "Interior do estabelecimento"},
    "IMG_7341": {"categoria": "lojistas", "lojista": "doces-de-elisa", "titulo": "Doces de Elisa - Vitrine", "detalhe": "Vitrine de produtos"},
    "IMG_7343": {"categoria": "lojistas", "lojista": "doces-de-elisa", "titulo": "Doces de Elisa - Café", "detalhe": "Xícara de café e acompanhamentos"},
    "IMG_7346": {"categoria": "lojistas", "lojista": "doces-de-elisa", "titulo": "Doces de Elisa - Doces finos", "detalhe": "Doces individuais e sobremesas"},

    # Yandê Saúde & Bem Estar (Salas 5 a 8)
    "IMG_7286": {"categoria": "lojistas", "lojista": "yande", "titulo": "Yandê - Recepção / Box Modelo", "detalhe": "Sala montada para atendimento e recepção"},
    "IMG_7285": {"categoria": "lojistas", "lojista": "yande", "titulo": "Yandê - Recepção", "detalhe": "Recepção do espaço"},
    "IMG_7179": {"categoria": "lojistas", "lojista": "yande", "titulo": "Yandê - Massoterapia (Sala 8)", "detalhe": "Maca de massagem, toalhas e ambiente relaxante"},
    "IMG_7205": {"categoria": "lojistas", "lojista": "yande", "titulo": "Yandê - Fisioterapia (Sala 6)", "detalhe": "Sala de atendimento individual de fisioterapia"},
    "IMG_7217": {"categoria": "lojistas", "lojista": "yande", "titulo": "Yandê - Sala de atendimento", "detalhe": "Ambiente interno de atendimento"},

    # Espaço ZOE (Sala 9)
    "IMG_7236": {"categoria": "lojistas", "lojista": "espaco-zoe", "titulo": "Espaço ZOE - Entrada/Capa", "detalhe": "Ateliê coletivo de artes e projetos sociais"},
    "IMG_7232": {"categoria": "lojistas", "lojista": "espaco-zoe", "titulo": "Espaço ZOE - Materiais", "detalhe": "Pincéis, tintas e organizadores de arte"},
    "IMG_7230": {"categoria": "lojistas", "lojista": "espaco-zoe", "titulo": "Espaço ZOE - Bancada", "detalhe": "Mesa de oficina com trabalhos artesanais"},

    # Elias & Krepski Advogados
    "IMG_7158": {"categoria": "lojistas", "lojista": "elias-krepski", "titulo": "Elias & Krepski - Entrada", "detalhe": "Porta do escritório jurídico"},
    "IMG_7165": {"categoria": "lojistas", "lojista": "elias-krepski", "titulo": "Elias & Krepski - Sala de Reunião", "detalhe": "Mesa e ambiente corporativo"},

    # Salas Vagas (Espaços A, B e C)
    "IMG_7292": {"categoria": "salas", "sala": "vaga-a", "titulo": "Espaço A - Fachada no Corredor", "detalhe": "Térreo, vitrine voltada para o fluxo principal"},
    "IMG_7299": {"categoria": "salas", "sala": "vaga-a", "titulo": "Espaço A - Interior", "detalhe": "Piso, paredes claras e iluminação"},
    "IMG_7295": {"categoria": "salas", "sala": "vaga-b", "titulo": "Espaço B - Fachada no Corredor", "detalhe": "Térreo, ao lado da área de mesas"},
    "IMG_7300": {"categoria": "salas", "sala": "vaga-b", "titulo": "Espaço B - Interior", "detalhe": "Vista interna com vitrine frontal"},
    "IMG_7288": {"categoria": "salas", "sala": "vaga-c", "titulo": "Espaço C - Interior", "detalhe": "Piso superior, sala privativa"},
    "IMG_7287": {"categoria": "salas", "sala": "vaga-c", "titulo": "Espaço C - Banheiro Privativo", "detalhe": "Banheiro interno exclusivo da sala C"},

    # Consultório Odontológico (Aguardando confirmação)
    "IMG_7309": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Jaleco e área clínica"},
    "IMG_7310": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Equipamentos odontológicos"},
    "IMG_7311": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Negatoscópio e moldes"},
    "IMG_7312": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Instrumentais clínicos"},
    "IMG_7318": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Mesa de trabalho clínico"},
    "IMG_7319": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Cadeira e iluminação clínica"},
    "IMG_7320": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Detalhes de materiais"},
    "IMG_7321": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Prateleiras e organizadores"},
    "IMG_7322": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Mesa clínica"},
    "IMG_7323": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Mesa clínica"},
    "IMG_7324": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Mesa clínica"},
    "IMG_7325": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Mesa clínica"},
    "IMG_7326": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Mesa clínica"},
    "IMG_7327": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Mesa clínica"},
    "IMG_7328": {"categoria": "odonto", "titulo": "Consultório Odontológico", "detalhe": "Mesa clínica"},
}

def inferir_categoria(nome, info):
    if info:
        return info.get("categoria", "outros")
    num = int(nome.replace("IMG_", ""))
    if 7151 <= num <= 7176:
        return "escritorio_servicos"
    elif 7177 <= num <= 7228:
        return "saude_yande"
    elif 7229 <= num <= 7244:
        return "zoe_artes"
    elif 7245 <= num <= 7275:
        return "arquitetura_varanda"
    elif 7276 <= num <= 7305:
        return "salas_corredores"
    elif 7306 <= num <= 7330:
        return "clinica_odonto"
    elif 7331 <= num <= 7352:
        return "doces_elisa_placas"
    elif 7353 <= num <= 7368:
        return "fachada_externa"
    return "geral"

def main():
    origem = sys.argv[1] if len(sys.argv) > 1 else ORIGEM_PADRAO
    if not os.path.exists(origem):
        sys.exit(f"Arquivo zip de origem não encontrado: {origem}")

    os.makedirs(THUMBS_DIR, exist_ok=True)
    lista_fotos = []
    selecao_path = os.path.join(RAIZ, "assets", "catalogo", "selecao-publicada.json")
    with open(selecao_path, encoding="utf-8") as fp:
        selecionadas = {item["chave"] for item in json.load(fp)}

    print(f"Lendo fotos de: {origem}")
    with zipfile.ZipFile(origem) as zf:
        nomes = [n for n in sorted(zf.namelist()) if n.upper().endswith((".JPG", ".JPEG"))]
        total = len(nomes)
        print(f"Encontradas {total} fotos no arquivo.")

        for i, nome_arq in enumerate(nomes, 1):
            chave = os.path.splitext(os.path.basename(nome_arq))[0]
            thumb_path = os.path.join(THUMBS_DIR, f"{chave}.jpg")
            thumb_rel = f"assets/catalogo/thumbs/{chave}.jpg"

            dados = zf.read(nome_arq)
            im_orig = Image.open(io.BytesIO(dados))
            largura_orig, altura_orig = im_orig.size

            # Gerar miniatura caso ainda não exista
            if not os.path.exists(thumb_path):
                im = ImageOps.exif_transpose(im_orig).convert("RGB")
                # Reduzir mantendo proporção para max 480px
                im.thumbnail((480, 480), Image.LANCZOS)
                im.save(thumb_path, "JPEG", quality=80, optimize=True)

            info = MAPA_CONHECIDO.get(chave, {})
            cat = inferir_categoria(chave, info)

            lista_fotos.append({
                "chave": chave,
                "arquivo": nome_arq,
                "dimensao": f"{largura_orig}x{altura_orig}",
                "thumb": thumb_rel,
                "categoria": cat,
                "titulo": info.get("titulo", f"Foto {chave}"),
                "detalhe": info.get("detalhe", "Foto da sessão oficial de 16/12/2025"),
                "conhecido": bool(info),
                "selecionada": chave in selecionadas,
                "lojista": info.get("lojista", ""),
                "sala": info.get("sala", ""),
            })

            if i % 30 == 0 or i == total:
                print(f"Processadas {i}/{total} fotos...")

    # Salvar JSON de metadados
    json_path = os.path.join(RAIZ, "assets", "catalogo", "fotos.json")
    with open(json_path, "w", encoding="utf-8") as fp:
        json.dump(lista_fotos, fp, indent=2, ensure_ascii=False)

    # Gerar página HTML do Catálogo Interativo
    html_content = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Catálogo Completo das 184 Fotos | Galeria Lemura</title>
<link rel="stylesheet" href="css/styles.css">
<style>
  :root {{
    --cor-fundo: #0c0d0e;
    --cor-card: #151719;
    --cor-borda: #25282c;
    --cor-texto: #e2e4e8;
    --cor-mutado: #8b929a;
    --cor-destaque: #e3a953;
    --cor-accent: #2e6648;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: var(--cor-fundo);
    color: var(--cor-texto);
    font-family: 'Figtree', system-ui, sans-serif;
    padding: 1.5rem;
    line-height: 1.5;
  }}
  header {{
    max-width: 1400px;
    margin: 0 auto 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--cor-borda);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
  }}
  h1 {{ font-size: 1.75rem; font-weight: 800; color: #fff; }}
  .kicker {{ font-family: 'Space+Mono', monospace; color: var(--cor-destaque); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }}
  .filtros {{
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }}
  .btn-filtro {{
    background: var(--cor-card);
    border: 1px solid var(--cor-borda);
    color: var(--cor-texto);
    padding: 0.4rem 0.85rem;
    border-radius: 9999px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }}
  .btn-filtro:hover, .btn-filtro.ativo {{
    background: var(--cor-destaque);
    color: #000;
    border-color: var(--cor-destaque);
  }}
  .grade {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
    max-width: 1400px;
    margin: 0 auto;
  }}
  .card {{
    background: var(--cor-card);
    border: 1px solid var(--cor-borda);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, border-color 0.2s;
  }}
  .card:hover {{
    transform: translateY(-3px);
    border-color: var(--cor-destaque);
  }}
  .card__img {{
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    background: #000;
    cursor: pointer;
  }}
  .card__corpo {{
    padding: 0.85rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }}
  .card__cabeca {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
  }}
  .card__chave {{
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    color: var(--cor-destaque);
    font-size: 0.85rem;
  }}
  .card__badge {{
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    background: #25282c;
    color: #fff;
  }}
  .card__badge--ok {{ background: var(--cor-accent); }}
  .card__titulo {{ font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }}
  .card__detalhe {{ font-size: 0.8rem; color: var(--cor-mutado); line-height: 1.4; flex-grow: 1; }}
  .card__dim {{ font-size: 0.7rem; font-family: 'Space Mono', monospace; color: #626a74; margin-top: 0.5rem; }}

  /* Modal de zoom */
  .modal {{
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    z-index: 9999;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }}
  .modal.aberto {{ display: flex; }}
  .modal__conteudo {{
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }}
  .modal__img {{
    max-width: 100%;
    max-height: 80vh;
    border-radius: 8px;
    object-fit: contain;
  }}
  .modal__info {{
    margin-top: 1rem;
    text-align: center;
    color: #fff;
  }}
  .modal__fechar {{
    position: absolute;
    top: 1.5rem;
    right: 2rem;
    color: #fff;
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
  }}
</style>
</head>
<body>

<header>
  <div>
    <p class="kicker">Galeria Lemura • Acervo Fotográfico Oficial</p>
    <h1>Catálogo das 184 Fotos Reais</h1>
    <p style="color: var(--cor-mutado); font-size: 0.9rem; margin-top: 0.25rem;">
      Sessão de fotos de 16/12/2025. Arquivo: <code>{os.path.basename(origem)}</code>
    </p>
  </div>
  <div>
    <span style="font-family: 'Space Mono', monospace; color: var(--cor-destaque); font-size: 1.1rem; font-weight: 700;">
      {total} fotos indexadas
    </span>
  </div>
</header>

<div class="filtros" id="filtros">
  <button class="btn-filtro ativo" data-filtro="todos">Todas ({total})</button>
  <button class="btn-filtro" data-filtro="fachada">Fachada & Acessos</button>
  <button class="btn-filtro" data-filtro="ambientes">Áreas Comuns & Varanda</button>
  <button class="btn-filtro" data-filtro="salas">Salas Vagas (A, B, C)</button>
  <button class="btn-filtro" data-filtro="lojistas">Lojistas Reais</button>
  <button class="btn-filtro" data-filtro="odonto">Consultório Odonto</button>
  <button class="btn-filtro" data-filtro="conhecido">Já Mapeadas</button>
</div>

<div class="grade" id="grade">
"""

    for f in lista_fotos:
        badge_cls = "card__badge card__badge--ok" if f["selecionada"] else "card__badge"
        badge_txt = "PUBLICADA" if f["selecionada"] else ("MAPEADA" if f["conhecido"] else "ACERVO")
        html_content += f"""
  <div class="card" data-cat="{f['categoria']}" data-conhecido="{str(f['conhecido']).lower()}">
    <img src="{f['thumb']}" class="card__img" alt="{f['titulo']}" loading="lazy" onclick="abrirModal('{f['thumb']}', '{f['chave']}', '{f['titulo']}', '{f['detalhe']}')">
    <div class="card__corpo">
      <div class="card__cabeca">
        <span class="card__chave">{f['chave']}</span>
        <span class="{badge_cls}">{badge_txt}</span>
      </div>
      <h3 class="card__titulo">{f['titulo']}</h3>
      <p class="card__detalhe">{f['detalhe']}</p>
      <span class="card__dim">{f['dimensao']} px • {f['categoria']}</span>
    </div>
  </div>
"""

    html_content += """
</div>

<div class="modal" id="modal" onclick="fecharModal()">
  <button class="modal__fechar" onclick="fecharModal()">×</button>
  <div class="modal__conteudo" onclick="event.stopPropagation()">
    <img src="" id="modalImg" class="modal__img" alt="Visualização">
    <div class="modal__info">
      <h2 id="modalTitulo" style="font-size: 1.25rem;"></h2>
      <p id="modalDetalhe" style="color: var(--cor-mutado); font-size: 0.95rem; margin-top: 0.3rem;"></p>
      <p id="modalChave" style="font-family: 'Space Mono', monospace; color: var(--cor-destaque); font-size: 0.85rem; margin-top: 0.3rem;"></p>
    </div>
  </div>
</div>

<script>
  const filtros = document.querySelectorAll('.btn-filtro');
  const cards = document.querySelectorAll('.card');

  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      const f = btn.dataset.filtro;

      cards.forEach(card => {
        if (f === 'todos') {
          card.style.display = 'flex';
        } else if (f === 'conhecido') {
          card.style.display = card.dataset.conhecido === 'true' ? 'flex' : 'none';
        } else if (card.dataset.cat.includes(f)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  function abrirModal(src, chave, titulo, detalhe) {
    document.getElementById('modalImg').src = src;
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalDetalhe').textContent = detalhe;
    document.getElementById('modalChave').textContent = chave;
    document.getElementById('modal').classList.add('aberto');
  }

  function fecharModal() {
    document.getElementById('modal').classList.remove('aberto');
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModal();
  });
</script>
</body>
</html>
"""

    with open(CATALOGO_HTML, "w", encoding="utf-8") as fp:
        fp.write(html_content)

    print(f"\nCatálogo HTML gerado com sucesso em: {CATALOGO_HTML}")
    print(f"Miniaturas geradas em: {THUMBS_DIR}")

if __name__ == "__main__":
    main()
