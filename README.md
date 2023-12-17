# Variação Ativo Exam

O projeto foi gerado na versão 17.0.5 do Angular Framework.<br/>
Antes de rodar o servidor de desenvolvimento, baixar as dependencias do projeto.<br/>
Certifique-se de estar usando a versão 18.18.0 do Nodejs.<br/>
Rode o seguinte comando para garantir a equivalência do lock json file ao baixar as libs: `npm ci`

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

+ Para uma demonstração mockada visite aqui o: <a href="https://perolanegra.github.io/asset-variation-exam/">GH-Pages!<a> <br>
+ <strong>A implementação da Demo mockada se encontra na branch: <kbd>*feature/gh-pages-live*</kbd></strong>

## Build

Para rodar o build execute o seguinte comando `npm run build` e depois navegue para dentro da pasta <br/> `dist/asset-variation-exam` para checar os artefatos gerados.

## Testes Unitários

Para rodar os teste unitários execute o seguinte comando no terminal `npm run test`, apesar de não ter implementado nenhum teste específico.
