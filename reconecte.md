As sessões de áudio do Gemini Live não são persistentes no aplicativo móvel como as conversas de texto salvas. Cada interação por voz é uma sessão individual que não retém o contexto de conversas anteriores. No entanto, desenvolvedores que usam a API Gemini Live têm métodos para estender a duração da sessão e retomar conversas. 
No aplicativo Gemini (para usuários finais)
Limitações: No aplicativo móvel, o histórico da conversa em áudio é exibido como texto ao término da sessão. O contexto não é mantido para futuras sessões por voz. Para continuar uma conversa, seria necessário fazer referência a informações anteriores ou fornecer o contexto novamente. 

Usando a API Live (para desenvolvedores)
Existem ferramentas para criar sessões mais duradouras, se você estiver desenvolvendo um aplicativo com a API Gemini Live:
Retomada de sessão: O campo sessionResumption pode ser usado para evitar o encerramento da sessão quando a conexão é perdida (aproximadamente a cada 10 minutos). O servidor enviará um SessionResumptionUpdate com um token que pode ser usado para retomar a sessão mais tarde. Os tokens de retomada são válidos por até duas horas.
Compressão da janela de contexto: A compressão da janela de contexto pode ser ativada para estender a duração das sessões de áudio, que geralmente são limitadas a 15 minutos. Isso ajuda a prolongar a conversa e impede que a conexão seja encerrada repentinamente.

Cache explícito: O cache explícito pode ser usado por desenvolvedores para tokens de entrada. Isso permite que parte do contexto (como informações sobre o usuário ou tópico) seja armazenado para reutilização em sessões futuras. Isso reduz custos com solicitações repetidas. 

To add session persistence to your GenAILiveClient code, implement session resumption using the sessionResumptionUpdate and goAway features of the Gemini Live API. 
Here is a step-by-step guide to make the necessary changes:
1. Save the session handler (sessionResumptionUpdate)
The server sends a new handler (newHandle) whenever there is a resumption update. Store this handler to use when reconnecting.
Add a new field to your GenAILiveClient class:
private latestSessionHandle: string | null = null;
Modify the onMessage method to capture and store the handler:
Add logic to save the handler inside your onMessage method:
protected onMessage(message: LiveServerMessage) {
    if (message.sessionResumptionUpdate?.newHandle) {
      this.latestSessionHandle = message.sessionResumptionUpdate.newHandle; // <--- Add this line
      this.emitter.emit(
        'sessionResumptionUpdate',
        message.sessionResumptionUpdate.newHandle,
      );
      return;
    }

    // ... rest of the method
}
2. Reconnect with the session handler
When the connection is interrupted, start a new connection, passing the saved latestSessionHandle. This instructs the server to resume the previous session.
Modify the connect method to use the session handler:
In your connect method, check for a saved handler and use it in the configuration along with sessionResumption.
import {
  // ... other imports
  SessionResumptionConfig, // <--- Add this import
} from '@google/genai';

// ... inside your GenAILiveClient class

public async connect(config: LiveConnectConfig, previousSessionHandle?: string | null): Promise<boolean> { // <--- Add the parameter
    if (this._status === 'connected' || this._status === 'connecting') {
      return false;
    }

    this._status = 'connecting';
    const callbacks: LiveCallbacks = {
      onopen: this.onOpen.bind(this),
      onmessage: this.onMessage.bind(this),
      onerror: this.onError.bind(this),
      onclose: this.onClose.bind(this),
    };

    // <--- Add the session resumption configuration here
    let sessionResumptionConfig: SessionResumptionConfig | undefined = undefined;
    if (previousSessionHandle || this.latestSessionHandle) {
      sessionResumptionConfig = {
        handle: previousSessionHandle || this.latestSessionHandle,
      };
    }

    try {
      this.session = await this.client.live.connect({
        model: this.model,
        config: {
          ...config,
          sessionResumption: sessionResumptionConfig, // <--- Add the configuration here
        },
        callbacks,
      });
    } catch (e: any) {
      // ... rest of the method
    }

    this._status = 'connected';
    return true;
}
3. Manage graceful shutdown (goAway)
The API sends a goAway event before closing the connection, giving time to reconnect. Use this to start the resumption process.
Modify the onMessage method to handle goAway:
protected onMessage(message: LiveServerMessage) {
    // ... Logic for sessionResumptionUpdate

    if (message.goAway?.timeLeft) {
      this.log('server.goAway', `Connection will close in ${message.goAway.timeLeft}s`);
      this.emitter.emit('goAway', message.goAway.timeLeft);
      this.disconnect(); // Disconnect to prepare for reconnection
      setTimeout(() => {
        this.connect({}); // Try to reconnect after a short delay
      }, 1000); // Example of waiting 1s to reconnect
      return;
    }

    // ... rest of the method
}
Example of persistence workflow
Initial connection: Call client.connect({}) to start a new session.
During the session: The client receives sessionResumptionUpdate messages and stores the newHandle in this.latestSessionHandle.
Connection termination:
The client receives a goAway event with timeLeft.
The onMessage method disconnects the session and schedules a reconnection using this.latestSessionHandle.
If the connection drops abruptly, onClose is called. You can add reconnection logic there too.
Reconnection: The new call to client.connect({}) uses the saved latestSessionHandle to resume the session.

