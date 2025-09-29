import React, { useState, useEffect, useMemo } from 'react';
import { useUI } from '../lib/state';

interface TutorialStep {
  elementSelector?: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  requiresSidebar?: boolean;
}

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightedStyle, setHighlightedStyle] =
    useState<React.CSSProperties>({});
  const { isSidebarOpen, toggleSidebar } = useUI();

  const steps: TutorialStep[] = useMemo(
    () => [
      {
        title: 'Bem-vindo ao NativeSpeak!',
        content:
          'Este tour rápido irá guiá-lo pelas principais funcionalidades. Vamos começar a sua jornada para a fluência!',
        position: 'center',
      },
      {
        elementSelector: '.title-selector',
        title: '1. Escolha um Cenário',
        content:
          'Comece selecionando um cenário de prática. Isso ajusta o vocabulário e o contexto da conversa com a IA.',
        position: 'bottom',
      },
      {
        elementSelector: '.transcription-container',
        title: '2. Área da Conversa',
        content:
          'Suas conversas com o tutor de IA aparecerão aqui. Você poderá ver tanto a sua fala quanto as respostas da IA.',
        position: 'top',
      },
      {
        elementSelector: '.connect-toggle',
        title: '3. Inicie a Conexão',
        content:
          'Pressione o botão de play para iniciar a transmissão de áudio com a IA. Pressione pause para desconectar.',
        position: 'top',
      },
      {
        elementSelector: '.mic-button',
        title: '4. Fale!',
        content:
          'Este é o seu microfone. Mantenha-o ativo para falar. Clique nele para mutar ou desmutar durante uma sessão.',
        position: 'top',
      },
      {
        elementSelector: '.settings-button',
        title: '5. Ajuste as Configurações',
        content:
          'Clique neste ícone para abrir o painel de configurações, onde você pode mudar a voz da IA e ver suas metas.',
        position: 'left',
      },
      {
        elementSelector: '.todo-list-container',
        title: '6. Suas Metas de Estudo',
        content:
          'Acompanhe seu progresso! Adicione e gerencie suas metas de estudo para se manter motivado.',
        position: 'left',
        requiresSidebar: true,
      },
      {
        title: 'Você está pronto!',
        content:
          'É isso! Agora você conhece o básico. Pressione o botão de play e comece a praticar. Boa sorte!',
        position: 'center',
      },
    ],
    []
  );

  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (currentStep.requiresSidebar && !isSidebarOpen) {
      toggleSidebar();
    }

    if (currentStep.elementSelector) {
      const element = document.querySelector<HTMLElement>(
        currentStep.elementSelector
      );
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Wait for scroll to finish before getting rect
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setHighlightedStyle({
            width: rect.width + 16,
            height: rect.height + 16,
            top: rect.top - 8,
            left: rect.left - 8,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.7)',
            borderRadius: 'var(--radius-md)',
          });
        }, 300);
      } else {
        // If element not found, treat it like a centered step
        setHighlightedStyle({
          width: 0,
          height: 0,
          top: '50%',
          left: '50%',
          boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.7)',
        });
      }
    } else {
      setHighlightedStyle({
        width: 0,
        height: 0,
        top: '50%',
        left: '50%',
        boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.7)',
      });
    }
  }, [stepIndex, currentStep, isSidebarOpen, toggleSidebar]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleClose = () => {
    if (currentStep.requiresSidebar && isSidebarOpen) {
      toggleSidebar();
    }
    onClose();
  };

  const getTooltipStyle = (): React.CSSProperties => {
    if (!currentStep.elementSelector) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const element = document.querySelector<HTMLElement>(
      currentStep.elementSelector
    );
    if (!element) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = element.getBoundingClientRect();
    const style: React.CSSProperties = {
      position: 'absolute',
    };

    switch (currentStep.position) {
      case 'bottom':
        style.top = `${rect.bottom + 15}px`;
        style.left = `${rect.left + rect.width / 2}px`;
        style.transform = 'translateX(-50%)';
        break;
      case 'top':
        style.bottom = `${window.innerHeight - rect.top + 15}px`;
        style.left = `${rect.left + rect.width / 2}px`;
        style.transform = 'translateX(-50%)';
        break;
      case 'left':
        style.top = `${rect.top + rect.height / 2}px`;
        style.right = `${window.innerWidth - rect.left + 15}px`;
        style.transform = 'translateY(-50%)';
        break;
      case 'right':
        style.top = `${rect.top + rect.height / 2}px`;
        style.left = `${rect.right + 15}px`;
        style.transform = 'translateY(-50%)';
        break;
      default:
        break;
    }
    return style;
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-highlight" style={highlightedStyle}></div>
      <div className="tutorial-tooltip" style={getTooltipStyle()}>
        <h4>{currentStep.title}</h4>
        <p>{currentStep.content}</p>
        <div className="tutorial-nav">
          <button className="tutorial-skip-button" onClick={handleClose}>
            Pular Tutorial
          </button>
          <div className="tutorial-step-buttons">
            {stepIndex > 0 && <button onClick={handlePrev}>Anterior</button>}
            <button onClick={handleNext} className="tutorial-next-button">
              {stepIndex === steps.length - 1 ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>
        <div className="tutorial-dots">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === stepIndex ? 'active' : ''}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
