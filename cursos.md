Abaixo estão os comandos curl para os endpoints testados e seus respectivos resultados.

  1. Listar todas as unidades

  Comando:

   1 curl -X GET https://nativespeak.cognick.qzz.io/api/units/

  Resultado:

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

  2. Detalhes de uma unidade

  Comando:
   1 curl -X GET https://nativespeak.cognick.qzz.io/api/units/1/

  Resultado:

    1 {
    2   "id": 1,
    3   "number": 3,
    4   "title": "Daily Life",
    5   "description": "Learn to talk about your everyday routines and activities",
    6   "icon": "📚",
    7   "order": 3,
    8   "themes": [
    9     {
   10       "id": 1,
   11       "title": "Food and Eating Habits",
   12       "icon": "🍽️,
   13       "order": 1,
   14       "topics": [
   15         {
   16           "id": 1,
   17           "title": "Types of Food",
   18           "topic_type": "vocabulary",
   19           "topic_type_display": "Vocabulary",
   20           "icon": "📝",
   21           "description": "",
   22           "order": 1,
   23           "vocabulary_items": [
   24             {
   25               "id": 1,
   26               "word": "Breakfast",
   27               "translation": "Café da manhã",
   28               "pronunciation": "brek-fəst",
   29               "image": null,
   30               "audio": null,
   31               "example_sentence": "I usually have breakfast at 7 AM.",
   32               "order": 1
   33             }
   34           ]
   35         }
   36       ]
   37     }
   38   ]
   39 }
  (O resultado foi truncado para ser mais legível)

  3. Progresso de uma unidade

  Comando:

   1 curl -X GET https://nativespeak.cognick.qzz.io/api/units/1/progress/ -H "Authorization: Bearer <TOKEN>"

  Resultado:

    1 {
    2   "id": 1,
    3   "unit": {
    4     "id": 1,
    5     "number": 3,
    6     "title": "Daily Life",
    7     "description": "Learn to talk about your everyday routines and activities",
    8     "icon": "📚",
    9     "order": 3,
   10     "theme_count": 2
   11   },
   12   "completion_percentage": 100,
   13   "started_at": "2025-10-08T13:21:33.375051+02:00",
   14   "completed_at": "2025-10-08T13:22:34.104932+02:00"
   15 }

  4. Listar todos os temas

  Comando:
   1 curl -X GET https://nativespeak.cognick.qzz.io/api/themes/

  Resultado:

    1 {
    2   "count": 2,
    3   "next": null,
    4   "previous": null,
    5   "results": [
    6     {
    7       "id": 1,
    8       "title": "Food and Eating Habits",
    9       "icon": "🍽️,
   10       "order": 1,
   11       "topics": [],
   12       "topic_count": 3
   13     },
   14     {
   15       "id": 2,
   16       "title": "Daily Routines",
   17       "icon": "⏰",
   18       "order": 2,
   19       "topics": [],
   20       "topic_count": 1
   21     }
   22   ]
   23 }

  5. Detalhes de um tema

  Comando:
   1 curl -X GET https://nativespeak.cognick.qzz.io/api/themes/1/

  Resultado:

    1 {
    2   "id": 1,
    3   "title": "Food and Eating Habits",
    4   "icon": "🍽️,
    5   "order": 1,
    6   "topics": [
    7     {
    8       "id": 1,
    9       "title": "Types of Food",
   10       "topic_type": "vocabulary",
   11       "topic_type_display": "Vocabulary",
   12       "icon": "📝",
   13       "description": "",
   14       "order": 1,
   15       "vocabulary_items": [],
   16       "grammar_contents": [],
   17       "dialogues": [],
   18       "example_boxes": [],
   19       "exercises": []
   20     }
   21   ],
   22   "topic_count": 3
   23 }
  (O resultado foi truncado para ser mais legível)

  6. Listar todos os tópicos

  Comando:

   1 curl -X GET https://nativespeak.cognick.qzz.io/api/topics/

  Resultado:

    1 {
    2   "count": 4,
    3   "next": null,
    4   "previous": null,
    5   "results": [
    6     {
    7       "id": 1,
    8       "title": "Types of Food",
    9       "topic_type": "vocabulary",
   10       "topic_type_display": "Vocabulary",
   11       "icon": "📝",
   12       "description": "",
   13       "order": 1,
   14       "vocabulary_items": [],
   15       "grammar_contents": [],
   16       "dialogues": [],
   17       "example_boxes": [],
   18       "exercises": []
   19     }
   20   ]
   21 }
  (O resultado foi truncado para ser mais legível)

  7. Detalhes de um tópico

  Comando:

   1 curl -X GET https://nativespeak.cognick.qzz.io/api/topics/1/

  Resultado:

    1 {
    2   "id": 1,
    3   "title": "Types of Food",
    4   "topic_type": "vocabulary",
    5   "topic_type_display": "Vocabulary",
    6   "icon": "📝",
    7   "description": "",
    8   "order": 1,
    9   "vocabulary_items": [
   10     {
   11       "id": 1,
   12       "word": "Breakfast",
   13       "translation": "Café da manhã",
   14       "pronunciation": "brek-fəst",
   15       "image": null,
   16       "audio": null,
   17       "example_sentence": "I usually have breakfast at 7 AM.",
   18       "order": 1
   19     }
   20   ],
   21   "grammar_contents": [],
   22   "dialogues": [],
   23   "example_boxes": [],
   24   "exercises": []
   25 }
  (O resultado foi truncado para ser mais legível)

  8. Listar todos os exercícios

  Comando:
   1 curl -X GET http://localhost:8000/api/exercises/

  Resultado:

    1 {
    2   "count": 1,
    3   "next": null,
    4   "previous": null,
    5   "results": [
    6     {
    7       "id": 1,
    8       "title": "Complete the sentences",
    9       "exercise_type": "fill_blank",
   10       "exercise_type_display": "Fill in the Blanks",
   11       "instructions": "Fill in the blanks with the correct form of the verb in parentheses.",
   12       "order": 1,
   13       "points": 30,
   14       "questions": [],
   15       "question_count": 3
   16     }
   17   ]
   18 }

  9. Detalhes de um exercício

  Comando:
   1 curl -X GET http://localhost:8000/api/exercises/1/

  Resultado:

    1 {
    2   "id": 1,
    3   "title": "Complete the sentences",
    4   "exercise_type": "fill_blank",
    5   "exercise_type_display": "Fill in the Blanks",
    6   "instructions": "Fill in the blanks with the correct form of the verb in parentheses.",
    7   "order": 1,
    8   "points": 30,
    9   "questions": [
   10     {
   11       "id": 1,
   12       "question_text": "I _______ (eat) breakfast every morning.",
   13       "hint": "Use the base form for I/You/We/They",
   14       "explanation": "We use 'eat' without -s for I/You/We/They",
   15       "order": 1,
   16       "points": 10,
   17       "answers": [],
   18       "fill_blank_answer": {
   19         "id": 1,
   20         "correct_answer": "eat",
   21         "alternative_answers": "",
   22         "case_sensitive": false
   23       }
   24     }
   25   ],
   26   "question_count": 3
   27 }
  (O resultado foi truncado para ser mais legível)

  10. Submeter respostas de um exercício

  Comando:

   1 curl -X POST https://nativespeak.cognick.qzz.io/api/exercises/1/submit/ -H "Authorization: Bearer <TOKEN>" -H
     "Content-Type: application/json" -d '{"exercise_id": 1, "answers": {"1": "eat", "2": "drinks", 
     "3": "have"}, "time_spent": 120}'

  Resultado:

    1 {
    2   "success": true,
    3   "submission_id": 1,
    4   "score": 30,
    5   "max_score": 30,
    6   "percentage": 100,
    7   "responses": [
    8     {
    9       "question_id": 1,
   10       "is_correct": true,
   11       "points_earned": 10,
   12       "explanation": "We use 'eat' without -s for I/You/We/They",
   13       "correct_answer": "eat"
   14     },
   15     {
   16       "question_id": 2,
   17       "is_correct": true,
   18       "points_earned": 10,
   19       "explanation": "We add -s to the verb for he/she/it: drinks",
   20       "correct_answer": "drinks"
   21     },
   22     {
   23       "question_id": 3,
   24       "is_correct": true,
   25       "points_earned": 10,
   26       "explanation": "We use 'have' without -s for We",
   27       "correct_answer": "have"
   28     }
   29   ]
   30 }

  11. Listar todo o progresso

  Comando:

   1 curl -X GET https://nativespeak.cognick.qzz.io/api/progress/ -H "Authorization: Bearer <TOKEN>"

  Resultado:

    1 {
    2   "count": 1,
    3   "next": null,
    4   "previous": null,
    5   "results": [
    6     {
    7       "id": 1,
    8       "unit": {
    9         "id": 1,
   10         "number": 3,
   11         "title": "Daily Life",
   12         "description": "Learn to talk about your everyday routines and activities",
   13         "icon": "📚",
   14         "order": 3,
   15         "theme_count": 2
   16       },
   17       "completion_percentage": 100,
   18       "started_at": "2025-10-08T13:21:33.375051+02:00",
   19       "completed_at": "2025-10-08T13:22:34.104932+02:00"
   20     }
   21   ]
   22 }

  12. Listar todas as submissões

  Comando:

   1 curl -X GET https://nativespeak.cognick.qzz.io/api/submissions/ -H "Authorization: Bearer <TOKEN>"

  Resultado:

    1 {
    2   "count": 1,
    3   "next": null,
    4   "previous": null,
    5   "results": [
    6     {
    7       "id": 1,
    8       "exercise": {
    9         "id": 1,
   10         "title": "Complete the sentences",
   11         "exercise_type": "fill_blank",
   12         "exercise_type_display": "Fill in the Blanks",
   13         "instructions": "Fill in the blanks with the correct form of the verb in parentheses.",
   14         "order": 1,
   15         "points": 30,
   16         "questions": [],
   17         "question_count": 3
   18       },
   19       "score": 30,
   20       "max_score": 30,
   21       "percentage": 100,
   22       "submitted_at": "2025-10-08T13:22:32.735843+02:00",
   23       "time_spent": 120,
   24       "responses": []
   25     }
   26   ]
   27 }
  (O resultado foi truncado para ser mais legível)

  13. Dashboard do Aluno

  Comando:

   1 curl -X GET https://nativespeak.cognick.qzz.io/api/dashboard/ -H "Authorization: Bearer <TOKEN>"

  Nota: Este endpoint apresentou um erro (AttributeError: 'dict' object has no attribute 'themes') que foi 
  corrigido. O erro ocorria porque o StudentDashboardSerializer estava sendo inicializado com dados já 
  serializados. A correção envolveu passar os objetos do queryset diretamente para o serializador.

  Resultado (após a correção):

    1 {
    2   "total_units": 1,
    3   "completed_units": 1,
    4   "in_progress_units": 0,
    5   "total_exercises": 1,
    6   "avg_score": 30,
    7   "recent_progress": [
    8     {
    9       "id": 1,
   10       "unit": {
   11         "id": 1,
   12         "number": 3,
   13         "title": "Daily Life",
   14         "description": "Learn to talk about your everyday routines and activities",
   15         "icon": "📚",
   16         "order": 3,
   17         "theme_count": 2
   18       },
   19       "completion_percentage": 100,
   20       "started_at": "2025-10-08T13:21:33.375051+02:00",
   21       "completed_at": "2025-10-08T13:22:34.104932+02:00"
   22     }
   23   ],
   24   "recent_submissions": [
   25     {
   26       "id": 1,
   27       "exercise": {
   28         "id": 1,
   29         "title": "Complete the sentences",
   30         "exercise_type": "fill_blank",
   31         "exercise_type_display": "Fill in the Blanks",
   32         "instructions": "Fill in the blanks with the correct form of the verb in parentheses.",
   33         "order": 1,
   34         "points": 30,
   35         "questions": [],
   36         "question_count": 3
   37       },
   38       "score": 30,
   39       "max_score": 30,
   40       "percentage": 100,
   41       "submitted_at": "2025-10-08T13:22:32.735843+02:00",
   42       "time_spent": 120,
   43       "responses": []
   44     }
   45   ],
   46   "exercise_stats": {
   47     "fill_blank": {
   48       "count": 1,
   49       "avg_score": 30
   50     },
   51     "multiple_choice": {
   52       "count": 0,
   53       "avg_score": 0
   54     },
   55     "true_false": {
   56       "count": 0,
   57       "avg_score": 0u
   58     }
   59   }
   60 }