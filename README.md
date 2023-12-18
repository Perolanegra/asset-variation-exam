# Variação Ativo Exam

O projeto foi gerado na versão 17.0.5 do Angular Framework.<br/>
Antes de rodar o servidor de desenvolvimento, baixar as dependencias do projeto.<br/>
Certifique-se de estar usando a versão 18.18.0 do Nodejs.<br/>
Rode o seguinte comando para garantir a equivalência do lock json file ao baixar as libs: `npm ci` <br> <br> <hr>

<font size="5">**Ponto de Atenção!**</font>

#### <kbd>*PS: Foi necessário utilizar um endpoint diferente do passado no exame, pois foi verificado que a url passada:*</kbd>
- <code>https://query2.finance.yahoo.com/v8/finance/chart/PETR4.SA</code>  <br>
#### <kbd>*somente traz os timestamps do dia corrente, e não nos últimos 30 dias. <br> Logo, foi utilizada a a seguinte url:*</kbd>
- <code>https://query1.finance.yahoo.com/v7/finance/chart/</code>  <br>
#### <kbd>*com os parâmetros do ativo selecionado, no período de 30 dias*</kbd> <hr>

## Servidor de Desenvolvimento (Angular)

+ Para subir o servidor de desenvolvimento rode o seguinte comando `npm run start` e navegue <br> para `http://localhost:4200/` na url do seu browser.<br>
+ Você irá se deparar inicialmente com um gráfico com dados mockados, e com 5 ativos para consulta. <br>
+ Para interação com o gráfico, selecione algum ativo ao clicar no botão referente ao mesmo e o <br >gráfico será recalculado com os novos valores.<br>
+ Em cada ponto do gráfico é exibido o dia, os preços juntamente com o cálculo das variações de preço.

## Tech Through 

+ Foi criado um server proxy intermediário para realizar as requisições para a api de finanças do yahoo, para sanar problemas como origem
bloqueada de domínio (CORS), entre outros. <br>
+ Foi implementado o arquivo server.js contendo o código necessário para realizar a requisição ao Yahoo server, serializando o objeto de retorno 
para o frontend. <br>
+ Foi utilizado o Material pela facilidade em components lib. <br>
+ O Service simula um "singleton", sem muita separação de camadas por se tratar de algo simples.

## Demo

+ Para uma demonstração mockada visite aqui o: <a href="https://perolanegra.github.io/asset-variation-exam/" target="_blank">GH-Pages!<a> <br>
+ <strong>A implementação da Demo mockada se encontra na branch: <a href="https://github.com/Perolanegra/asset-variation-exam/tree/feature/gh-pages-live"><kbd>*feature/gh-pages-live*</kbd></a></strong>

## Build

Para rodar o build execute o seguinte comando `npm run build` e depois navegue para dentro da pasta <br/> `dist/asset-variation-exam` para checar os artefatos gerados.

## Testes Unitários

Para rodar os teste unitários execute o seguinte comando no terminal `npm run test`, apesar de não ter implementado nenhum teste específico.
