Aplicação mobile do sistema Engajamento. Um sistema que controla as atividades e líderes da Igreja Sara Nossa Terra.

# ENGAJAMENTO

[![GitHub Issues Abertas](https://img.shields.io/github/issues/sara-nossa-terra/mobile-engajamento)]()
[![MIT License](https://img.shields.io/github/license/sara-nossa-terra/mobile-engajamento)]()
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg?cacheSeconds=2592000)]()
[![Language](https://img.shields.io/badge/Language-TypeScript-blue.svg?cacheSeconds=2592000)]()
[![Style Prettier](https://img.shields.io/badge/Stylized-prettier-pink.svg?cacheSeconds=2592000)]()

Bem vindo/a à documentação do aplicativo mobile do sistema ENGAJAMENTO!

### :nut_and_bolt: Instalação

Para executar o aplicativo do Engajamento, é necessário ter um emulador no seu computador ou o [aplicativo do expo instalado em seu smartphone](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR).

Também é necessário ter o [Node.js](https://nodejs.org/) em sua máquina.

Clone o projeto em sua máquina e entre no diretório do projeto:

```bash
    $ git clone https://github.com/sara-nossa-terra/mobile-engajamento.git
    $ cd mobile-engajamento
```

Você pode usar o `yarn` para instalar as dependências dentro da pasta mobile-engajamento:

```bash
    $ yarn install
```

Ou você pode instalar com o `npm`:

```bash
    $ npm install
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

# Conectado a API do Engajamento via Android USB

- Para conectar o aplicativo à [API do Sistema Engajamento](https://github.com/sara-nossa-terra/api-engajamento), você precisa estar com seu dispositivo conectado via USB ao seu computador.

- Também é necessário ter o [Modo desenvolvedor ativado no seu dispositivo](https://tecnoblog.net/277750/como-ativar-o-modo-desenvolvedor-no-android/) para prossseguir.

- Também é necessário ter o [ADB (Android Device Bridge) instalado no seu computador](https://developer.android.com/studio/releases/platform-tools)

Agora, execute o comando abaixo e pega o ID do seu dispositivo

```bash
    $ adb devices
```

Copie o ID do seu dispositivo conectado ao computador e, em seguida, execute o comando:

```bash
    $ adb -s <id_dispositivo> reverse tcp:8080 tcp:8080
```

Lembrando que `tcp:PORTA` é necessário especificiar a porta em que a API esta rodando, certifique-se de ser a mesma que você executar este comando.

Feito isso, a aplicação conectará automaticamente à API do Engajamento.

## :rocket: Tecnologias

O aplicativo mobile do sistema Engajamento foi construida com React Native. Abaixo estão listadas as tecnologias utilizadas no aplicativo.

- [React Native](https://reactnative.dev/)
- [Expo v0.39](https://docs.expo.io/)
- [React Navigation v5.1](https://reactnavigation.org/)
- [NodeJS >=12](https://nodejs.org/)
- [React Native Paper v4.3.0](https://callstack.github.io/react-native-paper/)
- [Formik v2.2](https://formik.org/docs/overview)
- [Yup](https://github.com/jquense/yup)
- [React Native Modal v11](https://github.com/react-native-modal/react-native-modal)

## :busts_in_silhouette: Autores

Várias pessoas colaboraram com o desenvimento do projeto ENGAJAMENTO e decidimos centralizar em um único local todos os que participaram com o desenvolvimento do projeto.

Clique [aqui](https://github.com/sara-nossa-terra/engajamento/graphs/contributors) para visualizar.
