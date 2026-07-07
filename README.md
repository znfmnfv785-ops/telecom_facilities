# Sistema Unificado de Ferramentas de Rede

Este projeto é um **Sistema Unificado de Ferramentas de Rede** para técnicos de telecomunicações. Ele foi evoluído de um arquivo HTML único para uma aplicação web modular com suporte a **PWA (Progressive Web App)** e persistência em nuvem via **Firebase (Authentication e Firestore)**.

---

## 🚀 Funcionalidades

1. **Carimbo de Rede Externa**: Geração de texto padronizado com cálculo automático de distâncias e exportação em PDF.
2. **Conversor de Imagem**: Conversão de imagens BMP para PNG, JPEG ou WebP diretamente no navegador.
3. **Calculadora Avançada de Enlace Óptico**: Cálculo de viabilidade com base na potência do laser (Tx), sensibilidade do receptor (Rx), atenuação por km, conectores, emendas e margem de segurança.
4. **Tabela Padrão Ábaco**: Tabela de referência rápida com filtro de busca em tempo real.
5. **Separador de NSAP**: Utilitário para quebrar strings hexadecimais NSAP (formato Q3 da tela "NE Settings") em seus respectivos blocos.
6. **Gestão de Clientes e Equipamentos**: CRM completo para controle de chamados, clientes, histórico e equipamentos. Os dados são sincronizados no **Firebase Firestore** e o acesso é protegido por login de e-mail e senha.

---

## 📂 Estrutura do Projeto

```
AUTO_FACILITIES/
├── index.html          # Interface principal limpa e estruturada
├── styles.css          # Estilos globais (suporta temas claro e escuro)
├── manifest.json       # Configuração do PWA (instalável no Android/iOS)
├── sw.js               # Service Worker para caching e uso offline das ferramentas locais
├── README.md           # Este manual de instruções
├── icons/              # Ícones do PWA
│   ├── icon-192.png
│   └── icon-512.png
└── js/                 # JavaScript Modularizado
    ├── app.js               # Inicializador do app, temas, abas e Service Worker
    ├── carimbo.js           # Lógica do Carimbo e Conversor de imagens
    ├── calculadora.js       # Lógica de cálculo de Enlace Óptico
    ├── abaco.js             # Lógica de busca na tabela Ábaco
    ├── nsap.js              # Lógica de processamento de NSAP
    ├── gestao.js            # CRM integrado com Firebase Auth & Firestore
    └── firebase-config.js   # Arquivo de configuração de credenciais do Firebase
```

---

## 🔥 Configurando o Firebase

Para colocar o banco de dados online e ativar a autenticação do CRM, você precisará configurar um projeto Firebase:

### 1. Criar Projeto no Firebase
1. Vá até o [Firebase Console](https://console.firebase.google.com/).
2. Clique em **Adicionar Projeto** e dê um nome (ex: `Ferramentas de Rede`).
3. Opcional: Ative ou desative o Google Analytics e conclua a criação.

### 2. Ativar Autenticação (Authentication)
1. No menu lateral, acesse **Build > Authentication** (Construir > Autenticação).
2. Clique em **Começar** (Get Started).
3. Na aba **Método de login**, selecione **E-mail/senha**, ative a opção e salve.
4. Vá para a aba **Users** (Usuários) e clique em **Adicionar usuário** para cadastrar o e-mail e senha de acesso dos técnicos.

### 3. Ativar Banco de Dados (Firestore Database)
1. No menu lateral, acesse **Build > Cloud Firestore**.
2. Clique em **Criar banco de dados**.
3. Selecione a localização do servidor (ex: `southamerica-east1` para o Brasil) e avance.
4. Escolha **Iniciar no modo de teste** (para desenvolvimento rápido) ou **modo de produção**.
5. *Nota:* Se iniciar em modo de produção, configure as regras de segurança no Firestore para permitir leitura e escrita a usuários autenticados:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /clientes/{document} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### 4. Obter as credenciais
1. No painel geral do projeto (Project Overview), clique no ícone de engrenagem (**Configurações do Projeto**).
2. Na parte inferior, na seção "Seus aplicativos", selecione a plataforma Web (ícone `</>`).
3. Dê um nome para o app e clique em Registrar.
4. Copie o objeto `firebaseConfig` gerado, que se parece com isso:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "seu-projeto.firebaseapp.com",
     projectId: "seu-projeto",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "123456789...",
     appId: "1:1234..."
   };
   ```
5. Abra o arquivo `js/firebase-config.js` no seu editor e substitua as strings placeholder (`REPLACE_WITH_YOUR_...`) com os dados reais do seu projeto.

---

## 💻 Executando Localmente

Para testar a aplicação localmente com os módulos ES6 ativos, você precisa rodá-la através de um servidor local (a abertura direta do arquivo `index.html` com duplo clique bloqueará a importação de módulos devido a políticas de CORS do navegador).

Você pode usar qualquer uma destas opções simples:

*   **Usando o VS Code**: Instale a extensão **Live Server**, abra a pasta do projeto, clique com o botão direito em `index.html` e selecione *Open with Live Server*.
*   **Usando Node.js (Vite/Live-Server)**:
    ```bash
    # Via npx (sem instalar nada permanentemente)
    npx live-server
    ```

---

## ☁️ Como Fazer Deploy Gratuito

### ⚡ Deploy na Vercel
1. Instale a CLI da Vercel (`npm i -g vercel`) ou crie uma conta em [vercel.com](https://vercel.com).
2. Se estiver usando a CLI, abra o terminal na pasta do projeto e execute:
   ```bash
   vercel
   ```
3. Siga os passos na tela. A aplicação será publicada em poucos segundos.

### ⚡ Deploy no Netlify
1. Crie uma conta em [netlify.com](https://netlify.com).
2. Você pode arrastar e soltar a pasta do projeto diretamente na interface web do Netlify (seção *Sites > Add new site > Deploy manually*).
3. Ou conecte seu repositório GitHub para deploys automáticos em cada commit.

---

## 📱 Instalação no Celular (PWA)

### No iOS (Safari)
1. Abra o Safari no iPhone e acesse a URL da aplicação publicada.
2. Toque no botão de **Compartilhar** (ícone com quadrado e seta para cima).
3. Selecione a opção **Adicionar à Tela de Início**.
4. Toque em Adicionar no canto superior direito. O aplicativo aparecerá na sua tela inicial como um app nativo!

### No Android (Chrome)
1. Abra o Chrome no celular e acesse a URL.
2. Um banner perguntando "Adicionar Ferramentas Rede à tela inicial" aparecerá.
3. Se não aparecer, clique nos três pontos no canto superior direito e selecione **Instalar aplicativo** ou **Adicionar à tela de início**.
