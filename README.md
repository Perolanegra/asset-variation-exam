# Variação Ativo Exam

O projeto foi gerado na versão 17.0.5 do Angular Framework.<br/>
Antes de rodar o servidor de desenvolvimento, baixar as dependencias do projeto.<br/>
Certifique-se de estar usando a versão 18.18.0 do Nodejs.<br/>
Rode o seguinte comando para garantir a equivalência do lock json file ao baixar as libs: `npm ci`

## Servidor de Desenvolvimento (Angular)

+ Para subir o servidor de desenvolvimento rode o seguinte comando `npm run s:dev` e navegue <br> para `http://localhost:4200/` na url do seu browser.<br>
+ Você irá se deparar inicialmente com um gráfico com dados mockados, e com 3 ativos para consulta. <br>
+ Para interação com o gráfico, selecione algum ativo ao clicar no botão referente ao mesmo e o <br >gráfico será recalculado com os novos valores.<br>
+ Em cada ponto do gráfico é exibido o dia, os preços juntamente com o cálculo das variações de preço.

## Tech Through 

+ Essa branch está mockada com valores estáticos para finalidade de deploy no github-pages como uma demo.

## Build & Deploy (GH-Pages)

+ Para rodar o build e realizar o deploy depois de alguma modificação no projeto, primeiro execute o comando `npm run build` <br>
+ O projeto por padrão irá criar os artefatos dentro da pasta dist/browser. Mova todos os arquivos de browser pra raiz da pasta dist/ <br>
+ Após os artefatos movidos, execute o seguinte comando `npm run deploy`, e aguarde o deploy da aplicação aqui no <a href="https://perolanegra.github.io/asset-variation-exam/">Github Pages</a>

## Testes Unitários

Para rodar os teste unitários execute o seguinte comando no terminal `npm run test`, apesar de não ter implementado nenhum teste específico.
