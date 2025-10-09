Aqui estão os esquemas curl e os resultados dos endpoints de goals que testei, em formato
  markdown.

  Nota: Para estes testes, um usuário temporário testuser2 foi criado e um token de acesso foi gerado para
  autenticar os pedidos. O token de acesso usado foi: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIj
  oiYWNjZXNzIiwiZXhwIjoxNzYwMDAxOTQ3LCJpYXQiOjE3NTk5OTgzNDcsImp0aSI6IjVlZjlmOTdkZTcwYTQyZTE4YmI0N2I1NDMwMzAwN
  ThmIiwidXNlcl9pZCI6IjIxIiwidXNlcm5hbWUiOiJ0ZXN0dXNlcjIifQ.OSlN7oB8YKfoiOSekbAgynTRIIb22BhwP8sCYaSMfew

  1. Listar Metas (GET) - Lista Vazia

  Este teste verifica a listagem de todas as metas para o usuário, que inicialmente deve estar vazia.

   * Endpoint: GET /api/goals/
   * Comando `curl`:
   1     curl -X GET -H "Authorization: Bearer <ACCESS_TOKEN>" https://nativespeak.cognick.qzz.io/api/goals/
   * Resultado:

   1     {"count":0,"next":null,"previous":null,"results":[]}

  2. Criar uma Meta (POST)

  Este teste cria uma nova meta.

   * Endpoint: POST /api/goals/
   * Comando `curl`:

   1     curl -X POST -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json"
     -d '{"text": "Learn Django", "status": "inProgress"}' https://nativespeak.cognick.qzz.io/api/goals/
   * Resultado:

   1     {"id":1,"text":"Learn Django","status":"inProgress","created_at":
     "2025-10-09T10:26:03.689443+02:00"}

  3. Obter uma Meta Específica (GET)

  Este teste obtém os detalhes de uma única meta pelo seu id.

   * Endpoint: GET /api/goals/1/
   * Comando `curl`:

   1     curl -X GET -H "Authorization: Bearer <ACCESS_TOKEN>" https://nativespeak.cognick.qzz.io/api/goals/1/
   * Resultado:

   1     {"id":1,"text":"Learn Django","status":"inProgress","created_at":
     "2025-10-09T10:26:03.689443+02:00"}

  4. Atualizar uma Meta (PUT)

  Este teste atualiza o texto e o status de uma meta existente.

   * Endpoint: PUT /api/goals/1/
   * Comando `curl`:

   1     curl -X PUT -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" -d
     '{"text": "Learn React", "status": "completed"}' https://nativespeak.cognick.qzz.io/api/goals/1/
   * Resultado:

   1     {"id":1,"text":"Learn React","status":"completed","created_at":
     "2025-10-09T10:26:03.689443+02:00"}

  5. Apagar uma Meta (DELETE)

  Este teste apaga uma meta.

   * Endpoint: DELETE /api/goals/1/
   * Comando `curl`:

   1     curl -X DELETE -H "Authorization: Bearer <ACCESS_TOKEN>" https://nativespeak.cognick.qzz.io/api/goals/1/
   * Resultado: A resposta não tem conteúdo (código 204), o que indica que a operação foi bem-sucedida.

  Conclusão dos Testes

  Todos os endpoints do CRUD para goals (GET, POST, PUT, DELETE) estão a funcionar como esperado.