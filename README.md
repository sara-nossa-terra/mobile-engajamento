# mobile-engajamento

@todo melhorar doc.

Aplicação mobile do sistema Engajamento.

# ENGAJAMENTO

[![GitHub Issues Abertas](https://img.shields.io/github/issues/sara-nossa-terra/mobile-engajamento)]()
[![MIT License](https://img.shields.io/github/license/sara-nossa-terra/mobile-engajamento)]()

Bem vindo/a à documentação do aplicativo mobile do sistema ENGAJAMENTO!

### :nut_and_bolt: Instalação

Para executar o aplicativo do Engajamento, é necessário ter um emulador no seu computador ou o [aplicativo do expo instalado em seu smartphone](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR).

Também é necessário ter o [Node.js](https://nodejs.org/) em sua máquina.

Clone o projeto em sua máquina e instale as dependências do projeto com o `npm` ou `yarn`:

```bash
    $ git clone https://github.com/sara-nossa-terra/mobile-engajamento.git
    $ cd mobile-engajamento && yarn install
```

Feito isso, execute o comando abaixo para rodar projeto em sua máquina:

```bash
    $ yarn start
```

Após alguns instantes a aplicação estará disponível em:

```bash
    localhost:19002
```

Caso esteja usando um smartphone, é necessário possui o aplicativo do EXPO instalado nele e escanear o QRCode que aparecer na página aberta em `localhost:19002`.

### consumir a Api fake do projeto

Para consumir a api Fake do projeto em seu dispositivo, é necessário configurar o redirecionamento da porta na sua máquina para o app do seu smartphone digitando o comando abaixo:

```bash
    $ adb -s <device name> reverse tcp:3000 tcp:3000
```

OBS: o nome do dispositivo pode ser pego utilizando o comando `adb devices` (necessário ter o [adb instalando na sua máquina](https://developer.android.com/studio/command-line/adb?hl=pt-br))

Feito isso, execute o comando abaixo em outra aba no terminal e reinicie sua aplicação:

```bash
    $ yarn server
```

Para consumir a API via wifi, basta mudar o caminho do servidor da api em `src/services/Api.ts`, colocando o IP e a porta que se encontra o servidor fake.

## :rocket: Tecnologias

O aplicativo mobile do sistema Engajamento foi construida com React Native. Abaixo estão listadas as tecnologias utilizadas no aplicativo.

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.io/)
- [React Navigation 5.1](https://reactnavigation.org/)
- [NodeJS >=12](https://nodejs.org/)
- [React Native Paper 4.3.0](https://callstack.github.io/react-native-paper/)
- [Formik](https://formik.org/docs/overview)
- [Yup](https://github.com/jquense/yup)

## :busts_in_silhouette: Autores

Várias pessoas colaboraram com o desenvimento do projeto ENGAJAMENTO e decidimos centralizar em um único local todos os que participaram com o desenvolvimento do projeto.

Clique [aqui](https://github.com/sara-nossa-terra/engajamento/graphs/contributors) para visualizar.
