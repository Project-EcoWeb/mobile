# 📱 EcoWebMobile

Aplicativo mobile desenvolvido com **React Native** e **Expo** para o projeto **EcoWeb**, uma plataforma de reutilização criativa e conexão entre empresas com resíduos recicláveis e usuários interessados.

---

## 🚀 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Router](https://expo.dev/router)
- [EAS Build](https://docs.expo.dev/eas/)
- [Axios](https://axios-http.com/)
- [Async Storage](https://react-native-async-storage.github.io/async-storage/)
- [React Navigation](https://reactnavigation.org/)
- API REST Node.js (comunicação externa)

---

## 📲 Funcionalidades

- Onboarding interativo
- Login e cadastro de usuários
- Diferenciação de tipos de usuários (comum ou empresa)
- Dashboard com projetos de reutilização
- Visualização de detalhes do projeto
- Consulta de materiais recicláveis
- Cadastro de resíduos pelas empresas
- Sistema de favoritos e mensagens (mockado)

---

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js
- Expo CLI
- Git
- Android Studio ou Expo Go (para rodar no celular)

### Clone o repositório

```bash
git clone https://github.com/Project-EcoWeb/mobile.git
cd mobile
```

### Instale as dependências

```bash
npm install
```

### Rode no modo de desenvolvimento

```bash
npx expo start
```

- Escaneie o QR Code com o app **Expo Go**
- Ou aperte `a` para abrir no Android Studio (emulador)

---

## 📦 Build (versão de produção)

O projeto utiliza **EAS Build**. Para gerar o APK:

```bash
eas build --platform android --profile production
```

Para publicar uma atualização OTA (via Expo Go):

```bash
eas update --branch main --message "Atualização"
```

---

## 🔗 Acesso rápido (versão publicada)

- ✅ **APK para Android:** [Download aqui](https://expo.dev/artifacts/eas/hKnuiGxU4jW1753ohKBhm7.apk?authuser=0)  
---

## 👨‍💻 Desenvolvedor

- **Ruan Oliveira de Almeida**  
  [LinkedIn](https://www.linkedin.com/in/ruanoliveiradev) • [GitHub](https://github.com/RuanDEV0)

---
