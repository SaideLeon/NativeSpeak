import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onStartClick: () => void;
  onLegalLinkClick: (doc: 'privacy' | 'terms') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onStartClick,
  onLegalLinkClick,
}) => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1>Destrave sua Fluência em Inglês com Inteligência Artificial.</h1>
        <p>
          Pratique conversação, receba feedback instantâneo e fale com
          confiança. Seu tutor de inglês particular, disponível 24/7.
        </p>
        <button className="hero-cta-button" onClick={onStartClick}>
          Comece a Praticar Agora
        </button>
      </section>

      <section className="features-section">
        <h2>Por que escolher o NativeSpeak?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="icon">record_voice_over</span>
            <h3>Conversação Realista</h3>
            <p>
              Diálogos dinâmicos com uma IA que entende e responde como um
              falante nativo.
            </p>
          </div>
          <div className="feature-card">
            <span className="icon">rule</span>
            <h3>Feedback Instantâneo</h3>
            <p>
              Receba correções de pronúncia e gramática em tempo real para
              acelerar seu aprendizado.
            </p>
          </div>
          <div className="feature-card">
            <span className="icon">work</span>
            <h3>Cenários do Dia a Dia</h3>
            <p>
              Pratique para entrevistas de emprego, viagens ou conversas
              casuais. Você escolhe o tema.
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2>Como Funciona?</h2>
        <div className="how-it-works-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <span className="icon">person_add</span>
            <h3>Cadastre-se</h3>
            <p>
              Crie sua conta gratuitamente em segundos para salvar seu
              progresso.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <span className="icon">checklist</span>
            <h3>Escolha um Cenário</h3>
            <p>
              Selecione um tópico de conversação que te interessa para começar a
              praticar.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <span className="icon">mic</span>
            <h3>Comece a Falar</h3>
            <p>
              Pressione o microfone e converse em inglês. A IA cuidará do
              resto.
            </p>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <h2>Escolha o Plano Ideal para Você</h2>
        <p className="pricing-subtitle">
          Comece com 50 créditos grátis ao se registrar. Sem compromisso.
        </p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Básico</h3>
            <div className="price">
              1.600 MZN <span>/ mês</span>
            </div>
            <ul className="plan-features">
              <li>
                <span className="icon">check_circle</span> 3.000 Créditos de
                Conversação
              </li>
              <li>
                <span className="icon">check_circle</span> Acesso a todos os
                cenários
              </li>
              <li>
                <span className="icon">check_circle</span> Feedback instantâneo
              </li>
            </ul>
            <button className="plan-button" onClick={onStartClick}>
              Começar
            </button>
          </div>
          <div className="pricing-card popular">
            <div className="popular-badge">MAIS POPULAR</div>
            <h3>Padrão</h3>
            <div className="price">
              4.500 MZN <span>/ mês</span>
            </div>
            <ul className="plan-features">
              <li>
                <span className="icon">check_circle</span> 10.000 Créditos de
                Conversação
              </li>
              <li>
                <span className="icon">check_circle</span> Acesso a todos os
                cenários
              </li>
              <li>
                <span className="icon">check_circle</span> Feedback instantâneo
              </li>
              <li>
                <span className="icon">check_circle</span> Suporte prioritário
              </li>
            </ul>
            <button className="plan-button" onClick={onStartClick}>
              Começar
            </button>
          </div>
          <div className="pricing-card">
            <h3>Premium</h3>
            <div className="price">
              7.000 MZN <span>/ mês</span>
            </div>
            <ul className="plan-features">
              <li>
                <span className="icon">check_circle</span> 20.000 Créditos de
                Conversação
              </li>
              <li>
                <span className="icon">check_circle</span> Acesso a todos os
                cenários
              </li>
              <li>
                <span className="icon">check_circle</span> Feedback instantâneo
              </li>
              <li>
                <span className="icon">check_circle</span> Suporte prioritário
              </li>
            </ul>
            <button className="plan-button" onClick={onStartClick}>
              Começar
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          &copy; {new Date().getFullYear()} NativeSpeak. Todos os direitos
          reservados.
        </p>
        <div className="footer-links">
          <a onClick={() => onLegalLinkClick('privacy')}>
            Política de Privacidade
          </a>
          <span>&bull;</span>
          <a onClick={() => onLegalLinkClick('terms')}>Termos de Uso</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
