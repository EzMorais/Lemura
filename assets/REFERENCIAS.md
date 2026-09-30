# Procedência e tratamento das fotografias

O site publica uma seleção de **29 fotografias** do acervo da Galeria Lemura. As fontes são os arquivos `IMG_XXXX.JPG` da pasta `awd`; os originais e o ZIP permanecem preservados. A seleção, a descrição e os caminhos públicos estão registrados em `assets/catalogo/selecao-publicada.json`.

## Tratamento reproduzível

Execute `python scripts/preparar-fotos.py "C:\\Users\\morai\\OneDrive\\Desktop\\awd"`. O processo lê os originais sem gravá-los, aplica ajustes globais discretos de exposição/sombras/contraste e nitidez após redimensionar, sem alteração de cor, recorte, reconstrução ou ampliação. As decisões por fotografia ficam no manifesto do script. As saídas substituem cópias publicadas sob os mesmos caminhos públicos existentes.

Para cada imagem selecionada, o processo gera versões responsivas de até 480, 960 e 1600 px no lado maior; a imagem integral do visualizador tem até 1920 px. Retratos mantêm orientação e proporção. `assets/catalogo/dimensoes-publicadas.json` registra dimensões e nomes gerados. `assets/catalogo/selecao-antes-depois.jpg` reúne comparações do original com o tratamento.

## Seleção por uso

| Uso | Originais |
| --- | --- |
| Abertura | IMG_7357 |
| Ambientes iniciais | IMG_7271, 7293, 7296, 7259, 7264, 7366 |
| Ambientes ao expandir | IMG_7268, 7242, 7348, 7361 |
| Localização | IMG_7363, 7361 |
| Salas A, B e C | IMG_7292, 7299; 7295, 7300; 7288, 7287 |
| Doces de Elisa | IMG_7339, 7341 |
| Yandê | IMG_7285, 7179, 7205, 7217 |
| Espaço ZOE | IMG_7236, 7230, 7232 |
| Elias & Krepski | IMG_7165, 7158 |

Imagens são associadas apenas ao ambiente ou negócio identificado. Não foram usadas fotos de prateleiras para representar café, sala mobiliada para representar disponibilidade, ou mesas de circulação para afirmar coworking. Produtos sem foto correspondente permanecem no estado existente sem imagem. As demais fotografias do acervo ficam fora do site público.
