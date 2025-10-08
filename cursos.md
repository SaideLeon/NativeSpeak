✦ O usuário pediu os dados do endpoint de cursos. Confirmei em courses/api_urls.py que /api/units/ retorna 
  uma lista de unidades. A documentação e a saída do curl confirmam os campos: id, number, title, 
  description, icon, order e theme_count. Vou apresentar essa informação agora.O curl que executei 
  anteriormente (curl -X GET https://nativespeak.cognick.qzz.io/api/units/) retornou os seguintes dados:

    1 {
    2   "count": 1,
    3   "next": null,
    4   "previous": null,
    5   "results": [
    6     {
    7       "id": 1,
    8       "number": 3,
    9       "title": "Daily Life",
   10       "description": "Learn to talk about your everyday routines and activities",
   11       "icon": "📚",
   12       "order": 3,
   13       "theme_count": 2
   14     }
   15   ]
   16 }

 O endpoint /api/units/ retorna uma lista de cursos (chamados de "units" na API). Para cada curso, os 
  seguintes campos são retornados:

   * id: O identificador único do curso.
   * number: O número do curso.
   * title: O título do curso.
   * description: Uma breve descrição do curso.
   * icon: Um ícone para representar o curso.
   * order: A ordem em que o curso deve ser exibido.
   * theme_count: O número de temas dentro do curso.