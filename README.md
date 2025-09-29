 # NativeSpeak: Seu Tutor de Inglês com IA 

O NativeSpeak é uma aplicação web de demonstração que utiliza a API Gemini Live para criar um parceiro de conversação com IA, focado em ajudar falantes de português a praticar e melhorar sua fluência em inglês. A aplicação captura áudio do microfone em tempo real, transmite para a IA e reproduz a resposta em áudio, criando uma experiência de diálogo natural.

## ✨ Funcionalidades Principais

- **Conversação em Tempo Real**: Diálogo de áudio bidirecional e de baixa latência com a IA.
- **Tutor de Inglês Personalizado**: O prompt do sistema padrão instrui a IA a atuar como um tutor de inglês paciente e adaptativo.
- **Cenários de Prática**: Escolha entre diferentes cenários de conversação, como "Conversa do Dia a Dia", "Entrevista de Emprego" ou "Viagens e Direções".
- **Configurações Ajustáveis**:
  - **Prompt do Sistema**: Modifique a personalidade e as instruções da IA.
  - **Voz da IA**: Selecione entre diversas vozes para a resposta da IA.
  - **Modelo**: Alterne entre os modelos de IA disponíveis.
- **Ferramentas (Function Calling)**: Adicione, edite e ative/desative "ferramentas" que a IA pode usar, permitindo a integração com funcionalidades externas (nesta demo, as respostas são simuladas).
- **Transcrição ao Vivo**: Veja a transcrição da sua fala e da resposta da IA em tempo real.
- **Exportação de Logs**: Salve o histórico da sessão, incluindo configurações e a conversa, em um arquivo JSON para análise.

## 🏗️ Arquitetura e Estrutura do Projeto

Este é um projeto React construído com TypeScript e Vite. A gestão do estado global é feita com a biblioteca Zustand, proporcionando uma maneira simples e eficiente de compartilhar o estado entre os componentes.

### /components

Contém os componentes React reutilizáveis que formam a interface do usuário.

- `Header.tsx`: O cabeçalho da aplicação, com o título e o botão para abrir as configurações.
- `Sidebar.tsx`: A barra lateral onde o usuário pode configurar o prompt do sistema, o modelo de IA, a voz e gerenciar as ferramentas (function calls).
- `ControlTray.tsx`: A barra de controle principal na parte inferior, com botões para conectar/desconectar, mutar o microfone, reiniciar a conversa e exportar os logs.
- `StreamingConsole.tsx`: A área principal que exibe o diálogo transcrito entre o usuário e a IA.
- `WelcomeScreen.tsx`: A tela inicial que permite ao usuário selecionar um cenário de prática.
- `ToolEditorModal.tsx`: Um modal para criar e editar as definições das ferramentas (function calls).
- `ErrorScreen.tsx`: Exibe mensagens de erro, especialmente útil para notificar sobre o esgotamento da cota da API.

### /contexts

Contextos React para gerenciar o estado e a lógica compartilhada de forma encapsulada.

- `LiveAPIContext.tsx`: Fornece uma interface centralizada para interagir com a API Gemini Live. Ele utiliza o hook `useLiveApi` para gerenciar a conexão, o envio e o recebimento de dados.

### /hooks

Hooks customizados que abstraem lógicas complexas.

- `use-live-api.ts`: O coração da aplicação. Este hook gerencia a instância do `GenAILiveClient`, estabelece a conexão WebSocket, lida com o streaming de áudio (entrada e saída), processa eventos da API (como transcrições, chamadas de função e áudio recebido) e expõe o estado da conexão para os componentes.

### /lib

Contém a lógica principal, utilitários e classes que não são componentes React.

- `state.ts`: Define os "stores" do Zustand para o estado global (`useSettings`, `useUI`, `useTools`, `useLogStore`). É aqui que o estado da aplicação, como as configurações da IA, o histórico da conversa e o estado da UI, é gerenciado.
- `genai-live-client.ts`: Uma classe wrapper em torno do `@google/genai` que simplifica a comunicação com a API Gemini Live, emitindo eventos para diferentes estágios da comunicação (conexão aberta, áudio recebido, erro, etc.).
- `audio-recorder.ts`: Gerencia a captura de áudio do microfone do usuário. Utiliza a Web Audio API e um `AudioWorklet` para processar e converter o áudio para o formato PCM16 antes de enviá-lo para a API.
- `audio-streamer.ts`: Responsável por receber os chunks de áudio PCM16 da API, enfileirá-los e reproduzi-los de forma contínua, garantindo uma reprodução de áudio suave.
- `tools/`: Contém definições pré-configuradas de ferramentas (function calls) para os diferentes cenários de prática.
- `worklets/`: Contém os `AudioWorkletProcessor`s que rodam em uma thread separada para processamento de áudio de alta performance, como a conversão de formato e a medição de volume.

## 🚀 Como Executar o Projeto

1.  **Clone o repositório.**

2.  **Crie um arquivo `.env`** na raiz do projeto e adicione sua chave da API Gemini:
    ```
    GEMINI_API_KEY=SUA_CHAVE_API_AQUI
    ```

3.  **Instale as dependências**:
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

5.  Abra o navegador no endereço fornecido (geralmente `http://nativespeak.vercel.app`).
