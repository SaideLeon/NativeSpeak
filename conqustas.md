 Aqui estão os esquemas curl e os resultados dos endpoints de achievements que testei, em formato
  markdown.

  Nota: Para estes testes, um usuário temporário testuser2 foi criado e um token de acesso foi gerado para
  autenticar os pedidos.

  1. Listar Conquistas (GET)

  Este teste verifica a listagem de todas as conquistas para o usuário.
.
   * Endpoint: GET /api/achievements/
   * Comando `curl`:

   1     curl -X GET -H "Authorization: Bearer <ACCESS_TOKEN>"
     https://nativespeak.cognick.qzz.io/api/achievements/
   * Resultado (inicial):
   1     {"count":0,"next":null,"previous":null,"results":[]}

  2. Criar uma Conquista (POST)

  Este teste cria uma nova conquista.

   * Endpoint: POST /api/achievements/
   * Comando `curl`:

   1     curl -X POST -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json"
     -d '{"name": "First Achievement", "description": "This is the first achievement."}'
     https://nativespeak.cognick.qzz.io/api/achievements/
   * Resultado:

   1     {"id":1,"name":"First Achievement","description":"This is the first achievement.",
     "unlocked_at":"2025-10-09T09:59:11.131061+02:00","user":20}

  3. Obter uma Conquista Específica (GET)

  Este teste obtém os detalhes de uma única conquista pelo seu id.

   * Endpoint: GET /api/achievements/1/
   * Comando `curl`:

   1     curl -X GET -H "Authorization: Bearer <ACCESS_TOKEN>"
     https://nativespeak.cognick.qzz.io/api/achievements/1/
   * Resultado:

   1     {"id":1,"name":"First Achievement","description":"This is the first achievement.",
     "unlocked_at":"2025-10-09T09:59:11.131061+02:00","user":20}

  4. Atualizar uma Conquista (PUT)

  Este teste atualiza o nome e a descrição de uma conquista existente.

   * Endpoint: PUT /api/achievements/1/
   * Comando `curl`:

   1     curl -X PUT -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" -d
     '{"name": "Updated Achievement", "description": "This is the updated achievement."}'
     https://nativespeak.cognick.qzz.io/api/achievements/1/
   * Resultado:

   1     {"id":1,"name":"Updated Achievement","description":"This is the updated achievement.",
     "unlocked_at":"2025-10-09T09:59:11.131061+02:00","user":20}

  5. Apagar uma Conquista (DELETE)

  Este teste apaga uma conquista.

   * Endpoint: DELETE /api/achievements/1/
   * Comando `curl`:
   1     curl -X DELETE -H "Authorization: Bearer <ACCESS_TOKEN>"
     https://nativespeak.cognick.qzz.io/api/achievements/1/
   * Resultado: A resposta não tem conteúdo (código 204), o que indica que a operação foi bem-sucedida.

  Conclusão dos Testes

  Todos os endpoints do CRUD para achievements (GET, POST, PUT, DELETE) estão a funcionar como esperado.

  Notei também que a API permite a criação de múltiplas conquistas com o mesmo nome, uma vez que não existe
  uma restrição de unicidade no campo name do modelo Achievement.