from django.core.management.base import BaseCommand
from courses.models import Unit, Theme, Topic, VocabularyItem, GrammarContent, GrammarExample, Exercise, Question, FillBlankAnswer, DialogueContent, DialogueLine, ExampleBox

class Command(BaseCommand):
    help = 'Popula o banco com Unit 4: At the City'

    def handle(self, *args, **kwargs):
        # === UNIT 4: At the City ===
        unit = Unit.objects.create(
            number=4,
            title="At the City",
            description="Learn how to describe places, ask for directions, and talk about transportation in the city.",
            icon="🏙️",
            order=4,
            is_active=True
        )

        # === THEME 1: Places in the City ===
        theme1 = Theme.objects.create(
            unit=unit,
            title="Places in the City",
            icon="📍",
            order=1,
            is_active=True
        )

        # Vocabulary Topic
        vocab_topic = Topic.objects.create(
            theme=theme1,
            title="Common City Places",
            topic_type="vocabulary",
            icon="🗺️",
            order=1,
            is_active=True
        )

        city_vocab = [
            ("Bank", "Banco", "I go to the bank on Mondays."),
            ("Hospital", "Hospital", "She works at the hospital."),
            ("Supermarket", "Supermercado", "We buy groceries at the supermarket."),
            ("Post Office", "Correios", "He sent a letter at the post office."),
            ("Bus Station", "Rodoviária", "The bus station is near the park."),
            ("Park", "Parque", "Children play at the park."),
            ("Library", "Biblioteca", "I study at the library."),
            ("Museum", "Museu", "They visited the museum yesterday."),
            ("Restaurant", "Restaurante", "We had lunch at a new restaurant."),
            ("Police Station", "Delegacia", "There’s a police station downtown."),
            ("Mall", "Shopping", "The mall is always crowded on weekends."),
            ("School", "Escola", "The school is next to the bakery."),
            ("Bakery", "Padaria", "I buy bread at the bakery every morning."),
        ]

        for i, (word, translation, example) in enumerate(city_vocab, 1):
            VocabularyItem.objects.create(
                topic=vocab_topic,
                word=word,
                translation=translation,
                example_sentence=example,
                order=i
            )

        ExampleBox.objects.create(
            topic=vocab_topic,
            title="🏙️ Example Sentences",
            content="• I go to the bank on Mondays.\n• Children play at the park.\n• The school is next to the bakery.",
            box_type="example",
            order=1
        )

        # Grammar Topic
        grammar_topic = Topic.objects.create(
            theme=theme1,
            title="There is / There are",
            topic_type="grammar",
            icon="📘",
            description="Use 'There is' for singular and 'There are' for plural to talk about existence.",
            order=2,
            is_active=True
        )

        grammar_content = GrammarContent.objects.create(
            topic=grammar_topic,
            title="Affirmative, Negative and Questions",
            explanation=(
                "✅ There is – usado para singular.\n"
                "✅ There are – usado para plural.\n\n"
                "❌ Negative: There isn’t / There aren’t\n"
                "❓ Question: Is there...? / Are there...?"
            ),
            order=1
        )

        examples = [
            ("Affirmative", "There is a park near my house."),
            ("Affirmative", "There are many restaurants downtown."),
            ("Negative", "There isn’t a hospital in my neighborhood."),
            ("Negative", "There aren’t any buses at night."),
            ("Question", "Is there a bank on this street?"),
            ("Question", "Are there many schools in your city?"),
        ]

        for i, (form, example) in enumerate(examples, 1):
            GrammarExample.objects.create(
                grammar_content=grammar_content,
                subject=form,
                verb_form="-",
                example_sentence=example,
                order=i
            )

        ExampleBox.objects.create(
            topic=grammar_topic,
            title="🧩 Quick Tip",
            content=(
                "💡 Use 'There is' for ONE thing.\n"
                "💡 Use 'There are' for MORE THAN ONE.\n"
                "Example: There is a park. / There are two parks."
            ),
            box_type="tip",
            order=2
        )

        # Exercise: Fill in the Blanks
        exercise = Exercise.objects.create(
            topic=grammar_topic,
            title="Complete with 'There is' or 'There are'",
            exercise_type="fill_blank",
            instructions="Choose the correct form to complete each sentence.",
            order=1,
            points=30
        )

        questions = [
            ("_______ a supermarket near here.", "There is", "Use 'There is' for singular", "Only one supermarket."),
            ("_______ two banks on this street.", "There are", "Use 'There are' for plural", "Two = plural."),
            ("_______ a bus station in this city?", "Is there", "Question form", "Question → 'Is there' for singular."),
            ("_______ many restaurants downtown.", "There are", "Use 'There are' for plural", "Many = plural."),
        ]

        for i, (q, ans, hint, exp) in enumerate(questions, 1):
            question = Question.objects.create(
                exercise=exercise,
                question_text=q,
                hint=hint,
                explanation=exp,
                order=i,
                points=10
            )
            FillBlankAnswer.objects.create(
                question=question,
                correct_answer=ans,
                case_sensitive=False
            )

        # === THEME 2: Transportation and Directions ===
        theme2 = Theme.objects.create(
            unit=unit,
            title="Transportation and Directions",
            icon="🚌",
            order=2,
            is_active=True
        )

        # Vocabulary: Transportation
        transport_topic = Topic.objects.create(
            theme=theme2,
            title="Types of Transportation",
            topic_type="vocabulary",
            icon="🚗",
            order=1,
            is_active=True
        )

        transport_vocab = [
            ("Bus", "Autocarro / Ônibus", "I take the bus to school."),
            ("Train", "Trem", "She goes to work by train."),
            ("Taxi", "Táxi", "He usually takes a taxi to the airport."),
            ("Car", "Carro", "We go by car on weekends."),
            ("Bike", "Bicicleta", "They ride their bikes in the park."),
            ("Subway", "Metrô", "The subway is the fastest way to travel."),
            ("Plane", "Avião", "I travel by plane for long distances."),
            ("Boat", "Barco", "Tourists go by boat on the river."),
            ("Truck", "Caminhão", "The truck carries goods."),
        ]

        for i, (word, translation, example) in enumerate(transport_vocab, 1):
            VocabularyItem.objects.create(
                topic=transport_topic,
                word=word,
                translation=translation,
                example_sentence=example,
                order=i
            )

        ExampleBox.objects.create(
            topic=transport_topic,
            title="🚦 How to talk about transport",
            content="Use 'by' for transportation: by car, by bus, by train, by plane.\nExample: I go to work by bus.",
            box_type="tip",
            order=1
        )

        # Grammar Topic: Giving Directions
        directions_topic = Topic.objects.create(
            theme=theme2,
            title="Giving Directions",
            topic_type="grammar",
            icon="🧭",
            description="Learn how to ask and give directions politely.",
            order=2,
            is_active=True
        )

        grammar_content2 = GrammarContent.objects.create(
            topic=directions_topic,
            title="Useful Expressions",
            explanation=(
                "🔹 Go straight ahead.\n"
                "🔹 Turn left / right.\n"
                "🔹 It’s next to / across from / behind / in front of.\n"
                "🔹 How can I get to...? = Como posso chegar a...?"
            ),
            order=1
        )

        ExampleBox.objects.create(
            topic=directions_topic,
            title="🗺️ Example Dialogue",
            content=(
                "A: Excuse me, how can I get to the post office?\n"
                "B: Go straight ahead and turn right. It’s next to the bank."
            ),
            box_type="example",
            order=1
        )

        # === THEME 3: Social Interactions ===
        theme3 = Theme.objects.create(
            unit=unit,
            title="Social Interactions in the City",
            icon="💬",
            order=3,
            is_active=True
        )

        # Speaking Topic
        speaking_topic = Topic.objects.create(
            theme=theme3,
            title="At a Restaurant",
            topic_type="speaking",
            icon="🍴",
            order=1,
            is_active=True
        )

        dialogue = DialogueContent.objects.create(
            topic=speaking_topic,
            title="🗣️ Dialogue – Ordering Food",
            context="A customer and a waiter at a restaurant.",
            order=1
        )

        lines = [
            ("Waiter", "Good evening! May I take your order?", "Boa noite! Posso anotar o seu pedido?"),
            ("Customer", "Yes, please. I’d like a chicken sandwich and a glass of juice.", "Sim, por favor. Eu gostaria de um sanduíche de frango e um copo de suco."),
            ("Waiter", "Anything else?", "Mais alguma coisa?"),
            ("Customer", "No, thank you.", "Não, obrigado."),
            ("Waiter", "Your order will be ready in a few minutes.", "Seu pedido ficará pronto em alguns minutos."),
        ]

        for i, (speaker, text, translation) in enumerate(lines, 1):
            DialogueLine.objects.create(
                dialogue=dialogue,
                speaker=speaker,
                text=text,
                translation=translation,
                order=i
            )

        self.stdout.write(self.style.SUCCESS('✅ Unit 4: At the City criada com sucesso!'))
